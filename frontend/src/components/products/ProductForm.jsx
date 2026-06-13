import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ProductForm = ({
  initialData,
  onSubmit,
  submitText = "Save Product",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    tax: "",
    unit: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.category ||
      !formData.price
    ) {
      alert("Please fill all required fields.");
      return;
    }

    onSubmit(formData);

    setFormData({
      name: "",
      category: "",
      price: "",
      tax: "",
      unit: "",
      description: "",
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="bg-[#111827] rounded-3xl border border-white/5 shadow-xl p-8 space-y-5"
    >
      <div>
        <label className="text-slate-300 mb-2 block">
          Product Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Burger"
          className="w-full bg-[#1A2333] rounded-xl p-4 text-white outline-none"
        />
      </div>

      <div>
        <label className="text-slate-300 mb-2 block">
          Category
        </label>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full bg-[#1A2333] rounded-xl p-4 text-white outline-none"
        >
          <option value="">Select Category</option>
          <option>Fast Food</option>
          <option>Beverages</option>
          <option>Italian</option>
          <option>Desserts</option>
        </select>
      </div>

      <div className="grid md:grid-cols-3 gap-4">

        <div>
          <label className="text-slate-300 mb-2 block">
            Price
          </label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full bg-[#1A2333] rounded-xl p-4 text-white outline-none"
          />
        </div>

        <div>
          <label className="text-slate-300 mb-2 block">
            Tax (%)
          </label>

          <input
            type="number"
            name="tax"
            value={formData.tax}
            onChange={handleChange}
            className="w-full bg-[#1A2333] rounded-xl p-4 text-white outline-none"
          />
        </div>

        <div>
          <label className="text-slate-300 mb-2 block">
            Unit
          </label>

          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            placeholder="Piece"
            className="w-full bg-[#1A2333] rounded-xl p-4 text-white outline-none"
          />
        </div>

      </div>

      <div>
        <label className="text-slate-300 mb-2 block">
          Description
        </label>

        <textarea
          rows="5"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description..."
          className="w-full bg-[#1A2333] rounded-xl p-4 text-white outline-none resize-none"
        />
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 py-4 rounded-xl text-white font-semibold transition"
      >
        {submitText}
      </motion.button>
    </motion.form>
  );
};

export default ProductForm;