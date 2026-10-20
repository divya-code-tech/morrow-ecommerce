import { createSlice } from '@reduxjs/toolkit';
import { readStorage } from '../../app/storage';

const savedTheme = readStorage('morrow-theme', 'light');
const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { theme: initialTheme, toast: null, toastId: 0 },
  reducers: {
    toggleTheme: (state) => { state.theme = state.theme === 'light' ? 'dark' : 'light'; },
    showToast: (state, action) => { state.toast = action.payload; state.toastId += 1; },
    clearToast: (state) => { state.toast = null; },
  },
});

export const { toggleTheme, showToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
