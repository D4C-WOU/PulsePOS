import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
} from "react-icons/fi";

const initialProducts = [
  {
    id: 1,
    name: "Burger",
    category: "Fast Food",
    price: 199,
    tax: 5,
    unit: "Piece",
    description: "Classic cheeseburger",
  },
  {
    id: 2,
    name: "Pizza",
    category: "Fast Food",
    price: 299,
    tax: 5,
    unit: "Piece",
    description: "Margherita pizza",
  },
  {
    id: 3,
    name: "Coffee",
    category: "Beverages",
    price: 99,
    tax: 5,
    unit: "Cup",
    description: "Fresh brewed coffee",
  },
  {
    id: 4,
    name: "Pasta",
    category: "Italian",
    price: 249,
    tax: 5,
    unit: "Plate",
    description: "Creamy white sauce pasta",
  },
];

const Products = () => {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    tax: "",
    unit: "",
    description: "",
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      tax: "",
      unit: "",
      description: "",
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowModal(true);
  };

  const saveProduct = () => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...formData, id: editingProduct.id }
            : p
        )
      );
    } else {
      setProducts((prev) => [
        ...prev,
        {
          ...formData,
          id: Date.now(),
        },
      ]);
    }

    setShowModal(false);
  };

  const deleteProduct = (id) => {
    setProducts((prev) =>
      prev.filter((p) => p.id !== id)
    );
  };

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0B1120] p-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Products
          </h1>

          <p className="text-slate-400 mt-2">
            Manage menu items and pricing
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={openAddModal}
          className="
            flex items-center gap-2
            bg-[#FF7A00]
            hover:bg-orange-600
            px-5 py-3
            rounded-2xl
            text-white
            font-medium
          "
        >
          <FiPlus />
          Add Product
        </motion.button>
      </div>

      {/* Search */}
      <div
        className="
          bg-[#111827]
          rounded-3xl
          border border-white/5
          shadow-xl
          p-4
          flex items-center
          mb-8
        "
      >
        <FiSearch className="text-slate-500" />

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            bg-transparent
            ml-3
            w-full
            text-white
            outline-none
            placeholder:text-slate-500
          "
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="
              bg-[#111827]
              rounded-3xl
              border border-white/5
              shadow-xl
              p-6
            "
          >
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {product.name}
                </h2>

                <span
                  className="
                    inline-block
                    mt-3
                    px-3 py-1
                    rounded-full
                    bg-orange-500/10
                    text-orange-400
                    text-sm
                  "
                >
                  {product.category}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    openEditModal(product)
                  }
                  className="text-blue-400"
                >
                  <FiEdit2 />
                </button>

                <button
                  onClick={() =>
                    deleteProduct(product.id)
                  }
                  className="text-red-400"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-3xl font-bold text-white">
                ₹{product.price}
              </h3>

              <div className="mt-4 space-y-2">
                <p className="text-slate-400 text-sm">
                  Tax: {product.tax}%
                </p>

                <p className="text-slate-400 text-sm">
                  Unit: {product.unit}
                </p>

                <p className="text-slate-500 text-sm">
                  {product.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className="
              bg-[#111827]
              border border-white/5
              rounded-3xl
              shadow-2xl
              w-full
              max-w-xl
              p-6
            "
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingProduct
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              <button
                onClick={() =>
                  setShowModal(false)
                }
              >
                <FiX className="text-white text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                "name",
                "category",
                "price",
                "tax",
                "unit",
              ].map((field) => (
                <input
                  key={field}
                  placeholder={
                    field.charAt(0).toUpperCase() +
                    field.slice(1)
                  }
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field]: e.target.value,
                    })
                  }
                  className="
                    w-full
                    bg-[#1A2333]
                    rounded-2xl
                    p-4
                    text-white
                    outline-none
                  "
                />
              ))}

              <textarea
                rows="4"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="
                  w-full
                  bg-[#1A2333]
                  rounded-2xl
                  p-4
                  text-white
                  outline-none
                "
              />

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={saveProduct}
                className="
                  w-full
                  py-4
                  rounded-2xl
                  bg-[#FF7A00]
                  hover:bg-orange-600
                  text-white
                  font-semibold
                "
              >
                Save Product
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Products;