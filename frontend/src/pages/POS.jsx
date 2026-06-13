import { useState } from "react";

import SearchBar from "../components/pos/SearchBar";
import ProductCard from "../components/pos/ProductCard";
import Cart from "../components/pos/Cart";
import OrderSummary from "../components/pos/OrderSummary";
import PaymentModal from "../components/pos/PaymentModal";

const initialProducts = [
  {
    id: 1,
    name: "Burger",
    category: "Fast Food",
    description: "Cheese burger with fries",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },
  {
    id: 2,
    name: "Pizza",
    category: "Italian",
    description: "Farmhouse Pizza",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  },
  {
    id: 3,
    name: "Coffee",
    category: "Beverage",
    description: "Hot Cappuccino",
    price: 99,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
  },
  {
    id: 4,
    name: "Pasta",
    category: "Italian",
    description: "White Sauce Pasta",
    price: 249,
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
  },
];

const POS = () => {
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [showPayment, setShowPayment] =
    useState(false);

  // Add Product
  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  // Increase Qty
  const handleIncrease = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  // Decrease Qty
  const handleDecrease = (id) => {
    setCartItems(
      cartItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  // Remove Item
  const handleRemove = (id) => {
    setCartItems(
      cartItems.filter(
        (item) => item.id !== id
      )
    );
  };

  // Filter Products
  const filteredProducts =
    initialProducts.filter((product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.05;

  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-[#0B1120] p-6">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Point Of Sale
        </h1>

        <p className="text-slate-400 mt-2">
          Create and manage orders
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Products Section */}
        <div className="xl:col-span-2">
          
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search products..."
          />

          <div
            className="
              mt-6
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-6
            "
          >
            {filteredProducts.map(
              (product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={
                    handleAddToCart
                  }
                />
              )
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div className="space-y-6">
          
          <div className="h-[500px]">
            <Cart
              cartItems={cartItems}
              onIncrease={
                handleIncrease
              }
              onDecrease={
                handleDecrease
              }
              onRemove={handleRemove}
            />
          </div>

          <OrderSummary
            cartItems={cartItems}
            taxRate={5}
            discount={0}
          />

          <button
            onClick={() =>
              setShowPayment(true)
            }
            disabled={
              cartItems.length === 0
            }
            className="
              w-full
              bg-orange-500
              hover:bg-orange-600
              disabled:bg-slate-700
              disabled:text-slate-500
              text-white
              py-3
              rounded-xl
              font-semibold
              transition
            "
          >
            Checkout
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() =>
          setShowPayment(false)
        }
        totalAmount={total}
        onPaymentComplete={(data) => {
          console.log(
            "Payment Success:",
            data
          );

          setCartItems([]);
          setShowPayment(false);
        }}
      />
    </div>
  );
};

export default POS;