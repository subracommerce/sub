FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

FROM base AS dependencies
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/agents/package.json ./apps/agents/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app

# Copy dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/agents/node_modules ./apps/agents/node_modules

# Copy source
COPY . .

# Build
RUN cd apps/agents && pnpm build

FROM base AS runtime
WORKDIR /app

# Copy runtime dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/agents/node_modules ./apps/agents/node_modules

# Copy built app
COPY --from=build /app/apps/agents/dist ./apps/agents/dist
COPY --from=build /app/packages ./packages

# Start
CMD ["node", "apps/agents/dist/index.js"]

