import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", orders: 12 },
  { day: "Tue", orders: 18 },
  { day: "Wed", orders: 24 },
  { day: "Thu", orders: 20 },
  { day: "Fri", orders: 35 },
  { day: "Sat", orders: 42 },
  { day: "Sun", orders: 30 },
];

// Calculate Summary
const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
const avgOrders = Math.round(totalOrders / data.length);
const peakDay = data.reduce((max, item) =>
  item.orders > max.orders ? item : max
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A2333] border border-slate-700 rounded-xl p-4 shadow-xl">
        <p className="text-slate-300 font-medium">{label}</p>

        <p className="text-orange-500 text-lg font-bold mt-2">
          {payload[0].value} Orders
        </p>
      </div>
    );
  }

  return null;
};

const OrdersChart = () => {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-bold text-white">
            Weekly Orders Trend
          </h2>

          <p className="text-slate-400 mt-1">
            Order analytics for the current week
          </p>
        </div>

        <span className="bg-orange-500/10 text-orange-400 px-4 py-2 rounded-xl text-sm">
          This Week
        </span>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="bg-[#1A2333] rounded-2xl p-4 border border-white/5">
          <p className="text-slate-400 text-sm">
            Total Orders
          </p>

          <h3 className="text-3xl font-bold text-white mt-2">
            {totalOrders}
          </h3>
        </div>

        <div className="bg-[#1A2333] rounded-2xl p-4 border border-white/5">
          <p className="text-slate-400 text-sm">
            Average / Day
          </p>

          <h3 className="text-3xl font-bold text-white mt-2">
            {avgOrders}
          </h3>
        </div>

        <div className="bg-[#1A2333] rounded-2xl p-4 border border-white/5">
          <p className="text-slate-400 text-sm">
            Peak Day
          </p>

          <h3 className="text-3xl font-bold text-orange-500 mt-2">
            {peakDay.day}
          </h3>
        </div>

      </div>

      {/* Chart */}
      <div className="h-[350px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#1F2937"
            />

            <XAxis
              dataKey="day"
              tick={{ fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="orders"
              stroke="#FF7A00"
              strokeWidth={4}
              dot={{
                fill: "#FF7A00",
                r: 6,
              }}
              activeDot={{
                fill: "#FF7A00",
                r: 9,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default OrdersChart;