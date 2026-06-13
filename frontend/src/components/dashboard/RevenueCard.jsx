import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

const RevenueCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="
        rounded-3xl
        bg-[#111827]
        p-8
        border
        border-white/5
        shadow-xl
      "
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Revenue Overview
          </h2>

          <p className="text-slate-400 mt-1">
            Weekly performance summary
          </p>
        </div>

        <div
          className="
            flex
            items-center
            gap-1
            text-green-400
            font-semibold
          "
        >
          <FiArrowUpRight />
          +12.5%
        </div>
      </div>

      {/* Main Revenue */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-white">
          ₹15,000
        </h1>

        <p className="text-slate-400 mt-2">
          Total revenue generated today
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="
            bg-[#1A2333]
            rounded-2xl
            p-4
          "
        >
          <p className="text-slate-400 text-sm">
            Orders Today
          </p>

          <h3 className="text-2xl font-bold text-white mt-2">
            43
          </h3>
        </div>

        <div
          className="
            bg-[#1A2333]
            rounded-2xl
            p-4
          "
        >
          <p className="text-slate-400 text-sm">
            Avg Order Value
          </p>

          <h3 className="text-2xl font-bold text-white mt-2">
            ₹349
          </h3>
        </div>
      </div>
    </motion.div>
  );
};

export default RevenueCard;