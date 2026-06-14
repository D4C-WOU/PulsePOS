import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

// Auth Pages
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

// KDS Page
import KitchenDisplay from "../pages/kds/KitchenDisplay";

// POS Pages
import POSMain from "../pages/pos/POSMain";
import OrdersList from "../pages/pos/OrdersList";
import OrderDetail from "../pages/pos/OrderDetail";
import Customers from "../pages/pos/Customers";
import TableView from "../pages/pos/TableView";

// Backend Pages
import Dashboard from "../pages/backend/Dashboard";
import Products from "../pages/backend/Products";
import Categories from "../pages/backend/Categories";
import PaymentMethods from "../pages/backend/PaymentMethods";
import Floors from "../pages/backend/Floors";
import Coupons from "../pages/backend/Coupons";
import Promotions from "../pages/backend/Promotions";
import Users from "../pages/backend/Users";

// Root Redirect component
const RootRedirect = () => {
  const token = useAuthStore((state) => state.token);
  return token ? <Navigate to="/pos" replace /> : <Navigate to="/login" replace />;
};

// Protected Route wrapper for any authenticated user
const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin Route wrapper for admin role
const AdminRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== "admin") {
    return <Navigate to="/pos" replace />;
  }
  return children;
};

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/kds" element={<KitchenDisplay />} />

      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* POS Terminal Routes - requires any authenticated user */}
      <Route
        path="/pos"
        element={
          <ProtectedRoute>
            <POSMain />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pos/orders"
        element={
          <ProtectedRoute>
            <OrdersList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pos/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pos/customers"
        element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pos/table-view"
        element={
          <ProtectedRoute>
            <TableView />
          </ProtectedRoute>
        }
      />

      {/* Backend Admin Routes - requires admin role */}
      <Route
        path="/backend/dashboard"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/backend/products"
        element={
          <AdminRoute>
            <Products />
          </AdminRoute>
        }
      />
      <Route
        path="/backend/categories"
        element={
          <AdminRoute>
            <Categories />
          </AdminRoute>
        }
      />
      <Route
        path="/backend/payment-methods"
        element={
          <AdminRoute>
            <PaymentMethods />
          </AdminRoute>
        }
      />
      <Route
        path="/backend/floors"
        element={
          <AdminRoute>
            <Floors />
          </AdminRoute>
        }
      />
      <Route
        path="/backend/coupons"
        element={
          <AdminRoute>
            <Coupons />
          </AdminRoute>
        }
      />
      <Route
        path="/backend/promotions"
        element={
          <AdminRoute>
            <Promotions />
          </AdminRoute>
        }
      />
      <Route
        path="/backend/users"
        element={
          <AdminRoute>
            <Users />
          </AdminRoute>
        }
      />

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
