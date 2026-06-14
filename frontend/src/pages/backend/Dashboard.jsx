import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, FileDown, TrendingUp, ShoppingBag, CreditCard, Users as UsersIcon } from "lucide-react";

import BackendLayout from "../../components/backend/BackendLayout";
import Spinner from "../../components/common/Spinner";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";
import exportPDF from "../../utils/exportPDF";
import exportXLS from "../../utils/exportXLS";
import { getDashboardDataApi } from "../../api/report.api";

const CHART_COLORS = ["#52B788", "#2D6A4F", "#C9A96E", "#F0D9A0", "#1A3C34", "#FEFAE0", "#95D5B2", "#C9A96E"];

export const Dashboard = () => {
  const [period, setPeriod] = useState("week"); // today, week, month, custom
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filters = {
    period,
    ...(period === "custom" && startDate && { start_date: startDate }),
    ...(period === "custom" && endDate && { end_date: endDate }),
  };

  const { data: res, isLoading } = useQuery({
    queryKey: ["reports_dashboard", filters],
    queryFn: () => getDashboardDataApi(filters),
  });

  const dashboardData = res?.data || {
    summary: { total_orders: 0, revenue: 0, average_order_value: 0 },
    sales_trend: [],
    top_products: [],
    top_categories_table: [],
    top_orders: [],
  };

  const { summary, sales_trend, top_products, top_categories_table, top_orders } = dashboardData;

  const handleExportPDF = () => {
    // Generate sales trend table pdf
    const headers = ["Date", "Orders Count", "Daily Revenue"];
    const rows = sales_trend.map((item) => [
      formatDate(item.date, false),
      item.order_count.toString(),
      formatCurrency(item.revenue),
    ]);

    exportPDF({
      title: `Cafe Sales Trend Report (${period.toUpperCase()})`,
      headers,
      data: rows,
      filename: `sales_report_${period}_${new Date().toISOString().slice(0, 10)}.pdf`,
    });
  };

  const handleExportXLS = () => {
    // Generate top products xls
    const headers = ["Product Name", "Quantity Sold", "Total Revenue"];
    const rows = top_products.map((p) => [
      p.product_name,
      p.quantity_sold,
      p.revenue,
    ]);

    exportXLS({
      title: `Top Selling Products (${period.toUpperCase()})`,
      headers,
      data: rows,
      filename: `top_products_${period}_${new Date().toISOString().slice(0, 10)}.xlsx`,
    });
  };

  const pieData = top_categories_table.map((c) => ({
    name: c.category_name,
    value: parseFloat(c.revenue),
  }));

  return (
    <BackendLayout>
      <div className="flex flex-col gap-6 select-none">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-cafe-border pb-5">
          <div>
            <h1 className="text-2xl font-bold text-cafe-beige-mid">Reports & Dashboard</h1>
            <p className="text-sm text-cafe-text-muted">Analyze sales performance, category ratios, and top items</p>
          </div>

          {/* Filtering Actions */}
          <div className="flex items-center gap-3">
            <div className="flex glass-panel p-1 rounded-lg">
              <button
                onClick={() => setPeriod("today")}
                className={`px-3 py-1.5 text-xs font-semibold rounded ${
                  period === "today"
                    ? "bg-cafe-green-mid text-cafe-beige-light shadow"
                    : "text-cafe-text-secondary hover:text-cafe-beige-mid"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setPeriod("week")}
                className={`px-3 py-1.5 text-xs font-semibold rounded ${
                  period === "week"
                    ? "bg-cafe-green-mid text-cafe-beige-light shadow"
                    : "text-cafe-text-secondary hover:text-cafe-beige-mid"
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setPeriod("month")}
                className={`px-3 py-1.5 text-xs font-semibold rounded ${
                  period === "month"
                    ? "bg-cafe-green-mid text-cafe-beige-light shadow"
                    : "text-cafe-text-secondary hover:text-cafe-beige-mid"
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setPeriod("custom")}
                className={`px-3 py-1.5 text-xs font-semibold rounded ${
                  period === "custom"
                    ? "bg-cafe-green-mid text-cafe-beige-light shadow"
                    : "text-cafe-text-secondary hover:text-cafe-beige-mid"
                }`}
              >
                Custom
              </button>
            </div>

            {period === "custom" && (
              <div className="flex items-center gap-2 glass-panel-light px-3 py-1 rounded-lg">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-xs text-cafe-text-primary focus:outline-none"
                />
                <span className="text-cafe-text-muted text-xs">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-xs text-cafe-text-primary focus:outline-none"
                />
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleExportPDF}
                disabled={isLoading}
                title="Download Sales Trend PDF"
                className="flex items-center gap-1.5 px-3 py-2 bg-cafe-bg-surface/50 border border-cafe-border/50 hover:bg-cafe-bg-input text-xs font-semibold text-cafe-beige-mid rounded-lg transition-colors"
              >
                <FileDown size={14} /> PDF
              </button>
              <button
                onClick={handleExportXLS}
                disabled={isLoading}
                title="Download Top Products Excel"
                className="flex items-center gap-1.5 px-3 py-2 bg-cafe-bg-surface/50 border border-cafe-border/50 hover:bg-cafe-bg-input text-xs font-semibold text-cafe-beige-mid rounded-lg transition-colors"
              >
                <FileDown size={14} /> Excel
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="glass-panel p-5 rounded-xl flex items-center gap-4 relative overflow-hidden group">
                <div className="p-3.5 bg-cafe-green-mid/10 text-cafe-green-mid rounded-xl">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-xs font-medium text-cafe-text-muted uppercase tracking-wider">Total Sales</p>
                  <h3 className="text-2xl font-bold text-cafe-text-primary mt-1">
                    {formatCurrency(summary.revenue)}
                  </h3>
                </div>
                <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp size={100} />
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl flex items-center gap-4 relative overflow-hidden group">
                <div className="p-3.5 bg-cafe-beige-mid/10 text-cafe-beige-mid rounded-xl">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-xs font-medium text-cafe-text-muted uppercase tracking-wider">Total Paid Orders</p>
                  <h3 className="text-2xl font-bold text-cafe-text-primary mt-1">
                    {summary.total_orders}
                  </h3>
                </div>
                <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBag size={100} />
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl flex items-center gap-4 relative overflow-hidden group">
                <div className="p-3.5 bg-cafe-beige-mid/10 text-cafe-beige-mid rounded-xl">
                  <CreditCard size={24} />
                </div>
                <div>
                  <p className="text-xs font-medium text-cafe-text-muted uppercase tracking-wider">Avg Order Value</p>
                  <h3 className="text-2xl font-bold text-cafe-text-primary mt-1">
                    {formatCurrency(summary.average_order_value)}
                  </h3>
                </div>
                <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5 group-hover:scale-110 transition-transform duration-300">
                  <CreditCard size={100} />
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales Trend Line Chart */}
              <div className="lg:col-span-2 glass-panel p-5 rounded-xl">
                <h3 className="text-base font-bold text-cafe-beige-mid mb-4">Sales Trend</h3>
                <div className="h-72 w-full text-xs">
                  {sales_trend.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-cafe-text-muted">
                      No sales data within the chosen range.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sales_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#52B788" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#52B788" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1A3C34" vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#52B788" />
                        <YAxis tickLine={false} axisLine={false} stroke="#52B788" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#132A1E",
                            borderColor: "#1A3C34",
                            color: "#FEFAE0",
                            borderRadius: "8px",
                          }}
                          formatter={(value) => [formatCurrency(value), "Revenue"]}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#52B788"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorRevenue)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Category Sales Distribution */}
              <div className="glass-panel p-5 rounded-xl flex flex-col">
                <h3 className="text-base font-bold text-cafe-beige-mid mb-4">Category Ratios</h3>
                <div className="h-52 w-full flex items-center justify-center text-xs">
                  {pieData.length === 0 ? (
                    <span className="text-cafe-text-muted">No sales logged.</span>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#132A1E",
                            borderColor: "#1A3C34",
                            color: "#FEFAE0",
                            borderRadius: "8px",
                          }}
                          formatter={(value) => [formatCurrency(value), "Revenue"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                {/* Custom Legend */}
                <div className="mt-4 flex flex-col gap-2 overflow-y-auto max-h-36 pr-1 custom-scrollbar">
                  {top_categories_table.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                        />
                        <span className="text-cafe-text-secondary truncate max-w-32">{cat.category_name}</span>
                      </div>
                      <span className="text-cafe-text-muted font-medium">
                        {cat.percentage_of_total}% ({formatCurrency(cat.revenue)})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Grid: Top Products & Recent Large Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Selling Products List */}
              <div className="glass-panel p-5 rounded-xl">
                <h3 className="text-base font-bold text-cafe-beige-mid mb-4">Top 10 Selling Products</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-cafe-border text-cafe-text-secondary font-semibold">
                        <th className="py-2.5">Product Name</th>
                        <th className="py-2.5 text-center">Quantity Sold</th>
                        <th className="py-2.5 text-right">Revenue Generated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cafe-border/40">
                      {top_products.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-8 text-center text-cafe-text-muted">
                            No product sales logged.
                          </td>
                        </tr>
                      ) : (
                        top_products.map((item, idx) => (
                          <tr key={idx} className="hover:bg-cafe-bg-input/20 text-cafe-text-primary">
                            <td className="py-3 font-medium">{item.product_name}</td>
                            <td className="py-3 text-center font-bold text-cafe-beige-mid">
                              {item.quantity_sold}
                            </td>
                            <td className="py-3 text-right font-bold text-cafe-green-mid">
                              {formatCurrency(item.revenue)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top/Recent High Value Orders */}
              <div className="glass-panel p-5 rounded-xl">
                <h3 className="text-base font-bold text-cafe-beige-mid mb-4">Top 10 High Value Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-cafe-border text-cafe-text-secondary font-semibold">
                        <th className="py-2.5">Order No.</th>
                        <th className="py-2.5">Customer / Table</th>
                        <th className="py-2.5">Date</th>
                        <th className="py-2.5 text-right">Order Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cafe-border/40">
                      {top_orders.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-cafe-text-muted">
                            No paid orders found.
                          </td>
                        </tr>
                      ) : (
                        top_orders.map((order, idx) => (
                          <tr key={idx} className="hover:bg-cafe-bg-input/20 text-cafe-text-primary">
                            <td className="py-3 font-semibold">{order.order_number}</td>
                            <td className="py-3 text-cafe-text-secondary">
                              {order.customer_name} ({order.table_number})
                            </td>
                            <td className="py-3 text-cafe-text-muted">{formatDate(order.created_at)}</td>
                            <td className="py-3 text-right font-bold text-cafe-green-mid">
                              {formatCurrency(order.total)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </BackendLayout>
  );
};

export default Dashboard;
