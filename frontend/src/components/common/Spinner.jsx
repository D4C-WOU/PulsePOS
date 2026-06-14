import React from "react";

export const Spinner = ({ size = "md", color = "gold", className = "" }) => {
  const sizes = {
    xs: "w-3 h-3 border",
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  const colors = {
    gold:  "border-cafe-beige-mid/25 border-t-cafe-beige-warm",
    green: "border-cafe-green-mid/25 border-t-cafe-green-light",
    white: "border-white/20 border-t-white",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size] || sizes.md} ${colors[color] || colors.gold} rounded-full animate-spin`}
      />
    </div>
  );
};

export default Spinner;
