import api from "./api";

// Get all products
export const getProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get single product
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Create product
export const createProduct = async (productData) => {
  try {
    const response = await api.post("/products", productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update product
export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Search products
export const searchProducts = async (keyword) => {
  try {
    const response = await api.get(`/products?search=${keyword}`);
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

// Filter by category
export const getProductsByCategory = async (category) => {
  try {
    const response = await api.get(
      `/products?category=${category}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching category products:", error);
    throw error;
  }
};