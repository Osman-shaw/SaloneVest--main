# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install ALL dependencies (including devDeps for the build)
RUN npm ci

# Copy source code and config
COPY . .

# Build TypeScript
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Use apk (Alpine's manager) for curl
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built application from builder stage
# Note: Ensure your 'npm run build' outputs to the 'dist' folder
COPY --from=builder /app/dist ./dist

# Create health check endpoint (Ensure your app listens on 5000)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Railway dynamically assigns a port, but EXPOSE helps for documentation
EXPOSE 5000

# Start application
CMD ["node", "dist/server.js"]