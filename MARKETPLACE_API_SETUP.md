# 🛒 Marketplace API Setup Guide

This guide will help you set up **real marketplace API integrations** for SUBRA agents.

---

## 📋 Overview

We'll integrate:
1. **Amazon Product Advertising API** - Real-time product search
2. **eBay Finding API** - Auction and fixed-price items
3. **Optional:** Walmart Open API, Shopify API

---

## 🔐 1. Amazon Product Advertising API

### Step 1: Sign Up for Amazon Associates
1. Go to: https://affiliate-program.amazon.com/
2. Sign in with your Amazon account
3. Complete the application (you need a website or app)
4. **Tip:** For testing, you can use `http://localhost:3000` as your website

### Step 2: Get Product Advertising API Access
1. Once approved, go to: https://webservices.amazon.com/paapi5/documentation/
2. Click **"Register for API Access"**
3. You'll receive:
   - **Access Key ID**
   - **Secret Access Key**
   - **Associate Tag** (from Associates program)

### Step 3: Choose Your Region
- **US:** `webservices.amazon.com`
- **UK:** `webservices.amazon.co.uk`
- **Canada:** `webservices.amazon.ca`

### API Limits:
- **Free Tier:** 8,640 requests/day (1 request every 10 seconds)
- **Paid:** Up to 1 request/second (86,400/day)

---

## 🔐 2. eBay Finding API

### Step 1: Create eBay Developer Account
1. Go to: https://developer.ebay.com/
2. Click **"Register"** and create an account
3. Verify your email

### Step 2: Create an App
1. Go to: https://developer.ebay.com/my/keys
2. Click **"Create a Keyset"**
3. Choose **"Production"** or **"Sandbox"** (start with Sandbox)
4. You'll receive:
   - **App ID (Client ID)**
   - **Cert ID (Client Secret)**

### Step 3: Get App ID for Finding API
- The **App ID** is all you need for the Finding API (no OAuth required)

### API Limits:
- **Free Tier:** 5,000 calls/day
- **Commercial:** Up to 1,000,000 calls/day

---

## 🔐 3. Walmart Open API (Optional)

### Step 1: Apply for Access
1. Go to: https://developer.walmart.com/
2. Sign up and apply for API access
3. Submit your use case

### Note:
- Walmart API requires **approval** and is primarily for sellers
- May take a few days to get approved

---

## 🔐 4. Shopify Storefront API (Optional)

### Step 1: Create Shopify Partner Account
1. Go to: https://partners.shopify.com/
2. Sign up as a partner (free)
3. Create a development store

### Step 2: Generate API Keys
1. In your partner dashboard, create an app
2. Enable **Storefront API**
3. Get your **Storefront Access Token**

---

## ⚙️ 5. Add API Keys to SUBRA

Once you have your API keys, add them to `.env`:

```bash
# Amazon Product Advertising API
AMAZON_ACCESS_KEY_ID=your_access_key_here
AMAZON_SECRET_ACCESS_KEY=your_secret_key_here
AMAZON_ASSOCIATE_TAG=your_associate_tag_here
AMAZON_REGION=us-east-1

# eBay Finding API
EBAY_APP_ID=your_app_id_here
EBAY_CERT_ID=your_cert_id_here

# Walmart Open API (Optional)
WALMART_API_KEY=your_api_key_here

# Shopify Storefront API (Optional)
SHOPIFY_STOREFRONT_TOKEN=your_token_here
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
```

---

## 🧪 6. Testing Your Setup

Run the test script:
```bash
cd apps/api
pnpm run test:apis
```

This will:
- ✅ Test Amazon API connection
- ✅ Test eBay API connection
- ✅ Verify API limits
- ✅ Return sample products

---

## 💡 7. API Cost Comparison

| API | Free Tier | Paid Tier | Best For |
|-----|-----------|-----------|----------|
| **Amazon PA-API** | 8,640 req/day | $0.0004/req | Wide product selection |
| **eBay Finding API** | 5,000 req/day | Custom pricing | Auctions & deals |
| **Walmart API** | Varies | Varies | Walmart products |
| **Shopify** | Free for partners | Free | Custom stores |

---

## 🚀 8. Alternative: RapidAPI Marketplaces

If you want a **unified API** for multiple marketplaces:

### RapidAPI Marketplace APIs:
1. Go to: https://rapidapi.com/
2. Search for marketplace APIs:
   - Real-Time Amazon Data
   - eBay Product Search
   - Walmart Product Lookup

### Benefits:
- ✅ Single API key for multiple marketplaces
- ✅ Pay-as-you-go pricing
- ✅ No approval process
- ✅ Easy to test

---

## 📚 9. Documentation Links

- **Amazon PA-API 5.0:** https://webservices.amazon.com/paapi5/documentation/
- **eBay Finding API:** https://developer.ebay.com/DevZone/finding/Concepts/FindingAPIGuide.html
- **Walmart API:** https://developer.walmart.com/doc/us/us-mp/us-mp-items/
- **Shopify Storefront API:** https://shopify.dev/docs/storefront-api

---

## ⚠️ 10. Important Notes

1. **Amazon requires an Associate account** with active commissions
2. **eBay has rate limits** - cache results when possible
3. **Walmart API** is primarily for sellers, not general search
4. **Always cache API responses** to reduce costs
5. **Use Redis** to store frequently accessed data

---

## 🎯 Next Steps

1. ✅ Sign up for APIs (start with Amazon & eBay)
2. ✅ Get your API keys
3. ✅ Add keys to `.env`
4. ✅ Test the integration
5. ✅ Watch your agents use real data! 🚀

---

**Need help?** Check the `TROUBLESHOOTING.md` guide or ask in the chat!

