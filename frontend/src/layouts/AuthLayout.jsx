import { Outlet, Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const AuthLayout = () => {
  const token = useAuthStore((s) => s.token);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0B1120]">
      <Outlet />
    </div>
  );
};

export default AuthLayout;