import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import FloorLayout from "../components/tables/FloorLayout";
import { useRealtimeStore } from "../store/realtimeStore";

const statusLabel = {
  free: "Free",
  occupied: "Occupied",
  payment_pending: "Payment Pending",
};

const nextStatus = {
  free: "occupied",
  occupied: "payment_pending",
  payment_pending: "free",
};

export default function TableSelection() {
  const tables = useRealtimeStore((s) => s.tables);
  const updateTableStatus = useRealtimeStore((s) => s.updateTableStatus);

  const [selectedTableId, setSelectedTableId] = useState(null);

  const selectedTable = useMemo(
    () => tables.find((t) => t.id === selectedTableId) || null,
    [tables, selectedTableId]
  );

  const handleTableSelect = (table) => {
    setSelectedTableId(table.id);
  };

  const handleCycleStatus = () => {
    if (!selectedTable) return;
    updateTableStatus(selectedTable.id, nextStatus[selectedTable.status]);
  };

  const handleSetFree = () => {
    if (!selectedTable) return;
    updateTableStatus(selectedTable.id, "free");
  };

  const handleSetOccupied = () => {
    if (!selectedTable) return;
    updateTableStatus(selectedTable.id, "occupied");
  };

  const handleSetPaymentPending = () => {
    if (!selectedTable) return;
    updateTableStatus(selectedTable.id, "payment_pending");
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-100 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl backdrop-blur-md lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-orange-400">
              Member 4
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-50">
              Table Selection
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Floor layout with live status colors for free, occupied, and
              payment pending tables.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">
              Green = Free
            </span>
            <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-orange-300">
              Orange = Occupied
            </span>
            <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-rose-300">
              Red = Payment Pending
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.7fr_0.9fr]">
          <FloorLayout
            floorName="Floor A"
            tables={tables}
            selectedTableId={selectedTableId}
            onSelectTable={handleTableSelect}
          />

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-md"
          >
            <h2 className="text-xl font-semibold text-slate-50">
              Table Controls
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Use this panel for demo updates even without backend support.
            </p>

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              {selectedTable ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-lg font-bold text-slate-50">
                      {selectedTable.id}
                    </div>
                    <div className="mt-1 text-sm text-slate-400">
                      Table #{selectedTable.number} • Seats {selectedTable.seats}
                    </div>
                  </div>

                  <div className="inline-flex rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                    Status: {statusLabel[selectedTable.status]}
                  </div>

                  <div className="grid gap-2">
                    <button
                      onClick={handleCycleStatus}
                      className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-400"
                    >
                      Cycle Status
                    </button>
                    <button
                      onClick={handleSetFree}
                      className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                    >
                      Mark Free
                    </button>
                    <button
                      onClick={handleSetOccupied}
                      className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/20"
                    >
                      Mark Occupied
                    </button>
                    <button
                      onClick={handleSetPaymentPending}
                      className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20"
                    >
                      Mark Payment Pending
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Select a table to manage it.
                </p>
              )}
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}