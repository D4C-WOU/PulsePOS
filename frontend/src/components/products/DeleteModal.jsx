import { motion } from "framer-motion";
import { FiTrash2, FiX } from "react-icons/fi";

const DeleteModal = ({
  isOpen,
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-[#111827] border border-white/5 rounded-3xl shadow-2xl w-full max-w-md p-6"
      >
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <FiTrash2 className="text-red-500 text-3xl" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-white">
          {title}
        </h2>

        {/* Message */}
        <p className="text-slate-400 text-center mt-3">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">

          {/* Cancel */}
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1A2333] hover:bg-[#243145] text-white py-3 rounded-2xl transition"
          >
            <FiX />
            Cancel
          </button>

          {/* Delete */}
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl transition"
          >
            <FiTrash2 />
            Delete
          </button>

        </div>

      </motion.div>

    </div>
  );
};

export default DeleteModal;