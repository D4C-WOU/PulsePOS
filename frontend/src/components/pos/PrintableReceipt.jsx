import React from "react";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";

export const PrintableReceipt = ({ order }) => {
  if (!order) return null;

  const subtotal = parseFloat(order.subtotal || 0);
  const taxAmount = parseFloat(order.tax_amount || 0);
  const discountAmount = parseFloat(order.discount_amount || 0);
  const total = parseFloat(order.total || 0);

  return (
    <div id="printable-receipt" className="hidden print:block font-mono text-black p-4 bg-white w-[80mm] text-[11px] leading-relaxed">
      {/* Brand Header */}
      <div className="text-center flex flex-col gap-0.5 border-b border-dashed border-black pb-3">
        <h2 className="text-sm font-black tracking-widest uppercase">Odoo Cafe POS</h2>
        <p className="text-[9px]">Gourmet Coffee & Dining</p>
        <p className="text-[9px]">Connaught Place, New Delhi</p>
        <p className="text-[9px]">GSTIN: 07AAAAA1111A1Z1</p>
      </div>

      {/* Meta info */}
      <div className="flex flex-col gap-1 py-3 border-b border-dashed border-black">
        <div className="flex justify-between">
          <span>Order No:</span>
          <span className="font-bold">{order.order_number}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{formatDate(order.created_at || new Date())}</span>
        </div>
        <div className="flex justify-between">
          <span>Staff:</span>
          <span className="capitalize">{order.employee?.name || "Cashier"}</span>
        </div>
        <div className="flex justify-between">
          <span>Service:</span>
          <span className="font-bold">
            {order.table ? `Table ${order.table.table_number}` : "Takeaway / Parcel"}
          </span>
        </div>
        {order.customer && (
          <div className="border-t border-dotted border-black/40 pt-1 mt-1 flex flex-col gap-0.5">
            <div className="flex justify-between">
              <span>Customer:</span>
              <span>{order.customer.name}</span>
            </div>
            {order.customer.phone && (
              <div className="flex justify-between">
                <span>Phone:</span>
                <span>{order.customer.phone}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Line Items Table */}
      <div className="py-3 border-b border-dashed border-black">
        <div className="grid grid-cols-12 font-bold mb-1 border-b border-dotted border-black pb-1">
          <span className="col-span-6">Item Description</span>
          <span className="col-span-2 text-center">Qty</span>
          <span className="col-span-4 text-right">Amount</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {order.items?.map((item, idx) => {
            const originalLineSubtotal = item.unit_price * item.quantity;
            return (
              <div key={idx} className="flex flex-col gap-0.5">
                <div className="grid grid-cols-12">
                  <span className="col-span-6 truncate font-medium">{item.product_name}</span>
                  <span className="col-span-2 text-center">{item.quantity}</span>
                  <span className="col-span-4 text-right">
                    {formatCurrency(item.line_total)}
                  </span>
                </div>
                {/* Show item specific discounts if any */}
                {parseFloat(item.item_discount) > 0 && (
                  <div className="grid grid-cols-12 text-[9px] italic opacity-85">
                    <span className="col-span-8 pl-2">
                      * promo disc (-{formatCurrency(item.item_discount)})
                    </span>
                    <span className="col-span-4 text-right line-through">
                      {formatCurrency(originalLineSubtotal)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Financials totals */}
      <div className="flex flex-col gap-1 py-3 border-b border-dashed border-black">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-black font-semibold">
            <span>Discounts Applied:</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Taxes (GST):</span>
          <span>{formatCurrency(taxAmount)}</span>
        </div>
        {order.coupon_code && (
          <div className="flex justify-between text-[9px] italic">
            <span>Coupon applied:</span>
            <span>{order.coupon_code}</span>
          </div>
        )}
        <div className="flex justify-between text-xs font-black pt-1 border-t border-dotted border-black/50 mt-1">
          <span>NET PAYABLE:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Payment details */}
      {order.status === "paid" && order.payment && (
        <div className="flex flex-col gap-1 py-3 border-b border-dashed border-black bg-black/5 p-2 rounded">
          <div className="flex justify-between font-bold">
            <span>Paid Via:</span>
            <span className="uppercase">{order.payment.payment_method}</span>
          </div>
          <div className="flex justify-between">
            <span>Received:</span>
            <span>{formatCurrency(order.payment.amount_received)}</span>
          </div>
          {parseFloat(order.payment.change_given) > 0 && (
            <div className="flex justify-between">
              <span>Change Given:</span>
              <span>{formatCurrency(order.payment.change_given)}</span>
            </div>
          )}
          {order.payment.reference && (
            <div className="flex justify-between text-[9px] truncate">
              <span>Ref Code:</span>
              <span>{order.payment.reference}</span>
            </div>
          )}
        </div>
      )}

      {/* Footer Greeting */}
      <div className="text-center pt-4 flex flex-col gap-1">
        <p className="font-bold">Thank you for dining with us!</p>
        <p className="text-[9px]">Please visit again.</p>
        <div className="border-t border-dotted border-black pt-2 mt-2 text-[8px] opacity-70">
          Powered by Odoo Cafe POS Engine
        </div>
      </div>
    </div>
  );
};

export default PrintableReceipt;
