import React from 'react';
import { useSelector } from 'react-redux';
import { useFetchTrips, useFetchDrivers, useFetchVehicles } from '../../hooks/useFetchData';
import { Table } from '../molecules';
import { Badge, Spinner } from '../atoms';
import type { RootState } from '../../store';
import { format } from 'date-fns';
import styles from './EntityList.module.css';

export const TripList: React.FC = () => {
  const tripsState = useFetchTrips();
  const drivorsState = useFetchDrivers();
  const vehiclesState = useFetchVehicles();

  const drivers = useSelector((state: RootState) => state.drivers.items);
  const vehicles = useSelector((state: RootState) => state.vehicles.items);

  const getDriverName = (driverId: string) => {
    return drivers.find(d => d.id === driverId)?.name || 'N/A';
  };

  const getVehiclePlate = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId)?.plateNumber || 'N/A';
  };

  const columns = [
    {
      key: 'id',
      label: 'Trip ID',
      render: (id: string) => id.substring(0, 8),
    },
    {
      key: 'vehicleId',
      label: 'Vehicle',
      render: (vehicleId: string) => getVehiclePlate(vehicleId),
    },
    {
      key: 'driverId',
      label: 'Driver',
      render: (driverId: string) => getDriverName(driverId),
    },
    {
      key: 'scheduledDate',
      label: 'Scheduled Date',
      render: (date: any) => format(new Date(date), 'yyyy-MM-dd'),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status: string) => {
        let variant: 'success' | 'info' | 'warning' | 'danger' = 'info';
        if (status === 'completed') variant = 'success';
        else if (status === 'in_progress') variant = 'info';
        else if (status === 'cancelled') variant = 'danger';
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
  ];

  return (
    <div className={styles.container}>
      <h2>Trips</h2>
      {tripsState.loading || drivorsState.loading || vehiclesState.loading ? (
        <Spinner />
      ) : tripsState.error ? (
        <div className={styles.error}>{tripsState.error}</div>
      ) : (
        <Table columns={columns} data={tripsState.items} />
      )}
    </div>
  );
};
