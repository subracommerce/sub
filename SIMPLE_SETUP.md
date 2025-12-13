# 🚀 Super Simple Setup for Your Agents

## What You Need to Do:

### **Step 1: Get Your Token** (30 seconds)

1. **Open your browser** where SUBRA dashboard is open
2. **Press F12** (opens developer tools)
3. **Click "Console" tab** at the top
4. **Type this** and press Enter:
   ```javascript
   localStorage.getItem('subra-auth')
   ```
5. **You'll see something like:**
   ```
   "{"user":{...},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}"
   ```
6. **Copy ONLY the token part** (the long text after `"token":"`)
   - It starts with `eyJ...`
   - It's very long
   - Copy everything until the closing quote

---

### **Step 2: Run the Setup Script** (1 minute)

Open Terminal and run:

```bash
cd /Users/kingchief/Documents/SUB
./setup-my-agents.sh
```

**When asked, paste your token** (from Step 1) and press Enter.

The script will automatically:
- ✅ Find Rick and NOT AI
- ✅ Create wallets for both
- ✅ Check their balances
- ✅ Give them skills (search, compare, negotiate, execute)

---

### **Step 3: See Your Agents** (immediate)

Go to: **http://localhost:3000/dashboard**

You should now see:
- **2 agent cards** (Rick and NOT AI)
- **Wallet addresses** on each card
- **"2" in the Active Agents** stat

Click any agent card to see details!

---

## 🎉 That's It!

Your agents are ready to work!

---

## 🆘 If Something Goes Wrong:

### **"Failed to get agents"**
- Make sure API is running: `cd apps/api && pnpm dev`
- Make sure Web is running: `cd apps/web && pnpm dev`

### **"No token provided"**
- Make sure you copied the FULL token
- It should start with `eyJ`
- Don't include the quotes

### **"Agent already has a wallet"**
- That's okay! It means wallets already exist
- Just refresh the dashboard

---

## ❓ Still Confused?

Just run these commands one by one (easier to see what's happening):

```bash
# 1. See your agents
curl -X GET http://localhost:4000/agent \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 2. Copy an agent ID from the response above, then:
curl -X POST http://localhost:4000/agent/wallet/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"agentId": "PASTE_AGENT_ID_HERE"}'
```

Replace `YOUR_TOKEN_HERE` and `PASTE_AGENT_ID_HERE` with real values.

---

**Need help? Let me know what step is confusing!**

