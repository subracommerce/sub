# SUBRA - Autonomous AI Commerce Platform

![SUBRA Platform](https://img.shields.io/badge/AI-Commerce-blue) ![License](https://img.shields.io/badge/license-MIT-green)

**SUBRA** is a full-stack autonomous AI commerce system that enables users to create AI agents that can search, negotiate, and purchase items from online stores using cryptocurrency. The platform features crypto payments (USDC/SOL/ETH), fiat conversion, zero-knowledge receipt proofs, and an agent-to-agent marketplace.

## 🌟 Features

### 🤖 AI Agents
- **Explorer Agent**: Product search and comparison across multiple sources
- **Negotiator Agent**: Price comparison, negotiation, and coupon finding
- **Executor Agent**: Autonomous purchase execution
- **Tracker Agent**: Order and shipping tracking

### 💰 Crypto Payments
- Support for USDC, SOL, ETH, and other major cryptocurrencies
- Seamless fiat conversion via MoonPay/Transak
- Stripe Issuing integration for merchant payments
- Multi-chain support (Ethereum, Solana, Polygon, Base)

### 🔐 Zero-Knowledge Proofs
- Privacy-preserving purchase receipts
- On-chain verification without revealing sensitive data
- Compliance-ready proof of spending
- Built with Noir (Aztec)

### 🏪 Agent Marketplace
- Discover and deploy specialized agents
- Staking and reputation system
- Premium tier agents
- Community-driven agent development

## 🏗️ Architecture

```
SUBRA/
├── apps/
│   ├── web/              # Next.js 15 frontend
│   ├── api/              # Fastify backend
│   ├── agents/           # AI agent runtime
│   ├── contracts/        # Solidity smart contracts
│   └── circuits/         # ZK circuits (Noir)
├── packages/
│   ├── config/           # Shared configuration
│   ├── utils/            # Utility functions
│   ├── sdk/              # TypeScript SDK
│   └── ui/               # Shared UI components
└── docker-compose.yml    # Development environment
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/subra.git
cd subra
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start infrastructure with Docker**
```bash
docker-compose up -d postgres redis
```

5. **Setup database**
```bash
cd apps/api
pnpm db:push
pnpm db:generate
```

6. **Start development servers**
```bash
# Terminal 1 - API
cd apps/api
pnpm dev

# Terminal 2 - Web
cd apps/web
pnpm dev

# Terminal 3 - Agents
cd apps/agents
pnpm dev
```

7. **Access the application**
- Frontend: http://localhost:3000
- API: http://localhost:4000
- API Health: http://localhost:4000/health

## 📦 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS + Shadcn UI
- **State**: Zustand
- **Web3**: Wagmi + RainbowKit
- **API Client**: Custom SDK with Axios

### Backend
- **Runtime**: Node.js 20
- **Framework**: Fastify
- **Validation**: Zod
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Queue**: BullMQ
- **Auth**: JWT + API Keys

### AI Agents
- **LLM**: OpenAI GPT-4
- **Runtime**: Node.js with TypeScript
- **Queue**: BullMQ
- **Communication**: Redis Pub/Sub

### Blockchain
- **Smart Contracts**: Solidity 0.8.23
- **Framework**: Foundry
- **Libraries**: OpenZeppelin
- **Chains**: Ethereum, Polygon, Base, Arbitrum

### Zero-Knowledge
- **Framework**: Noir (Aztec)
- **Proofs**: PLONK
- **Integration**: Barretenberg backend

## 🔧 Development

### Monorepo Structure

This project uses pnpm workspaces and Turborepo for monorepo management.

**Available Scripts:**
```bash
pnpm dev          # Start all apps in development mode
pnpm build        # Build all apps
pnpm test         # Run all tests
pnpm lint         # Lint all packages
pnpm format       # Format code with Prettier
```

### Database Management

```bash
# Generate Prisma client
pnpm db:generate

# Push schema changes
pnpm db:push

# Create migration
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio
```

### Smart Contract Development

```bash
cd apps/contracts

# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install dependencies
forge install

# Build contracts
forge build

# Run tests
forge test

# Deploy contracts
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast
```

### ZK Circuit Development

```bash
cd apps/circuits

# Install Noir
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
noirup

# Compile circuits
nargo compile

# Run tests
nargo test

# Generate proof
nargo prove
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run API tests
cd apps/api && pnpm test

# Run smart contract tests
cd apps/contracts && forge test

# Run ZK circuit tests
cd apps/circuits && nargo test
```

## 📚 Documentation

- [API Documentation](./apps/api/README.md)
- [Smart Contracts](./apps/contracts/README.md)
- [ZK Circuits](./apps/circuits/README.md)
- [Agent System](./apps/agents/README.md)
- [SDK Usage](./packages/sdk/README.md)

## 🔐 Security

### Key Security Features

1. **Authentication**
   - JWT with secure secret rotation
   - API key authentication
   - Rate limiting
   - HTTPS-only cookies

2. **Cryptography**
   - AES-256-GCM encryption for sensitive data
   - Secure key management
   - MPC key shares for agent wallets

3. **Smart Contracts**
   - OpenZeppelin security standards
   - Spending limits and controls
   - Multi-sig support
   - Emergency withdrawal

4. **Zero-Knowledge**
   - Privacy-preserving proofs
   - No sensitive data disclosure
   - On-chain verification

### Reporting Security Issues

Please report security vulnerabilities to security@subra.app

## 🚢 Deployment

### Production Deployment

```bash
# Build for production
pnpm build

# Start with Docker Compose
docker-compose up -d

# Or deploy individually
cd apps/api && pnpm start
cd apps/web && pnpm start
cd apps/agents && pnpm start
```

### Environment Variables

See `.env.example` for required environment variables.

**Critical Variables:**
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret for JWT signing (min 32 chars)
- `OPENAI_API_KEY`: OpenAI API key for agents
- `MOONPAY_API_KEY`: MoonPay for fiat on-ramp
- `STRIPE_SECRET_KEY`: Stripe for merchant payments

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Aztec for Noir ZK framework
- Foundry for smart contract development
- OpenZeppelin for secure contract libraries
- The entire crypto and AI community

## 📧 Contact

- Website: https://subra.app
- Email: hello@subra.app
- Twitter: [@SubraPlatform](https://twitter.com/SubraPlatform)
- Discord: [Join our community](https://discord.gg/subra)

## 🗺️ Roadmap

- [x] Core platform infrastructure
- [x] AI agent system
- [x] Crypto payment integration
- [x] ZK receipt proofs
- [ ] Multi-language agent support
- [ ] Mobile app (React Native)
- [ ] Advanced negotiation strategies
- [ ] Cross-chain bridge integration
- [ ] Agent-to-agent communication
- [ ] DAO governance

---

Built with ❤️ by the SUBRA team


