import React, { useState } from 'react';
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
  pagination?: boolean;
  itemsPerPage?: number;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps<any>>(
  ({ columns, data, loading, emptyMessage = 'No data available', onRowClick, pagination = true, itemsPerPage: initialItemsPerPage = 10 }, ref) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

    if (loading) {
      return <div className={styles.emptyState}>Loading...</div>;
    }

    if (data.length === 0) {
      return <div className={styles.emptyState}>{emptyMessage}</div>;
    }

    // Calculate pagination
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayData = pagination ? data.slice(startIndex, endIndex) : data;

    const goToPage = (page: number) => {
      const pageNum = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(pageNum);
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newItemsPerPage = parseInt(e.target.value);
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1); // Reset to first page when changing items per page
    };

    return (
      <div className={styles.tableContainer}>
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
              {displayData.map((row, index) => (
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

        {pagination && totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.paginationBtn}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>

            <div className={styles.pageInfo}>
              Page <input
                type="number"
                className={styles.pageInput}
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                min="1"
                max={totalPages}
              /> of {totalPages}
            </div>

            <button
              className={styles.paginationBtn}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>

            <div className={styles.itemsPerPageSelector}>
              <label>
                Items per page:
                <select
                  className={styles.itemsSelect}
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </label>
            </div>

            <div className={styles.totalItems}>
              Total: {data.length} items
            </div>
          </div>
        )}
      </div>
    );
  }
);

Table.displayName = 'Table';
