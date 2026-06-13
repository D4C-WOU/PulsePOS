import { useMemo } from "react";
import { motion } from "framer-motion";
import KitchenColumn from "../components/kitchen/KitchenColumn";
import { useRealtimeStore } from "../store/realtimeStore";
import { useSocket } from "../hooks/useSocket";
export default function KitchenDisplay() {
  const { connected, status } = useSocket(true);

  const orders = useRealtimeStore((s) => s.orders);
  const addOrder = useRealtimeStore((s) => s.addOrder);
  const acceptOrder = useRealtimeStore((s) => s.acceptOrder);
  const moveToPreparing = useRealtimeStore((s) => s.moveToPreparing);
  const moveToCompleted = useRealtimeStore((s) => s.moveToCompleted);
  const markPaymentSuccess = useRealtimeStore((s) => s.markPaymentSuccess);

  const grouped = useMemo(() => {
    return {
      toCook: orders.filter((o) => o.status === "to_cook"),
      preparing: orders.filter((o) => o.status === "preparing"),
      completed: orders.filter((o) => o.status === "completed"),
    };
  }, [orders]);

  const addDemoOrder = () => {
    const nextOrderNumber = Math.max(...orders.map((o) => o.orderNumber), 0) + 1;

    addOrder({
      id: `o-${Date.now()}`,
      orderNumber: nextOrderNumber,
      tableId: "T1",
      tableNumber: 1,
      customerName: "Demo Table",
      status: "to_cook",
      accepted: false,
      paymentStatus: "unpaid",
      items: [
        { name: "Burger", quantity: 2 },
        { name: "Coffee", quantity: 1 },
      ],
      createdAt: new Date().toISOString(),
    });
  };

  const acceptFirstToCook = () => {
    const first = grouped.toCook[0];
    if (first) acceptOrder(first.id);
  };

  const moveFirstToPreparing = () => {
    const first = grouped.toCook[0];
    if (first) moveToPreparing(first.id);
  };

  const completeFirstPreparing = () => {
    const first = grouped.preparing[0];
    if (first) moveToCompleted(first.id);
  };

  const markFirstCompletedPaid = () => {
    const first = grouped.completed[0];
    if (first) markPaymentSuccess(first.id);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-100 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl backdrop-blur-md lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-orange-400">
              Member 4
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-50">
              Kitchen Display
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Real-time kitchen board with fallback manual updates for the demo.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={[
                "rounded-full border px-3 py-1 text-xs font-semibold",
                connected
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-slate-700 bg-slate-950 text-slate-300",
              ].join(" ")}
            >
              Socket: {status}
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl backdrop-blur-md"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-50">
                Demo Controls
              </h2>
              <p className="text-sm text-slate-400">
                Use these buttons if socket is not connected yet.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={addDemoOrder}
                className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-orange-400"
              >
                Add Demo Order
              </button>
              <button
                onClick={acceptFirstToCook}
                className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20"
              >
                Accept First To Cook
              </button>
              <button
                onClick={moveFirstToPreparing}
                className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/20"
              >
                Move First To Preparing
              </button>
              <button
                onClick={completeFirstPreparing}
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
              >
                Complete First Preparing
              </button>
              <button
                onClick={markFirstCompletedPaid}
                className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20"
              >
                Mark First Completed Paid
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-5 xl:grid-cols-3">
          <KitchenColumn
            title="TO COOK"
            orders={grouped.toCook}
            onAccept={(order) => acceptOrder(order.id)}
            onPrepare={(order) => moveToPreparing(order.id)}
            onComplete={(order) => moveToCompleted(order.id)}
          />
          <KitchenColumn
            title="PREPARING"
            orders={grouped.preparing}
            onAccept={(order) => acceptOrder(order.id)}
            onPrepare={(order) => moveToPreparing(order.id)}
            onComplete={(order) => moveToCompleted(order.id)}
          />
          <KitchenColumn
            title="COMPLETED"
            orders={grouped.completed}
            onAccept={(order) => acceptOrder(order.id)}
            onPrepare={(order) => moveToPreparing(order.id)}
            onComplete={(order) => moveToCompleted(order.id)}
          />
        </div>
      </div>
    </div>
  );
}