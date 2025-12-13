# 🧪 Phase 2 Testing Guide

## 🎯 **What We're Testing:**

Phase 2 includes:
1. ✅ Marketplace Search (Amazon, eBay)
2. ✅ Price Comparison
3. ✅ Agent Task Execution
4. ✅ Real-time Activity Feed
5. ✅ Skill Progression (XP & Level-Up)

---

## 🚀 **Prerequisites:**

### **1. Restart API Server** (Load New Routes)
```bash
# Terminal 1: Stop API (Ctrl+C), then:
cd /Users/kingchief/Documents/SUB/apps/api
pnpm dev
```

### **2. Get Your Token**
1. Sign in at http://localhost:3000/auth/wallet
2. Open browser console (F12)
3. Type: `localStorage.getItem('subra-auth')`
4. Copy the token (after `"token":"`)

### **3. Get Your Agent ID**
```bash
# Replace YOUR_TOKEN
curl -X GET http://localhost:4000/agent \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Copy an agent ID (Rick or NOT AI).

---

## 🧪 **Test 1: Marketplace Search**

### **Search for Products:**
```bash
curl -X POST http://localhost:4000/marketplace/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "query": "gaming laptop",
    "marketplaces": ["amazon", "ebay"],
    "maxResults": 10
  }'
```

**Expected Result:**
```json
{
  "success": true,
  "data": {
    "query": "gaming laptop",
    "products": [
      {
        "id": "amz-001",
        "name": "gaming laptop - Premium Edition",
        "price": 99.99,
        "marketplace": "amazon",
        "rating": 4.5,
        "inStock": true
      }
      // ... more products
    ],
    "totalResults": 5,
    "searchTime": 2,
    "marketplaces": ["amazon", "ebay"]
  }
}
```

✅ **Pass:** Returns products with prices, ratings, marketplaces

---

## 🧪 **Test 2: Price Comparison**

### **Compare Prices:**
```bash
curl -X POST http://localhost:4000/marketplace/compare \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "productName": "iPhone 15 Pro",
    "marketplaces": ["amazon", "ebay"]
  }'
```

**Expected Result:**
```json
{
  "success": true,
  "data": {
    "productName": "iPhone 15 Pro",
    "bestPrice": 49.99,
    "bestMarketplace": "amazon",
    "priceRange": {
      "min": 49.99,
      "max": 149.99
    },
    "savings": 100.00,
    "products": [...]
  }
}
```

✅ **Pass:** Shows best price, savings, price range

---

## 🧪 **Test 3: Agent Search Task**

### **Agent Searches for Products:**
```bash
# Replace AGENT_ID and TOKEN
curl -X POST http://localhost:4000/agent/task \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "agentId": "YOUR_AGENT_ID",
    "type": "search",
    "input": {
      "query": "wireless headphones",
      "marketplaces": ["amazon", "ebay"]
    }
  }'
```

**Expected Result:**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "task-uuid",
      "type": "search",
      "status": "completed"
    },
    "result": {
      "success": true,
      "data": {
        "query": "wireless headphones",
        "products": [...],
        "totalResults": 5
      },
      "experienceGained": 20
    }
  }
}
```

✅ **Pass:** Agent completes task and gains XP!

---

## 🧪 **Test 4: Agent Compare Task**

### **Agent Compares Prices:**
```bash
curl -X POST http://localhost:4000/agent/task \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "agentId": "YOUR_AGENT_ID",
    "type": "compare",
    "input": {
      "productName": "AirPods Pro",
      "marketplaces": ["amazon", "ebay"]
    }
  }'
```

