import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import POS from "./pages/POS";
import Kitchen from "./pages/Kitchen";
import Tables from "./pages/Tables";
import Login from "./pages/Login";

import KitchenDisplay from "./pages/KitchenDisplay";
import TableSelection from "./pages/TableSelection";

import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";


function Layout() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <main className="flex-1 p-6 overflow-auto">

          <Routes>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/orders"
              element={<Orders />}
            />

            <Route
              path="/pos"
              element={<POS />}
            />

            {/* Normal kitchen page */}
            <Route
              path="/kitchen"
              element={<Kitchen />}
            />


            {/* Realtime kitchen display */}
            <Route
              path="/kitchen-display"
              element={<KitchenDisplay />}
            />


            <Route
              path="/tables"
              element={<Tables />}
            />


            {/* Table selection flow */}
            <Route
              path="/table-selection"
              element={<TableSelection />}
            />


            <Route
              path="*"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

          </Routes>

        </main>

      </div>

    </div>
  );
}


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />


        {/* Default */}
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


        {/* Main application */}
        <Route
          path="/*"
          element={<Layout />}
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;