const { validationResult } = require("express-validator");
const pool = require("../config/db");

const getCategories = async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY name ASC");
    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { name, color } = req.body;

    // Check unique name
    const [exists] = await pool.query("SELECT id FROM categories WHERE name = ?", [name]);
    if (exists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Category name must be unique",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO categories (name, color) VALUES (?, ?)",
      [name, color || "#52B788"]
    );

    const [newCategory] = await pool.query("SELECT * FROM categories WHERE id = ?", [result.insertId]);

    res.status(201).json({
      success: true,
      data: newCategory[0],
      message: "Category created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
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
    const { name, color } = req.body;

    // Check if category exists
    const [exists] = await pool.query("SELECT id FROM categories WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check unique name excluding current category
    const [duplicate] = await pool.query(
      "SELECT id FROM categories WHERE name = ? AND id != ?",
      [name, id]
    );
    if (duplicate.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Another category with this name already exists",
      });
    }

    await pool.query(
      "UPDATE categories SET name = ?, color = ? WHERE id = ?",
      [name, color, id]
    );

    const [updated] = await pool.query("SELECT * FROM categories WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      data: updated[0],
      message: "Category updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [exists] = await pool.query("SELECT id FROM categories WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await pool.query("DELETE FROM categories WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
