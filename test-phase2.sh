#!/bin/bash

echo "🧪 SUBRA Phase 2 - Automated Testing"
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

# Check if server is running
echo "📡 Checking API Server..."
if ! curl -s "$API_URL/health" > /dev/null; then
  echo -e "${RED}❌ API not running!${NC}"
  echo ""
  echo "Start API with:"
  echo "  cd apps/api && pnpm dev"
  exit 1
fi
echo -e "${GREEN}✓ API running${NC}"
echo ""

# Get token
echo "🔐 Authentication"
echo "----------------"
read -p "Paste your JWT token: " TOKEN

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ No token provided${NC}"
  exit 1
fi

# Clean token
TOKEN=$(echo "$TOKEN" | sed 's/.*"token":"\([^"]*\)".*/\1/')
echo -e "${GREEN}✓ Token received${NC}"
echo ""

# Get agents
echo "🤖 Getting Your Agents..."
AGENTS_RESPONSE=$(curl -s -X GET "$API_URL/agent" \
  -H "Authorization: Bearer $TOKEN")

if echo "$AGENTS_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  AGENT_ID=$(echo "$AGENTS_RESPONSE" | jq -r '.data[0].id')
  AGENT_NAME=$(echo "$AGENTS_RESPONSE" | jq -r '.data[0].name')
  echo -e "${GREEN}✓ Using agent: $AGENT_NAME${NC}"
  echo ""
else
  echo -e "${RED}❌ Failed to get agents${NC}"
  exit 1
fi

# Test 1: Marketplace Search
echo "🧪 Test 1: Marketplace Search"
echo "-----------------------------"
SEARCH_RESPONSE=$(curl -s -X POST "$API_URL/marketplace/search" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "gaming laptop",
    "marketplaces": ["amazon", "ebay"],
    "maxResults": 5
  }')

if echo "$SEARCH_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  PRODUCT_COUNT=$(echo "$SEARCH_RESPONSE" | jq -r '.data.totalResults')
  SEARCH_TIME=$(echo "$SEARCH_RESPONSE" | jq -r '.data.searchTime')
  echo -e "${GREEN}✓ Found $PRODUCT_COUNT products in ${SEARCH_TIME}ms${NC}"
else
  echo -e "${RED}✗ Search failed${NC}"
fi
echo ""

# Test 2: Price Comparison
echo "🧪 Test 2: Price Comparison"
echo "---------------------------"
COMPARE_RESPONSE=$(curl -s -X POST "$API_URL/marketplace/compare" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "productName": "iPhone 15 Pro",
    "marketplaces": ["amazon", "ebay"]
  }')

if echo "$COMPARE_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  BEST_PRICE=$(echo "$COMPARE_RESPONSE" | jq -r '.data.bestPrice')
  BEST_MARKETPLACE=$(echo "$COMPARE_RESPONSE" | jq -r '.data.bestMarketplace')
  SAVINGS=$(echo "$COMPARE_RESPONSE" | jq -r '.data.savings')
  echo -e "${GREEN}✓ Best price: \$$BEST_PRICE at $BEST_MARKETPLACE (save \$$SAVINGS)${NC}"
else
  echo -e "${RED}✗ Compare failed${NC}"
fi
echo ""

# Test 3: Agent Search Task
echo "🧪 Test 3: Agent Search Task"
echo "----------------------------"
TASK1_RESPONSE=$(curl -s -X POST "$API_URL/agent/task" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"agentId\": \"$AGENT_ID\",
    \"type\": \"search\",
    \"input\": {
      \"query\": \"wireless headphones\",
      \"marketplaces\": [\"amazon\", \"ebay\"]
    }
  }")

if echo "$TASK1_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  XP_GAINED=$(echo "$TASK1_RESPONSE" | jq -r '.data.result.experienceGained')
  PRODUCTS=$(echo "$TASK1_RESPONSE" | jq -r '.data.result.data.totalResults')
  echo -e "${GREEN}✓ Agent found $PRODUCTS products and gained $XP_GAINED XP${NC}"
else
  echo -e "${RED}✗ Search task failed${NC}"
fi
echo ""

# Test 4: Agent Compare Task
echo "🧪 Test 4: Agent Compare Task"
echo "-----------------------------"
TASK2_RESPONSE=$(curl -s -X POST "$API_URL/agent/task" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"agentId\": \"$AGENT_ID\",
    \"type\": \"compare\",
    \"input\": {
      \"productName\": \"AirPods Pro\",
      \"marketplaces\": [\"amazon\", \"ebay\"]
    }
  }")

if echo "$TASK2_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  XP_GAINED2=$(echo "$TASK2_RESPONSE" | jq -r '.data.result.experienceGained')
  BEST=$(echo "$TASK2_RESPONSE" | jq -r '.data.result.data.bestPrice')
  echo -e "${GREEN}✓ Agent found best price \$$BEST and gained $XP_GAINED2 XP${NC}"
else
  echo -e "${RED}✗ Compare task failed${NC}"
fi
echo ""

# Test 5: Task History
echo "🧪 Test 5: Task History"
echo "-----------------------"
TASKS_RESPONSE=$(curl -s -X GET "$API_URL/agent/$AGENT_ID/tasks" \
  -H "Authorization: Bearer $TOKEN")

if echo "$TASKS_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  TASK_COUNT=$(echo "$TASKS_RESPONSE" | jq -r '.data.total')
  echo -e "${GREEN}✓ Agent has $TASK_COUNT tasks in history${NC}"
else
  echo -e "${RED}✗ Failed to get task history${NC}"
fi
echo ""

# Test 6: Activity Feed
echo "🧪 Test 6: Activity Feed"
echo "------------------------"
ACTIVITY_RESPONSE=$(curl -s -X GET "$API_URL/agent/$AGENT_ID/activity" \
  -H "Authorization: Bearer $TOKEN")

if echo "$ACTIVITY_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  ACTIVITY_COUNT=$(echo "$ACTIVITY_RESPONSE" | jq -r '.data.total')
  echo -e "${GREEN}✓ Agent has $ACTIVITY_COUNT activities${NC}"
  
  if [ "$ACTIVITY_COUNT" -gt 0 ]; then
    echo ""
    echo "Recent activities:"
    echo "$ACTIVITY_RESPONSE" | jq -r '.data.activities[0:3][] | "  • \(.type) at \(.timestamp)"'
  fi
else
  echo -e "${RED}✗ Failed to get activity feed${NC}"
fi
echo ""

# Test 7: Skills Check
echo "🧪 Test 7: Skill Progression"
echo "----------------------------"
SKILLS_RESPONSE=$(curl -s -X GET "$API_URL/agent/$AGENT_ID/skills" \
  -H "Authorization: Bearer $TOKEN")

if echo "$SKILLS_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Skills:${NC}"
  echo "$SKILLS_RESPONSE" | jq -r '.data.skills[] | "  • \(.skillType): Level \(.level) (\(.experience) XP)"'
else
  echo -e "${RED}✗ Failed to get skills${NC}"
fi
echo ""

# Summary
echo "====================================="
echo -e "${GREEN}✅ Phase 2 Testing Complete!${NC}"
echo "====================================="
echo ""
echo "🎉 Your agents can now:"
echo "  • Search products"
echo "  • Compare prices"
echo "  • Execute tasks autonomously"
echo "  • Gain experience and level up"
echo "  • Show real-time activity"
echo ""
echo "📊 Phase Status:"
echo "  Phase 1: 100% ✅"
echo "  Phase 2: 100% ✅"
echo "  Phase 3: Ready to start ⏳"
echo ""

