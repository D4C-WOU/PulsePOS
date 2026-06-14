import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Play, CreditCard, Trash2, Printer, Mail, Calendar, User, Armchair, FileText } from "lucide-react";
import { toast } from "react-hot-toast";

import POSNavbar from "../../components/pos/POSNavbar";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import PaymentPanel from "../../components/pos/PaymentPanel";
import EmailReceiptModal from "../../components/pos/EmailReceiptModal";
import PrintableReceipt from "../../components/pos/PrintableReceipt";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";
import { getOrderByIdApi, sendOrderToKdsApi, deleteOrderApi } from "../../api/order.api";
import useCartStore from "../../store/cartStore";

export const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loadOrder = useCartStore((state) => state.loadOrder);

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingKds, setIsSendingKds] = useState(false);

  // Fetch full order details
  const { data: res, isLoading, refetch } = useQuery({
    queryKey: ["pos_order_detail", id],
    queryFn: () => getOrderByIdApi(id),
    enabled: !!id,
  });

  const order = res?.data;

  // Send to KDS Mutation
  const kdsMutation = useMutation({
    mutationFn: () => sendOrderToKdsApi(id),
    onSuccess: () => {
      toast.success("Order sent to KDS successfully!");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["pos_orders_list"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to route order to kitchen");
    },
  });

  // Delete Order Mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteOrderApi(id),
    onSuccess: () => {
      toast.success("Draft order deleted successfully!");
      navigate("/pos/orders");
      queryClient.invalidateQueries({ queryKey: ["pos_orders_list"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to delete order");
    },
  });

  const handleEditOrder = () => {
    if (order) {
      loadOrder(order);
      toast.success(`Loaded order ${order.order_number} to POS cart`);
      navigate("/pos");
    }
  };

  const handleSendToKds = () => {
    setIsSendingKds(true);
    kdsMutation.mutate(null, {
      onSettled: () => setIsSendingKds(false),
    });
  };

  const handleConfirmDelete = () => {
    setIsDeleting(true);
    deleteMutation.mutate(null, {
      onSettled: () => {
        setIsDeleting(false);
        setIsDeleteOpen(false);
      },
    });
  };

  const handlePrintReceipt = () => {
    // Small timeout to guarantee DOM represents print component
    setTimeout(() => {
      window.print();
    }, 150);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cafe-bg-dark text-cafe-text-primary flex flex-col">
        <POSNavbar />
        <div className="flex-grow flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-cafe-bg-dark text-cafe-text-primary flex flex-col">
        <POSNavbar />
        <div className="flex-grow flex flex-col items-center justify-center gap-3 select-none">
          <p className="text-cafe-text-muted text-sm font-semibold">Order details not found.</p>
          <Button variant="ghost" onClick={() => navigate("/pos/orders")}>
            <ArrowLeft size={16} /> Back to History
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (orderStatus) => {
    switch (orderStatus) {
      case "draft":
        return <Badge variant="warning">DRAFT CHECK</Badge>;
      case "sent_to_kds":
        return <Badge variant="info">IN KITCHEN</Badge>;
      case "paid":
        return <Badge variant="success">PAID BILL</Badge>;
      case "cancelled":
        return <Badge variant="danger">CANCELLED</Badge>;
      default:
        return <Badge>{orderStatus}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-cafe-bg-dark text-cafe-text-primary flex flex-col">
      <POSNavbar />

      <main className="flex-1 p-6 max-w-5xl mx-auto w-full flex flex-col gap-6">
        {/* Top Breadcrumb Actions */}
        <div className="flex items-center justify-between border-b border-cafe-border/50 pb-4 select-none">
          <button
            onClick={() => navigate("/pos/orders")}
            className="flex items-center gap-2 text-xs font-bold text-cafe-text-secondary hover:text-cafe-beige-mid transition-colors"
          >
            <ArrowLeft size={16} /> BACK TO LIST
          </button>
          <div className="flex items-center gap-2">
            {getStatusBadge(order.status)}
          </div>
        </div>

        {/* Action Panel Buttons */}
        <div className="bg-cafe-bg-card border border-cafe-border p-4.5 rounded-2xl flex flex-wrap gap-3 items-center select-none shadow-lg">
          {order.status === "draft" && (
            <>
              <Button onClick={handleEditOrder} variant="ghost" className="flex items-center gap-2 text-xs border border-cafe-border hover:bg-cafe-bg-input">
                <Edit2 size={14} /> Resume Check
              </Button>
              <Button
                onClick={handleSendToKds}
                isLoading={isSendingKds}
                className="flex items-center gap-2 text-xs bg-cafe-green-dark hover:bg-cafe-green-mid"
              >
                <Play size={14} /> Route to Kitchen
              </Button>
              <Button onClick={() => setIsPaymentOpen(true)} className="flex items-center gap-2 text-xs">
                <CreditCard size={14} /> Checkout Check
              </Button>
              <Button
                onClick={() => setIsDeleteOpen(true)}
                variant="ghost"
                className="flex items-center gap-2 text-xs text-cafe-danger hover:bg-cafe-danger/10 ml-auto"
              >
                <Trash2 size={14} /> Void Check
              </Button>
            </>
          )}

          {order.status === "sent_to_kds" && (
            <>
              <Button onClick={() => setIsPaymentOpen(true)} className="flex items-center gap-2 text-xs">
                <CreditCard size={14} /> Checkout Check
              </Button>
            </>
          )}

          {order.status === "paid" && (
            <>
              <Button onClick={handlePrintReceipt} className="flex items-center gap-2 text-xs bg-cafe-green-dark hover:bg-cafe-green-mid">
                <Printer size={14} /> Print Receipt
              </Button>
              <Button
                onClick={() => setIsEmailOpen(true)}
                variant="ghost"
                className="flex items-center gap-2 text-xs border border-cafe-border hover:bg-cafe-bg-input text-cafe-beige-mid"
              >
                <Mail size={14} /> Email Receipt
              </Button>
            </>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Block: Check Details & Financials */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Header info card */}
            <div className="bg-cafe-bg-card border border-cafe-border p-6 rounded-2xl flex flex-col gap-4">
              <h2 className="text-lg font-black text-cafe-beige-mid select-none border-b border-cafe-border/50 pb-3">
                Order Summary #{order.order_number}
              </h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs select-none">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-cafe-text-muted" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-cafe-text-muted">Order Date</span>
                    <span className="font-semibold text-cafe-text-primary">{formatDate(order.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User size={16} className="text-cafe-text-muted" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-cafe-text-muted">Employee (Server)</span>
                    <span className="font-semibold text-cafe-text-primary capitalize">{order.employee?.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Armchair size={16} className="text-cafe-text-muted" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-cafe-text-muted">Dining Assignment</span>
                    <span className="font-semibold text-cafe-text-primary">
                      {order.table ? `Table ${order.table.table_number}` : "Takeaway / Parcel"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-cafe-text-muted" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-cafe-text-muted">Linked Customer</span>
                    <span className="font-semibold text-cafe-text-primary">
                      {order.customer?.name || "Walk-in Guest"}
                    </span>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="bg-cafe-bg-input border border-cafe-border/40 p-3 rounded-xl text-xs flex flex-col gap-1 select-none">
                  <span className="font-bold text-cafe-text-secondary text-[10px] uppercase tracking-wider">Kitchen / Staff Notes</span>
                  <p className="text-cafe-text-primary italic">"{order.notes}"</p>
                </div>
              )}
            </div>

            {/* Check lines item table */}
            <div className="bg-cafe-bg-card border border-cafe-border p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-cafe-beige-mid mb-4 border-b border-cafe-border/30 pb-2.5 select-none">
                Ordered Menu Items
              </h3>
              <div className="overflow-x-auto select-none">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="text-cafe-text-secondary font-bold border-b border-cafe-border pb-2">
                      <th className="py-2.5 pl-1">Item Description</th>
                      <th className="py-2.5 text-center">Qty</th>
                      <th className="py-2.5 text-right">Unit Price</th>
                      <th className="py-2.5 text-right">Promo Disc</th>
                      <th className="py-2.5 text-right pr-1">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cafe-border/30">
                    {order.items?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-cafe-bg-input/10 text-cafe-text-primary">
                        <td className="py-3 pl-1 font-medium">{item.product_name}</td>
                        <td className="py-3 text-center font-bold text-cafe-beige-mid">{item.quantity}</td>
                        <td className="py-3 text-right">{formatCurrency(item.unit_price)}</td>
                        <td className="py-3 text-right text-cafe-danger font-medium">
                          {item.item_discount > 0 ? `-${formatCurrency(item.item_discount)}` : "-"}
                        </td>
                        <td className="py-3 text-right font-bold text-cafe-green-light pr-1">
                          {formatCurrency(item.line_total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Block: Bill Details totals & Payments summary */}
          <div className="flex flex-col gap-6 select-none">
            {/* Financial math summary */}
            <div className="bg-cafe-bg-card border border-cafe-border p-5 rounded-2xl flex flex-col gap-3.5 shadow-md">
              <h3 className="text-sm font-bold text-cafe-beige-mid border-b border-cafe-border/50 pb-2">
                Checkout Summary
              </h3>
              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between text-cafe-text-secondary">
                  <span>Gross Subtotal:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-cafe-text-secondary">
                  <span>CGST & SGST (applied):</span>
                  <span>{formatCurrency(order.tax_amount)}</span>
                </div>
                <div className="flex justify-between text-cafe-danger font-medium">
                  <span>Discounts Applied:</span>
                  <span>-{formatCurrency(order.discount_amount)}</span>
                </div>
                {order.coupon_code && (
                  <div className="bg-cafe-green-mid/10 border border-cafe-green-mid/30 text-[10px] text-cafe-green-light p-2 rounded flex justify-between font-bold">
                    <span>Coupon:</span>
                    <span>{order.coupon_code}</span>
                  </div>
                )}
                <div className="border-t border-cafe-border pt-3.5 mt-1.5 flex justify-between items-center text-sm font-black text-cafe-text-primary">
                  <span>Net Payable:</span>
                  <span className="text-lg font-black text-cafe-green-light">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payments Receipt card */}
            {order.status === "paid" && order.payment && (
              <div className="bg-cafe-green-mid/5 border border-cafe-green-mid/20 p-5 rounded-2xl flex flex-col gap-3">
                <h3 className="text-sm font-bold text-cafe-green-light border-b border-cafe-green-mid/20 pb-2">
                  Transaction Receipt
                </h3>
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-cafe-text-secondary">Method:</span>
                    <span className="font-extrabold uppercase text-cafe-beige-mid">
                      {order.payment.payment_method}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cafe-text-secondary">Received Amount:</span>
                    <span className="font-semibold">{formatCurrency(order.payment.amount_received)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cafe-text-secondary">Change Provided:</span>
                    <span className="font-semibold">{formatCurrency(order.payment.change_given)}</span>
                  </div>
                  {order.payment.reference && (
                    <div className="flex justify-between truncate min-w-0">
                      <span className="text-cafe-text-secondary">Ref Code:</span>
                      <span className="font-mono text-cafe-text-muted truncate max-w-[120px]" title={order.payment.reference}>
                        {order.payment.reference}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-cafe-text-secondary">Payment Status:</span>
                    <span className="font-bold text-cafe-green-light uppercase">
                      {order.payment.status}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Checkout Payment Modal */}
      <PaymentPanel
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        orderId={order.id}
        orderTotal={order.total}
        orderNumber={order.order_number}
        onSuccess={() => {
          refetch();
          queryClient.invalidateQueries({ queryKey: ["pos_orders_list"] });
        }}
      />

      {/* Email Receipt Modal */}
      <EmailReceiptModal
        isOpen={isEmailOpen}
        onClose={() => setIsEmailOpen(false)}
        orderId={order.id}
        defaultEmail={order.customer?.email}
      />

      {/* Void Check Confirm Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Void Draft Check?"
        message="Are you sure you want to void and delete this draft order check? This action is permanent and cannot be undone."
        confirmText="Void Check"
        isDanger={true}
        isLoading={isDeleting}
      />

      {/* Hidden layout rendered for thermal printing */}
      <PrintableReceipt order={order} />
    </div>
  );
};

export default OrderDetail;
