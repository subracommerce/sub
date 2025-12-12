# SUBRA Quick Start Guide

Get SUBRA up and running in 5 minutes!

## ⚡ Super Fast Start (Docker)

```bash
# 1. Clone and enter directory
git clone https://github.com/yourusername/subra.git
cd subra

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your OPENAI_API_KEY at minimum

# 4. Start everything with Docker
docker-compose up -d

# 5. Setup database
cd apps/api && pnpm db:push && cd ../..

# 6. Open your browser
open http://localhost:3000
```

## 🎯 What You Get

After setup, you'll have:

- ✅ **Frontend** running on http://localhost:3000
- ✅ **API** running on http://localhost:4000
- ✅ **AI Agents** processing tasks in the background
- ✅ **PostgreSQL** database for data persistence
- ✅ **Redis** for caching and queues
- ✅ **Smart Contracts** ready to deploy
- ✅ **ZK Circuits** ready to compile

## 📋 Minimum Required Setup

### 1. Environment Variables (`.env`)

```bash
# Absolutely Required
DATABASE_URL="postgresql://postgres:password@localhost:5432/subra"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="change-this-to-a-secure-random-string-min-32-chars"
OPENAI_API_KEY="sk-..."  # Get from https://platform.openai.com

# For Frontend
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### 2. Start Services

```bash
# Option 1: Docker (Easiest)
docker-compose up -d

# Option 2: Manual
# Terminal 1 - PostgreSQL + Redis
docker-compose up postgres redis

# Terminal 2 - API
cd apps/api && pnpm dev

# Terminal 3 - Web
cd apps/web && pnpm dev

# Terminal 4 - Agents
cd apps/agents && pnpm dev
```

## 🧪 Test Your Setup

### 1. Check API Health

```bash
curl http://localhost:4000/health
# Should return: {"status":"ok","timestamp":"..."}
```

### 2. Register a User

Visit http://localhost:3000 and click "Get Started" or use curl:

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

### 3. Create Your First Agent

1. Log in to the web app
2. Click "Create Agent"
3. Choose "Explorer" type
4. Name it "My Shopping Agent"
5. Click "Create"

### 4. Run a Task

```bash
# Get your token from login, then:
curl -X POST http://localhost:4000/task \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "YOUR_AGENT_ID",
    "type": "search",
    "input": {"query": "best laptop 2024"}
  }'
```

## 🎨 Key Features to Try

### 1. AI Agents

**Explorer Agent** - Search for products:
```json
{
  "type": "search",
  "input": {
    "query": "gaming laptop under 1500",
    "limit": 10
  }
}
```

**Negotiator Agent** - Compare prices:
```json
{
  "type": "compare",
  "input": {
    "products": [...],
    "criteria": "best value"
  }
}
```

**Executor Agent** - Execute purchase:
```json
{
  "type": "purchase",
  "input": {
    "product": {...},
    "quantity": 1
  }
}
```

**Tracker Agent** - Track order:
```json
{
  "type": "track",
  "input": {
    "orderId": "ORD-12345"
  }
}
```

### 2. Wallet Integration

1. Click "Connect Wallet" in the app
2. Connect MetaMask or any WalletConnect wallet
3. Your wallet address is auto-linked to your account

### 3. View Transactions

- Navigate to Dashboard → Transactions
- See all your crypto payments
- View ZK receipt status

### 4. Agent Marketplace

- Browse available agents
- Check reputation scores
- Deploy specialized agents

## 🔧 Common Commands

```bash
# Development
pnpm dev                    # Start all apps
pnpm build                  # Build all apps
pnpm test                   # Run all tests
pnpm lint                   # Lint code
pnpm format                 # Format code

# Database
pnpm db:generate            # Generate Prisma client
pnpm db:push                # Push schema changes
pnpm db:studio              # Open database GUI

# Docker
docker-compose up -d        # Start all services
docker-compose logs -f api  # View API logs
docker-compose down         # Stop all services
docker-compose restart      # Restart services
```

## 🐛 Troubleshooting

### "Port already in use"
```bash
# Kill process on port 3000/4000
npx kill-port 3000 4000
```

### "Database connection failed"
```bash
# Restart PostgreSQL
docker-compose restart postgres

# Check status
docker-compose ps
```

### "Redis connection error"
```bash
# Restart Redis
docker-compose restart redis

# Test connection
redis-cli ping
```

### "Agent tasks not processing"
```bash
# Check agent logs
docker-compose logs -f agents

# Restart agents
docker-compose restart agents
```

### "OpenAI API error"
- Check your API key is valid
- Ensure you have credits: https://platform.openai.com/usage
- Verify the key is in `.env` as `OPENAI_API_KEY`

## 📚 Next Steps

1. **Read the docs**: [README.md](./README.md)
2. **Deploy smart contracts**: [apps/contracts/README.md](./apps/contracts/README.md)
3. **Setup ZK circuits**: [apps/circuits/README.md](./apps/circuits/README.md)
4. **Explore the API**: http://localhost:4000/health
5. **Join Discord**: Get help from the community

## 🚀 Ready for Production?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment guide.

## 💬 Need Help?

- 📖 **Full Setup Guide**: [SETUP.md](./SETUP.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/subra/issues)
- 💬 **Discord**: [Join Community](https://discord.gg/subra)
- 📧 **Email**: dev@subra.app

---

Built something cool? Share it with us! 🎉

