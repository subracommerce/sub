# 🚀 SUBRA Quick Start Guide

## Start the Platform (2 Terminals)

### Terminal 1: API Server
```bash
cd /Users/kingchief/Documents/SUB/apps/api
pnpm dev
```
**Wait for:** `🚀 SUBRA API running on port 4000`

### Terminal 2: Web Server  
```bash
cd /Users/kingchief/Documents/SUB/apps/web
pnpm dev
```
**Wait for:** `✓ Ready on http://localhost:3000`

---

## Test Everything

### 1. Homepage ✅
- Go to `http://localhost:3000`
- **See:** Clean white background, dark text, animated hero
- **Animations:** Title slides up, text shimmers, features fade in

### 2. Create Wallet ✅
1. Click "Get Started"
2. Click "Create New Wallet"
3. Enter password (min 8 chars)
4. Confirm password
5. Click "Create"
6. **Result:** Wallet created instantly, shows address, redirects to dashboard

### 3. Connect Wallet (Phantom) ✅
1. **FIRST:** Unlock Phantom extension (enter password)
2. Go to `http://localhost:3000/auth/wallet`
3. Click "Connect Wallet"
4. Choose "Phantom" from list
5. **Phantom popup appears** → Click "Connect"
6. Click "Sign to Authenticate"
7. **Phantom popup appears** → Click "Sign"
8. **Result:** Authenticated, redirect to dashboard

### 4. Dashboard ✅
- See your agents
- Create new agents
- View stats
- All features working

---

## Troubleshooting

### Wallet Won't Connect
- **Problem:** Phantom not popping up
- **Solution:** 
  1. Make sure Phantom is **unlocked** (click extension, enter password)
  2. Clear browser cache (Cmd+Shift+R)
  3. Try Incognito mode

### Wallet Creation Fails
- **Problem:** "Connection refused" error
- **Solution:** Make sure API is running on port 4000

### Can't See Agents
- **Problem:** Dashboard shows empty
- **Solution:** Make sure you're logged in and API is running

---

## What's Working Now

✅ **Homepage:** Clean, minimal, animated hero  
✅ **Wallet Creation:** Password-protected, encrypted  
✅ **Wallet Connection:** ExePay-style with popups  
✅ **Authentication:** Secure signature-based  
✅ **Dashboard:** Agent management ready  
✅ **UI:** White background, agentic, polished  

---

## Next Steps

1. Create your first AI agent
2. Configure agent preferences
3. Test agent shopping features
4. Explore marketplace

**Enjoy building with SUBRA!** 🚀

