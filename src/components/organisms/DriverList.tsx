import React, { useState, useMemo } from 'react';
import { useFetchDrivers } from '../../hooks/useFetchData';
import { Table, SearchBar, FilterBar } from '../molecules';
import { Spinner } from '../atoms';
import styles from './EntityList.module.css';

export const DriverList: React.FC = () => {
  const driversState = useFetchDrivers();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ status: '' });

  const columns = [
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'licenseNumber',
      label: 'License Number',
    },
    {
      key: 'phoneNumber',
      label: 'Phone',
    },
    {
      key: 'status',
      label: 'Status',
      render: (status: string) => {
        let className = '';
        switch (status) {
          case 'available':
            className = styles.statusActive;
            break;
          case 'sick':
            className = styles.statusSick;
            break;
          case 'on_trip':
            className = styles.statusOnTrip;
            break;
          case 'leave':
            className = styles.statusLeave;
            break;
          default:
            className = styles.statusDefault;
        }
        return <span className={className}>● {status}</span>;
      },
    },
  ];

  const filterOptions = {
    status: [
      { value: 'available', label: 'Available' },
      { value: 'sick', label: 'Sick' },
      { value: 'on_trip', label: 'On Trip' },
      { value: 'leave', label: 'Leave' },
    ],
  };

  const filteredDrivers = useMemo(() => {
    if (!driversState?.items || !Array.isArray(driversState.items)) {
      return [];
    }
    return driversState.items.filter((driver) => {
      const matchesSearch =
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.phoneNumber.includes(searchQuery);
      const matchesFilter = !filters.status || driver.status === filters.status;
      return matchesSearch && matchesFilter;
    });
  }, [driversState, searchQuery, filters]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Drivers</h2>
        <div className={styles.controls}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, license, or phone..."
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

      {driversState.loading ? (
        <Spinner />
      ) : driversState.error ? (
        <div className={styles.error}>{driversState.error}</div>
      ) : (
        <Table columns={columns} data={filteredDrivers} pagination itemsPerPage={10} />
      )}
    </div>
  );
};
