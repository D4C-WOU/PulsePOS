const { validationResult } = require("express-validator");
const pool = require("../config/db");

const getCoupons = async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM coupons ORDER BY created_at DESC");
    const coupons = rows.map(r => ({
      id: r.id,
      code: r.code,
      discount_type: r.discount_type,
      discount_value: parseFloat(r.discount_value),
      is_active: !!r.is_active,
      created_at: r.created_at,
    }));
    
    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    next(error);
  }
};

const createCoupon = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    let { code, discount_type, discount_value, is_active } = req.body;
    code = code.trim().toUpperCase();

    // Check unique code
    const [exists] = await pool.query("SELECT id FROM coupons WHERE code = ?", [code]);
    if (exists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Coupon code must be unique",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO coupons (code, discount_type, discount_value, is_active) VALUES (?, ?, ?, ?)",
      [code, discount_type, discount_value, is_active !== undefined ? is_active : true]
    );

    const [newCoupon] = await pool.query("SELECT * FROM coupons WHERE id = ?", [result.insertId]);

    res.status(201).json({
      success: true,
      data: {
        ...newCoupon[0],
        discount_value: parseFloat(newCoupon[0].discount_value),
        is_active: !!newCoupon[0].is_active,
      },
      message: "Coupon created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateCoupon = async (req, res, next) => {
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
    let { code, discount_type, discount_value, is_active } = req.body;
    code = code.trim().toUpperCase();

    const [exists] = await pool.query("SELECT id FROM coupons WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    // Check duplicate code
    const [duplicate] = await pool.query("SELECT id FROM coupons WHERE code = ? AND id != ?", [code, id]);
    if (duplicate.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Another coupon with this code already exists",
      });
    }

    await pool.query(
      "UPDATE coupons SET code = ?, discount_type = ?, discount_value = ?, is_active = ? WHERE id = ?",
      [code, discount_type, discount_value, is_active !== undefined ? is_active : true, id]
    );

    const [updated] = await pool.query("SELECT * FROM coupons WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      data: {
        ...updated[0],
        discount_value: parseFloat(updated[0].discount_value),
        is_active: !!updated[0].is_active,
      },
      message: "Coupon updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [exists] = await pool.query("SELECT id FROM coupons WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    await pool.query("DELETE FROM coupons WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const validateCoupon = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { code, order_subtotal } = req.body;
    const cleanCode = code.trim().toUpperCase();
    const subtotal = parseFloat(order_subtotal);

    const [rows] = await pool.query(
      "SELECT * FROM coupons WHERE code = ? AND is_active = TRUE",
      [cleanCode]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired coupon",
      });
    }

    const coupon = rows[0];
    const val = parseFloat(coupon.discount_value);
    let discount_amount = 0;

    if (coupon.discount_type === "percentage") {
      discount_amount = Math.round(subtotal * (val / 100) * 100) / 100;
    } else {
      discount_amount = Math.min(val, subtotal);
    }

    res.status(200).json({
      success: true,
      data: {
        coupon: {
          id: coupon.id,
          code: coupon.code,
          discount_type: coupon.discount_type,
          discount_value: val,
        },
        discount_amount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
};
