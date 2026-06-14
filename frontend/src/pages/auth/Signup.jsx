import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import { signupApi } from "../../api/auth.api";

export const Signup = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await signupApi(data.name, data.email, data.password);
      if (res.success && res.data) {
        setUser(res.data.user, res.data.token);
        toast.success("Account created! Welcome to Odoo Cafe ☕");
        navigate("/pos");
      }
    } catch (err) {
      toast.error(err.message || "Signup failed. Email may already be registered.");
    } finally {
      setIsLoading(false);
    }
  };

  const fieldStyle = (hasError) => ({
    background: "var(--color-bg-input)",
    border: `1px solid ${hasError ? "var(--color-danger)" : "var(--color-border-light)"}`,
    color: "var(--color-text-primary)",
  });

  return (
    <div className="min-h-screen flex bg-cafe-bg-deep overflow-hidden">
      {/* ── Left Branding Panel ────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden" style={{ borderRight: "1px solid var(--color-border)" }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #e6ede7 0%, #FAF6F0 50%, #f7f1e6 100%)",
          }}
        />
        <div className="orb orb-gold absolute" style={{ width: 400, height: 400, top: "-5%", right: "-10%", opacity: 0.2 }} />
        <div className="orb orb-green absolute" style={{ width: 280, height: 280, bottom: "10%", left: "-5%", opacity: 0.15 }} />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(var(--color-beige-mid) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 text-center flex flex-col items-center gap-8 animate-fade-in">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl animate-float"
            style={{
              background: "linear-gradient(135deg, var(--color-green-mid) 0%, var(--color-green-dark) 100%)",
              border: "1px solid rgba(34, 96, 63, 0.2)",
              boxShadow: "0 10px 30px rgba(34, 96, 63, 0.15)",
            }}
          >
            ✨
          </div>
          <div>
            <h1
              className="font-serif-brand text-4xl xl:text-5xl font-black"
              style={{
                background: "linear-gradient(135deg, var(--color-green-dark) 0%, var(--color-green-mid) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Join the Cafe
            </h1>
            <div
              className="mt-2 text-sm font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--color-green-light)" }}
            >
              Odoo Cafe POS
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--color-text-secondary)" }}>
            Create your admin account and start managing your restaurant with full access to all POS features.
          </p>
        </div>
      </div>

      {/* ── Right Signup Panel ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(rgba(201,151,58,0.025) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 w-full max-w-md animate-slide-up">
          <div className="mb-8">
            <h2 className="text-3xl font-black" style={{ color: "var(--color-text-primary)" }}>
              Create account 🚀
            </h2>
            <p className="mt-1.5 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Fill in your details below to register as an admin.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-muted)" }}>
                  <User size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  autoComplete="name"
                  {...register("name", { required: "Full name is required" })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium"
                  style={fieldStyle(errors.name)}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs" style={{ color: "var(--color-danger)" }}>{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-muted)" }}>
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  placeholder="admin@odoocafe.com"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" },
                  })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium"
                  style={fieldStyle(errors.email)}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs" style={{ color: "var(--color-danger)" }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-muted)" }}>
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Minimum 8 characters" },
                  })}
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm font-medium"
                  style={fieldStyle(errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs" style={{ color: "var(--color-danger)" }}>{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-3.5 rounded-xl font-black text-sm tracking-wide overflow-hidden group transition-all duration-200"
              style={{
                background: isLoading
                  ? "var(--color-green-dark)"
                  : "linear-gradient(135deg, #3a8c5e 0%, #1e4d35 100%)",
                color: "var(--color-beige-pale)",
                border: "1px solid rgba(96, 196, 138, 0.25)",
                boxShadow: isLoading ? "none" : "0 8px 24px rgba(58, 140, 94, 0.30)",
                opacity: isLoading ? 0.8 : 1,
              }}
            >
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-cafe-beige-pale/30 border-t-cafe-beige-pale rounded-full" style={{ animation: "spin 0.8s linear infinite" }} />
                    Creating account…
                  </>
                ) : (
                  <>Create Account <ArrowRight size={16} /></>
                )}
              </span>
            </button>
          </form>

          <div className="divider-text my-6">already registered?</div>

          <div className="text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
            <Link
              to="/login"
              className="font-bold transition-colors"
              style={{ color: "var(--color-beige-warm)" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "var(--color-beige-light)")}
              onMouseOut={(e) => (e.currentTarget.style.color = "var(--color-beige-warm)")}
            >
              ← Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
