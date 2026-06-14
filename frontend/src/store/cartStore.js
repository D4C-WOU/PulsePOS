import { create } from "zustand";
import { calculatePromotionsApi } from "../api/promotion.api";

let debounceTimer = null;

const getCartTotals = (items, promotionDiscounts = {}, orderPromoDiscount = 0, couponDiscount = 0) => {
  const subtotal = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const taxAmount = items.reduce(
    (s, i) => s + i.unit_price * i.quantity * (i.tax_percentage / 100),
    0
  );
  const totalItemDiscounts = Object.values(promotionDiscounts).reduce(
    (s, d) => s + d.amount,
    0
  );
  const discountAmount = totalItemDiscounts + orderPromoDiscount + couponDiscount;
  const total = Math.max(0, subtotal + taxAmount - discountAmount);
  return { subtotal, taxAmount, discountAmount, total };
};

const runDebouncedCalculation = (get, set) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    const { items } = get();
    if (items.length === 0) {
      set({
        promotionDiscounts: {},
        orderPromoDiscount: 0,
        orderPromoName: null,
        subtotal: 0,
        taxAmount: 0,
        discountAmount: 0,
        total: 0,
      });
      get().persist();
      return;
    }
    
    try {
      const subtotal = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
      const payload = items.map(i => ({
        product_id: i.product_id,
        quantity: i.quantity,
        unit_price: i.unit_price,
      }));
      
      const res = await calculatePromotionsApi(payload, subtotal);
      if (res.success && res.data) {
        get().applyPromotions(res.data);
      }
    } catch (error) {
      console.error("Failed to calculate promotions:", error);
    }
    get().persist();
  }, 500);
};

