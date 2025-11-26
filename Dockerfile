# Stage 1: Build
FROM node:25.2-slim AS builder

WORKDIR /app

# Install build dependencies for native modules (better-sqlite3)
RUN apt-get update && apt-get install -y python3 make g++

# Copy package files
COPY package.json ./

# Install dependencies
# We use npm here. If you prefer bun, we would need to install it.
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:25.2-slim

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Copy built application from builder stage
COPY --from=builder /app/.output ./.output

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", ".output/server/index.mjs"]
