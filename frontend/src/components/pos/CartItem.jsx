import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import formatCurrency from "../../utils/formatCurrency";

export const CartItem = ({ item, onUpdateQty, onRemove }) => {
  const lineSubtotal = item.unit_price * item.quantity;
  const hasDiscount = item.item_discount > 0;

  return (
    <div className="bg-cafe-bg-input/20 border border-cafe-border/50 rounded-xl p-3.5 flex items-center justify-between gap-4">
      {/* Category indicator circle & info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: item.category_color || "#52B788" }}
        />
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-cafe-text-primary text-sm truncate leading-snug">
            {item.product_name}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-cafe-text-muted">
              {formatCurrency(item.unit_price)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] bg-cafe-danger/10 text-cafe-danger border border-cafe-danger/20 px-1 py-0.2 rounded font-bold uppercase tracking-wide">
                Discount: -{formatCurrency(item.item_discount)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quantity adjustment & Pricing */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Qty selectors */}
        <div className="flex items-center bg-cafe-bg-card border border-cafe-border rounded-lg p-0.5 overflow-hidden">
          <button
            onClick={() => onUpdateQty(item.product_id, item.quantity - 1)}
            className="p-1 text-cafe-text-secondary hover:text-cafe-beige-mid hover:bg-cafe-bg-input rounded transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="px-2.5 font-bold text-cafe-text-primary text-xs select-none min-w-6 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQty(item.product_id, item.quantity + 1)}
            className="p-1 text-cafe-text-secondary hover:text-cafe-beige-mid hover:bg-cafe-bg-input rounded transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Line totals */}
        <div className="flex flex-col items-end min-w-20">
          <span className="font-bold text-cafe-text-primary text-sm leading-none">
            {formatCurrency(item.line_total)}
          </span>
          {hasDiscount && (
            <span className="text-[10px] text-cafe-text-muted line-through mt-0.5">
              {formatCurrency(lineSubtotal)}
            </span>
          )}
        </div>

        {/* Delete trigger */}
        <button
          onClick={() => onRemove(item.product_id)}
          className="text-cafe-text-muted hover:text-cafe-danger hover:bg-cafe-danger/10 p-1.5 rounded transition-all"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
