const { validationResult } = require("express-validator");
const pool = require("../config/db");
const promotionService = require("../services/promotion.service");

const getPromotions = async (req, res, next) => {
  try {
    const query = `
      SELECT p.*, prod.name AS product_name
      FROM promotions p
      LEFT JOIN products prod ON prod.id = p.product_id
      ORDER BY p.created_at DESC
    `;
    const [rows] = await pool.query(query);

    const promotions = rows.map((r) => ({
      id: r.id,
      name: r.name,
      promotion_type: r.promotion_type,
      product_id: r.product_id,
      product_name: r.product_name || null,
      min_quantity: r.min_quantity,
      min_order_amount: r.min_order_amount ? parseFloat(r.min_order_amount) : null,
      discount_type: r.discount_type,
      discount_value: parseFloat(r.discount_value),
      is_active: !!r.is_active,
      created_at: r.created_at,
    }));

    res.status(200).json({
      success: true,
      data: promotions,
    });
  } catch (error) {
    next(error);
  }
};

const createPromotion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const {
      name,
      promotion_type,
      product_id,
      min_quantity,
      min_order_amount,
      discount_type,
      discount_value,
      is_active,
    } = req.body;

    // Validate type requirements
    if (promotion_type === "product") {
      if (!product_id || !min_quantity) {
        return res.status(400).json({
          success: false,
          message: "Product ID and Minimum Quantity are required for product-type promotions",
        });
      }
    } else if (promotion_type === "order") {
      if (min_order_amount === undefined || min_order_amount === null) {
        return res.status(400).json({
          success: false,
          message: "Minimum Order Amount is required for order-type promotions",
        });
      }
    }

    const [result] = await pool.query(
      `INSERT INTO promotions (name, promotion_type, product_id, min_quantity, min_order_amount, discount_type, discount_value, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        promotion_type,
        promotion_type === "product" ? product_id : null,
        promotion_type === "product" ? min_quantity : null,
        promotion_type === "order" ? min_order_amount : null,
        discount_type,
        discount_value,
        is_active !== undefined ? is_active : true,
      ]
    );

    const [newPromo] = await pool.query(
      `SELECT p.*, prod.name AS product_name
       FROM promotions p
       LEFT JOIN products prod ON prod.id = p.product_id
       WHERE p.id = ?`,
      [result.insertId]
    );

    const r = newPromo[0];
    const formatted = {
      id: r.id,
      name: r.name,
      promotion_type: r.promotion_type,
      product_id: r.product_id,
      product_name: r.product_name || null,
      min_quantity: r.min_quantity,
      min_order_amount: r.min_order_amount ? parseFloat(r.min_order_amount) : null,
      discount_type: r.discount_type,
      discount_value: parseFloat(r.discount_value),
      is_active: !!r.is_active,
      created_at: r.created_at,
    };

    res.status(201).json({
      success: true,
      data: formatted,
      message: "Promotion created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updatePromotion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const {
      name,
      promotion_type,
      product_id,
      min_quantity,
      min_order_amount,
      discount_type,
      discount_value,
      is_active,
    } = req.body;

    const [exists] = await pool.query("SELECT id FROM promotions WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Promotion not found",
      });
    }

    // Validate type requirements
    if (promotion_type === "product") {
      if (!product_id || !min_quantity) {
        return res.status(400).json({
          success: false,
          message: "Product ID and Minimum Quantity are required for product-type promotions",
        });
      }
    } else if (promotion_type === "order") {
      if (min_order_amount === undefined || min_order_amount === null) {
        return res.status(400).json({
          success: false,
          message: "Minimum Order Amount is required for order-type promotions",
        });
      }
    }

    await pool.query(
      `UPDATE promotions
       SET name = ?, promotion_type = ?, product_id = ?, min_quantity = ?, min_order_amount = ?, discount_type = ?, discount_value = ?, is_active = ?
       WHERE id = ?`,
      [
        name,
        promotion_type,
        promotion_type === "product" ? product_id : null,
        promotion_type === "product" ? min_quantity : null,
        promotion_type === "order" ? min_order_amount : null,
        discount_type,
        discount_value,
        is_active !== undefined ? is_active : true,
        id,
      ]
    );

    const [rows] = await pool.query(
      `SELECT p.*, prod.name AS product_name
       FROM promotions p
       LEFT JOIN products prod ON prod.id = p.product_id
       WHERE p.id = ?`,
      [id]
    );

    const r = rows[0];
    const formatted = {
      id: r.id,
      name: r.name,
      promotion_type: r.promotion_type,
      product_id: r.product_id,
      product_name: r.product_name || null,
      min_quantity: r.min_quantity,
      min_order_amount: r.min_order_amount ? parseFloat(r.min_order_amount) : null,
      discount_type: r.discount_type,
      discount_value: parseFloat(r.discount_value),
      is_active: !!r.is_active,
      created_at: r.created_at,
    };

    res.status(200).json({
      success: true,
      data: formatted,
      message: "Promotion updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deletePromotion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [exists] = await pool.query("SELECT id FROM promotions WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Promotion not found",
      });
    }

    await pool.query("DELETE FROM promotions WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Promotion deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const calculatePromotions = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { items, subtotal } = req.body;
    
    // items shape: [{ product_id, quantity, unit_price }]
    const calculation = await promotionService.calculate(items, parseFloat(subtotal));

    res.status(200).json({
      success: true,
      data: calculation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  calculatePromotions,
};
