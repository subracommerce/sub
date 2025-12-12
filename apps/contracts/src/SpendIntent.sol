// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SpendIntent
 * @notice Registry for agent spending intents with approval workflow
 */
contract SpendIntent is AccessControl, ReentrancyGuard {
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");
    bytes32 public constant APPROVER_ROLE = keccak256("APPROVER_ROLE");
    
    struct Intent {
        bytes32 id;
        address agent;
        address merchant;
        uint256 amount;
        string currency;
        string description;
        uint256 timestamp;
        IntentStatus status;
        bytes32 zkProofHash;
    }
    
    enum IntentStatus {
        Pending,
        Approved,
        Executed,
        Cancelled
    }
    
    /// @notice Intent ID => Intent
    mapping(bytes32 => Intent) public intents;
    
    /// @notice Agent => Intent IDs
    mapping(address => bytes32[]) public agentIntents;
    
    /// @notice Total intents count
    uint256 public totalIntents;
    
    event IntentCreated(
        bytes32 indexed intentId,
        address indexed agent,
        address merchant,
        uint256 amount
    );
    event IntentApproved(bytes32 indexed intentId, address indexed approver);
    event IntentExecuted(bytes32 indexed intentId);
    event IntentCancelled(bytes32 indexed intentId);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(APPROVER_ROLE, msg.sender);
    }
    
    /**
     * @notice Create a new spending intent
     */
    function createIntent(
        address _merchant,
        uint256 _amount,
        string calldata _currency,
        string calldata _description
    ) external onlyRole(AGENT_ROLE) returns (bytes32) {
        bytes32 intentId = keccak256(
            abi.encodePacked(
                msg.sender,
                _merchant,
                _amount,
                _currency,
                block.timestamp,
                totalIntents++
            )
        );
        
        intents[intentId] = Intent({
            id: intentId,
            agent: msg.sender,
            merchant: _merchant,
            amount: _amount,
            currency: _currency,
            description: _description,
            timestamp: block.timestamp,
            status: IntentStatus.Pending,
            zkProofHash: bytes32(0)
        });
        
        agentIntents[msg.sender].push(intentId);
        
        emit IntentCreated(intentId, msg.sender, _merchant, _amount);
        return intentId;
    }
    
    /**
     * @notice Approve a spending intent
     */
    function approveIntent(bytes32 _intentId) external onlyRole(APPROVER_ROLE) {
        Intent storage intent = intents[_intentId];
        require(intent.timestamp > 0, "Intent does not exist");
        require(intent.status == IntentStatus.Pending, "Invalid status");
        
        intent.status = IntentStatus.Approved;
        emit IntentApproved(_intentId, msg.sender);
    }
    
    /**
     * @notice Execute an approved intent
     */
    function executeIntent(
        bytes32 _intentId,
        bytes32 _zkProofHash
    ) external onlyRole(AGENT_ROLE) {
        Intent storage intent = intents[_intentId];
        require(intent.agent == msg.sender, "Not intent owner");
        require(intent.status == IntentStatus.Approved, "Not approved");
        
        intent.status = IntentStatus.Executed;
        intent.zkProofHash = _zkProofHash;
        
        emit IntentExecuted(_intentId);
    }
    
    /**
     * @notice Cancel a pending intent
     */
    function cancelIntent(bytes32 _intentId) external {
        Intent storage intent = intents[_intentId];
        require(
            intent.agent == msg.sender || hasRole(APPROVER_ROLE, msg.sender),
            "Not authorized"
        );
        require(
            intent.status == IntentStatus.Pending || 
            intent.status == IntentStatus.Approved,
            "Cannot cancel"
        );
        
        intent.status = IntentStatus.Cancelled;
        emit IntentCancelled(_intentId);
    }
    
    /**
     * @notice Get agent's intents
     */
    function getAgentIntents(address _agent) external view returns (bytes32[] memory) {
        return agentIntents[_agent];
    }
    
    /**
     * @notice Get intent details
     */
    function getIntent(bytes32 _intentId) external view returns (Intent memory) {
        return intents[_intentId];
    }
}

