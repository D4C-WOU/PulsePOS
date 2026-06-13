import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

const AnalyticsCard = ({
  title,
  value,
  icon,
  trend = "+0%",
  positive = true,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="
        rounded-3xl
        bg-[#111827]
        p-6
        border
        border-white/5
        shadow-xl
        h-[140px]
        flex
        flex-col
        justify-between
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {value}
          </h2>
        </div>

        <div
          className="
            h-14
            w-14
            rounded-2xl
            bg-[#FF7A00]/10
            text-[#FF7A00]
            flex
            items-center
            justify-center
            text-2xl
          "
        >
          {icon}
        </div>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-2">
        {positive ? (
          <FiTrendingUp className="text-green-400" />
        ) : (
          <FiTrendingDown className="text-red-400" />
        )}

        <span
          className={`text-sm font-semibold ${
            positive
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {trend}
        </span>

        <span className="text-slate-500 text-sm">
          vs last week
        </span>
      </div>
    </motion.div>
  );
};

export default AnalyticsCard;