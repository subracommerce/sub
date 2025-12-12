# 🟣 SUBRA Solana Programs

Anchor-based Solana programs for the SUBRA AI Commerce platform.

## Programs

### 1. **Agent Wallet** (`subra_agent_wallet`)
Secure on-chain wallets for AI agents with:
- Spending limits per transaction
- Daily spending caps
- Multi-operator support
- Spend intent system
- Automatic limit resets

**Program ID (Devnet)**: `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`

### 2. **Marketplace** (`subra_marketplace`)
Agent discovery and reputation system:
- Agent staking requirements
- Reputation tracking (0-500 scale)
- Task success/failure recording
- Premium tier support
- Stake-based ranking

**Program ID (Devnet)**: `4aPvXHbZqKkZtidNqXUL7X3CfZ7FEfcYkg476zQ`

### 3. **Spend Intent** (`subra_spend_intent`)
Secure transaction approval system:
- Time-locked intents
- Multi-signature support
- Cancellation mechanism
- Event logging

### 4. **ZK Receipt** (`subra_zk_receipt`)
Privacy-preserving purchase verification:
- Zero-knowledge proofs
- Purchase verification without revealing details
- On-chain receipt registry

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all programs
pnpm build

# Deploy to devnet
pnpm deploy:devnet

# Run tests
pnpm test
```

## Development

```bash
# Build specific program
anchor build --program-name subra_agent_wallet

# Test specific program
anchor test tests/agent-wallet.ts

# Clean build artifacts
pnpm clean

# Lint Rust code
pnpm lint

# Format Rust code
pnpm format
```

## Program Architecture

### Agent Wallet Flow

```
User → Create Agent Wallet → Set Limits
  ↓
Agent → Create Spend Intent → Check Limits
  ↓
System → Execute Intent → Transfer Funds
  ↓
Blockchain → Record Transaction → Update Limits
```

### Marketplace Flow

```
Agent Owner → Stake Tokens → List Agent
  ↓
Users → Discover Agents → Select Agent
  ↓
Agent → Complete Tasks → Record Success/Failure
  ↓
System → Update Reputation → Adjust Ranking
```

## Security Features

- ✅ PDA-based account derivation
- ✅ Signer verification
- ✅ Overflow protection
- ✅ Time-based access control
- ✅ Spending limit enforcement
- ✅ Event emission for transparency

## Testing

```bash
# Unit tests (fast)
pnpm test:unit

# Integration tests (with validator)
pnpm test

# Test coverage
cargo tarpaulin --out Html
```

## Deployment

### Devnet

```bash
# Set to devnet
solana config set --url devnet

# Airdrop SOL
solana airdrop 2

# Deploy
pnpm deploy:devnet
```

### Mainnet

```bash
# Set to mainnet
solana config set --url mainnet-beta

# Ensure you have SOL
solana balance

# Deploy (COSTS REAL SOL!)
pnpm deploy:mainnet
```

## Program Costs

Approximate deployment costs:

- **Agent Wallet**: ~2-3 SOL
- **Marketplace**: ~3-4 SOL
- **Spend Intent**: ~2-3 SOL
- **ZK Receipt**: ~3-4 SOL

**Total**: ~10-14 SOL for all programs

## Monitoring

```bash
# View program logs
solana logs <PROGRAM_ID>

# Get program info
solana program show <PROGRAM_ID>

# View program accounts
anchor account <ACCOUNT_TYPE> <ADDRESS>
```

## Upgrading Programs

```bash
# Build new version
anchor build

# Upgrade (requires upgrade authority)
anchor upgrade target/deploy/subra_agent_wallet.so \
  --program-id <PROGRAM_ID>
```

## Resources

- [Anchor Documentation](https://book.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)
- [Solana Program Library](https://spl.solana.com/)

## License

MIT

