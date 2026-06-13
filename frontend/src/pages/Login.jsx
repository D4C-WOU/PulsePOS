import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const Login = () => {
  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login Data:", formData);

    // Navigate to Dashboard later
  };

  return (
    <div
      className="
        min-h-screen
        bg-[#0B1120]
        flex
        items-center
        justify-center
        px-4
        relative
        overflow-hidden
      "
    >
      {/* Background Glow */}
      <div
        className="
          absolute
          top-20
          left-20
          h-72
          w-72
          bg-orange-500/10
          rounded-full
          blur-3xl
        "
      />

      <div
        className="
          absolute
          bottom-20
          right-20
          h-72
          w-72
          bg-blue-500/10
          rounded-full
          blur-3xl
        "
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
          relative
          z-10
          w-full
          max-w-md
          bg-[#111827]/80
          backdrop-blur-xl
          border
          border-slate-800
          rounded-3xl
          p-8
          shadow-2xl
        "
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            PulsePOS
          </h1>

          <p className="text-slate-400 mt-3">
            Restaurant Management System
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Email */}
          <div>
            <label className="text-slate-300 text-sm block mb-2">
              Email Address
            </label>

            <div
              className="
                flex
                items-center
                bg-[#1F2937]
                rounded-xl
                px-4
                py-3
              "
            >
              <FiMail className="text-slate-400" />

              <input
                type="email"
                placeholder="admin@pulsepos.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="
                  bg-transparent
                  outline-none
                  ml-3
                  w-full
                  text-white
                  placeholder:text-slate-500
                "
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-slate-300 text-sm block mb-2">
              Password
            </label>

            <div
              className="
                flex
                items-center
                bg-[#1F2937]
                rounded-xl
                px-4
                py-3
              "
            >
              <FiLock className="text-slate-400" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password:
                      e.target.value,
                  })
                }
                className="
                  bg-transparent
                  outline-none
                  ml-3
                  w-full
                  text-white
                  placeholder:text-slate-500
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <FiEyeOff className="text-slate-400" />
                ) : (
                  <FiEye className="text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input
                type="checkbox"
                className="accent-orange-500"
              />
              Remember Me
            </label>

            <button
              type="button"
              className="
                text-orange-500
                text-sm
                hover:text-orange-400
              "
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="
              w-full
              py-3
              rounded-xl
              bg-orange-500
              hover:bg-orange-600
              text-white
              font-semibold
              transition
            "
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 PulsePOS
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;