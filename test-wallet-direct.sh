#!/bin/bash

echo "🧪 Direct Wallet Creation Test"
echo "=============================="
echo ""

read -p "Paste your JWT token: " TOKEN

# Clean token
TOKEN=$(echo "$TOKEN" | sed 's/.*"token":"\([^"]*\)".*/\1/')

echo ""
echo "Testing wallet creation for NOT AI..."
echo ""

# Test with full error output
curl -v -X POST http://localhost:4000/agent/wallet/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"agentId": "def3e48c-e86e-4162-80e7-6cd989b5c67b"}' 2>&1 | grep -A 20 "< HTTP"

echo ""
echo ""
echo "Check your API terminal for any error logs!"

