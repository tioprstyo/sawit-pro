# Full-Stack Architecture Guide

Complete guide for the Fleet Manager full-stack application with SQLite3 database and Docker support.

## 📋 Overview

This project is now a complete full-stack application with:

```
┌─────────────────────────────────────────────┐
│         Frontend (React + TypeScript)       │
│              Port 3000                      │
│  - Dashboard & Fleet Management UI          │
│  - Real-time state management (Redux)       │
│  - API calls to backend                     │
└─────────────────┬───────────────────────────┘
                  │ HTTP/JSON
                  ▼
┌─────────────────────────────────────────────┐
│  Nginx Reverse Proxy (Port 80)              │
│  - Routes /api → Backend                    │
│  - Routes / → Frontend                      │
│  - SSL/TLS termination (optional)            │
└─────────────────┬───────────────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
┌──────────────┐    ┌──────────────────┐
│  Frontend    │    │  Backend API     │
│   (Port 3000)│    │  (Port 3001)     │
└──────────────┘    └────────┬─────────┘
                             │
                    ┌────────▼────────┐
                    │  SQLite3 DB     │
                    │  /data/volume   │
                    └─────────────────┘
```

## 🗂️ Project Structure

```
sawit-pro/
├── src/                          # Frontend (React)
│   ├── components/
│   ├── store/
│   ├── types/
│   ├── api/
│   ├── App.tsx
│   └── main.tsx
│
├── server/                       # Backend (Express + SQLite3)
│   ├── src/
│   │   ├── server.ts            # Express app
│   │   ├── database/
│   │   │   ├── db.ts            # Database connection
│   │   │   ├── init.ts          # Schema & seed
│   │   │   └── reset.ts         # Reset data
│   │   └── routes/
│   │       ├── vehicles.ts
│   │       ├── drivers.ts
│   │       ├── mills.ts
│   │       ├── trips.ts
│   │       └── dashboard.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile               # Backend container
│   └── .dockerignore
│
├── Dockerfile                   # Frontend container
├── docker-compose.yml          # Full-stack orchestration
├── nginx.conf                  # Reverse proxy config
├── .env.example               # Environment template
├── package.json               # Frontend deps
├── vite.config.ts
├── tsconfig.json
└── DEPLOYMENT.md
```

## 🚀 Quick Start

### Development Mode

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..

# Initialize database (one time)
cd server && npm run db:init && cd ..

# Start backend development server (from root)
cd server && npm run dev &

# Start frontend development server (from root, in new terminal)
npm run dev

# Access:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:3001
# - Health check: http://localhost:3001/health
```

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# The application will be available at http://localhost

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# View database (optional)
docker exec sawit-pro-server sqlite3 /app/data/sawit-pro.db "SELECT * FROM vehicles;"
```

## 🗄️ Database Schema

### SQLite3 Tables

#### drivers
- `id` (TEXT PRIMARY KEY)
- `name`, `licenseNumber`, `phoneNumber`
- `status` (available | on_duty | off_duty | on_leave)
- `createdAt`, `updatedAt`

#### vehicles
- `id` (TEXT PRIMARY KEY)
- `plateNumber` (UNIQUE)
- `type` (truck | tanker | flatbed)
- `capacity` (INTEGER)
- `driverId` (FOREIGN KEY)
- `status` (active | inactive | maintenance | in_use)
- `createdAt`, `updatedAt`

#### mills
- `id` (TEXT PRIMARY KEY)
- `name`, `latitude`, `longitude`, `address`
- `contactPerson`, `phoneNumber`
- `avgDailyProduction` (INTEGER)
- `createdAt`, `updatedAt`

#### trips
- `id` (TEXT PRIMARY KEY)
- `vehicleId`, `driverId` (FOREIGN KEYS)
- `scheduledDate`, `status`
- `estimatedDuration`, `actualDuration`
- `startTime`, `endTime`
- `createdAt`, `updatedAt`

#### trip_mills (Junction Table)
- `tripId`, `millId` (COMPOSITE PRIMARY KEY)
- `collectionOrder`
- `quantity`, `collectedAt`

