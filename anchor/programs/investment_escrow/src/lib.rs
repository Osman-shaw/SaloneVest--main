use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer, TokenAccount, Token, Mint};

// ============================================================================
// PROGRAM ID & CONFIGURATION
// ============================================================================

// Program ID (Placeholder - Replace after deployment)
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

// USDC Mint Address (Devnet: 4zMMC9srt5Ri1KseAPa9KUKFdgS2uK4JCT2TSXDKXrm)
pub mod usdc_mint_key {
    use anchor_lang::prelude::declare_id;
    declare_id!("4zMMC9srt5Ri1KseAPa9KUKFdgS2uK4JCT2TSXDKXrm");
}

// ============================================================================
// STATE ACCOUNTS
// ============================================================================

/// Investment Record - Immutable record of each investment transaction
/// Stored in a Program Derived Address (PDA) for security and discoverability
#[account]
pub struct InvestmentAccount {
    /// Investor's Phantom Wallet Public Key
    pub investor: Pubkey,
    /// Investment Asset's unique identifier
    pub startup_id: Pubkey,
    /// USDC amount invested (in lamports)
    pub principal_usd: u64,
    /// Investment transaction timestamp
    pub investment_date: i64,
    /// Expected return percentage (0-100)
    pub expected_return: u8,
    /// Investment status (0: Active, 1: Completed, 2: Cancelled)
    pub status: u8,
    /// PDA bump seed for address derivation
    pub bump: u8,
}

impl InvestmentAccount {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 8 + 1 + 1 + 1; // Discriminator + fields
}

/// Program Config - Admin settings for the investment program
#[account]
pub struct ProgramConfig {
    /// Admin wallet with authority to manage settings
    pub admin: Pubkey,
    /// Minimum investment amount (in USDC lamports)
    pub min_investment: u64,
    /// Maximum investment amount per transaction
    pub max_investment: u64,
    /// Platform fee percentage (0-100, represents basis points)
    pub platform_fee_bps: u16,
    /// PDA bump
    pub bump: u8,
}

impl ProgramConfig {
    pub const LEN: usize = 8 + 32 + 8 + 8 + 2 + 1;
}

/// Escrow State - Tracks pooled funds and state
#[account]
pub struct EscrowState {
    /// Total USDC held in escrow
    pub total_escrow: u64,
    /// Total number of active investments
    pub active_investments: u64,
    /// Authority that can release funds
    pub release_authority: Pubkey,
    /// PDA bump
    pub bump: u8,
}

impl EscrowState {
    pub const LEN: usize = 8 + 8 + 8 + 32 + 1;
}

// ============================================================================
// INSTRUCTION CONTEXTS
// ============================================================================

/// Initialize the program (admin only)
#[derive(Accounts)]
#[instruction(admin: Pubkey)]
pub struct InitializeProgram<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = ProgramConfig::LEN,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, ProgramConfig>,

    #[account(
        init,
        payer = payer,
        space = EscrowState::LEN,
        seeds = [b"escrow"],
        bump
    )]
    pub escrow_state: Account<'info, EscrowState>,

    pub system_program: Program<'info, System>,
}

/// Investment context - Core feature for USDC transfers
#[derive(Accounts)]
#[instruction(amount: u64, startup_id: Pubkey)]
pub struct InvestUSD<'info> {
    /// The investor who signs and authorizes the transaction
    #[account(mut)]
    pub investor: Signer<'info>,

    /// Investor's USDC Token Account (source of funds)
    /// Must have sufficient balance for the investment
    #[account(
        mut,
        token::mint = usdc_mint,
        token::authority = investor
    )]
    pub investor_token_account: Account<'info, TokenAccount>,

    /// Program's Escrow Token Account (destination)
    /// Holds pooled USDC from all investors
    #[account(
        mut,
        token::mint = usdc_mint,
        token::authority = escrow_pda
    )]
    pub program_escrow_ata: Account<'info, TokenAccount>,

    /// Escrow PDA authority (seeds: ["escrow_authority"])
    /// Derived PDA that controls the escrow account
    /// CHECK: This is a PDA, verified by seeds
    #[account(
        seeds = [b"escrow_authority"],
        bump
    )]
    pub escrow_pda: UncheckedAccount<'info>,

    /// Investment record PDA - Created here, stores immutable investment data
    /// Unique per investor per startup (derived from seeds)
    #[account(
        init,
        payer = investor,
        space = InvestmentAccount::LEN,
        seeds = [b"investment", investor.key().as_ref(), startup_id.as_ref()],
        bump
    )]
    pub investment_record: Account<'info, InvestmentAccount>,

    /// Program configuration account
    #[account(seeds = [b"config"], bump)]
    pub config: Account<'info, ProgramConfig>,

    /// Escrow state account
    #[account(mut, seeds = [b"escrow"], bump)]
    pub escrow_state: Account<'info, EscrowState>,

    /// USDC Mint (SPL Token standard)
    #[account(address = usdc_mint_key::ID)]
    pub usdc_mint: Account<'info, Mint>,

    /// SPL Token Program (for CPI calls)
    pub token_program: Program<'info, Token>,

    /// System Program (for account creation)
    pub system_program: Program<'info, System>,

    /// Clock Sysvar (for timestamps)
    pub clock: Sysvar<'info, Clock>,
}

