// Currency Formatter

export const formatCurrency = (
  amount
) => {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
    }
  ).format(amount);
};


// Date Formatter

export const formatDate = (
  date
) => {
  return new Date(
    date
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


// Date & Time Formatter

export const formatDateTime = (
  date
) => {
  return new Date(
    date
  ).toLocaleString("en-IN");
};


// Generate Order Number

export const generateOrderNumber =
  () => {
    return (
      "ORD-" +
      Math.floor(
        1000 + Math.random() * 9000
      )
    );
  };


// Calculate Cart Total

export const calculateTotal = (
  cartItems
) => {
  return cartItems.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity,
    0
  );
};


// Calculate Tax

export const calculateTax = (
  subtotal,
  taxRate = 5
) => {
  return (
    subtotal * taxRate
  ) / 100;
};


// Calculate Grand Total

export const calculateGrandTotal =
  (
    subtotal,
    taxRate = 5,
    discount = 0
  ) => {
    const tax =
      calculateTax(
        subtotal,
        taxRate
      );

    return (
      subtotal +
      tax -
      discount
    );
  };


// Get Status Color

export const getStatusColor = (
  status
) => {
  switch (status) {
    case "Completed":
    case "Ready":
      return "text-green-500";

    case "Preparing":
      return "text-orange-500";

    case "Pending":
      return "text-blue-500";

    case "Cancelled":
      return "text-red-500";

    default:
      return "text-slate-400";
  }
};


// Capitalize First Letter

export const capitalize = (
  text
) => {
  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );
};