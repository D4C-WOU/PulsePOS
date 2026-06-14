const { validationResult } = require("express-validator");
const pool = require("../config/db");

const getTables = async (req, res, next) => {
  try {
    const { floor_id } = req.query;
    
    let query = `
      SELECT t.*,
             EXISTS(SELECT 1 FROM orders o WHERE o.table_id = t.id AND o.status IN ('draft', 'sent_to_kds')) AS has_active_order
      FROM \`tables\` t
      WHERE 1=1
    `;
    const params = [];

    if (floor_id) {
      query += " AND t.floor_id = ?";
      params.push(floor_id);
    }

    query += " ORDER BY t.table_number";

    const [rows] = await pool.query(query, params);

    const tables = rows.map((row) => ({
      id: row.id,
      floor_id: row.floor_id,
      table_number: row.table_number,
      seats: row.seats,
      is_active: !!row.is_active,
      has_active_order: !!row.has_active_order,
    }));

    res.status(200).json({
      success: true,
      data: tables,
    });
  } catch (error) {
    next(error);
  }
};

const createTable = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { floor_id, table_number, seats, is_active } = req.body;

    // Check if floor exists
    const [floorExists] = await pool.query("SELECT id FROM floors WHERE id = ?", [floor_id]);
    if (floorExists.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Target floor does not exist",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO \`tables\` (floor_id, table_number, seats, is_active) VALUES (?, ?, ?, ?)",
      [floor_id, table_number, seats || 4, is_active !== undefined ? is_active : true]
    );

    const [newTable] = await pool.query("SELECT * FROM \`tables\` WHERE id = ?", [result.insertId]);

    res.status(201).json({
      success: true,
      data: {
        ...newTable[0],
        is_active: !!newTable[0].is_active,
        has_active_order: false,
      },
      message: "Table created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateTable = async (req, res, next) => {
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
    const { table_number, seats, is_active } = req.body;

    const [exists] = await pool.query("SELECT id FROM \`tables\` WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    await pool.query(
      "UPDATE \`tables\` SET table_number = ?, seats = ?, is_active = ? WHERE id = ?",
      [table_number, seats, is_active !== undefined ? is_active : true, id]
    );

    const [rows] = await pool.query(
      `SELECT t.*,
              EXISTS(SELECT 1 FROM orders o WHERE o.table_id = t.id AND o.status IN ('draft', 'sent_to_kds')) AS has_active_order
       FROM \`tables\` t
       WHERE t.id = ?`,
      [id]
    );

    const table = rows[0];

    res.status(200).json({
      success: true,
      data: {
        id: table.id,
        floor_id: table.floor_id,
        table_number: table.table_number,
        seats: table.seats,
        is_active: !!table.is_active,
        has_active_order: !!table.has_active_order,
      },
      message: "Table updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteTable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [exists] = await pool.query("SELECT id FROM \`tables\` WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    await pool.query("DELETE FROM \`tables\` WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Table deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTables,
  createTable,
  updateTable,
  deleteTable,
};
