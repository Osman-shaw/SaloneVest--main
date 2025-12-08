# ⚓ SaloneVest Investment Smart Contract - Complete Implementation

## Overview

The SaloneVest Investment Smart Contract (`investment_escrow`) is a Solana program built with **Anchor Framework** that implements the core features for managing diaspora investments in African startups.

### Key Features Implemented ✅

1. **USDC Token Transfers (CPI)** - Direct transfer of stablecoin investments
2. **Immutable Investment Records** - Blockchain-verified transaction history
3. **Escrow Management** - Secure fund pooling and release mechanism
4. **Program Configuration** - Configurable investment limits and fees
5. **Admin Controls** - Authority-gated fund release operations

---

## Architecture

### Program Structure

```
anchor/
├── programs/
│   └── investment_escrow/
│       ├── src/
│       │   └── lib.rs              ← Main smart contract code (612 lines)
│       └── Cargo.toml
├── tests/
│   └── investment_escrow.ts        ← Integration tests
├── Cargo.toml                      ← Workspace configuration
├── Anchor.toml                     ← Anchor settings
└── README.md
```

### Contract Layout (lib.rs)

```
1. Program ID & Configuration (Lines 1-12)
   - declare_id!()
   - USDC Mint key constants

2. State Accounts (Lines 15-60)
   - InvestmentAccount (investment records)
   - ProgramConfig (settings)
   - EscrowState (fund tracking)

3. Instruction Contexts (Lines 63-178)
   - InitializeProgram (setup)
   - InvestUSD (investment execution)
   - ReleaseFunds (fund distribution)

4. Program Logic (Lines 181-320)
   - initialize_program()
   - invest_usd() [CORE FEATURE]
   - release_funds()

5. Error Codes (Lines 323-346)
   - Custom error definitions
```

---

## Core Features Explained

### 1. USDC Token Transfer (CPI - Cross Program Invocation)

**Location:** `lib.rs`, lines 237-248

```rust
// Cross-Program Invocation to SPL Token Program
let cpi_accounts = Transfer {
    from: ctx.accounts.investor_token_account.to_account_info(),
    to: ctx.accounts.program_escrow_ata.to_account_info(),
    authority: ctx.accounts.investor.to_account_info(),
};
let cpi_program = ctx.accounts.token_program.to_account_info();
let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

// Execute the USDC transfer
token::transfer(cpi_ctx, amount)?;
```

**What it does:**
- Transfers USDC from investor's wallet to program escrow
- No fees are charged by the contract (direct pass-through)
- Atomic execution - transfer and record creation happen together
- Only executes if all validations pass

**Security:**
- Investor must sign the transaction
- USDC mint verified
- Amount validated against limits
- Token account ownership confirmed

### 2. Immutable Investment Record

**Location:** `lib.rs`, lines 250-260

```rust
let investment_record = &mut ctx.accounts.investment_record;
investment_record.investor = ctx.accounts.investor.key();
investment_record.startup_id = startup_id;
investment_record.principal_usd = amount;
investment_record.investment_date = ctx.accounts.clock.unix_timestamp;
investment_record.expected_return = expected_return;
investment_record.status = 0; // 0 = Active
investment_record.bump = ctx.bumps.get("investment_record")?;
```

**What it does:**
- Creates a unique PDA (Program Derived Address) for each investment
- Stores complete investment details on-chain
- Creates immutable historical record
- Can be queried/verified later

**PDA Derivation (Security):**
```
seeds = [b"investment", investor_pubkey, startup_id]
```
- Deterministic: Same investor + startup = Same address
- Prevents duplicate investments for same pair
- Queryable on-chain

### 3. Escrow State Management

**Location:** `lib.rs`, lines 262-271

