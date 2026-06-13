import { motion } from "framer-motion";
import {
  FiEye,
  FiTrash2,
} from "react-icons/fi";

const statusColors = {
  Pending: "bg-yellow-500/20 text-yellow-400",
  Preparing: "bg-blue-500/20 text-blue-400",
  Cooking: "bg-orange-500/20 text-orange-400",
  Ready: "bg-green-500/20 text-green-400",
  Completed: "bg-green-500/20 text-green-400",
  Cancelled: "bg-red-500/20 text-red-400",
};

const OrderTable = ({
  orders,
  onView,
  onDelete,
  onStatusChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#111827] border border-white/5 rounded-3xl shadow-xl overflow-hidden"
    >
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-[#1A2333]">

            <tr>

              <th className="text-left px-6 py-4 text-slate-400">
                Order ID
              </th>

              <th className="text-left px-6 py-4 text-slate-400">
                Customer
              </th>

              <th className="text-left px-6 py-4 text-slate-400">
                Items
              </th>

              <th className="text-left px-6 py-4 text-slate-400">
                Total
              </th>

              <th className="text-left px-6 py-4 text-slate-400">
                Payment
              </th>

              <th className="text-left px-6 py-4 text-slate-400">
                Status
              </th>

              <th className="text-left px-6 py-4 text-slate-400">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {orders.length > 0 ? (
              orders.map((order) => (

                <tr
                  key={order.id}
                  className="border-t border-white/5 hover:bg-[#1A2333] transition"
                >

                  <td className="px-6 py-5 text-white font-medium">
                    {order.id}
                  </td>

                  <td className="px-6 py-5 text-slate-300">
                    {order.customer}
                  </td>

                  <td className="px-6 py-5 text-slate-300">
                    {order.items.length}
                  </td>

                  <td className="px-6 py-5 text-orange-400 font-semibold">
                    ₹{order.total}
                  </td>

                  <td className="px-6 py-5 text-slate-300">
                    {order.payment}
                  </td>

                  <td className="px-6 py-5">

                    <select
                      value={order.status}
                      onChange={(e) =>
                        onStatusChange(order.id, e.target.value)
                      }
                      className={`px-3 py-2 rounded-xl border-0 outline-none font-medium ${statusColors[order.status]}`}
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Preparing">
                        Preparing
                      </option>

                      <option value="Cooking">
                        Cooking
                      </option>

                      <option value="Ready">
                        Ready
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>

                    </select>

                  </td>

                  <td className="px-6 py-5">

                    <div className="flex gap-3">

                      <button
                        onClick={() => onView(order)}
                        className="bg-blue-500 hover:bg-blue-600 h-10 w-10 rounded-xl flex items-center justify-center transition"
                      >
                        <FiEye className="text-white" />
                      </button>

                      <button
                        onClick={() => onDelete(order.id)}
                        className="bg-red-500 hover:bg-red-600 h-10 w-10 rounded-xl flex items-center justify-center transition"
                      >
                        <FiTrash2 className="text-white" />
                      </button>

                    </div>

                  </td>

                </tr>

              ))
            ) : (

              <tr>

                <td
                  colSpan="7"
                  className="text-center py-16 text-slate-400"
                >
                  No Orders Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>
    </motion.div>
  );
};

export default OrderTable;