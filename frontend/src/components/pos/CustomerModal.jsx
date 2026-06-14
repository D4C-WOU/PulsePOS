import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, UserPlus, Mail, Phone, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import { getCustomersApi, createCustomerApi } from "../../api/customer.api";

export const CustomerModal = ({ isOpen, onClose, onSelect, selectedCustomerId }) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Fetch Customers
  const { data: res, isLoading } = useQuery({
    queryKey: ["customers_search", search],
    queryFn: () => getCustomersApi(search),
    enabled: isOpen,
  });

  const customers = res?.data || [];

  // Create Customer Mutation
  const createMutation = useMutation({
    mutationFn: createCustomerApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["customers_search"] });
      toast.success("Customer profile registered!");
      onSelect(data.data); // Immediately select newly created customer
      setShowAddForm(false);
      reset();
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to create customer");
    },
  });

  const onSubmit = (formData) => {
    createMutation.mutate(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setShowAddForm(false);
        reset();
        onClose();
      }}
      title="Link Customer Details"
      size="md"
    >
      <div className="flex flex-col gap-4 select-none">
        {/* Toggle Mode Button */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 text-cafe-beige-mid hover:bg-cafe-beige-mid/10"
          >
            {showAddForm ? (
              <>Search Customer Directory</>
            ) : (
              <>
                <UserPlus size={15} /> Add New Customer
              </>
            )}
          </Button>
        </div>

        {showAddForm ? (
          // Add Customer Form
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-cafe-beige-mid">New Customer Registration</h3>
            <Input
              label="Full Name *"
              placeholder="e.g. Rahul Sharma"
              error={errors.name?.message}
              {...register("name", { required: "Name is required" })}
            />
            <Input
              label="Email Address"
              placeholder="e.g. rahul@example.com"
              error={errors.email?.message}
              {...register("email", {
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address style",
                },
              })}
            />
            <Input
              label="Phone Number"
              placeholder="e.g. 9876543210"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <div className="flex justify-end gap-3 mt-2">
              <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={createMutation.isLoading}>
                Register & Select
              </Button>
            </div>
          </form>
        ) : (
          // Search & List
          <div className="flex flex-col gap-4">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-cafe-text-muted pointer-events-none">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or phone..."
                className="w-full bg-cafe-bg-input text-cafe-text-primary placeholder:text-cafe-text-muted border border-cafe-border pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-cafe-beige-mid text-sm"
              />
            </div>

            {/* Customer List */}
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Spinner size="md" />
              </div>
            ) : customers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-cafe-text-muted text-xs">
                No matching customer profiles found.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {customers.map((c) => {
                  const isSelected = selectedCustomerId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onSelect(c);
                        onClose();
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                        isSelected
                          ? "bg-cafe-beige-mid/10 text-cafe-beige-mid border-cafe-beige-mid"
                          : "bg-cafe-bg-card text-cafe-text-primary border-cafe-border hover:border-cafe-text-muted hover:bg-cafe-bg-input/20"
                      }`}
                    >
                      <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                        <span className="font-semibold text-sm truncate">{c.name}</span>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-cafe-text-muted">
                          {c.email && (
                            <span className="flex items-center gap-1.5 min-w-0">
                              <Mail size={12} className="shrink-0" />
                              <span className="truncate">{c.email}</span>
                            </span>
                          )}
                          {c.phone && (
                            <span className="flex items-center gap-1.5 min-w-0">
                              <Phone size={12} className="shrink-0" />
                              <span>{c.phone}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <span className="bg-cafe-beige-mid text-[#1C1814] rounded-full p-1 shrink-0 ml-3">
                          <Check size={14} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CustomerModal;
