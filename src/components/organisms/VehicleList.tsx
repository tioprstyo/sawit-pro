import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFetchVehicles } from '../../hooks/useFetchData';
import type { Vehicle } from '../../types';
import { Table } from '../molecules';
import { Button, Badge, Spinner } from '../atoms';
import { api } from '../../api';
import { deleteVehicle } from '../../store/vehicleSlice';
import type { RootState } from '../../store';
import styles from './VehicleList.module.css';
import VehicleForm from './VehicleForm';

export const VehicleList: React.FC = () => {
  const dispatch = useDispatch();
  const vehiclesState = useFetchVehicles();
  const drivers = useSelector((state: RootState) => state.drivers.items);
  const [showForm, setShowForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await api.vehicles.delete(id);
        dispatch(deleteVehicle(id));
      } catch (error) {
        console.error('Failed to delete vehicle:', error);
      }
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedVehicle(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedVehicle(null);
  };

  const getDriverName = (driverId: string) => {
    return drivers.find(d => d.id === driverId)?.name || 'N/A';
  };

  const columns = [
    {
      key: 'plateNumber',
      label: 'Plate Number',
    },
    {
      key: 'type',
      label: 'Type',
    },
    {
      key: 'capacity',
      label: 'Capacity (tons)',
    },
    {
      key: 'driverId',
      label: 'Driver',
      render: (driverId: string) => getDriverName(driverId),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status: string) => (
        <Badge variant={status === 'active' ? 'success' : 'warning'}>{status}</Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, vehicle: Vehicle) => (
        <div className={styles.actions}>
          <Button size="sm" variant="secondary" onClick={() => handleEdit(vehicle)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(vehicle.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Vehicles</h2>
        <Button variant="primary" onClick={handleAdd}>
          Add Vehicle
        </Button>
      </div>

      {vehiclesState.loading ? (
        <Spinner />
      ) : vehiclesState.error ? (
        <div className={styles.error}>{vehiclesState.error}</div>
      ) : (
        <Table columns={columns} data={vehiclesState.items} />
      )}

      {showForm && (
        <VehicleForm vehicle={selectedVehicle} onClose={handleFormClose} drivers={drivers} />
      )}
    </div>
  );
};
