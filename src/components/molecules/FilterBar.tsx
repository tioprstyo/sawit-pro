import React from 'react';
import styles from './FilterBar.module.css';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  filters: {
    [key: string]: string;
  };
  filterOptions: {
    [key: string]: FilterOption[];
  };
  onFilterChange: (filterName: string, value: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  filterOptions,
  onFilterChange,
}) => {
  return (
    <div className={styles.filterContainer}>
      {Object.entries(filterOptions).map(([filterName, options]) => (
        <select
          key={filterName}
          value={filters[filterName] || ''}
          onChange={(e) => onFilterChange(filterName, e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All {filterName}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
};
