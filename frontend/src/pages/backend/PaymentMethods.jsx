import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Wallet, Smartphone, ShieldCheck, QrCode } from "lucide-react";
import { toast } from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";

import BackendLayout from "../../components/backend/BackendLayout";
import Toggle from "../../components/common/Toggle";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";

import { getPaymentMethodsApi, updatePaymentMethodApi } from "../../api/paymentMethod.api";

export const PaymentMethods = () => {
  const queryClient = useQueryClient();
  
  const [upiIdInput, setUpiIdInput] = useState("");
  const [showQrPreview, setShowQrPreview] = useState(false);

  // Fetch Payment Methods
  const { data, isLoading } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: getPaymentMethodsApi,
  });

  const methods = data?.data || [];

  // Update Payment Method Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, is_enabled, upi_id }) => updatePaymentMethodApi(id, { is_enabled, upi_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Payment configuration updated!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update payment method");
    }
  });

  // Sync UPI input state when data loads
  useEffect(() => {
    const upi = methods.find(m => m.type === "upi");
    if (upi && upi.upi_id) {
      setUpiIdInput(upi.upi_id);
    }
  }, [methods]);

  const handleToggleChange = (methodId, type, currentEnabled) => {
    const nextEnabled = !currentEnabled;
    const upi = methods.find(m => m.type === "upi");

    if (type === "upi") {
      if (nextEnabled && (!upiIdInput || upiIdInput.trim() === "")) {
        toast.error("Please enter a valid UPI ID before enabling UPI payment");
        return;
      }
      updateMutation.mutate({ id: methodId, is_enabled: nextEnabled, upi_id: upiIdInput });
    } else {
      updateMutation.mutate({ id: methodId, is_enabled: nextEnabled });
    }
  };

  const handleSaveUpi = (e) => {
    e.preventDefault();
    const upi = methods.find(m => m.type === "upi");
    if (!upi) return;
    
    if (upi.is_enabled && (!upiIdInput || upiIdInput.trim() === "")) {
      toast.error("UPI ID cannot be empty while UPI is enabled");
      return;
    }
    
    updateMutation.mutate({ id: upi.id, is_enabled: upi.is_enabled, upi_id: upiIdInput });
  };

  const getUpiPayloadString = () => {
    // Standard mock upi payload for client-side display preview
    return `upi://pay?pa=${upiIdInput}&pn=Odoo%20Cafe&am=100.00&cu=INR&tn=MockPayment`;
  };

  if (isLoading) {
    return (
      <BackendLayout>
        <div className="flex justify-center items-center py-40">
          <Spinner size="lg" />
        </div>
      </BackendLayout>
    );
  }

  const cash = methods.find(m => m.type === "cash") || { id: 1, type: "cash", is_enabled: true };
  const card = methods.find(m => m.type === "card") || { id: 2, type: "card", is_enabled: false };
  const upi = methods.find(m => m.type === "upi") || { id: 3, type: "upi", is_enabled: false };

  return (
    <BackendLayout>
      <div className="mb-6 select-none">
        <h1 className="text-2xl font-bold text-cafe-beige-mid">Payment Methods</h1>
        <p className="text-sm text-cafe-text-muted">Configure payment methods accepted at customer checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Cash Card */}
        <div 
          className={`bg-cafe-bg-card border rounded-xl p-6 flex flex-col justify-between min-h-[300px] transition-all duration-300 ${
            cash.is_enabled 
              ? "border-cafe-green-mid shadow-[0_0_20px_rgba(82,183,136,0.15)]" 
              : "border-cafe-border opacity-70"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-cafe-bg-surface flex items-center justify-center text-cafe-green-light border border-cafe-border">
                <Wallet size={24} />
              </div>
              <Toggle
                checked={cash.is_enabled}
                onChange={() => handleToggleChange(cash.id, "cash", cash.is_enabled)}
              />
            </div>
            <h3 className="text-lg font-bold text-cafe-text-primary mb-2">Cash Registers</h3>
            <p className="text-sm text-cafe-text-muted">
              Enable manual cash tender payments with instant change due calculation.
            </p>
          </div>
          <div className="text-xs text-cafe-text-secondary mt-6 flex items-center gap-1.5 bg-cafe-bg-surface/50 p-2.5 rounded border border-cafe-border/50">
            <ShieldCheck size={14} className="text-cafe-green-mid" />
            <span>Always available during cashiers sessions.</span>
          </div>
        </div>

        {/* 2. Card Card */}
        <div 
          className={`bg-cafe-bg-card border rounded-xl p-6 flex flex-col justify-between min-h-[300px] transition-all duration-300 ${
            card.is_enabled 
              ? "border-cafe-green-mid shadow-[0_0_20px_rgba(82,183,136,0.15)]" 
              : "border-cafe-border opacity-70"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-cafe-bg-surface flex items-center justify-center text-cafe-green-light border border-cafe-border">
                <CreditCard size={24} />
              </div>
              <Toggle
                checked={card.is_enabled}
                onChange={() => handleToggleChange(card.id, "card", card.is_enabled)}
              />
            </div>
            <h3 className="text-lg font-bold text-cafe-text-primary mb-2">Card Payments (Polar)</h3>
            <p className="text-sm text-cafe-text-muted">
              Accept digital card and bank payouts powered by Polar.sh sandbox checkout sessions.
            </p>
          </div>
          <div className="text-xs text-cafe-text-secondary mt-6 flex items-center gap-1.5 bg-cafe-bg-surface/50 p-2.5 rounded border border-cafe-border/50">
            <ShieldCheck size={14} className="text-cafe-green-mid" />
            <span>Redirects cashiers to secure online links.</span>
          </div>
        </div>

        {/* 3. UPI QR Card */}
        <div 
          className={`bg-cafe-bg-card border rounded-xl p-6 flex flex-col justify-between min-h-[300px] transition-all duration-300 lg:col-span-1 ${
            upi.is_enabled 
              ? "border-cafe-green-mid shadow-[0_0_20px_rgba(82,183,136,0.15)]" 
              : "border-cafe-border"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-cafe-bg-surface flex items-center justify-center text-cafe-green-light border border-cafe-border">
                <Smartphone size={24} />
              </div>
              <Toggle
                checked={upi.is_enabled}
                onChange={() => handleToggleChange(upi.id, "upi", upi.is_enabled)}
              />
            </div>
            <h3 className="text-lg font-bold text-cafe-text-primary mb-2">UPI Instant QR</h3>
            <p className="text-sm text-cafe-text-muted mb-4">
              Generate instant scanning UPI QR codes based on order totals for easy mobile transactions.
            </p>

            {/* UPI Settings Form */}
            <form onSubmit={handleSaveUpi} className="flex flex-col gap-3">
              <Input
                label="Merchant UPI ID"
                placeholder="cafe@ybl"
                value={upiIdInput}
                onChange={(e) => setUpiIdInput(e.target.value)}
              />
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  variant="outline" 
                  className="flex-1 py-1.5 text-xs"
                  disabled={updateMutation.isPending}
                >
                  Save UPI ID
                </Button>
                {upiIdInput && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="py-1.5 text-xs flex items-center gap-1"
                    onClick={() => setShowQrPreview(!showQrPreview)}
                  >
                    <QrCode size={14} />
                    {showQrPreview ? "Hide QR" : "Preview QR"}
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* QR Code Preview Frame */}
          {showQrPreview && upiIdInput && (
            <div className="mt-4 p-4 border border-cafe-green-mid/20 bg-cafe-green-pale/35 rounded-lg flex flex-col items-center gap-2 animate-scale-up">
              <QRCodeSVG 
                value={getUpiPayloadString()} 
                size={140} 
                bgColor="#FFFFFF" 
                fgColor="#113824" 
                includeMargin={true}
              />
              <span className="text-[10px] text-cafe-text-muted mt-1 break-all text-center">
                {upiIdInput} (Mock value of ₹100.00)
              </span>
            </div>
          )}
        </div>
      </div>
    </BackendLayout>
  );
};

export default PaymentMethods;
