import OrderCard from "./OrderCard";

export default function KitchenColumn({
  title,
  orders = [],
  onAccept = () => {},
  onPrepare = () => {},
  onComplete = () => {},
}) {
  return (
    <div className="flex min-h-[520px] flex-col rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
        <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">
          {orders.length}
        </span>
      </div>

      <div className="flex-1 space-y-4">
        {orders.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-700 text-sm text-slate-500">
            No orders
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={onAccept}
              onPrepare={onPrepare}
              onComplete={onComplete}
            />
          ))
        )}
      </div>
    </div>
  );
}