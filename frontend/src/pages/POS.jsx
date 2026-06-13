import { useState } from "react";
import Navbar from "../components/common/Navbar";
import ProductCard from "../components/pos/ProductCard";
import Cart from "../components/pos/Cart";
import SearchBar from "../components/pos/SearchBar";
import PaymentModal from "../components/pos/PaymentModal";
import { products } from "../data/products";

function POS() {
  const [search, setSearch] =
    useState("");
    const [selectedCategory, setSelectedCategory] =
  useState("All");

  const [cart, setCart] = useState([]);
  const [showPayment, setShowPayment] =
  useState(false);

  const addToCart = (product) => {
    const existing = cart.find(
      (item) => item.id === product.id
    );

    if (existing) {
      setCart(
        cart.map((item) =>
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
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
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

  const decreaseQty = (id) => {
    setCart(
      cart
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

  const filteredProducts = products.filter(
  (product) => {
    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category ===
        selectedCategory;
        const total = cart.reduce(
  (sum, item) =>
    sum + item.price * item.quantity,
  0
);

    return (
      matchesSearch &&
      matchesCategory
    );
  }
);

  return (
     <>
      <Navbar 
      search={search}
      setSearch={setSearch}
      />
    <div className="p-6">
        {/* <SearchBar
          search={search}
          setSearch={setSearch}
        /> */}

      <div className="grid grid-cols-3 gap-6 h-[calc(100vh-120px)]">
        <div>
          <h2 className="font-bold mb-3">
            Categories
          </h2>

        <p
  className={`cursor-pointer p-2 rounded ${
    selectedCategory === "All"
      ? "bg-orange-500 text-white"
      : ""
  }`}
  onClick={() =>
    setSelectedCategory("All")
  }
>
  All
</p>
<p
  className={`cursor-pointer p-2 rounded ${
    selectedCategory === "Burgers"
      ? "bg-orange-500 text-white"
      : ""
  }`}
  onClick={() =>
    setSelectedCategory("Burgers")
  }
>
  Burgers
</p>

<p
  className={`cursor-pointer p-2 rounded ${
    selectedCategory === "Drinks"
      ? "bg-orange-500 text-white"
      : ""
  }`}
  onClick={() =>
    setSelectedCategory("Drinks")
  }
>
  Drinks
</p>

<p
  className={`cursor-pointer p-2 rounded ${
    selectedCategory === "Snacks"
      ? "bg-orange-500 text-white"
      : ""
  }`}
  onClick={() =>
    setSelectedCategory("Snacks")
  }
>
  Snacks
</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            )
          )}
        </div>

        <Cart
          cart={cart}
          increaseQty={increaseQty}
          decreaseQty={decreaseQty}
          openPayment={() => setShowPayment(true)}
        />
      </div>
      {showPayment && (
        <PaymentModal
          total={cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
    </>
  );
}

export default POS;