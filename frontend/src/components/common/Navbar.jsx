import { motion } from "framer-motion";
import {
  FiBell,
  FiSearch,
  FiLogOut,
  FiCalendar,
} from "react-icons/fi";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const pageTitle = {
    "/dashboard": "Dashboard",
    "/products": "Products",
    "/products/add": "Add Product",
    "/categories": "Categories",
    "/orders": "Order History",
    "/pos": "POS",
    "/kitchen": "Kitchen",
    "/tables": "Tables",
  };

  const title = pageTitle[location.pathname] || "Dashboard";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="sticky top-0 z-50 bg-[#0B1120]/95 backdrop-blur-lg border-b border-white/5"
    >
      <div className="h-[80px] px-8 flex items-center justify-between">

        {/* Left */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            {title}
          </h1>

          <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
            <FiCalendar />
            <span>{today}</span>
          </div>
        </div>

        {/* Search */}
        <div className="hidden lg:flex items-center">
          <div className="flex items-center bg-[#111827] border border-white/5 rounded-2xl px-4 py-3 w-[350px]">
            <FiSearch className="text-slate-500 mr-3" />

            <input
              type="text"
              placeholder="Search products, orders..."
              className="bg-transparent outline-none text-white w-full placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">

          {/* Notification */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative h-12 w-12 rounded-2xl bg-[#111827] border border-white/5 flex items-center justify-center"
          >
            <FiBell className="text-white" size={20} />

            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 text-xs flex items-center justify-center">
              3
            </span>
          </motion.button>

          {/* Profile */}
          <div className="hidden md:flex items-center gap-3">

            <div className="h-12 w-12 rounded-2xl bg-orange-500 flex items-center justify-center font-bold">
              A
            </div>

            <div>
              <h3 className="font-semibold">
                Admin
              </h3>

              <p className="text-slate-400 text-sm">
                Restaurant Manager
              </p>
            </div>
          </div>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-12 px-4 rounded-xl bg-red-500 hover:bg-red-600 transition flex items-center gap-2"
          >
            <FiLogOut />
            <span className="hidden lg:block">
              Logout
            </span>
          </motion.button>

        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;