# 💳 Solana Pay Integration Guide

## 🎉 Autonomous Agent Purchases with Solana Pay

Your AI agents can now make **real purchases** using SOL and USDC on Solana!

---

## ✅ What's Been Built

### 1. **Solana Pay Service** (`solana-pay.ts`)
Complete payment processing system:
- ✅ SOL payments
- ✅ USDC (SPL Token) payments
- ✅ Payment creation and execution
- ✅ Transaction verification
- ✅ Balance checking
- ✅ Fee estimation
- ✅ Payment URL generation (QR codes)

### 2. **Purchase Execution** (`agent-executor.ts`)
Agents can autonomously purchase products:
- ✅ Check balance before purchase
- ✅ Execute Solana transactions
- ✅ Record transactions in database
- ✅ Earn XP for successful purchases
- ✅ Real-time activity feed
- ✅ Error handling & retries

### 3. **API Routes** (`agent-task.ts`)
New "purchase" task type:
- ✅ `/agent/task` endpoint supports purchases
- ✅ Authenticated and validated
- ✅ Returns transaction signature
- ✅ Tracks transaction status

---

## 🚀 How It Works

### Step 1: Agent Finds Best Deal
```bash
User: "search for gaming laptop"
Agent: ✅ Searches Amazon & eBay
       ✅ Finds best price: $999 at Amazon
```

### Step 2: User Approves Purchase
```bash
User: "buy the cheapest one"
Agent: 🤔 Checking my wallet...
       💰 Balance: 1.5 SOL (≈ $150)
       ❌ Insufficient funds
       💡 Suggestion: Fund wallet or use USDC
```

### Step 3: Agent Executes Purchase
```bash
[After funding agent wallet with 1,000 USDC]

User: "buy it now"
Agent: ✅ Purchasing "Gaming Laptop Pro"
       💳 Payment: 999 USDC → Merchant
       📝 TX: 5x7...abc (confirmed)
       🎉 Purchase complete! +25 XP
```

---

## 💰 Funding Agent Wallets

### Method 1: Direct Transfer (Recommended)
```bash
# Get agent's wallet address
# From dashboard or API: /agent/:id/wallet

# Send SOL or USDC to agent's address
solana transfer <AGENT_ADDRESS> 1 --allow-unfunded-recipient

# Or use Phantom/Solflare to send USDC
```

### Method 2: Platform Deposit (Future)
```typescript
// Future: Deposit from user wallet to agent wallet
POST /agent/:id/wallet/deposit
{
  "amount": 1000,
  "currency": "USDC"
}
```

---

## 🧪 Testing Purchase Flow

### Test 1: Check Agent Balance
```bash
curl http://localhost:4000/agent/:agentId/wallet \
  -H "Authorization: Bearer $TOKEN"

# Response:
{
  "success": true,
  "data": {
    "agentId": "...",
    "walletAddress": "5x7...",
    "balances": {
      "SOL": 0.5,
      "USDC": 1000
    }
  }
}
```

### Test 2: Execute Purchase
```bash
curl -X POST http://localhost:4000/agent/task \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "agentId": "your-agent-id",
    "type": "purchase",
    "input": {
      "productId": "B08N5WRWNW",
      "productName": "Gaming Laptop Pro",
      "price": 50,
      "currency": "USDC",
      "merchant": "Merchant_Wallet_Address_Here"
    }
  }'

# Response:
{
  "success": true,
  "data": {
    "task": {
      "id": "...",
      "type": "purchase",
      "status": "completed"
    },
    "result": {
      "success": true,
      "data": {
        "productName": "Gaming Laptop Pro",
        "price": 50,
        "currency": "USDC",
        "signature": "5x7KjWm...",
        "transactionId": "...",
        "timestamp": "2025-12-13T..."
      },
      "experienceGained": 25
    }
  }
}
```

