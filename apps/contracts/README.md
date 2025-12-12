# SUBRA Smart Contracts

Solidity smart contracts for the SUBRA platform built with Foundry.

## Contracts

### AgentWallet.sol
Secure wallet contract controlled by AI agents with:
- Spending limits per transaction
- Daily spending limits
- Multi-operator support
- Spend intent system
- Emergency withdrawal

### SpendIntent.sol
Registry for agent spending intents with approval workflow:
- Create, approve, execute, and cancel intents
- Role-based access control
- ZK proof integration

### ZkReceiptRegistry.sol
On-chain registry for zero-knowledge purchase receipts:
- Store receipt commitments
- Verify ZK proofs
- Query user receipts

### AgentMarketplace.sol
Decentralized marketplace for AI agents:
- Staking mechanism
- Reputation system
- Premium tier support
- Task completion tracking

## Setup

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install dependencies
forge install OpenZeppelin/openzeppelin-contracts

# Build contracts
forge build

# Run tests
forge test

# Deploy contracts
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast
```

## Testing

```bash
# Run all tests
forge test

# Run with gas reporting
forge test --gas-report

# Run specific test
forge test --match-test testAgentWallet
```

## Deployment

Set environment variables:
```bash
export PRIVATE_KEY=0x...
export ETHEREUM_RPC_URL=https://...
export ETHERSCAN_API_KEY=...
```

Deploy:
```bash
forge script script/Deploy.s.sol --rpc-url $ETHEREUM_RPC_URL --broadcast --verify
```

