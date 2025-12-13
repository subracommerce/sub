#!/bin/bash

# 🧪 Test Marketplace API Integration
# This script tests if Amazon and eBay APIs are working

echo "=========================================="
echo "🧪 Testing Marketplace API Integration"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
  echo "❌ .env file not found!"
  echo "   Create .env from .env.template or see ENV_SETUP.md"
  exit 1
fi

# Load .env
export $(grep -v '^#' .env | xargs)

echo "📋 Checking API configuration..."
echo ""

# Check Amazon API
if [ -n "$AMAZON_ACCESS_KEY_ID" ] && [ -n "$AMAZON_SECRET_ACCESS_KEY" ] && [ -n "$AMAZON_ASSOCIATE_TAG" ]; then
  echo "✅ Amazon PA-API configured"
  AMAZON_CONFIGURED=true
else
  echo "⚠️  Amazon PA-API not configured (will use mock data)"
  AMAZON_CONFIGURED=false
fi

# Check eBay API
if [ -n "$EBAY_APP_ID" ]; then
  echo "✅ eBay Finding API configured"
  EBAY_CONFIGURED=true
else
  echo "⚠️  eBay Finding API not configured (will use mock data)"
  EBAY_CONFIGURED=false
fi

echo ""
echo "=========================================="
echo "🚀 Starting API test..."
echo "=========================================="
echo ""

# Make sure API server is running
API_HEALTH=$(curl -s http://localhost:4000/health 2>/dev/null)
if [ $? -ne 0 ]; then
  echo "❌ API server not running on port 4000"
  echo "   Start it with: cd apps/api && pnpm dev"
  exit 1
fi

echo "✅ API server is running"
echo ""

# Test search endpoint
echo "🔍 Testing product search..."
echo "   Query: 'laptop'"
echo ""

SEARCH_RESPONSE=$(curl -s -X POST http://localhost:4000/marketplace/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "laptop",
    "marketplaces": ["amazon", "ebay"],
    "maxResults": 5
  }')

# Check if response is valid
if echo "$SEARCH_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  TOTAL_RESULTS=$(echo "$SEARCH_RESPONSE" | jq -r '.data.totalResults')
  SEARCH_TIME=$(echo "$SEARCH_RESPONSE" | jq -r '.data.searchTime')
  
  echo "✅ Search API is working!"
  echo "   Found: $TOTAL_RESULTS products"
  echo "   Time: ${SEARCH_TIME}ms"
  echo ""
  
  # Show first 2 products
  echo "📦 Sample products:"
  echo "$SEARCH_RESPONSE" | jq -r '.data.products[0:2][] | "   • \(.name) - $\(.price) at \(.marketplace)"'
  echo ""
  
  # Check if using real data or mock data
  FIRST_PRODUCT_ID=$(echo "$SEARCH_RESPONSE" | jq -r '.data.products[0].id')
  if [[ "$FIRST_PRODUCT_ID" == "amz-001" ]] || [[ "$FIRST_PRODUCT_ID" == "ebay-001" ]]; then
    echo "⚠️  Using MOCK DATA (API keys not configured or failed)"
    echo "   Add API keys to .env to get real product data"
    echo "   See: MARKETPLACE_API_SETUP.md"
  else
    echo "🎉 Using REAL DATA from marketplace APIs!"
  fi
else
  echo "❌ Search API failed"
  echo "Response: $SEARCH_RESPONSE"
  exit 1
fi

echo ""
echo "=========================================="
echo "✅ API Integration Test Complete!"
echo "=========================================="
echo ""

if [ "$AMAZON_CONFIGURED" = false ] && [ "$EBAY_CONFIGURED" = false ]; then
  echo "💡 Next Steps:"
  echo "   1. Sign up for Amazon PA-API: https://webservices.amazon.com/paapi5/"
  echo "   2. Sign up for eBay API: https://developer.ebay.com/"
  echo "   3. Add API keys to .env"
  echo "   4. Restart API server"
  echo "   5. Run this test again"
  echo ""
  echo "📚 See MARKETPLACE_API_SETUP.md for detailed instructions"
fi

echo ""

