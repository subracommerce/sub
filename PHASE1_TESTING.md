# 🧪 Phase 1 Testing Guide

## 📋 **What We're Testing:**

Phase 1 includes:
1. ✅ Authentication System (Email + Wallet)
2. ✅ Agent Management (Create, List, View)
3. ✅ Agent Wallets (Create, Balance, Fund)
4. ✅ Agent Skills (Create, Level Up, Track)
5. ⏳ Solana Programs (Ready to deploy)

---

## 🚀 **Prerequisites:**

### **1. Start Infrastructure**
```bash
# Terminal 1: Start API
cd /Users/kingchief/Documents/SUB/apps/api
pnpm dev

# Terminal 2: Start Web
cd /Users/kingchief/Documents/SUB/apps/web
pnpm dev
```

### **2. Verify Servers Running**
- API: http://localhost:4000/health
- Web: http://localhost:3000

---

## 🧪 **Test 1: Authentication System**

### **A. Email Registration**
1. Go to http://localhost:3000/auth/register
2. Click "Sign Up with Email"
3. Enter:
   - Email: test@subra.app
   - Password: Test123456!
4. ✅ Should redirect to dashboard
5. ✅ Should see "Sign Out" button
6. ✅ Should see wallet status

### **B. Create New Wallet**
1. Go to http://localhost:3000/auth/register
2. Click "Create New Wallet"
3. Enter a password (e.g., "MySecurePass123!")
4. ✅ Should create wallet
5. ✅ Should show wallet address
6. ✅ Should redirect to dashboard
7. ✅ Should see wallet address in header

### **C. Connect External Wallet**
1. Go to http://localhost:3000/auth/register
2. Click "Connect Wallet"
3. Select Phantom/Solflare/MetaMask
4. ✅ Wallet should popup
5. ✅ Approve connection
6. ✅ Sign message
7. ✅ Should redirect to dashboard
8. ✅ Should see wallet address

### **D. Sign Out & Sign In**
1. Click "Sign Out"
2. Go to http://localhost:3000/auth/login
3. Enter credentials
4. ✅ Should login successfully
5. ✅ Should see dashboard

---

## 🧪 **Test 2: Agent Management**

### **A. Create Agent (via API)**
```bash
# Get your auth token from browser localStorage: "subra-auth"
TOKEN="your-jwt-token-here"

# Create an Explorer Agent
curl -X POST http://localhost:4000/agent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Shopping Bot Alpha",
    "type": "explorer",
    "description": "My first AI shopping agent"
  }'
```

✅ Should return:
```json
{
  "success": true,
  "data": {
    "id": "agent-uuid",
    "name": "Shopping Bot Alpha",
    "type": "explorer",
    "isActive": true
  }
}
```

### **B. List Agents**
```bash
curl -X GET http://localhost:4000/agent \
  -H "Authorization: Bearer $TOKEN"
```

✅ Should return list of your agents

### **C. Get Agent Details**
```bash
AGENT_ID="your-agent-id"

curl -X GET http://localhost:4000/agent/$AGENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

✅ Should return agent details

---

## 🧪 **Test 3: Agent Wallets**

### **A. Create Agent Wallet**
```bash
curl -X POST http://localhost:4000/agent/wallet/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "agentId": "your-agent-id"
  }'
```

✅ Should return:
```json
{
  "success": true,
  "data": {
    "publicKey": "solana-public-key",
    "message": "Agent wallet created successfully"
  }
}
```

### **B. Get Agent Wallet Address**
```bash
curl -X GET http://localhost:4000/agent/$AGENT_ID/wallet \
  -H "Authorization: Bearer $TOKEN"
```

✅ Should return wallet public key

### **C. Check Agent Wallet Balance**
```bash
curl -X GET http://localhost:4000/agent/$AGENT_ID/wallet/balance \
  -H "Authorization: Bearer $TOKEN"
```

✅ Should return SOL balance (likely 0 on devnet)

### **D. Fund Agent Wallet (Devnet Airdrop)**
```bash
curl -X POST http://localhost:4000/agent/wallet/fund \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "agentId": "your-agent-id",
    "amount": 1
  }'
```

✅ Should airdrop 1 SOL to agent wallet
✅ Check balance again - should show ~1 SOL

---

## 🧪 **Test 4: Agent Skills**

### **A. Initialize All Skills**
```bash
curl -X POST http://localhost:4000/agent/$AGENT_ID/skills/initialize \
  -H "Authorization: Bearer $TOKEN"
```

✅ Should create 4 skills:
- search (level 1)
- compare (level 1)
- negotiate (level 1)
- execute (level 1)

### **B. Get Agent Skills**
```bash
curl -X GET http://localhost:4000/agent/$AGENT_ID/skills \
  -H "Authorization: Bearer $TOKEN"
```

✅ Should return all 4 skills with level and experience

### **C. Add Experience to Skill**
```bash
# Get skill ID from previous response
SKILL_ID="your-skill-id"

curl -X POST http://localhost:4000/agent/skill/$SKILL_ID/experience \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 50
  }'
```

✅ Should add 50 XP
✅ Should show new experience total

### **D. Level Up Test**
```bash
# Add 100 XP to level up
curl -X POST http://localhost:4000/agent/skill/$SKILL_ID/experience \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 100
  }'
```

✅ Should level up to level 2
✅ Response should show `"leveledUp": true`

---

## 🧪 **Test 5: Dashboard UI**

### **A. View Dashboard**
1. Go to http://localhost:3000/dashboard
2. ✅ Should see stats (Active Agents, On-Chain Volume, ZK Proofs)
3. ✅ Should see "Deploy Your First Agent" card
4. ✅ Should see wallet address in header
5. ✅ Should see "Sign Out" button

### **B. Create Agent (UI)**
1. Click "Deploy Your First Agent"
2. Fill in:
   - Name: "Test Agent"
   - Type: Explorer
   - Description: "Testing agent creation"
3. Click "Create Agent"
4. ✅ Should create agent
5. ✅ Should show success message
6. ✅ Should appear in agent list

---

## 📊 **Test Results Checklist:**

### **Authentication**
- [ ] Email registration works
- [ ] Create wallet works
- [ ] Connect external wallet works
- [ ] Sign in/out works
- [ ] Wallet address displays

### **Agent Management**
- [ ] Create agent via API works
- [ ] List agents works
- [ ] Get agent details works
- [ ] Create agent via UI works

### **Agent Wallets**
- [ ] Create agent wallet works
- [ ] Get wallet address works
- [ ] Check balance works
- [ ] Fund wallet (airdrop) works

### **Agent Skills**
- [ ] Initialize all skills works
- [ ] Get skills works
- [ ] Add experience works
- [ ] Level up works

### **Dashboard**
- [ ] Dashboard loads
- [ ] Stats display
- [ ] Agent creation UI works
- [ ] Wallet info shows

---

## 🚨 **Common Issues:**

### **"Failed to fetch"**
- Check API is running on port 4000
- Check Web is running on port 3000

### **"Unauthorized"**
- Get fresh JWT token from localStorage
- Token expires after 24 hours

### **"Agent not found"**
- Verify agent ID is correct
- Verify agent belongs to your user

### **"Wallet not found"**
- Create agent wallet first
- Check agent has `walletAddress` field

---

## ✅ **Phase 1 Complete When:**

All checkboxes above are checked! Then we can move to Phase 2.

---

## 🎯 **Next Phase Preview:**

**Phase 2 will add:**
- Product search across marketplaces
- Price comparison
- Agent task execution
- Real-time activity feed
- Purchase simulation

But let's test Phase 1 first! 🚀

