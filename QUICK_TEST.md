# 🧪 Quick Test Guide - Marketplace APIs

## 🚀 Test Without API Keys (Mock Data)

### Step 1: Start Servers
```bash
# Terminal 1 - API Server
cd /Users/kingchief/Documents/SUB/apps/api
export DATABASE_URL="postgresql://kingchief@localhost:5432/subra"
pnpm dev

# Terminal 2 - Web Server
cd /Users/kingchief/Documents/SUB/apps/web
pnpm dev
```

### Step 2: Test in Browser
1. Go to http://localhost:3000
2. Connect wallet or sign in
3. Go to dashboard
4. Click on any agent → "Start Chat"
5. Try these commands:
   - `"search for gaming laptops"`
   - `"compare iphone 15 pro prices"`

**Result:** You'll see mock data (5 products). This confirms the system works!

---

## 🔐 Test With Real API Keys

### Step 1: Get Amazon API Keys (~10 min)
1. Go to: https://affiliate-program.amazon.com/
2. Sign up for Amazon Associates
3. Once approved, go to: https://webservices.amazon.com/paapi5/documentation/
4. Register for Product Advertising API
5. Save your:
   - Access Key ID
   - Secret Access Key
   - Associate Tag

### Step 2: Get eBay API Key (~5 min)
1. Go to: https://developer.ebay.com/
2. Create account and verify email
3. Go to: https://developer.ebay.com/my/keys
4. Create a "Sandbox" keyset (for testing)
5. Save your App ID (Client ID)

### Step 3: Add to .env
```bash
# In /Users/kingchief/Documents/SUB/.env
AMAZON_ACCESS_KEY_ID="your_access_key"
AMAZON_SECRET_ACCESS_KEY="your_secret_key"
AMAZON_ASSOCIATE_TAG="your_tag"
EBAY_APP_ID="your_app_id"
```

### Step 4: Restart API & Test
```bash
# Restart API server (Ctrl+C then restart)
cd /Users/kingchief/Documents/SUB/apps/api
pnpm dev

# Look for these logs:
# ✅ Amazon PA-API configured
# ✅ eBay Finding API configured

# Now chat with your agent
# You'll see REAL products from Amazon & eBay!
```

---

## ✅ Verification

### With Mock Data:
- Product names include query in title
- IDs are like "amz-001", "ebay-001"
- Prices are rounded ($99.99, $79.99)

### With Real APIs:
- Product names are actual product titles
- IDs are ASINs (B08N5WRWNW) or eBay IDs
- Prices are real market prices
- Real product images and ratings

---

## 🎯 Next Step

Once tested, we'll build **Solana Pay Integration** so agents can make real purchases! 🚀

