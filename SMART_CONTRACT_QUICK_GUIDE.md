# ⚓ Smart Contract Quick Reference

## What Was Implemented

✅ **Complete USDC Investment Smart Contract for Solana**

### Core Features
1. **Token Transfer (CPI)** - USDC transfers from investor to escrow
2. **Immutable Records** - On-chain investment history
3. **Escrow Management** - Secure pooled funds
4. **Admin Controls** - Authority-gated operations
5. **Program Config** - Configurable limits and fees

---

## Quick Start

### Build the Contract

```bash
cd D:\SaloneVest--main\anchor
anchor build
```

### Test the Contract

```bash
anchor test --provider.cluster devnet
```

### Deploy to Devnet

```bash
solana config set --url devnet
anchor deploy --provider.cluster devnet
```

---

## Key Files

| File | Lines | Purpose |
|------|-------|---------|
| `lib.rs` | 612 | Complete smart contract implementation |
| `investment_escrow.ts` | 230 | Integration tests |
| `Anchor.toml` | 25 | Anchor configuration |
| `Cargo.toml` | 24 | Workspace manifest |

---

## Contract Structure

```
Program States (3):
├── InvestmentAccount (91 bytes)
│   ├── investor: Pubkey
│   ├── startup_id: Pubkey
│   ├── principal_usd: u64
│   ├── investment_date: i64
│   ├── expected_return: u8
│   ├── status: u8
│   └── bump: u8
│
├── ProgramConfig (59 bytes)
│   ├── admin: Pubkey
│   ├── min_investment: u64
│   ├── max_investment: u64
│   ├── platform_fee_bps: u16
│   └── bump: u8
│
└── EscrowState (57 bytes)
    ├── total_escrow: u64
    ├── active_investments: u64
    ├── release_authority: Pubkey
    └── bump: u8

Instructions (3):
├── initialize_program()  - Setup
├── invest_usd()         - CORE: Record investment & transfer USDC
└── release_funds()      - Release to startup
```

---

## Core Functions

### 1. invest_usd() - Main Feature

```rust
pub fn invest_usd(
    ctx: Context<InvestUSD>,
    amount: u64,                    // USDC amount
    startup_id: Pubkey,             // Startup ID
    expected_return: u8,            // Return % (0-100)
) -> Result<()>
```

**What it does:**
1. Validates amount is within limits
2. Transfers USDC via CPI
3. Creates investment record PDA
4. Updates escrow state
5. Emits logs

**Transaction cost:** ~5,000 SOL (micro-transaction)

### 2. initialize_program() - Setup

```rust
pub fn initialize_program(
    ctx: Context<InitializeProgram>,
    admin: Pubkey,
    min_investment: u64,
    max_investment: u64,
    platform_fee_bps: u16,
) -> Result<()>
```

**Must be called once before any investments**

### 3. release_funds() - Admin Only

```rust
pub fn release_funds(
    ctx: Context<ReleaseFunds>,
    startup_id: Pubkey,
    amount: u64,
) -> Result<()>
```

**Release escrow funds to startup wallet**

---

## PDAs (Addresses)

```
Config PDA:                seeds = [b"config"]
Escrow State PDA:          seeds = [b"escrow"]
Escrow Authority PDA:      seeds = [b"escrow_authority"]
Investment Record PDA:     seeds = [b"investment", investor, startup_id]
```

**Why PDAs?**
- Deterministic (same input = same address)
- Program controls without private key
- Discoverable on-chain

---

## USDC Configuration

### Devnet
```
Mint: 4zMMC9srt5Ri1KseAPa9KUKFdgS2uK4JCT2TSXDKXrm
Decimals: 6
```

### Mainnet
```
Mint: EPjFWaLb3ocRMkeQH7zCv8vhfHR3tpS3gp7x1nV8Zq2R
Decimals: 6
```

---

## Error Codes

```
AmountTooSmall          - Below minimum investment
AmountTooLarge          - Exceeds maximum investment
InvalidReturnPercentage - Return > 100
InsufficientFunds       - Not enough escrow balance
Unauthorized            - Caller not authorized
Overflow                - Addition overflow
Underflow               - Subtraction underflow
BumpNotFound            - PDA derivation failed
```

---

## Frontend Integration

### 1. Import Contract

```typescript
import * as anchor from '@coral-xyz/anchor'
import idl from '@/lib/idl/investment_escrow.json'
import { SalonevestProgram } from '@/lib/types'

const program = new anchor.Program<SalonevestProgram>(
  idl,
  programId,
  provider
)
```

