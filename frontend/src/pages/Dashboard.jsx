import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiClock,
  FiPlus,
  FiList,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import AnalyticsCard from "../components/dashboard/AnalyticsCard";
import RevenueCard from "../components/dashboard/RevenueCard";
import OrdersChart from "../components/dashboard/OrdersChart";
import TopProducts from "../components/dashboard/TopProducts";
import KitchenQueue from "../components/kitchen/KitchenQueue";
import RecentOrders from "../components/dashboard/RecentOrders";

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0B1120]"
    >
      <div className="p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold text-white">
              Dashboard
            </h1>

            <p className="text-slate-400 mt-2">
              Restaurant performance overview
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4 mt-4 md:mt-0">

            <Link
              to="/products/add"
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-xl font-medium transition"
            >
              <FiPlus />
              Add Product
            </Link>

            <Link
              to="/orders"
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl transition"
            >
              <FiList />
              View Orders
            </Link>

          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <AnalyticsCard
            title="Revenue Today"
            value="₹14,500"
            icon={<FiDollarSign />}
            trend="+12%"
            positive
          />

          <AnalyticsCard
            title="Orders"
            value="43"
            icon={<FiShoppingBag />}
            trend="+8%"
            positive
          />

          <AnalyticsCard
            title="Tables"
            value="8"
            icon={<FiUsers />}
            trend="+5%"
            positive
          />

          <AnalyticsCard
            title="Kitchen Queue"
            value="2"
            icon={<FiClock />}
            trend="-15%"
            positive={false}
          />

        </div>

        {/* Revenue */}
        <div className="mt-8">
          <RevenueCard />
        </div>

        {/* Weekly Orders */}
        <div className="mt-8">
          <OrdersChart />
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

          <TopProducts />

          <KitchenQueue />

        </div>

        {/* Recent Orders */}
        <div className="mt-8">
          <RecentOrders />
        </div>

      </div>
    </motion.div>
  );
};

export default Dashboard;