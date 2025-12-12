use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer, Mint};

declare_id!("4aPvXHbZqKkZtidNqXUL7X3CfZ7FEfcYkg476zQ");

#[program]
pub mod subra_marketplace {
    use super::*;

    /// Initialize the marketplace
    pub fn initialize(ctx: Context<InitializeMarketplace>) -> Result<()> {
        let marketplace = &mut ctx.accounts.marketplace;
        marketplace.authority = ctx.accounts.authority.key();
        marketplace.stake_token = ctx.accounts.stake_token.key();
        marketplace.minimum_stake = 100 * 10u64.pow(9); // 100 tokens
        marketplace.premium_stake = 1000 * 10u64.pow(9); // 1000 tokens
        marketplace.total_agents = 0;
        marketplace.bump = ctx.bumps.marketplace;
        
        Ok(())
    }

    /// List an agent on the marketplace
    pub fn list_agent(
        ctx: Context<ListAgent>,
        name: String,
        description: String,
        category: String,
        stake_amount: u64,
    ) -> Result<()> {
        let marketplace = &mut ctx.accounts.marketplace;
        let agent_listing = &mut ctx.accounts.agent_listing;
        
        require!(
            stake_amount >= marketplace.minimum_stake,
            ErrorCode::InsufficientStake
        );
        
        require!(name.len() <= 50, ErrorCode::NameTooLong);
        require!(description.len() <= 200, ErrorCode::DescriptionTooLong);
        
        // Transfer stake tokens
        let cpi_accounts = Transfer {
            from: ctx.accounts.owner_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, stake_amount)?;
        
        // Initialize agent listing
        agent_listing.marketplace = marketplace.key();
        agent_listing.owner = ctx.accounts.owner.key();
        agent_listing.name = name;
        agent_listing.description = description;
        agent_listing.category = category;
        agent_listing.staked_amount = stake_amount;
        agent_listing.total_tasks = 0;
        agent_listing.successful_tasks = 0;
        agent_listing.reputation = 100; // Start with base reputation
        agent_listing.is_active = true;
        agent_listing.is_premium = stake_amount >= marketplace.premium_stake;
        agent_listing.bump = ctx.bumps.agent_listing;
        
        marketplace.total_agents += 1;
        
        emit!(AgentListed {
            listing: agent_listing.key(),
            owner: agent_listing.owner,
            name: agent_listing.name.clone(),
            staked_amount: stake_amount,
        });
        
        Ok(())
    }

    /// Record task completion
    pub fn record_task(
        ctx: Context<RecordTask>,
        success: bool,
    ) -> Result<()> {
        let agent_listing = &mut ctx.accounts.agent_listing;
        
        agent_listing.total_tasks += 1;
        if success {
            agent_listing.successful_tasks += 1;
        }
        
        // Update reputation (0-500 scale)
        if agent_listing.total_tasks > 0 {
            agent_listing.reputation = (agent_listing.successful_tasks as u64 * 500) 
                / agent_listing.total_tasks as u64;
        }
        
        emit!(TaskRecorded {
            listing: agent_listing.key(),
            success,
            new_reputation: agent_listing.reputation,
        });
        
        Ok(())
    }

    /// Increase stake
    pub fn increase_stake(ctx: Context<ModifyStake>, amount: u64) -> Result<()> {
        let marketplace = &ctx.accounts.marketplace;
        let agent_listing = &mut ctx.accounts.agent_listing;
        
        // Transfer additional stake
        let cpi_accounts = Transfer {
            from: ctx.accounts.owner_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;
        
        agent_listing.staked_amount += amount;
        
        if agent_listing.staked_amount >= marketplace.premium_stake {
            agent_listing.is_premium = true;
        }
        
        Ok(())
    }

    /// Deactivate agent and withdraw stake
    pub fn deactivate_agent(ctx: Context<DeactivateAgent>) -> Result<()> {
        let agent_listing = &mut ctx.accounts.agent_listing;
        let marketplace = &ctx.accounts.marketplace;
        
        require!(agent_listing.is_active, ErrorCode::AgentNotActive);
        
        agent_listing.is_active = false;
        
        // Return stake using PDA signer
        let seeds = &[
            b"marketplace",
            &[marketplace.bump],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_token_account.to_account_info(),
            to: ctx.accounts.owner_token_account.to_account_info(),
            authority: marketplace.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, agent_listing.staked_amount)?;
        
        emit!(AgentDeactivated {
            listing: agent_listing.key(),
        });
        
        Ok(())
    }
}

// Accounts structs
#[derive(Accounts)]
pub struct InitializeMarketplace<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Marketplace::INIT_SPACE,
        seeds = [b"marketplace"],
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    
    pub stake_token: Account<'info, Mint>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ListAgent<'info> {
    #[account(
        mut,
        seeds = [b"marketplace"],
        bump = marketplace.bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    
    #[account(
        init,
        payer = owner,
        space = 8 + AgentListing::INIT_SPACE,
        seeds = [b"agent_listing", owner.key().as_ref(), &marketplace.total_agents.to_le_bytes()],
        bump
    )]
    pub agent_listing: Account<'info, AgentListing>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(mut)]
    pub owner_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RecordTask<'info> {
    #[account(mut)]
    pub agent_listing: Account<'info, AgentListing>,
    
    #[account(
        seeds = [b"marketplace"],
        bump = marketplace.bump,
        has_one = authority
    )]
    pub marketplace: Account<'info, Marketplace>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ModifyStake<'info> {
    pub marketplace: Account<'info, Marketplace>,
    
    #[account(
        mut,
        has_one = owner
    )]
    pub agent_listing: Account<'info, AgentListing>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(mut)]
    pub owner_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct DeactivateAgent<'info> {
    #[account(
        seeds = [b"marketplace"],
        bump = marketplace.bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    
    #[account(
        mut,
        has_one = owner
    )]
    pub agent_listing: Account<'info, AgentListing>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(mut)]
    pub owner_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(InitSpace)]
pub struct Marketplace {
    pub authority: Pubkey,
    pub stake_token: Pubkey,
    pub minimum_stake: u64,
    pub premium_stake: u64,
    pub total_agents: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct AgentListing {
    pub marketplace: Pubkey,
    pub owner: Pubkey,
    #[max_len(50)]
    pub name: String,
    #[max_len(200)]
    pub description: String,
    #[max_len(30)]
    pub category: String,
    pub staked_amount: u64,
    pub total_tasks: u64,
    pub successful_tasks: u64,
    pub reputation: u64,
    pub is_active: bool,
    pub is_premium: bool,
    pub bump: u8,
}

#[event]
pub struct AgentListed {
    pub listing: Pubkey,
    pub owner: Pubkey,
    pub name: String,
    pub staked_amount: u64,
}

#[event]
pub struct TaskRecorded {
    pub listing: Pubkey,
    pub success: bool,
    pub new_reputation: u64,
}

#[event]
pub struct AgentDeactivated {
    pub listing: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient stake amount")]
    InsufficientStake,
    
    #[msg("Agent name too long (max 50 characters)")]
    NameTooLong,
    
    #[msg("Description too long (max 200 characters)")]
    DescriptionTooLong,
    
    #[msg("Agent not active")]
    AgentNotActive,
}

