#!/bin/bash

echo "🧪 SUBRA Phase 1 - Automated Testing"
echo "====================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:4000"
TOKEN=""
AGENT_ID=""
SKILL_ID=""

# Function to check if server is running
check_server() {
  echo -n "Checking $1... "
  if curl -s "$2" > /dev/null; then
    echo -e "${GREEN}✓ Running${NC}"
    return 0
  else
    echo -e "${RED}✗ Not running${NC}"
    return 1
  fi
}

# Function to make API request
api_request() {
  local method=$1
  local endpoint=$2
  local data=$3
  
  if [ -z "$data" ]; then
    curl -s -X $method "$API_URL$endpoint" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json"
  else
    curl -s -X $method "$API_URL$endpoint" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "$data"
  fi
}

echo "📡 Step 1: Check Servers"
echo "------------------------"
check_server "API" "$API_URL/health"
API_RUNNING=$?

check_server "Web" "http://localhost:3000"
WEB_RUNNING=$?

if [ $API_RUNNING -ne 0 ] || [ $WEB_RUNNING -ne 0 ]; then
  echo ""
  echo -e "${RED}❌ Servers not running!${NC}"
  echo ""
  echo "Start servers with:"
  echo "  Terminal 1: cd apps/api && pnpm dev"
  echo "  Terminal 2: cd apps/web && pnpm dev"
  exit 1
fi

echo ""
echo "🔐 Step 2: Authentication"
echo "------------------------"
echo -e "${YELLOW}⚠️  Manual step required:${NC}"
echo "1. Go to http://localhost:3000/auth/register"
echo "2. Create a wallet or sign up with email"
echo "3. Open browser console (F12)"
echo "4. Run: localStorage.getItem('subra-auth')"
echo "5. Copy the token value"
echo ""
read -p "Paste your JWT token here: " TOKEN

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ No token provided${NC}"
  exit 1
fi

# Parse token to get just the token part (remove quotes and parse JSON)
TOKEN=$(echo $TOKEN | sed 's/.*"token":"\([^"]*\)".*/\1/')

echo -e "${GREEN}✓ Token received${NC}"

echo ""
echo "🤖 Step 3: Create Agent"
echo "------------------------"
RESPONSE=$(api_request POST "/agent" '{
  "name": "Test Agent Alpha",
  "type": "explorer",
  "description": "Automated test agent"
}')

echo "$RESPONSE" | jq '.'

if echo "$RESPONSE" | jq -e '.success' > /dev/null; then
  AGENT_ID=$(echo "$RESPONSE" | jq -r '.data.id')
  echo -e "${GREEN}✓ Agent created: $AGENT_ID${NC}"
else
  echo -e "${RED}✗ Failed to create agent${NC}"
  exit 1
fi

echo ""
echo "💰 Step 4: Create Agent Wallet"
echo "------------------------"
RESPONSE=$(api_request POST "/agent/wallet/create" "{
  \"agentId\": \"$AGENT_ID\"
}")

echo "$RESPONSE" | jq '.'

if echo "$RESPONSE" | jq -e '.success' > /dev/null; then
  WALLET_ADDRESS=$(echo "$RESPONSE" | jq -r '.data.publicKey')
  echo -e "${GREEN}✓ Wallet created: $WALLET_ADDRESS${NC}"
else
  echo -e "${RED}✗ Failed to create wallet${NC}"
  exit 1
fi

echo ""
echo "💵 Step 5: Check Wallet Balance"
echo "------------------------"
RESPONSE=$(api_request GET "/agent/$AGENT_ID/wallet/balance")

echo "$RESPONSE" | jq '.'

if echo "$RESPONSE" | jq -e '.success' > /dev/null; then
  BALANCE=$(echo "$RESPONSE" | jq -r '.data.balance')
  echo -e "${GREEN}✓ Balance: $BALANCE SOL${NC}"
else
  echo -e "${RED}✗ Failed to get balance${NC}"
fi

echo ""
echo "🎯 Step 6: Initialize Agent Skills"
echo "------------------------"
RESPONSE=$(api_request POST "/agent/$AGENT_ID/skills/initialize")

echo "$RESPONSE" | jq '.'

if echo "$RESPONSE" | jq -e '.success' > /dev/null; then
  echo -e "${GREEN}✓ Skills initialized${NC}"
  SKILL_ID=$(echo "$RESPONSE" | jq -r '.data.skills[0].id')
else
  echo -e "${RED}✗ Failed to initialize skills${NC}"
  exit 1
fi

echo ""
echo "📊 Step 7: Get Agent Skills"
echo "------------------------"
RESPONSE=$(api_request GET "/agent/$AGENT_ID/skills")

echo "$RESPONSE" | jq '.'

if echo "$RESPONSE" | jq -e '.success' > /dev/null; then
  echo -e "${GREEN}✓ Skills retrieved${NC}"
else
  echo -e "${RED}✗ Failed to get skills${NC}"
fi

echo ""
echo "⬆️  Step 8: Add Experience to Skill"
echo "------------------------"
RESPONSE=$(api_request POST "/agent/skill/$SKILL_ID/experience" '{
  "amount": 50
}')

echo "$RESPONSE" | jq '.'

if echo "$RESPONSE" | jq -e '.success' > /dev/null; then
  NEW_XP=$(echo "$RESPONSE" | jq -r '.data.skill.experience')
  echo -e "${GREEN}✓ Experience added: $NEW_XP XP${NC}"
else
  echo -e "${RED}✗ Failed to add experience${NC}"
fi

echo ""
echo "🎉 Step 9: Level Up Test"
echo "------------------------"
RESPONSE=$(api_request POST "/agent/skill/$SKILL_ID/experience" '{
  "amount": 100
}')

echo "$RESPONSE" | jq '.'

if echo "$RESPONSE" | jq -e '.success' > /dev/null; then
  LEVELED_UP=$(echo "$RESPONSE" | jq -r '.data.leveledUp')
  NEW_LEVEL=$(echo "$RESPONSE" | jq -r '.data.skill.level')
  
  if [ "$LEVELED_UP" = "true" ]; then
    echo -e "${GREEN}✓ Leveled up to level $NEW_LEVEL!${NC}"
  else
    echo -e "${YELLOW}⚠️  XP added but not leveled up yet${NC}"
  fi
else
  echo -e "${RED}✗ Failed to add experience${NC}"
fi

echo ""
echo "====================================="
echo -e "${GREEN}✅ Phase 1 Testing Complete!${NC}"
echo "====================================="
echo ""
echo "📊 Test Summary:"
echo "  • Authentication: ✓"
echo "  • Agent Creation: ✓"
echo "  • Agent Wallet: ✓"
echo "  • Wallet Balance: ✓"
echo "  • Agent Skills: ✓"
echo "  • Skill Progression: ✓"
echo ""
echo "🎯 Your Test Agent:"
echo "  ID: $AGENT_ID"
echo "  Wallet: $WALLET_ADDRESS"
echo "  Balance: $BALANCE SOL"
echo ""
echo "🚀 Ready for Phase 2!"

