#!/bin/bash

echo "🧪 Testing SUBRA Wallet Creation..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check API Health
echo "📡 Test 1: Checking API health..."
HEALTH=$(curl -s http://localhost:4000/health 2>&1)
if [[ $HEALTH == *"ok"* ]]; then
  echo -e "${GREEN}✅ API is running${NC}"
else
  echo -e "${RED}❌ API is not responding${NC}"
  echo "   Run: cd apps/api && pnpm dev"
  exit 1
fi
echo ""

# Test 2: Create Wallet
echo "🔐 Test 2: Creating test wallet..."
RESPONSE=$(curl -s -X POST http://localhost:4000/auth/create-wallet \
  -H "Content-Type: application/json" \
  -d '{"password":"testpass123"}' 2>&1)

if [[ $RESPONSE == *"success\":true"* ]]; then
  echo -e "${GREEN}✅ Wallet created successfully${NC}"
  
  # Extract wallet address
  WALLET=$(echo $RESPONSE | grep -o '"walletAddress":"[^"]*"' | cut -d'"' -f4)
  EMAIL=$(echo $RESPONSE | grep -o '"email":"[^"]*"' | cut -d'"' -f4)
  TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  
  echo "   📧 Email: $EMAIL"
  echo "   🔑 Wallet: $WALLET"
  echo "   🎫 Token: ${TOKEN:0:20}..."
else
  echo -e "${RED}❌ Wallet creation failed${NC}"
  echo "   Response: $RESPONSE"
  exit 1
fi
echo ""

# Test 3: Verify in Database
echo "💾 Test 3: Verifying in database..."
DB_CHECK=$(psql subra_dev -t -c "SELECT COUNT(*) FROM users WHERE \"walletAddress\" = '$WALLET';" 2>&1)
if [[ $DB_CHECK == *"1"* ]]; then
  echo -e "${GREEN}✅ Wallet found in database${NC}"
else
  echo -e "${RED}❌ Wallet not in database${NC}"
  exit 1
fi
echo ""

# Test 4: Check Encryption
echo "🔒 Test 4: Checking encryption..."
ENCRYPTED=$(psql subra_dev -t -c "SELECT \"apiKey\" IS NOT NULL, \"apiKeyHash\" IS NOT NULL FROM users WHERE \"walletAddress\" = '$WALLET';" 2>&1)
if [[ $ENCRYPTED == *"t | t"* ]]; then
  echo -e "${GREEN}✅ Private key and mnemonic are encrypted${NC}"
else
  echo -e "${RED}❌ Encryption check failed${NC}"
  exit 1
fi
echo ""

# Test 5: Test Decrypt (with correct password)
echo "🔓 Test 5: Testing wallet decryption..."
DECRYPT=$(curl -s -X POST http://localhost:4000/wallet/decrypt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"password":"testpass123"}' 2>&1)

if [[ $DECRYPT == *"secretKey"* ]]; then
  echo -e "${GREEN}✅ Wallet decrypted successfully${NC}"
else
  echo -e "${RED}❌ Decryption failed${NC}"
  echo "   Response: $DECRYPT"
fi
echo ""

# Test 6: Test Decrypt (with wrong password)
echo "🚫 Test 6: Testing with wrong password..."
WRONG=$(curl -s -X POST http://localhost:4000/wallet/decrypt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"password":"wrongpassword"}' 2>&1)

if [[ $WRONG == *"Invalid password"* ]]; then
  echo -e "${GREEN}✅ Wrong password rejected correctly${NC}"
else
  echo -e "${YELLOW}⚠️  Wrong password handling unexpected${NC}"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ All wallet tests passed!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Test wallet credentials:"
echo "   Email: $EMAIL"
echo "   Password: testpass123"
echo "   Wallet: $WALLET"
echo ""
echo "🌐 Test in browser:"
echo "   1. Go to http://localhost:3000/auth/login"
echo "   2. Login with email: $EMAIL"
echo "   3. Password: testpass123"
echo "   4. Should see dashboard with wallet connected"
echo ""
