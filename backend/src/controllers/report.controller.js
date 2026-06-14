const pool = require("../config/db");

const getDashboardData = async (req, res, next) => {
  try {
    const { period, start_date, end_date, employee_id, session_id, product_id } = req.query;

    let baseFilter = " AND o.status = 'paid'";
    const params = [];

    // Date range filters
    if (period === "today") {
      baseFilter += " AND DATE(o.created_at) = CURDATE()";
    } else if (period === "week") {
      baseFilter += " AND o.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    } else if (period === "month") {
      baseFilter += " AND o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
    } else if (period === "custom" && start_date && end_date) {
      baseFilter += " AND o.created_at BETWEEN ? AND ?";
      params.push(`${start_date} 00:00:00`, `${end_date} 23:59:59`);
    }

    // Optional filters
    if (employee_id) {
      baseFilter += " AND o.employee_id = ?";
      params.push(employee_id);
    }
    if (session_id) {
      baseFilter += " AND o.session_id = ?";
      params.push(session_id);
    }
    if (product_id) {
      baseFilter += " AND EXISTS(SELECT 1 FROM order_items oi WHERE oi.order_id = o.id AND oi.product_id = ?)";
      params.push(product_id);
    }

    // 1. Summary Query
    const summaryQuery = `
      SELECT COUNT(*) AS total_orders, 
             COALESCE(SUM(total), 0) AS revenue, 
             COALESCE(AVG(total), 0) AS average_order_value
      FROM orders o
      WHERE 1=1 ${baseFilter}
    `;
    const [summaryRows] = await pool.query(summaryQuery, params);
    const summary = {
      total_orders: parseInt(summaryRows[0].total_orders || 0, 10),
      revenue: parseFloat(summaryRows[0].revenue || 0.0),
      average_order_value: parseFloat(summaryRows[0].average_order_value || 0.0),
    };

    // 2. Sales Trend (daily grouping)
    const trendQuery = `
      SELECT DATE(o.created_at) AS date, 
             SUM(o.total) AS revenue, 
             COUNT(*) AS order_count
      FROM orders o
      WHERE 1=1 ${baseFilter}
      GROUP BY DATE(o.created_at)
      ORDER BY date ASC
    `;
    const [trendRows] = await pool.query(trendQuery, params);
    const sales_trend = trendRows.map((r) => ({
      date: r.date.toISOString().split("T")[0],
      revenue: parseFloat(r.revenue || 0.0),
      order_count: parseInt(r.order_count || 0, 10),
    }));

    // 3. Top Products
    // Since this joins order_items, we can append product_id directly if it is set.
    let productsFilter = baseFilter;
    const productsParams = [...params];
    if (product_id) {
      productsFilter += " AND oi.product_id = ?";
      productsParams.push(product_id);
    }

    const topProductsQuery = `
      SELECT oi.product_name, 
             SUM(oi.quantity) AS quantity_sold, 
             SUM(oi.line_total) AS revenue
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE 1=1 ${productsFilter}
      GROUP BY oi.product_name 
      ORDER BY revenue DESC 
      LIMIT 10
    `;
    const [productRows] = await pool.query(topProductsQuery, productsParams);
    const top_products = productRows.map((r) => ({
      product_name: r.product_name,
      quantity_sold: parseInt(r.quantity_sold || 0, 10),
      revenue: parseFloat(r.revenue || 0.0),
    }));

    // 4. Top Categories
    const topCategoriesQuery = `
      SELECT c.name AS category_name, 
             SUM(oi.line_total) AS revenue
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      JOIN categories c ON c.id = p.category_id
      WHERE 1=1 ${productsFilter}
      GROUP BY c.id, c.name 
      ORDER BY revenue DESC
    `;
    const [categoryRows] = await pool.query(topCategoriesQuery, productsParams);
    
    const totalCatRevenue = categoryRows.reduce((acc, curr) => acc + parseFloat(curr.revenue || 0), 0);
    
    const top_categories_table = categoryRows.map((r) => {
      const revenue = parseFloat(r.revenue || 0.0);
      const percentage_of_total = totalCatRevenue > 0 ? parseFloat(((revenue / totalCatRevenue) * 100).toFixed(2)) : 0.0;
      return {
        category_name: r.category_name,
        revenue,
        percentage_of_total,
      };
    });

    // 5. Top Orders
    const topOrdersQuery = `
      SELECT o.order_number, 
             cust.name AS customer_name, 
             t.table_number, 
             o.total, 
             o.created_at
      FROM orders o
      LEFT JOIN customers cust ON cust.id = o.customer_id
      LEFT JOIN \`tables\` t ON t.id = o.table_id
      WHERE 1=1 ${baseFilter}
      ORDER BY o.total DESC 
      LIMIT 10
    `;
    const [orderRows] = await pool.query(topOrdersQuery, params);
    const top_orders = orderRows.map((r) => ({
      order_number: r.order_number,
      customer_name: r.customer_name || "Walk-in",
      table_number: r.table_number || "Takeaway",
      total: parseFloat(r.total || 0.0),
      created_at: r.created_at,
    }));

    res.status(200).json({
      success: true,
      data: {
        summary,
        sales_trend,
        top_products,
        top_categories_table,
        top_orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData,
};
