import { motion } from "framer-motion";

const products = [
  {
    rank: "🥇",
    name: "Burger",
    sales: "₹4,500",
  },
  {
    rank: "🥈",
    name: "Pizza",
    sales: "₹3,200",
  },
  {
    rank: "🥉",
    name: "Coffee",
    sales: "₹2,500",
  },
  {
    rank: "🏅",
    name: "Pasta",
    sales: "₹1,800",
  },
];

const TopProducts = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="
        rounded-3xl
        bg-[#111827]
        p-6
        border
        border-white/5
        shadow-xl
      "
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          Top Selling Products
        </h2>

        <p className="text-slate-400 text-sm mt-1">
          Best performing menu items
        </p>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        {products.map((product) => (
          <motion.div
            key={product.name}
            whileHover={{ scale: 1.02 }}
            className="
              flex
              justify-between
              items-center
              p-4
              rounded-2xl
              bg-[#1A2333]
            "
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">
                {product.rank}
              </span>

              <span className="text-white font-medium">
                {product.name}
              </span>
            </div>

            <span className="text-[#FF7A00] font-semibold">
              {product.sales}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TopProducts;