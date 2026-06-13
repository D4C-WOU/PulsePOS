import { useState } from "react";
import { motion } from "framer-motion";

import OrderFilter from "../components/orders/OrderFilter";
import OrderTable from "../components/orders/OrderTable";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";

const initialOrders = [
  {
    id: "#1001",
    customer: "John Doe",
    phone: "+91 9876543210",
    address: "Vadodara",
    payment: "UPI",
    status: "Completed",
    total: 780,
    time: "12:30 PM",
    items: [
      { name: "Burger", quantity: 2, price: 398 },
      { name: "Fries", quantity: 1, price: 150 },
      { name: "Cold Drink", quantity: 2, price: 232 },
    ],
  },
  {
    id: "#1002",
    customer: "Rahul Patel",
    phone: "+91 9876543222",
    address: "Ahmedabad",
    payment: "Cash",
    status: "Preparing",
    total: 450,
    time: "1:10 PM",
    items: [
      { name: "Pizza", quantity: 1, price: 299 },
      { name: "Coffee", quantity: 1, price: 151 },
    ],
  },
  {
    id: "#1003",
    customer: "Emma Watson",
    phone: "+91 9876543333",
    address: "Surat",
    payment: "Card",
    status: "Pending",
    total: 900,
    time: "2:00 PM",
    items: [
      { name: "Pasta", quantity: 2, price: 500 },
      { name: "Juice", quantity: 2, price: 400 },
    ],
  },
];

const OrderHistory = () => {
  const [orders, setOrders] = useState(initialOrders);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const [payment, setPayment] = useState("All");

  const [selectedOrder, setSelectedOrder] = useState(null);

  const resetFilters = () => {
    setSearch("");
    setStatus("All");
    setPayment("All");
  };

  const deleteOrder = (id) => {
    setOrders((prev) =>
      prev.filter((order) => order.id !== id)
    );
  };

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              status: newStatus,
            }
          : order
      )
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      order.customer
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      status === "All" ||
      order.status === status;

    const matchesPayment =
      payment === "All" ||
      order.payment === payment;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPayment
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0B1120] p-8"
    >
      {/* Header */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-white">
          Order History
        </h1>

        <p className="text-slate-400 mt-2">
          Manage restaurant orders
        </p>

      </div>

      {/* Filters */}

      <OrderFilter
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        payment={payment}
        setPayment={setPayment}
        onReset={resetFilters}
      />

      {/* Table */}

      <OrderTable
        orders={filteredOrders}
        onView={setSelectedOrder}
        onDelete={deleteOrder}
        onStatusChange={updateStatus}
      />

      {/* Details Modal */}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() =>
            setSelectedOrder(null)
          }
        />
      )}
    </motion.div>
  );
};

export default OrderHistory;