// src/store/authStore.js

import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  initializeAuth: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) return;

    set({
      token,
      user: JSON.parse(user),
      isAuthenticated: true,
    });
  },

  login: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));

    localStorage.setItem("token", token);

    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.clear();

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  hasRole: (role) => {
    const user = get().user;

    return user?.role === role;
  },
}));

export default useAuthStore;
