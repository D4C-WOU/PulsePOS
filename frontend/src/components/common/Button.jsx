import React from "react";

export const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 select-none";

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-sm",
  };

  const variants = {
    primary:
      "bg-gradient-to-br from-cafe-green-mid to-cafe-green-dark text-cafe-beige-pale border border-cafe-green-mid/30 shadow-glow-green hover:from-[#4eae79] hover:to-[#2a6e47] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(58,140,94,0.35)]",
    gold:
      "bg-gradient-to-br from-cafe-beige-warm to-cafe-beige-mid text-[#12100e] border border-cafe-beige-mid/40 shadow-glow-gold hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(201,151,58,0.35)]",
    danger:
      "bg-cafe-danger text-white border border-red-500/30 hover:bg-red-600 hover:-translate-y-px shadow-md",
    ghost:
      "bg-transparent text-cafe-text-secondary hover:bg-cafe-bg-surface hover:text-cafe-text-primary border border-transparent",
    outline:
      "bg-transparent border border-cafe-border-light text-cafe-text-secondary hover:bg-cafe-bg-surface hover:text-cafe-green-mid hover:border-cafe-green-mid/50",
    subtle:
      "bg-cafe-bg-surface/60 text-cafe-text-secondary border border-cafe-border hover:bg-cafe-bg-hover hover:text-cafe-text-primary",
  };

  return (
    <button
      type={type}
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