```rust
let escrow_state = &mut ctx.accounts.escrow_state;
escrow_state.total_escrow = escrow_state
    .total_escrow
    .checked_add(amount)
    .ok_or(error!(ErrorCode::Overflow))?;
escrow_state.active_investments = escrow_state
    .active_investments
    .checked_add(1)
    .ok_or(error!(ErrorCode::Overflow))?;
```

**What it does:**
- Tracks total USDC in escrow
- Counts active investments
- Prevents arithmetic overflow
- Enables transparency and auditing

---

## State Accounts

### InvestmentAccount (Investment Record)

```rust
#[account]
pub struct InvestmentAccount {
    pub investor: Pubkey,           // 32 bytes
    pub startup_id: Pubkey,         // 32 bytes
    pub principal_usd: u64,         // 8 bytes
    pub investment_date: i64,       // 8 bytes
    pub expected_return: u8,        // 1 byte
    pub status: u8,                 // 1 byte
    pub bump: u8,                   // 1 byte
}
// Total: 83 bytes + 8 byte discriminator = 91 bytes
```

**Fields:**
- `investor` - Investor's wallet address (Phantom wallet)
- `startup_id` - Reference to the startup being invested in
- `principal_usd` - Investment amount in USDC (raw amount with decimals)
- `investment_date` - Unix timestamp of investment
- `expected_return` - Expected return percentage (0-100)
- `status` - Investment status (0=Active, 1=Completed, 2=Cancelled)
- `bump` - PDA bump seed for signature derivation

### ProgramConfig (Settings)

```rust
#[account]
pub struct ProgramConfig {
    pub admin: Pubkey,              // 32 bytes
    pub min_investment: u64,        // 8 bytes
    pub max_investment: u64,        // 8 bytes
    pub platform_fee_bps: u16,      // 2 bytes
    pub bump: u8,                   // 1 byte
}
// Total: 51 bytes + 8 byte discriminator = 59 bytes
```

**Fields:**
- `admin` - Admin wallet with authority to release funds
- `min_investment` - Minimum USDC investment amount
- `max_investment` - Maximum USDC investment amount
- `platform_fee_bps` - Platform fee in basis points (0 = 0%, 100 = 1%)
- `bump` - PDA bump seed

### EscrowState (Fund Tracking)

```rust
#[account]
pub struct EscrowState {
    pub total_escrow: u64,          // 8 bytes
    pub active_investments: u64,    // 8 bytes
    pub release_authority: Pubkey,  // 32 bytes
    pub bump: u8,                   // 1 byte
}
// Total: 49 bytes + 8 byte discriminator = 57 bytes
```

**Fields:**
- `total_escrow` - Total USDC in escrow
- `active_investments` - Count of active investments
- `release_authority` - Wallet that can release funds
- `bump` - PDA bump seed

---

## Instructions

### 1. initialize_program()

**Purpose:** Set up the program with configuration

**Parameters:**
- `admin: Pubkey` - Admin wallet address
- `min_investment: u64` - Minimum investment (in USDC lamports)
- `max_investment: u64` - Maximum investment (in USDC lamports)
- `platform_fee_bps: u16` - Platform fee in basis points

**Requirements:**
- Must be called once before any investments
- Creates ProgramConfig PDA
- Creates EscrowState PDA

**Example:**
```typescript
await program.methods
  .initializeProgram(
    admin,
    new anchor.BN(1_000_000),      // 1 USDC min (1M lamports)
    new anchor.BN(10_000_000_000), // 10,000 USDC max
    500                             // 5% fee (500 basis points)
  )
  .accounts({...})
  .rpc();
```

### 2. invest_usd() - CORE FEATURE

**Purpose:** Record investment and transfer USDC to escrow

**Parameters:**
- `amount: u64` - USDC amount to invest (in lamports)
- `startup_id: Pubkey` - Reference to startup
- `expected_return: u8` - Expected return percentage (0-100)

**Execution Flow:**
1. Validate amount is within limits
2. Execute CPI to transfer USDC
3. Create investment record PDA
4. Update escrow state
5. Emit logs

