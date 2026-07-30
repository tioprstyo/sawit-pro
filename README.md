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

### Prerequisites
- Node.js (v18 or higher)
- npm (v10 or higher)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sawit-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Build & Deployment

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Docker Deployment

```bash
# Build Docker image
docker build -t sawit-pro .

# Run container
docker run -p 3000:3000 sawit-pro
```

### Docker Compose

```bash
# Start with docker-compose
docker-compose up

# The app will be available at http://localhost:3000
```

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
src/
├── components/
│   ├── atoms/              # Basic UI components (Button, Badge, Card, etc.)
│   ├── molecules/          # Composite components (Table, Modal, Form)
│   └── organisms/          # Complex components (Dashboard, Lists, Forms)
├── hooks/                  # Custom React hooks
├── store/                  # Redux store and slices
├── services/               # Business logic and data services
├── api/                    # API layer and data fetching
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
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
- **Database Service**: In-memory data storage with seed data
- **API Layer**: Abstraction layer for data fetching with error handling
- **Custom Hooks**: `useFetchVehicles`, `useFetchDrivers`, `useFetchMills`, `useFetchTrips`

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

- **Frontend**: React 18+
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: CSS Modules
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library
- **Deployment**: Docker

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

### Application Won't Start
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`
- Check Node version: `node --version`

### Build Errors
- Ensure TypeScript is correct: `npm run build`
- Check for type errors: `npx tsc --noEmit`

### Port Already in Use
- Change port in vite.config.ts or run on different port: `npm run dev -- --port 5174`

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