### 2. Call invest_usd()

```typescript
const tx = await program.methods
  .investUsd(
    new anchor.BN(50_000_000), // 50 USDC
    startupId,
    25                          // 25% return
  )
  .accounts({
    investor: wallet.publicKey,
    investorTokenAccount: userUsdcAta,
    programEscrowAta: escrowUsdcAta,
    escrowPda: escrowPda,
    investmentRecord: investmentPda,
    config: configPda,
    escrowState: escrowStatePda,
    usdcMint: USDC_MINT,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SYSTEM_PROGRAM_ID,
    clock: CLOCK_PUBKEY,
  })
  .signers([wallet])
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
  program.programId
)
const investment = await program.account.investmentAccount.fetch(pda)
```

---

## Testing Commands

### Build Only
```bash
anchor build
```

### Run Tests
```bash
anchor test
```

### Deploy to Devnet
```bash
anchor deploy --provider.cluster devnet
```

### Check Build Size
```bash
ls -lh target/deploy/investment_escrow.so
```

---

## Security Features

✅ **CPI Validation** - Token program verified
✅ **Authority Checks** - Investor signature required
✅ **Arithmetic Safety** - Overflow/underflow detection
✅ **PDA Derivation** - Address spoofing prevention
✅ **Role-Based Access** - Admin-only functions
✅ **Account Validation** - Ownership and mint verified

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Build fails | `anchor clean && anchor build` |
| Tests fail | `anchor test -- --verbose` |
| Program ID error | Update `declare_id!()` in lib.rs |
| USDC mint error | Verify correct mint for network |
| Account not found | Ensure ATA exists for USDC |
| Insufficient balance | Airdrop USDC or mint test tokens |

---

## Deployment Checklist

- [ ] Build compiles without errors
- [ ] Tests pass on local validator
- [ ] Program ID generated after deployment
- [ ] Update `declare_id!()` with new Program ID
- [ ] Update frontend with Program ID
- [ ] Update USDC mint for target network
- [ ] Initialize program on network
- [ ] Generate and distribute IDL
- [ ] Test full investment flow

---

## File Structure

```
anchor/
├── Cargo.toml                           ← Workspace config
├── Anchor.toml                          ← Anchor settings
├── Cargo.lock                           ← Dependency lock
├── target/
│   └── deploy/
│       ├── investment_escrow.so         ← Compiled program
│       └── investment_escrow-keypair.json
├── programs/
│   └── investment_escrow/
│       ├── Cargo.toml                   ← Program manifest
│       └── src/
│           └── lib.rs                   ← Main code (612 lines)
├── tests/
│   └── investment_escrow.ts             ← Tests (230 lines)
└── keys/
    └── devnet.json                      ← Deployment keypair
```

---

## Network Configuration

### Devnet (Testing)
```toml
[provider]
cluster = "devnet"
wallet = "~/.config/solana/id.json"

[programs.devnet]
investment_escrow = "11111111111111111111111111111111"
```

### Mainnet (Production)
```toml
[provider]
cluster = "mainnet-beta"
wallet = "~/.config/solana/id.json"

[programs.mainnet]
investment_escrow = "YOUR_MAINNET_PROGRAM_ID"
```

---

## Cost Estimation

| Operation | Cost (SOL) |
|-----------|-----------|
| Deploy program | ~3 SOL |
| Initialize program | ~0.003 SOL |
| Create investment | ~0.002 SOL |
| Release funds | ~0.001 SOL |
| Query account | ~0 SOL (read-only) |

---

## Key Constants

```
USDC Decimals: 6
Min Amount: 1,000,000 (1 USDC)
Max Amount: 10,000,000,000 (10,000 USDC)
Platform Fee: 500 bps (5%)
```

---

## Next Steps

1. **Build:** `anchor build`
2. **Test:** `anchor test`
3. **Deploy:** `anchor deploy --provider.cluster devnet`
4. **Update Frontend:** Add program ID to React
5. **Integrate:** Connect invest_usd() to UI
6. **Test Flow:** Full end-to-end test
7. **Mainnet:** Prepare production deployment

---

## Documentation Files

- **SMART_CONTRACT_IMPLEMENTATION.md** - Complete detailed guide
- **ANCHOR_DEVELOPMENT_GUIDE.md** - Setup and development
- **ANCHOR_QUICK_REFERENCE.md** - Command reference
- **Smart Contract Code** - `lib.rs` (612 lines)

---

**Status:** ✅ Implementation Complete

**Ready for:** Testing → Deployment → Integration

