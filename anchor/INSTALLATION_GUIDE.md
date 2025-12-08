# Phase 3: Smart Contract Development Guide

## ⚠️ Prerequisites Not Installed

Anchor framework is not currently installed on your system. Before proceeding with Phase 3, you need to install the following:

---

## 📦 Installation Steps

### 1. Install Rust (15-20 minutes)

**Windows (PowerShell as Administrator)**:
```powershell
# Download and run rustup installer
Invoke-WebRequest -Uri "https://win.rustup.rs/x86_64" -OutFile "rustup-init.exe"
.\rustup-init.exe

# After installation, restart your terminal and verify
rustc --version
cargo --version
```

**Alternative**: Download from https://rustup.rs/

---

### 2. Install Solana CLI (10-15 minutes)

**Windows (PowerShell)**:
```powershell
# Download Solana installer
cmd /c "curl https://release.solana.com/v1.18.4/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-tmp\solana-install-init.exe --create-dirs"

# Run installer
C:\solana-install-tmp\solana-install-init.exe v1.18.4

# Add to PATH (restart terminal after)
$env:PATH += ";C:\Users\$env:USERNAME\.local\share\solana\install\active_release\bin"

# Verify installation
solana --version
```

**Configure Solana CLI**:
```bash
# Set to devnet
solana config set --url devnet

# Create a new keypair (for deployment)
solana-keygen new --outfile ~/.config/solana/devnet.json

# Get devnet SOL (for deployment fees)
solana airdrop 2
```

---

### 3. Install Anchor Framework (10 minutes)

**Windows**:
```powershell
# Install Anchor Version Manager
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Install latest Anchor
avm install latest
avm use latest

# Verify installation
anchor --version
```

**Expected output**: `anchor-cli 0.29.0` (or latest version)

---

### 4. Install Node.js Dependencies

```bash
# Install Yarn (Anchor uses Yarn)
npm install -g yarn

# Verify
yarn --version
```

---

## 🚀 After Installation

Once all prerequisites are installed, run:

```bash
cd d:\SaloneVest--main\anchor
anchor init investment-escrow
cd investment-escrow
```

Then use the template files I've created in the `anchor/templates/` directory.

---

## 📁 Template Files Created

I've created the following template files for you:

1. **`lib.rs`** - Main smart contract program
2. **`Anchor.toml`** - Anchor configuration
3. **`investment_escrow.ts`** - TypeScript tests
4. **`deploy.sh`** - Deployment script

These are ready to use once you initialize the Anchor workspace.

---

## ⏱️ Total Installation Time

- **Rust**: 15-20 minutes
- **Solana CLI**: 10-15 minutes  
- **Anchor**: 10 minutes
- **Total**: ~35-45 minutes

---

## 🔍 Verification Checklist

After installation, verify everything works:

```bash
# Check Rust
rustc --version
cargo --version

# Check Solana
solana --version
solana config get

# Check Anchor
anchor --version

# Check Yarn
yarn --version
```

All commands should return version numbers without errors.

---

## 💡 Alternative: Use Pre-built Templates

If you prefer not to install Rust/Anchor locally, you can:

1. **Use Solana Playground** (online IDE): https://beta.solpg.io/
2. **Hire a Solana developer** to implement the smart contract
3. **Continue testing** the wallet integration without blockchain

---

## 📞 Need Help?

If you encounter installation issues:
- Check [Anchor Installation Docs](https://www.anchor-lang.com/docs/installation)
- Visit [Solana Discord](https://discord.gg/solana)
- Review [Solana Cookbook](https://solanacookbook.com/)

---

**Once installed, return here and I'll guide you through deploying the smart contract!**