### Test 3: Verify Transaction
```bash
# Check on Solana Explorer
https://explorer.solana.com/tx/<SIGNATURE>?cluster=devnet

# Or via API
curl http://localhost:4000/transaction/<TX_ID> \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔐 Security Features

### 1. **Encrypted Private Keys**
- Agent private keys are encrypted with AES-256
- Stored securely in database
- Only decrypted during transactions

### 2. **Balance Verification**
- Always checks balance before purchase
- Includes buffer for transaction fees
- Prevents failed transactions

### 3. **Transaction Verification**
- All transactions are verified on-chain
- Signature validation
- Amount and recipient checks

### 4. **User Authorization**
- Only authenticated users can trigger purchases
- Agent ownership validation
- Rate limiting on expensive operations

---

## 🎯 Supported Currencies

### 1. **SOL** (Native Solana Token)
- Fast and cheap (0.000005 SOL per tx)
- Direct transfers
- No token accounts needed

### 2. **USDC** (Stablecoin)
- 1 USDC = $1 USD
- SPL Token (6 decimals)
- Requires token accounts
- Mint: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`

### Future:
- **USDT** (Tether)
- **Custom SPL Tokens**
- **Multi-chain support** (ETH, BTC via bridges)

---

## 💡 Use Cases

### 1. **Automated Shopping**
```
Agent searches, compares, and purchases products
autonomously based on user preferences
```

### 2. **Dollar-Cost Averaging (DCA)**
```
Agent automatically buys products when prices drop
below a threshold
```

### 3. **Subscription Payments**
```
Agent handles recurring payments for services
```

### 4. **Agent-to-Agent Commerce**
```
Agents buy/sell from each other
Dropshipping automation
```

### 5. **Bulk Purchasing**
```
Multiple agents coordinate to get bulk discounts
```

---

## 🔧 Configuration

### Environment Variables
```bash
# .env
SOLANA_RPC_URL="https://api.devnet.solana.com"  # or mainnet
USDC_MINT_ADDRESS="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
```

### Network Selection
- **Devnet:** Testing (free SOL from faucet)
- **Testnet:** Pre-production testing
- **Mainnet:** Production (real money!)

---

## 📊 Transaction Database Schema

All purchases are stored in the `transactions` table:

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  userId UUID NOT NULL,
  agentId UUID,
  type VARCHAR(50),  -- 'purchase'
  status VARCHAR(50), -- 'completed', 'failed'
  amount DECIMAL(18, 6),
  currency VARCHAR(10), -- 'SOL', 'USDC'
  fromAddress VARCHAR(255), -- Agent wallet
  toAddress VARCHAR(255),   -- Merchant wallet
  txHash VARCHAR(255),      -- Solana signature
  metadata JSONB,           -- Product details
  createdAt TIMESTAMP
);
```

---

## 🚀 Next Steps

### Phase 2 Remaining:
1. ✅ Solana Pay integration - DONE
2. 🔄 Price tracking system
3. 🔄 Elasticsearch search
4. 🔄 Negotiation engine
5. 🔄 Checkout automation

### Phase 3 (Coming Next):
1. ZK Proofs for transactions
2. Privacy-preserving payments
3. On-chain proof verification

---

## 🎉 Try It Now!

1. **Fund an agent wallet**
   ```bash
   solana airdrop 1 <AGENT_ADDRESS> --url devnet
   ```

2. **Make a test purchase**
   ```bash
   # Chat with your agent
   User: "search for test product"
   Agent: "Found 3 products..."
   
   User: "buy the first one"
   Agent: "Purchasing... Done! TX: 5x7..."
   ```

3. **Check transaction**
   ```bash
   # View on Solana Explorer
   https://explorer.solana.com/tx/<SIGNATURE>?cluster=devnet
   ```

---

## 🐛 Troubleshooting

### Error: "Insufficient balance"
**Fix:** Fund agent wallet with SOL or USDC

### Error: "Wallet not configured"
**Fix:** Create agent wallet via `/agent/:id/wallet/create`

### Error: "Transaction simulation failed"
**Fix:** Check RPC URL, network congestion, or try again

### Error: "Token account not found"
**Fix:** Create USDC token account for agent first

---

## 📚 Learn More

- **Solana Pay Docs:** https://docs.solanapay.com/
- **Solana Web3.js:** https://solana-labs.github.io/solana-web3.js/
- **SPL Token:** https://spl.solana.com/token

---

**Your agents are now ready to shop autonomously!** 🎉🛍️

