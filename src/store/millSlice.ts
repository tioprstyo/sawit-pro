import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Mill } from '../types';

interface MillState {
  items: Mill[];
  loading: boolean;
  error: string | null;
}

const initialState: MillState = {
  items: [],
  loading: false,
  error: null,
};

const millSlice = createSlice({
  name: 'mills',
  initialState,
  reducers: {
    setMills: (state, action: PayloadAction<Mill[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addMill: (state, action: PayloadAction<Mill>) => {
      state.items.push(action.payload);
    },
    updateMill: (state, action: PayloadAction<Mill>) => {
      const index = state.items.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteMill: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(m => m.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setMills,
  addMill,
  updateMill,
  deleteMill,
  setLoading,
  setError,
} = millSlice.actions;

export default millSlice.reducer;
