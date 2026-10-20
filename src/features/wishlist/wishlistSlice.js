import { createSlice } from '@reduxjs/toolkit';
import { readStorage } from '../../app/storage';

const saved = readStorage('morrow-wishlist', []);
const initialIds = Array.isArray(saved) ? saved.filter((id) => typeof id === 'string') : [];

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { ids: initialIds },
  reducers: {
    toggleWishlist: (state, action) => {
      const id = action.payload;
      const index = state.ids.indexOf(id);
      if (index >= 0) state.ids.splice(index, 1);
      else state.ids.push(id);
    },
    removeWishlistItem: (state, action) => { state.ids = state.ids.filter((id) => id !== action.payload); },
  },
});

export const { toggleWishlist, removeWishlistItem } = wishlistSlice.actions;
export const selectWishlistCount = (state) => state.wishlist.ids.length;
export const selectWishlistProducts = (state) => state.products.items.filter((product) => state.wishlist.ids.includes(product.id));
export default wishlistSlice.reducer;
