import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, User, Armchair, Ticket, FileText, Send, Save, Trash2, CreditCard, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";

import POSNavbar from "../../components/pos/POSNavbar";
import ProductCard from "../../components/pos/ProductCard";
import CartItem from "../../components/pos/CartItem";
import FloorPopup from "../../components/pos/FloorPopup";
import CustomerModal from "../../components/pos/CustomerModal";
import DiscountPopup from "../../components/pos/DiscountPopup";
import PaymentPanel from "../../components/pos/PaymentPanel";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import formatCurrency from "../../utils/formatCurrency";
import { getCategoriesApi } from "../../api/category.api";
import { getProductsApi } from "../../api/product.api";
import { createOrderApi, updateOrderApi, sendOrderToKdsApi } from "../../api/order.api";
import useCartStore from "../../store/cartStore";
import useSessionStore from "../../store/sessionStore";

export const POSMain = () => {
  const queryClient = useQueryClient();
  const session = useSessionStore((state) => state.session);

  // Cart Store State
  const cartItems = useCartStore((state) => state.items);
  const selectedTable = useCartStore((state) => state.selectedTable);
  const activeOrderId = useCartStore((state) => state.activeOrderId);
  const activeOrderNumber = useCartStore((state) => state.activeOrderNumber);
  const customer = useCartStore((state) => state.customer);
  const couponCode = useCartStore((state) => state.couponCode);
  const couponDiscount = useCartStore((state) => state.couponDiscount);
  const orderPromoDiscount = useCartStore((state) => state.orderPromoDiscount);
  const orderPromoName = useCartStore((state) => state.orderPromoName);
  
  // Computed values
  const subtotal = useCartStore((state) => state.subtotal);
  const taxAmount = useCartStore((state) => state.taxAmount);
  const discountAmount = useCartStore((state) => state.discountAmount);
  const total = useCartStore((state) => state.total);

  // Cart actions
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const setTable = useCartStore((state) => state.setTable);
  const setCustomer = useCartStore((state) => state.setCustomer);
  const clearCart = useCartStore((state) => state.clearCart);
  const restoreCart = useCartStore((state) => state.restore);

  // POS State
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [notes, setNotes] = useState("");
  const [search, setSearch] = useState("");

  // Modals state
  const [isFloorOpen, setIsFloorOpen] = useState(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Restore cart on mount
  useEffect(() => {
    restoreCart();
  }, [restoreCart]);

  // Fetch categories
  const { data: catRes } = useQuery({
    queryKey: ["pos_categories"],
    queryFn: getCategoriesApi,
  });

  const categories = catRes?.data || [];

  // Fetch products
  const { data: prodRes, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["pos_products", selectedCategoryId, search],
    queryFn: () =>
      getProductsApi({
        category_id: selectedCategoryId === "all" ? "" : selectedCategoryId,
        search,
      }),
  });

  const products = prodRes?.data || [];

  // Save Order Mutation
  const saveMutation = useMutation({
    mutationFn: (orderPayload) => {
      if (activeOrderId) {
        return updateOrderApi(activeOrderId, orderPayload);
      } else {
        return createOrderApi(orderPayload);
      }
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["active_session_orders"] });
      queryClient.invalidateQueries({ queryKey: ["floors_table_view"] });
      toast.success(
        activeOrderId
          ? "Check draft details updated!"
          : `New check draft registered: ${res.data.order_number}`
      );
      if (!activeOrderId && res.data) {
        // Update store with new order headers
        useCartStore.setState({
          activeOrderId: res.data.id,
          activeOrderNumber: res.data.order_number,
        });
        useCartStore.getState().persist();
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to save check draft");
    },
  });

  // Save order payload builder
  const buildOrderPayload = () => {
    if (!session?.id) {
      toast.error("No active POS session. Please open a session from the navbar first.");
      return null;
    }
    if (cartItems.length === 0) {
      toast.error("Cart is empty. Add items before saving.");
      return null;
    }
    return {
      session_id: session.id,
      table_id: selectedTable?.id || null,
      customer_id: customer?.id || null,
      coupon_code: couponCode || null,
      notes: notes || null,
      items: cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    };
  };

  const handleSaveDraft = () => {
    const payload = buildOrderPayload();
    if (!payload) return; // toast already shown inside buildOrderPayload
    saveMutation.mutate(payload);
  };

  // Kitchen router
  const handleSendToKitchen = async () => {
    const payload = buildOrderPayload();
    if (!payload) return; // toast already shown inside buildOrderPayload

    toast.loading("Routing check to kitchen...", { id: "kds-route" });
    try {
      let orderId = activeOrderId;
      if (!orderId) {
        // Save first
        const savedRes = await createOrderApi(payload);
        orderId = savedRes.data.id;
      } else {
        // Update first
        await updateOrderApi(orderId, payload);
      }

      // Route to kitchen
      await sendOrderToKdsApi(orderId);
      toast.success("Order sent to KDS successfully!", { id: "kds-route" });
      clearCart();
      setNotes("");
      queryClient.invalidateQueries({ queryKey: ["active_session_orders"] });
      queryClient.invalidateQueries({ queryKey: ["floors_table_view"] });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "KDS routing failed", {
        id: "kds-route",
      });
    }
  };

  // Launch checkout payments
  const handleCheckout = async () => {
    const payload = buildOrderPayload();
    if (!payload) return; // toast already shown inside buildOrderPayload

    // Save check details first so payment endpoints work on updated amounts
    toast.loading("Syncing check balances...", { id: "checkout-sync" });
    try {
      let orderId = activeOrderId;
      if (!orderId) {
        const savedRes = await createOrderApi(payload);
        orderId = savedRes.data.id;
        useCartStore.setState({
          activeOrderId: savedRes.data.id,
          activeOrderNumber: savedRes.data.order_number,
        });
        useCartStore.getState().persist();
      } else {
        await updateOrderApi(orderId, payload);
      }
      toast.dismiss("checkout-sync");
      setIsPaymentOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to sync check details", {
        id: "checkout-sync",
      });
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    setNotes("");
    queryClient.invalidateQueries({ queryKey: ["active_session_orders"] });
    queryClient.invalidateQueries({ queryKey: ["floors_table_view"] });
  };

  return (
    <div className="min-h-screen bg-cafe-bg-dark text-cafe-text-primary flex flex-col h-screen overflow-hidden">
      <POSNavbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Columns: Categories & Products Grid */}
        <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4">
          {/* Search bar & Category filter tabs */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between glass-panel p-3.5 rounded-2xl select-none shrink-0">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-[65%] pr-2 custom-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategoryId("all")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  selectedCategoryId === "all"
                    ? "bg-cafe-beige-mid text-[#1C1814] border-cafe-beige-mid shadow-lg scale-105"
                    : "bg-cafe-bg-surface/50 text-cafe-text-secondary border-cafe-border/50 hover:bg-cafe-bg-surface hover:text-cafe-beige-mid"
                }`}
              >
                All Menu
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all shrink-0 ${
                    selectedCategoryId === cat.id
                      ? "bg-cafe-beige-mid text-[#1C1814] border-cafe-beige-mid shadow-lg scale-105"
                      : "bg-cafe-bg-surface/50 text-cafe-text-secondary border-cafe-border/50 hover:bg-cafe-bg-surface hover:text-cafe-beige-mid"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Product search */}
            <div className="relative w-full md:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-cafe-text-muted pointer-events-none">
                <Search size={14} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu items..."
                className="w-full bg-cafe-bg-input text-cafe-text-primary placeholder:text-cafe-text-muted border border-cafe-border pl-8 pr-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-cafe-beige-mid text-xs"
              />
            </div>
          </div>

          {/* Products grid */}
          <div className="flex-grow overflow-y-auto pr-1 custom-scrollbar">
            {isLoadingProducts ? (
              <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-cafe-text-muted text-xs select-none">
                No active products match current classification filters.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={addItem}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Check Builder / Cart */}
        <div className="w-[380px] border-l border-cafe-border/50 glass-panel flex flex-col h-full overflow-hidden shrink-0 select-none">
          {/* Order Header: Table & Customer */}
          <div className="p-4 border-b border-cafe-border/50 flex flex-col gap-3 shrink-0">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-black text-cafe-beige-mid uppercase tracking-wide">
                {activeOrderNumber ? `Billing ${activeOrderNumber}` : "New Draft Check"}
              </h2>
              {activeOrderNumber && (
                <Badge variant="warning">Draft</Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Table assignment button */}
              <button
                type="button"
                onClick={() => setIsFloorOpen(true)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                  selectedTable
                    ? "bg-cafe-green-mid/15 text-cafe-green-light border-cafe-green-mid/40 hover:bg-cafe-green-mid/25"
                    : "bg-cafe-bg-input/60 text-cafe-text-secondary border-cafe-border/40 hover:bg-cafe-bg-surface hover:text-cafe-beige-mid"
                }`}
              >
                <Armchair size={15} />
                <span className="truncate">
                  {selectedTable ? `Table ${selectedTable.table_number}` : "Takeaway / Parcel"}
                </span>
              </button>

              {/* Customer assignment button */}
              <button
                type="button"
                onClick={() => setIsCustomerOpen(true)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                  customer
                    ? "bg-cafe-green-mid/15 text-cafe-green-light border-cafe-green-mid/40 hover:bg-cafe-green-mid/25"
                    : "bg-cafe-bg-input/60 text-cafe-text-secondary border-cafe-border/40 hover:bg-cafe-bg-surface hover:text-cafe-beige-mid"
                }`}
              >
                <User size={15} />
                <span className="truncate">
                  {customer ? customer.name : "Walk-in Guest"}
                </span>
              </button>
            </div>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
            {cartItems.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center text-cafe-text-muted py-16 opacity-60">
                <Trash2 size={40} className="mb-2" />
                <p className="text-xs font-semibold">Your check is empty.</p>
                <p className="text-[10px] mt-0.5">Select menu items from the left grid.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItem
                  key={item.product_id}
                  item={item}
                  onUpdateQty={updateQuantity}
                  onRemove={removeItem}
                />
              ))
            )}
          </div>

          {/* Cart footer: Notes, coupons, financial summaries & actions */}
          <div className="border-t border-cafe-border p-4 bg-cafe-bg-input/30 flex flex-col gap-4.5 shrink-0">
            {/* Notes & Coupon codes */}
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-cafe-text-muted pointer-events-none">
                  <FileText size={13} />
                </span>
                <input
                  type="text"
                  placeholder="Notes for kitchen..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-cafe-bg-input text-cafe-text-primary placeholder:text-cafe-text-muted border border-cafe-border pl-8 pr-2.5 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-cafe-beige-mid text-xs"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsDiscountOpen(true)}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                  couponCode
                    ? "bg-cafe-green-mid/20 border-cafe-green-mid text-cafe-green-light"
                    : "bg-cafe-bg-card border-cafe-border text-cafe-beige-mid hover:bg-cafe-bg-input"
                }`}
              >
                <Ticket size={13} />
                <span>{couponCode ? couponCode : "Coupon"}</span>
              </button>
            </div>

            {/* Financial readout details */}
            <div className="flex flex-col gap-1.5 text-xs border-b border-cafe-border/50 pb-3">
              <div className="flex justify-between text-cafe-text-secondary">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-cafe-text-secondary">
                <span>GST (CGST + SGST)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex flex-col gap-0.5 text-cafe-danger">
                  <div className="flex justify-between">
                    <span>Discounts Applied</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                  {orderPromoName && (
                    <span className="text-[10px] text-cafe-text-muted italic">
                      * Auto promotion: {orderPromoName} (-{formatCurrency(orderPromoDiscount)})
                    </span>
                  )}
                  {couponCode && (
                    <span className="text-[10px] text-cafe-text-muted italic">
                      * Coupon: {couponCode} (-{formatCurrency(couponDiscount)})
                    </span>
                  )}
                </div>
              )}
              <div className="flex justify-between items-center font-black text-sm text-cafe-text-primary pt-2.5 border-t border-cafe-border/30 mt-1">
                <span>Total Net</span>
                <span className="text-base font-extrabold text-cafe-green-light">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Action buttons footer */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={cartItems.length === 0}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-cafe-border/60 hover:border-cafe-text-secondary bg-cafe-bg-surface/50 font-bold text-[10px] hover:bg-cafe-bg-surface text-cafe-text-secondary transition-all disabled:opacity-40"
              >
                <Save size={16} className="mb-1 text-cafe-beige-mid" />
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                onClick={handleSendToKitchen}
                disabled={cartItems.length === 0}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-cafe-border/60 hover:border-cafe-text-secondary bg-cafe-bg-surface/50 font-bold text-[10px] hover:bg-cafe-bg-surface text-cafe-text-secondary transition-all disabled:opacity-40"
              >
                <Send size={16} className="mb-1 text-cafe-green-light" />
                <span>Kitchen</span>
              </button>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-cafe-green-mid hover:bg-cafe-green-light text-[#FFFFFF] font-black text-[10px] transition-all disabled:opacity-40 shadow-lg shadow-cafe-green-mid/10"
              >
                <CreditCard size={16} className="mb-1" />
                <span>Checkout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floor tables selection modal */}
      <FloorPopup
        isOpen={isFloorOpen}
        onClose={() => setIsFloorOpen(false)}
        onSelectTable={setTable}
        currentTableId={selectedTable?.id}
      />

      {/* Customer linking modal */}
      <CustomerModal
        isOpen={isCustomerOpen}
        onClose={() => setIsCustomerOpen(false)}
        onSelect={setCustomer}
        selectedCustomerId={customer?.id}
      />

      {/* Coupons apply modal */}
      <DiscountPopup
        isOpen={isDiscountOpen}
        onClose={() => setIsDiscountOpen(false)}
      />

      {/* Checkout Payment modal */}
      {isPaymentOpen && (
        <PaymentPanel
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          orderId={activeOrderId}
          orderTotal={total}
          orderNumber={activeOrderNumber}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default POSMain;
