// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgentMarketplace
 * @notice Decentralized marketplace for AI agents with staking and reputation
 */
contract AgentMarketplace is Ownable, ReentrancyGuard {
    IERC20 public stakeToken;
    
    struct AgentListing {
        address owner;
        string name;
        string description;
        string category;
        uint256 stakedAmount;
        uint256 totalTasks;
        uint256 successfulTasks;
        uint256 reputation;
        bool isActive;
        bool isPremium;
    }
    
    /// @notice Minimum stake required to list an agent
    uint256 public minimumStake = 100 * 10**18; // 100 tokens
    
    /// @notice Premium tier minimum stake
    uint256 public premiumStake = 1000 * 10**18; // 1000 tokens
    
    /// @notice Agent ID => Agent Listing
    mapping(bytes32 => AgentListing) public agents;
    
    /// @notice Owner => Agent IDs
    mapping(address => bytes32[]) public ownerAgents;
    
    /// @notice Total agents
    uint256 public totalAgents;
    
    event AgentListed(
        bytes32 indexed agentId,
        address indexed owner,
        string name,
        uint256 stakedAmount
    );
    event AgentUpdated(bytes32 indexed agentId);
    event AgentDeactivated(bytes32 indexed agentId);
    event StakeIncreased(bytes32 indexed agentId, uint256 amount);
    event StakeWithdrawn(bytes32 indexed agentId, uint256 amount);
    event TaskCompleted(bytes32 indexed agentId, bool success);
    event ReputationUpdated(bytes32 indexed agentId, uint256 newReputation);
    
    constructor(address _stakeToken) {
        stakeToken = IERC20(_stakeToken);
        _transferOwnership(msg.sender);
    }
    
    /**
     * @notice List a new agent on the marketplace
     */
    function listAgent(
        string calldata _name,
        string calldata _description,
        string calldata _category,
        uint256 _stakeAmount
    ) external nonReentrant returns (bytes32) {
        require(_stakeAmount >= minimumStake, "Insufficient stake");
        
        bytes32 agentId = keccak256(
            abi.encodePacked(msg.sender, _name, block.timestamp, totalAgents++)
        );
        
        // Transfer stake
        require(
            stakeToken.transferFrom(msg.sender, address(this), _stakeAmount),
            "Stake transfer failed"
        );
        
        agents[agentId] = AgentListing({
            owner: msg.sender,
            name: _name,
            description: _description,
            category: _category,
            stakedAmount: _stakeAmount,
            totalTasks: 0,
            successfulTasks: 0,
            reputation: 100, // Start with base reputation
            isActive: true,
            isPremium: _stakeAmount >= premiumStake
        });
        
        ownerAgents[msg.sender].push(agentId);
        
        emit AgentListed(agentId, msg.sender, _name, _stakeAmount);
        return agentId;
    }
    
    /**
     * @notice Increase stake for an agent
     */
    function increaseStake(bytes32 _agentId, uint256 _amount) external nonReentrant {
        AgentListing storage agent = agents[_agentId];
        require(agent.owner == msg.sender, "Not agent owner");
        require(agent.isActive, "Agent not active");
        
        require(
            stakeToken.transferFrom(msg.sender, address(this), _amount),
            "Stake transfer failed"
        );
        
        agent.stakedAmount += _amount;
        
        if (agent.stakedAmount >= premiumStake) {
            agent.isPremium = true;
        }
        
        emit StakeIncreased(_agentId, _amount);
    }
    
    /**
     * @notice Record a completed task
     */
    function recordTaskCompletion(
        bytes32 _agentId,
        bool _success
    ) external onlyOwner {
        AgentListing storage agent = agents[_agentId];
        require(agent.isActive, "Agent not active");
        
        agent.totalTasks++;
        if (_success) {
            agent.successfulTasks++;
        }
        
        // Update reputation based on success rate
        if (agent.totalTasks > 0) {
            agent.reputation = (agent.successfulTasks * 500) / agent.totalTasks;
        }
        
        emit TaskCompleted(_agentId, _success);
        emit ReputationUpdated(_agentId, agent.reputation);
    }
    
    /**
     * @notice Deactivate an agent and withdraw stake
     */
    function deactivateAgent(bytes32 _agentId) external nonReentrant {
        AgentListing storage agent = agents[_agentId];
        require(agent.owner == msg.sender, "Not agent owner");
        require(agent.isActive, "Agent not active");
        
        agent.isActive = false;
        
        // Return stake
        require(
            stakeToken.transfer(msg.sender, agent.stakedAmount),
            "Stake transfer failed"
        );
        
        emit AgentDeactivated(_agentId);
    }
    
    /**
     * @notice Update minimum stake requirements
     */
    function updateStakeRequirements(
        uint256 _minimumStake,
        uint256 _premiumStake
    ) external onlyOwner {
        minimumStake = _minimumStake;
        premiumStake = _premiumStake;
    }
    
    /**
     * @notice Get agent details
     */
    function getAgent(bytes32 _agentId) external view returns (AgentListing memory) {
        return agents[_agentId];
    }
    
    /**
     * @notice Get owner's agents
     */
    function getOwnerAgents(address _owner) external view returns (bytes32[] memory) {
        return ownerAgents[_owner];
    }
    
    /**
     * @notice Calculate success rate
     */
    function getSuccessRate(bytes32 _agentId) external view returns (uint256) {
        AgentListing memory agent = agents[_agentId];
        if (agent.totalTasks == 0) return 0;
        return (agent.successfulTasks * 100) / agent.totalTasks;
    }
}

