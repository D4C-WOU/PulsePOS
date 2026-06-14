import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, User, X } from "lucide-react";
import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";
import useSessionStore from "../../store/sessionStore";
import { useSession } from "../../hooks/useSession";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";
import Button from "../common/Button";

export const POSNavbar = ({ onOpenTableSelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const session = useSessionStore((state) => state.session);
  const selectedTable = useCartStore((state) => state.selectedTable);
  const searchQuery = useCartStore((state) => state.searchQuery);
  const setSearchQuery = useCartStore((state) => state.setSearchQuery);
  
  const { closeSession } = useSession();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set page search query to empty on unmount or navigation away from pos
  useEffect(() => {
    if (location.pathname !== "/pos") {
      setSearchQuery("");
    }
  }, [location.pathname, setSearchQuery]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCloseSessionClick = () => {
    setIsMenuOpen(false);
    setIsCloseModalOpen(true);
  };

  const handleConfirmCloseSession = async () => {
    if (!session) return;
    setIsSubmitting(true);
    try {
      const res = await closeSession(session.id);
      if (res.success && res.data) {
        setSessionSummary(res.data.summary);
        toast.success("POS session closed successfully");
      }
    } catch (err) {
      toast.error(err.message || "Failed to close session");
      setIsCloseModalOpen(false);
      setIsSubmitting(false);
    }
  };

  const handleFinishClosing = () => {
    setIsCloseModalOpen(false);
    setIsSubmitting(false);
    setSessionSummary(null);
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "S";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <nav className="h-16 glass-panel border-b border-cafe-border/50 flex items-center justify-between px-6 select-none relative z-30">
        {/* Left Logo */}
        <div className="flex items-center gap-2.5">
          <img src="/src/assets/logo.svg" className="w-8 h-8 object-contain" alt="Odoo Cafe Logo" />
          <h1 
            onClick={() => navigate("/pos")} 
            className="text-lg font-serif-brand font-black text-cafe-beige-mid hover:text-cafe-green-mid cursor-pointer transition-colors tracking-wide"
          >
            Odoo Cafe
          </h1>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink
            to="/pos"
            end
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                isActive
                  ? "bg-cafe-beige-mid text-cafe-bg-deep shadow-lg"
                  : "bg-cafe-bg-surface/60 text-cafe-text-secondary border border-cafe-border/20 hover:text-cafe-text-primary hover:bg-cafe-bg-surface"
              }`
            }
          >
            POS Order
          </NavLink>
          <NavLink
            to="/pos/orders"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                isActive
                  ? "bg-cafe-beige-mid text-cafe-bg-deep shadow-lg"
                  : "bg-cafe-bg-surface/60 text-cafe-text-secondary border border-cafe-border/20 hover:text-cafe-text-primary hover:bg-cafe-bg-surface"
              }`
            }
          >
            Orders
          </NavLink>
          <NavLink
            to="/pos/customers"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                isActive
                  ? "bg-cafe-beige-mid text-cafe-bg-deep shadow-lg"
                  : "bg-cafe-bg-surface/60 text-cafe-text-secondary border border-cafe-border/20 hover:text-cafe-text-primary hover:bg-cafe-bg-surface"
              }`
            }
          >
            Customers
          </NavLink>
          <NavLink
            to="/pos/table-view"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                isActive
                  ? "bg-cafe-beige-mid text-cafe-bg-deep shadow-lg"
                  : "bg-cafe-bg-surface/60 text-cafe-text-secondary border border-cafe-border/20 hover:text-cafe-text-primary hover:bg-cafe-bg-surface"
              }`
            }
          >
            Table View
          </NavLink>
        </div>

        {/* Middle Search & Right Actions */}
        <div className="flex items-center gap-4">
          {/* Search bar */}
          {location.pathname === "/pos" && (
            <div className="relative flex items-center">
              <span className="absolute left-3 text-cafe-text-muted">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-1.5 pl-9 pr-3 rounded-xl text-xs text-cafe-text-primary bg-cafe-bg-input border border-cafe-border focus:outline-none focus:ring-1 focus:ring-cafe-beige-mid transition-all w-40 focus:w-56 placeholder:text-cafe-text-muted"
              />
            </div>
          )}

          {/* Table Chip Indicator */}
          <button
            onClick={onOpenTableSelect}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cafe-green-mid bg-cafe-green-mid/10 text-cafe-text-secondary hover:bg-cafe-green-mid/20 hover:text-cafe-green-dark text-sm font-semibold transition-colors duration-200"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cafe-green-mid animate-pulse" />
            {selectedTable ? `Table ${selectedTable.table_number}` : "Takeaway"}
          </button>

          {/* User initials bubble */}
          <div className="relative group">
            <div className="w-10 h-10 rounded-full bg-cafe-green-dark border border-cafe-border flex items-center justify-center font-bold text-cafe-beige-pale shadow-md cursor-pointer">
              {getInitials(user?.name)}
            </div>
            {/* Tooltip */}
            <div className="absolute right-0 top-12 scale-0 group-hover:scale-100 bg-cafe-bg-surface text-cafe-text-primary text-xs font-semibold px-3 py-1.5 rounded border border-cafe-border shadow-lg transition-transform duration-150 whitespace-nowrap z-50">
              {user?.name} ({user?.role})
            </div>
          </div>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 rounded-lg text-cafe-text-secondary hover:bg-cafe-bg-surface hover:text-cafe-green-dark transition-colors"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Hamburger Dropdown Drawer */}
        {isMenuOpen && (
          <div className="absolute right-6 top-16 w-64 bg-cafe-bg-card border border-cafe-border rounded-lg shadow-2xl py-2 flex flex-col z-40 animate-scale-up">
            {user?.role === "admin" && (
              <>
                <div className="px-4 py-2 text-xs font-bold text-cafe-text-muted uppercase tracking-wider">
                  Admin Dashboard
                </div>
                <button
                  onClick={() => { setIsMenuOpen(false); navigate("/backend/dashboard"); }}
                  className="px-4 py-2 text-left text-sm text-cafe-text-secondary hover:text-cafe-text-primary hover:bg-cafe-bg-surface transition-colors"
                >
                  📊 Reports Dashboard
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); navigate("/backend/products"); }}
                  className="px-4 py-2 text-left text-sm text-cafe-text-secondary hover:text-cafe-text-primary hover:bg-cafe-bg-surface transition-colors"
                >
                  📦 Products CRUD
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); navigate("/backend/categories"); }}
                  className="px-4 py-2 text-left text-sm text-cafe-text-secondary hover:text-cafe-text-primary hover:bg-cafe-bg-surface transition-colors"
                >
                  🏷️ Categories CRUD
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); navigate("/backend/payment-methods"); }}
                  className="px-4 py-2 text-left text-sm text-cafe-text-secondary hover:text-cafe-text-primary hover:bg-cafe-bg-surface transition-colors"
                >
                  💳 Payment Methods
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); navigate("/backend/floors"); }}
                  className="px-4 py-2 text-left text-sm text-cafe-text-secondary hover:text-cafe-text-primary hover:bg-cafe-bg-surface transition-colors"
                >
                  🗺️ Floors & Tables
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); navigate("/backend/coupons"); }}
                  className="px-4 py-2 text-left text-sm text-cafe-text-secondary hover:text-cafe-text-primary hover:bg-cafe-bg-surface transition-colors"
                >
                  🎫 Coupon Management
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); navigate("/backend/promotions"); }}
                  className="px-4 py-2 text-left text-sm text-cafe-text-secondary hover:text-cafe-text-primary hover:bg-cafe-bg-surface transition-colors"
                >
                  % Promotion Management
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); navigate("/backend/users"); }}
                  className="px-4 py-2 text-left text-sm text-cafe-text-secondary hover:text-cafe-text-primary hover:bg-cafe-bg-surface transition-colors"
                >
                  👥 Users CRUD
                </button>
                <div className="border-t border-cafe-border my-1" />
              </>
            )}

            <button
              onClick={handleCloseSessionClick}
              className="px-4 py-2 text-left text-sm text-cafe-warning hover:bg-cafe-bg-surface font-semibold transition-colors"
            >
              🔒 Close Active Session
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-left text-sm text-cafe-danger hover:bg-cafe-bg-surface font-semibold transition-colors"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </nav>

      {/* Close Session Modal overlay */}
      <Modal
        isOpen={isCloseModalOpen}
        onClose={() => !isSubmitting && !sessionSummary && setIsCloseModalOpen(false)}
        title={sessionSummary ? "Session Closing Summary" : "Close Active POS Session"}
        size="md"
        closeOnOverlayClick={false}
      >
        {sessionSummary ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-cafe-text-secondary">
              The POS session has been closed successfully. Here is the summary of sales:
            </p>
            <div className="bg-cafe-green-pale/35 border border-cafe-green-mid/20 rounded-lg p-4 flex flex-col gap-2">
              <div className="flex justify-between border-b border-cafe-border/50 pb-2">
                <span className="text-sm font-semibold text-cafe-text-muted">Total Orders:</span>
                <span className="text-sm font-bold text-cafe-text-primary">{sessionSummary.total_orders}</span>
              </div>
              <div className="flex justify-between border-b border-cafe-border/50 pb-2">
                <span className="text-sm font-semibold text-cafe-text-muted">Total Revenue:</span>
                <span className="text-sm font-bold text-cafe-green-dark">₹{parseFloat(sessionSummary.total_revenue).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-sm font-semibold text-cafe-text-muted">Closing Total:</span>
                <span className="text-sm font-bold text-cafe-green-dark">₹{parseFloat(sessionSummary.closing_total).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleFinishClosing}>Done</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-center">
            <p className="text-sm text-cafe-text-secondary">
              Are you sure you want to close the active POS session? This will lock the cash register register, compute order summaries, and log you out.
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <Button 
                variant="ghost" 
                onClick={() => setIsCloseModalOpen(false)} 
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={handleConfirmCloseSession} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Closing Session..." : "Confirm Close"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default POSNavbar;
