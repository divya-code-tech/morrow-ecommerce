import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProducts } from '../../services/productService';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => getProducts(),
  { condition: (_, { getState }) => !['loading', 'succeeded'].includes(getState().products.status) },
);

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchProducts.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message || 'Something went wrong.'; });
  },
});

export default productsSlice.reducer;
