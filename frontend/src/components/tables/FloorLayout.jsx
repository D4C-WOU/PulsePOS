import TableCard from "./TableCard";

export default function FloorLayout({
  floorName = "Floor A",
  tables = [],
  selectedTableId = null,
  onSelectTable = () => {},
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-md">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">{floorName}</h2>
          <p className="text-sm text-slate-400">
            Tap a table to select it for the order.
          </p>
        </div>
        <div className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">
          Floor Plan
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            selected={selectedTableId === table.id}
            onClick={() => onSelectTable(table)}
          />
        ))}
      </div>
    </div>
  );
}