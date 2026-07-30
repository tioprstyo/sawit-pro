import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Vehicle } from '../types';

interface VehicleState {
  items: Vehicle[];
  loading: boolean;
  error: string | null;
}

const initialState: VehicleState = {
  items: [],
  loading: false,
  error: null,
};

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.items.push(action.payload);
    },
    updateVehicle: (state, action: PayloadAction<Vehicle>) => {
      const index = state.items.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteVehicle: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(v => v.id !== action.payload);
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
  setVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  setLoading,
  setError,
} = vehicleSlice.actions;

export default vehicleSlice.reducer;
