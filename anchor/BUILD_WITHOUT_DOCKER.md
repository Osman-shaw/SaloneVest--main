# Build Without Docker - Quick Setup Options

Since Docker isn't installed, here are the fastest alternatives:

## Option 1: WSL2 (Windows Subsystem for Linux) - RECOMMENDED
**Time: 15-20 minutes total**

### Step 1: Install WSL2 (one-time)
Run in PowerShell as Administrator:
```powershell
wsl --install Ubuntu
```

Restart your computer when prompted.

### Step 2: Set Default to WSL2
```powershell
wsl --set-default-version 2
```

### Step 3: Open WSL Terminal
```powershell
wsl
```

You're now in Linux! Your Windows drives are at `/mnt/d/`, `/mnt/c/`, etc.

### Step 4: Build in WSL
```bash
cd /mnt/d/SaloneVest--main/anchor

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install Solana
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.0 anchor-cli --locked

# Compile
anchor build

# Test
anchor test --skip-local-validator
```

---

## Option 2: Visual C++ Build Tools (Windows Native)
**Time: 30-40 minutes (requires large download)**

Pros: Native Windows, slightly faster
Cons: Complex setup, 3GB+ download

[See VISUAL_CPP_SETUP.md for detailed guide]

---

## Option 3: Use Online Compiler (Replit)
**Time: 5 minutes**

Pros: No installation needed
Cons: Limited resources

1. Create Replit account
2. Upload anchor folder
3. Run build commands
4. Download compiled files

---

## Option 4: GitHub Codespaces (Recommended for Testing)
**Time: 10 minutes**

Pros: Cloud-based, pre-configured Linux environment
Cons: Requires GitHub push

1. Push SaloneVest to GitHub
2. Open in Codespaces (green Code button → Codespaces)
3. Run anchor build commands
4. Download `target/deploy/` files

---

## Quick Command Reference by Option

### WSL2 (Linux)
```bash
cd /mnt/d/SaloneVest--main/anchor
anchor build                  # Compile
anchor test --skip-local-validator  # Test
anchor deploy                 # Deploy
```

### Windows (if using Visual C++)
```powershell
cd D:\SaloneVest--main\anchor
cargo build --release
cargo test
anchor deploy
```

### Via Docker (if installed later)
```powershell
cd D:\SaloneVest--main\anchor
pwsh build-anchor.ps1 build
pwsh build-anchor.ps1 compile
```

---

## I Recommend: WSL2

Fastest, simplest, and works perfectly for Anchor development.

**Total time from now: 15-20 minutes**

1. Run `wsl --install Ubuntu` in PowerShell (admin)
2. Restart computer
3. Run `wsl` to open Linux terminal
4. Copy-paste the 5 build commands from Option 1
5. Done! Files ready in `target/deploy/`

Ready to proceed with WSL2?
