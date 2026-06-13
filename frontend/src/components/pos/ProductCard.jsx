function ProductCard({ product, addToCart }) {
  return (
    <div
      className="
      bg-[#111827]
      border border-white/10
      rounded-3xl
      p-5
      shadow-xl
      hover:shadow-orange-500/20
      hover:-translate-y-1
      transition-all
      duration-300
      "
    >
      <div className="text-center">

        <div className="text-5xl mb-3">
          🍔
        </div>

        <h3 className="text-lg font-bold text-white">
          {product.name}
        </h3>

        <p className="text-slate-400 text-sm mt-1">
          Fresh & Delicious
        </p>

        <p className="text-2xl font-bold text-orange-500 mt-4">
          ₹{product.price}
        </p>

        <button
          onClick={() => addToCart(product)}
          className="
          mt-5
          w-full
          py-3
          rounded-2xl
          bg-gradient-to-r
          from-orange-500
          to-orange-600
          text-white
          font-semibold
          hover:scale-[1.03]
          transition-all
          duration-300
          "
        >
          + Add To Order
        </button>

      </div>
    </div>
  );
}

export default ProductCard;