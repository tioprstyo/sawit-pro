import React, { useState, useMemo } from 'react';
import { useFetchMills } from '../../hooks/useFetchData';
import { Table, SearchBar } from '../molecules';
import { Spinner } from '../atoms';
import styles from './EntityList.module.css';

export const MillList: React.FC = () => {
  const millsState = useFetchMills();
  const [searchQuery, setSearchQuery] = useState('');

  const columns = [
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'location',
      label: 'Location',
      render: (location: any) => location?.address || 'N/A',
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

  const filteredMills = useMemo(() => {
    return millsState.items.filter((mill) => {
      const matchesSearch =
        mill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mill.location?.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mill.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mill.phoneNumber.includes(searchQuery);
      return matchesSearch;
    });
  }, [millsState.items, searchQuery]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Mills</h2>
        <div className={styles.controls}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, location, or contact person..."
          />
        </div>
      </div>

      {millsState.loading ? (
        <Spinner />
      ) : millsState.error ? (
        <div className={styles.error}>{millsState.error}</div>
      ) : (
        <Table columns={columns} data={filteredMills} pagination itemsPerPage={10} />
      )}
    </div>
  );
};
