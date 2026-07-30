import React from 'react';
import { useFetchDrivers } from '../../hooks/useFetchData';
import { Table } from '../molecules';
import { Badge, Spinner } from '../atoms';
import styles from './EntityList.module.css';

export const DriverList: React.FC = () => {
  const driversState = useFetchDrivers();

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
      render: (status: string) => (
        <Badge variant={status === 'available' ? 'success' : 'warning'}>{status}</Badge>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <h2>Drivers</h2>
      {driversState.loading ? (
        <Spinner />
      ) : driversState.error ? (
        <div className={styles.error}>{driversState.error}</div>
      ) : (
        <Table columns={columns} data={driversState.items} />
      )}
    </div>
  );
};
