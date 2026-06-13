import { motion } from "framer-motion";

const KitchenCard = ({
  orderId,
  table,
  items,
  status,
  time,
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Preparing":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";

      case "Ready":
        return "bg-green-500/10 text-green-500 border-green-500/20";

      case "Cooking":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";

      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="
        bg-[#111827]
        border border-slate-800
        rounded-3xl
        p-5
        shadow-lg
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">
            {orderId}
          </h3>

          <p className="text-slate-400 text-sm">
            {table}
          </p>
        </div>

        <span
          className={`
            px-3 py-1
            rounded-full
            text-xs
            font-semibold
            border
            ${getStatusStyles()}
          `}
        >
          {status}
        </span>
      </div>

      {/* Items */}
      <div className="mt-4">
        <h4 className="text-slate-300 text-sm mb-2">
          Items
        </h4>

        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="
                flex
                justify-between
                text-sm
                text-slate-400
              "
            >
              <span>{item.name}</span>
              <span>x{item.qty}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="
          mt-5
          pt-4
          border-t border-slate-800
          flex
          justify-between
          items-center
        "
      >
        <span className="text-slate-500 text-sm">
          {time}
        </span>

        <button
          className="
            bg-orange-500
            hover:bg-orange-600
            text-white
            px-4
            py-2
            rounded-xl
            text-sm
            font-medium
            transition
          "
        >
          Update
        </button>
      </div>
    </motion.div>
  );
};

export default KitchenCard;