import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICourse } from "@/app/types/course.contract";

interface CartState {
  items: ICourse[];
  total: number;
  discountTotal: number;
  isCartOpen: boolean;
  isCartVisible: boolean;
}

const initialState: CartState = {
  items: [],
  total: 0,
  discountTotal: 0,
  isCartOpen: false,
  isCartVisible: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ICourse>) => {
      const existingItem = state.items.find((item) => item._id === action.payload._id);
      if (!existingItem) {
        state.items.push(action.payload);
        state.total += action.payload.price;
        state.discountTotal += action.payload.discountPrice || action.payload.price;
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemToRemove = state.items.find((item) => item._id === action.payload);
      if (itemToRemove) {
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.total -= itemToRemove.price;
        state.discountTotal -= itemToRemove.discountPrice || itemToRemove.price;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.discountTotal = 0;
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    toggleCartVisiblity: (state) => {
      state.isCartVisible = !state.isCartVisible;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, toggleCart, toggleCartVisiblity } = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) => state.cart.total;
export const selectCartDiscountTotal = (state: { cart: CartState }) => state.cart.discountTotal;
export const selectIsCartOpen = (state: { cart: CartState }) => state.cart.isCartOpen;
export const selectIsCartVisible = (state: { cart: CartState }) => state.cart.isCartVisible;

export default cartSlice.reducer;
