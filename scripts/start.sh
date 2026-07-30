#!/bin/bash

################################################################################
# Quick Start Script for Development
################################################################################

set -e

echo "🚀 Starting Fleet Manager..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🏗️  Building application..."
npm run build

echo ""
echo "✅ Build complete!"
echo ""
echo "Choose an option:"
echo "  1) Start development server (npm run dev)"
echo "  2) Preview production build (npm run preview)"
echo "  3) Start with Docker (docker-compose up)"
echo "  4) Exit"
echo ""
read -p "Enter option (1-4): " option

case $option in
    1)
        echo ""
        echo "Starting development server on http://localhost:3000"
        echo ""
        npm run dev
        ;;
    2)
        echo ""
        echo "Starting preview server on http://localhost:3000"
        echo ""
        npm run preview
        ;;
    3)
        echo ""
        echo "Starting Docker services..."
        echo ""
        docker-compose up
        ;;
    4)
        echo "Goodbye!"
        exit 0
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac
