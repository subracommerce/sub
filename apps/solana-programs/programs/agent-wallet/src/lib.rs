use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod subra_agent_wallet {
    use super::*;

    /// Initialize a new agent wallet
    pub fn initialize(
        ctx: Context<Initialize>,
        spending_limit: u64,
        daily_limit: u64,
    ) -> Result<()> {
        let wallet = &mut ctx.accounts.agent_wallet;
        wallet.owner = ctx.accounts.owner.key();
        wallet.agent_authority = ctx.accounts.agent_authority.key();
        wallet.spending_limit = spending_limit;
        wallet.daily_limit = daily_limit;
        wallet.daily_spent = 0;
        wallet.last_reset_timestamp = Clock::get()?.unix_timestamp;
        wallet.nonce = 0;
        wallet.bump = ctx.bumps.agent_wallet;
        
        emit!(WalletInitialized {
            wallet: wallet.key(),
            owner: wallet.owner,
            spending_limit,
            daily_limit,
        });
        
        Ok(())
    }

    /// Add an operator who can create spend intents
    pub fn add_operator(ctx: Context<ModifyOperator>, operator: Pubkey) -> Result<()> {
        let wallet = &mut ctx.accounts.agent_wallet;
        
        require!(
            !wallet.operators.contains(&operator),
            ErrorCode::OperatorAlreadyExists
        );
        
        wallet.operators.push(operator);
        
        emit!(OperatorAdded {
            wallet: wallet.key(),
            operator,
        });
        
        Ok(())
    }

    /// Remove an operator
    pub fn remove_operator(ctx: Context<ModifyOperator>, operator: Pubkey) -> Result<()> {
        let wallet = &mut ctx.accounts.agent_wallet;
        
        wallet.operators.retain(|&op| op != operator);
        
        emit!(OperatorRemoved {
            wallet: wallet.key(),
            operator,
        });
        
        Ok(())
    }

    /// Create a spend intent
    pub fn create_spend_intent(
        ctx: Context<CreateSpendIntent>,
        amount: u64,
        recipient: Pubkey,
    ) -> Result<()> {
        let wallet = &mut ctx.accounts.agent_wallet;
        let clock = Clock::get()?;
        
        // Reset daily limit if needed
        if clock.unix_timestamp >= wallet.last_reset_timestamp + 86400 {
            wallet.daily_spent = 0;
            wallet.last_reset_timestamp = clock.unix_timestamp;
        }
        
        // Check limits
        require!(
            amount <= wallet.spending_limit,
            ErrorCode::ExceedsSpendingLimit
        );
        
        require!(
            wallet.daily_spent + amount <= wallet.daily_limit,
            ErrorCode::ExceedsDailyLimit
        );
        
        let spend_intent = &mut ctx.accounts.spend_intent;
        spend_intent.wallet = wallet.key();
        spend_intent.recipient = recipient;
        spend_intent.amount = amount;
        spend_intent.timestamp = clock.unix_timestamp;
        spend_intent.executed = false;
        spend_intent.bump = ctx.bumps.spend_intent;
        
        wallet.nonce += 1;
        
        emit!(SpendIntentCreated {
            intent: spend_intent.key(),
            wallet: wallet.key(),
            recipient,
            amount,
        });
        
        Ok(())
    }

    /// Execute a spend intent (transfer SOL or SPL tokens)
    pub fn execute_spend_intent(ctx: Context<ExecuteSpendIntent>) -> Result<()> {
        let wallet = &mut ctx.accounts.agent_wallet;
        let intent = &mut ctx.accounts.spend_intent;
        let clock = Clock::get()?;
        
        require!(!intent.executed, ErrorCode::AlreadyExecuted);
        require!(
            clock.unix_timestamp <= intent.timestamp + 3600,
            ErrorCode::IntentExpired
        );
        
        // Reset daily limit if needed
        if clock.unix_timestamp >= wallet.last_reset_timestamp + 86400 {
            wallet.daily_spent = 0;
            wallet.last_reset_timestamp = clock.unix_timestamp;
        }
        
        require!(
            wallet.daily_spent + intent.amount <= wallet.daily_limit,
            ErrorCode::ExceedsDailyLimit
        );
        
        // Transfer SOL
        let transfer_ix = anchor_lang::solana_program::system_instruction::transfer(
            &wallet.key(),
            &intent.recipient,
            intent.amount,
        );
        
        anchor_lang::solana_program::program::invoke_signed(
            &transfer_ix,
            &[
                wallet.to_account_info(),
                ctx.accounts.recipient.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[&[
                b"agent_wallet",
                wallet.owner.as_ref(),
                &[wallet.bump],
            ]],
        )?;
        
        intent.executed = true;
        wallet.daily_spent += intent.amount;
        
        emit!(SpendIntentExecuted {
            intent: intent.key(),
            amount: intent.amount,
        });
        
        Ok(())
    }

    /// Update spending limits
    pub fn update_limits(
        ctx: Context<UpdateLimits>,
        new_spending_limit: Option<u64>,
        new_daily_limit: Option<u64>,
    ) -> Result<()> {
        let wallet = &mut ctx.accounts.agent_wallet;
        
        if let Some(limit) = new_spending_limit {
            wallet.spending_limit = limit;
        }
        
        if let Some(limit) = new_daily_limit {
            wallet.daily_limit = limit;
        }
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + AgentWallet::INIT_SPACE,
        seeds = [b"agent_wallet", owner.key().as_ref()],
        bump
    )]
    pub agent_wallet: Account<'info, AgentWallet>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    /// CHECK: This is the agent's authority (can be a PDA or keypair)
    pub agent_authority: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ModifyOperator<'info> {
    #[account(
        mut,
        seeds = [b"agent_wallet", agent_wallet.owner.as_ref()],
        bump = agent_wallet.bump,
        has_one = owner
    )]
    pub agent_wallet: Account<'info, AgentWallet>,
    
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct CreateSpendIntent<'info> {
    #[account(
        mut,
        seeds = [b"agent_wallet", agent_wallet.owner.as_ref()],
        bump = agent_wallet.bump
    )]
    pub agent_wallet: Account<'info, AgentWallet>,
    
    #[account(
        init,
        payer = operator,
        space = 8 + SpendIntent::INIT_SPACE,
        seeds = [b"spend_intent", agent_wallet.key().as_ref(), &agent_wallet.nonce.to_le_bytes()],
        bump
    )]
    pub spend_intent: Account<'info, SpendIntent>,
    
    #[account(mut)]
    pub operator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteSpendIntent<'info> {
    #[account(
        mut,
        seeds = [b"agent_wallet", agent_wallet.owner.as_ref()],
        bump = agent_wallet.bump
    )]
    pub agent_wallet: Account<'info, AgentWallet>,
    
    #[account(
        mut,
        seeds = [b"spend_intent", agent_wallet.key().as_ref(), &(agent_wallet.nonce - 1).to_le_bytes()],
        bump = spend_intent.bump
    )]
    pub spend_intent: Account<'info, SpendIntent>,
    
    /// CHECK: Recipient of the funds
    #[account(mut)]
    pub recipient: UncheckedAccount<'info>,
    
    pub operator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateLimits<'info> {
    #[account(
        mut,
        seeds = [b"agent_wallet", agent_wallet.owner.as_ref()],
        bump = agent_wallet.bump,
        has_one = owner
    )]
    pub agent_wallet: Account<'info, AgentWallet>,
    
    pub owner: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct AgentWallet {
    pub owner: Pubkey,
    pub agent_authority: Pubkey,
    pub spending_limit: u64,
    pub daily_limit: u64,
    pub daily_spent: u64,
    pub last_reset_timestamp: i64,
    pub nonce: u64,
    #[max_len(10)]
    pub operators: Vec<Pubkey>,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct SpendIntent {
    pub wallet: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
    pub executed: bool,
    pub bump: u8,
}

#[event]
pub struct WalletInitialized {
    pub wallet: Pubkey,
    pub owner: Pubkey,
    pub spending_limit: u64,
    pub daily_limit: u64,
}

#[event]
pub struct OperatorAdded {
    pub wallet: Pubkey,
    pub operator: Pubkey,
}

#[event]
pub struct OperatorRemoved {
    pub wallet: Pubkey,
    pub operator: Pubkey,
}

#[event]
pub struct SpendIntentCreated {
    pub intent: Pubkey,
    pub wallet: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
}

#[event]
pub struct SpendIntentExecuted {
    pub intent: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Operator already exists")]
    OperatorAlreadyExists,
    
    #[msg("Not authorized")]
    NotAuthorized,
    
    #[msg("Amount exceeds spending limit")]
    ExceedsSpendingLimit,
    
    #[msg("Amount exceeds daily limit")]
    ExceedsDailyLimit,
    
    #[msg("Spend intent already executed")]
    AlreadyExecuted,
    
    #[msg("Spend intent expired")]
    IntentExpired,
}

