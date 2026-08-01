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
    try {
      if (!millsState?.items || !Array.isArray(millsState.items)) {
        return [];
      }
      return millsState.items.filter((mill) => {
        try {
          if (!mill || typeof mill !== 'object') return false;
          const searchLower = String(searchQuery ?? '').toLowerCase();
          const name = String(mill?.name ?? '').toLowerCase();
          const address = String(mill?.location?.address ?? '').toLowerCase();
          const contact = String(mill?.contactPerson ?? '').toLowerCase();
          const phone = String(mill?.phoneNumber ?? '');
          const matchesSearch =
            name.includes(searchLower) ||
            address.includes(searchLower) ||
            contact.includes(searchLower) ||
            phone.includes(searchQuery);
          return matchesSearch;
        } catch (e) {
          console.error('MillList filter error:', mill, e);
          return false;
        }
      });
    } catch (e) {
      console.error('MillList useMemo error:', e);
      return [];
    }
  }, [millsState, searchQuery]);

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
