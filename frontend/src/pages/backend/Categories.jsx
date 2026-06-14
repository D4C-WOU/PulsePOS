import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

import BackendLayout from "../../components/backend/BackendLayout";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import { 
  getCategoriesApi, 
  createCategoryApi, 
  updateCategoryApi, 
  deleteCategoryApi 
} from "../../api/category.api";

export const Categories = () => {
  const queryClient = useQueryClient();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Custom Color Selection State
  const presetColors = [
    "#C0392B", "#2980B9", "#E67E22", "#27AE60", "#8E44AD", "#F1C40F",
    "#16A085", "#D35400", "#7F8C8D", "#2C3E50", "#52B788", "#2D6A4F"
  ];
  const [selectedColor, setSelectedColor] = useState("#52B788");

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();

  // Fetch Categories
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesApi,
  });

  const categories = data?.data || [];

  // Create Category Mutation
  const createMutation = useMutation({
    mutationFn: createCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully!");
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create category");
    }
  });

  // Update Category Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategoryApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully!");
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update category");
    }
  });

  // Delete Category Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully!");
      setDeletingId(null);
      setIsDeleting(false);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete category");
      setIsDeleting(false);
    }
  });

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setSelectedColor("#52B788");
    reset({ name: "", color: "#52B788" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setSelectedColor(category.color);
    reset({ name: category.name, color: category.color });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    reset();
  };

  const handlePresetColorClick = (color) => {
    setSelectedColor(color);
    setValue("color", color);
  };

  const handleColorInputChange = (e) => {
    const color = e.target.value;
    setSelectedColor(color);
  };

  const onSubmit = (formData) => {
    const payload = {
      name: formData.name,
      color: selectedColor,
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      setIsDeleting(true);
      deleteMutation.mutate(deletingId);
    }
  };

  const columns = [
    {
      key: "color",
      label: "Color Swatch",
      render: (row) => (
        <div 
          className="w-7 h-7 rounded-full border border-cafe-border" 
          style={{ backgroundColor: row.color }}
        />
      ),
    },
    { key: "name", label: "Category Name" },
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
            onClick={() => handleDeleteClick(row.id)}
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
          <h1 className="text-2xl font-bold text-cafe-beige-mid">Categories</h1>
          <p className="text-sm text-cafe-text-muted">Manage product grouping classifications and colors</p>
        </div>
        <Button onClick={handleOpenAddModal}>
          <Plus size={18} /> Add Category
        </Button>
      </div>

      {/* Categories DataTable */}
      <DataTable
        headers={columns}
        data={categories}
        isLoading={isLoading}
        emptyMessage="No categories created yet."
      />

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? "Edit Category" : "Add Category"}
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Input
            label="Category Name *"
            placeholder="e.g. Hot Drinks"
            error={errors.name?.message}
            {...register("name", { required: "Category name is required" })}
          />

          {/* Color Swatch Picker */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-cafe-text-secondary">Category Color *</span>
            
            {/* Color Presets */}
            <div className="grid grid-cols-6 gap-2 bg-cafe-bg-input border border-cafe-border p-3 rounded-lg justify-items-center">
              {presetColors.map((color, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetColorClick(color)}
                  className={`w-7 h-7 rounded-full border transition-transform duration-100 ${
                    selectedColor.toUpperCase() === color.toUpperCase()
                      ? "border-cafe-beige-mid scale-110 ring-2 ring-cafe-green-mid"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Custom Hex Color & Live Preview */}
            <div className="flex items-center gap-3 mt-1">
              <div 
                className="w-10 h-10 rounded-full border border-cafe-border shadow-md"
                style={{ backgroundColor: selectedColor }}
              />
              <Input
                type="text"
                placeholder="#52B788"
                className="flex-1"
                {...register("color", {
                  required: "Color code is required",
                  pattern: {
                    value: /^#[0-9A-Fa-f]{6}$/,
                    message: "Invalid hex color format (e.g. #52B788)",
                  },
                  onChange: handleColorInputChange,
                })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingCategory ? "Save Changes" : "Save Category"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category?"
        message="Deleting this category will set its associated products to 'No Category'. Active or archived POS order records will not be altered."
        confirmText="Delete"
        isDanger={true}
        isLoading={isDeleting}
      />
    </BackendLayout>
  );
};

export default Categories;
