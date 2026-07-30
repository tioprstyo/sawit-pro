import { configureStore } from '@reduxjs/toolkit';
import vehicleReducer from './vehicleSlice';
import driverReducer from './driverSlice';
import millReducer from './millSlice';
import tripReducer from './tripSlice';

export const store = configureStore({
  reducer: {
    vehicles: vehicleReducer,
    drivers: driverReducer,
    mills: millReducer,
    trips: tripReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
