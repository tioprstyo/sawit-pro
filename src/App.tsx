import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
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

function App() {
  useEffect(() => {
    db.seedData();
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className={styles.app}>
          <nav className={styles.navbar}>
            <div className={styles.navContent}>
              <h1 className={styles.logo}>🚛 Fleet Manager</h1>
              <ul className={styles.navLinks}>
                <li>
                  <Link to="/">Dashboard</Link>
                </li>
                <li>
                  <Link to="/vehicles">Vehicles</Link>
                </li>
                <li>
                  <Link to="/drivers">Drivers</Link>
                </li>
                <li>
                  <Link to="/mills">Mills</Link>
                </li>
                <li>
                  <Link to="/trips">Trips</Link>
                </li>
              </ul>
            </div>
          </nav>

          <main className={styles.main}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/vehicles" element={<VehicleList />} />
              <Route path="/drivers" element={<DriverList />} />
              <Route path="/mills" element={<MillList />} />
              <Route path="/trips" element={<TripList />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
