# 🟣 SUBRA - Autonomous AI Commerce on Solana

> **AI agents that shop, negotiate, and transact autonomously on the Solana blockchain.**

[![Solana](https://img.shields.io/badge/Solana-Native-9945FF?style=for-the-badge&logo=solana)](https://solana.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Anchor](https://img.shields.io/badge/Anchor-663399?style=for-the-badge)](https://www.anchor-lang.com/)

---

## ⚡ What is SUBRA?

SUBRA is the **first Solana-native autonomous AI commerce platform**. Create AI agents that:

- 🔍 **Search** for products across the internet
- 💰 **Negotiate** prices and find the best deals
- ✅ **Execute** purchases using SOL or USDC
- 📦 **Track** orders and deliveries
- 🔐 **Verify** purchases with zero-knowledge proofs

All powered by **Solana** blockchain for speed, security, and low-cost transactions.

---

## 🌟 Why Solana?

|  | Solana | Ethereum |
|---|---|---|
| **Speed** | 65,000 TPS | 15 TPS |
| **Cost** | $0.00025/tx | $50+/tx |
| **Block Time** | 400ms | 12 seconds |
| **Perfect for AI** | ✅ | ❌ |

**AI agents need to make hundreds of transactions**. Solana makes it possible.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- PostgreSQL 15+
- Redis 7+
- Solana CLI
- Anchor CLI
- Rust (for Solana programs)

### 1. Install Solana & Anchor

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Create Solana wallet
solana-keygen new --outfile ~/.config/solana/id.json

# Get devnet SOL
solana config set --url devnet
solana airdrop 2
```

### 2. Clone & Install

```bash
git clone https://github.com/subracommerce/sub.git
cd sub
pnpm install
```

### 3. Setup Environment

```bash
cp .env.template .env

# Edit .env with your values:
# - DATABASE_URL (PostgreSQL)
# - REDIS_URL (Redis)
# - OPENAI_API_KEY (OpenAI)
# - SOLANA_RPC_URL (Helius/QuickNode recommended)
```

### 4. Setup Database

```bash
# Start PostgreSQL & Redis
brew services start postgresql@15
brew services start redis

# Push database schema
cd apps/api
pnpm db:push
```

### 5. Deploy Solana Programs

```bash
cd apps/solana-programs

# Build programs
anchor build

# Deploy to devnet
anchor deploy

# Save the program IDs displayed
```

### 6. Start Development Servers

```bash
# Terminal 1: API Server
cd apps/api
pnpm dev

# Terminal 2: Web App
cd apps/web
pnpm dev

# Terminal 3: AI Agents
cd apps/agents
pnpm dev
```

### 7. Open Your Browser

```
http://localhost:3000
```

Connect your **Phantom** or **Solflare** wallet and create your first AI agent!

---

## 📁 Project Structure

```
subra/
├── apps/
│   ├── web/                  # Next.js 15 frontend (Solana wallets)
│   ├── api/                  # Fastify backend API
│   ├── agents/               # AI agent runtime (Python/Node)
│   ├── solana-programs/      # Anchor programs (Rust)
│   │   ├── programs/
│   │   │   ├── agent-wallet/     # Secure agent wallets
│   │   │   ├── marketplace/      # Agent staking & reputation
│   │   │   ├── spend-intent/     # Transaction approval
│   │   │   └── zk-receipt/       # Privacy-preserving receipts
│   └── circuits/             # Noir ZK circuits
├── packages/
│   ├── sdk/                  # TypeScript SDK (Solana integration)
│   ├── config/               # Shared configuration
│   └── utils/                # Shared utilities
└── docs/                     # Documentation
```

---

## 🔧 Tech Stack

### Frontend
- **Next.js 15** (App Router, React Server Components)
- **Solana Wallet Adapter** (Phantom, Solflare, Torus)
- **TailwindCSS** + **Shadcn UI**
- **Zustand** (State management)
- **React Query** (Data fetching)

### Backend
- **Fastify** (High-performance API)
- **PostgreSQL** (Prisma ORM)
- **Redis** (Cache & queues)
- **BullMQ** (Job processing)

### Blockchain (Solana)
- **Anchor** (Solana program framework)
- **Rust** (Smart contract language)
- **SPL Tokens** (SOL, USDC, custom tokens)
- **Web3.js** (Solana interaction)

### AI
- **OpenAI GPT-5.1** (Primary model)
- **Agent Orchestration** (Custom framework)
- **Vector Store** (RAG for memory)

### ZK Privacy
- **Noir** (Zero-knowledge circuits)
- **zkSNARKs** (Privacy-preserving proofs)

---

## 🎯 Features

### For Users

- ✅ **Connect Solana Wallet** (Phantom, Solflare, Torus, Ledger)
- ✅ **Create AI Agents** (Explorer, Negotiator, Executor, Tracker)
- ✅ **Natural Language** ("Find me the cheapest iPhone 15")
- ✅ **Pay with SOL or USDC** (SPL tokens)
- ✅ **Track Orders** (Real-time updates)
- ✅ **Privacy First** (ZK proofs for purchases)

### For Developers

- ✅ **Complete SDK** (TypeScript + Rust)
- ✅ **Anchor Programs** (Open source smart contracts)
- ✅ **REST API** (20+ endpoints)
- ✅ **Agent Skills System** (Extend agent capabilities)
- ✅ **Comprehensive Docs** (Get started in minutes)

### For Businesses

- ✅ **Agent Marketplace** (List your AI agents)
- ✅ **Staking & Reputation** (Build trust)
- ✅ **Transaction Fees** (Monetization built-in)
- ✅ **White Label** (Deploy your own platform)

---

## 🔐 Solana Programs

### 1. Agent Wallet
```rust
// Secure wallets for AI agents with spending limits
pub fn create_spend_intent(
    ctx: Context<CreateSpendIntent>,
    amount: u64,
    recipient: Pubkey,
) -> Result<()>
```

- Daily spending limits
- Per-transaction caps
- Multi-signature support
- Automatic cooldowns

### 2. Marketplace
```rust
// Agent staking and reputation system
pub fn list_agent(
    ctx: Context<ListAgent>,
    stake_amount: u64,
) -> Result<()>
```

- Token staking (100-10,000 $SUBRA)
- Reputation tracking (0-500 scale)
- Success rate monitoring
- Premium tiers

### 3. Spend Intent
```rust
// Time-locked transaction approvals
pub fn execute_spend_intent(
    ctx: Context<ExecuteSpendIntent>,
) -> Result<()>
```

- Time-delayed execution
- Cancellation window
- Event logging
- Multi-party approval

### 4. ZK Receipt
```rust
// Privacy-preserving purchase verification
pub fn verify_purchase(
    ctx: Context<VerifyPurchase>,
    proof: Vec<u8>,
) -> Result<()>
```

- Zero-knowledge proofs
- Purchase verification without revealing details
- On-chain registry

---

## 🚢 Deployment

### Devnet (Testing)

```bash
# Already configured!
solana config set --url devnet
cd apps/solana-programs
anchor build && anchor deploy
```

### Mainnet (Production)

```bash
# ⚠️ GET SECURITY AUDIT FIRST!

# Switch to mainnet
solana config set --url mainnet-beta

# Ensure you have SOL (~15 SOL = ~$3000)
solana balance

# Deploy
cd apps/solana-programs
anchor build
anchor deploy

# SAVE YOUR PROGRAM IDs!
```

**Recommended RPC Providers:**
- Helius: https://helius.dev (best for Solana)
- QuickNode: https://quicknode.com
- Alchemy: https://alchemy.com/solana

---

## 💰 Monetization

### Transaction Fees
- 1-2% fee on all purchases
- Paid in SOL or USDC
- Distributed to treasury

### Agent Staking
- Agents stake $SUBRA tokens to list
- Platform earns yield on staked tokens
- Tiers: Basic (100), Pro (1000), Enterprise (10000)

### Premium Features
- Priority execution: 0.5 SOL/month
- Advanced analytics: 1 SOL/month
- API access: 2 SOL/month

**Revenue Potential:** $10k-100k/month at scale

---

## 📚 Documentation

- [**Quick Start**](QUICKSTART.md) - Get running in 10 minutes
- [**Solana Setup**](SOLANA_SETUP.md) - Complete Solana guide
- [**Production Roadmap**](PRODUCTION_ROADMAP.md) - Path to launch
- [**API Documentation**](docs/API.md) - REST API reference
- [**Contributing**](CONTRIBUTING.md) - How to contribute

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Fork the repo
git clone https://github.com/YOUR_USERNAME/sub.git

# Create a branch
git checkout -b feature/amazing-feature

# Make your changes
git commit -m "Add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

---

## 🛣️ Roadmap

- [x] ✅ Complete Solana integration
- [x] ✅ Anchor programs (4 programs)
- [x] ✅ Wallet adapter (Phantom, Solflare)
- [x] ✅ SPL token support (SOL, USDC)
- [ ] 🚧 Deploy to devnet (Week 1)
- [ ] 🚧 Real API integrations (Week 2)
- [ ] 📅 Deploy to mainnet (Month 2)
- [ ] 📅 Mobile app (Month 3)
- [ ] 📅 Multi-chain support (Year 2)

---

## 🌐 Community

- **Twitter**: [@subracommerce](https://twitter.com/subracommerce)
- **Discord**: [Join Server](https://discord.gg/subra)
- **Telegram**: [Join Group](https://t.me/subracommerce)
- **Email**: hello@subra.app

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Built with:
- [Solana](https://solana.com/) - The blockchain for builders
- [Anchor](https://www.anchor-lang.com/) - Solana's framework
- [OpenAI](https://openai.com/) - AI models
- [Next.js](https://nextjs.org/) - The React framework
- [Phantom](https://phantom.app/) - Solana wallet

---

## ⚠️ Disclaimer

SUBRA is experimental software. Use at your own risk. This is not financial advice.

---

<div align="center">

**Built with 💜 on Solana**

[![Star on GitHub](https://img.shields.io/github/stars/subracommerce/sub?style=social)](https://github.com/subracommerce/sub)

</div>
