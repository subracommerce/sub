// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ZkReceiptRegistry
 * @notice On-chain registry for zero-knowledge purchase receipts
 * @dev Stores receipt commitments and verification status
 */
contract ZkReceiptRegistry is Ownable {
    struct Receipt {
        bytes32 commitmentHash;
        address user;
        uint256 timestamp;
        bool verified;
        bytes32 merkleRoot;
    }
    
    /// @notice Receipt ID => Receipt
    mapping(bytes32 => Receipt) public receipts;
    
    /// @notice User => Receipt IDs
    mapping(address => bytes32[]) public userReceipts;
    
    /// @notice Total receipts count
    uint256 public totalReceipts;
    
    /// @notice Verifier contract address
    address public verifierContract;
    
    event ReceiptRegistered(
        bytes32 indexed receiptId,
        address indexed user,
        bytes32 commitmentHash
    );
    event ReceiptVerified(bytes32 indexed receiptId);
    event VerifierUpdated(address indexed newVerifier);
    
    constructor() {
        _transferOwnership(msg.sender);
    }
    
    /**
     * @notice Set the ZK verifier contract
     */
    function setVerifier(address _verifier) external onlyOwner {
        verifierContract = _verifier;
        emit VerifierUpdated(_verifier);
    }
    
    /**
     * @notice Register a new receipt
     */
    function registerReceipt(
        bytes32 _commitmentHash,
        bytes32 _merkleRoot
    ) external returns (bytes32) {
        bytes32 receiptId = keccak256(
            abi.encodePacked(
                msg.sender,
                _commitmentHash,
                block.timestamp,
                totalReceipts++
            )
        );
        
        receipts[receiptId] = Receipt({
            commitmentHash: _commitmentHash,
            user: msg.sender,
            timestamp: block.timestamp,
            verified: false,
            merkleRoot: _merkleRoot
        });
        
        userReceipts[msg.sender].push(receiptId);
        
        emit ReceiptRegistered(receiptId, msg.sender, _commitmentHash);
        return receiptId;
    }
    
    /**
     * @notice Verify a receipt using ZK proof
     * @dev In production, this would verify the ZK proof on-chain
     */
    function verifyReceipt(
        bytes32 _receiptId,
        bytes calldata _proof
    ) external returns (bool) {
        Receipt storage receipt = receipts[_receiptId];
        require(receipt.timestamp > 0, "Receipt does not exist");
        require(!receipt.verified, "Already verified");
        
        // TODO: Integrate actual ZK proof verification
        // For now, simplified verification
        require(_proof.length > 0, "Invalid proof");
        
        receipt.verified = true;
        emit ReceiptVerified(_receiptId);
        
        return true;
    }
    
    /**
     * @notice Get user's receipts
     */
    function getUserReceipts(address _user) external view returns (bytes32[] memory) {
        return userReceipts[_user];
    }
    
    /**
     * @notice Get receipt details
     */
    function getReceipt(bytes32 _receiptId) external view returns (Receipt memory) {
        return receipts[_receiptId];
    }
    
    /**
     * @notice Check if receipt is verified
     */
    function isVerified(bytes32 _receiptId) external view returns (bool) {
        return receipts[_receiptId].verified;
    }
}

