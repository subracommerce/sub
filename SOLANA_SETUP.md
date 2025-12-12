# 🟣 SUBRA Solana Setup Guide

## Overview

SUBRA is now **Solana-native**! This guide will help you set up the Solana development environment and deploy your AI commerce platform.

---

## 🎯 What Makes SUBRA Solana-Native?

### **1. Anchor Programs (Rust Smart Contracts)**
- ✅ **Agent Wallet Program**: Secure wallets for AI agents with spending limits
- ✅ **Marketplace Program**: Agent staking, reputation, and discovery
- ✅ **Spend Intent Program**: Secure transaction approval system
- ✅ **ZK Receipt Program**: Privacy-preserving purchase verification

### **2. Solana Wallet Integration**
- ✅ **Phantom Wallet**: Most popular Solana wallet
- ✅ **Solflare**: Full-featured Solana wallet
- ✅ **Torus**: Social login for Solana
- ✅ **Ledger**: Hardware wallet support

### **3. SPL Token Support**
- ✅ **USDC**: Stablecoin payments
- ✅ **SOL**: Native Solana payments
- ✅ **Custom Tokens**: Your own marketplace token

---

## 🚀 Quick Start

### **Prerequisites**

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Add to PATH
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Verify installations
solana --version
anchor --version
```

---

## 💰 Setup Solana Wallet

### **1. Create a New Wallet**

```bash
# Generate a new keypair
solana-keygen new --outfile ~/.config/solana/id.json

# View your public key
solana address

# Set to devnet
solana config set --url devnet

# Airdrop SOL for testing (devnet only)
solana airdrop 2
```

### **2. Get Your Wallet Ready**

```bash
# Check balance
solana balance

# If you need more SOL (devnet):
solana airdrop 2

# For mainnet, you'll need to buy SOL from an exchange
```

---

## 🏗️ Build & Deploy Anchor Programs

### **1. Build Programs**

```bash
cd /Users/kingchief/Documents/SUB/apps/solana-programs

# Build all programs
anchor build

# This creates:
# - target/deploy/*.so (compiled programs)
# - target/idl/*.json (program interfaces)
```

### **2. Deploy to Devnet**

```bash
# Make sure you're on devnet
solana config set --url devnet

# Deploy all programs
anchor deploy

# You'll see output like:
# Program Id: Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
```

### **3. Update Program IDs**

After deployment, update the program IDs in:

```typescript
// apps/solana-programs/Anchor.toml
[programs.devnet]
subra_agent_wallet = "YOUR_DEPLOYED_ID_HERE"
subra_marketplace = "YOUR_DEPLOYED_ID_HERE"
```

---

## 🧪 Test Your Programs

### **1. Run Anchor Tests**

```bash
cd apps/solana-programs

# Run all tests
anchor test

# Run specific test file
anchor test --skip-local-validator tests/agent-wallet.ts
```

### **2. Test with Solana Explorer**

Visit: https://explorer.solana.com/?cluster=devnet

Paste your program ID to view:
- Transactions
- Program accounts
- Events emitted

---

## 🌐 Frontend Integration

### **1. Environment Variables**

Create `apps/web/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Your deployed program IDs
NEXT_PUBLIC_AGENT_WALLET_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
NEXT_PUBLIC_MARKETPLACE_PROGRAM_ID=4aPvXHbZqKkZtidNqXUL7X3CfZ7FEfcYkg476zQ
```

### **2. Start Development Server**

```bash
cd apps/web
pnpm dev
```

Now visit `http://localhost:3000` and connect your Phantom wallet!

---

## 💎 Create Your First Agent Wallet

### **Using the Web UI:**

1. Go to `http://localhost:3000`
2. Click "Connect Wallet"
3. Select Phantom (or your preferred wallet)
4. Approve the connection
5. Go to Dashboard → Create Agent
6. Your agent wallet will be created on-chain!

### **Using CLI:**

```bash
# Create agent wallet
anchor run create-agent-wallet \
  --spending-limit 1000000000 \  # 1 SOL in lamports
  --daily-limit 5000000000       # 5 SOL in lamports
```

---

## 📊 Monitor Your Agents

### **View Agent Activity:**

```bash
# Get agent wallet info
solana account YOUR_AGENT_WALLET_ADDRESS

# View recent transactions
solana transaction-history YOUR_AGENT_WALLET_ADDRESS
```

### **Check Marketplace Listings:**

```bash
# Query marketplace
anchor run list-agents

# View agent reputation
anchor run get-agent-reputation --agent YOUR_AGENT_ID
```

---

## 🚀 Deploy to Mainnet

### **1. Switch to Mainnet**

```bash
solana config set --url mainnet-beta

# Make sure you have SOL for deployment (~5-10 SOL)
solana balance
```

### **2. Deploy Programs**

```bash
cd apps/solana-programs

# Build for mainnet
anchor build

# Deploy (costs SOL!)
anchor deploy

# IMPORTANT: Save your program IDs!
```

