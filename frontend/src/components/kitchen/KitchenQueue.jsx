import { motion } from "framer-motion";

const orders = [
  {
    id: "#21",
    status: "Preparing",
  },
  {
    id: "#18",
    status: "To Cook",
  },
  {
    id: "#16",
    status: "Completed",
  },
  {
    id: "#14",
    status: "Preparing",
  },
  {
    id: "#12",
    status: "Completed",
  },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Preparing":
      return "bg-orange-500/20 text-orange-400";

    case "Completed":
      return "bg-green-500/20 text-green-400";

    case "To Cook":
      return "bg-blue-500/20 text-blue-400";

    default:
      return "bg-slate-500/20 text-slate-400";
  }
};

const KitchenQueue = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="
        rounded-3xl
        bg-[#111827]
        p-6
        border
        border-white/5
        shadow-xl
      "
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          Kitchen Queue
        </h2>

        <p className="text-slate-400 text-sm mt-1">
          Live kitchen order tracking
        </p>
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            whileHover={{ scale: 1.02 }}
            className="
              flex
              items-center
              justify-between
              p-4
              rounded-2xl
              bg-[#1A2333]
            "
          >
            <div>
              <h3 className="text-white font-medium">
                Order {order.id}
              </h3>

              <p className="text-slate-500 text-sm">
                Kitchen Task
              </p>
            </div>

            <span
              className={`
                px-3
                py-1
                rounded-full
                text-sm
                font-medium
                ${getStatusStyle(order.status)}
              `}
            >
              {order.status}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="flex justify-between">
          <span className="text-slate-400">
            Active Orders
          </span>

          <span className="text-white font-semibold">
            20
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default KitchenQueue;