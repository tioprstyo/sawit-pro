# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Build args
ARG VITE_API_URL=http://api:3001/api

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application with API URL
RUN VITE_API_URL=$VITE_API_URL npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install simple HTTP server for serving static files
RUN npm install -g serve

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

# Start application
CMD ["serve", "-s", "dist", "-l", "3000"]