/// Release funds from escrow (admin/authority only)
#[derive(Accounts)]
#[instruction(startup_id: Pubkey)]
pub struct ReleaseFunds<'info> {
    #[account(mut)]
    pub release_authority: Signer<'info>,

    #[account(mut, seeds = [b"escrow"], bump)]
    pub escrow_state: Account<'info, EscrowState>,

    #[account(seeds = [b"config"], bump)]
    pub config: Account<'info, ProgramConfig>,

    #[account(
        mut,
        token::mint = usdc_mint,
        token::authority = escrow_pda
    )]
    pub escrow_ata: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = usdc_mint
    )]
    pub destination_ata: Account<'info, TokenAccount>,

    /// CHECK: This is a PDA, verified by seeds
    #[account(
        seeds = [b"escrow_authority"],
        bump
    )]
    pub escrow_pda: UncheckedAccount<'info>,

    #[account(address = usdc_mint_key::ID)]
    pub usdc_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
}

// ============================================================================
// PROGRAM LOGIC
// ============================================================================

#[program]
pub mod salonevest_program {
    use super::*;

    /// Initialize the program with configuration
    /// This must be called once by the admin before any investments can occur
    pub fn initialize_program(
        ctx: Context<InitializeProgram>,
        admin: Pubkey,
        min_investment: u64,
        max_investment: u64,
        platform_fee_bps: u16,
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.admin = admin;
        config.min_investment = min_investment;
        config.max_investment = max_investment;
        config.platform_fee_bps = platform_fee_bps;
        config.bump = ctx.bumps.get("config").copied().ok_or(error!(ErrorCode::BumpNotFound))?;

        let escrow_state = &mut ctx.accounts.escrow_state;
        escrow_state.total_escrow = 0;
        escrow_state.active_investments = 0;
        escrow_state.release_authority = admin;
        escrow_state.bump = ctx.bumps.get("escrow_state").copied().ok_or(error!(ErrorCode::BumpNotFound))?;

        msg!("✅ SaloneVest Program initialized successfully");
        msg!("   Admin: {}", admin);
        msg!("   Min Investment: {} USDC", min_investment);
        msg!("   Max Investment: {} USDC", max_investment);
        msg!("   Platform Fee: {}%", platform_fee_bps as f32 / 100.0);

        Ok(())
    }

