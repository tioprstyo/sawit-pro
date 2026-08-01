import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useFetchTrips, useFetchDrivers, useFetchVehicles } from '../../hooks/useFetchData';
import { Table, SearchBar, FilterBar } from '../molecules';
import { Spinner } from '../atoms';
import type { RootState } from '../../store';
import { format } from 'date-fns';
import styles from './EntityList.module.css';

export const TripList: React.FC = () => {
  const tripsState = useFetchTrips();
  const drivorsState = useFetchDrivers();
  const vehiclesState = useFetchVehicles();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ status: '' });

  const drivers = useSelector((state: RootState) => state.drivers.items);
  const vehicles = useSelector((state: RootState) => state.vehicles.items);

  const getDriverName = (driverId: string) => {
    return drivers.find(d => d.id === driverId)?.name || 'N/A';
  };

  const getVehiclePlate = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId)?.plateNumber || 'N/A';
  };

  const filterOptions = {
    status: [
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
    ],
  };

  const filteredTrips = useMemo(() => {
    try {
      if (!tripsState?.items || !Array.isArray(tripsState.items)) {
        return [];
      }
      return tripsState.items.filter((trip: any) => {
        try {
          if (!trip || typeof trip !== 'object') return false;
          const searchLower = String(searchQuery ?? '').toLowerCase();
          const tripId = String(trip?.id ?? '').toLowerCase();
          const driverName = String(getDriverName(trip?.driverId) ?? '').toLowerCase();
          const vehiclePlate = String(getVehiclePlate(trip?.vehicleId) ?? '').toLowerCase();
          const matchesSearch =
            tripId.includes(searchLower) ||
            driverName.includes(searchLower) ||
            vehiclePlate.includes(searchLower);
          const matchesFilter = !filters.status || String(trip?.status ?? '') === filters.status;
          return matchesSearch && matchesFilter;
        } catch (e) {
          console.error('TripList filter error:', trip, e);
          return false;
        }
      });
    } catch (e) {
      console.error('TripList useMemo error:', e);
      return [];
    }
  }, [tripsState, searchQuery, filters, drivers, vehicles]);

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
      key: 'date',
      label: 'Date',
      render: (date: any) => {
        if (!date) return 'N/A';
        try {
          return format(new Date(date), 'yyyy-MM-dd');
        } catch {
          return 'Invalid date';
        }
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (status: string) => {
        let className = '';
        switch (status) {
          case 'scheduled':
            className = styles.statusDefault;
            break;
          case 'in_progress':
            className = styles.statusOnTrip;
            break;
          case 'completed':
            className = styles.statusActive;
            break;
          case 'cancelled':
            className = styles.statusSick;
            break;
          default:
            className = styles.statusDefault;
        }
        return <span className={className}>● {status}</span>;
      },
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Trips</h2>
        <div className={styles.controls}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by trip ID, driver, or vehicle..."
          />
          <FilterBar
            filters={filters}
            filterOptions={filterOptions}
            onFilterChange={(filterName, value) =>
              setFilters({ ...filters, [filterName]: value })
            }
          />
        </div>
      </div>

      {tripsState.loading || drivorsState.loading || vehiclesState.loading ? (
        <Spinner />
      ) : tripsState.error ? (
        <div className={styles.error}>{tripsState.error}</div>
      ) : (
        <Table columns={columns} data={filteredTrips} pagination itemsPerPage={10} />
      )}
    </div>
  );
};
