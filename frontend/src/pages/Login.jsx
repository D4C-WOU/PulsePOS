//import { useNavigate } from "react-router-dom";
function Login({ onLogin }) {
    //const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0B1120] flex">
      
      {/* Left Side */}
      <div className="w-1/2 flex flex-col justify-center px-16 relative overflow-hidden">
        <h1 className="text-6xl font-bold text-white leading-tight">
          Restaurant <br />
          Operations <br />
          Reimagined
        </h1>

        <p className="text-slate-400 mt-6 text-lg">
          Modern POS system for restaurants,
          cafes and food businesses.
        </p>

        {/* Floating Food Icons */}
        <div className="absolute top-20 right-20 text-6xl animate-bounce">
          🍔
        </div>

        <div className="absolute bottom-32 left-20 text-5xl animate-pulse">
          ☕
        </div>

        <div className="absolute top-1/2 right-40 text-5xl animate-bounce">
          🍕
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-[420px] bg-[#111827] p-10 rounded-3xl shadow-2xl border border-white/10">
          
          <h2 className="text-3xl font-bold text-white mb-8">
            Welcome Back
          </h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-4 rounded-xl bg-[#1A2333] text-white border border-white/10 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 p-4 rounded-xl bg-[#1A2333] text-white border border-white/10 outline-none"
          />

          <button
            onClick={onLogin}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold"
          >
            Login
          </button>

        </div>
      </div>
    </div>
  );
}

export default Login;