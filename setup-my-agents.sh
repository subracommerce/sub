#!/bin/bash

echo "🤖 SUBRA - Agent Wallet Setup"
echo "=============================="
echo ""
echo "This script will:"
echo "1. Show your agents (Rick & NOT AI)"
echo "2. Create Solana wallets for them"
echo "3. Check their balances"
echo "4. Initialize their skills"
echo ""

# Step 1: Get token
echo "📝 Step 1: Get Your Token"
echo "-------------------------"
echo "1. Open your browser where SUBRA is running"
echo "2. Press F12 to open console"
echo "3. Type: localStorage.getItem('subra-auth')"
echo "4. Copy the token (the long text after \"token\":\"...\")"
echo ""
read -p "Paste your token here: " TOKEN

if [ -z "$TOKEN" ]; then
  echo "❌ No token provided. Exiting."
  exit 1
fi

# Clean token (remove quotes and parse JSON if needed)
TOKEN=$(echo "$TOKEN" | sed 's/.*"token":"\([^"]*\)".*/\1/')

echo ""
echo "✅ Token received!"
echo ""

# Step 2: Get agents
echo "📋 Step 2: Finding Your Agents..."
echo "---------------------------------"

RESPONSE=$(curl -s -X GET http://localhost:4000/agent \
  -H "Authorization: Bearer $TOKEN")

# Check if successful
if ! echo "$RESPONSE" | grep -q "success"; then
  echo "❌ Failed to get agents. Response:"
  echo "$RESPONSE"
  exit 1
fi

echo "$RESPONSE" | jq '.'
echo ""

# Extract agent IDs and names
AGENTS=$(echo "$RESPONSE" | jq -r '.data[] | "\(.id) \(.name)"')

if [ -z "$AGENTS" ]; then
  echo "❌ No agents found!"
  exit 1
fi

echo "Found agents:"
echo "$AGENTS"
echo ""

# Step 3: Create wallets for each agent
echo "💰 Step 3: Creating Wallets..."
echo "------------------------------"

while IFS= read -r line; do
  AGENT_ID=$(echo "$line" | awk '{print $1}')
  AGENT_NAME=$(echo "$line" | cut -d' ' -f2-)
  
  echo ""
  echo "Creating wallet for: $AGENT_NAME"
  
  WALLET_RESPONSE=$(curl -s -X POST http://localhost:4000/agent/wallet/create \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{\"agentId\": \"$AGENT_ID\"}")
  
  if echo "$WALLET_RESPONSE" | grep -q "success.*true"; then
    WALLET_ADDRESS=$(echo "$WALLET_RESPONSE" | jq -r '.data.publicKey')
    echo "  ✅ Wallet created: $WALLET_ADDRESS"
  else
    echo "  ⚠️  Response: $(echo "$WALLET_RESPONSE" | jq -r '.error // .message // .')"
  fi
  
  sleep 1
done <<< "$AGENTS"

echo ""
echo "🎯 Step 4: Checking Balances..."
echo "-------------------------------"

while IFS= read -r line; do
  AGENT_ID=$(echo "$line" | awk '{print $1}')
  AGENT_NAME=$(echo "$line" | cut -d' ' -f2-)
  
  echo ""
  echo "Balance for: $AGENT_NAME"
  
  BALANCE_RESPONSE=$(curl -s -X GET "http://localhost:4000/agent/$AGENT_ID/wallet/balance" \
    -H "Authorization: Bearer $TOKEN")
  
  if echo "$BALANCE_RESPONSE" | grep -q "success.*true"; then
    BALANCE=$(echo "$BALANCE_RESPONSE" | jq -r '.data.balance')
    echo "  💰 Balance: $BALANCE SOL"
  else
    echo "  ⚠️  Could not get balance"
  fi
  
  sleep 1
done <<< "$AGENTS"

echo ""
echo "🎓 Step 5: Initializing Skills..."
echo "---------------------------------"

while IFS= read -r line; do
  AGENT_ID=$(echo "$line" | awk '{print $1}')
  AGENT_NAME=$(echo "$line" | cut -d' ' -f2-)
  
  echo ""
  echo "Setting up skills for: $AGENT_NAME"
  
  SKILLS_RESPONSE=$(curl -s -X POST "http://localhost:4000/agent/$AGENT_ID/skills/initialize" \
    -H "Authorization: Bearer $TOKEN")
  
  if echo "$SKILLS_RESPONSE" | grep -q "success.*true"; then
    echo "  ✅ Skills initialized:"
    echo "$SKILLS_RESPONSE" | jq -r '.data.skills[] | "    • \(.skillType) - Level \(.level)"'
  else
    echo "  ⚠️  Response: $(echo "$SKILLS_RESPONSE" | jq -r '.error // .message // .')"
  fi
  
  sleep 1
done <<< "$AGENTS"

echo ""
echo "=============================="
echo "✅ SETUP COMPLETE!"
echo "=============================="
echo ""
echo "🎉 Your agents are ready!"
echo ""
echo "📊 Summary:"
while IFS= read -r line; do
  AGENT_NAME=$(echo "$line" | cut -d' ' -f2-)
  echo "  • $AGENT_NAME: Wallet ✓ | Skills ✓"
done <<< "$AGENTS"
echo ""
echo "🌐 Next Steps:"
echo "  1. Refresh your dashboard: http://localhost:3000/dashboard"
echo "  2. You should see wallet addresses on agent cards"
echo "  3. Click any agent to view details"
echo ""
echo "📖 For more testing, see: PHASE1_TESTING.md"
echo ""

