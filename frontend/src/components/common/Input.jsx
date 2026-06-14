import React, { forwardRef } from "react";

export const Input = forwardRef(
  (
    {
      label,
      type = "text",
      error,
      hint,
      className = "",
      wrapperClassName = "",
      icon: Icon,
      size = "md",
      ...props
    },
    ref
  ) => {
    const sizeMap = {
      sm: "py-1.5 text-xs",
      md: "py-2.5 text-sm",
      lg: "py-3 text-sm",
    };

    return (
      <div className={`flex flex-col gap-1.5 w-full ${wrapperClassName}`}>
        {label && (
          <label
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <span
              className="absolute left-3 pointer-events-none"
              style={{ color: "var(--color-text-muted)" }}
            >
              <Icon size={16} />
            </span>
          )}
          <input
            type={type}
            ref={ref}
            className={`w-full px-3 rounded-xl font-medium placeholder:text-cafe-text-muted transition-all ${sizeMap[size] || sizeMap.md} ${Icon ? "pl-9" : ""} ${className}`}
            style={{
              background: "var(--color-bg-input)",
              border: `1px solid ${error ? "var(--color-danger)" : "var(--color-border-light)"}`,
              color: "var(--color-text-primary)",
            }}
            {...props}
          />
        </div>
        {hint && !error && (
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {hint}
          </span>
        )}
        {error && (
          <span className="text-xs font-semibold" style={{ color: "var(--color-danger)" }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
