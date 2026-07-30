import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { db } from './services/database';
import {
  Dashboard,
  VehicleList,
  DriverList,
  MillList,
  TripList,
} from './components/organisms';
import styles from './App.module.css';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: '📊' },
    { label: 'Vehicles', path: '/vehicles', icon: '🚛' },
    { label: 'Drivers', path: '/drivers', icon: '👤' },
    { label: 'Mills', path: '/mills', icon: '🏭' },
    { label: 'Trips', path: '/trips', icon: '🛣️' },
  ];

  return (
    <div className={styles.appLayout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <Link to="/" className={styles.sidebarLogo}>
              🚛 Fleet
            </Link>
          </div>

          <nav className={styles.sidebarNav}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navItem} ${
                  location.pathname === item.path ? styles.active : ''
                }`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className={styles.sidebarFooter}>
            <div className={styles.upgradeCard}>
              <div className={styles.upgradeText}>Upgrade to Pro</div>
              <button className={styles.upgradeBtn}>→</button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.mainWrapper}>
        {/* Header */}
        <header className={styles.header}>
          <button
            className={styles.sidebarToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <div className={styles.headerCenter}>
            <h1 className={styles.pageTitle}>Fleet Management</h1>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.searchBar}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search anything..."
                className={styles.searchInput}
              />
            </div>
            <button className={styles.notificationBtn}>
              🔔
              <span className={styles.badge}>3</span>
            </button>
            <div className={styles.userProfile}>
              <div className={styles.userAvatar}>👤</div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vehicles" element={<VehicleList />} />
            <Route path="/drivers" element={<DriverList />} />
            <Route path="/mills" element={<MillList />} />
            <Route path="/trips" element={<TripList />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    db.seedData();
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
