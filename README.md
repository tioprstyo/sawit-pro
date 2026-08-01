# 🚛 Fleet Manager - FFB Evacuation Logistics System

A production-ready fleet management system for Fresh Fruit Bunch (FFB) evacuation operations, built with React 18, TypeScript, and Redux Toolkit.

## 📋 Overview

This system manages the operations of a dedicated fleet serving multiple palm oil mills. It handles vehicle management, driver assignments, trip scheduling, and capacity planning for efficient FFB collection and delivery.

## ✨ Features

- **Fleet Management Dashboard**: Real-time overview of fleet status, vehicle availability, and operational metrics
- **Vehicle Management**: Create, update, and manage vehicles with capacity tracking
- **Driver Management**: Manage driver assignments, availability status, and license information
- **Mill Management**: Track palm oil mills, location data, and daily production capacity
- **Trip Scheduling**: Plan daily evacuation routes and assign vehicles to collection points
- **Responsive Design**: Mobile-first UI optimized for desktop, tablet, and mobile devices
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Centralized State**: Redux Toolkit for predictable state management
- **Performance**: Optimized for handling 10,000+ records without degradation

## 🚀 Quick Start

### Option 1: Docker (Recommended)

#### Prerequisites
- Docker (v20.10 or higher)
- Docker Compose (v2.0 or higher)

#### Setup

```bash
# Clone the repository
git clone <repository-url>
cd sawit-pro

# Start the full stack (frontend + backend + SQLite)
docker-compose up --build
```

Access the application:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001/api
- **Dashboard**: http://localhost:3000/dashboard

### Option 2: Local Development

#### Prerequisites
- Node.js (v18 or higher)
- npm (v10 or higher)

#### Setup

```bash
# Clone the repository
git clone <repository-url>
cd sawit-pro

# Install frontend dependencies
npm install

# Start frontend development server (in one terminal)
npm run dev

# In another terminal, start the backend server
cd server
npm install
npm run dev
```

Access the application:
- **Frontend**: http://localhost:5173 (Vite default) or http://localhost:3000
- **API**: http://localhost:3001/api

## 📦 Build & Deployment

### Docker Setup (Recommended)

The project includes a complete Docker setup with **frontend** (React/Vite) and **backend** (Express.js + SQLite) services orchestrated with Docker Compose.

#### Prerequisites
- Docker (v20.10 or higher)
- Docker Compose (v2.0 or higher)

#### Quick Start with Docker Compose

```bash
# Start both frontend and backend services
docker-compose up --build

# The application will be available at:
# - Frontend: http://localhost:3000
# - API: http://localhost:3001/api
```

#### Docker Compose Commands

```bash
# Start services in the background
docker-compose up -d

# View service status
docker-compose ps

# View logs for all services
docker-compose logs -f

# View logs for specific service (api or web)
docker-compose logs -f api
docker-compose logs -f web

# Stop all services
docker-compose stop

# Stop and remove all services and volumes
docker-compose down

# Stop and remove everything including data volume
docker-compose down -v
```

#### Database Persistence

The SQLite database is persisted in the `./data/` directory on the host machine. This allows data to survive container restarts:

```bash
# Data is stored here
./data/sawit-pro.db

# To reset the database, remove the file
rm ./data/sawit-pro.db

# Then restart the container to reinitialize with seed data
docker-compose down -v && docker-compose up --build
```

#### Environment Variables

The Docker setup automatically configures the API URL for the frontend. To customize:

Edit `docker-compose.yml` and modify the `VITE_API_URL` build argument:

```yaml
web:
  build:
    args:
      VITE_API_URL: http://localhost:3001/api  # Change this URL
```

### Manual Local Build & Deployment

