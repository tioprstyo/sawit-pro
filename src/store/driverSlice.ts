import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Driver } from '../types';

interface DriverState {
  items: Driver[];
  loading: boolean;
  error: string | null;
}

const initialState: DriverState = {
  items: [],
  loading: false,
  error: null,
};

const driverSlice = createSlice({
  name: 'drivers',
  initialState,
  reducers: {
    setDrivers: (state, action: PayloadAction<Driver[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addDriver: (state, action: PayloadAction<Driver>) => {
      state.items.push(action.payload);
    },
    updateDriver: (state, action: PayloadAction<Driver>) => {
      const index = state.items.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteDriver: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(d => d.id !== action.payload);
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
  setDrivers,
  addDriver,
  updateDriver,
  deleteDriver,
  setLoading,
  setError,
} = driverSlice.actions;

export default driverSlice.reducer;