    /// CORE FEATURE: invest_usd
    /// 
    /// Executes a USDC investment by:
    /// 1. Transferring USDC from investor to program escrow (Cross-Program Invocation)
    /// 2. Creating an immutable investment record in a PDA
    /// 3. Updating escrow state
    ///
    /// Security features:
    /// - Token amount validated against config limits
    /// - Investor wallet signature required
    /// - USDC mint verified
    /// - Investment record uniquely derived (prevents duplicates)
    pub fn invest_usd(
        ctx: Context<InvestUSD>,
        amount: u64,
        startup_id: Pubkey,
        expected_return: u8,
    ) -> Result<()> {
        let config = &ctx.accounts.config;

        // ===== VALIDATION =====
        require!(amount >= config.min_investment, ErrorCode::AmountTooSmall);
        require!(amount <= config.max_investment, ErrorCode::AmountTooLarge);
        require!(expected_return <= 100, ErrorCode::InvalidReturnPercentage);

        // ===== FEATURE 1: USDC TOKEN TRANSFER (CPI) =====
        // This executes the payment in the same atomic transaction
        // No fees are deducted by this contract (passed through as-is)
        let cpi_accounts = Transfer {
            from: ctx.accounts.investor_token_account.to_account_info(),
            to: ctx.accounts.program_escrow_ata.to_account_info(),
            authority: ctx.accounts.investor.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        // Execute the USDC transfer
        token::transfer(cpi_ctx, amount)?;

        // ===== FEATURE 2: IMMUTABLE INVESTMENT RECORD =====
        // Store the transaction details in a PDA for permanent record
        let investment_record = &mut ctx.accounts.investment_record;
        investment_record.investor = ctx.accounts.investor.key();
        investment_record.startup_id = startup_id;
        investment_record.principal_usd = amount;
        investment_record.investment_date = ctx.accounts.clock.unix_timestamp;
        investment_record.expected_return = expected_return;
        investment_record.status = 0; // 0 = Active
        investment_record.bump = ctx.bumps.get("investment_record").copied().ok_or(error!(ErrorCode::BumpNotFound))?;

        // ===== UPDATE ESCROW STATE =====
        let escrow_state = &mut ctx.accounts.escrow_state;
        escrow_state.total_escrow = escrow_state
            .total_escrow
            .checked_add(amount)
            .ok_or(error!(ErrorCode::Overflow))?;
        escrow_state.active_investments = escrow_state
            .active_investments
            .checked_add(1)
            .ok_or(error!(ErrorCode::Overflow))?;

        // ===== LOGGING & EVENTS =====
        msg!("✅ SaloneVest Investment Recorded");
        msg!("   Investor: {}", ctx.accounts.investor.key());
        msg!("   Amount: {} USDC", amount);
        msg!("   Startup: {}", startup_id);
        msg!("   Expected Return: {}%", expected_return);
        msg!("   Timestamp: {}", ctx.accounts.clock.unix_timestamp);
        msg!("   Total Escrow: {} USDC", escrow_state.total_escrow);

        Ok(())
    }

    /// Release funds from escrow to a startup wallet
    /// Authority-gated instruction (only admin/release_authority can call)
    pub fn release_funds(
        ctx: Context<ReleaseFunds>,
        startup_id: Pubkey,
        amount: u64,
    ) -> Result<()> {
        require!(
            ctx.accounts.release_authority.key() == ctx.accounts.escrow_state.release_authority,
            ErrorCode::Unauthorized
        );

        require!(
            ctx.accounts.escrow_ata.amount >= amount,
            ErrorCode::InsufficientFunds
        );

        // Create a signer bump for the escrow PDA
        let escrow_bump = ctx.bumps.get("escrow_pda").copied().ok_or(error!(ErrorCode::BumpNotFound))?;
        let signer_seeds: &[&[&[u8]]] = &[&[b"escrow_authority", &[escrow_bump]]];

        // Transfer USDC from escrow to destination
        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_ata.to_account_info(),
            to: ctx.accounts.destination_ata.to_account_info(),
            authority: ctx.accounts.escrow_pda.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        token::transfer(cpi_ctx, amount)?;

        // Update escrow state
        ctx.accounts.escrow_state.total_escrow = ctx.accounts.escrow_state
            .total_escrow
            .checked_sub(amount)
            .ok_or(error!(ErrorCode::Underflow))?;

        msg!("✅ Funds Released");
        msg!("   Startup: {}", startup_id);
        msg!("   Amount: {} USDC", amount);
        msg!("   Remaining Escrow: {} USDC", ctx.accounts.escrow_state.total_escrow);

        Ok(())
    }
}

// ============================================================================
// ERROR CODES
// ============================================================================

#[error_code]
pub enum ErrorCode {
    #[msg("Investment amount is below minimum")]
    AmountTooSmall,

    #[msg("Investment amount exceeds maximum")]
    AmountTooLarge,

    #[msg("Invalid return percentage (must be 0-100)")]
    InvalidReturnPercentage,

    #[msg("Insufficient funds in escrow")]
    InsufficientFunds,

    #[msg("Unauthorized access")]
    Unauthorized,

    #[msg("Arithmetic overflow")]
    Overflow,

    #[msg("Arithmetic underflow")]
    Underflow,

    #[msg("Bump not found in context")]
    BumpNotFound,
}