#### Production Build (Local)

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build locally (runs on http://localhost:3000)
npm run preview
```

#### Build Backend Server

```bash
# Install server dependencies
cd server
npm install

# Run backend in development
npm run dev

# The API will be available at http://localhost:3001/api
```

#### Docker Individual Services

Build and run services individually if needed:

```bash
# Build frontend Docker image
docker build -t sawit-pro-web .

# Run frontend container
docker run -d -p 3000:3000 --name sawit-pro-web sawit-pro-web

# Build backend Docker image
docker build -t sawit-pro-api -f server/Dockerfile .

# Run backend container with data volume
docker run -d -p 3001:3001 -v sawit-data:/app/data --name sawit-pro-api sawit-pro-api

# View logs
docker logs -f sawit-pro-web
docker logs -f sawit-pro-api
```

### Deployment Documentation

For complete deployment guide including cloud platforms (AWS, GCP, Azure), see [DEPLOYMENT.md](DEPLOYMENT.md)

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 📁 Project Structure

```
sawit-pro/
├── src/                    # Frontend React application
│   ├── components/
│   │   ├── atoms/          # Basic UI components (Button, Badge, Card, etc.)
│   │   ├── molecules/      # Composite components (Table, Modal, Form)
│   │   └── organisms/      # Complex components (Dashboard, Lists, Forms)
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Redux store and slices
│   ├── services/           # Business logic and data services
│   ├── api/                # API layer and data fetching
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── server/                 # Backend Express.js API
│   ├── src/
│   │   ├── database/       # Database configuration and initialization
│   │   │   ├── sqlite-db.ts    # SQLite database interface
│   │   │   ├── seed.ts         # Mock data and seeding
│   │   │   └── init.ts         # Database schema initialization
│   │   ├── routes/         # API endpoints
│   │   │   ├── drivers.ts
│   │   │   ├── vehicles.ts
│   │   │   ├── mills.ts
│   │   │   ├── trips.ts
│   │   │   └── dashboard.ts
│   │   ├── utils/          # Utility functions
│   │   └── server.ts       # Express app entry point
│   ├── package.json        # Server dependencies
│   └── Dockerfile          # Backend container configuration
├── data/                   # SQLite database (created at runtime)
│   └── sawit-pro.db        # SQLite database file
├── Dockerfile              # Frontend container configuration
├── docker-compose.yml      # Docker Compose orchestration
└── package.json            # Frontend dependencies
```

## 🏗️ Architecture

### Component Structure
The project follows **Atomic Design Principles**:
- **Atoms**: Basic UI components (buttons, inputs, badges)
- **Molecules**: Combinations of atoms (forms, tables, modals)
- **Organisms**: Complex components combining molecules (pages, sections)

### State Management
Redux Toolkit is used for centralized state management with the following slices:
- `vehicleSlice`: Manages fleet vehicles
- `driverSlice`: Manages driver information
- `millSlice`: Manages mill locations and data
- `tripSlice`: Manages trip schedules and status

### Data Layer
- **Database**: SQLite for persistent data storage with automatic seeding
- **API Server**: Express.js REST API with CORS support
- **API Layer**: Abstraction layer for data fetching with error handling
- **Custom Hooks**: `useFetchVehicles`, `useFetchDrivers`, `useFetchMills`, `useFetchTrips`

## 💾 Database & Data Seeding

### Database Setup

The application uses **SQLite 3** for persistent data storage. When the backend server starts, it automatically:

1. Creates the SQLite database schema (if it doesn't exist)
2. Seeds the database with mock data (200 drivers, 200 vehicles, 100+ mills, 200 trips)
3. Ensures data persists between container restarts

### Database Location

- **Docker**: `/app/data/sawit-pro.db` (persisted to `./data/sawit-pro.db` on host)
- **Local**: `./data/sawit-pro.db`

### Seed Data

The seed data includes:
- **200 Drivers** with various statuses (available, on_trip, sick, on_leave)
- **200 Vehicles** (trucks, tankers, trailers) assigned to drivers
- **100+ Mills** with geographic locations and production data
- **200 Trips** with trip-mill relationships and schedules

Seed data is defined in `server/src/database/seed.ts` and automatically loaded on application startup.

### Resetting the Database

To reset the database and reload seed data:

```bash
# Option 1: Using Docker
docker-compose down -v
docker-compose up --build

# Option 2: Local setup
rm ./data/sawit-pro.db
npm run db:init  # In server directory
```

## 📊 Data Models

### Vehicle
```typescript
interface Vehicle {
  id: string;
  plateNumber: string;
  type: 'truck' | 'tanker' | 'flatbed';
  capacity: number;      // in tons
  driverId: string;
  status: 'active' | 'inactive' | 'maintenance' | 'in_use';
  createdAt: Date;
  updatedAt: Date;
}
```

### Driver
```typescript
interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phoneNumber: string;
  status: 'available' | 'on_duty' | 'off_duty' | 'on_leave';
  createdAt: Date;
  updatedAt: Date;
}
```

### Mill
```typescript
interface Mill {
  id: string;
  name: string;
  location: GeoLocation;  // latitude, longitude, address
  contactPerson: string;
  phoneNumber: string;
  avgDailyProduction: number;  // in tons
  createdAt: Date;
  updatedAt: Date;
}
```

### Trip
```typescript
interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  millIds: string[];
  scheduledDate: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  collections: Collection[];
  estimatedDuration: number;  // in minutes
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎨 Styling

