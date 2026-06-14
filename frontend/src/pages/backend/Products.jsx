import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Tag, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import BackendLayout from "../../components/backend/BackendLayout";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Toggle from "../../components/common/Toggle";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Badge from "../../components/common/Badge";

import { getProductsApi, createProductApi, updateProductApi, deleteProductApi } from "../../api/product.api";
import { getCategoriesApi, createCategoryApi } from "../../api/category.api";
import formatCurrency from "../../utils/formatCurrency";

export const Products = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  
  // UI states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Inline category creation mini-form state
  const [showMiniCategory, setShowMiniCategory] = useState(false);
  const [miniCategoryName, setMiniCategoryName] = useState("");
  const [miniCategoryColor, setMiniCategoryColor] = useState("#52B788");

  // Filtering states
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("true"); // "true", "false", "all"

  // Fetch Products & Categories
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products", categoryFilter, searchFilter, activeFilter],
    queryFn: () => getProductsApi({
      category_id: categoryFilter || undefined,
      search: searchFilter || undefined,
      is_active: activeFilter,
    }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesApi,
  });

  const products = productsData?.data || [];
  const categories = categoriesData?.data || [];

  // Create Product Mutation
  const createMutation = useMutation({
    mutationFn: createProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully!");
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create product");
    }
  });

  // Update Product Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProductApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully!");
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update product");
    }
  });

  // Delete Product Mutation (Soft Delete)
  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product archived/soft-deleted successfully!");
      setDeletingProduct(null);
      setIsDeleting(false);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to archive product");
      setIsDeleting(false);
    }
  });

  // Create Category Mutation (for inline mini-form)
  const createCategoryMutation = useMutation({
    mutationFn: createCategoryApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("New category added successfully!");
      if (res.success && res.data) {
        // Select newly created category in dropdown
        setValue("category_id", res.data.id);
      }
      setShowMiniCategory(false);
      setMiniCategoryName("");
      setMiniCategoryColor("#52B788");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add category");
    }
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setShowMiniCategory(false);
    reset({
      name: "",
      category_id: "",
      price: "",
      unit_of_measure: "per piece",
      tax_percentage: "5.00",
      description: "",
      show_on_kds: true,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setShowMiniCategory(false);
    reset({
      name: product.name,
      category_id: product.category?.id || "",
      price: product.price,
      unit_of_measure: product.unit_of_measure,
      tax_percentage: product.tax_percentage,
      description: product.description || "",
      show_on_kds: product.show_on_kds,
      is_active: product.is_active,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    reset();
  };

  const onSubmit = (formData) => {
    const payload = {
      name: formData.name,
      category_id: formData.category_id ? parseInt(formData.category_id, 10) : null,
      price: parseFloat(formData.price),
      unit_of_measure: formData.unit_of_measure,
      tax_percentage: parseFloat(formData.tax_percentage),
      description: formData.description,
      show_on_kds: !!formData.show_on_kds,
      is_active: !!formData.is_active,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleCreateMiniCategory = (e) => {
    e.preventDefault();
    if (!miniCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }
    createCategoryMutation.mutate({
      name: miniCategoryName,
      color: miniCategoryColor,
    });
  };

  const handleDeleteClick = (product) => {
    setDeletingProduct(product);
  };

  const handleConfirmDelete = () => {
    if (deletingProduct) {
      setIsDeleting(true);
      deleteMutation.mutate(deletingProduct.id);
    }
  };

  const columns = [
    { key: "name", label: "Product Name" },
    {
      key: "category",
      label: "Category",
      render: (row) => {
        if (!row.category) return <span className="text-cafe-text-muted">None</span>;
        return (
          <span 
            className="px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ 
              backgroundColor: `${row.category.color}15`, 
              color: row.category.color,
              border: `1px solid ${row.category.color}40`
            }}
          >
            {row.category.name}
          </span>
        );
      },
    },
    {
      key: "price",
      label: "Price",
      render: (row) => formatCurrency(row.price),
    },
    {
      key: "tax_percentage",
      label: "Tax %",
      render: (row) => `${parseFloat(row.tax_percentage)}%`,
    },
    { key: "unit_of_measure", label: "UoM" },
    {
      key: "show_on_kds",
      label: "KDS Screen",
      render: (row) => (
        <Badge variant={row.show_on_kds ? "green" : "gray"}>
          {row.show_on_kds ? "Show" : "Hide"}
        </Badge>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <Badge variant={row.is_active ? "green" : "gray"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleOpenEditModal(row)}
            className="p-1.5"
          >
            <Pencil size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDeleteClick(row)}
            className="p-1.5 text-cafe-danger hover:bg-cafe-danger/10 hover:text-red-500"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <BackendLayout>
      <div className="flex justify-between items-center mb-6 select-none">
        <div>
          <h1 className="text-2xl font-bold text-cafe-beige-mid">Products</h1>
          <p className="text-sm text-cafe-text-muted">Manage items available in the point-of-sale menu</p>
        </div>
        <Button onClick={handleOpenAddModal}>
          <Plus size={18} /> Add Product
        </Button>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-cafe-bg-card border border-cafe-border p-4 rounded-lg mb-6 items-center">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-3 text-cafe-text-muted">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full py-2 pl-10 pr-3 rounded-lg text-sm text-cafe-text-primary bg-cafe-bg-input border border-cafe-border focus:outline-none focus:ring-2 focus:ring-cafe-green-mid focus:border-transparent placeholder:text-cafe-text-muted"
          />
        </div>

        {/* Category */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full py-2 px-3 rounded-lg text-sm text-cafe-text-primary bg-cafe-bg-input border border-cafe-border focus:outline-none focus:ring-2 focus:ring-cafe-green-mid focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Active Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-cafe-text-muted uppercase tracking-wide">Status:</span>
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="flex-1 py-2 px-3 rounded-lg text-sm text-cafe-text-primary bg-cafe-bg-input border border-cafe-border focus:outline-none focus:ring-2 focus:ring-cafe-green-mid focus:border-transparent"
          >
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
            <option value="all">All Statuses</option>
          </select>
        </div>
      </div>

      {/* Products DataTable */}
      <DataTable
        headers={columns}
        data={products}
        isLoading={productsLoading}
        emptyMessage="No products match the criteria."
      />

      {/* Product Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? "Edit Product" : "Add Product"}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Product Name *"
            placeholder="e.g. Cold Coffee"
            error={errors.name?.message}
            {...register("name", { required: "Product name is required" })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category selection */}
            <div className="flex flex-col gap-1.5 relative">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-cafe-text-secondary">Category</label>
                <button
                  type="button"
                  onClick={() => setShowMiniCategory(!showMiniCategory)}
                  className="text-xs font-bold text-cafe-green-light hover:text-cafe-green-mid underline transition-colors"
                >
                  {showMiniCategory ? "Hide" : "+ New Category"}
                </button>
              </div>
              <select
                className="w-full py-2 px-3 rounded-lg text-cafe-text-primary bg-cafe-bg-input border border-cafe-green-light focus:outline-none focus:ring-2 focus:ring-cafe-green-mid focus:border-transparent"
                {...register("category_id")}
              >
                <option value="">No Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <Input
              label="Price (₹) *"
              type="number"
              step="0.01"
              placeholder="120.00"
              error={errors.price?.message}
              {...register("price", {
                required: "Price is required",
                validate: (v) => parseFloat(v) > 0 || "Price must be greater than 0",
              })}
            />
          </div>

          {/* Inline mini category creator */}
          {showMiniCategory && (
            <div className="border border-cafe-green-mid/20 bg-cafe-green-pale/35 p-4 rounded-lg flex flex-col gap-3 animate-scale-up">
              <h4 className="text-xs font-bold text-cafe-text-secondary uppercase tracking-wide">
                Quick Category Creator
              </h4>
              <div className="flex flex-col md:flex-row gap-3 items-end">
                <Input
                  label="Category Name"
                  placeholder="e.g. Hot Drinks"
                  value={miniCategoryName}
                  onChange={(e) => setMiniCategoryName(e.target.value)}
                  className="flex-1"
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-cafe-text-secondary">Color</label>
                  <input
                    type="color"
                    value={miniCategoryColor}
                    onChange={(e) => setMiniCategoryColor(e.target.value)}
                    className="w-12 h-9 rounded border border-cafe-border cursor-pointer bg-transparent"
                  />
                </div>
                <Button 
                  onClick={handleCreateMiniCategory}
                  disabled={createCategoryMutation.isPending}
                  className="py-2.5"
                >
                  {createCategoryMutation.isPending ? "Saving..." : "Create"}
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Unit of measure */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-cafe-text-secondary">Unit of Measure</label>
              <select
                className="w-full py-2 px-3 rounded-lg text-cafe-text-primary bg-cafe-bg-input border border-cafe-green-light focus:outline-none focus:ring-2 focus:ring-cafe-green-mid focus:border-transparent"
                {...register("unit_of_measure")}
              >
                <option value="per piece">per piece</option>
                <option value="per kg">per kg</option>
                <option value="per litre">per litre</option>
                <option value="per serving">per serving</option>
              </select>
            </div>

            {/* Tax Percentage */}
            <Input
              label="Tax Percentage (%) *"
              type="number"
              step="0.01"
              placeholder="5.00"
              error={errors.tax_percentage?.message}
              {...register("tax_percentage", {
                required: "Tax % is required",
                validate: (v) => (parseFloat(v) >= 0 && parseFloat(v) <= 100) || "Tax must be between 0 and 100",
              })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-cafe-text-secondary">Description</label>
            <textarea
              placeholder="Details about coffee roast, ingredients, size, etc."
              rows={3}
              className="w-full py-2 px-3 rounded-lg text-cafe-text-primary bg-cafe-bg-input border border-cafe-green-light focus:outline-none focus:ring-2 focus:ring-cafe-green-mid focus:border-transparent transition-all placeholder:text-cafe-text-muted"
              {...register("description")}
            />
          </div>

          <div className="flex gap-6 mt-2">
            <Toggle
              label="Show on Kitchen Monitor (KDS)"
              {...register("show_on_kds")}
              checked={register("show_on_kds").value} // handled manually by hook form or directly
            />
            {editingProduct && (
              <Toggle
                label="Product Active"
                {...register("is_active")}
              />
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingProduct ? "Save Changes" : "Save Product"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete/Archive Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deletingProduct !== null}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
        title="Archive Product?"
        message={`Delete "${deletingProduct?.name}"? This will hide it from the POS menu. Active or completed orders with this product will not be affected.`}
        confirmText="Yes, Archive"
        isDanger={true}
        isLoading={isDeleting}
      />
    </BackendLayout>
  );
};

export default Products;
