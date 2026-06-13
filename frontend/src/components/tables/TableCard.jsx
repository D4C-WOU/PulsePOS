import { motion } from "framer-motion";

const statusStyles = {
  free: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  occupied: "border-orange-500/40 bg-orange-500/10 text-orange-300",
  payment_pending: "border-rose-500/40 bg-rose-500/10 text-rose-300",
};

const statusDot = {
  free: "bg-emerald-400",
  occupied: "bg-orange-400",
  payment_pending: "bg-rose-400",
};

export default function TableCard({ table, selected, onClick }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={[
        "w-full rounded-2xl border p-4 text-left shadow-lg transition-all",
        "backdrop-blur-md",
        selected ? "ring-2 ring-orange-400" : "hover:border-slate-500/60",
        statusStyles[table.status],
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-slate-50">{table.id}</div>
          <div className="text-xs text-slate-400">Seats: {table.seats}</div>
        </div>
        <span className={`h-3 w-3 rounded-full ${statusDot[table.status]}`} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium capitalize">
          {table.status.replace("_", " ")}
        </span>
        <span className="text-xs text-slate-400">Table #{table.number}</span>
      </div>
    </motion.button>
  );
}