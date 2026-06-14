import React from "react";
import { useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const PAGE_MAP = {
  "/dashboard":       { title: "Dashboard & Reports",    icon: "📊" },
  "/products":        { title: "Products Catalog",        icon: "☕" },
  "/categories":      { title: "Menu Categories",         icon: "🏷️" },
  "/payment-methods": { title: "Payment Methods",         icon: "💳" },
  "/floors":          { title: "Floors & Tables",         icon: "🗺️" },
  "/coupons":         { title: "Coupon Management",       icon: "🎫" },
  "/promotions":      { title: "Discounts & Promotions",  icon: "%" },
  "/users":           { title: "Staff Accounts",          icon: "👥" },
};

export const TopBar = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const pageInfo = Object.entries(PAGE_MAP).find(([key]) =>
    location.pathname.includes(key)
  );
  const { title = "Odoo Cafe POS", icon = "☕" } = pageInfo?.[1] || {};

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "A";

  return (
    <header
      className="h-14 fixed top-0 right-0 flex items-center justify-between px-6 z-10 select-none"
      style={{
        left: "220px",
        background: "linear-gradient(90deg, var(--color-bg-card) 0%, var(--color-bg-deep) 100%)",
        borderBottom: "1px solid var(--color-border)",
        boxShadow: "0 1px 0 rgba(201, 151, 58, 0.04)",
      }}
    >
      {/* Page title */}
      <div className="flex items-center gap-2.5">
        <span className="text-base">{icon}</span>
        <h2
          className="text-base font-black tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          {title}
        </h2>
      </div>

      {/* User chip */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p
            className="text-xs font-bold leading-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            {user?.name || "Admin"}
          </p>
          <p
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)" }}
          >
            {user?.role || "admin"}
          </p>
        </div>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black"
          style={{
            background: "linear-gradient(135deg, var(--color-beige-warm), var(--color-beige-mid))",
            color: "#12100e",
            boxShadow: "0 2px 8px rgba(201, 151, 58, 0.30)",
          }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