### **3. Update Frontend**

```bash
# apps/web/.env.production
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Or use a premium RPC (recommended):
# https://www.quicknode.com/
# https://www.helius.dev/
# https://www.alchemy.com/solana
```

---

## 💰 Monetization on Solana

### **Transaction Fees**

```rust
// In your marketplace program
pub fn execute_purchase(ctx: Context<ExecutePurchase>, amount: u64) -> Result<()> {
    // Take 1% platform fee
    let fee = amount / 100;
    let seller_amount = amount - fee;
    
    // Transfer to seller
    transfer_spl_tokens(ctx, seller_amount)?;
    
    // Transfer fee to treasury
    transfer_spl_tokens_to_treasury(ctx, fee)?;
    
    Ok(())
}
```

### **Staking Revenue**

- Agents stake tokens to list on marketplace
- You earn yield on staked tokens
- Premium tiers require higher stakes

### **Premium Features**

- Priority agent execution: 0.1 SOL/month
- Advanced analytics: 0.5 SOL/month
- API access: 1 SOL/month

---

## 🔐 Security Best Practices

### **1. Secure Your Keypairs**

```bash
# NEVER commit your keypair to git
echo "*.json" >> .gitignore
echo "id.json" >> .gitignore

# Use environment variables for production
export ANCHOR_WALLET=~/.config/solana/mainnet-keypair.json
```

### **2. Program Security**

```rust
// Always validate signers
require!(
    ctx.accounts.owner.key() == agent_wallet.owner,
    ErrorCode::Unauthorized
);

// Check for overflow
let new_balance = balance.checked_add(amount)
    .ok_or(ErrorCode::Overflow)?;

// Use PDAs for program-owned accounts
#[account(
    seeds = [b"agent_wallet", owner.key().as_ref()],
    bump
)]
```

### **3. Rate Limiting**

```rust
// Prevent spam
require!(
    clock.unix_timestamp >= last_action + 60,
    ErrorCode::TooFrequent
);
```

---

## 📈 Scaling on Solana

### **1. Use Compressed NFTs**

For agent achievements/badges:

```bash
# Install Metaplex
npm install @metaplex-foundation/js

# Mint compressed NFTs (1000x cheaper!)
```

### **2. Optimize RPC Calls**

```typescript
// Batch requests
const connection = new Connection(RPC_URL, {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000,
});

// Use getProgramAccounts efficiently
const accounts = await connection.getProgramAccounts(
  programId,
  {
    filters: [
      { dataSize: 165 },
      { memcmp: { offset: 8, bytes: owner.toBase58() } }
    ]
  }
);
```

### **3. Use Geyser for Real-time Data**

```bash
# Subscribe to program updates
# Much faster than polling!
```

---

## 🎯 Next Steps

### **Week 1: Local Development**
- ✅ Set up Solana CLI
- ✅ Deploy to devnet
- ✅ Test all programs
- ✅ Connect frontend

### **Week 2: Testing & Refinement**
- Run security audits
- Optimize transaction costs
- Add error handling
- Create comprehensive tests

### **Week 3: Mainnet Prep**
- Get security audit (recommended: OtterSec, Neodyme)
- Set up monitoring (Helius webhooks)
- Prepare marketing materials
- Create tutorial videos

### **Week 4: Launch!**
- Deploy to mainnet
- Announce on Twitter
- Post on /r/solana
- Submit to Solana ecosystem directory

---

## 🆘 Troubleshooting

### **"Insufficient funds for transaction"**

```bash
# Get more SOL
solana airdrop 2  # devnet only

# Or check balance
solana balance
```

### **"Program deploy failed"**

```bash
# Make sure you have enough SOL
solana balance

# Increase buffer size
anchor deploy --program-name subra_agent_wallet
```

### **"Wallet not connected"**

- Make sure Phantom extension is installed
- Check that you're on the correct network (devnet/mainnet)
- Clear browser cache and reconnect

---

## 📚 Resources

### **Official Docs**
- Solana Docs: https://docs.solana.com/
- Anchor Book: https://book.anchor-lang.com/
- Solana Cookbook: https://solanacookbook.com/

### **Community**
- Solana Discord: https://discord.gg/solana
- Anchor Discord: https://discord.gg/anchorlang
- /r/solana: https://reddit.com/r/solana

### **Tools**
- Solana Explorer: https://explorer.solana.com/
- Solscan: https://solscan.io/
- Solana Beach: https://solanabeach.io/

---

## 🎉 You're Ready!

Your SUBRA platform is now fully Solana-native! You have:

✅ **4 Anchor programs** ready to deploy  
✅ **Solana wallet integration** in the frontend  
✅ **SPL token support** for payments  
✅ **On-chain agent wallets** with spending limits  
✅ **Marketplace with staking** and reputation  

**Now go build the future of AI commerce on Solana!** 🚀🟣

