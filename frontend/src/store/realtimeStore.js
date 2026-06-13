import { create } from "zustand";

const initialTables = [
  { id: "T1", number: 1, seats: 2, status: "free" },
  { id: "T2", number: 2, seats: 4, status: "occupied" },
  { id: "T3", number: 3, seats: 2, status: "payment_pending" },
  { id: "T4", number: 4, seats: 4, status: "free" },
  { id: "T5", number: 5, seats: 2, status: "occupied" },
  { id: "T6", number: 6, seats: 6, status: "free" },
];

const initialOrders = [
  {
    id: "o-101",
    orderNumber: 21,
    tableId: "T2",
    tableNumber: 2,
    customerName: "Walk-in",
    status: "to_cook",
    accepted: false,
    paymentStatus: "unpaid",
    items: [
      { name: "Burger", quantity: 2 },
      { name: "Coffee", quantity: 1 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "o-102",
    orderNumber: 19,
    tableId: "T5",
    tableNumber: 5,
    customerName: "Family Table",
    status: "preparing",
    accepted: true,
    paymentStatus: "unpaid",
    items: [
      { name: "Pizza", quantity: 1 },
      { name: "Mojito", quantity: 1 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "o-103",
    orderNumber: 14,
    tableId: "T3",
    tableNumber: 3,
    customerName: "Cabin 3",
    status: "completed",
    accepted: true,
    paymentStatus: "unpaid",
    items: [
      { name: "Fries", quantity: 2 },
      { name: "Coffee", quantity: 1 },
    ],
    createdAt: new Date().toISOString(),
  },
];

const setTableStatusForOrder = (tables, tableId, status) =>
  tables.map((table) =>
    table.id === tableId ? { ...table, status } : table
  );

export const useRealtimeStore = create((set) => ({
  tables: initialTables,
  orders: initialOrders,

  setTables: (tables) => set({ tables }),
  setOrders: (orders) => set({ orders }),

  updateTableStatus: (tableId, status) =>
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === tableId ? { ...table, status } : table
      ),
    })),

  addOrder: (order) =>
    set((state) => {
      const tableId = order.tableId;
      const updatedTables = tableId
        ? setTableStatusForOrder(state.tables, tableId, "occupied")
        : state.tables;

      return {
        orders: [order, ...state.orders],
        tables: updatedTables,
      };
    }),

  acceptOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, accepted: true } : order
      ),
    })),

  moveToPreparing: (orderId) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? { ...order, status: "preparing", accepted: true }
          : order
      ),
    })),

  moveToCompleted: (orderId) =>
    set((state) => {
      const order = state.orders.find((o) => o.id === orderId);
      const updatedTables =
        order?.tableId != null
          ? setTableStatusForOrder(state.tables, order.tableId, "payment_pending")
          : state.tables;

      return {
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, status: "completed", accepted: true } : o
        ),
        tables: updatedTables,
      };
    }),

  markPaymentSuccess: (orderId) =>
    set((state) => {
      const order = state.orders.find((o) => o.id === orderId);
      const updatedTables =
        order?.tableId != null
          ? setTableStatusForOrder(state.tables, order.tableId, "free")
          : state.tables;

      return {
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, paymentStatus: "paid" } : o
        ),
        tables: updatedTables,
      };
    }),
}));