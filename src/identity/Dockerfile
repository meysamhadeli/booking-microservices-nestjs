# syntax=docker/dockerfile:1
# -------- Builder --------
FROM node:20.19.2-alpine AS builder
WORKDIR /app

# Copy source code
COPY src/building-blocks ./src/building-blocks
COPY src/identity ./src/identity

# Install & build inside identity
WORKDIR /app/src/identity
RUN npm install && npm run build

# -------- Runner --------
FROM node:20.19.2-alpine AS runner
WORKDIR /app

ENV NODE_ENV=docker

# Copy package files first
COPY src/identity/package*.json ./

# Install only production deps
RUN npm ci --omit=dev && npm cache clean --force

# Copy build artifacts
COPY --from=builder /app/src/identity/dist ./dist

# Copy .env.development to the build folder
COPY --from=builder /app/src/identity/.env.development ./dist/identity/src/

# Copy building-blocks to node_modules (so it's resolvable)
COPY --from=builder /app/src/building-blocks ./node_modules/building-blocks

EXPOSE 3333
CMD ["node", "dist/identity/src/main.js"]