#### collections
- `id` (TEXT PRIMARY KEY)
- `tripId`, `millId` (FOREIGN KEYS)
- `quantity`, `timestamp`

### Indexes
Performance indexes created on:
- `vehicles.driverId`
- `trips.vehicleId`, `trips.driverId`
- `trips.status`, `trips.scheduledDate`
- `trip_mills.tripId`, `trip_mills.millId`
- `collections.tripId`, `collections.millId`

## 🔌 API Endpoints

### Base URL: `/api`

#### Vehicles
- `GET /api/vehicles` - List all vehicles
- `GET /api/vehicles/:id` - Get vehicle details
- `POST /api/vehicles` - Create vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

#### Drivers
- `GET /api/drivers` - List all drivers
- `GET /api/drivers/:id` - Get driver details
- `POST /api/drivers` - Create driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

#### Mills
- `GET /api/mills` - List all mills
- `GET /api/mills/:id` - Get mill details
- `POST /api/mills` - Create mill
- `PUT /api/mills/:id` - Update mill
- `DELETE /api/mills/:id` - Delete mill

#### Trips
- `GET /api/trips` - List all trips (with related mills)
- `GET /api/trips/:id` - Get trip details
- `POST /api/trips` - Create trip
- `PUT /api/trips/:id` - Update trip status
- `DELETE /api/trips/:id` - Delete trip

#### Dashboard
- `GET /api/dashboard/summary` - Get fleet metrics

#### Health
- `GET /health` - Health check endpoint

## 🌍 Environment Variables

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3001/api  # Backend API URL
VITE_ENV=development                     # development | production
```

### Backend (server/.env)
```bash
NODE_ENV=production                      # development | production
PORT=3001                                # API server port
DB_PATH=./data/sawit-pro.db             # SQLite database location
LOG_LEVEL=info                           # debug | info | warn | error
```

### Docker (.env for docker-compose)
```bash
VITE_API_URL=http://api:3001/api        # Internal API URL
DOCKER_IMAGE_NAME=sawit-pro
DOCKER_IMAGE_TAG=latest
```

## 📊 Database Management

### Initialize Database
```bash
cd server
npm run db:init

# Or with custom path
DB_PATH=/path/to/db.db npm run db:init
```

### Reset Database
```bash
cd server
npm run db:reset

# Re-initialize after reset
npm run db:init
```

### Direct Database Access
```bash
# From host (if sqlite3 installed)
sqlite3 data/sawit-pro.db

# From Docker container
docker exec -it sawit-pro-api sqlite3 /app/data/sawit-pro.db
```

### Common Queries
```sql
-- List all vehicles with drivers
SELECT v.plateNumber, d.name as driverName, v.status
FROM vehicles v
LEFT JOIN drivers d ON v.driverId = d.id;

-- Get trip details
SELECT t.id, v.plateNumber, d.name, t.status, t.scheduledDate
FROM trips t
LEFT JOIN vehicles v ON t.vehicleId = v.id
LEFT JOIN drivers d ON t.driverId = d.id;

