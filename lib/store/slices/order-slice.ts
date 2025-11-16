import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderState {
  items: OrderItem[];
  totalAmount: number;
  totalQuantity: number;
  status: "idle" | "pending" | "completed" | "failed";
  orderId?: string;
}

const initialState: OrderState = {
  items: [],
  totalAmount: 0,
  totalQuantity: 0,
  status: "idle",
  orderId: undefined,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addToOrder: (state, action: PayloadAction<OrderItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      state.totalQuantity += action.payload.quantity;
      state.totalAmount += action.payload.price * action.payload.quantity;
    },

    removeFromOrder: (state, action: PayloadAction<string>) => {
      const itemToRemove = state.items.find(
        (item) => item.id === action.payload
      );

      if (itemToRemove) {
        state.totalQuantity -= itemToRemove.quantity;
        state.totalAmount -= itemToRemove.price * itemToRemove.quantity;
        state.items = state.items.filter((item) => item.id !== action.payload);
      }
    },

    updateOrderQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);

      if (item) {
        const quantityDiff = action.payload.quantity - item.quantity;
        item.quantity = action.payload.quantity;
        state.totalQuantity += quantityDiff;
        state.totalAmount += item.price * quantityDiff;
      }
    },

    clearOrder: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
      state.status = "idle";
      state.orderId = undefined;
    },

    setOrderStatus: (
      state,
      action: PayloadAction<"idle" | "pending" | "completed" | "failed">
    ) => {
      state.status = action.payload;
    },

    setOrderId: (state, action: PayloadAction<string>) => {
      state.orderId = action.payload;
    },
  },
});

export const {
  addToOrder,
  removeFromOrder,
  updateOrderQuantity,
  clearOrder,
  setOrderStatus,
  setOrderId,
} = orderSlice.actions;
export default orderSlice.reducer;
