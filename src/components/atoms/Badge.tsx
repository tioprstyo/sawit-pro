import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', children }) => {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>;
};
