import React, { useState } from "react";
import { Ticket, X, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { validateCouponApi } from "../../api/coupon.api";
import useCartStore from "../../store/cartStore";

export const DiscountPopup = ({ isOpen, onClose }) => {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  
  const subtotal = useCartStore((state) => state.subtotal);
  const currentCouponCode = useCartStore((state) => state.couponCode);
  const currentCouponDiscount = useCartStore((state) => state.couponDiscount);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsValidating(true);
    try {
      const res = await validateCouponApi(code.trim(), subtotal);
      if (res.success && res.data) {
        // Apply to store
        applyCoupon(res.data.code, res.data.discount_amount);
        toast.success(`Coupon applied: -₹${parseFloat(res.data.discount_amount).toFixed(2)}`);
        setCode("");
        onClose();
      } else {
        toast.error(res.message || "Failed to validate coupon");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Invalid coupon code");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.success("Coupon removed from order");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Coupons & Discounts"
      size="sm"
    >
      <div className="flex flex-col gap-4 select-none">
        {currentCouponCode ? (
          // Coupon already applied
          <div className="bg-cafe-green-mid/10 border border-cafe-green-mid/30 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cafe-green-light">
                <CheckCircle size={18} />
                <span className="font-bold text-sm">Coupon Active</span>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="text-cafe-text-muted hover:text-cafe-danger transition-colors p-1"
                title="Remove Coupon"
              >
                <X size={16} />
              </button>
            </div>
            <div>
              <p className="text-xs text-cafe-text-muted">Code applied</p>
              <h4 className="font-bold text-cafe-text-primary text-base">{currentCouponCode}</h4>
            </div>
            <div className="flex justify-between items-center border-t border-cafe-border/50 pt-2.5 mt-1">
              <span className="text-xs text-cafe-text-secondary">Discount Value</span>
              <span className="font-bold text-cafe-green-light">
                -₹{currentCouponDiscount.toFixed(2)}
              </span>
            </div>
          </div>
        ) : (
          // Form to apply new coupon
          <form onSubmit={handleApplyCoupon} className="flex flex-col gap-4">
            <p className="text-xs text-cafe-text-muted">
              Enter an active promotional coupon code to apply a discount to this cart's subtotal.
            </p>
            
            <div className="relative">
              <Input
                label="Coupon Code"
                placeholder="e.g. CAFE50"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                disabled={isValidating}
                className="uppercase"
              />
              <span className="absolute right-3.5 top-9.5 text-cafe-text-muted">
                <Ticket size={16} />
              </span>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isValidating}>
                Apply Coupon
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default DiscountPopup;
