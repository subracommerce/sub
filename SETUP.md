# SUBRA Setup Guide

Complete step-by-step guide to set up SUBRA for development.

## Prerequisites

### Required Software

1. **Node.js 20+**
```bash
# Using nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

2. **pnpm 8+**
```bash
npm install -g pnpm@8
```

3. **Docker & Docker Compose**
```bash
# macOS
brew install docker docker-compose

# Linux
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

4. **PostgreSQL 16** (if not using Docker)
```bash
# macOS
brew install postgresql@16

# Linux
sudo apt-get install postgresql-16
```

5. **Redis 7** (if not using Docker)
```bash
# macOS
brew install redis

# Linux
sudo apt-get install redis-server
```

### Optional Tools

1. **Foundry** (for smart contracts)
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. **Noir** (for ZK circuits)
```bash
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
noirup
```

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/subra.git
cd subra
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

```bash
# Copy example environment file
cp .env.example .env

# Edit with your values
nano .env
```

**Required Environment Variables:**

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/subra"
REDIS_URL="redis://localhost:6379"

# API
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
API_KEY_SECRET="your-api-key-secret-min-32-characters"

# OpenAI (required for agents)
OPENAI_API_KEY="sk-..."

# Blockchain (optional for development)
ETHEREUM_RPC_URL="https://eth-mainnet.g.alchemy.com/v2/YOUR-KEY"
PRIVATE_KEY_ENCRYPTION_KEY="your-encryption-key-min-32-chars"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="your-walletconnect-id"
NEXT_PUBLIC_ALCHEMY_ID="your-alchemy-id"
```

### 4. Start Infrastructure

**Option A: Using Docker (Recommended)**

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Verify services are running
docker-compose ps
```

**Option B: Local Installation**

```bash
# Start PostgreSQL
brew services start postgresql@16

# Start Redis
brew services start redis
```

### 5. Database Setup

```bash
# Navigate to API directory
cd apps/api

# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# (Optional) Open Prisma Studio to view data
pnpm db:studio
```

### 6. Start Development Servers

**Terminal 1 - API Server:**
```bash
cd apps/api
pnpm dev
```

**Terminal 2 - Web Frontend:**
```bash
cd apps/web
pnpm dev
```

**Terminal 3 - Agent Runtime:**
```bash
cd apps/agents
pnpm dev
```

### 7. Verify Installation

1. **API Health Check:**
```bash
curl http://localhost:4000/health
```

Expected response:
```json
{"status":"ok","timestamp":"..."}
```

2. **Frontend:**
Open browser to http://localhost:3000

3. **Database:**
```bash
cd apps/api
pnpm db:studio
```

## Optional Setup

### Smart Contracts

```bash
cd apps/contracts

# Install dependencies
forge install

# Build contracts
forge build

# Run tests
forge test

# Deploy to testnet (requires funded wallet)
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast
```

### ZK Circuits

```bash
cd apps/circuits

# Compile circuits
nargo compile

# Run tests
nargo test

# Generate proof (after creating Prover.toml)
nargo prove
```

## Testing the Platform

### 1. Register a User

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

### 2. Create an Agent

```bash
# Use the token from registration
curl -X POST http://localhost:4000/agent \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First Agent",
    "type": "explorer",
    "description": "Product search agent"
  }'
```

### 3. Create a Task

```bash
curl -X POST http://localhost:4000/task \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "AGENT_ID",
    "type": "search",
    "input": {
      "query": "laptop under $1000"
    }
  }'
```

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Redis Connection Issues

```bash
# Test Redis connection
redis-cli ping

# Should return: PONG
```

### Port Already in Use

```bash
# Find process using port 4000
lsof -i :4000

# Kill process
kill -9 <PID>
```

### Prisma Issues

```bash
# Reset database
cd apps/api
pnpm prisma migrate reset

# Regenerate client
pnpm db:generate
```

### Agent Tasks Not Processing

```bash
# Check agent runtime logs
cd apps/agents
pnpm dev

# Check Redis queue
redis-cli
KEYS *
LLEN bull:agent-tasks:wait
```

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup instructions.

## Next Steps

1. Read the [README.md](./README.md) for feature overview
2. Check [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines
3. Explore the [API documentation](./apps/api/README.md)
4. Join our [Discord](https://discord.gg/subra) for support

## Getting Help

- **GitHub Issues**: Bug reports and feature requests
- **Discord**: Real-time community support
- **Email**: dev@subra.app
- **Docs**: Full documentation at docs.subra.app

---

Happy building with SUBRA! 🚀

