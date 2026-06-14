import React from "react";

export const Toggle = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
}) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer select-none ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors ${
            checked ? "bg-cafe-green-mid" : "bg-cafe-bg-surface border border-cafe-border"
          }`}
        />
        <div
          className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-cafe-beige-light transition-transform ${
            checked ? "transform translate-x-5" : ""
          }`}
        />
      </div>
      {label && <span className="text-sm font-semibold text-cafe-text-secondary">{label}</span>}
    </label>
  );
};

export default Toggle;
