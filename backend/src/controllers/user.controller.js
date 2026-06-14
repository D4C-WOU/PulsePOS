const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const pool = require("../config/db");

const getUsers = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, is_active, created_at FROM users ORDER BY name ASC"
    );
    
    const users = rows.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      role: r.role,
      is_active: !!r.is_active,
      created_at: r.created_at,
    }));

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { name, email, password, role } = req.body;

    // Check unique email
    const [exists] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, TRUE)",
      [name, email, passwordHash, role]
    );

    const [newUser] = await pool.query(
      "SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      data: {
        ...newUser[0],
        is_active: !!newUser[0].is_active,
      },
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
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
    const { name, email, role } = req.body;

    const [exists] = await pool.query("SELECT id FROM users WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check unique email excluding current user
    const [duplicate] = await pool.query("SELECT id FROM users WHERE email = ? AND id != ?", [email, id]);
    if (duplicate.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use by another user",
      });
    }

    await pool.query(
      "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
      [name, email, role, id]
    );

    const [updated] = await pool.query(
      "SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?",
      [id]
    );

    res.status(200).json({
      success: true,
      data: {
        ...updated[0],
        is_active: !!updated[0].is_active,
      },
      message: "User updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
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
    const { new_password } = req.body;

    const [exists] = await pool.query("SELECT id FROM users WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const passwordHash = await bcrypt.hash(new_password, 12);
    await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [passwordHash, id]);

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleArchive = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [exists] = await pool.query("SELECT id, is_active FROM users WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Toggle active status
    const newActiveState = exists[0].is_active ? 0 : 1;
    await pool.query("UPDATE users SET is_active = ? WHERE id = ?", [newActiveState, id]);

    res.status(200).json({
      success: true,
      data: {
        id: parseInt(id),
        is_active: !!newActiveState,
      },
      message: newActiveState ? "User unarchived successfully" : "User archived successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [exists] = await pool.query("SELECT id FROM users WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has orders
    const [ordersCount] = await pool.query(
      "SELECT COUNT(*) AS count FROM orders WHERE employee_id = ?",
      [id]
    );

    if (ordersCount[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete user with existing orders. Archive instead.",
      });
    }

    await pool.query("DELETE FROM users WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  changePassword,
  toggleArchive,
  deleteUser,
};
