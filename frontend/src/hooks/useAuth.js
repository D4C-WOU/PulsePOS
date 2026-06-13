import { useState, useEffect } from "react";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Fake Login (Replace with API later)

      const userData = {
        id: 1,
        name: "Admin",
        email,
        role: "Manager",
      };

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      localStorage.setItem(
        "token",
        "pulsepos-demo-token"
      );

      setUser(userData);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
  };

  const isAuthenticated =
    !!localStorage.getItem("token");

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
  };
};

export default useAuth;