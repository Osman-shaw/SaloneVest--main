# SaloneVest Anchor - Quick Start Guide

## What You Need

1. **Docker Desktop** - Download from https://www.docker.com/products/docker-desktop
2. **PowerShell** - Already on Windows
3. **This repository** - D:\SaloneVest--main\anchor

## Three Commands to Deploy

### Command 1: Setup (5-10 minutes, one-time only)
```powershell
cd D:\SaloneVest--main\anchor
pwsh build-anchor.ps1 build
```

### Command 2: Compile Smart Contract
```powershell
pwsh build-anchor.ps1 compile
```

### Command 3: Test Everything Works
```powershell
pwsh build-anchor.ps1 test
```

## Files Generated

After running these commands, you'll have:

```
target/deploy/
├── investment_escrow.so          ← Smart contract binary
├── investment_escrow-keypair.json
└── idl/investment_escrow.json     ← For frontend integration
```

## Deploy to Solana Devnet

```powershell
# First, setup Solana wallet (one-time):
solana config set --url devnet
solana-keygen new --outfile ~/.config/solana/id.json
solana airdrop 2

# Then deploy:
pwsh build-anchor.ps1 deploy
```

## Useful Commands

| Command | What it does |
|---------|--------------|
| `build-anchor.ps1 build` | Build Docker image (first time) |
| `build-anchor.ps1 compile` | Compile smart contract |
| `build-anchor.ps1 test` | Run tests |
| `build-anchor.ps1 shell` | Open interactive shell |
| `build-anchor.ps1 status` | Check all versions |
| `build-anchor.ps1 clean` | Clean build files |
| `build-anchor.ps1 deploy` | Deploy to Devnet |

## Troubleshooting

### Docker not found
Install Docker Desktop: https://www.docker.com/products/docker-desktop

### Port already in use
If port 8899 is in use, modify `Anchor.toml`:
```toml
[provider]
cluster = "http://127.0.0.1:8899"
```

### Out of memory
Increase Docker Desktop memory allocation:
- Docker Desktop Settings → Resources → Memory → Set to 4GB or higher

### Tests fail
Make sure you ran `build-anchor.ps1 build` first to create the Docker image.

## Files in Anchor Folder

```
anchor/
├── Dockerfile              ← Docker image definition
├── build-anchor.ps1        ← Build script (use this!)
├── .dockerignore
├── Cargo.toml
├── Anchor.toml
├── programs/investment_escrow/   ← Smart contract
├── tests/investment_escrow.ts    ← Tests
└── target/deploy/         ← Output files (generated)
```

## Next Steps

1. **Install Docker Desktop** if you haven't already
2. **Run**: `pwsh build-anchor.ps1 build` (wait 5-10 min)
3. **Run**: `pwsh build-anchor.ps1 compile` (builds smart contract)
4. **Run**: `pwsh build-anchor.ps1 test` (verify it works)
5. **Deploy**: Follow the Devnet deployment steps above

## Video Tutorial

For detailed video walkthrough, see: `ANCHOR_DEVELOPMENT_GUIDE.md`

## Support

If you run into issues, check:
1. Docker Desktop is running (check system tray)
2. You have 10GB free disk space
3. Your internet connection is stable
4. Run `pwsh build-anchor.ps1 status` to verify versions

## Success Indicators

✅ Docker image builds without errors
✅ `pwsh build-anchor.ps1 compile` shows "Finished `dev` [unoptimized]"
✅ `pwsh build-anchor.ps1 test` shows "test result: ok"
✅ `target/deploy/investment_escrow.so` exists (~1-2 MB file)

---

**Ready to start?** Run:
```powershell
cd D:\SaloneVest--main\anchor
pwsh build-anchor.ps1 build
```
