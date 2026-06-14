import useAuthStore from "../store/authStore";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    token,
    setUser,
    logout,
    isAdmin: user?.role === "admin",
    isEmployee: user?.role === "employee" || user?.role === "admin",
    isAuthenticated: !!token,
  };
};

export default useAuth;
