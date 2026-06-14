import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import { loginApi } from "../../api/auth.api";
import Input from "../../components/common/Input";

export const Login = () => {
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
      const res = await loginApi(data.email, data.password);
      if (res.success && res.data) {
        setUser(res.data.user, res.data.token);
        toast.success(`Welcome back, ${res.data.user.name}! ☕`);
        navigate("/pos");
      }
    } catch (err) {
      toast.error(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-cafe-bg-deep overflow-hidden">
      {/* ── Left Branding Panel ────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden" style={{ borderRight: "1px solid var(--color-border)" }}>
        {/* Background gradient layers */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #e6ede7 0%, #FAF6F0 50%, #f7f1e6 100%)",
          }}
        />

        {/* Decorative orbs */}
        <div
          className="orb orb-green absolute"
          style={{ width: 420, height: 420, top: "-10%", left: "-15%", opacity: 0.25 }}
        />
        <div
          className="orb orb-gold absolute"
          style={{ width: 320, height: 320, bottom: "5%", right: "-10%", opacity: 0.2 }}
        />
        <div
          className="orb orb-green absolute"
          style={{ width: 200, height: 200, bottom: "30%", left: "10%", opacity: 0.15 }}
        />

        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(var(--color-beige-mid) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center flex flex-col items-center gap-8 animate-fade-in">
          {/* Logo mark */}
          <div className="relative">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-glow-green animate-float"
              style={{
                background: "linear-gradient(135deg, var(--color-green-mid) 0%, var(--color-green-dark) 100%)",
                border: "1px solid rgba(34, 96, 63, 0.2)",
                boxShadow: "0 10px 30px rgba(34, 96, 63, 0.15)",
              }}
            >
              ☕
            </div>
            <div
              className="absolute -inset-3 rounded-3xl opacity-10"
              style={{
                background: "radial-gradient(circle, rgba(34,96,63,0.3) 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Brand name */}
          <div>
            <h1
              className="font-serif-brand text-5xl xl:text-6xl font-black leading-tight"
              style={{
                background: "linear-gradient(135deg, var(--color-green-dark) 0%, var(--color-green-mid) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.02em",
              }}
            >
              Odoo Cafe
            </h1>
            <div
              className="mt-2 text-sm font-bold tracking-[0.25em] uppercase"
              style={{ color: "var(--color-green-light)" }}
            >
              Point of Sale
            </div>
          </div>

          {/* Tagline */}
          <p className="text-base leading-relaxed max-w-xs" style={{ color: "var(--color-text-secondary)" }}>
            Premium restaurant management powered by modern technology. Serve faster, sell smarter.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {["Real-time KDS", "Smart Discounts", "Table Management", "Analytics"].map((f) => (
              <span
                key={f}
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: "rgba(58, 140, 94, 0.12)",
                  border: "1px solid rgba(58, 140, 94, 0.25)",
                  color: "var(--color-green-light)",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          className="absolute bottom-6 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          Odoo Cafe POS — Built for Hackathon 2026
        </div>
      </div>

      {/* ── Right Login Panel ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Subtle bg texture for right panel */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: "radial-gradient(rgba(201,151,58,0.025) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Mobile logo (shown only on small screens) */}
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
          <span className="text-2xl">☕</span>
          <span
            className="font-serif-brand text-xl font-black"
            style={{
              background: "linear-gradient(135deg, var(--color-green-dark), var(--color-green-mid))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Odoo Cafe POS
          </span>
        </div>

        {/* Form card */}
        <div
          className="relative z-10 w-full max-w-md animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Card header */}
          <div className="mb-8">
            <h2
              className="text-3xl font-black"
              style={{ color: "var(--color-text-primary)" }}
            >
              Welcome back 👋
            </h2>
            <p className="mt-1.5 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Sign in to your POS account to start serving customers.
            </p>
          </div>

          {/* The form itself */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Email */}
            <div>
              <label
                className="block text-xs font-bold mb-1.5 uppercase tracking-wider"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Email Address
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  placeholder="admin@odoocafe.com"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium"
                  style={{
                    background: "var(--color-bg-input)",
                    border: `1px solid ${errors.email ? "var(--color-danger)" : "var(--color-border-light)"}`,
                    color: "var(--color-text-primary)",
                  }}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs" style={{ color: "var(--color-danger)" }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs font-bold mb-1.5 uppercase tracking-wider"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Password
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password", { required: "Password is required" })}
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm font-medium"
                  style={{
                    background: "var(--color-bg-input)",
                    border: `1px solid ${errors.password ? "var(--color-danger)" : "var(--color-border-light)"}`,
                    color: "var(--color-text-primary)",
                  }}
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
              {errors.password && (
                <p className="mt-1 text-xs" style={{ color: "var(--color-danger)" }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Demo credentials hint */}
            <div
              className="rounded-xl p-3 text-xs"
              style={{
                background: "rgba(58, 140, 94, 0.07)",
                border: "1px solid rgba(58, 140, 94, 0.18)",
                color: "var(--color-green-light)",
              }}
            >
              <span className="font-bold">Demo:</span>{" "}
              admin@odoocafe.com / <span className="font-mono">admin123</span>
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
              {/* Shimmer effect on hover */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
                }}
              />
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <span
                      className="w-4 h-4 border-2 border-cafe-beige-pale/30 border-t-cafe-beige-pale rounded-full"
                      style={{ animation: "spin 0.8s linear infinite" }}
                    />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In to POS
                    <ArrowRight size={16} />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="divider-text my-6">or</div>

          {/* Register link */}
          <div className="text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
            New to Odoo Cafe?{" "}
            <Link
              to="/signup"
              className="font-bold transition-colors"
              style={{ color: "var(--color-beige-warm)" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "var(--color-beige-light)")}
              onMouseOut={(e) => (e.currentTarget.style.color = "var(--color-beige-warm)")}
            >
              Create account →
            </Link>
          </div>

          {/* KDS quick link */}
          <div className="mt-4 text-center">
            <Link
              to="/kds"
              className="text-xs font-medium transition-colors"
              style={{ color: "var(--color-text-muted)" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "var(--color-green-light)")}
              onMouseOut={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            >
              📺 Open Kitchen Display (KDS) →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
