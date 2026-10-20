import { createSlice } from '@reduxjs/toolkit';
import { readStorage } from '../../app/storage';

const persistedItems = readStorage('morrow-cart', []);
const validItems = Array.isArray(persistedItems)
  ? persistedItems.filter((item) => item && typeof item.productId === 'string' && Number.isFinite(item.quantity) && item.quantity > 0)
  : [];

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: validItems },
  reducers: {
    addToCart: (state, action) => {
      const { productId, quantity = 1 } = action.payload;
      const safeQuantity = Math.max(1, Math.min(10, Number(quantity) || 1));
      const existing = state.items.find((item) => item.productId === productId);
      if (existing) existing.quantity = Math.min(10, existing.quantity + safeQuantity);
      else state.items.push({ productId, quantity: safeQuantity });
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
    setQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((entry) => entry.productId === productId);
      if (!item) return;
      if (quantity <= 0) state.items = state.items.filter((entry) => entry.productId !== productId);
      else item.quantity = Math.max(1, Math.min(10, Number(quantity) || 1));
    },
    clearCart: (state) => { state.items = []; },
  },
});

export const { addToCart, removeFromCart, setQuantity, clearCart } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items
  .map((line) => {
    const product = state.products.items.find((item) => item.id === line.productId);
    return product ? { ...product, quantity: line.quantity, lineTotal: product.price * line.quantity } : null;
  })
  .filter(Boolean);
export const selectCartCount = (state) => state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartSubtotal = (state) => selectCartItems(state).reduce((total, item) => total + item.lineTotal, 0);
export default cartSlice.reducer;
