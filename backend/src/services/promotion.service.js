const pool = require("../config/db");

/**
 * Calculates promotions for a given list of cart items and order subtotal.
 * @param {Array} items - Array of { product_id, quantity, unit_price }
 * @param {Number} subtotal - The subtotal of the cart
 */
const calculate = async (items, subtotal) => {
  const [promotions] = await pool.query(
    "SELECT * FROM promotions WHERE is_active = TRUE"
  );

  const itemDiscounts = [];
  const appliedPromotions = [];

  // 1. Process Product Promotions
  const productPromos = promotions.filter(p => p.promotion_type === "product");
  for (const item of items) {
    // Find matching product promotion
    const matchingPromo = productPromos.find(
      p => p.product_id === item.product_id && item.quantity >= p.min_quantity
    );
    
    if (matchingPromo) {
      let discountAmount = 0;
      const rate = parseFloat(matchingPromo.discount_value);
      const lineTotalBeforeDiscount = item.unit_price * item.quantity;
      
      if (matchingPromo.discount_type === "percentage") {
        discountAmount = Math.round(lineTotalBeforeDiscount * (rate / 100) * 100) / 100;
      } else {
        discountAmount = Math.min(rate, lineTotalBeforeDiscount);
      }

      if (discountAmount > 0) {
        itemDiscounts.push({
          product_id: item.product_id,
          discount_amount: discountAmount,
          promotion_name: matchingPromo.name,
        });
        appliedPromotions.push(matchingPromo.name);
      }
    }
  }

  // 2. Process Order Promotions
  const orderPromos = promotions.filter(
    p => p.promotion_type === "order" && subtotal >= parseFloat(p.min_order_amount)
  );

  let bestOrderDiscount = 0;
  let bestOrderPromoName = null;

  for (const promo of orderPromos) {
    let discountAmount = 0;
    const val = parseFloat(promo.discount_value);
    
    if (promo.discount_type === "percentage") {
      discountAmount = Math.round(subtotal * (val / 100) * 100) / 100;
    } else {
      discountAmount = Math.min(val, subtotal);
    }

    if (discountAmount > bestOrderDiscount) {
      bestOrderDiscount = discountAmount;
      bestOrderPromoName = promo.name;
    }
  }

  if (bestOrderDiscount > 0) {
    appliedPromotions.push(bestOrderPromoName);
  }

  return {
    item_discounts: itemDiscounts,
    order_discount: bestOrderDiscount,
    order_promotion_name: bestOrderPromoName,
    applied_promotions: appliedPromotions,
  };
};

module.exports = {
  calculate,
};
