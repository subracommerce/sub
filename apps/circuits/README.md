# SUBRA Zero-Knowledge Circuits

Zero-knowledge proof circuits built with Noir for privacy-preserving purchase verification.

## Circuits

### main.nr - Receipt Proof Circuit
Proves purchase receipt validity without revealing:
- Exact purchase amount (proves within range)
- User identity
- Merchant details
- Transaction metadata

**Use Cases:**
- Tax compliance (prove spending within threshold)
- Budget verification
- Purchase proof without disclosure

### spend_proof.nr - Spending Authorization Circuit
Proves spending authorization without revealing:
- Exact balance
- Spending history
- Account details

**Use Cases:**
- Pre-authorization for agent spending
- Budget enforcement
- Balance verification

## Setup

### Install Noir

```bash
# Install Nargo (Noir package manager)
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
noirup

# Verify installation
nargo --version
```

### Build Circuits

```bash
cd apps/circuits

# Compile circuit
nargo compile

# Run tests
nargo test

# Generate proving and verification keys
nargo codegen-verifier
```

## Usage

### Generate a Proof

1. Create `Prover.toml` with your inputs:

```toml
receipt_hash = "0x1234..."
min_amount = "50"
max_amount = "500"
amount = "100"
user_id = "12345"
merchant_id = "67890"
timestamp = "1700000000"
nonce = "999"
```

2. Generate proof:

```bash
nargo prove
```

3. Verify proof:

```bash
nargo verify
```

### Integration with Smart Contracts

The verification key can be exported for on-chain verification:

```bash
# Generate Solidity verifier
nargo codegen-verifier --backend plonk

# This generates a Solidity contract that can verify proofs on-chain
```

### Integration with Backend

Example TypeScript/Node.js integration:

```typescript
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import circuit from './target/subra_circuits.json';

// Create proof
const backend = new BarretenbergBackend(circuit);
const noir = new Noir(circuit, backend);

const inputs = {
  receipt_hash: '0x1234...',
  min_amount: '50',
  max_amount: '500',
  amount: '100',
  user_id: '12345',
  merchant_id: '67890',
  timestamp: '1700000000',
  nonce: '999'
};

const proof = await noir.generateFinalProof(inputs);

// Verify proof
const verified = await noir.verifyFinalProof(proof);
console.log('Proof verified:', verified);
```

## Privacy Guarantees

### What is Proven:
- Amount is within specified range
- Timestamp is valid
- Receipt commitment is correctly formed
- User has authorization to spend

### What Remains Private:
- Exact purchase amount
- User identity
- Merchant identity  
- Transaction metadata
- Previous spending history

## Circuit Parameters

### Receipt Proof
- Constraint count: ~1000
- Proof size: ~2KB
- Proving time: ~2s
- Verification time: <100ms

### Spend Proof
- Constraint count: ~1500
- Proof size: ~2KB
- Proving time: ~3s
- Verification time: <100ms

## Security Considerations

1. **Nonce Management**: Always use unique nonces to prevent replay attacks
2. **Timestamp Validation**: Implement proper time window checks
3. **Range Proofs**: Ensure amount ranges prevent overflow/underflow
4. **Merkle Proofs**: Validate tree depth matches expected depth

## Development

### Add New Circuit

1. Create new file in `src/`:
```bash
touch src/my_circuit.nr
```

2. Define circuit logic:
```noir
fn main(public_input: pub Field, private_input: Field) {
    // Circuit logic
}
```

3. Add tests:
```noir
#[test]
fn test_my_circuit() {
    main(123, 456);
}
```

4. Compile and test:
```bash
nargo compile
nargo test
```

## Resources

- [Noir Documentation](https://noir-lang.org/)
- [Noir GitHub](https://github.com/noir-lang/noir)
- [Aztec Protocol](https://aztec.network/)

