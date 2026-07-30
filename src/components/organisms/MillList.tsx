import React from 'react';
import { useFetchMills } from '../../hooks/useFetchData';
import { Table } from '../molecules';
import { Spinner } from '../atoms';
import styles from './EntityList.module.css';

export const MillList: React.FC = () => {
  const millsState = useFetchMills();

  const columns = [
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'contactPerson',
      label: 'Contact Person',
    },
    {
      key: 'phoneNumber',
      label: 'Phone',
    },
    {
      key: 'avgDailyProduction',
      label: 'Avg Daily Production (tons)',
    },
  ];

  return (
    <div className={styles.container}>
      <h2>Mills</h2>
      {millsState.loading ? (
        <Spinner />
      ) : millsState.error ? (
        <div className={styles.error}>{millsState.error}</div>
      ) : (
        <Table columns={columns} data={millsState.items} />
      )}
    </div>
  );
};
