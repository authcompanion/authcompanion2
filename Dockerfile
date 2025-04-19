# Stage 1: Builder stage (full build environment)
FROM node:22-slim AS builder

LABEL org.opencontainers.image.title="AuthCompanion"
LABEL org.opencontainers.image.version="5.0.0-beta.1"
LABEL org.opencontainers.image.description="An admin-friendly, User Management Server (with Passkeys & JWTs)"
LABEL org.opencontainers.image.authors="Paul Fischer"
LABEL org.opencontainers.image.source=https://github.com/authcompanion/authcompanion2

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./
# Install all dependencies including devDependencies
RUN npm install --include=dev
# Copy all project files
COPY . .
# Build the application
RUN npm run build

# Stage 2: Production stage (lean image)
FROM node:22-slim

# Create non-root user and set directory permissions
RUN groupadd -r nodejs && \
    useradd -g nodejs -s /bin/bash -d /home/nodejs -m nodejs && \
    mkdir -p /home/nodejs/app && \
    chown -R nodejs:nodejs /home/nodejs/app

WORKDIR /home/nodejs/app

# Copy application files with correct ownership
COPY --from=builder --chown=nodejs:nodejs /app .

# Set environment variables directly in Dockerfile
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=warn

# Final cleanup
RUN npm prune --omit=dev && \
    npm cache clean --force

USER nodejs

EXPOSE 3002

CMD [ "node", "server.js" ]