import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(
    localStorage.getItem("user")
  ) || null,

  token:
    localStorage.getItem("token") ||
    null,

  isAuthenticated:
    !!localStorage.getItem("token"),

  login: (userData, token) => {
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "token",
      token
    );

    set({
      user: userData,
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;