import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { db } from "./services/database";
import {
  Dashboard,
  VehicleList,
  DriverList,
  MillList,
  TripList,
} from "./components/organisms";
import styles from "./App.module.css";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/", icon: "📊" },
    { label: "Vehicles", path: "/vehicles", icon: "🚛" },
    { label: "Drivers", path: "/drivers", icon: "👤" },
    { label: "Mills", path: "/mills", icon: "🏭" },
    { label: "Trips", path: "/trips", icon: "🛣️" },
  ];

  return (
    <div className={styles.appLayout}>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}
      >
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
                  location.pathname === item.path ? styles.active : ""
                }`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            ))}
          </nav>
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
            <div className={styles.userProfile}>
              <button
                className={styles.userAvatarBtn}
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <div className={styles.userAvatar}>👤</div>
              </button>
              {profileMenuOpen && (
                <div className={styles.profileMenu}>
                  <div className={styles.profileMenuDivider}></div>
                  <button
                    className={styles.profileMenuItem}
                    onClick={() => {
                      alert("Logged out!");
                      setProfileMenuOpen(false);
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
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
