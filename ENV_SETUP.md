# 🔐 Environment Variables Setup

This guide explains all environment variables needed for SUBRA.

---

## 📋 Required Variables

These variables are **required** for the platform to run:

```bash
# Database
DATABASE_URL="postgresql://user@localhost:5432/subra"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your_jwt_secret_here"

# API URL (for frontend to call backend)
NEXT_PUBLIC_API_URL="http://localhost:4000"

# Solana RPC (use QuickNode, Alchemy, or Helius)
SOLANA_RPC_URL="https://api.devnet.solana.com"  # or mainnet
```

---

## 🛒 Optional: Marketplace API Keys

Add these to enable **real product data** from marketplaces:

### Amazon Product Advertising API
```bash
AMAZON_ACCESS_KEY_ID="your_access_key_here"
AMAZON_SECRET_ACCESS_KEY="your_secret_key_here"
AMAZON_ASSOCIATE_TAG="your_associate_tag_here"
AMAZON_REGION="us-east-1"
```

**How to get:** See `MARKETPLACE_API_SETUP.md` → Amazon PA-API section

### eBay Finding API
```bash
EBAY_APP_ID="your_app_id_here"
EBAY_CERT_ID="your_cert_id_here"  # Optional, for OAuth
```

**How to get:** See `MARKETPLACE_API_SETUP.md` → eBay API section

### Walmart Open API (Optional)
```bash
WALMART_API_KEY="your_api_key_here"
```

**How to get:** See `MARKETPLACE_API_SETUP.md` → Walmart API section

---

## 🔐 Optional: Payment & Web3

### MoonPay (for fiat on-ramps)
```bash
MOONPAY_API_KEY="your_moonpay_key_here"
MOONPAY_SECRET_KEY="your_moonpay_secret_here"
```

### Ethereum RPC (if supporting Ethereum later)
```bash
ETHEREUM_RPC_URL="https://mainnet.infura.io/v3/your_key"
```

---

## 📝 Complete .env Example

Create a `.env` file in the root of your project:

```bash
# =====================================
# REQUIRED - DATABASE & REDIS
# =====================================
DATABASE_URL="postgresql://kingchief@localhost:5432/subra"
REDIS_URL="redis://localhost:6379"

# =====================================
# REQUIRED - AUTHENTICATION
# =====================================
JWT_SECRET="your_generated_jwt_secret_here_use_openssl_rand"

# =====================================
# REQUIRED - API & FRONTEND
# =====================================
NEXT_PUBLIC_API_URL="http://localhost:4000"

# =====================================
# REQUIRED - SOLANA
# =====================================
SOLANA_RPC_URL="https://api.devnet.solana.com"

# =====================================
# OPTIONAL - MARKETPLACE APIs
# =====================================
# Amazon Product Advertising API
AMAZON_ACCESS_KEY_ID=""
AMAZON_SECRET_ACCESS_KEY=""
AMAZON_ASSOCIATE_TAG=""
AMAZON_REGION="us-east-1"

# eBay Finding API
EBAY_APP_ID=""
EBAY_CERT_ID=""

# Walmart Open API
WALMART_API_KEY=""

# =====================================
# OPTIONAL - PAYMENTS
# =====================================
MOONPAY_API_KEY=""
MOONPAY_SECRET_KEY=""

# =====================================
# OPTIONAL - ETHEREUM (Future)
# =====================================
ETHEREUM_RPC_URL=""
```

---

## ⚠️ Important Notes

1. **Never commit .env to GitHub** (it's in `.gitignore`)
2. **Generate strong JWT_SECRET:** `openssl rand -base64 32`
3. **Start with devnet** for Solana, switch to mainnet for production
4. **Marketplace APIs are optional** - system works with mock data
5. **Add API keys one at a time** and test each integration

---

## 🧪 Testing Your Setup

After adding `.env`:

```bash
# 1. Restart API server
cd apps/api
pnpm dev

# 2. Check logs for:
#    ✅ Amazon PA-API configured (if you added keys)
#    ✅ eBay Finding API configured (if you added keys)
#    ⚠️  API credentials not found (if using mock data)

# 3. Test with your agent
#    Search for any product
#    Check logs to see which API was used
```

---

## 🚀 Quick Start (Minimal Setup)

**Minimum .env to run SUBRA:**

```bash
DATABASE_URL="postgresql://kingchief@localhost:5432/subra"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="$(openssl rand -base64 32)"
NEXT_PUBLIC_API_URL="http://localhost:4000"
SOLANA_RPC_URL="https://api.devnet.solana.com"
```

This will run SUBRA with **mock product data**. Add marketplace API keys later for real data!

---

## 📚 Next Steps

1. ✅ Create `.env` file with required variables
2. ✅ Start PostgreSQL and Redis
3. ✅ Run database migrations: `cd apps/api && pnpm prisma db push`
4. ✅ Start API: `cd apps/api && pnpm dev`
5. ✅ Start Web: `cd apps/web && pnpm dev`
6. 🎯 Add marketplace API keys (optional, for real data)

---

**Need help?** Check `TROUBLESHOOTING.md` or `MARKETPLACE_API_SETUP.md`!

