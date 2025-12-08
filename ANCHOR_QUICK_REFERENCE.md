# ⚓ Anchor Quick Reference Card

## Installation Status
```
⏳ Installing: Anchor AVM (Anchor Version Manager)
   From: https://github.com/coral-xyz/anchor
   Method: cargo install --git ...
   Progress: ~7% (downloading...)
```

## What Gets Installed
- **avm** - Version manager for Anchor
- **anchor-cli** - Command-line tool
- **Build tools** - Compiler components

## After Installation Completes

### Verify Installation
```powershell
avm --version        # Check avm
anchor --version     # Check anchor-cli
```

### First-Time Setup
```powershell
# Install latest Anchor
avm install latest
avm use latest

# Verify
anchor --version     # Should show: anchor-cli X.XX.X
```

## Essential Commands

### Project Commands
```powershell
anchor init project_name      # Create new project
anchor build                  # Build smart contract
anchor test                   # Run tests
anchor clean                  # Clean build artifacts
```

### Deployment Commands
```powershell
anchor deploy --provider.cluster devnet       # Deploy to devnet
anchor deploy --provider.cluster mainnet-beta # Deploy to mainnet
```

### IDL Commands
```powershell
anchor idl fetch <PROGRAM_ID>                # Get IDL
anchor idl init <PROGRAM_ID> idl.json        # Initialize IDL
```

## File Structure
```
anchor/
├── programs/
│   └── program_name/
│       ├── src/
│       │   └── lib.rs        ← Your smart contract
│       └── Cargo.toml
├── tests/
│   └── tests.ts              ← TypeScript tests
├── Anchor.toml               ← Configuration
└── Cargo.toml                ← Workspace config
```

## Key Configuration (Anchor.toml)
```toml
[provider]
cluster = "devnet"
wallet = "~/.config/solana/id.json"

[programs.devnet]
my_program = "ProgramIDHere..."
```

## Solana CLI Setup
```powershell
# Install (if needed)
npm install -g @solana/cli

# Configure for devnet
solana config set --url devnet

# Check config
solana config get

# Create keypair
solana-keygen new

# Fund account (devnet)
solana airdrop 2 <WALLET_ADDRESS> --url devnet
```

## Smart Contract Template (lib.rs)
```rust
use anchor_lang::prelude::*;

declare_id!("...");

#[program]
pub mod my_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // Your logic here
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

## TypeScript Test Template (tests.ts)
```typescript
import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { MyProgram } from "../target/types/my_program"

describe("my_program", () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.MyProgram as Program<MyProgram>

  it("Is initialized!", async () => {
    const tx = await program.methods.initialize().rpc()
    console.log("Your transaction signature", tx)
  })
})
```

## Deployment Flow
```
1. Write contract (Rust)
   ↓
2. Build: anchor build
   ↓
3. Test: anchor test
   ↓
4. Deploy: anchor deploy --provider.cluster devnet
   ↓
5. Get Program ID from deploy output
   ↓
6. Update Anchor.toml with Program ID
   ↓
7. Integrate with frontend
```

## Error Troubleshooting

| Error | Solution |
|-------|----------|
| `anchor: command not found` | Restart terminal or add to PATH |
| `error: failed to build` | Run `anchor clean && anchor build` |
| `test failed` | Check `anchor test --verbose` output |
| `account not funded` | Run `solana airdrop 2 <PUBKEY>` |
| `network error` | Check `solana network-status --url devnet` |

## Common Paths
```
Config:        ~/.config/solana/
Wallet:        ~/.config/solana/id.json
Anchor home:   ~/.cargo/bin/
Build output:  target/deploy/
```

## Useful Links
- 📚 Anchor Book: https://www.anchor-lang.com/
- 🔗 Solana Docs: https://docs.solana.com/
- 📖 Cookbook: https://solanacookbook.com/
- 🐙 GitHub: https://github.com/coral-xyz/anchor

## Installation Timeline
- Rust: ✅ Done (1.91.1)
- WASM Target: ✅ Done
- Anchor AVM: ⏳ In progress (~7% complete)

**Estimated Total Time:** 15-20 minutes

