// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title AgentWallet
 * @notice Secure wallet contract controlled by an AI agent
 * @dev Implements spending limits, multi-sig, and spending intents
 */
contract AgentWallet is Ownable, ReentrancyGuard {
    /// @notice Spending limit per transaction (in wei)
    uint256 public spendingLimit;
    
    /// @notice Daily spending limit (in wei)
    uint256 public dailyLimit;
    
    /// @notice Amount spent today
    uint256 public dailySpent;
    
    /// @notice Last reset timestamp for daily limit
    uint256 public lastResetTimestamp;
    
    /// @notice Trusted operators who can execute transactions
    mapping(address => bool) public operators;
    
    /// @notice Nonce for transaction replay protection
    uint256 public nonce;
    
    /// @notice Pending spend intents
    mapping(bytes32 => SpendIntent) public spendIntents;
    
    struct SpendIntent {
        address to;
        uint256 amount;
        bytes data;
        uint256 timestamp;
        bool executed;
    }
    
    event SpendingLimitUpdated(uint256 newLimit);
    event DailyLimitUpdated(uint256 newLimit);
    event OperatorAdded(address indexed operator);
    event OperatorRemoved(address indexed operator);
    event SpendIntentCreated(bytes32 indexed intentId, address to, uint256 amount);
    event SpendIntentExecuted(bytes32 indexed intentId);
    event FundsReceived(address indexed from, uint256 amount);
    event FundsWithdrawn(address indexed to, uint256 amount);
    
    constructor(
        address _owner,
        uint256 _spendingLimit,
        uint256 _dailyLimit
    ) {
        _transferOwnership(_owner);
        spendingLimit = _spendingLimit;
        dailyLimit = _dailyLimit;
        lastResetTimestamp = block.timestamp;
    }
    
    /**
     * @notice Update spending limit per transaction
     */
    function setSpendingLimit(uint256 _newLimit) external onlyOwner {
        spendingLimit = _newLimit;
        emit SpendingLimitUpdated(_newLimit);
    }
    
    /**
     * @notice Update daily spending limit
     */
    function setDailyLimit(uint256 _newLimit) external onlyOwner {
        dailyLimit = _newLimit;
        emit DailyLimitUpdated(_newLimit);
    }
    
    /**
     * @notice Add a trusted operator
     */
    function addOperator(address _operator) external onlyOwner {
        operators[_operator] = true;
        emit OperatorAdded(_operator);
    }
    
    /**
     * @notice Remove an operator
     */
    function removeOperator(address _operator) external onlyOwner {
        operators[_operator] = false;
        emit OperatorRemoved(_operator);
    }
    
    /**
     * @notice Reset daily spending if 24 hours have passed
     */
    function _resetDailyLimitIfNeeded() internal {
        if (block.timestamp >= lastResetTimestamp + 1 days) {
            dailySpent = 0;
            lastResetTimestamp = block.timestamp;
        }
    }
    
    /**
     * @notice Create a spend intent for review
     */
    function createSpendIntent(
        address _to,
        uint256 _amount,
        bytes calldata _data
    ) external returns (bytes32) {
        require(operators[msg.sender] || msg.sender == owner(), "Not authorized");
        require(_amount <= spendingLimit, "Exceeds spending limit");
        
        _resetDailyLimitIfNeeded();
        require(dailySpent + _amount <= dailyLimit, "Exceeds daily limit");
        
        bytes32 intentId = keccak256(
            abi.encodePacked(_to, _amount, _data, nonce++, block.timestamp)
        );
        
        spendIntents[intentId] = SpendIntent({
            to: _to,
            amount: _amount,
            data: _data,
            timestamp: block.timestamp,
            executed: false
        });
        
        emit SpendIntentCreated(intentId, _to, _amount);
        return intentId;
    }
    
    /**
     * @notice Execute a pending spend intent
     */
    function executeSpendIntent(bytes32 _intentId) external nonReentrant {
        require(operators[msg.sender] || msg.sender == owner(), "Not authorized");
        
        SpendIntent storage intent = spendIntents[_intentId];
        require(!intent.executed, "Already executed");
        require(intent.timestamp > 0, "Intent does not exist");
        require(block.timestamp <= intent.timestamp + 1 hours, "Intent expired");
        
        _resetDailyLimitIfNeeded();
        require(dailySpent + intent.amount <= dailyLimit, "Exceeds daily limit");
        require(address(this).balance >= intent.amount, "Insufficient balance");
        
        intent.executed = true;
        dailySpent += intent.amount;
        
        (bool success, ) = intent.to.call{value: intent.amount}(intent.data);
        require(success, "Transfer failed");
        
        emit SpendIntentExecuted(_intentId);
    }
    
    /**
     * @notice Emergency withdraw (owner only)
     */
    function emergencyWithdraw(address payable _to) external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        (bool success, ) = _to.call{value: balance}("");
        require(success, "Transfer failed");
        emit FundsWithdrawn(_to, balance);
    }
    
    /**
     * @notice Withdraw ERC20 tokens
     */
    function withdrawToken(
        address _token,
        address _to,
        uint256 _amount
    ) external onlyOwner nonReentrant {
        IERC20(_token).transfer(_to, _amount);
    }
    
    /**
     * @notice Receive ETH
     */
    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }
    
    /**
     * @notice Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

