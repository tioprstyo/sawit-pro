import { useEffect, useState } from 'react';
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
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (fetched) return;

    const fetchData = async () => {
      try {
        dispatch(setVehicleLoading(true));
        const data = await api.vehicles.getAll();
        dispatch(setVehicles(data));
        setFetched(true);
      } catch (error) {
        dispatch(setVehicleError(error instanceof Error ? error.message : 'Failed to fetch vehicles'));
        setFetched(true);
      }
    };

    fetchData();
  }, [dispatch, fetched]);

  return vehicles;
};

export const useFetchDrivers = () => {
  const dispatch = useDispatch();
  const drivers = useSelector((state: RootState) => state.drivers);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (fetched) return;

    const fetchData = async () => {
      try {
        dispatch(setDriverLoading(true));
        const data = await api.drivers.getAll();
        dispatch(setDrivers(data));
        setFetched(true);
      } catch (error) {
        dispatch(setDriverError(error instanceof Error ? error.message : 'Failed to fetch drivers'));
        setFetched(true);
      }
    };

    fetchData();
  }, [dispatch, fetched]);

  return drivers;
};

export const useFetchMills = () => {
  const dispatch = useDispatch();
  const mills = useSelector((state: RootState) => state.mills);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (fetched) return;

    const fetchData = async () => {
      try {
        dispatch(setMillLoading(true));
        const data = await api.mills.getAll();
        dispatch(setMills(data));
        setFetched(true);
      } catch (error) {
        dispatch(setMillError(error instanceof Error ? error.message : 'Failed to fetch mills'));
        setFetched(true);
      }
    };

    fetchData();
  }, [dispatch, fetched]);

  return mills;
};

export const useFetchTrips = () => {
  const dispatch = useDispatch();
  const trips = useSelector((state: RootState) => state.trips);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (fetched) return;

    const fetchData = async () => {
      try {
        dispatch(setTripLoading(true));
        const data = await api.trips.getAll();
        dispatch(setTrips(data));
        setFetched(true);
      } catch (error) {
        dispatch(setTripError(error instanceof Error ? error.message : 'Failed to fetch trips'));
        setFetched(true);
      }
    };

    fetchData();
  }, [dispatch, fetched]);

  return trips;
};
