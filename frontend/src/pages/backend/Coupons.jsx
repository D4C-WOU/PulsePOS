import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
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

import { getCouponsApi, createCouponApi, updateCouponApi, deleteCouponApi } from "../../api/coupon.api";

export const Coupons = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Coupons
  const { data, isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: getCouponsApi,
  });

  const coupons = data?.data || [];

  // Create Coupon Mutation
  const createMutation = useMutation({
    mutationFn: createCouponApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Coupon created successfully!");
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create coupon");
    }
  });

  // Update Coupon Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCouponApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Coupon updated successfully!");
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update coupon");
    }
  });

  // Delete Coupon Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCouponApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Coupon deleted successfully!");
      setDeletingId(null);
      setIsDeleting(false);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete coupon");
      setIsDeleting(false);
    }
  });

  const handleOpenAddModal = () => {
    setEditingCoupon(null);
    reset({
      code: "",
      discount_type: "percentage",
      discount_value: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon) => {
    setEditingCoupon(coupon);
    reset({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      is_active: coupon.is_active,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
    reset();
  };

  const handleCodeChange = (e) => {
    const uppercase = e.target.value.toUpperCase();
    setValue("code", uppercase);
  };

  const onSubmit = (formData) => {
    const payload = {
      code: formData.code.toUpperCase().trim(),
      discount_type: formData.discount_type,
      discount_value: parseFloat(formData.discount_value),
      is_active: !!formData.is_active,
    };

    if (editingCoupon) {
      updateMutation.mutate({ id: editingCoupon.id, data: payload });
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
    { key: "code", label: "Coupon Code" },
    {
      key: "discount_type",
      label: "Discount Type",
      render: (row) => (
        <Badge variant={row.discount_type === "percentage" ? "blue" : "yellow"}>
          {row.discount_type}
        </Badge>
      ),
    },
    {
      key: "discount_value",
      label: "Value",
      render: (row) => (
        row.discount_type === "percentage" ? `${row.discount_value}%` : `₹${row.discount_value}`
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
          <h1 className="text-2xl font-bold text-cafe-beige-mid">Coupons</h1>
          <p className="text-sm text-cafe-text-muted">Configure cart-level discount coupons</p>
        </div>
        <Button onClick={handleOpenAddModal}>
          <Plus size={18} /> Add Coupon
        </Button>
      </div>

      <DataTable
        headers={columns}
        data={coupons}
        isLoading={isLoading}
        emptyMessage="No coupons created yet."
      />

      {/* Add / Edit Coupon Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCoupon ? "Edit Coupon" : "Add Coupon"}
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Coupon Code *"
            placeholder="e.g. SAVE10"
            error={errors.code?.message}
            {...register("code", {
              required: "Coupon code is required",
              onChange: handleCodeChange,
            })}
          />

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
            placeholder="10"
            error={errors.discount_value?.message}
            {...register("discount_value", {
              required: "Discount value is required",
              validate: (v) => parseFloat(v) > 0 || "Value must be greater than 0",
            })}
          />

          <div className="mt-2">
            <Toggle
              label="Coupon Active"
              {...register("is_active")}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingCoupon ? "Save Changes" : "Save Coupon"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Coupon Confirmation */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Coupon?"
        message="Permanently delete this coupon code? Customers will no longer be able to apply this discount in POS carts."
        confirmText="Delete"
        isDanger={true}
        isLoading={isDeleting}
      />
    </BackendLayout>
  );
};

export default Coupons;
