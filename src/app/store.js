import { configureStore } from '@reduxjs/toolkit';
import { writeStorage } from './storage';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
  },
});

// Persist only the small, user-owned parts of the store rather than the product catalogue.
store.subscribe(() => {
  const state = store.getState();
  writeStorage('morrow-cart', state.cart.items);
  writeStorage('morrow-wishlist', state.wishlist.ids);
  writeStorage('morrow-theme', state.ui.theme);
});
