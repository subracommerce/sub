# 🚀 How to Start SUBRA Servers

## Quick Start (3 terminals)

### Terminal 1: PostgreSQL & Redis
```bash
# Start PostgreSQL
brew services start postgresql@14

# Start Redis
brew services start redis

# Verify they're running
brew services list
```

### Terminal 2: API Server
```bash
cd /Users/kingchief/Documents/SUB
cd apps/api
pnpm dev
```

### Terminal 3: Web Server
```bash
cd /Users/kingchief/Documents/SUB
cd apps/web
pnpm dev
```

## Verify Everything is Running

1. **API**: http://localhost:4000/health
2. **Web**: http://localhost:3000
3. **PostgreSQL**: `psql -h localhost -U postgres -d subra`
4. **Redis**: `redis-cli ping` (should return "PONG")

## Troubleshooting

### API won't start
- Check `.env` file exists in root
- Make sure PostgreSQL is running
- Run `pnpm db:push` to sync database

### Web won't start
- Make sure `NEXT_PUBLIC_API_URL=http://localhost:4000` is in `.env`
- Clear `.next` folder: `rm -rf apps/web/.next`

### Wallet connection not working
- Make sure Phantom extension is installed
- Unlock Phantom BEFORE clicking connect
- Check browser console for errors

## Stop Servers

```bash
# Stop PostgreSQL and Redis
brew services stop postgresql@14
brew services stop redis

# API and Web: Just press Ctrl+C in their terminals
```

