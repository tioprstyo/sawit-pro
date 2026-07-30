import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import type { DashboardSummary } from '../../types';
import { StatCard, Spinner } from '../atoms';
import styles from './Dashboard.module.css';

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await api.dashboard.getSummary();
        setSummary(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!summary) {
    return <div className={styles.empty}>No data available</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.titleIcon}>🚛</div>
          <div>
            <h1 className={styles.title}>Fleet Overview</h1>
            <p className={styles.subtitle}>Real-time fleet management dashboard</p>
          </div>
        </div>
        <div className={styles.lastUpdated}>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className={styles.metricsContainer}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Fleet Status</h3>
          <div className={styles.grid}>
            <StatCard
              title="Total Vehicles"
              value={summary.totalVehicles}
              variant="info"
              icon="🚗"
            />
            <StatCard
              title="Active Vehicles"
              value={summary.activeVehicles}
              variant="success"
              icon="✓"
            />
            <StatCard
              title="Available Drivers"
              value={summary.availableDrivers}
              variant="success"
              icon="👤"
            />
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Operations</h3>
          <div className={styles.grid}>
            <StatCard
              title="Scheduled Trips"
              value={summary.scheduledTrips}
              variant="info"
              icon="📅"
            />
            <StatCard
              title="Completed Trips"
              value={summary.completedTrips}
              variant="success"
              icon="✓"
            />
            <StatCard
              title="Pending Collections"
              value={summary.pendingCollections}
              variant="warning"
              icon="📦"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
