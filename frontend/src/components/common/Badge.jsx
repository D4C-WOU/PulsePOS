import React from "react";

const VARIANTS = {
  green:   { bg: "rgba(58, 140, 94, 0.12)",  border: "rgba(58, 140, 94, 0.30)",  text: "var(--color-green-light)" },
  red:     { bg: "rgba(224, 82, 82, 0.12)",   border: "rgba(224, 82, 82, 0.30)",  text: "var(--color-danger)" },
  yellow:  { bg: "rgba(245, 158, 11, 0.12)",  border: "rgba(245, 158, 11, 0.30)", text: "var(--color-warning)" },
  gold:    { bg: "rgba(201, 151, 58, 0.14)",  border: "rgba(201, 151, 58, 0.35)", text: "var(--color-beige-warm)" },
  blue:    { bg: "rgba(74, 144, 217, 0.12)",  border: "rgba(74, 144, 217, 0.30)", text: "var(--color-info)" },
  info:    { bg: "rgba(74, 144, 217, 0.12)",  border: "rgba(74, 144, 217, 0.30)", text: "var(--color-info)" },
  gray:    { bg: "rgba(92, 75, 55, 0.08)",    border: "var(--color-border)",      text: "var(--color-text-secondary)" },
  success: { bg: "rgba(58, 140, 94, 0.12)",   border: "rgba(58, 140, 94, 0.30)",  text: "var(--color-success)" },
  warning: { bg: "rgba(245, 158, 11, 0.12)",  border: "rgba(245, 158, 11, 0.30)", text: "var(--color-warning)" },
  danger:  { bg: "rgba(224, 82, 82, 0.12)",   border: "rgba(224, 82, 82, 0.30)",  text: "var(--color-danger)" },
};

export const Badge = ({ children, variant = "gray", className = "" }) => {
  const style = VARIANTS[variant] || VARIANTS.gray;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-widest ${className}`}
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.text,
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
