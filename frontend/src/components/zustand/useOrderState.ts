import { create } from "zustand";
import { StateCreator } from "zustand";
import orderService, { Order } from "../../services/orderService";

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
}

const store: StateCreator<OrderState> = (set) => ({
  orders: [],
  isLoading: false,
  error: null,
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.getOrders();
      set({ orders: response.carts, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch orders", isLoading: false });
    }
  },
});

export const useOrderState = create(store);
