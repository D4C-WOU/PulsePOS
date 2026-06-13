import { motion } from "framer-motion";

const OrderSummary = ({
  cartItems = [],
  taxRate = 5,
  discount = 0,
}) => {
  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const tax = (subtotal * taxRate) / 100;

  const total =
    subtotal + tax - discount;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        bg-[#111827]
        border border-slate-800
        rounded-3xl
        p-6
        shadow-lg
      "
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          Order Summary
        </h2>

        <p className="text-slate-400 text-sm mt-1">
          Billing details
        </p>
      </div>

      {/* Summary Details */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-slate-400">
            Subtotal
          </span>

          <span className="text-white font-medium">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">
            Tax ({taxRate}%)
          </span>

          <span className="text-white font-medium">
            ₹{tax.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">
            Discount
          </span>

          <span className="text-red-400 font-medium">
            - ₹{discount.toFixed(2)}
          </span>
        </div>

        <div className="border-t border-slate-800 pt-4">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-white">
              Total
            </span>

            <span className="text-2xl font-bold text-orange-500">
              ₹{total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <button
        className="
          w-full
          mt-6
          bg-orange-500
          hover:bg-orange-600
          transition
          text-white
          font-semibold
          py-3
          rounded-xl
        "
      >
        Proceed to Payment
      </button>
    </motion.div>
  );
};

export default OrderSummary;