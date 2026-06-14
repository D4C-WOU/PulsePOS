import React from "react";
import EmptyState from "./EmptyState";
import Spinner from "./Spinner";

export const DataTable = ({
  headers = [],
  data = [],
  isLoading = false,
  emptyMessage = "No data available",
  emptyIcon,
  onRowClick,
  className = "",
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className="py-12 rounded-2xl flex items-center justify-center"
        style={{
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border-light)",
        }}
      >
        <EmptyState message={emptyMessage} icon={emptyIcon} />
      </div>
    );
  }

  return (
    <div
      className={`overflow-x-auto w-full rounded-2xl ${className}`}
      style={{
        background: "var(--color-bg-card)",
        border: "1px solid var(--color-border-light)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
      }}
    >
      <table className="w-full text-left border-collapse">
        <thead>
          <tr
            style={{
              background: "linear-gradient(90deg, var(--color-bg-surface), var(--color-bg-hover))",
              borderBottom: "1px solid var(--color-border-light)",
            }}
          >
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-5 py-3.5 text-xs font-black uppercase tracking-widest"
                style={{ color: "var(--color-text-muted)" }}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rIdx) => (
            <tr
              key={rIdx}
              onClick={() => onRowClick && onRowClick(row)}
              className={`transition-all duration-150 ${onRowClick ? "cursor-pointer" : ""}`}
              style={{
                borderBottom: "1px solid rgba(46, 39, 32, 0.60)",
              }}
              onMouseOver={(e) => {
                if (onRowClick) e.currentTarget.style.background = "rgba(201, 151, 58, 0.04)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {headers.map((header, cIdx) => (
                <td
                  key={cIdx}
                  className="px-5 py-3.5 text-sm font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {header.render ? header.render(row, rIdx) : row[header.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
