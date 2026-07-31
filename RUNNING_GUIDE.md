# 🚀 How to Run Frontend + Backend with Database

This guide shows how to run your complete application stack (Frontend + Backend + SQLite Database).

## Option 1: Local Development (Recommended for Development)

### Step 1: Initialize Database with Mock Data

```bash
# Go to project root
cd /path/to/sawit-pro

# Initialize database and seed with 200 drivers + 100+ vehicles
npm run db:init
npm run db:seed

# Or use the combined command:
npm run db:reset
```

**What this does:**
- Creates SQLite database at `server/data/sawit-pro.db`
- Creates all tables (drivers, vehicles, mills, trips)
- Seeds 200 drivers and 100+ vehicles from mock data
- ✅ All data stored in SQLite (not JSON)

### Step 2: Start Backend Server (Terminal 1)

```bash
cd server
npm install  # First time only
npm run dev
```

**Expected Output:**
```
🚀 Server running on http://localhost:3001
📝 API available at http://localhost:3001/api
```

✅ Backend is ready at `http://localhost:3001`

### Step 3: Start Frontend Development Server (Terminal 2)

```bash
# From project root (not server directory)
npm install  # First time only
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in XXX ms

Local:    http://localhost:5173/
Press q + enter to quit
```

✅ Frontend is ready at `http://localhost:5173`

### Step 4: Access the Application

**Open in Browser:**
```
http://localhost:5173
```

You should see:
- ✅ Dashboard with fleet data
- ✅ 200 drivers loaded
- ✅ 100+ vehicles loaded
- ✅ All data from SQLite database

---

## Option 2: Docker Compose (Recommended for Production)

### Step 1: Initialize Database

```bash
# Initialize database with mock data
npm run db:init
npm run db:seed
```

### Step 2: Start All Services with Docker Compose

```bash
# From project root
docker-compose up -d
```

**Services Start:**
- Backend API: `http://localhost:3001`
- Frontend Web: `http://localhost:3000`
- Nginx Proxy: `http://localhost` (port 80)

**View Status:**
```bash
docker-compose ps
```

**Expected Output:**
```
NAME       IMAGE           STATUS      PORTS
sawit-api  sawit-pro_api   Up 30s      0.0.0.0:3001->3001/tcp
sawit-web  sawit-pro_web   Up 25s      0.0.0.0:3000->3000/tcp
nginx      nginx:alpine    Up 20s      0.0.0.0:80->80/tcp
```

**Access Application:**
```
http://localhost:3000
```

**View Logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
```

**Stop Services:**
```bash
docker-compose down
```

---

## Option 3: Manual Full Setup (Advanced)

### Terminal 1: Initialize Database

```bash
npm run db:init
npm run db:seed
```

### Terminal 2: Backend Server

```bash
cd server
npm install
npm run build
npm start
```

### Terminal 3: Frontend Build & Serve

```bash
npm run build
npm run preview
```

---

## 📊 Verify Data is Loaded

### Check Backend API

```bash
# Check if backend is running
curl http://localhost:3001/health

# Expected response:
# {"status":"ok","message":"Server is running"}
```

### Check Database

```bash
# Show driver count (should be 200)
sqlite3 server/data/sawit-pro.db "SELECT COUNT(*) FROM drivers;"

# Show vehicle count (should be 100+)
sqlite3 server/data/sawit-pro.db "SELECT COUNT(*) FROM vehicles;"
```

### Check Frontend API Calls

Open browser DevTools (F12) → Network tab → Refresh page

You should see API calls like:
- ✅ `GET /api/drivers` → 200 drivers
- ✅ `GET /api/vehicles` → 100+ vehicles
- ✅ `GET /api/mills` → mill data
- ✅ `GET /api/dashboard` → dashboard metrics

---

## 🔄 Development Workflow

### Hot Reload During Development

**Frontend (Auto-refresh):**
- Change any `.tsx` or `.css` file
- Browser automatically refreshes
- No restart needed

**Backend (Auto-restart):**
- Change any file in `server/src/`
- Server automatically restarts (with `npm run dev`)
- Test endpoint: `http://localhost:3001/api/drivers`

### Testing API Endpoints

```bash
# Get all drivers
curl http://localhost:3001/api/drivers

# Get specific driver
curl http://localhost:3001/api/drivers/driver-1

# Get all vehicles
curl http://localhost:3001/api/vehicles

# Get dashboard data
curl http://localhost:3001/api/dashboard
```

---

## ⚡ Quick Commands Reference

```bash
# Database
npm run db:init         # Initialize database schema
npm run db:seed         # Seed mock data
npm run db:reset        # Reset + init + seed (full refresh)

# Frontend (Development)
npm run dev             # Start dev server (port 5173)
npm run build           # Build for production
npm run preview         # Preview production build (port 3000)

# Backend (Development)
cd server && npm run dev        # Start backend (port 3001)
cd server && npm run build      # Build backend

# Docker
docker-compose up -d    # Start all services
docker-compose down     # Stop all services
docker-compose logs -f  # View logs
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>

# Or use different port
cd server && npm run dev -- --port 3002
```

### Backend Not Responding

```bash
# Check if backend is running
curl http://localhost:3001/health

# View backend logs
cd server && npm run dev
```

### Frontend Can't Connect to Backend

**Check VITE environment variable:**
```bash
# In development, should be:
VITE_API_URL=http://localhost:3001

# Create .env.local in project root:
echo "VITE_API_URL=http://localhost:3001" > .env.local
```

### Database Connection Error

```bash
# Check if database file exists
ls -lh server/data/sawit-pro.db

# Check file permissions
chmod 644 server/data/sawit-pro.db

# Reinitialize if corrupted
npm run db:reset
```

### Data Not Showing in Frontend

1. ✅ Confirm backend is running: `curl http://localhost:3001/health`
2. ✅ Confirm database has data: `sqlite3 server/data/sawit-pro.db "SELECT COUNT(*) FROM drivers;"`
3. ✅ Check browser console (F12) for API errors
4. ✅ Check `VITE_API_URL` environment variable

---

## 📈 Performance Tips

- **Use Docker Compose** for consistent development environment
- **Hot reload** makes frontend development faster than rebuilding
- **Backend auto-restart** with `npm run dev` in server directory
- **Use `npm run preview`** to test production build locally

---

## ✅ Verification Checklist

- [ ] Database initialized: `server/data/sawit-pro.db` exists
- [ ] Backend running: `curl http://localhost:3001/health` returns OK
- [ ] Frontend running: Open `http://localhost:5173` or `http://localhost:3000`
- [ ] Data loads: Dashboard shows 200 drivers + vehicles
- [ ] API working: Network tab shows successful API calls
- [ ] Database data: `SELECT COUNT(*) FROM drivers;` returns 200

---

**You're all set! 🎉**
