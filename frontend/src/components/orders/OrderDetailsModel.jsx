import { motion } from "framer-motion";
import {
  FiX,
  FiUser,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiCreditCard,
} from "react-icons/fi";

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const statusColor = {
    Pending: "bg-yellow-500/20 text-yellow-400",
    Preparing: "bg-blue-500/20 text-blue-400",
    Cooking: "bg-orange-500/20 text-orange-400",
    Ready: "bg-green-500/20 text-green-400",
    Completed: "bg-green-500/20 text-green-400",
    Cancelled: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#111827] rounded-3xl border border-white/5 shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">

          <div>
            <h2 className="text-2xl font-bold text-white">
              Order Details
            </h2>

            <p className="text-slate-400">
              Order ID: {order.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white hover:text-red-400 transition"
          >
            <FiX size={24} />
          </button>

        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Customer */}
          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-[#1A2333] rounded-2xl p-4">

              <h3 className="text-white font-semibold mb-4">
                Customer
              </h3>

              <div className="space-y-3 text-slate-300">

                <p className="flex items-center gap-2">
                  <FiUser />
                  {order.customer}
                </p>

                <p className="flex items-center gap-2">
                  <FiPhone />
                  {order.phone}
                </p>

                <p className="flex items-center gap-2">
                  <FiMapPin />
                  {order.address}
                </p>

              </div>

            </div>

            {/* Order Info */}
            <div className="bg-[#1A2333] rounded-2xl p-4">

              <h3 className="text-white font-semibold mb-4">
                Order Info
              </h3>

              <div className="space-y-3 text-slate-300">

                <p>
                  <strong>Total:</strong> ₹{order.total}
                </p>

                <p>
                  <strong>Payment:</strong> {order.payment}
                </p>

                <p>
                  <strong>Time:</strong> {order.time}
                </p>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${statusColor[order.status]}`}
                >
                  {order.status}
                </span>

              </div>

            </div>

          </div>

          {/* Items */}
          <div>

            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <FiShoppingBag />
              Ordered Items
            </h3>

            <div className="space-y-3">

              {order.items.map((item, index) => (

                <div
                  key={index}
                  className="flex justify-between bg-[#1A2333] rounded-xl p-4"
                >

                  <div>

                    <h4 className="text-white">
                      {item.name}
                    </h4>

                    <p className="text-slate-400 text-sm">
                      Qty : {item.quantity}
                    </p>

                  </div>

                  <p className="text-orange-400 font-semibold">
                    ₹{item.price}
                  </p>

                </div>

              ))}

            </div>

          </div>

          {/* Footer */}
          <div className="border-t border-white/10 pt-6 flex justify-between items-center">

            <div className="flex items-center gap-2 text-slate-300">
              <FiCreditCard />
              {order.payment}
            </div>

            <button
              onClick={onClose}
              className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl text-white font-semibold transition"
            >
              Close
            </button>

          </div>

        </div>

      </motion.div>

    </div>
  );
};

export default OrderDetailsModal;