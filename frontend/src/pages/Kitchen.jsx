import { motion } from "framer-motion";
import KitchenCard from "../components/kitchen/KitchenCard";
import KitchenQueue from "../components/kitchen/KitchenQueue";

const orders = [
  {
    id: "#1021",
    table: "Table 5",
    status: "Preparing",
    time: "12 mins ago",
    items: [
      { name: "Burger", qty: 2 },
      { name: "Coffee", qty: 1 },
    ],
  },
  {
    id: "#1022",
    table: "Table 2",
    status: "Cooking",
    time: "8 mins ago",
    items: [
      { name: "Pizza", qty: 1 },
      { name: "Pasta", qty: 2 },
    ],
  },
  {
    id: "#1023",
    table: "Table 7",
    status: "Ready",
    time: "5 mins ago",
    items: [
      { name: "Coffee", qty: 3 },
      { name: "Burger", qty: 1 },
    ],
  },
  {
    id: "#1024",
    table: "Table 3",
    status: "Preparing",
    time: "2 mins ago",
    items: [
      { name: "Pasta", qty: 2 },
    ],
  },
];

const Kitchen = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      className="
        min-h-screen
        bg-[#0B1120]
        p-6
      "
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Kitchen Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Monitor and manage kitchen orders
        </p>
      </div>

      {/* Top Section */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
          mb-8
        "
      >
        <div className="xl:col-span-1">
          <KitchenQueue />
        </div>

        <div
          className="
            xl:col-span-2
            bg-[#111827]
            border border-slate-800
            rounded-3xl
            p-6
          "
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Kitchen Overview
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#1F2937] rounded-2xl p-4">
              <p className="text-slate-400 text-sm">
                Active Orders
              </p>

              <h3 className="text-3xl font-bold text-orange-500 mt-2">
                8
              </h3>
            </div>

            <div className="bg-[#1F2937] rounded-2xl p-4">
              <p className="text-slate-400 text-sm">
                Ready Orders
              </p>

              <h3 className="text-3xl font-bold text-green-500 mt-2">
                12
              </h3>
            </div>

            <div className="bg-[#1F2937] rounded-2xl p-4">
              <p className="text-slate-400 text-sm">
                Avg Prep Time
              </p>

              <h3 className="text-3xl font-bold text-blue-500 mt-2">
                14m
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6">
          Active Orders
        </h2>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
          "
        >
          {orders.map((order) => (
            <KitchenCard
              key={order.id}
              orderId={order.id}
              table={order.table}
              status={order.status}
              time={order.time}
              items={order.items}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Kitchen;