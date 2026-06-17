import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });

  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      try {
        // TODO:
        // Replace with actual API call

        const product = {
          name: "Burger",
          category: "Fast Food",
          price: 249,
          stock: 100,
          description: "Classic Burger",
        };

        setFormData(product);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEditMode) {
        console.log("UPDATE PRODUCT", formData);

        // await updateProduct(id, formData);
      } else {
        console.log("CREATE PRODUCT", formData);

        // await createProduct(formData);
      }

      navigate("/products");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          {isEditMode
            ? "Edit Product"
            : "Add Product"}
        </h1>

        <p className="text-slate-400 mt-2">
          Manage restaurant products
        </p>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>
            <label className="block text-sm mb-2 text-slate-300">
              Product Name
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="
                w-full
                bg-[#1F2937]
                border
                border-slate-700
                rounded-xl
                p-3
                text-white
                outline-none
              "
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-slate-300">
              Category
            </label>

            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="
                w-full
                bg-[#1F2937]
                border
                border-slate-700
                rounded-xl
                p-3
                text-white
              "
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm mb-2 text-slate-300">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="
                  w-full
                  bg-[#1F2937]
                  border
                  border-slate-700
                  rounded-xl
                  p-3
                  text-white
                "
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-slate-300">
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="
                  w-full
                  bg-[#1F2937]
                  border
                  border-slate-700
                  rounded-xl
                  p-3
                  text-white
                "
              />
            </div>

          </div>

          <div>
            <label className="block text-sm mb-2 text-slate-300">
              Description
            </label>

            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="
                w-full
                bg-[#1F2937]
                border
                border-slate-700
                rounded-xl
                p-3
                text-white
              "
            />
          </div>

          <div className="flex gap-3">

            <button
              type="submit"
              disabled={loading}
              className="
                px-6
                py-3
                rounded-xl
                bg-orange-500
                hover:bg-orange-600
                font-medium
              "
            >
              {loading
                ? "Saving..."
                : isEditMode
                  ? "Update Product"
                  : "Create Product"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              className="
                px-6
                py-3
                rounded-xl
                bg-slate-700
                hover:bg-slate-600
              "
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddProduct;