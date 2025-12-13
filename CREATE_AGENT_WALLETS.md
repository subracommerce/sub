# 💰 Create Wallets for Your Agents

Your agents **Rick** and **NOT AI** are created but don't have wallets yet!

---

## 🚀 **Quick Setup:**

### **Step 1: Get Your Auth Token**
1. Open browser console (F12)
2. Run: `localStorage.getItem('subra-auth')`
3. Copy the token value (between quotes after `"token":"`)

### **Step 2: Get Agent IDs**
```bash
# Replace YOUR_TOKEN with your actual token
curl -X GET http://localhost:4000/agent \
  -H "Authorization: Bearer YOUR_TOKEN"
```

This will show your agents with their IDs. Copy the IDs for Rick and NOT AI.

### **Step 3: Create Wallet for Rick**
```bash
# Replace YOUR_TOKEN and RICK_AGENT_ID
curl -X POST http://localhost:4000/agent/wallet/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "agentId": "RICK_AGENT_ID"
  }'
```

### **Step 4: Create Wallet for NOT AI**
```bash
# Replace YOUR_TOKEN and NOT_AI_AGENT_ID
curl -X POST http://localhost:4000/agent/wallet/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "agentId": "NOT_AI_AGENT_ID"
  }'
```

### **Step 5: Verify Wallets Created**
```bash
# Check Rick's wallet
curl -X GET http://localhost:4000/agent/RICK_AGENT_ID/wallet \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check NOT AI's wallet
curl -X GET http://localhost:4000/agent/NOT_AI_AGENT_ID/wallet \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Step 6: Check Balances**
```bash
# Rick's balance
curl -X GET http://localhost:4000/agent/RICK_AGENT_ID/wallet/balance \
  -H "Authorization: Bearer YOUR_TOKEN"

# NOT AI's balance
curl -X GET http://localhost:4000/agent/NOT_AI_AGENT_ID/wallet/balance \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 **All-in-One Script:**

Save this as `setup-agent-wallets.sh`:

```bash
#!/bin/bash

echo "🤖 Setting up agent wallets..."
echo ""

read -p "Enter your JWT token: " TOKEN
echo ""

# Get agents
echo "📋 Fetching your agents..."
AGENTS=$(curl -s -X GET http://localhost:4000/agent \
  -H "Authorization: Bearer $TOKEN")

echo "$AGENTS" | jq '.'
echo ""

# Extract agent IDs (you'll need to manually copy these)
echo "Copy the agent IDs from above and run:"
echo ""
echo "# For Rick:"
echo "curl -X POST http://localhost:4000/agent/wallet/create \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -H \"Authorization: Bearer $TOKEN\" \\"
echo "  -d '{\"agentId\": \"RICK_ID_HERE\"}'"
echo ""
echo "# For NOT AI:"
echo "curl -X POST http://localhost:4000/agent/wallet/create \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -H \"Authorization: Bearer $TOKEN\" \\"
echo "  -d '{\"agentId\": \"NOT_AI_ID_HERE\"}'"
```

---

## ✅ **After Creating Wallets:**

1. Refresh dashboard: http://localhost:3000/dashboard
2. You should see wallet addresses on agent cards
3. Click any agent to see full details
4. Wallets will show 0 SOL balance (on devnet)

---

## 🧪 **Optional: Fund Wallets (Devnet)**

To give your agents some SOL for testing:

```bash
# Fund Rick with 1 SOL
curl -X POST http://localhost:4000/agent/wallet/fund \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "agentId": "RICK_AGENT_ID",
    "amount": 1
  }'

# Fund NOT AI with 1 SOL
curl -X POST http://localhost:4000/agent/wallet/fund \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "agentId": "NOT_AI_AGENT_ID",
    "amount": 1
  }'
```

---

## 🎉 **What's Next:**

After wallets are created:
- [ ] Initialize agent skills
- [ ] Test skill progression
- [ ] Complete Phase 1 testing checklist

See `PHASE1_TESTING.md` for full testing guide!

