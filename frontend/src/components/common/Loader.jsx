import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0B1120] z-50">
      <div className="flex flex-col items-center gap-6">
        
        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
          className="
            w-16 h-16
            border-4
            border-slate-700
            border-t-orange-500
            rounded-full
          "
        />

        {/* Logo / Text */}
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1,
          }}
        >
          <h2 className="text-2xl font-bold text-white">
            PulsePOS
          </h2>

          <p className="text-slate-400 text-center mt-1">
            Loading Dashboard...
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Loader;