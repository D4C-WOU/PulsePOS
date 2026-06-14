import React, { useEffect } from "react";
import { X } from "lucide-react";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnOverlayClick = true,
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm:   "max-w-sm",
    md:   "max-w-md",
    lg:   "max-w-lg",
    xl:   "max-w-2xl",
    "2xl": "max-w-4xl",
    full: "max-w-full m-4",
  };

  const handleBackdropClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(12, 10, 8, 0.80)" }}
      onClick={handleBackdropClick}
    >
      {/* Backdrop blur layer */}
      <div
        className="absolute inset-0"
        style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
      />

      <div
        className={`relative w-full ${sizeClasses[size] || sizeClasses.md} flex flex-col max-h-[90vh] overflow-hidden animate-scale-up`}
        style={{
          background: "linear-gradient(145deg, var(--color-bg-card), var(--color-bg-surface))",
          border: "1px solid rgba(201, 151, 58, 0.12)",
          borderRadius: "20px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.65), 0 1px 0 rgba(245,223,160,0.05) inset",
        }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{
            borderBottom: "1px solid var(--color-border-light)",
            background: "rgba(201, 151, 58, 0.03)",
          }}
        >
          <h2
            className="text-lg font-black tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: "var(--color-text-muted)" }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(224, 82, 82, 0.12)";
              e.currentTarget.style.color = "var(--color-danger)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-text-muted)";
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 px-6 py-5 overflow-y-auto" style={{ color: "var(--color-text-primary)" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
