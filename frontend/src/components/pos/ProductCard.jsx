import React from "react";
import { Plus } from "lucide-react";
import formatCurrency from "../../utils/formatCurrency";

export const ProductCard = ({ product, onAdd }) => {
  const catColor = product.category?.color || "var(--color-green-mid)";

  return (
    <button
      type="button"
      onClick={() => onAdd(product)}
      className="product-card text-left w-full group"
      id={`product-card-${product.id}`}
    >
      {/* Category color stripe */}
      <div
        className="h-1 w-full"
        style={{ background: catColor, opacity: 0.9 }}
      />

      {/* Card body */}
      <div className="p-3 flex flex-col gap-2">
        {/* Product name */}
        <p
          className="text-sm font-bold leading-tight line-clamp-2 group-hover:text-cafe-green-mid transition-colors"
          style={{ color: "var(--color-text-primary)" }}
        >
          {product.name}
        </p>

        {/* Category */}
        {product.category?.name && (
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--color-text-muted)" }}
          >
            {product.category.name}
          </span>
        )}

        {/* Price row */}
        <div className="flex items-end justify-between mt-auto pt-1">
          <div>
            <span
              className="text-base font-black"
              style={{
                background: "linear-gradient(135deg, var(--color-beige-warm), var(--color-beige-mid))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {formatCurrency(product.price)}
            </span>
            {product.tax_rate > 0 && (
              <span
                className="block text-[10px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                +{product.tax_rate}% GST
              </span>
            )}
          </div>

          {/* Add button */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
            style={{
              background: "linear-gradient(135deg, var(--color-green-mid), var(--color-green-dark))",
              color: "var(--color-beige-pale)",
              boxShadow: "0 2px 8px rgba(58, 140, 94, 0.30)",
            }}
          >
            <Plus size={14} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </button>
  );
};

export default ProductCard;
