import React from 'react';
import styles from './Table.module.css';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps<any>>(
  ({ columns, data, loading, emptyMessage = 'No data available', onRowClick }, ref) => {
    if (loading) {
      return <div className={styles.emptyState}>Loading...</div>;
    }

    if (data.length === 0) {
      return <div className={styles.emptyState}>{emptyMessage}</div>;
    }

    return (
      <div className={styles.tableWrapper}>
        <table className={styles.table} ref={ref}>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={String(col.key)}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} onClick={() => onRowClick?.(row)} className={onRowClick ? styles.clickable : ''}>
                {columns.map(col => (
                  <td key={String(col.key)}>
                    {col.render ? col.render((row as any)[col.key as string], row) : (row as any)[col.key as string]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';
