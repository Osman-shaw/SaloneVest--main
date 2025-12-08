use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer, TokenAccount, Token, Mint};

// Program ID (Placeholder - will be replaced after deployment)
declare_id!("11111111111111111111111111111111");

// USDC Mint Address (Devnet)
pub mod usdc_mint_key {
    use anchor_lang::prelude::declare_id;
    // Devnet USDC Mint - replace with mainnet address for production
    declare_id!("4zMMC9srt5Ri1KseAPa9KUKFdgS2uK4JCT2TSXDKXrm");
}

#[program]
pub mod salonevest_program {
    use super::*;

    /// Core investment function - transfers USDC and creates immutable record
    pub fn invest_usd(
        ctx: Context<InvestUSD>,
        amount: u64,
        investment_id: String,
    ) -> Result<()> {
        // Validate minimum investment (100 USDC = 100_000_000 with 6 decimals)
        require!(amount >= 100_000_000, ErrorCode::BelowMinimumInvestment);

        // Execute USDC transfer from investor to program escrow
        let cpi_accounts = Transfer {
            from: ctx.accounts.investor_token_account.to_account_info(),
            to: ctx.accounts.program_escrow_ata.to_account_info(),
            authority: ctx.accounts.investor.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Create immutable investment record
        let record = &mut ctx.accounts.investment_record;
        record.investor = *ctx.accounts.investor.key;
        record.investment_id = investment_id;
        record.principal_usd = amount;
        record.investment_date = ctx.accounts.clock.unix_timestamp;
        record.current_value = amount; // Initially equals principal
        record.bump = ctx.bumps.investment_record;

        msg!("✅ Investment of {} USDC successfully recorded", amount / 1_000_000);
        Ok(())
    }

    /// Admin function to initialize the program escrow
    pub fn initialize_escrow(ctx: Context<InitializeEscrow>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow_account;
        escrow.admin = ctx.accounts.admin.key();
        escrow.total_invested = 0;
        escrow.total_investors = 0;
        escrow.bump = ctx.bumps.escrow_account;

        msg!("✅ Escrow initialized by admin: {}", escrow.admin);
        Ok(())
    }

    /// Admin function to distribute returns to an investor
    pub fn distribute_returns(
        ctx: Context<DistributeReturns>,
        return_amount: u64,
    ) -> Result<()> {
        // Verify admin authority
        require!(
            ctx.accounts.escrow_account.admin == ctx.accounts.admin.key(),
            ErrorCode::Unauthorized
        );

        // Transfer returns from escrow to investor
        let escrow_seeds = &[
            b"escrow",
            &[ctx.accounts.escrow_account.bump],
        ];
        let signer = &[&escrow_seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.program_escrow_ata.to_account_info(),
            to: ctx.accounts.investor_token_account.to_account_info(),
            authority: ctx.accounts.escrow_account.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, return_amount)?;

        // Update investment record
        let record = &mut ctx.accounts.investment_record;
        record.current_value += return_amount;

        msg!("✅ Distributed {} USDC in returns", return_amount / 1_000_000);
        Ok(())
    }

    /// Admin function to withdraw funds for project use
    pub fn withdraw_for_project(
        ctx: Context<WithdrawForProject>,
        amount: u64,
    ) -> Result<()> {
        // Verify admin authority
        require!(
            ctx.accounts.escrow_account.admin == ctx.accounts.admin.key(),
            ErrorCode::Unauthorized
        );

        // Transfer funds from escrow to admin
        let escrow_seeds = &[
            b"escrow",
            &[ctx.accounts.escrow_account.bump],
        ];
        let signer = &[&escrow_seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.program_escrow_ata.to_account_info(),
            to: ctx.accounts.admin_token_account.to_account_info(),
            authority: ctx.accounts.escrow_account.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;

        msg!("✅ Withdrew {} USDC for project", amount / 1_000_000);
        Ok(())
    }
}

// ============================================================================
// ACCOUNT STRUCTURES
// ============================================================================

/// Immutable investment record stored on-chain
#[account]
pub struct InvestmentRecord {
    pub investor: Pubkey,        // Investor's wallet address
    pub investment_id: String,   // Investment opportunity ID
    pub principal_usd: u64,      // Original USDC amount invested
    pub current_value: u64,      // Current value including returns
    pub investment_date: i64,    // Unix timestamp
    pub bump: u8,                // PDA bump seed
}

/// Program escrow account (holds admin info and stats)
#[account]
pub struct EscrowAccount {
    pub admin: Pubkey,           // Admin wallet address
    pub total_invested: u64,     // Total USDC invested across all opportunities
    pub total_investors: u32,    // Total number of unique investors
    pub bump: u8,                // PDA bump seed
}

// ============================================================================
// ACCOUNT CONTEXTS
// ============================================================================

#[derive(Accounts)]
#[instruction(amount: u64, investment_id: String)]
pub struct InvestUSD<'info> {
    /// Investor who signs the transaction
    #[account(mut)]
    pub investor: Signer<'info>,

    /// Investor's USDC token account (source of funds)
    #[account(
        mut,
        token::mint = usdc_mint,
        token::authority = investor
    )]
    pub investor_token_account: Account<'info, TokenAccount>,

    /// Program's escrow token account (destination of funds)
    #[account(
        mut,
        token::mint = usdc_mint
    )]
    pub program_escrow_ata: Account<'info, TokenAccount>,

    /// Investment record PDA (created and initialized here)
    #[account(
        init,
        payer = investor,
        space = 8 + 32 + 50 + 8 + 8 + 8 + 1, // discriminator + pubkey + string + u64*3 + u8
        seeds = [b"investment", investor.key().as_ref(), investment_id.as_bytes()],
        bump
    )]
    pub investment_record: Account<'info, InvestmentRecord>,

    /// USDC mint account
    #[account(address = usdc_mint_key::ID)]
    pub usdc_mint: Account<'info, Mint>,

    /// SPL Token program
    pub token_program: Program<'info, Token>,

    /// System program
    pub system_program: Program<'info, System>,

    /// Clock sysvar for timestamp
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct InitializeEscrow<'info> {
    /// Admin who initializes the escrow
    #[account(mut)]
    pub admin: Signer<'info>,

    /// Escrow account PDA
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 8 + 4 + 1,
        seeds = [b"escrow"],
        bump
    )]
    pub escrow_account: Account<'info, EscrowAccount>,

    /// System program
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DistributeReturns<'info> {
    /// Admin who distributes returns
    pub admin: Signer<'info>,

    /// Escrow account
    #[account(seeds = [b"escrow"], bump = escrow_account.bump)]
    pub escrow_account: Account<'info, EscrowAccount>,

    /// Investment record to update
    #[account(mut)]
    pub investment_record: Account<'info, InvestmentRecord>,

    /// Program's escrow token account
    #[account(mut)]
    pub program_escrow_ata: Account<'info, TokenAccount>,

    /// Investor's token account (receives returns)
    #[account(mut)]
    pub investor_token_account: Account<'info, TokenAccount>,

    /// SPL Token program
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct WithdrawForProject<'info> {
    /// Admin who withdraws funds
    pub admin: Signer<'info>,

    /// Escrow account
    #[account(seeds = [b"escrow"], bump = escrow_account.bump)]
    pub escrow_account: Account<'info, EscrowAccount>,

    /// Program's escrow token account
    #[account(mut)]
    pub program_escrow_ata: Account<'info, TokenAccount>,

    /// Admin's token account (receives funds)
    #[account(mut)]
    pub admin_token_account: Account<'info, TokenAccount>,

    /// SPL Token program
    pub token_program: Program<'info, Token>,
}

