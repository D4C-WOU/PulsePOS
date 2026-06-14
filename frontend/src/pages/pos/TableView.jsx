import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Layers, Armchair, HelpCircle, UserCheck } from "lucide-react";
import { toast } from "react-hot-toast";

import POSNavbar from "../../components/pos/POSNavbar";
import Spinner from "../../components/common/Spinner";
import { getFloorsApi } from "../../api/floor.api";
import { getOrdersApi, getOrderByIdApi } from "../../api/order.api";
import useCartStore from "../../store/cartStore";
import useSessionStore from "../../store/sessionStore";

export const TableView = () => {
  const navigate = useNavigate();
  const [activeFloorId, setActiveFloorId] = useState(null);

  const session = useSessionStore((state) => state.session);
  const setTable = useCartStore((state) => state.setTable);
  const loadOrder = useCartStore((state) => state.loadOrder);
  const clearCart = useCartStore((state) => state.clearCart);

  // Fetch floors
  const { data: floorsRes, isLoading: isLoadingFloors } = useQuery({
    queryKey: ["floors_table_view"],
    queryFn: getFloorsApi,
    onSuccess: (data) => {
      if (data?.data?.length > 0 && !activeFloorId) {
        setActiveFloorId(data.data[0].id);
      }
    },
  });

  // Fetch current session's active draft/sent orders to link to tables
  const { data: ordersRes, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["active_session_orders", session?.id],
    queryFn: () => getOrdersApi({ session_id: session?.id }),
    enabled: !!session?.id,
  });

  const floors = floorsRes?.data || [];
  const activeFloor = floors.find((f) => f.id === activeFloorId) || floors[0];
  const activeOrders = ordersRes?.data || [];

  // Link table status with order number
  const getTableOrder = (tableId) => {
    return activeOrders.find(
      (o) => o.table?.id === tableId && (o.status === "draft" || o.status === "sent_to_kds")
    );
  };

  const handleTableClick = async (table) => {
    const activeOrder = getTableOrder(table.id);

    if (activeOrder) {
      // Load existing order into cart
      toast.loading("Loading table order details...", { id: "load-table-order" });
      try {
        const fullOrderRes = await getOrderByIdApi(activeOrder.id);
        if (fullOrderRes.success && fullOrderRes.data) {
          loadOrder(fullOrderRes.data);
          toast.success(`Loaded active order ${activeOrder.order_number}`, {
            id: "load-table-order",
          });
          navigate("/pos");
        }
      } catch (err) {
        toast.error("Failed to load active order details", { id: "load-table-order" });
      }
    } else {
      // Clear cart and start new draft order on this table
      clearCart();
      setTable({
        id: table.id,
        table_number: table.table_number,
        seats: table.seats,
      });
      toast.success(`Selected Table ${table.table_number} (New Order)`);
      navigate("/pos");
    }
  };

  return (
    <div className="min-h-screen bg-cafe-bg-dark text-cafe-text-primary flex flex-col">
      <POSNavbar />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
        {/* Page title */}
        <div className="flex justify-between items-center border-b border-cafe-border/50 pb-4 select-none">
          <div>
            <h1 className="text-xl font-extrabold text-cafe-beige-mid tracking-tight">
              Table & Floor Grid Layout
            </h1>
            <p className="text-xs text-cafe-text-muted mt-0.5">
              Select an occupied dining table to manage orders or click a vacant table to start a new bill.
            </p>
          </div>
        </div>

        {isLoadingFloors || isLoadingOrders ? (
          <div className="flex-1 flex justify-center items-center h-96">
            <Spinner size="lg" />
          </div>
        ) : floors.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center h-96 text-cafe-text-muted select-none">
            <Armchair size={64} className="mb-3 opacity-40 animate-pulse" />
            <p className="font-semibold text-sm">No dining floors or tables registered.</p>
            <p className="text-xs opacity-80 mt-1">
              Configure floor plans and tables inside the Backend Admin Settings panel.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Floor tabs bar */}
            <div className="flex items-center gap-2 border-b border-cafe-border pb-3 overflow-x-auto select-none">
              {floors.map((floor) => (
                <button
                  key={floor.id}
                  type="button"
                  onClick={() => setActiveFloorId(floor.id)}
                  className={`flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold rounded-lg border transition-all ${
                    activeFloorId === floor.id
                      ? "bg-cafe-beige-mid text-[#1C1814] border-cafe-beige-mid shadow-lg"
                      : "bg-cafe-bg-card text-cafe-text-secondary border-cafe-border hover:border-cafe-text-muted"
                  }`}
                >
                  <Layers size={14} />
                  {floor.name}
                </button>
              ))}
            </div>

            {/* Tables Grid Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 select-none">
              {activeFloor?.tables?.length === 0 ? (
                <div className="col-span-full py-16 text-center text-cafe-text-muted text-xs">
                  No tables configured on this floor level yet.
                </div>
              ) : (
                activeFloor?.tables?.map((table) => {
                  const activeOrder = getTableOrder(table.id);
                  const isOccupied = !!activeOrder;

                  return (
                    <button
                      key={table.id}
                      type="button"
                      onClick={() => handleTableClick(table)}
                      className={`relative p-5 rounded-2xl border flex flex-col justify-between items-start text-left h-36 transition-all hover:scale-[1.02] ${
                        isOccupied
                          ? "bg-cafe-green-mid/10 text-cafe-green-light border-cafe-green-mid/50 hover:bg-cafe-green-mid/20 hover:shadow-lg hover:shadow-cafe-green-mid/5"
                          : "bg-cafe-bg-card text-cafe-text-primary border-cafe-border hover:border-cafe-text-muted hover:bg-cafe-bg-input/30"
                      }`}
                    >
                      <div className="flex justify-between items-start w-full gap-2">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-lg tracking-tight">
                            Table {table.table_number}
                          </span>
                          <span className="text-[10px] text-cafe-text-muted font-medium mt-0.5">
                            {table.seats} Seats configured
                          </span>
                        </div>
                        {isOccupied ? (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cafe-green-mid text-cafe-beige-light uppercase tracking-wider">
                            Occupied
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cafe-bg-input text-cafe-text-muted uppercase tracking-wider">
                            Vacant
                          </span>
                        )}
                      </div>

                      {/* Display Order Info or Vacant Text */}
                      {isOccupied ? (
                        <div className="w-full mt-auto flex flex-col gap-0.5 pt-2 border-t border-cafe-border/30">
                          <span className="text-[10px] text-cafe-text-muted font-semibold leading-none">
                            Active Bill
                          </span>
                          <span className="text-xs font-black text-cafe-beige-mid truncate">
                            {activeOrder.order_number}
                          </span>
                          <span className="text-xs font-bold text-cafe-green-light mt-0.5">
                            Total: -
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-cafe-text-muted font-medium mt-auto">
                          Ready for guests
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TableView;
