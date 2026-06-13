import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const orders = [
  {
    id: "#1001",
    customer: "John Doe",
    items: 3,
    total: "₹780",
    status: "Completed",
  },
  {
    id: "#1002",
    customer: "Emma Watson",
    items: 2,
    total: "₹450",
    status: "Preparing",
  },
  {
    id: "#1003",
    customer: "Rahul Patel",
    items: 5,
    total: "₹1,250",
    status: "Pending",
  },
  {
    id: "#1004",
    customer: "Sophia Lee",
    items: 1,
    total: "₹180",
    status: "Completed",
  },
  {
    id: "#1005",
    customer: "David Miller",
    items: 4,
    total: "₹920",
    status: "Cooking",
  },
];

const statusColor = {
  Completed: "bg-green-500/20 text-green-400",
  Pending: "bg-yellow-500/20 text-yellow-400",
  Preparing: "bg-blue-500/20 text-blue-400",
  Cooking: "bg-orange-500/20 text-orange-400",
};

const RecentOrders = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#111827] border border-white/5 rounded-3xl shadow-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Recent Orders
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            Latest customer orders
          </p>
        </div>

        <Link
          to="/orders"
          className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition"
        >
          View All
          <FiArrowRight />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">

          <thead>
            <tr className="border-b border-white/10 text-left">

              <th className="py-3 text-slate-400 font-medium">
                Order
              </th>

              <th className="py-3 text-slate-400 font-medium">
                Customer
              </th>

              <th className="py-3 text-slate-400 font-medium">
                Items
              </th>

              <th className="py-3 text-slate-400 font-medium">
                Total
              </th>

              <th className="py-3 text-slate-400 font-medium">
                Status
              </th>

            </tr>
          </thead>

          <tbody>

            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-white/5 hover:bg-[#1A2333] transition"
              >
                <td className="py-4 text-white font-medium">
                  {order.id}
                </td>

                <td className="py-4 text-slate-300">
                  {order.customer}
                </td>

                <td className="py-4 text-slate-300">
                  {order.items}
                </td>

                <td className="py-4 text-white font-semibold">
                  {order.total}
                </td>

                <td className="py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}

          </tbody>

        </table>
      </div>
    </motion.div>
  );
};

export default RecentOrders;