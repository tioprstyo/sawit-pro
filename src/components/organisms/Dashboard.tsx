import React, { useEffect, useState, useMemo } from "react";
import { api } from "../../api";
import type { Vehicle } from "../../types";
import { Spinner } from "../atoms";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./Dashboard.module.css";

export const Dashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [vehiclesData, tripsData] = await Promise.all([
          api.vehicles.getAll(),
          api.trips.getAll(),
        ]);
        setVehicles(vehiclesData);
        setTrips(tripsData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tripData = useMemo(() => {
    const hours = [0, 4, 8, 12, 16, 20];
    return hours.map((hour) => {
      const hourStr = String(hour).padStart(2, '0') + ':00';
      const hourTrips = trips.filter((trip) => {
        if (!trip?.scheduledDate) return false;
        const date = new Date(trip.scheduledDate);
        return date.getHours() === hour;
      });
      return {
        time: hourStr,
        scheduled: hourTrips.length,
        live: hourTrips.filter((t) => t?.status === 'in_progress').length,
        completed: hourTrips.filter((t) => t?.status === 'completed').length,
        late: hourTrips.filter((t) => t?.status === 'cancelled').length,
      };
    });
  }, [trips]);

  const vehicleDistribution = useMemo(() => {
    if (!Array.isArray(vehicles)) return [];
    const statusCounts = {
      'active': 0,
      'inactive': 0,
      'maintenance': 0,
    };
    vehicles.forEach((v) => {
      if (v?.status && statusCounts.hasOwnProperty(v.status)) {
        statusCounts[v.status as keyof typeof statusCounts]++;
      }
    });
    return [
      { name: 'Active', value: statusCounts.active, color: '#10b981' },
      { name: 'Inactive', value: statusCounts.inactive, color: '#8b5cf6' },
      { name: 'Maintenance', value: statusCounts.maintenance, color: '#f59e0b' },
    ];
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    try {
      if (!Array.isArray(vehicles)) {
        return [];
      }
      return vehicles.filter((vehicle) => {
        try {
          if (!vehicle || typeof vehicle !== 'object') return false;
          const searchLower = String(searchQuery || "").toLowerCase();
          const plateNumber = String(vehicle?.plateNumber || "").toLowerCase();
          const vehicleId = String(vehicle?.id || "").toLowerCase();
          const matchesSearch =
            plateNumber.includes(searchLower) ||
            vehicleId.includes(searchLower);
          const matchesFilter = !filterStatus || vehicle?.status === filterStatus;
          return matchesSearch && matchesFilter;
        } catch (e) {
          console.error('Filter error for vehicle:', vehicle, e);
          return false;
        }
      });
    } catch (e) {
      console.error('Error in filteredVehicles:', e);
      return [];
    }
  }, [vehicles, searchQuery, filterStatus]);

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

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.titleIcon}>📊</div>
          <div>
            <h2 className={styles.title}>Real Time Data</h2>
          </div>
        </div>
        <div className={styles.timestamp}>
          {new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}{" "}
          {new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {/* Real-Time Metrics Cards */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>25</div>
          <div className={styles.metricLabel}>Vehicles with errors</div>
          <div className={styles.metricTrend}>+4%</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>14</div>
          <div className={styles.metricLabel}>Vehicles with warnings</div>
          <div className={styles.metricTrend}>-8%</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>4</div>
          <div className={styles.metricLabel}>Deviation from route</div>
          <div className={styles.metricTrend}>+12%</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>8</div>
          <div className={styles.metricLabel}>Being late</div>
          <div className={styles.metricTrend}>-14%</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsContainer}>
        {/* 24 Hour Trips Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>24 Hour Trips Data</h3>
          <div className={styles.chartLegend}>
            <span className={styles.legendItem}>
              <span className={styles.dot} style={{ background: "#9f7aea" }} />
              Scheduled 124
            </span>
            <span className={styles.legendItem}>
              <span className={styles.dot} style={{ background: "#f0a77d" }} />
              Live Trips 60
            </span>
            <span className={styles.legendItem}>
              <span className={styles.dot} style={{ background: "#4c9aff" }} />
              Completed 40
            </span>
            <span className={styles.legendItem}>
              <span className={styles.dot} style={{ background: "#ef4444" }} />
              Being late 8
            </span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={tripData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#242424",
                  border: "1px solid #404040",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Line
                type="monotone"
                dataKey="scheduled"
                stroke="#9f7aea"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="live"
                stroke="#f0a77d"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#4c9aff"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="late"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle Distribution Pie Chart */}
        <div className={styles.chartCard}>
          <div className={styles.pieChartHeader}>
            <h3 className={styles.chartTitle}>Total Vehicles</h3>
            <div className={styles.totalCount}>198</div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={vehicleDistribution}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {vehicleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#242424",
                  border: "1px solid #404040",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.pieChartLegend}>
            {vehicleDistribution.map((item) => (
              <div key={item.name} className={styles.legendItemPie}>
                <span
                  className={styles.legendColor}
                  style={{ backgroundColor: item.color }}
                />
                <span className={styles.legendLabel}>
                  {item.name} {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicle Status Table */}
      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Vehicles Statuses</h3>
          <div className={styles.tableControls}>
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Comment</th>
                <th>Live view</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.slice(0, 5).map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td className={styles.vehicleId}>{vehicle.plateNumber}</td>
                  <td>{vehicle.type}</td>
                  <td>
                    {new Date().toLocaleDateString()}{" "}
                    {new Date().toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${styles[vehicle.status]}`}
                    >
                      ● {vehicle.status}
                    </span>
                  </td>
                  <td>In transit</td>
                  <td>
                    <button className={styles.liveViewBtn}>📍 Live view</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
