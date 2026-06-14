import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Coffee,
  Tags,
  CreditCard,
  Map,
  Ticket,
  Percent,
  Users,
  Monitor,
  LogOut,
} from "lucide-react";
import useAuthStore from "../../store/authStore";

const menuItems = [
  { name: "Dashboard",        path: "/backend/dashboard",        icon: LayoutDashboard },
  { name: "Products",         path: "/backend/products",         icon: Coffee },
  { name: "Categories",       path: "/backend/categories",       icon: Tags },
  { name: "Payment Methods",  path: "/backend/payment-methods",  icon: CreditCard },
  { name: "Floors & Tables",  path: "/backend/floors",           icon: Map },
  { name: "Coupons",          path: "/backend/coupons",          icon: Ticket },
  { name: "Promotions",       path: "/backend/promotions",       icon: Percent },
  { name: "Users",            path: "/backend/users",            icon: Users },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "A";

  return (
    <aside
      className="w-[220px] h-screen fixed left-0 top-0 flex flex-col justify-between select-none z-20"
      style={{
        background: "linear-gradient(180deg, var(--color-bg-card) 0%, var(--color-bg-deep) 100%)",
        borderRight: "1px solid var(--color-border-light)",
      }}
    >
      {/* ── Header ──────────────────────────────── */}
      <div>
        <div
          className="flex items-center gap-3 px-5 py-5"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--color-green-mid), var(--color-green-dark))",
              border: "1px solid rgba(34, 96, 63, 0.2)",
              boxShadow: "0 4px 12px rgba(34, 96, 63, 0.15)",
            }}
          >
            ☕
          </div>
          <div>
            <div
              className="font-serif-brand text-sm font-black leading-tight"
              style={{
                background: "linear-gradient(135deg, var(--color-green-dark), var(--color-green-mid))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Odoo Cafe
            </div>
            <div
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "var(--color-text-muted)" }}
            >
              Admin Panel
            </div>
          </div>
        </div>

        {/* ── Nav Items ──────────────────────────── */}
        <nav className="flex flex-col gap-0.5 px-3 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                    isActive ? "active" : ""
                  } sidebar-nav-item`
                }
              >
                <Icon size={16} strokeWidth={2} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* ── Footer ──────────────────────────────── */}
      <div
        className="p-3 flex flex-col gap-2"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        {/* User info chip */}
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-1"
          style={{ background: "var(--color-bg-surface)" }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--color-beige-mid), var(--color-beige-dark))",
              color: "#12100e",
            }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <div
              className="text-xs font-bold truncate"
              style={{ color: "var(--color-text-primary)" }}
            >
              {user?.name || "Admin"}
            </div>
            <div
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              {user?.role || "admin"}
            </div>
          </div>
        </div>

        {/* Go to POS */}
        <button
          onClick={() => navigate("/pos")}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all duration-200 active:scale-95"
          style={{
            background: "linear-gradient(135deg, var(--color-green-mid), var(--color-green-dark))",
            color: "var(--color-beige-pale)",
            border: "1px solid rgba(96, 196, 138, 0.25)",
            boxShadow: "0 4px 12px rgba(58, 140, 94, 0.25)",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <Monitor size={14} />
          Go to POS Terminal
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl text-xs font-bold transition-colors duration-200"
          style={{ color: "var(--color-text-muted)" }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(224, 82, 82, 0.08)";
            e.currentTarget.style.color = "var(--color-danger)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--color-text-muted)";
          }}
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
