import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../api';
import { setVehicles, setLoading as setVehicleLoading, setError as setVehicleError } from '../store/vehicleSlice';
import { setDrivers, setLoading as setDriverLoading, setError as setDriverError } from '../store/driverSlice';
import { setMills, setLoading as setMillLoading, setError as setMillError } from '../store/millSlice';
import { setTrips, setLoading as setTripLoading, setError as setTripError } from '../store/tripSlice';
import type { RootState } from '../store';

export const useFetchVehicles = () => {
  const dispatch = useDispatch();
  const vehicles = useSelector((state: RootState) => state.vehicles);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setVehicleLoading(true));
        const data = await api.vehicles.getAll();
        dispatch(setVehicles(data));
      } catch (error) {
        dispatch(setVehicleError(error instanceof Error ? error.message : 'Failed to fetch vehicles'));
      } finally {
        dispatch(setVehicleLoading(false));
      }
    };

    fetchData();
  }, [dispatch]);

  return vehicles;
};

export const useFetchDrivers = () => {
  const dispatch = useDispatch();
  const drivers = useSelector((state: RootState) => state.drivers);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setDriverLoading(true));
        const data = await api.drivers.getAll();
        dispatch(setDrivers(data));
      } catch (error) {
        dispatch(setDriverError(error instanceof Error ? error.message : 'Failed to fetch drivers'));
      } finally {
        dispatch(setDriverLoading(false));
      }
    };

    fetchData();
  }, [dispatch]);

  return drivers;
};

export const useFetchMills = () => {
  const dispatch = useDispatch();
  const mills = useSelector((state: RootState) => state.mills);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setMillLoading(true));
        const data = await api.mills.getAll();
        dispatch(setMills(data));
      } catch (error) {
        dispatch(setMillError(error instanceof Error ? error.message : 'Failed to fetch mills'));
      } finally {
        dispatch(setMillLoading(false));
      }
    };

    fetchData();
  }, [dispatch]);

  return mills;
};

export const useFetchTrips = () => {
  const dispatch = useDispatch();
  const trips = useSelector((state: RootState) => state.trips);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setTripLoading(true));
        const data = await api.trips.getAll();
        dispatch(setTrips(data));
      } catch (error) {
        dispatch(setTripError(error instanceof Error ? error.message : 'Failed to fetch trips'));
      } finally {
        dispatch(setTripLoading(false));
      }
    };

    fetchData();
  }, [dispatch]);

  return trips;
};
