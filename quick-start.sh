#!/bin/bash

# 🚀 Quick Start Script - Run Frontend + Backend + Database

set -e

echo "=================================================="
echo "  🚛 Sawit Pro - Fleet Manager Quick Start"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}✓ Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js v18 or higher"
    exit 1
fi
NODE_VERSION=$(node -v)
echo "  Found: $NODE_VERSION"
echo ""

# Step 1: Install dependencies
echo -e "${BLUE}Step 1: Installing dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "  ✓ Dependencies already installed"
fi

if [ ! -d "server/node_modules" ]; then
    cd server && npm install && cd ..
else
    echo "  ✓ Server dependencies already installed"
fi
echo ""

# Step 2: Initialize database
echo -e "${BLUE}Step 2: Initializing database with mock data...${NC}"
npm run db:reset
echo -e "${GREEN}✓ Database ready with 200 drivers + 100+ vehicles${NC}"
echo ""

# Step 3: Show next steps
echo -e "${BLUE}Step 3: Starting services...${NC}"
echo ""
echo -e "${YELLOW}🎯 Open 3 terminals and run these commands:${NC}"
echo ""
echo -e "${GREEN}Terminal 1 (Backend - Port 3001):${NC}"
echo "  cd server && npm run dev"
echo ""
echo -e "${GREEN}Terminal 2 (Frontend - Port 5173):${NC}"
echo "  npm run dev"
echo ""
echo -e "${GREEN}Terminal 3 (Optional - Monitor Database):${NC}"
echo "  watch -n 2 'sqlite3 server/data/sawit-pro.db \"SELECT COUNT(*) FROM drivers; SELECT COUNT(*) FROM vehicles;\"'"
echo ""
echo -e "${BLUE}=================================================="
echo -e "📱 Frontend: http://localhost:5173${NC}"
echo -e "${BLUE}🔌 Backend:  http://localhost:3001${NC}"
echo -e "${BLUE}💾 Database: server/data/sawit-pro.db${NC}"
echo -e "${BLUE}==================================================${NC}"
echo ""
echo -e "${YELLOW}Or use Docker Compose for all services:${NC}"
echo "  docker-compose up -d"
echo ""
echo -e "${GREEN}✅ Setup complete! Run the commands above to start.${NC}"
