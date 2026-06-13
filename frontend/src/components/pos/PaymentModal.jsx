function PaymentModal({
  total,
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">
          Order Summary
        </h2>

       <div className="bg-gray-100 p-4 rounded-lg mb-4">

  <div className="flex justify-between">
    <span>Subtotal</span>
    <span>₹{total}</span>
  </div>

  <div className="flex justify-between">
    <span>Tax (5%)</span>
    <span>
      ₹{Math.round(total * 0.05)}
    </span>
  </div>

  <hr className="my-2" />

  <div className="flex justify-between font-bold text-lg">
    <span>Total</span>
    <span>
      ₹{total + Math.round(total * 0.05)}
    </span>
  </div>

</div>

        <div className="flex gap-2">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Cash
          </button>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            UPI
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default PaymentModal;