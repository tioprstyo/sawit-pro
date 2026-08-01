FROM node:20-alpine

WORKDIR /app

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

# Copy server package files
COPY server/package*.json ./

# Install dependencies (including dev for tsx)
RUN npm install

# Copy source code
COPY server/src ./src

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3001/health || exit 1

# Run server with tsx
CMD ["npx", "tsx", "src/server.ts"]
