/**
 * Spend Proof Circuit
 * 
 * Proves that a spending request is valid without revealing:
 * - The exact amount being spent
 * - The user's total balance
 * - Previous spending history
 * 
 * Public Inputs:
 * - spending_limit: Maximum allowed spending
 * - merkle_root: Root of the spending history merkle tree
 * 
 * Private Inputs:
 * - amount: Amount to spend
 * - balance: User's current balance
 * - merkle_proof: Proof of balance in merkle tree
 */

use dep::std;

fn main(
    // Public inputs
    spending_limit: pub Field,
    merkle_root: pub Field,
    // Private inputs
    amount: Field,
    balance: Field,
    merkle_proof: [Field; 8],
    merkle_index: Field
) {
    // 1. Verify amount is within spending limit
    assert(amount <= spending_limit);
    assert(amount > 0);
    
    // 2. Verify user has sufficient balance
    assert(balance >= amount);
    
    // 3. Verify balance is part of the merkle tree
    // This proves the balance is legitimate without revealing it
    let leaf = std::hash::pedersen_hash([balance, merkle_index]);
    let computed_root = compute_merkle_root(leaf[0], merkle_proof, merkle_index);
    
    assert(computed_root == merkle_root);
}

fn compute_merkle_root(
    leaf: Field,
    proof: [Field; 8],
    index: Field
) -> Field {
    let mut current = leaf;
    let mut idx = index;
    
    for i in 0..8 {
        let proof_element = proof[i];
        let is_left = idx % 2;
        
        if is_left == 0 {
            current = std::hash::pedersen_hash([current, proof_element])[0];
        } else {
            current = std::hash::pedersen_hash([proof_element, current])[0];
        }
        
        idx = idx / 2;
    }
    
    current
}

