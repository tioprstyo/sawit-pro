import React from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'info' | 'warning' | 'danger';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, variant = 'default' }) => {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  );
};
