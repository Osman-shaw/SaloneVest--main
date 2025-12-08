# ⚓ Anchor Smart Contract Development Guide

## Quick Start

### Prerequisites ✓
- ✅ Rust 1.91.1 installed
- ✅ Cargo installed
- ✅ WASM target (wasm32-unknown-unknown) installed
- ⏳ Anchor AVM installing...

## Installation Progress

### Current Status
```
$ cargo install --git https://github.com/coral-xyz/anchor avm --locked
[Downloading Anchor from GitHub...]
Progress: ~7%
Estimated Time: 10-15 minutes
```

### When Installation Completes

Verify it worked:
```bash
avm --version
# Should show: avm 0.x.x
```

## Project Structure

Your smart contract project should look like:

```
D:\SaloneVest--main\anchor\
├── Cargo.toml                 # Workspace config
├── Anchor.toml                # Anchor config
├── anprograms/
│   └── investment_escrow/     # Smart contract
│       ├── src/
│       │   └── lib.rs        # Contract code
│       └── Cargo.toml
├── tests/
│   └── investment_escrow.ts  # Tests in TypeScript
└── migrations/
    └── deploy.js             # Deployment script
```

## Key Files Already Present

### In `/anchor/templates/`
- **lib.rs** - Rust smart contract template
- **investment_escrow.ts** - TypeScript test template
- **Anchor.toml** - Project configuration
- **deploy.sh** - Deployment script

## Common Anchor Commands

Once Anchor is installed:

### Initialize Project
```bash
cd D:\SaloneVest--main\anchor
anchor init investment_contract
```

### Build Contract
```bash
anchor build
# Outputs to: target/deploy/
```

### Run Tests
```bash
anchor test
# Runs tests in tests/
```

### Deploy to Devnet
```bash
anchor deploy --provider.cluster devnet
```

### Get IDL (Interface Definition Language)
```bash
anchor idl fetch <PROGRAM_ID>
```

## Smart Contract Basics

### What We're Building
- **Investment Escrow Contract**
- Holds funds until conditions met
- Manages investor → company payments
- Handles refunds if needed

### Key Components

#### 1. Program (Smart Contract)
```rust
// In: programs/investment_escrow/src/lib.rs
#[program]
pub mod investment_escrow {
    pub fn initialize_escrow(ctx: Context<Initialize>) -> Result<()> {
        // Smart contract logic
    }
}
```

#### 2. Accounts
Solana accounts that store data:
- Escrow account (holds funds)
- Investor account (deposits)
- Company account (receives)

#### 3. Instructions
Functions users can call:
- Initialize escrow
- Deposit funds
- Release funds
- Refund funds

## Setting Up the Project

### Step 1: Verify Anchor Installation
```bash
avm --version
avm list
```

### Step 2: Install Specific Anchor Version
```bash
avm install 0.30.0
avm use 0.30.0
anchor --version
```

### Step 3: Set Up Project
```bash
cd D:\SaloneVest--main\anchor
anchor build
```

### Step 4: Configure for Devnet
Edit `Anchor.toml`:
```toml
[provider]
cluster = "devnet"
wallet = "~/.config/solana/id.json"

[programs.devnet]
investment_escrow = "..."
```

### Step 5: Run Tests
```bash
anchor test
```

## Frontend Integration

After deploying to Devnet:

### 1. Get Program ID
```bash
solana program show <program-keypair.json>
```

### 2. Generate IDL
```bash
anchor idl fetch <PROGRAM_ID> -o frontend/lib/idl/investment_escrow.json
```

### 3. Use in Frontend
```typescript
// In frontend
import * as anchor from '@coral-xyz/anchor'
import idl from '@/lib/idl/investment_escrow.json'

const program = new anchor.Program(idl, programId, provider)
```

## Deployment Checklist

- [ ] Anchor installed and verified
- [ ] Smart contract builds without errors
- [ ] Tests pass
- [ ] Solana CLI configured
- [ ] Wallet funded on devnet
- [ ] Program deployed to devnet
- [ ] IDL generated
- [ ] Frontend integrated
- [ ] End-to-end testing complete

## Troubleshooting

### Build Errors
```bash
# Clean build
anchor clean
anchor build
```

### Test Failures
```bash
# Run with verbose output
anchor test --verbose
```

### Deployment Issues
```bash
# Check wallet
solana config get

# Fund wallet
solana airdrop 2 <WALLET_ADDRESS> --url devnet
```

### Network Issues
```bash
# Check network status
solana network-status --url devnet

# Switch RPC endpoint
solana config set --url https://api.devnet.solana.com
```

## Environment Configuration

### .env File for Backend
```
SOLANA_NETWORK=devnet
PROGRAM_ID=<your-program-id>
SOLANA_RPC=https://api.devnet.solana.com
```

### Configuration Files
- `Anchor.toml` - Anchor settings
- `.env` - Environment variables
- `Cargo.toml` - Rust dependencies

## Best Practices

### 1. Use Devnet First
```bash
# Always test on devnet before mainnet
solana config set --url devnet
```

### 2. Security Considerations
- Validate all inputs
- Check account permissions
- Use secure RNG for numbers
- Test edge cases

### 3. Cost Optimization
- Minimize account size
- Batch transactions when possible
- Use PDAs (Program Derived Accounts)

### 4. Testing Strategy
- Unit tests in Rust
- Integration tests in TypeScript
- Manual testing on devnet
- Production testing on devnet-beta

## Next Steps

1. **Wait for Anchor Installation to Complete**
   - Monitor terminal output
   - Should see: "Installed avm vX.X.X"

2. **Verify Installation**
   ```bash
   avm --version
   ```

3. **Set Up Solana CLI**
   ```bash
   solana --version
   solana config set --url devnet
   ```

4. **Create Keypair**
   ```bash
   solana-keygen new --outfile ~/.config/solana/id.json
   ```

5. **Fund Wallet**
   ```bash
   solana airdrop 2 <PUBLIC_KEY> --url devnet
   ```

6. **Build Project**
   ```bash
   cd anchor
   anchor build
   ```

7. **Run Tests**
   ```bash
   anchor test --provider.cluster devnet
   ```

## Resources

- **Anchor Docs:** https://www.anchor-lang.com/
- **Solana Docs:** https://docs.solana.com/
- **Solana Cookbook:** https://solanacookbook.com/
- **Anchor Examples:** https://github.com/coral-xyz/anchor/tree/master/examples

## File Locations

```
Frontend IDL:     D:\SaloneVest--main\frontend\lib\idl\investment_escrow.json
Smart Contract:   D:\SaloneVest--main\anchor\programs\investment_escrow\src\lib.rs
Tests:            D:\SaloneVest--main\anchor\tests\investment_escrow.ts
Configuration:    D:\SaloneVest--main\anchor\Anchor.toml
```

## Summary

**Installation Status:**
- ✅ Rust toolchain ready
- ✅ WASM support ready
- ⏳ Anchor AVM installing (should complete soon)

**Next Action:** Verify Anchor installation when it completes

**Expected Time:** 10-15 minutes for installation to finish

