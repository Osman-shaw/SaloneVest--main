# Build from the backend/ directory (build context = this folder).
# Requires package-lock.json in the repo for reproducible `npm ci` installs.
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json .npmrc ./

# Install ALL dependencies (including devDeps for the build)
RUN npm ci

# Copy source code and config
COPY . .

# Build TypeScript
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache curl

COPY package.json package-lock.json .npmrc ./

RUN npm ci --omit=dev

# Copy built application from builder stage
# Note: Ensure your 'npm run build' outputs to the 'dist' folder
COPY --from=builder /app/dist ./dist

# Match process.env.PORT (Railway/Render/etc.); default 5000 for local runs.
HEALTHCHECK --interval=30s --timeout=10s --start-period=45s --retries=3 \
  CMD sh -c 'curl -fsS "http://127.0.0.1:$${PORT:-5000}/health" >/dev/null || exit 1'

EXPOSE 5000

# Start application
CMD ["node", "dist/server.js"]