import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiCreditCard,
  FiDollarSign,
  FiSmartphone,
} from "react-icons/fi";

const PaymentModal = ({
  isOpen,
  onClose,
  totalAmount = 0,
  onPaymentComplete,
}) => {
  const [paymentMethod, setPaymentMethod] =
    useState("cash");

  const [cashReceived, setCashReceived] =
    useState("");

  const change =
    Number(cashReceived || 0) - totalAmount;

  const handlePayment = () => {
    const paymentData = {
      method: paymentMethod,
      amount: totalAmount,
      cashReceived:
        paymentMethod === "cash"
          ? Number(cashReceived)
          : null,
      change:
        paymentMethod === "cash"
          ? Math.max(change, 0)
          : 0,
    };

    if (onPaymentComplete) {
      onPaymentComplete(paymentData);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="
          fixed inset-0
          bg-black/70
          backdrop-blur-sm
          flex items-center justify-center
          z-50
          p-4
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
          }}
          className="
            w-full
            max-w-md
            bg-[#111827]
            border border-slate-800
            rounded-3xl
            shadow-2xl
            overflow-hidden
          "
        >
          {/* Header */}
          <div
            className="
              flex
              items-center
              justify-between
              p-6
              border-b border-slate-800
            "
          >
            <h2 className="text-xl font-bold text-white">
              Payment
            </h2>

            <button
              onClick={onClose}
              className="
                text-slate-400
                hover:text-white
              "
            >
              <FiX size={22} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            
            {/* Total */}
            <div
              className="
                bg-[#1F2937]
                rounded-2xl
                p-5
                text-center
                mb-6
              "
            >
              <p className="text-slate-400">
                Total Amount
              </p>

              <h1
                className="
                  text-4xl
                  font-bold
                  text-orange-500
                  mt-2
                "
              >
                ₹{totalAmount.toFixed(2)}
              </h1>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <p className="text-white font-medium mb-4">
                Payment Method
              </p>

              <div className="grid grid-cols-3 gap-3">
                
                <button
                  onClick={() =>
                    setPaymentMethod("cash")
                  }
                  className={`
                    p-4
                    rounded-xl
                    border
                    flex flex-col
                    items-center
                    gap-2

                    ${
                      paymentMethod === "cash"
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-slate-700"
                    }
                  `}
                >
                  <FiDollarSign
                    className="text-orange-500"
                    size={22}
                  />

                  <span className="text-white text-sm">
                    Cash
                  </span>
                </button>

                <button
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                  className={`
                    p-4
                    rounded-xl
                    border
                    flex flex-col
                    items-center
                    gap-2

                    ${
                      paymentMethod === "card"
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-slate-700"
                    }
                  `}
                >
                  <FiCreditCard
                    className="text-blue-500"
                    size={22}
                  />

                  <span className="text-white text-sm">
                    Card
                  </span>
                </button>

                <button
                  onClick={() =>
                    setPaymentMethod("upi")
                  }
                  className={`
                    p-4
                    rounded-xl
                    border
                    flex flex-col
                    items-center
                    gap-2

                    ${
                      paymentMethod === "upi"
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-slate-700"
                    }
                  `}
                >
                  <FiSmartphone
                    className="text-green-500"
                    size={22}
                  />

                  <span className="text-white text-sm">
                    UPI
                  </span>
                </button>
              </div>
            </div>

            {/* Cash Input */}
            {paymentMethod === "cash" && (
              <div className="mb-6">
                <label className="block text-slate-300 mb-2">
                  Cash Received
                </label>

                <input
                  type="number"
                  placeholder="Enter amount"
                  value={cashReceived}
                  onChange={(e) =>
                    setCashReceived(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    bg-[#1F2937]
                    border border-slate-700
                    rounded-xl
                    px-4 py-3
                    text-white
                    outline-none
                  "
                />

                {cashReceived && (
                  <div className="mt-3">
                    <p className="text-slate-400">
                      Change:
                    </p>

                    <p
                      className={`
                        font-bold text-lg

                        ${
                          change >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      `}
                    >
                      ₹{change.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={
                paymentMethod === "cash" &&
                change < 0
              }
              className="
                w-full
                py-3
                rounded-xl
                bg-orange-500
                hover:bg-orange-600
                disabled:bg-slate-700
                disabled:text-slate-500
                text-white
                font-semibold
                transition
              "
            >
              Complete Payment
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;