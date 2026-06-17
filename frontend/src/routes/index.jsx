import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import AddProduct from "../pages/AddProduct";

import ProtectedRoute from "../components/common/ProtectedRoute";

import Login from "../pages/Login";

import Dashboard from "../pages/Dashboard";
import POS from "../pages/POS";
import Orders from "../pages/Orders";


import Kitchen from "../pages/Kitchen";

import Products from "../pages/Products";


import Tables from "../pages/Tables";

import Categories from "../pages/Categories";

// New Pages
import Reports from "../pages/Reports";
import Employees from "../pages/Employees";
import Customers from "../pages/Customers";
import Payments from "../pages/Payments";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to="/dashboard" replace />}
          />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/pos" element={<POS />} />

          <Route path="/orders" element={<Orders />} />


          <Route path="/kitchen" element={<Kitchen />} />

          <Route path="/products" element={<Products />} />
          <Route
            path="/products/add"
            element={<AddProduct />}
          />

          <Route
            path="/products/edit/:id"
            element={<AddProduct />}
          />

          <Route path="/tables" element={<Tables />} />

          <Route
            path="/categories"
            element={<Categories />}
          />

          <Route
            path="/payments"
            element={<Payments />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/employees"
            element={<Employees />}
          />
          <Route
            path="/customers"
            element={<Customers />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;