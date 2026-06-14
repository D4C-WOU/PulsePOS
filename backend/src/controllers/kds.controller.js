const pool = require("../config/db");

const getTickets = async (req, res, next) => {
  try {
    const { stage, product_id, category_id, search, all } = req.query;
    const isAll = all === "true";

    let query = `
      SELECT kt.id AS ticket_id, kt.order_id, o.order_number, kt.stage, kt.sent_at,
             kip.id AS kds_item_id, kip.order_item_id, kip.is_completed,
             oi.product_name, oi.quantity,
             p.id AS product_id, c.id AS category_id, c.name AS category_name
      FROM kds_tickets kt
      JOIN orders o ON o.id = kt.order_id
      JOIN kds_item_progress kip ON kip.kds_ticket_id = kt.id
      JOIN order_items oi ON oi.id = kip.order_item_id
      JOIN products p ON p.id = oi.product_id
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE 1=1
    `;
    const params = [];

    // Default stage filter
    if (stage) {
      query += " AND kt.stage = ?";
      params.push(stage);
    } else if (!isAll) {
      query += " AND kt.stage IN ('to_cook', 'preparing')";
    }

    if (product_id) {
      query += " AND p.id = ?";
      params.push(product_id);
    }

    if (category_id) {
      query += " AND c.id = ?";
      params.push(category_id);
    }

    if (search) {
      query += " AND oi.product_name LIKE ?";
      params.push(`%${search}%`);
    }

    query += " ORDER BY kt.sent_at ASC";

    const [rows] = await pool.query(query, params);

    // Group by ticket
    const ticketsMap = {};
    for (const r of rows) {
      const {
        ticket_id,
        order_id,
        order_number,
        stage: ticketStage,
        sent_at,
        kds_item_id,
        order_item_id,
        is_completed,
        product_name,
        quantity,
        product_id: pId,
        category_id: catId,
        category_name: catName,
      } = r;

      if (!ticketsMap[ticket_id]) {
        ticketsMap[ticket_id] = {
          id: ticket_id,
          order_id,
          order_number,
          stage: ticketStage,
          sent_at,
          items: [],
        };
      }

      ticketsMap[ticket_id].items.push({
        kds_item_id,
        order_item_id,
        is_completed: !!is_completed,
        product_name,
        quantity,
        product_id: pId,
        category_id: catId,
        category_name: catName,
      });
    }

    const tickets = Object.values(ticketsMap);

    res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

const updateTicketStage = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const { stage } = req.body; // 'preparing' or 'completed'

    await connection.beginTransaction();

    const [exists] = await connection.query("SELECT * FROM kds_tickets WHERE id = ?", [id]);
    if (exists.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "KDS Ticket not found" });
    }

    const ticket = exists[0];

    // Validate: stage can only advance forward (to_cook -> preparing -> completed)
    const stagesOrder = ["to_cook", "preparing", "completed"];
    const currentIdx = stagesOrder.indexOf(ticket.stage);
    const newIdx = stagesOrder.indexOf(stage);

    if (newIdx <= currentIdx) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Invalid stage transition from ${ticket.stage} to ${stage}`,
      });
    }

    // UPDATE kds_tickets SET stage = ? WHERE id = ?
    await connection.query("UPDATE kds_tickets SET stage = ? WHERE id = ?", [stage, id]);

    // If advancing to 'completed', mark all items complete
    if (stage === "completed") {
      await connection.query("UPDATE kds_item_progress SET is_completed = TRUE WHERE kds_ticket_id = ?", [id]);
      await connection.query(
        "UPDATE order_items oi JOIN kds_item_progress kip ON kip.order_item_id = oi.id SET oi.kds_status = 'completed' WHERE kip.kds_ticket_id = ?",
        [id]
      );
    } else if (stage === "preparing") {
      await connection.query(
        "UPDATE order_items oi JOIN kds_item_progress kip ON kip.order_item_id = oi.id SET oi.kds_status = 'preparing' WHERE kip.kds_ticket_id = ?",
        [id]
      );
    }

    // Fetch order to get table_id
    const [orders] = await connection.query("SELECT table_id FROM orders WHERE id = ?", [ticket.order_id]);
    const tableId = orders[0] ? orders[0].table_id : null;

    await connection.commit();

    // Socket.io events
    const io = req.app.get("io");
    io.to("kds").emit("kds:stage_updated", {
      ticket_id: parseInt(id),
      order_id: ticket.order_id,
      new_stage: stage,
    });

    if (tableId) {
      io.to("pos").emit("table:status_changed", {
        table_id: tableId,
        has_active_order: stage !== "completed",
      });
    }

    res.status(200).json({
      success: true,
      message: `Ticket stage updated to ${stage}`,
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const updateItemCompletion = async (req, res, next) => {
  try {
    const { id } = req.params; // kds_item_id
    const { is_completed } = req.body;

    const [exists] = await pool.query("SELECT * FROM kds_item_progress WHERE id = ?", [id]);
    if (exists.length === 0) {
      return res.status(404).json({ success: false, message: "KDS item progress record not found" });
    }

    const val = is_completed ? 1 : 0;
    await pool.query("UPDATE kds_item_progress SET is_completed = ? WHERE id = ?", [val, id]);

    // Also update matching order_items.kds_status
    const progress = exists[0];
    const kdsStatus = is_completed ? "completed" : "preparing";
    await pool.query("UPDATE order_items SET kds_status = ? WHERE id = ?", [kdsStatus, progress.order_item_id]);

    const io = req.app.get("io");
    io.to("kds").emit("kds:item_updated", {
      kds_item_id: parseInt(id),
      is_completed: !!is_completed,
    });

    res.status(200).json({
      success: true,
      message: "KDS item completion status updated",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTickets,
  updateTicketStage,
  updateItemCompletion,
};
