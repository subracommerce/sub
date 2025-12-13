# 🔧 SUBRA Troubleshooting Guide

Common issues and solutions for SUBRA development.

---

## 🔐 Authentication Issues

### "Failed to fetch" or "Session Expired"

**Problem:** Token expires after some time or when refreshing pages.

**Solution:**
1. Sign in again at http://localhost:3000/auth/login
2. Or reconnect your wallet at http://localhost:3000/auth/wallet

**Why it happens:**
- JWT tokens expire after a set time (default: 24 hours)
- Refreshing clears some state
- API might be down or restarting

**Prevention:**
- Don't refresh pages unnecessarily
- If developing, keep API server running
- Check API logs for errors

---

## 🤖 Agent Issues

### Agent chat shows "Failed to load agent"

**Causes:**
1. Token expired → Sign in again
2. API server down → Check terminal
3. Agent doesn't exist → Create new agent

**Fix:**
```bash
# Restart API server
cd /Users/kingchief/Documents/SUB/apps/api
export DATABASE_URL="postgresql://kingchief@localhost:5432/subra"
pnpm dev
```

### Agent returns mock data instead of real products

**Causes:**
1. API server not restarted after code changes
2. Scraping failed (network issues)
3. Marketplaces blocking scraper

**Fix:**
1. **Restart API server** (Ctrl+C, then `pnpm dev`)
2. Check API logs for scraping errors
3. Wait 10-15 seconds for scraping to complete

---

## 🕷️ Web Scraping Issues

### Scraping timeout or no results

**Problem:** Puppeteer can't scrape marketplaces.

**Causes:**
- Network issues
- Marketplace blocking requests
- CAPTCHA challenges
- Slow internet connection

**Solutions:**

1. **Check internet connection**
2. **Increase timeout:**
   ```typescript
   // In scraper.ts
   await page.goto(url, { timeout: 60000 }); // 60 seconds
   ```

3. **Try one marketplace at a time:**
   ```typescript
   // In chat, try:
   "search for laptops on amazon"
   ```

4. **Check API logs** for specific errors:
   ```bash
   cd /Users/kingchief/Documents/SUB/apps/api
   tail -f logs/*.log
   ```

---

## 🗄️ Database Issues

### "Connection refused" or "Database error"

**Problem:** PostgreSQL not running or wrong connection string.

**Fix:**
```bash
# Start PostgreSQL
brew services start postgresql@16

# Check status
brew services list

# Test connection
psql -U kingchief -d subra -c "SELECT 1"
```

### Schema out of sync

**Problem:** Database schema doesn't match Prisma schema.

**Fix:**
```bash
cd /Users/kingchief/Documents/SUB/apps/api
pnpm prisma db push
```

---

## 💾 Redis Issues

### "Redis connection failed"

**Problem:** Redis not running.

**Fix:**
```bash
# Start Redis
brew services start redis

# Check status
redis-cli ping
# Should return: PONG
```

---

## 🌐 API Server Issues

### "EADDRINUSE: port 4000 already in use"

**Problem:** API server already running on port 4000.

**Fix:**
```bash
# Find and kill the process
lsof -ti:4000 | xargs kill -9

# Or use different port
PORT=4001 pnpm dev
```

### API returns 500 errors

**Problem:** Server error, check logs.

**Fix:**
```bash
# View logs
cd /Users/kingchief/Documents/SUB/apps/api

# Check for errors in terminal output
# Common causes:
# - Database connection
# - Missing environment variables
# - Code errors
```

---

## 🖥️ Web Server Issues

### "Port 3000 already in use"

**Fix:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Restart
cd /Users/kingchief/Documents/SUB/apps/web
pnpm dev
```

### Page won't load or blank screen

**Causes:**
1. JavaScript errors → Check browser console
2. API server down → Check http://localhost:4000/health
3. Build error → Check terminal

**Fix:**
1. **Check browser console** (F12)
2. **Hard refresh:** `Cmd + Shift + R`
3. **Clear cache:**
   - Chrome DevTools → Network tab → "Disable cache"
4. **Restart web server**

---

## 🔑 Environment Variables

### "Environment variable not defined"

**Problem:** Missing `.env` file or variables.

**Fix:**
```bash
cd /Users/kingchief/Documents/SUB

# Check if .env exists
ls -la .env

# If missing, copy template
cp .env.template .env

# Edit with your values
nano .env
```

**Required variables:**
```bash
DATABASE_URL="postgresql://kingchief@localhost:5432/subra"
JWT_SECRET="your-secret-key"
PRIVATE_KEY_ENCRYPTION_KEY="your-encryption-key"
SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

---

## 🦊 Wallet Issues

### Phantom won't connect

**Problem:** Cached connection or locked wallet.

**Fix:**
1. **Unlock Phantom wallet**
2. **Clear trusted sites:**
   - Phantom → Settings → Trusted Apps
   - Remove `localhost:3000`
3. **Hard refresh page:** `Cmd + Shift + R`
4. **Try incognito mode**

### Wallet connects but nothing happens

**Problem:** Missing signature or nonce verification failed.

**Fix:**
1. Check browser console for errors
2. Ensure wallet is unlocked
3. Try different wallet (Solflare)
4. Sign out and sign in again

---

## 🐛 Common Errors

### `products.slice is not a function`

**Fixed in latest version!** Update and restart servers.

### `Module not found: Can't resolve '@/components/ui/badge'`

**Fix:** Badge component removed. Should not appear in latest code.

### `TypeError: Cannot read properties of undefined`

**Cause:** API response structure changed or null data.

**Fix:**
1. Check API logs
2. Verify token is valid
3. Restart API server
4. Clear browser cache

---

## 🔄 Full System Restart

When everything is broken, do a full restart:

```bash
# 1. Stop all servers (Ctrl+C in all terminals)

# 2. Stop services
brew services stop postgresql@16
brew services stop redis

# 3. Start services
brew services start postgresql@16
brew services start redis

# 4. Verify services
psql -U kingchief -d subra -c "SELECT 1"
redis-cli ping

# 5. Start API
cd /Users/kingchief/Documents/SUB/apps/api
export DATABASE_URL="postgresql://kingchief@localhost:5432/subra"
pnpm dev

# 6. In new terminal, start Web
cd /Users/kingchief/Documents/SUB/apps/web
pnpm dev

# 7. Clear browser cache and refresh
```

---

## 📊 Health Checks

### Check API Health
```bash
curl http://localhost:4000/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Check Database
```bash
psql -U kingchief -d subra -c "SELECT COUNT(*) FROM users"
```

### Check Redis
```bash
redis-cli ping
# Should return: PONG
```

### Check Web Server
```bash
curl http://localhost:3000
# Should return HTML
```

---

## 🆘 Still Having Issues?

1. **Check all terminals** for error messages
2. **Read error messages carefully** (they usually tell you what's wrong)
3. **Check browser console** (F12)
4. **Verify environment variables** are set
5. **Ensure all services running** (PostgreSQL, Redis, API, Web)
6. **Try incognito mode** (rules out browser cache issues)
7. **Restart everything** (nuclear option but usually works)

---

## 📝 Getting Help

If stuck, provide:
1. Error message (full text)
2. What you were doing when error occurred
3. Browser console logs
4. API terminal logs
5. Steps to reproduce

---

**Last Updated:** December 13, 2025  
**Version:** Phase 2 (50% complete)

