const { validationResult } = require("express-validator");
const pool = require("../config/db");

const getCustomers = async (req, res, next) => {
  try {
    const { search } = req.query;
    
    let query = "SELECT * FROM customers";
    const params = [];

    if (search) {
      query += " WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?";
      const searchWild = `%${search}%`;
      params.push(searchWild, searchWild, searchWild);
    }

    query += " ORDER BY name ASC";

    const [rows] = await pool.query(query, params);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

const createCustomer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { name, email, phone } = req.body;

    const [result] = await pool.query(
      "INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)",
      [name, email || null, phone || null]
    );

    const [newCustomer] = await pool.query("SELECT * FROM customers WHERE id = ?", [result.insertId]);

    res.status(201).json({
      success: true,
      data: newCustomer[0],
      message: "Customer created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
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
    const { name, email, phone } = req.body;

    const [exists] = await pool.query("SELECT id FROM customers WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await pool.query(
      "UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?",
      [name, email || null, phone || null, id]
    );

    const [updated] = await pool.query("SELECT * FROM customers WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      data: updated[0],
      message: "Customer updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [exists] = await pool.query("SELECT id FROM customers WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // ON DELETE SET NULL on orders.customer_id means we can directly delete this customer
    // and MySQL will automatically set customer_id = NULL on any orders referencing them.
    await pool.query("DELETE FROM customers WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
