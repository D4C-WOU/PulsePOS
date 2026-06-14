import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Filter, RefreshCw } from "lucide-react";

import POSNavbar from "../../components/pos/POSNavbar";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Spinner from "../../components/common/Spinner";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";
import { getOrdersApi } from "../../api/order.api";
import useSessionStore from "../../store/sessionStore";

export const OrdersList = () => {
  const navigate = useNavigate();
  const session = useSessionStore((state) => state.session);

  const [status, setStatus] = useState(""); // empty means all
  const [search, setSearch] = useState("");

  const filters = {
    session_id: session?.id,
    ...(status && { status }),
    ...(search && { search }),
  };

  const { data: res, isLoading, refetch } = useQuery({
    queryKey: ["pos_orders_list", filters],
    queryFn: () => getOrdersApi(filters),
    enabled: !!session?.id,
  });

  const orders = res?.data || [];

  const getStatusBadge = (orderStatus) => {
    switch (orderStatus) {
      case "draft":
        return <Badge variant="warning">DRAFT</Badge>;
      case "sent_to_kds":
        return <Badge variant="info">IN KITCHEN</Badge>;
      case "paid":
        return <Badge variant="success">PAID</Badge>;
      case "cancelled":
        return <Badge variant="danger">CANCELLED</Badge>;
      default:
        return <Badge>{orderStatus}</Badge>;
    }
  };

  const columns = [
    { key: "order_number", label: "Order Number", render: (row) => <span className="font-semibold">{row.order_number}</span> },
    {
      key: "created_at",
      label: "Order Time",
      render: (row) => <span>{formatDate(row.created_at)}</span>,
    },
    {
      key: "table",
      label: "Dining Service",
      render: (row) => (
        <span>{row.table ? `Table ${row.table.table_number}` : "Takeaway"}</span>
      ),
    },
    {
      key: "customer",
      label: "Customer Linked",
      render: (row) => <span>{row.customer?.name || "Walk-in Customer"}</span>,
    },
    {
      key: "status",
      label: "Order Status",
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "total",
      label: "Order Total",
      render: (row) => <span className="font-extrabold text-cafe-green-light">{formatCurrency(row.total)}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/pos/orders/${row.id}`)}
          className="flex items-center gap-1 text-cafe-beige-mid hover:bg-cafe-beige-mid/10"
        >
          <Eye size={15} /> View details
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-cafe-bg-dark text-cafe-text-primary flex flex-col">
      <POSNavbar />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-cafe-border/50 pb-4 select-none">
          <div>
            <h1 className="text-xl font-extrabold text-cafe-beige-mid tracking-tight">
              POS Sessions Order History
            </h1>
            <p className="text-xs text-cafe-text-muted mt-0.5">
              Review and audit all checks, print copies, and process pending payments.
            </p>
          </div>

          <Button
            variant="ghost"
            onClick={() => refetch()}
            className="flex items-center gap-1 text-xs text-cafe-beige-mid border border-cafe-border hover:bg-cafe-bg-input"
          >
            <RefreshCw size={14} /> Refresh Directory
          </Button>
        </div>

        {/* Filters and search bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-cafe-bg-card border border-cafe-border p-4 rounded-xl select-none">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-cafe-text-muted pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order number or customer name..."
              className="w-full bg-cafe-bg-input text-cafe-text-primary placeholder:text-cafe-text-muted border border-cafe-border pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-cafe-beige-mid text-xs"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs text-cafe-text-secondary font-semibold flex items-center gap-1.5 shrink-0">
              <Filter size={14} /> Filter Status:
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full md:w-44 bg-cafe-bg-input text-cafe-text-primary border border-cafe-border px-3 py-2.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cafe-beige-mid"
            >
              <option value="">All Orders</option>
              <option value="draft">Draft checks</option>
              <option value="sent_to_kds">Active in Kitchen (KDS)</option>
              <option value="paid">Paid checks</option>
              <option value="cancelled">Cancelled checks</option>
            </select>
          </div>
        </div>

        {/* Datatable */}
        <DataTable
          headers={columns}
          data={orders}
          isLoading={isLoading}
          emptyMessage="No matching order records found in this POS session."
        />
      </main>
    </div>
  );
};

export default OrdersList;
