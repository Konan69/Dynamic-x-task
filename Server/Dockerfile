# Build stage
FROM node:20-slim AS builder

WORKDIR /build

# Copy only package files first to leverage cache
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Final stage
FROM node:20-slim

# Install only the minimal required packages
RUN apt-get update && apt-get install -y \
    python3-minimal \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package*.json ./
COPY --from=builder /build/src ./src
COPY --from=builder /build/tsconfig.json ./

EXPOSE 8000

CMD ["npm", "run", "dev"]