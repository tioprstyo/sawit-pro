# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build tools for better-sqlite3
RUN apk add --no-cache python3 make g++

# Copy server package files
COPY server/package*.json ./server/
COPY server/tsconfig.json ./server/

# Install dependencies
WORKDIR /app/server
RUN npm ci

# Copy source code
COPY server/src ./src

# Build TypeScript
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init and build tools for better-sqlite3
RUN apk add --no-cache dumb-init python3 make g++

# Create data directory for SQLite
RUN mkdir -p /app/data

# Copy package files
COPY server/package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built application from builder
COPY --from=builder /app/server/dist ./dist

# Set environment
ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/app/data/sawit-pro.db

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3001/health || exit 1

# Run with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
