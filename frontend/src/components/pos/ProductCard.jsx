import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";

const ProductCard = ({
  product,
  onAddToCart,
}) => {
  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.02,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        bg-[#111827]
        border border-slate-800
        rounded-3xl
        overflow-hidden
        shadow-lg
      "
    >
      {/* Product Image */}
      <div className="h-44 bg-[#1F2937] overflow-hidden">
        <img
          src={
            product.image ||
            "https://via.placeholder.com/400x250"
          }
          alt={product.name}
          className="
            w-full
            h-full
            object-cover
          "
        />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <span
          className="
            inline-block
            px-3 py-1
            rounded-full
            bg-orange-500/10
            text-orange-500
            text-xs
            font-medium
            mb-3
          "
        >
          {product.category}
        </span>

        {/* Name */}
        <h3 className="text-lg font-bold text-white">
          {product.name}
        </h3>

        {/* Description */}
        <p
          className="
            text-slate-400
            text-sm
            mt-2
            line-clamp-2
          "
        >
          {product.description}
        </p>

        {/* Footer */}
        <div
          className="
            flex
            items-center
            justify-between
            mt-5
          "
        >
          <div>
            <p className="text-slate-500 text-xs">
              Price
            </p>

            <h4 className="text-xl font-bold text-white">
              ₹{product.price}
            </h4>
          </div>

          <button
            onClick={() =>
              onAddToCart(product)
            }
            className="
              flex
              items-center
              gap-2
              bg-orange-500
              hover:bg-orange-600
              text-white
              px-4
              py-2
              rounded-xl
              transition
            "
          >
            <FiPlus />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;