function Cart({
  cart,
  increaseQty,
  decreaseQty,
  openPayment,
}) {
  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const subtotal = total;
  const tax = Math.round(subtotal * 0.05);
  const discount = 0;

  const grandTotal =
    subtotal + tax - discount;

  return (
    <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-md">

      <h2 className="text-2xl font-bold text-white mb-5">
        Order Summary
      </h2>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">
            🛒
          </div>

          <h3 className="text-white text-lg font-semibold">
            Cart is Empty
          </h3>

          <p className="text-slate-400 mt-2">
            Add products to start billing
          </p>
        </div>
      ) : (
        <div className="max-h-72 overflow-y-auto pr-2">
          {cart.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl mb-3 bg-white/5 border border-white/10 hover:border-orange-500/40 transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-white">
                    {item.name}
                  </p>

                  <p className="text-sm text-slate-400">
                    ₹{item.price}
                  </p>
                </div>

                <div className="flex gap-3 items-center">
                  <button
                    onClick={() =>
                      decreaseQty(item.id)
                    }
                    className="w-8 h-8 rounded-full bg-orange-500/20 hover:bg-orange-500 hover:text-black transition-all"
                  >
                    -
                  </button>

                  <span className="font-bold text-white">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQty(item.id)
                    }
                    className="w-8 h-8 rounded-full bg-orange-500/20 hover:bg-orange-500 hover:text-black transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 border-t border-white/10 pt-5 text-white">

        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Tax (5%)</span>
          <span>₹{tax}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Discount</span>
          <span>₹{discount}</span>
        </div>

        <div className="flex justify-between text-lg font-bold mt-3">
          <span>Total</span>
          <span>₹{grandTotal}</span>
        </div>

      </div>

      <button
        onClick={openPayment}
        className="
          mt-6
          w-full
          py-4
          rounded-2xl
          bg-gradient-to-r
          from-orange-500
          to-orange-600
          font-bold
          text-lg
          shadow-lg
          hover:shadow-orange-500/40
          hover:scale-[1.02]
          transition-all
          duration-300
        "
      >
        Send To Kitchen
      </button>

    </div>
  );
}

export default Cart;