**Expected Result:**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "task-uuid",
      "type": "compare",
      "status": "completed"
    },
    "result": {
      "success": true,
      "data": {
        "bestPrice": 79.99,
        "bestMarketplace": "ebay",
        "savings": 70.00
      },
      "experienceGained": 30
    }
  }
}
```

✅ **Pass:** Agent finds best deal and gains XP!

---

## 🧪 **Test 5: Task History**

### **View Agent's Tasks:**
```bash
curl -X GET http://localhost:4000/agent/YOUR_AGENT_ID/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Result:**
```json
{
  "success": true,
  "data": {
    "agentId": "...",
    "agentName": "Rick",
    "tasks": [
      {
        "id": "task-uuid",
        "type": "search",
        "status": "completed",
        "input": {...},
        "output": {...},
        "createdAt": "...",
        "completedAt": "..."
      }
    ],
    "total": 2
  }
}
```

✅ **Pass:** Shows all completed tasks

---

## 🧪 **Test 6: Activity Feed**

### **View Real-Time Activity:**
```bash
curl -X GET http://localhost:4000/agent/YOUR_AGENT_ID/activity \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Result:**
```json
{
  "success": true,
  "data": {
    "agentId": "...",
    "agentName": "Rick",
    "activities": [
      {
        "agentId": "...",
        "type": "search_completed",
        "data": {
          "query": "wireless headphones",
          "productsFound": 5,
          "experienceGained": 20
        },
        "timestamp": "2025-12-13T..."
      },
      {
        "agentId": "...",
        "type": "compare_completed",
        "data": {
          "productName": "AirPods Pro",
          "bestPrice": 79.99,
          "savings": 70.00,
          "experienceGained": 30
        },
        "timestamp": "2025-12-13T..."
      }
    ],
    "total": 2
  }
}
```

✅ **Pass:** Shows real-time agent activity!

---

## 🧪 **Test 7: Skill Level Up**

### **Check Skills After Tasks:**
```bash
curl -X GET http://localhost:4000/agent/YOUR_AGENT_ID/skills \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Result:**
```json
{
  "success": true,
  "data": {
    "agentId": "...",
    "agentName": "Rick",
    "skills": [
      {
        "id": "...",
        "skillType": "search",
        "level": 1,
        "experience": 20,
        "isActive": true
      },
      {
        "id": "...",
        "skillType": "compare",
        "level": 1,
        "experience": 30,
        "isActive": true
      }
    ]
  }
}
```

**After 100 XP (5 search tasks):**
```json
{
  "skillType": "search",
  "level": 2,  // ← LEVELED UP!
  "experience": 100
}
```

✅ **Pass:** Skills gain XP and level up!

---

## 🧪 **Test 8: Supported Marketplaces**

### **List All Marketplaces:**
```bash
curl -X GET http://localhost:4000/marketplace/supported \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Result:**
```json
{
  "success": true,
  "data": {
    "marketplaces": [
      {
        "id": "amazon",
        "name": "Amazon",
        "icon": "🛒",
        "supported": true,
        "features": ["search", "compare"]
      },
      {
        "id": "ebay",
        "name": "eBay",
        "icon": "🏪",
        "supported": true,
        "features": ["search", "compare"]
      },
      {
        "id": "walmart",
        "name": "Walmart",
        "icon": "🏬",
        "supported": false,
        "comingSoon": true
      }
    ]
  }
}
```

✅ **Pass:** Shows available marketplaces

---

## 📊 **Phase 2 Checklist:**

- [ ] Marketplace search works
- [ ] Price comparison works
- [ ] Agent can execute search tasks
- [ ] Agent can execute compare tasks
- [ ] Tasks show in history
- [ ] Activity feed shows events
- [ ] Skills gain XP from tasks
- [ ] Skills level up at 100 XP
- [ ] Supported marketplaces endpoint works

---

## 🎉 **When All Tests Pass:**

Phase 2 is **COMPLETE**! 🚀

Your agents can now:
- ✅ Search products autonomously
- ✅ Compare prices automatically
- ✅ Find best deals
- ✅ Gain experience and level up
- ✅ Show real-time activity

---

## 🚀 **Next: Phase 3 (ZK Proofs)**

Once Phase 2 tests pass, we'll add:
- Zero-knowledge spend proofs
- ZK receipt generation
- Privacy-preserving transactions
- On-chain verification

Let's test Phase 2 first! 🧪

