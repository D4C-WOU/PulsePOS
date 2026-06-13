import { motion } from "framer-motion";

const statusBadge = {
  to_cook: "border-slate-600 bg-slate-800 text-slate-200",
  preparing: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
};

export default function OrderCard({
  order,
  onAccept = () => {},
  onComplete = () => {},
}){
  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-bold text-slate-50">
            Order #{order.orderNumber}
          </div>
          <div className="text-xs text-slate-400">
            Table {order.tableNumber} • {order.customerName || "Guest"}
          </div>
        </div>

        <span
          className={[
            "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider",
            statusBadge[order.status],
          ].join(" ")}
        >
          {order.status.replace("_", " ")}
        </span>
      </div>

      {order.accepted && (
        <div className="mt-3 inline-flex rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-medium text-sky-300">
          Accepted
        </div>
      )}

      <div className="mt-4 space-y-2">
        {order.items.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm"
          >
            <span className="text-slate-200">{item.name}</span>
            <span className="text-slate-400">x{item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {order.status === "to_cook" && (
          <button
            onClick={() => onAccept(order)}
            className="rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-orange-400"
          >
            Move To Preparing
          </button>
        )}

        {order.status === "preparing" && (
          <button
            onClick={() => onComplete(order)}
            className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Move To Completed
          </button>
        )}
      </div>
    </motion.div>
  );
}