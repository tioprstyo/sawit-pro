import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Trip } from '../types';

interface TripState {
  items: Trip[];
  loading: boolean;
  error: string | null;
}

const initialState: TripState = {
  items: [],
  loading: false,
  error: null,
};

const tripSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setTrips: (state, action: PayloadAction<Trip[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addTrip: (state, action: PayloadAction<Trip>) => {
      state.items.push(action.payload);
    },
    updateTrip: (state, action: PayloadAction<Trip>) => {
      const index = state.items.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTrip: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(t => t.id !== action.payload);
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
  setTrips,
  addTrip,
  updateTrip,
  deleteTrip,
  setLoading,
  setError,
} = tripSlice.actions;

export default tripSlice.reducer;
