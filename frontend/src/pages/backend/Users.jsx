import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Key, Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

import BackendLayout from "../../components/backend/BackendLayout";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Badge from "../../components/common/Badge";
import formatDate from "../../utils/formatDate";

import {
  getUsersApi,
  createUserApi,
  updateUserApi,
  changeUserPasswordApi,
  archiveUserApi,
  deleteUserApi,
} from "../../api/user.api";

export const Users = () => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [passwordUser, setPasswordUser] = useState(null);
  
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [archivingId, setArchivingId] = useState(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const passwordForm = useForm();

  // Fetch Users
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsersApi,
  });

  const users = data?.data || [];

  // Create User Mutation
  const createMutation = useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully!");
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to create user");
    },
  });

  // Update User Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateUserApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully!");
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to update user");
    },
  });

  // Change Password Mutation
  const passwordMutation = useMutation({
    mutationFn: ({ id, password }) => changeUserPasswordApi(id, password),
    onSuccess: () => {
      toast.success("Password updated successfully!");
      handleClosePasswordModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to change password");
    },
  });

  // Toggle Archive Mutation
  const archiveMutation = useMutation({
    mutationFn: archiveUserApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(res.message || "User status updated successfully!");
      setArchivingId(null);
      setIsArchiving(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to toggle archive status");
      setIsArchiving(false);
    },
  });

  // Delete User Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully!");
      setDeletingId(null);
      setIsDeleting(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to delete user");
      setIsDeleting(false);
    },
  });

  const handleOpenAddModal = () => {
    setEditingUser(null);
    reset({ name: "", email: "", password: "", role: "employee" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    reset({ name: user.name, email: user.email, role: user.role });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    reset();
  };

  const handleOpenPasswordModal = (user) => {
    setPasswordUser(user);
    passwordForm.reset({ new_password: "", confirm_password: "" });
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordUser(null);
    passwordForm.reset();
  };

  const onSubmit = (formData) => {
    if (editingUser) {
      updateMutation.mutate({
        id: editingUser.id,
        data: { name: formData.name, email: formData.email, role: formData.role },
      });
    } else {
      createMutation.mutate({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
    }
  };

  const onSubmitPassword = (formData) => {
    if (formData.new_password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    passwordMutation.mutate({
      id: passwordUser.id,
      password: formData.new_password,
    });
  };

  const handleArchiveClick = (id) => {
    setArchivingId(id);
  };

  const handleConfirmArchive = () => {
    if (archivingId) {
      setIsArchiving(true);
      archiveMutation.mutate(archivingId);
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

  const targetArchivingUser = users.find((u) => u.id === archivingId);

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (row) => (
        <Badge variant={row.role === "admin" ? "success" : "warning"}>
          {row.role.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <Badge variant={row.is_active ? "success" : "danger"}>
          {row.is_active ? "ACTIVE" : "ARCHIVED"}
        </Badge>
      ),
    },
    {
      key: "created_at",
      label: "Joined",
      render: (row) => <span>{formatDate(row.created_at, false)}</span>,
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
            title="Edit User Info"
            className="p-1.5 text-cafe-beige-mid hover:bg-cafe-beige-mid/10"
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenPasswordModal(row)}
            title="Change Password"
            className="p-1.5 text-cafe-beige-mid hover:bg-cafe-beige-mid/10"
          >
            <Key size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleArchiveClick(row.id)}
            title={row.is_active ? "Archive User" : "Activate User"}
            className={`p-1.5 ${
              row.is_active
                ? "text-cafe-warning hover:bg-cafe-warning/10"
                : "text-cafe-green-mid hover:bg-cafe-green-mid/10"
            }`}
          >
            {row.is_active ? <Archive size={16} /> : <ArchiveRestore size={16} />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(row.id)}
            title="Delete User permanently"
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
          <h1 className="text-2xl font-bold text-cafe-beige-mid">Users & Employees</h1>
          <p className="text-sm text-cafe-text-muted">Manage staff accounts, credentials, access levels, and active status</p>
        </div>
        <Button onClick={handleOpenAddModal}>
          <Plus size={18} /> Add User
        </Button>
      </div>

      {/* Users DataTable */}
      <DataTable
        headers={columns}
        data={users}
        isLoading={isLoading}
        emptyMessage="No user accounts registered yet."
      />

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? "Edit User Account" : "Create User Account"}
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Input
            label="Name *"
            placeholder="e.g. John Doe"
            error={errors.name?.message}
            {...register("name", { required: "Name is required" })}
          />

          <Input
            label="Email Address *"
            type="email"
            placeholder="e.g. john@cafe.com"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address style",
              },
            })}
          />

          {!editingUser && (
            <Input
              label="Password *"
              type="password"
              placeholder="Minimum 6 characters"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-cafe-text-secondary">System Access Role *</label>
            <select
              className="bg-cafe-bg-input text-cafe-text-primary border border-cafe-border p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-cafe-beige-mid"
              {...register("role", { required: "Role selection is required" })}
            >
              <option value="employee">Employee (POS Terminal Only)</option>
              <option value="admin">Administrator (Full Panel Access)</option>
            </select>
            {errors.role && <p className="text-xs text-cafe-danger mt-1">{errors.role.message}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingUser ? "Save Changes" : "Create User"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={handleClosePasswordModal}
        title={`Reset Password for ${passwordUser?.name}`}
        size="sm"
      >
        <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="flex flex-col gap-5">
          <Input
            label="New Password *"
            type="password"
            placeholder="Minimum 6 characters"
            error={passwordForm.formState.errors.new_password?.message}
            {...passwordForm.register("new_password", {
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
          />

          <Input
            label="Confirm New Password *"
            type="password"
            placeholder="Confirm details"
            error={passwordForm.formState.errors.confirm_password?.message}
            {...passwordForm.register("confirm_password", {
              required: "Please confirm your password",
            })}
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={handleClosePasswordModal}>
              Cancel
            </Button>
            <Button type="submit">
              Update Password
            </Button>
          </div>
        </form>
      </Modal>

      {/* Archive / Activate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={archivingId !== null}
        onClose={() => setArchivingId(null)}
        onConfirm={handleConfirmArchive}
        title={targetArchivingUser?.is_active ? "Archive User Account?" : "Reactivate User Account?"}
        message={
          targetArchivingUser?.is_active
            ? `Archiving ${targetArchivingUser?.name} will prevent them from signing in or opening terminal sessions. Existing order histories remain unchanged.`
            : `Reactivating ${targetArchivingUser?.name} will restore their login access and allow them to take cafe orders.`
        }
        confirmText={targetArchivingUser?.is_active ? "Archive Account" : "Reactivate Account"}
        isDanger={targetArchivingUser?.is_active}
        isLoading={isArchiving}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete User permanently?"
        message="Deleting a user is irreversible. You can only delete users who have never taken a POS order. For active history preservation, archive them instead."
        confirmText="Delete permanently"
        isDanger={true}
        isLoading={isDeleting}
      />
    </BackendLayout>
  );
};

export default Users;
