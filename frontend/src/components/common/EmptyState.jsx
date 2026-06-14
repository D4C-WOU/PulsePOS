import React from "react";
import { Info } from "lucide-react";

export const EmptyState = ({
  title = "No Items Found",
  message = "There's nothing here yet.",
  icon: Icon = Info,
  actionButton,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
      <div className="w-16 h-16 rounded-full bg-cafe-bg-surface flex items-center justify-center text-cafe-text-secondary mb-4 border border-cafe-border">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-bold text-cafe-text-primary mb-1">{title}</h3>
      <p className="text-sm text-cafe-text-muted max-w-sm mb-6">{message}</p>
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
