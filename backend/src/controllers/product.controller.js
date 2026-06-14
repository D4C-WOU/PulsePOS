const { validationResult } = require("express-validator");
const pool = require("../config/db");

const getProducts = async (req, res, next) => {
  try {
    const { category_id, search, is_active } = req.query;
    
    let query = `
      SELECT p.id, p.name, p.price, p.unit_of_measure, p.tax_percentage, p.description, p.show_on_kds, p.is_active,
             c.id AS category_id, c.name AS category_name, c.color AS category_color
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE 1=1
    `;
    const params = [];

    if (category_id) {
      query += " AND p.category_id = ?";
      params.push(category_id);
    }

    if (search) {
      query += " AND p.name LIKE ?";
      params.push(`%${search}%`);
    }

    // Handle is_active. Default is true.
    if (is_active === "false") {
      query += " AND p.is_active = FALSE";
    } else if (is_active === "all") {
      // no filter
    } else {
      query += " AND p.is_active = TRUE";
    }

    query += " ORDER BY p.name ASC";

    const [rows] = await pool.query(query, params);

    // Format response to nest category details
    const formattedProducts = rows.map((row) => ({
      id: row.id,
      name: row.name,
      price: parseFloat(row.price),
      unit_of_measure: row.unit_of_measure,
      tax_percentage: parseFloat(row.tax_percentage),
      description: row.description,
      show_on_kds: !!row.show_on_kds,
      is_active: !!row.is_active,
      category: row.category_id
        ? {
            id: row.category_id,
            name: row.category_name,
            color: row.category_color,
          }
        : null,
    }));

    res.status(200).json({
      success: true,
      data: formattedProducts,
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
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
      category_id,
      price,
      unit_of_measure,
      tax_percentage,
      description,
      show_on_kds,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO products (name, category_id, price, unit_of_measure, tax_percentage, description, show_on_kds, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [
        name,
        category_id || null,
        price,
        unit_of_measure || "per piece",
        tax_percentage || 0.0,
        description || null,
        show_on_kds !== undefined ? show_on_kds : true,
      ]
    );

    // Fetch new product with joined category
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.price, p.unit_of_measure, p.tax_percentage, p.description, p.show_on_kds, p.is_active,
              c.id AS category_id, c.name AS category_name, c.color AS category_color
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.id = ?`,
      [result.insertId]
    );

    const product = rows[0];
    const formatted = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      unit_of_measure: product.unit_of_measure,
      tax_percentage: parseFloat(product.tax_percentage),
      description: product.description,
      show_on_kds: !!product.show_on_kds,
      is_active: !!product.is_active,
      category: product.category_id
        ? {
            id: product.category_id,
            name: product.category_name,
            color: product.category_color,
          }
        : null,
    };

    res.status(201).json({
      success: true,
      data: formatted,
      message: "Product created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
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
      category_id,
      price,
      unit_of_measure,
      tax_percentage,
      description,
      show_on_kds,
      is_active,
    } = req.body;

    const [exists] = await pool.query("SELECT id FROM products WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await pool.query(
      `UPDATE products 
       SET name = ?, category_id = ?, price = ?, unit_of_measure = ?, tax_percentage = ?, description = ?, show_on_kds = ?, is_active = ?
       WHERE id = ?`,
      [
        name,
        category_id || null,
        price,
        unit_of_measure,
        tax_percentage,
        description || null,
        show_on_kds !== undefined ? show_on_kds : true,
        is_active !== undefined ? is_active : true,
        id,
      ]
    );

    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.price, p.unit_of_measure, p.tax_percentage, p.description, p.show_on_kds, p.is_active,
              c.id AS category_id, c.name AS category_name, c.color AS category_color
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.id = ?`,
      [id]
    );

    const product = rows[0];
    const formatted = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      unit_of_measure: product.unit_of_measure,
      tax_percentage: parseFloat(product.tax_percentage),
      description: product.description,
      show_on_kds: !!product.show_on_kds,
      is_active: !!product.is_active,
      category: product.category_id
        ? {
            id: product.category_id,
            name: product.category_name,
            color: product.category_color,
          }
        : null,
    };

    res.status(200).json({
      success: true,
      data: formatted,
      message: "Product updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [exists] = await pool.query("SELECT id FROM products WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Soft delete product
    await pool.query("UPDATE products SET is_active = FALSE WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Product soft-deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