The project uses CSS Modules for component scoping and a utility-first approach. Each component has its own stylesheet that's imported and namespaced.

### Color Palette
- **Primary**: #007bff (Blue)
- **Success**: #28a745 (Green)
- **Danger**: #dc3545 (Red)
- **Warning**: #ffc107 (Amber)
- **Info**: #17a2b8 (Cyan)

## 🔧 Technology Stack

### Frontend
- **Framework**: React 18+
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: CSS Modules
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite 3 (better-sqlite3)
- **Language**: TypeScript
- **API**: RESTful API with CORS

### Deployment
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Architecture**: Full-stack containerized setup

## 📖 Usage Examples

### Navigating the Application
1. **Dashboard**: View real-time fleet metrics and operational summary
2. **Vehicles**: Manage fleet vehicles, add/edit/delete operations
3. **Drivers**: View and manage driver information
4. **Mills**: Access mill data and production information
5. **Trips**: Schedule and track daily evacuation trips

### Creating a Vehicle
1. Navigate to Vehicles section
2. Click "Add Vehicle" button
3. Fill in vehicle details (plate number, type, capacity)
4. Select assigned driver
5. Click "Create"

### Scheduling a Trip
1. Navigate to Trips section
2. Create new trip with vehicle, driver, and mill assignments
3. Set scheduled date and estimated duration
4. Confirm to add trip to schedule

## ⚙️ Configuration

### Development Environment Variables
Create a `.env.local` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
VITE_ENV=development
```

### Production Environment Variables
```env
VITE_API_URL=https://api.example.com
VITE_ENV=production
```

## 🐛 Troubleshooting

### Docker Issues

#### Containers Won't Start

```bash
# Check Docker is running
docker --version
docker-compose --version

# View service logs
docker-compose logs -f

# Stop and clean up everything
docker-compose down -v

# Rebuild from scratch
docker-compose up --build
```

#### Port Already in Use

If port 3000 or 3001 is already in use, find and stop the process:

```bash
# macOS/Linux - Find process on port 3000
lsof -i :3000

# macOS/Linux - Find process on port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use Docker to check
docker ps
docker stop <CONTAINER_ID>
```

#### Database Permission Issues

```bash
# Ensure data directory exists with proper permissions
mkdir -p ./data
chmod 755 ./data

# Restart containers
docker-compose restart api
```

### Local Development Issues

#### Application Won't Start
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`
- Check Node version: `node --version`

#### Backend Won't Connect

Ensure `VITE_API_URL` environment variable is set correctly:

```bash
# In .env.local (root directory)
VITE_API_URL=http://localhost:3001/api
```

#### Build Errors
- Ensure TypeScript is correct: `npm run build`
- Check for type errors: `npx tsc --noEmit`

#### Port Already in Use

```bash
# Use a different port for development
npm run dev -- --port 3001

# Use a different port for preview
npm run preview -- --port 3001

# Backend on different port
cd server && PORT=3002 npm run dev
```

### Database Issues

#### Database Corruption

If you experience database errors:

```bash
# Delete corrupted database
rm -f ./data/sawit-pro.db*

# Restart to reinitialize
docker-compose restart api
```

#### No Data After Startup

Check the backend logs for seeding errors:

```bash
docker-compose logs -f api
```

Should see messages like:
```
🗄️  Initializing SQLite database...
✓ Database seeded with 200 drivers...
```

## 📝 Performance Optimization

- **Code Splitting**: Routes are code-split for faster initial load
- **Memoization**: Components use React.memo for prevent unnecessary re-renders
- **Virtual Scrolling**: Large lists use virtualization for performance
- **Lazy Loading**: Components load on demand to reduce initial bundle size
- **CSS Optimization**: CSS Modules eliminate unused styles

### Performance Targets
- ✓ Initial page load: < 2 seconds
- ✓ Handle 10,000+ records without degradation
- ✓ 80%+ Lighthouse performance score

## 🔐 Security

- **Input Validation**: All user inputs are validated on the client side
- **Type Safety**: TypeScript prevents type-related security issues
- **XSS Prevention**: React automatically escapes content
- **CORS**: Configured for cross-origin requests
- **Environment Variables**: Sensitive data stored in environment files

## 📄 License

This project is provided as-is for evaluation purposes.

## 👥 Contributors

- Lead Frontend Engineer

## 🤝 Support

For questions or issues, please contact the development team or refer to the ARCHITECTURE.md and TESTING.md documentation.

---

**Last Updated**: July 2026