// ============================================================================
// ERRORS
// ============================================================================

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized: Not an admin")]
    Unauthorized,
    #[msg("Amount below minimum investment (100 USDC)")]
    BelowMinimumInvestment,
}

    /// Initialize the admin account
    /// Only needs to be called once to set up the program
    pub fn initialize_admin(ctx: Context<InitializeAdmin>, admin_pubkeys: Vec<Pubkey>) -> Result<()> {
        let admin_account = &mut ctx.accounts.admin_account;
        admin_account.admins = admin_pubkeys;
        admin_account.bump = ctx.bumps.admin_account;
        
        msg!("Admin account initialized with {} admins", admin_account.admins.len());
        Ok(())
    }

    /// Create a new investment opportunity
    /// Can only be called by authorized admins
    pub fn create_investment(
        ctx: Context<CreateInvestment>,
        investment_id: String,
        name: String,
        target_amount: u64,
        min_investment: u64,
        expected_yield: u16, // Basis points (e.g., 1500 = 15%)
        duration_days: u32,
    ) -> Result<()> {
        require!(
            ctx.accounts.admin_account.admins.contains(&ctx.accounts.admin.key()),
            ErrorCode::Unauthorized
        );

        let investment = &mut ctx.accounts.investment_account;
        investment.id = investment_id;
        investment.name = name;
        investment.admin = ctx.accounts.admin.key();
        investment.target_amount = target_amount;
        investment.total_raised = 0;
        investment.min_investment = min_investment;
        investment.expected_yield = expected_yield;
        investment.duration_days = duration_days;
        investment.status = InvestmentStatus::Active;
        investment.created_at = Clock::get()?.unix_timestamp;
        investment.bump = ctx.bumps.investment_account;

        msg!("Investment created: {}", investment.name);
        Ok(())
    }

    /// Invest USDC into an opportunity
    /// Transfers USDC from investor to escrow
    pub fn invest_usd(
        ctx: Context<InvestUSD>,
        amount: u64,
    ) -> Result<()> {
        let investment = &mut ctx.accounts.investment_account;
        
        // Validate investment is active
        require!(
            investment.status == InvestmentStatus::Active,
            ErrorCode::InvestmentNotActive
        );

        // Validate minimum investment
        require!(
            amount >= investment.min_investment,
            ErrorCode::BelowMinimumInvestment
        );

        // Transfer USDC from investor to escrow
        let cpi_accounts = Transfer {
            from: ctx.accounts.investor_token_account.to_account_info(),
            to: ctx.accounts.escrow_token_account.to_account_info(),
            authority: ctx.accounts.investor.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Update or create investor account
        let investor_account = &mut ctx.accounts.investor_account;
        investor_account.investor = ctx.accounts.investor.key();
        investor_account.investment = investment.key();
        investor_account.principal += amount;
        investor_account.current_value = investor_account.principal; // Will be updated with returns
        investor_account.invested_at = Clock::get()?.unix_timestamp;
        investor_account.bump = ctx.bumps.investor_account;

        // Update investment total
        investment.total_raised += amount;

        // Check if target reached
        if investment.total_raised >= investment.target_amount {
            investment.status = InvestmentStatus::Funded;
        }

        msg!("Investment of {} USDC successful", amount);
        Ok(())
    }

    /// Distribute returns to investors
    /// Can only be called by admin
    pub fn distribute_returns(
        ctx: Context<DistributeReturns>,
        amount: u64,
    ) -> Result<()> {
        require!(
            ctx.accounts.admin_account.admins.contains(&ctx.accounts.admin.key()),
            ErrorCode::Unauthorized
        );

        // Transfer USDC from escrow to investor
        let investment_id = ctx.accounts.investment_account.id.as_bytes();
        let seeds = &[
            b"escrow",
            investment_id,
            &[ctx.accounts.investment_account.bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.investor_token_account.to_account_info(),
            authority: ctx.accounts.escrow_token_account.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;

        // Update investor account
        let investor_account = &mut ctx.accounts.investor_account;
        investor_account.current_value += amount;

        msg!("Distributed {} USDC in returns", amount);
        Ok(())
    }

    /// Withdraw funds from escrow for project use
    /// Can only be called by admin
    pub fn withdraw_funds(
        ctx: Context<WithdrawFunds>,
        amount: u64,
    ) -> Result<()> {
        require!(
            ctx.accounts.admin_account.admins.contains(&ctx.accounts.admin.key()),
            ErrorCode::Unauthorized
        );

        let investment = &ctx.accounts.investment_account;
        require!(
            investment.status == InvestmentStatus::Funded,
            ErrorCode::InvestmentNotFunded
        );

        // Transfer USDC from escrow to admin
        let investment_id = investment.id.as_bytes();
        let seeds = &[
            b"escrow",
            investment_id,
            &[investment.bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.admin_token_account.to_account_info(),
            authority: ctx.accounts.escrow_token_account.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;

        msg!("Withdrew {} USDC for project", amount);
        Ok(())
    }
}

// ============================================================================
// Contexts
// ============================================================================

#[derive(Accounts)]
pub struct InitializeAdmin<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + AdminAccount::INIT_SPACE,
        seeds = [b"admin"],
        bump
    )]
    pub admin_account: Account<'info, AdminAccount>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(investment_id: String)]
pub struct CreateInvestment<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + InvestmentAccount::INIT_SPACE,
        seeds = [b"investment", investment_id.as_bytes()],
        bump
    )]
    pub investment_account: Account<'info, InvestmentAccount>,
    
    #[account(seeds = [b"admin"], bump)]
    pub admin_account: Account<'info, AdminAccount>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InvestUSD<'info> {
    #[account(mut)]
    pub investment_account: Account<'info, InvestmentAccount>,
    
    #[account(
        init_if_needed,
        payer = investor,
        space = 8 + InvestorAccount::INIT_SPACE,
        seeds = [b"investor", investment_account.id.as_bytes(), investor.key().as_ref()],
        bump
    )]
    pub investor_account: Account<'info, InvestorAccount>,
    
    #[account(mut)]
    pub investor_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub investor: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DistributeReturns<'info> {
    #[account(seeds = [b"admin"], bump)]
    pub admin_account: Account<'info, AdminAccount>,
    
    pub investment_account: Account<'info, InvestmentAccount>,
    
    #[account(mut)]
    pub investor_account: Account<'info, InvestorAccount>,
    
    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub investor_token_account: Account<'info, TokenAccount>,
    
    pub admin: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
    #[account(seeds = [b"admin"], bump)]
    pub admin_account: Account<'info, AdminAccount>,
    
    pub investment_account: Account<'info, InvestmentAccount>,
    
    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub admin_token_account: Account<'info, TokenAccount>,
    
    pub admin: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

// ============================================================================
// Accounts
// ============================================================================

#[account]
#[derive(InitSpace)]
pub struct AdminAccount {
    #[max_len(10)]
    pub admins: Vec<Pubkey>,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct InvestmentAccount {
    #[max_len(50)]
    pub id: String,
    #[max_len(100)]
    pub name: String,
    pub admin: Pubkey,
    pub target_amount: u64,
    pub total_raised: u64,
    pub min_investment: u64,
    pub expected_yield: u16,
    pub duration_days: u32,
    pub status: InvestmentStatus,
    pub created_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct InvestorAccount {
    pub investor: Pubkey,
    pub investment: Pubkey,
    pub principal: u64,
    pub current_value: u64,
    pub invested_at: i64,
    pub bump: u8,
}

// ============================================================================
// Enums & Errors
// ============================================================================

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum InvestmentStatus {
    Active,
    Funded,
    Completed,
    Cancelled,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized: Not an admin")]
    Unauthorized,
    #[msg("Investment is not active")]
    InvestmentNotActive,
    #[msg("Investment is not funded")]
    InvestmentNotFunded,
    #[msg("Amount below minimum investment")]
    BelowMinimumInvestment,
}
