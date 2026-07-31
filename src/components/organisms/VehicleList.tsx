import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFetchVehicles, useFetchDrivers } from '../../hooks/useFetchData';
import type { Vehicle } from '../../types';
import { Table, SearchBar, FilterBar } from '../molecules';
import { Button, Spinner } from '../atoms';
import { api } from '../../api';
import { deleteVehicle } from '../../store/vehicleSlice';
import type { RootState } from '../../store';
import styles from './VehicleList.module.css';
import VehicleForm from './VehicleForm';

export const VehicleList: React.FC = () => {
  const dispatch = useDispatch();
  const vehiclesState = useFetchVehicles();
  useFetchDrivers();
  const drivers = useSelector((state: RootState) => state.drivers.items);
  const [showForm, setShowForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ type: '', status: '' });

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

  const filterOptions = {
    type: [
      { value: 'truck', label: 'Truck' },
      { value: 'tanker', label: 'Tanker' },
      { value: 'trailer', label: 'Trailer' },
      { value: 'flatbed', label: 'Flatbed' },
    ],
    status: [
      { value: 'active', label: 'Active' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'breakdown', label: 'Breakdown' },
    ],
  };

  const filteredVehicles = useMemo(() => {
    if (!vehiclesState?.items || !Array.isArray(vehiclesState.items)) {
      return [];
    }
    return vehiclesState.items.filter((vehicle) => {
      const matchesSearch =
        vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTypeFilter = !filters.type || vehicle.type === filters.type;
      const matchesStatusFilter = !filters.status || vehicle.status === filters.status;
      return matchesSearch && matchesTypeFilter && matchesStatusFilter;
    });
  }, [vehiclesState, searchQuery, filters]);

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
      render: (status: string) => {
        let className = '';
        switch (status) {
          case 'active':
            className = styles.statusActive;
            break;
          case 'maintenance':
            className = styles.statusMaintenance;
            break;
          case 'breakdown':
            className = styles.statusBreakdown;
            break;
          default:
            className = styles.statusDefault;
        }
        return <span className={className}>● {status}</span>;
      },
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

      <div className={styles.controls}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by plate number or type..."
        />
        <FilterBar
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={(filterName, value) =>
            setFilters({ ...filters, [filterName]: value })
          }
        />
      </div>

      {vehiclesState.loading ? (
        <Spinner />
      ) : vehiclesState.error ? (
        <div className={styles.error}>{vehiclesState.error}</div>
      ) : (
        <Table columns={columns} data={filteredVehicles} pagination itemsPerPage={10} />
      )}

      {showForm && (
        <VehicleForm vehicle={selectedVehicle} onClose={handleFormClose} drivers={drivers} />
      )}
    </div>
  );
};
