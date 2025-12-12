#!/bin/bash

# SUBRA Platform Testing Script
# Run this to test all major features

API_URL="http://localhost:4000"
EMAIL="test-$(date +%s)@subra.com"
PASSWORD="Test1234!"

echo "🚀 SUBRA Platform Testing"
echo "=========================="
echo ""

# Test 1: Health Check
echo "1️⃣ Testing API Health..."
HEALTH=$(curl -s $API_URL/health)
echo "✅ Health: $HEALTH"
echo ""

# Test 2: Register User
echo "2️⃣ Registering user: $EMAIL"
REGISTER_RESPONSE=$(curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.token')
USER_ID=$(echo $REGISTER_RESPONSE | jq -r '.data.user.id')

if [ "$TOKEN" != "null" ]; then
  echo "✅ User registered! ID: $USER_ID"
else
  echo "❌ Registration failed"
  exit 1
fi
echo ""

# Test 3: Get User Profile
echo "3️⃣ Getting user profile..."
curl -s $API_URL/user/me \
  -H "Authorization: Bearer $TOKEN" | jq '.data | {id, email}'
echo ""

# Test 4: Create Explorer Agent
echo "4️⃣ Creating Explorer Agent..."
AGENT_RESPONSE=$(curl -s -X POST $API_URL/agent \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Explorer","type":"explorer","description":"Product search agent"}')

AGENT_ID=$(echo $AGENT_RESPONSE | jq -r '.data.id')
echo "✅ Agent created! ID: $AGENT_ID"
echo ""

# Test 5: Create Negotiator Agent
echo "5️⃣ Creating Negotiator Agent..."
curl -s -X POST $API_URL/agent \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Price Negotiator","type":"negotiator","description":"Price comparison"}' | jq '.data | {id, name, type}'
echo ""

# Test 6: List All Agents
echo "6️⃣ Listing all agents..."
curl -s $API_URL/agent \
  -H "Authorization: Bearer $TOKEN" | jq '.data[] | {name, type, isActive}'
echo ""

# Test 7: Create Search Task
echo "7️⃣ Creating search task..."
TASK_RESPONSE=$(curl -s -X POST $API_URL/task \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"agentId\":\"$AGENT_ID\",\"type\":\"search\",\"input\":{\"query\":\"iPhone 15 Pro\",\"limit\":5}}")

TASK_ID=$(echo $TASK_RESPONSE | jq -r '.data.id')
echo "✅ Task created! ID: $TASK_ID"
echo "   Status: $(echo $TASK_RESPONSE | jq -r '.data.status')"
echo ""

# Test 8: Check Task Status
echo "8️⃣ Checking task status (waiting 5s for processing)..."
sleep 5
curl -s $API_URL/task/$TASK_ID \
  -H "Authorization: Bearer $TOKEN" | jq '.data | {id, status, type}'
echo ""

# Test 9: List All Tasks
echo "9️⃣ Listing all tasks..."
curl -s $API_URL/task \
  -H "Authorization: Bearer $TOKEN" | jq '.data[] | {type, status, createdAt}'
echo ""

# Test 10: Transaction Stats
echo "🔟 Getting transaction stats..."
curl -s $API_URL/transaction/stats/summary \
  -H "Authorization: Bearer $TOKEN" | jq '.data'
echo ""

echo "=========================="
echo "✅ All tests completed!"
echo ""
echo "📊 Summary:"
echo "  - User ID: $USER_ID"
echo "  - Email: $EMAIL"
echo "  - Agent ID: $AGENT_ID"
echo "  - Task ID: $TASK_ID"
echo "  - Token: ${TOKEN:0:50}..."
echo ""
echo "🌐 Test in browser: http://localhost:3000"