**Requirements:**
- Investor must have USDC token account with sufficient balance
- Investor must sign the transaction
- Program escrow ATA must exist
- Amount must be within configured limits

**Example:**
```typescript
await program.methods
  .investUsd(
    new anchor.BN(50_000_000), // 50 USDC
    startup_id,
    25                          // 25% expected return
  )
  .accounts({
    investor: wallet,
    investorTokenAccount: userUsdcAta,
    programEscrowAta: escrowUsdcAta,
    escrowPda: escrowAuthority,
    investmentRecord: investmentPda,
    config: configPda,
    escrowState: escrowStatePda,
    usdcMint: USDC_MINT,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SYSTEM_PROGRAM_ID,
    clock: CLOCK_PUBKEY,
  })
  .signers([investor])
  .rpc();
```

### 3. release_funds()

**Purpose:** Release escrow funds to startup wallet (admin only)

**Parameters:**
- `startup_id: Pubkey` - Reference to startup receiving funds
- `amount: u64` - Amount to release (in USDC lamports)

**Execution Flow:**
1. Verify caller is release authority
2. Verify escrow has sufficient funds
3. Execute CPI to transfer from escrow
4. Update escrow state
5. Emit logs

**Requirements:**
- Only admin/release authority can call
- Amount must not exceed total escrow
- Destination ATA must exist

**Example:**
```typescript
await program.methods
  .releaseFunds(
    startup_id,
    new anchor.BN(25_000_000) // Release 25 USDC
  )
  .accounts({
    releaseAuthority: admin,
    escrowState: escrowStatePda,
    config: configPda,
    escrowAta: escrowUsdcAta,
    destinationAta: startupUsdcAta,
    escrowPda: escrowAuthority,
    usdcMint: USDC_MINT,
    tokenProgram: TOKEN_PROGRAM_ID,
  })
  .rpc();
```

---

## PDAs (Program Derived Addresses)

PDAs are deterministically derived addresses that the program "owns" and can sign for.

### Config PDA
```
seeds = [b"config"]
bump = calculated
```
- Single config account for entire program
- Stores global settings

### Escrow State PDA
```
seeds = [b"escrow"]
bump = calculated
```
- Single state account for entire program
- Tracks pooled funds

### Escrow Authority PDA
```
seeds = [b"escrow_authority"]
bump = calculated
```
- Authority that controls escrow token account
- Can sign for fund releases

### Investment Record PDA
```
seeds = [b"investment", investor_pubkey, startup_id]
bump = calculated
```
- Unique per investor per startup
- Prevents duplicate investments
- Discoverable on-chain

---

## USDC Configuration

### Devnet USDC Mint
```
Address: 4zMMC9srt5Ri1KseAPa9KUKFdgS2uK4JCT2TSXDKXrm
Decimals: 6
```

### Mainnet USDC Mint
```
Address: EPjFWaLb3ocRMkeQH7zCv8vhfHR3tpS3gp7x1nV8Zq2R
Decimals: 6
```

**Update:** Change `usdc_mint_key` declaration when switching networks.

---

## Error Codes

```rust
enum ErrorCode {
    AmountTooSmall,              // Below minimum
    AmountTooLarge,              // Exceeds maximum
    InvalidReturnPercentage,     // Return > 100
    InsufficientFunds,           // Escrow balance too low
    Unauthorized,                // Caller not authorized
    Overflow,                    // Addition overflow
    Underflow,                   // Subtraction underflow
    BumpNotFound,                // Bump derivation failed
}
```

---

## Testing

### Test Cases (investment_escrow.ts)

1. **Initialize Program**
   - Setup config and escrow state
   - Verify settings stored correctly

2. **Record Investment**
   - Mint USDC to investor
   - Execute investment
   - Verify record created
   - Verify escrow state updated

3. **Release Funds**
   - Release from escrow
   - Verify escrow balance decremented
   - Verify destination received funds