-- Get pending collections
SELECT t.id, m.name, COUNT(*) as pendingCount
FROM trip_mills tm
JOIN trips t ON tm.tripId = t.id
JOIN mills m ON tm.millId = m.id
WHERE t.status != 'completed'
GROUP BY t.id, m.name;
```

## 🐳 Docker Services

### Frontend Service (`web`)
- **Image**: Node.js + Vite
- **Port**: 3000
- **Volume**: None (read-only)
- **Health Check**: HTTP 200 on port 3000

### Backend Service (`api`)
- **Image**: Node.js + Express + SQLite3
- **Port**: 3001
- **Volume**: `db-data:/app/data` (persistent SQLite)
- **Health Check**: HTTP 200 on `/health`

### Reverse Proxy (`nginx`)
- **Image**: nginx:alpine
- **Port**: 80 (and 443 with SSL)
- **Routes**:
  - `/api/*` → Backend API
  - `/health` → Backend health
  - `/*` → Frontend (SPA)

### Data Volume
- **Name**: `db-data`
- **Mount**: `/app/data` in container
- **Purpose**: Persistent SQLite database storage
- **Backup**: Volume is persistent across container restarts

## 🔄 Data Flow

### Frontend to Backend
```
User Action (React Component)
  ↓
Redux Action / Local State
  ↓
API Call (fetch/axios)
  ↓
Backend Express Route
  ↓
Database Operation (SQLite)
  ↓
JSON Response
  ↓
Update Redux Store
  ↓
Component Re-render
```

### API Response Format
```json
{
  "id": "uuid",
  "name": "string",
  "status": "string",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

### Error Response Format
```json
{
  "error": "Error message description"
}
```

## 🧪 Testing

### Backend Unit Tests
```bash
cd server
npm test  # (When test setup is added)
```

### Frontend Tests
```bash
npm test
npm run test:coverage
```

### API Integration Testing
```bash
# Using curl
curl http://localhost:3001/api/vehicles

# Using the health check
curl http://localhost:3001/health
```

## 📈 Monitoring

### Docker Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs api
docker-compose logs web
docker-compose logs nginx

# Follow logs
docker-compose logs -f api
```

### Database Status
```bash
# Container exec to check DB
docker exec sawit-pro-api ls -lh /app/data/

# Query count
docker exec sawit-pro-api sqlite3 /app/data/sawit-pro.db \
  "SELECT name, COUNT(*) as count FROM (
    SELECT name FROM (
      SELECT 'drivers' as name FROM drivers
      UNION ALL SELECT 'vehicles' UNION ALL SELECT 'mills'
      UNION ALL SELECT 'trips' UNION ALL SELECT 'collections'
    )
  ) GROUP BY name;"
```

### API Health Monitoring
```bash
# Check API is responding
curl -f http://localhost:3001/health || echo "API DOWN"

# Get dashboard metrics
curl http://localhost:3001/api/dashboard/summary
```

## 🔐 Security Considerations

### Database
- ✅ Foreign key constraints enabled
- ✅ Input validation on all API endpoints
- ✅ SQL parameterized queries (SQLite bindings)
- ⚠️ Add authentication middleware for production
- ⚠️ Add CORS configuration for production

### API
- ✅ CORS enabled
- ✅ Input validation
- ✅ Error handling
- ⚠️ Add JWT authentication
- ⚠️ Add rate limiting
- ⚠️ Add request logging

### Docker
- ✅ Multi-stage builds (optimized size)
- ✅ Non-root user (future)
- ✅ Health checks
- ⚠️ Add secrets management
- ⚠️ Add network isolation

## 📦 Deployment

### Using Docker Compose (Recommended)
```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.yml up -d

# With custom .env file
docker-compose --env-file .env.production up -d
```

### Using Deployment Script
```bash
./scripts/deploy.sh full --image sawit-pro --tag v1.0.0
./scripts/deploy.sh compose
```

### Cloud Platforms
See [DEPLOYMENT.md](DEPLOYMENT.md) for AWS, GCP, and Azure instructions.

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database
cd server && npm run db:reset && npm run db:init

# Check database integrity
docker exec sawit-pro-api sqlite3 /app/data/sawit-pro.db "PRAGMA integrity_check;"
```

### API Connection Issues
```bash
# Check API is running
docker ps | grep api

# Check logs
docker-compose logs api

# Test endpoint
curl -v http://localhost:3001/health
```

### Frontend Connection Issues
```bash
# Check VITE_API_URL environment variable
env | grep VITE_API_URL

# Check network requests in browser DevTools
# Look for failed requests to /api/*
```

### Docker Issues
```bash
# Restart services
docker-compose restart

# Rebuild services
docker-compose up -d --build

# Complete reset
docker-compose down -v  # Warning: deletes data volume
docker-compose up -d
```

## 📝 Next Steps

1. **Authentication**: Add JWT-based authentication
2. **Authorization**: Implement role-based access control
3. **Logging**: Set up structured logging
4. **Caching**: Add Redis for session/data caching
5. **API Documentation**: Generate Swagger/OpenAPI docs
6. **Performance**: Add database query optimization
7. **Backup**: Implement automated database backups
8. **Monitoring**: Set up application monitoring/APM

---

**Last Updated**: July 2026
**Version**: 2.0.0-fullstack
