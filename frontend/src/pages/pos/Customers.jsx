import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2, Mail, Phone, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import POSNavbar from "../../components/pos/POSNavbar";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import formatDate from "../../utils/formatDate";
import {
  getCustomersApi,
  createCustomerApi,
  updateCustomerApi,
  deleteCustomerApi,
} from "../../api/customer.api";

export const Customers = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch Customers
  const { data: res, isLoading } = useQuery({
    queryKey: ["pos_customers_directory", search],
    queryFn: () => getCustomersApi(search),
  });

  const customers = res?.data || [];

  // Create Customer Mutation
  const createMutation = useMutation({
    mutationFn: createCustomerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos_customers_directory"] });
      toast.success("Customer profile registered successfully!");
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to register customer");
    },
  });

  // Update Customer Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCustomerApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos_customers_directory"] });
      toast.success("Customer profile updated successfully!");
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to update customer");
    },
  });

  // Delete Customer Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCustomerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos_customers_directory"] });
      toast.success("Customer profile deleted successfully!");
      setDeletingId(null);
      setIsDeleting(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to delete customer");
      setIsDeleting(false);
    },
  });

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    reset({ name: "", email: "", phone: "" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (customer) => {
    setEditingCustomer(customer);
    reset({ name: customer.name, email: customer.email || "", phone: customer.phone || "" });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
    reset();
  };

  const onSubmit = (formData) => {
    const payload = {
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
    };

    if (editingCustomer) {
      updateMutation.mutate({ id: editingCustomer.id, data: payload });
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
    { key: "name", label: "Full Name", render: (row) => <span className="font-semibold text-cafe-beige-mid">{row.name}</span> },
    {
      key: "email",
      label: "Email Address",
      render: (row) => (
        <span className="flex items-center gap-1.5">
          <Mail size={13} className="text-cafe-text-muted" />
          {row.email || <span className="text-cafe-text-muted italic">Not linked</span>}
        </span>
      ),
    },
    {
      key: "phone",
      label: "Phone Number",
      render: (row) => (
        <span className="flex items-center gap-1.5 font-mono">
          <Phone size={13} className="text-cafe-text-muted" />
          {row.phone || <span className="text-cafe-text-muted italic">Not linked</span>}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Registered Date",
      render: (row) => (
        <span className="flex items-center gap-1.5">
          <Calendar size={13} className="text-cafe-text-muted" />
          {formatDate(row.created_at, false)}
        </span>
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
            className="p-1.5 text-cafe-beige-mid hover:bg-cafe-beige-mid/10"
          >
            <Pencil size={15} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(row.id)}
            className="p-1.5 text-cafe-danger hover:bg-cafe-danger/10 hover:text-red-500"
          >
            <Trash2 size={15} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-cafe-bg-dark text-cafe-text-primary flex flex-col">
      <POSNavbar />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
        {/* Header section */}
        <div className="flex justify-between items-center border-b border-cafe-border/50 pb-4 select-none">
          <div>
            <h1 className="text-xl font-extrabold text-cafe-beige-mid tracking-tight">
              Customer Directory
            </h1>
            <p className="text-xs text-cafe-text-muted mt-0.5">
              Manage profiles, phone numbers, and emails for loyalty records and SMTP receipt transfers.
            </p>
          </div>

          <Button onClick={handleOpenAddModal} className="flex items-center gap-1 text-xs">
            <Plus size={16} /> Register Profile
          </Button>
        </div>

        {/* Search Input Filter */}
        <div className="bg-cafe-bg-card border border-cafe-border p-4 rounded-xl relative select-none">
          <span className="absolute inset-y-0 left-0 pl-7 flex items-center text-cafe-text-muted pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer directory by name, email, phone code..."
            className="w-full bg-cafe-bg-input text-cafe-text-primary placeholder:text-cafe-text-muted border border-cafe-border pl-11 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-cafe-beige-mid text-xs"
          />
        </div>

        {/* DataTable */}
        <DataTable
          headers={columns}
          data={customers}
          isLoading={isLoading}
          emptyMessage="No customer profiles match your filter search."
        />
      </main>

      {/* Add / Edit Profile Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCustomer ? "Edit Customer Details" : "Register Customer Profile"}
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 select-none">
          <Input
            label="Full Name *"
            placeholder="e.g. Priyan Sharma"
            error={errors.name?.message}
            {...register("name", { required: "Customer name is required" })}
          />

          <Input
            label="Email Address"
            placeholder="e.g. priyan@gmail.com"
            error={errors.email?.message}
            {...register("email", {
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email layout",
              },
            })}
          />

          <Input
            label="Phone Number"
            placeholder="e.g. 9876543210"
            error={errors.phone?.message}
            {...register("phone")}
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingCustomer ? "Save Changes" : "Register"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Customer Profile?"
        message="Are you sure you want to delete this customer record? Associated transaction receipts will remain in place under a 'Walk-in' profile designation."
        confirmText="Delete Profile"
        isDanger={true}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Customers;
