const { validationResult } = require("express-validator");
const pool = require("../config/db");

const getFloors = async (req, res, next) => {
  try {
    const query = `
      SELECT f.id AS floor_id, f.name AS floor_name, f.created_at AS floor_created_at,
             t.id AS table_id, t.table_number, t.seats, t.is_active AS table_is_active,
             EXISTS(SELECT 1 FROM orders o WHERE o.table_id = t.id AND o.status IN ('draft', 'sent_to_kds')) AS has_active_order
      FROM floors f
      LEFT JOIN \`tables\` t ON t.floor_id = f.id
      ORDER BY f.id, t.table_number
    `;

    const [rows] = await pool.query(query);

    // Group tables by floor
    const floorsMap = {};
    for (const row of rows) {
      const { floor_id, floor_name, floor_created_at, table_id, table_number, seats, table_is_active, has_active_order } = row;
      
      if (!floorsMap[floor_id]) {
        floorsMap[floor_id] = {
          id: floor_id,
          name: floor_name,
          created_at: floor_created_at,
          tables: [],
        };
      }

      if (table_id) {
        floorsMap[floor_id].tables.push({
          id: table_id,
          table_number,
          seats,
          is_active: !!table_is_active,
          has_active_order: !!has_active_order,
        });
      }
    }

    const floors = Object.values(floorsMap);

    res.status(200).json({
      success: true,
      data: floors,
    });
  } catch (error) {
    next(error);
  }
};

const createFloor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { name } = req.body;

    const [result] = await pool.query("INSERT INTO floors (name) VALUES (?)", [name]);

    const [newFloor] = await pool.query("SELECT * FROM floors WHERE id = ?", [result.insertId]);

    res.status(201).json({
      success: true,
      data: {
        ...newFloor[0],
        tables: [],
      },
      message: "Floor created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateFloor = async (req, res, next) => {
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
    const { name } = req.body;

    const [exists] = await pool.query("SELECT id FROM floors WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Floor not found",
      });
    }

    await pool.query("UPDATE floors SET name = ? WHERE id = ?", [name, id]);

    const [updated] = await pool.query("SELECT * FROM floors WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      data: updated[0],
      message: "Floor updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteFloor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [exists] = await pool.query("SELECT id FROM floors WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Floor not found",
      });
    }

    // ON DELETE CASCADE handles deleting all tables under this floor
    await pool.query("DELETE FROM floors WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Floor and all associated tables deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFloors,
  createFloor,
  updateFloor,
  deleteFloor,
};
