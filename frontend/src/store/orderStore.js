import { create } from "zustand";

const useOrderStore = create(
  (set) => ({
    orders: [],

    addOrder: (order) =>
      set((state) => ({
        orders: [
          order,
          ...state.orders,
        ],
      })),

    updateOrderStatus: (
      id,
      status
    ) =>
      set((state) => ({
        orders:
          state.orders.map(
            (order) =>
              order.id === id
                ? {
                    ...order,
                    status,
                  }
                : order
          ),
      })),

    deleteOrder: (id) =>
      set((state) => ({
        orders:
          state.orders.filter(
            (order) =>
              order.id !== id
          ),
      })),

    setOrders: (orders) =>
      set({
        orders,
      }),

    clearOrders: () =>
      set({
        orders: [],
      }),
  })
);

export default useOrderStore;