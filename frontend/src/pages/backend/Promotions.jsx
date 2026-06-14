import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";

import BackendLayout from "../../components/backend/BackendLayout";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Toggle from "../../components/common/Toggle";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Badge from "../../components/common/Badge";

import { getPromotionsApi, createPromotionApi, updatePromotionApi, deletePromotionApi } from "../../api/promotion.api";
import { getProductsApi } from "../../api/product.api";

export const Promotions = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm();
  
  // Watch promotion_type to display conditional fields
  const watchPromoType = useWatch({
    control,
    name: "promotion_type",
    defaultValue: "product",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Promotions & Products
  const { data: promosData, isLoading } = useQuery({
    queryKey: ["promotions"],
    queryFn: getPromotionsApi,
  });

  const { data: productsData } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => getProductsApi({ is_active: "all" }),
  });

  const promotions = promosData?.data || [];
  const products = productsData?.data || [];

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: createPromotionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      toast.success("Promotion created successfully!");
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create promotion");
    }
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updatePromotionApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      toast.success("Promotion updated successfully!");
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update promotion");
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deletePromotionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      toast.success("Promotion deleted!");
      setDeletingId(null);
      setIsDeleting(false);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete promotion");
      setIsDeleting(false);
    }
  });

  const handleOpenAddModal = () => {
    setEditingPromo(null);
    reset({
      name: "",
      promotion_type: "product",
      product_id: "",
      min_quantity: "1",
      min_order_amount: "",
      discount_type: "percentage",
      discount_value: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (promo) => {
    setEditingPromo(promo);
    reset({
      name: promo.name,
      promotion_type: promo.promotion_type,
      product_id: promo.product_id || "",
      min_quantity: promo.min_quantity || "1",
      min_order_amount: promo.min_order_amount || "",
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      is_active: promo.is_active,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPromo(null);
    reset();
  };

  const onSubmit = (formData) => {
    const isProduct = formData.promotion_type === "product";
    
    // Custom validation check before submitting
    if (isProduct) {
      if (!formData.product_id) {
        toast.error("Product selection is required");
        return;
      }
      if (!formData.min_quantity || parseInt(formData.min_quantity, 10) < 1) {
        toast.error("Minimum quantity must be at least 1");
        return;
      }
    } else {
      if (!formData.min_order_amount || parseFloat(formData.min_order_amount) < 0) {
        toast.error("Minimum order amount must be a positive number");
        return;
      }
    }

    const payload = {
      name: formData.name,
      promotion_type: formData.promotion_type,
      product_id: isProduct ? parseInt(formData.product_id, 10) : null,
      min_quantity: isProduct ? parseInt(formData.min_quantity, 10) : null,
      min_order_amount: !isProduct ? parseFloat(formData.min_order_amount) : null,
      discount_type: formData.discount_type,
      discount_value: parseFloat(formData.discount_value),
      is_active: !!formData.is_active,
    };

    if (editingPromo) {
      updateMutation.mutate({ id: editingPromo.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      setIsDeleting(true);
      deleteMutation.mutate(deletingId);
    }
  };

  const columns = [
    { key: "name", label: "Promotion Name" },
    {
      key: "promotion_type",
      label: "Promo Type",
      render: (row) => (
        <Badge variant={row.promotion_type === "product" ? "blue" : "yellow"}>
          {row.promotion_type}
        </Badge>
      ),
    },
    {
      key: "condition",
      label: "Trigger Condition",
      render: (row) => {
        if (row.promotion_type === "product") {
          return `Buy ≥ ${row.min_quantity} of "${row.product_name || 'Deleted Product'}"`;
        }
        return `Subtotal ≥ ₹${parseFloat(row.min_order_amount).toFixed(2)}`;
      },
    },
    {
      key: "discount",
      label: "Discount",
      render: (row) => (
        row.discount_type === "percentage" ? `${parseFloat(row.discount_value)}% off` : `₹${parseFloat(row.discount_value)} off`
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <Badge variant={row.is_active ? "green" : "gray"}>
          {row.is_active ? "Active" : "Disabled"}
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
            onClick={() => setDeletingId(row.id)}
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
          <h1 className="text-2xl font-bold text-cafe-beige-mid">Promotions</h1>
          <p className="text-sm text-cafe-text-muted">Configure automatic trigger rules for quantity or order discounts</p>
        </div>
        <Button onClick={handleOpenAddModal}>
          <Plus size={18} /> Add Promotion
        </Button>
      </div>

      <DataTable
        headers={columns}
        data={promotions}
        isLoading={isLoading}
        emptyMessage="No promotions created yet."
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPromo ? "Edit Promotion" : "Add Promotion"}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Promotion Name *"
            placeholder="e.g. Espresso Triple Deal"
            error={errors.name?.message}
            {...register("name", { required: "Promotion name is required" })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-cafe-text-secondary">Promotion Type *</label>
            <select
              className="w-full py-2 px-3 rounded-lg text-cafe-text-primary bg-cafe-bg-input border border-cafe-green-light focus:outline-none focus:ring-2 focus:ring-cafe-green-mid focus:border-transparent"
              {...register("promotion_type")}
            >
              <option value="product">Product Promotion</option>
              <option value="order">Order Total Promotion</option>
            </select>
          </div>

          {/* Conditional Product Select fields */}
          {watchPromoType === "product" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-cafe-text-secondary">Select Product *</label>
                <select
                  className="w-full py-2 px-3 rounded-lg text-cafe-text-primary bg-cafe-bg-input border border-cafe-green-light focus:outline-none focus:ring-2 focus:ring-cafe-green-mid focus:border-transparent"
                  {...register("product_id")}
                >
                  <option value="">Choose item...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{p.price})
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Minimum Quantity Required *"
                type="number"
                placeholder="3"
                error={errors.min_quantity?.message}
                {...register("min_quantity", {
                  min: { value: 1, message: "Minimum quantity is 1" },
                })}
              />
            </div>
          ) : (
            /* Conditional Order Total field */
            <Input
              label="Minimum Order Amount (₹) *"
              type="number"
              step="0.01"
              placeholder="500.00"
              error={errors.min_order_amount?.message}
              {...register("min_order_amount")}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-cafe-text-secondary">Discount Type *</label>
              <select
                className="w-full py-2 px-3 rounded-lg text-cafe-text-primary bg-cafe-bg-input border border-cafe-green-light focus:outline-none focus:ring-2 focus:ring-cafe-green-mid focus:border-transparent"
                {...register("discount_type")}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>

            <Input
              label="Discount Value *"
              type="number"
              step="0.01"
              placeholder="15"
              error={errors.discount_value?.message}
              {...register("discount_value", {
                required: "Discount value is required",
                validate: (v) => parseFloat(v) > 0 || "Value must be greater than 0",
              })}
            />
          </div>

          <div className="mt-2">
            <Toggle
              label="Promotion Active"
              {...register("is_active")}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingPromo ? "Save Changes" : "Save Promotion"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Promotion Rule?"
        message="Permanently remove this promotion scheme? Checkout totals will no longer apply this discount rule automatically."
        confirmText="Delete"
        isDanger={true}
        isLoading={isDeleting}
      />
    </BackendLayout>
  );
};

export default Promotions;
