import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiCalendar,
  FiCreditCard,
  FiUser,
} from "react-icons/fi";

const initialOrders = [
  {
    id: "#1021",
    table: "Table 5",
    amount: 899,
    status: "Completed",
    date: "12 Jun 2026",
    customer: "Rahul Shah",
  },
  {
    id: "#1022",
    table: "Table 2",
    amount: 450,
    status: "Preparing",
    date: "12 Jun 2026",
    customer: "Priya Patel",
  },
  {
    id: "#1023",
    table: "Table 7",
    amount: 1299,
    status: "Paid",
    date: "11 Jun 2026",
    customer: "Amit Mehta",
  },
  {
    id: "#1024",
    table: "Table 3",
    amount: 699,
    status: "Cancelled",
    date: "11 Jun 2026",
    customer: "Neha Joshi",
  },
];

const Orders = () => {
  const [search, setSearch] = useState("");

  const filteredOrders = initialOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.table.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-400";

      case "Preparing":
        return "bg-orange-500/20 text-orange-400";

      case "Paid":
        return "bg-blue-500/20 text-blue-400";

      case "Cancelled":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0B1120] p-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Order History
        </h1>

        <p className="text-slate-400 mt-2">
          Track restaurant orders and transactions
        </p>
      </div>

      {/* Search */}
      <div
        className="
          bg-[#111827]
          rounded-3xl
          border border-white/5
          shadow-xl
          p-4
          flex items-center
          mb-8
        "
      >
        <FiSearch className="text-slate-500" />

        <input
          type="text"
          placeholder="Search by order, table or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            bg-transparent
            ml-3
            w-full
            outline-none
            text-white
            placeholder:text-slate-500
          "
        />
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.05,
            }}
            whileHover={{
              scale: 1.02,
            }}
            className="
              bg-[#111827]
              rounded-3xl
              border border-white/5
              shadow-xl
              p-6
            "
          >
            {/* Top */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {order.id}
                </h2>

                <p className="text-slate-400 mt-1">
                  {order.table}
                </p>
              </div>

              <span
                className={`
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  font-medium
                  ${getStatusColor(order.status)}
                `}
              >
                {order.status}
              </span>
            </div>

            {/* Customer */}
            <div className="mt-6 flex items-center gap-3">
              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-[#1A2333]
                  flex
                  items-center
                  justify-center
                "
              >
                <FiUser className="text-slate-300" />
              </div>

              <div>
                <p className="text-slate-500 text-sm">
                  Customer
                </p>

                <p className="text-white font-medium">
                  {order.customer}
                </p>
              </div>
            </div>

            {/* Amount */}
            <div
              className="
                mt-6
                bg-[#1A2333]
                rounded-2xl
                p-4
              "
            >
              <div className="flex items-center gap-2">
                <FiCreditCard className="text-[#FF7A00]" />

                <span className="text-slate-400 text-sm">
                  Amount
                </span>
              </div>

              <h3 className="text-3xl font-bold text-white mt-2">
                ₹{order.amount}
              </h3>
            </div>

            {/* Date */}
            <div className="mt-4 flex items-center gap-2 text-slate-400">
              <FiCalendar />

              <span>{order.date}</span>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/5">
              <button
                className="
                  w-full
                  bg-[#FF7A00]
                  hover:bg-orange-600
                  py-3
                  rounded-2xl
                  text-white
                  font-medium
                  transition-all
                "
              >
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center mt-24">
          <h3 className="text-2xl font-semibold text-white">
            No Orders Found
          </h3>

          <p className="text-slate-500 mt-2">
            Try another search term.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Orders;