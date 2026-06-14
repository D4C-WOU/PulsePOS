import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Banknote, CreditCard, QrCode, ArrowRight, ExternalLink, HelpCircle, ShieldAlert } from "lucide-react";
import { toast } from "react-hot-toast";

import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import formatCurrency from "../../utils/formatCurrency";
import { getPaymentMethodsApi } from "../../api/paymentMethod.api";
import {
  payWithCashApi,
  payWithCardApi,
  createPolarCheckoutApi,
  simulatePolarPaymentApi,
  getUpiQrApi,
  confirmUpiPaymentApi,
} from "../../api/payment.api";

export const PaymentPanel = ({ isOpen, onClose, orderId, orderTotal, orderNumber, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState("cash"); // cash, card, upi
  const [cashReceived, setCashReceived] = useState("");
  const [cardReference, setCardReference] = useState("");
  
  // Snapshot the total when panel opens so Exact button always uses the right amount
  // even if the cart store recalculates (debounce) while payment dialog is open
  const snapshotTotal = useRef(0);
  
  // UPI QR states
  const [upiQrData, setUpiQrData] = useState(null);
  const [isLoadingQr, setIsLoadingQr] = useState(false);

  // Polar states
  const [polarUrl, setPolarUrl] = useState("");
  const [polarCheckoutId, setPolarCheckoutId] = useState("");
  const [isCreatingPolar, setIsCreatingPolar] = useState(false);
  const [isSimulatingPolar, setIsSimulatingPolar] = useState(false);

  // Fetch Payment Methods to filter enabled ones
  const { data: methodsRes, isLoading: isLoadingMethods } = useQuery({
    queryKey: ["payment_methods_pos"],
    queryFn: getPaymentMethodsApi,
    enabled: isOpen,
  });

  const methods = methodsRes?.data || [];
  const isCashEnabled = methods.find((m) => m.type === "cash")?.is_enabled ?? true;
  const isCardEnabled = methods.find((m) => m.type === "card")?.is_enabled ?? false;
  const isUpiEnabled = methods.find((m) => m.type === "upi")?.is_enabled ?? false;

  // Initialize selected method based on what's enabled
  useEffect(() => {
    if (isOpen && methods.length > 0) {
      if (isCashEnabled) setSelectedMethod("cash");
      else if (isCardEnabled) setSelectedMethod("card");
      else if (isUpiEnabled) setSelectedMethod("upi");
    }
  }, [isOpen, methods, isCashEnabled, isCardEnabled, isUpiEnabled]);

  // Set default cash amount and snapshot total when panel opens
  useEffect(() => {
    if (isOpen) {
      const safeTotal = parseFloat(orderTotal) || 0;
      snapshotTotal.current = safeTotal;
      setCashReceived(safeTotal > 0 ? safeTotal.toString() : "");
      setCardReference("");
      setUpiQrData(null);
      setPolarUrl("");
      setPolarCheckoutId("");
    }
  }, [isOpen]); // intentionally omit orderTotal so it only fires on open/close

  // UPI QR Code Generator
  useEffect(() => {
    if (selectedMethod === "upi" && isOpen && isUpiEnabled && !upiQrData) {
      setIsLoadingQr(true);
      getUpiQrApi(orderId)
        .then((res) => {
          if (res.success) setUpiQrData(res.data);
        })
        .catch((err) => {
          toast.error("Failed to generate UPI QR code");
        })
        .finally(() => {
          setIsLoadingQr(false);
        });
    }
  }, [selectedMethod, isOpen, orderId, isUpiEnabled, upiQrData]);

  // Quick cash triggers
  const handleQuickCash = (extra) => {
    const val = parseFloat(cashReceived) || 0;
    setCashReceived((val + extra).toString());
  };

  const parsedCashReceived = parseFloat(cashReceived) || 0;
  const lockedTotal = snapshotTotal.current || parseFloat(orderTotal) || 0;
  const changeToGive = Math.max(0, parsedCashReceived - lockedTotal);

  // Cash Mutation
  const cashMutation = useMutation({
    mutationFn: () => payWithCashApi(orderId, parsedCashReceived),
    onSuccess: (res) => {
      toast.success(`Payment successful! Change to give: ${formatCurrency(res.data.change_given)}`);
      onSuccess(res.data);
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to process cash payment");
    },
  });

  // Card Mutation (Direct POS / Mock Swipe)
  const cardMutation = useMutation({
    mutationFn: () => payWithCardApi(orderId, cardReference),
    onSuccess: (res) => {
      toast.success("Card payment swiped successfully!");
      onSuccess(res.data);
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to process card transaction");
    },
  });

  // Polar Checkout Trigger
  const handleCreatePolarCheckout = async () => {
    setIsCreatingPolar(true);
    try {
      const res = await createPolarCheckoutApi(orderId);
      if (res.success && res.data) {
        setPolarUrl(res.data.checkout_url);
        setPolarCheckoutId(res.data.polar_checkout_id);
        toast.success("Polar checkout URL generated!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to load Polar sandbox checkout");
    } finally {
      setIsCreatingPolar(false);
    }
  };

  // Polar Simulator Trigger
  const handleSimulatePolarSuccess = async () => {
    setIsSimulatingPolar(true);
    try {
      const res = await simulatePolarPaymentApi(orderId);
      if (res.success) {
        toast.success("Polar sandboxed card payment confirmed!");
        onSuccess(res.data);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Polar simulation failed");
    } finally {
      setIsSimulatingPolar(false);
    }
  };

  // UPI Confirmation Mutation
  const upiMutation = useMutation({
    mutationFn: () => confirmUpiPaymentApi(orderId),
    onSuccess: (res) => {
      toast.success("UPI transaction verified!");
      onSuccess(res.data);
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to confirm UPI payment");
    },
  });

  const handleCashPaymentSubmit = (e) => {
    e.preventDefault();
    if (parsedCashReceived < lockedTotal) {
      toast.error("Cash received cannot be less than order total");
      return;
    }
    cashMutation.mutate();
  };

  const handleCardPaymentSubmit = (e) => {
    e.preventDefault();
    cardMutation.mutate();
  };

  const handleUpiPaymentSubmit = (e) => {
    e.preventDefault();
    upiMutation.mutate();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Process Payment for ${orderNumber}`}
      size="md"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 select-none min-h-[350px]">
        {/* Method selection side sidebar */}
        <div className="flex flex-col gap-2.5 border-r border-cafe-border/50 pr-4">
          <span className="text-xs font-semibold text-cafe-text-muted uppercase tracking-wider mb-1">
            Payment Method
          </span>
          <button
            type="button"
            disabled={!isCashEnabled}
            onClick={() => setSelectedMethod("cash")}
            className={`flex items-center gap-3 p-3.5 rounded-xl border font-bold text-sm transition-all text-left ${
              !isCashEnabled
                ? "opacity-45 cursor-not-allowed border-cafe-border bg-cafe-bg-input/20"
                : selectedMethod === "cash"
                ? "bg-cafe-beige-mid text-[#1C1814] border-cafe-beige-mid shadow"
                : "bg-cafe-bg-card text-cafe-text-primary border-cafe-border hover:bg-cafe-bg-input/50"
            }`}
          >
            <Banknote size={18} />
            <span>Cash Payment</span>
          </button>

          <button
            type="button"
            disabled={!isCardEnabled}
            onClick={() => setSelectedMethod("card")}
            className={`flex items-center gap-3 p-3.5 rounded-xl border font-bold text-sm transition-all text-left ${
              !isCardEnabled
                ? "opacity-45 cursor-not-allowed border-cafe-border bg-cafe-bg-input/20"
                : selectedMethod === "card"
                ? "bg-cafe-beige-mid text-[#1C1814] border-cafe-beige-mid shadow"
                : "bg-cafe-bg-card text-cafe-text-primary border-cafe-border hover:bg-cafe-bg-input/50"
            }`}
          >
            <CreditCard size={18} />
            <span>Card Terminal</span>
          </button>

          <button
            type="button"
            disabled={!isUpiEnabled}
            onClick={() => setSelectedMethod("upi")}
            className={`flex items-center gap-3 p-3.5 rounded-xl border font-bold text-sm transition-all text-left ${
              !isUpiEnabled
                ? "opacity-45 cursor-not-allowed border-cafe-border bg-cafe-bg-input/20"
                : selectedMethod === "upi"
                ? "bg-cafe-beige-mid text-[#1C1814] border-cafe-beige-mid shadow"
                : "bg-cafe-bg-card text-cafe-text-primary border-cafe-border hover:bg-cafe-bg-input/50"
            }`}
          >
            <QrCode size={18} />
            <span>UPI QR Code</span>
          </button>

          {/* Amount Due Sticky */}
          <div className="bg-cafe-bg-input border border-cafe-border p-3.5 rounded-xl flex flex-col gap-1.5 mt-auto">
            <span className="text-[10px] uppercase font-bold tracking-wider text-cafe-text-muted">
              Total Outstanding
            </span>
            <span className="text-xl font-black text-cafe-green-light">
              {formatCurrency(lockedTotal)}
            </span>
          </div>
        </div>

        {/* Dynamic checkout panel content */}
        <div className="md:col-span-2 flex flex-col justify-between">
          {isLoadingMethods ? (
            <div className="flex justify-center items-center h-full">
              <Spinner size="md" />
            </div>
          ) : (
            <>
              {selectedMethod === "cash" && (
                <form onSubmit={handleCashPaymentSubmit} className="flex flex-col h-full justify-between">
                  <div className="flex flex-col gap-4">
                    <Input
                      label="Cash Received (₹) *"
                      type="number"
                      step="0.01"
                      placeholder="e.g. 500"
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                      required
                    />

                    {/* Quick increment buttons */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-cafe-text-secondary font-semibold">Quick Add Cash</span>
                      <div className="grid grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCashReceived(lockedTotal > 0 ? lockedTotal.toString() : "0");
                          }}
                          className="px-2.5 py-2 bg-cafe-bg-card border border-cafe-border rounded-lg text-xs font-bold text-cafe-beige-mid hover:bg-cafe-bg-input hover:border-cafe-text-muted"
                        >
                          Exact
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickCash(100)}
                          className="px-2.5 py-2 bg-cafe-bg-card border border-cafe-border rounded-lg text-xs font-bold text-cafe-beige-mid hover:bg-cafe-bg-input hover:border-cafe-text-muted"
                        >
                          +₹100
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickCash(500)}
                          className="px-2.5 py-2 bg-cafe-bg-card border border-cafe-border rounded-lg text-xs font-bold text-cafe-beige-mid hover:bg-cafe-bg-input hover:border-cafe-text-muted"
                        >
                          +₹500
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickCash(2000)}
                          className="px-2.5 py-2 bg-cafe-bg-card border border-cafe-border rounded-lg text-xs font-bold text-cafe-beige-mid hover:bg-cafe-bg-input hover:border-cafe-text-muted"
                        >
                          +₹2000
                        </button>
                      </div>
                    </div>

                    {/* Change readout */}
                    <div className="bg-cafe-bg-input border border-cafe-border/60 rounded-xl p-4 flex justify-between items-center mt-2">
                      <span className="text-xs text-cafe-text-secondary font-semibold">Change to Give:</span>
                      <span className="font-extrabold text-lg text-cafe-beige-mid">
                        {formatCurrency(changeToGive)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="ghost" type="button" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={parsedCashReceived < lockedTotal}
                      isLoading={cashMutation.isLoading}
                      className="flex items-center gap-1.5"
                    >
                      Process Checkout <ArrowRight size={15} />
                    </Button>
                  </div>
                </form>
              )}

              {selectedMethod === "card" && (
                <div className="flex flex-col h-full justify-between">
                  <div className="flex flex-col gap-4">
                    {/* Polar Sandboxed Card Checkout */}
                    <div className="bg-cafe-bg-input border border-cafe-border/50 rounded-xl p-4 flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-cafe-beige-mid font-semibold text-sm">
                        <ExternalLink size={16} />
                        <span>Polar.sh Sandbox Checkout</span>
                      </div>
                      <p className="text-xs text-cafe-text-muted">
                        Generate a secure sandboxed Polar link to process payments via simulated card swipes or checkouts.
                      </p>

                      {polarUrl ? (
                        <div className="flex flex-col gap-2.5 mt-1">
                          <a
                            href={polarUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-cafe-beige-mid text-[#1C1814] rounded-xl font-bold text-xs shadow hover:bg-cafe-beige-light transition-all"
                          >
                            Open Polar Sandbox Link <ExternalLink size={14} />
                          </a>
                          <button
                            type="button"
                            onClick={handleSimulatePolarSuccess}
                            disabled={isSimulatingPolar}
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-cafe-green-mid/20 hover:bg-cafe-green-mid/30 border border-cafe-green-mid text-cafe-green-light rounded-xl font-bold text-xs transition-all"
                          >
                            {isSimulatingPolar ? "Verifying..." : "Simulate Webhook Success"}
                          </button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          onClick={handleCreatePolarCheckout}
                          isLoading={isCreatingPolar}
                          className="mt-1"
                        >
                          Generate Sandbox Checkout Link
                        </Button>
                      )}
                    </div>

                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-cafe-border/40"></div>
                      <span className="flex-shrink mx-3 text-cafe-text-muted text-[10px] uppercase font-bold tracking-wider">
                        Or Manual Processing
                      </span>
                      <div className="flex-grow border-t border-cafe-border/40"></div>
                    </div>

                    {/* Manual reference input */}
                    <form onSubmit={handleCardPaymentSubmit} className="flex flex-col gap-4">
                      <Input
                        label="Transaction Reference (optional)"
                        placeholder="e.g. Card Auth Code / TXN-928"
                        value={cardReference}
                        onChange={(e) => setCardReference(e.target.value)}
                      />
                      <div className="flex justify-end gap-3 mt-2">
                        <Button variant="ghost" type="button" onClick={onClose}>
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          isLoading={cardMutation.isLoading}
                          className="flex items-center gap-1.5"
                        >
                          Swipe / Manually Confirm <ArrowRight size={15} />
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {selectedMethod === "upi" && (
                <form onSubmit={handleUpiPaymentSubmit} className="flex flex-col h-full justify-between">
                  <div className="flex flex-col items-center justify-center gap-4 py-2 text-center">
                    {isLoadingQr ? (
                      <div className="flex flex-col items-center gap-2 justify-center h-44">
                        <Spinner size="md" />
                        <span className="text-xs text-cafe-text-muted">Generating UPI payment string...</span>
                      </div>
                    ) : upiQrData ? (
                      <div className="flex flex-col items-center gap-2">
                        {/* Display QR code */}
                        <div className="bg-white p-3.5 rounded-xl border border-cafe-border shadow-md">
                          <img
                            src={upiQrData.qr_base64}
                            alt="UPI QR Code"
                            className="w-40 h-40 object-contain"
                          />
                        </div>
                        <div className="mt-1 flex flex-col gap-0.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-cafe-text-muted">
                            Scan to Pay
                          </span>
                          <span className="text-xs font-semibold text-cafe-text-primary">
                            UPI ID: <span className="text-cafe-beige-mid">{upiQrData.upi_id}</span>
                          </span>
                          <span className="text-xs font-bold text-cafe-green-light mt-0.5">
                            Amount: {formatCurrency(upiQrData.amount)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 justify-center h-44 text-cafe-text-muted text-xs">
                        <ShieldAlert size={36} className="text-cafe-warning" />
                        <p>UPI details unavailable. Verify if UPI config is enabled.</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="ghost" type="button" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!upiQrData}
                      isLoading={upiMutation.isLoading}
                      className="flex items-center gap-1.5"
                    >
                      Confirm UPI Receipt <ArrowRight size={15} />
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PaymentPanel;