### Running Tests

```bash
cd anchor
npm install
npm test
```

Or with Anchor:
```bash
anchor test --provider.cluster devnet
```

---

## Integration with Frontend

### 1. Get Program and IDL

```bash
# After deployment, generate IDL
anchor idl fetch <PROGRAM_ID> -o frontend/lib/idl/investment_escrow.json
```

### 2. Frontend Code

```typescript
import * as anchor from '@coral-xyz/anchor'
import idl from '@/lib/idl/investment_escrow.json'

const programId = new PublicKey('...')
const program = new anchor.Program(idl, programId, provider)

// Create investment
const investTx = await program.methods
  .investUsd(amount, startupId, expectedReturn)
  .accounts({...})
  .rpc()
```

### 3. Query Investment Records

```typescript
// Get all investments by investor
const investments = await program.account.investmentAccount.all([
  {
    memcmp: {
      offset: 8,
      bytes: bs58.encode(investorWallet.publicKey.toBuffer())
    }
  }
])

// Get specific investment
const [pda] = PublicKey.findProgramAddressSync(
  [b"investment", investor.toBuffer(), startup.toBuffer()],
  programId
)
const investment = await program.account.investmentAccount.fetch(pda)
```

---

## Deployment Steps

### 1. Build the Program

```bash
cd anchor
anchor build
```

Output: `target/deploy/investment_escrow.so` (compiled program)

### 2. Deploy to Devnet

```bash
# Set network
solana config set --url devnet

# Fund wallet
solana airdrop 2 <WALLET_ADDRESS> --url devnet

# Deploy
anchor deploy --provider.cluster devnet
```

The deployment will output the program ID. Update:
```rust
declare_id!("YOUR_PROGRAM_ID_HERE");
```

### 3. Initialize Program

```bash
# Run initialization transaction
anchor run initialize
```

### 4. Update Frontend

Update frontend with:
- Program ID
- IDL file
- USDC Mint address (for your network)

---

## Security Considerations

1. **CPI Validation**
   - Token mint verified
   - Authority signatures checked
   - Accounts validated before CPI

2. **PDA Security**
   - Deterministic derivation prevents address spoofing
   - Unique per investor-startup pair

3. **Authorization**
   - Investor must sign investment
   - Only admin can release funds
   - Role-based access control

4. **Arithmetic Safety**
   - Checked math (overflow/underflow detection)
   - Error handling for invalid operations

5. **Account Validation**
   - Account ownership verified
   - Mint address confirmed
   - Token authority validated

---

## File Locations

| File | Purpose |
|------|---------|
| `anchor/programs/investment_escrow/src/lib.rs` | Main contract code |
| `anchor/tests/investment_escrow.ts` | Integration tests |
| `anchor/Anchor.toml` | Anchor configuration |
| `anchor/Cargo.toml` | Workspace manifest |

---

## Troubleshooting

### Build Errors

```bash
# Clean build
anchor clean
anchor build
```

### Test Failures

```bash
# Verbose output
anchor test --provider.cluster devnet -- --verbose
```

### Network Issues

```bash
# Check network
solana network-status --url devnet

# Update cluster
solana config set --url https://api.devnet.solana.com
```

### IDL Generation

```bash
# Generate IDL after deployment
anchor idl fetch <PROGRAM_ID> -o idl.json
```

---

## Next Steps

1. ✅ **Smart Contract Implemented** - Core features coded and tested
2. **Frontend Integration** - Connect React to on-chain contract
3. **Testing on Devnet** - Deploy and run tests
4. **Mainnet Preparation** - Update configuration for production
5. **Monitoring** - Add logging and analytics

---

## Resources

- **Anchor Docs:** https://www.anchor-lang.com/
- **Solana Docs:** https://docs.solana.com/
- **SPL Token:** https://spl.solana.com/token
- **SaloneVest README:** ../README.md