export const useCartStore = create((set, get) => ({
  // State
  items: [], // [{ product_id, product_name, quantity, unit_price, tax_percentage, category_color, item_discount, line_total }]
  selectedTable: null, // { id, table_number, floor_id }
  activeOrderId: null, // null if new order, number if editing existing
  activeOrderNumber: null,
  customer: null, // { id, name, email, phone } or null
  couponCode: null,
  couponDiscount: 0,
  promotionDiscounts: {}, // { product_id: { amount, name } }
  orderPromoDiscount: 0,
  orderPromoName: null,
  searchQuery: "", // Shared search query

  // Totals State (Updated dynamically by actions)
  subtotal: 0,
  taxAmount: 0,
  discountAmount: 0,
  total: 0,

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  addItem: (product) => {
    const { items, promotionDiscounts, orderPromoDiscount, couponDiscount } = get();
    const existing = items.find((i) => i.product_id === product.id);
    let updatedItems;

    if (existing) {
      updatedItems = items.map((i) =>
        i.product_id === product.id
          ? {
              ...i,
              quantity: i.quantity + 1,
              line_total: (i.quantity + 1) * i.unit_price - i.item_discount,
            }
          : i
      );
    } else {
      updatedItems = [
        ...items,
        {
          product_id: product.id,
          product_name: product.name,
          quantity: 1,
          unit_price: parseFloat(product.price),
          tax_percentage: parseFloat(product.tax_percentage || 0),
          category_color: product.category?.color || "#52B788",
          item_discount: 0,
          line_total: parseFloat(product.price),
        },
      ];
    }

    const totals = getCartTotals(updatedItems, promotionDiscounts, orderPromoDiscount, couponDiscount);
    set({ items: updatedItems, ...totals });
    runDebouncedCalculation(get, set);
  },

  removeItem: (product_id) => {
    const { items, promotionDiscounts, orderPromoDiscount, couponDiscount } = get();
    const updatedItems = items.filter((i) => i.product_id !== product_id);
    const totals = getCartTotals(updatedItems, promotionDiscounts, orderPromoDiscount, couponDiscount);
    set({ items: updatedItems, ...totals });
    runDebouncedCalculation(get, set);
  },

  updateQuantity: (product_id, qty) => {
    const { items, promotionDiscounts, orderPromoDiscount, couponDiscount } = get();
    let updatedItems;

    if (qty <= 0) {
      updatedItems = items.filter((i) => i.product_id !== product_id);
    } else {
      updatedItems = items.map((i) =>
        i.product_id === product_id
          ? {
              ...i,
              quantity: qty,
              line_total: qty * i.unit_price - i.item_discount,
            }
          : i
      );
    }

    const totals = getCartTotals(updatedItems, promotionDiscounts, orderPromoDiscount, couponDiscount);
    set({ items: updatedItems, ...totals });
    runDebouncedCalculation(get, set);
  },

  setTable: (table) => {
    set({ selectedTable: table });
    get().persist();
  },

  setCustomer: (customer) => {
    set({ customer });
    get().persist();
  },

  applyCoupon: (code, discountAmount) => {
    const parsedDiscount = parseFloat(discountAmount);
    const totals = getCartTotals(get().items, get().promotionDiscounts, get().orderPromoDiscount, parsedDiscount);
    set({ couponCode: code, couponDiscount: parsedDiscount, ...totals });
    get().persist();
  },

  removeCoupon: () => {
    const totals = getCartTotals(get().items, get().promotionDiscounts, get().orderPromoDiscount, 0);
    set({ couponCode: null, couponDiscount: 0, ...totals });
    get().persist();
  },

  applyPromotions: (promotionResult) => {
    const { items, couponDiscount } = get();
    const itemPromos = promotionResult.item_discounts || [];
    
    const updatedItems = items.map((item) => {
      const promo = itemPromos.find((p) => p.product_id === item.product_id);
      const item_discount = promo ? parseFloat(promo.discount_amount) : 0;
      return {
        ...item,
        item_discount,
        line_total: item.unit_price * item.quantity - item_discount,
      };
    });

    const promotionDiscounts = Object.fromEntries(
      itemPromos.map((d) => [
        d.product_id,
        { amount: parseFloat(d.discount_amount), name: d.promotion_name },
      ])
    );
    const orderPromoDiscount = parseFloat(promotionResult.order_discount || 0);
    const orderPromoName = promotionResult.order_promotion_name || null;

    const totals = getCartTotals(updatedItems, promotionDiscounts, orderPromoDiscount, couponDiscount);

    set({
      items: updatedItems,
      promotionDiscounts,
      orderPromoDiscount,
      orderPromoName,
      ...totals,
    });
    get().persist();
  },

  loadOrder: (order) => {
    const formattedItems = order.items.map((i) => ({
      product_id: i.product_id,
      product_name: i.product_name,
      quantity: i.quantity,
      unit_price: parseFloat(i.unit_price),
      tax_percentage: parseFloat(i.tax_percentage),
      category_color: i.category_color || "#52B788",
      item_discount: parseFloat(i.item_discount || 0),
      line_total: parseFloat(i.line_total),
    }));

    const totals = getCartTotals(formattedItems, {}, 0, 0);

    set({
      items: formattedItems,
      selectedTable: order.table ? {
        id: order.table.id,
        table_number: order.table.table_number,
        seats: order.table.seats,
      } : null,
      activeOrderId: order.id,
      activeOrderNumber: order.order_number,
      customer: order.customer ? {
        id: order.customer.id,
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone,
      } : null,
      couponCode: order.coupon_code || null,
      couponDiscount: 0, 
      promotionDiscounts: {},
      orderPromoDiscount: 0,
      orderPromoName: null,
      ...totals,
    });

    runDebouncedCalculation(get, set);
  },

  clearCart: () => {
    set({
      items: [],
      activeOrderId: null,
      activeOrderNumber: null,
      customer: null,
      couponCode: null,
      couponDiscount: 0,
      promotionDiscounts: {},
      orderPromoDiscount: 0,
      orderPromoName: null,
      searchQuery: "",
      subtotal: 0,
      taxAmount: 0,
      discountAmount: 0,
      total: 0,
    });
    localStorage.removeItem("pos_cart");
  },

  persist: () => {
    const state = {
      items: get().items,
      selectedTable: get().selectedTable,
      activeOrderId: get().activeOrderId,
      activeOrderNumber: get().activeOrderNumber,
      customer: get().customer,
      couponCode: get().couponCode,
      couponDiscount: get().couponDiscount,
      promotionDiscounts: get().promotionDiscounts,
      orderPromoDiscount: get().orderPromoDiscount,
      orderPromoName: get().orderPromoName,
    };
    localStorage.setItem("pos_cart", JSON.stringify(state));
  },

  restore: () => {
    const saved = localStorage.getItem("pos_cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const totals = getCartTotals(
          parsed.items || [],
          parsed.promotionDiscounts || {},
          parsed.orderPromoDiscount || 0,
          parsed.couponDiscount || 0
        );
        set({ ...parsed, ...totals });
        // re-run calculation on restore to sync
        runDebouncedCalculation(get, set);
      } catch (e) {
        console.error("Error restoring cart state:", e);
      }
    }
  },
}));

export default useCartStore;
