const pool = require("../config/db");

const getSessions = async (req, res, next) => {
  try {
    // Only admins should see all sessions list
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const query = `
      SELECT s.id, s.opened_at, s.closed_at, s.status, s.closing_total, u.name AS user_name
      FROM sessions s
      JOIN users u ON u.id = s.opened_by
      ORDER BY s.opened_at DESC
    `;
    const [rows] = await pool.query(query);

    const sessions = rows.map((r) => ({
      id: r.id,
      user_name: r.user_name,
      opened_at: r.opened_at,
      closed_at: r.closed_at,
      status: r.status,
      closing_total: r.closing_total ? parseFloat(r.closing_total) : 0.00,
    }));

    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

const getActiveSession = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, u.name AS opened_by_name 
       FROM sessions s
       JOIN users u ON u.id = s.opened_by
       WHERE s.status = 'open' 
       LIMIT 1`
    );

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    const s = rows[0];
    res.status(200).json({
      success: true,
      data: {
        id: s.id,
        opened_by: s.opened_by,
        opened_by_name: s.opened_by_name,
        opened_at: s.opened_at,
        closed_at: s.closed_at,
        closing_total: s.closing_total ? parseFloat(s.closing_total) : 0.00,
        status: s.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

const openSession = async (req, res, next) => {
  try {
    // Check if there is already an open session
    const [existing] = await pool.query(
      `SELECT s.*, u.name AS opened_by_name 
       FROM sessions s
       JOIN users u ON u.id = s.opened_by
       WHERE s.status = 'open' 
       LIMIT 1`
    );

    if (existing.length > 0) {
      const s = existing[0];
      return res.status(200).json({
        success: true,
        data: {
          id: s.id,
          opened_by: s.opened_by,
          opened_by_name: s.opened_by_name,
          opened_at: s.opened_at,
          closed_at: s.closed_at,
          closing_total: s.closing_total ? parseFloat(s.closing_total) : 0.00,
          status: s.status,
        },
        message: "An active POS session is already open",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO sessions (opened_by, status) VALUES (?, 'open')",
      [req.user.id]
    );

    const [newSession] = await pool.query(
      `SELECT s.*, u.name AS opened_by_name 
       FROM sessions s
       JOIN users u ON u.id = s.opened_by
       WHERE s.id = ?`,
      [result.insertId]
    );

    const s = newSession[0];

    res.status(201).json({
      success: true,
      data: {
        id: s.id,
        opened_by: s.opened_by,
        opened_by_name: s.opened_by_name,
        opened_at: s.opened_at,
        closed_at: s.closed_at,
        closing_total: 0.00,
        status: s.status,
      },
      message: "POS session opened successfully",
    });
  } catch (error) {
    next(error);
  }
};

const closeSession = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [exists] = await pool.query("SELECT * FROM sessions WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const session = exists[0];

    if (session.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "Session is already closed",
      });
    }

    // Verify session belongs to user or user is admin
    if (session.opened_by !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to close this session",
      });
    }

    // Calculate closing total of paid orders
    const [revenueRow] = await pool.query(
      "SELECT SUM(total) AS total_revenue FROM orders WHERE session_id = ? AND status = 'paid'",
      [id]
    );
    const totalRevenue = parseFloat(revenueRow[0].total_revenue || 0.00);

    // Count total paid orders
    const [ordersCountRow] = await pool.query(
      "SELECT COUNT(*) AS total_orders FROM orders WHERE session_id = ? AND status = 'paid'",
      [id]
    );
    const totalOrders = parseInt(ordersCountRow[0].total_orders || 0, 10);

    // Update session
    await pool.query(
      "UPDATE sessions SET closed_at = NOW(), status = 'closed', closing_total = ? WHERE id = ?",
      [totalRevenue, id]
    );

    const [updatedRows] = await pool.query("SELECT * FROM sessions WHERE id = ?", [id]);
    const updated = updatedRows[0];

    res.status(200).json({
      success: true,
      data: {
        session: {
          id: updated.id,
          opened_by: updated.opened_by,
          opened_at: updated.opened_at,
          closed_at: updated.closed_at,
          closing_total: parseFloat(updated.closing_total),
          status: updated.status,
        },
        summary: {
          total_orders: totalOrders,
          total_revenue: totalRevenue,
          closing_total: totalRevenue,
        },
      },
      message: "POS session closed successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSessions,
  getActiveSession,
  openSession,
  closeSession,
};
