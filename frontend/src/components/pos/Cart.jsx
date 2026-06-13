import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";

const Cart = ({
  cartItems = [],
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      className="
        h-full
        bg-[#111827]
        border border-slate-800
        rounded-3xl
        flex flex-col
      "
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white">
          Cart
        </h2>

        <p className="text-slate-400 text-sm mt-1">
          {cartItems.length} Items
        </p>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center">
            <div className="text-6xl mb-4">🛒</div>

            <h3 className="text-white text-lg font-semibold">
              Cart is Empty
            </h3>

            <p className="text-slate-500 mt-2 text-center">
              Add products to start creating an order
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  bg-[#1F2937]
                  rounded-2xl
                  p-4
                "
              >
                {/* Product Info */}
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-white font-medium">
                      {item.name}
                    </h3>

                    <p className="text-orange-500 font-semibold mt-1">
                      ₹{item.price}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      onRemove(item.id)
                    }
                    className="
                      text-red-500
                      hover:text-red-400
                    "
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-4">
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <button
                      onClick={() =>
                        onDecrease(item.id)
                      }
                      className="
                        h-8 w-8
                        rounded-lg
                        bg-slate-700
                        text-white
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <FiMinus />
                    </button>

                    <span className="text-white font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        onIncrease(item.id)
                      }
                      className="
                        h-8 w-8
                        rounded-lg
                        bg-orange-500
                        text-white
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <span className="text-white font-semibold">
                    ₹
                    {item.price *
                      item.quantity}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="
          border-t border-slate-800
          p-5
        "
      >
        <div className="flex justify-between mb-4">
          <span className="text-slate-400">
            Total
          </span>

          <span className="text-2xl font-bold text-white">
            ₹{total}
          </span>
        </div>

        <button
          disabled={cartItems.length === 0}
          className="
            w-full
            bg-orange-500
            hover:bg-orange-600
            disabled:bg-slate-700
            disabled:text-slate-500
            text-white
            py-3
            rounded-xl
            font-semibold
            transition
          "
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;