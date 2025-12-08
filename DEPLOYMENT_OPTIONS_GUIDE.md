# 🎯 Smart Contract Build & Deployment - Complete Guidance

**Date:** December 8, 2025  
**Contract Status:** Code Complete ✅ | Build Pending ⏳ | Deployment Ready 🚀  
**Blocker:** Windows environment lacks build tools  
**Solution:** Use one of the 4 methods below

---

## 📋 Current Situation

### ✅ What's Complete
- **Smart Contract:** 612 lines of Rust code ✅
- **Test Suite:** 3 integration tests ✅
- **Configuration:** Anchor.toml + Cargo.toml ✅
- **Documentation:** Complete (4 guides) ✅
- **Local Dev Tools:** Rust 1.91.1, Cargo ✅

### ⏳ What's Needed
- **Build Environment:** MSVC linker OR WSL2/Docker OR Remote Linux
- **Compiled Binary:** investment_escrow.so (~100 KB)
- **IDL:** Auto-generated after build
- **Solana CLI:** For devnet deployment
- **Devnet SOL:** 0.5 SOL for deployment fees

### ❌ Why Build Failed
```
error: linker `link.exe` not found
Error: MSVC linker (link.exe) not installed

This is a Windows-specific issue. Rust needs either:
1. Visual C++ Build Tools installed (Microsoft)
2. Linux environment (via WSL2 or Docker)
3. Remote Linux machine for build
```

---

## 🚀 QUICKEST SOLUTION: Docker Desktop (20 minutes)

### Prerequisites Check
```powershell
# Check if Docker Desktop can be installed:
# 1. Windows 10/11 Pro, Enterprise, or Education (not Home)
# 2. Virtualization enabled in BIOS
# 3. ~2 GB disk space available
```

### Installation & Deployment

**Step 1: Install Docker Desktop (5 min)**
```
1. Download: https://www.docker.com/products/docker-desktop
2. Run installer
3. Follow setup wizard (default settings OK)
4. Restart computer
5. Docker starts automatically
```

**Step 2: Build Contract (5 min)**
```powershell
cd D:\SaloneVest--main

docker pull coral/anchor:latest

docker run --rm `
  -v ${PWD}\anchor:/anchor `
  -w /anchor `
  coral/anchor:latest `
  anchor build
```

**Step 3: Deploy to Devnet (10 min)**
```powershell
# Create wallet
docker run --rm `
  -v ${PWD}:/workspace `
  -w /workspace `
  solanalabs/solana:latest `
  solana-keygen new -o id.json

# Airdrop devnet SOL
docker run --rm `
  -v ${PWD}:/workspace `
  -w /workspace `
  solanalabs/solana:latest `
  solana airdrop 2 id.json --url devnet

# Deploy contract
docker run --rm `
  -v ${PWD}\anchor:/anchor `
  -w /anchor `
  coral/anchor:latest `
  anchor deploy --provider.cluster devnet
```

**Step 4: Note Program ID and Update Code**
```powershell
# Copy the Program ID from Step 3 output

# Update code with Program ID:
powershell -File deploy.ps1 -Action update -ProgramId "YOUR_PROGRAM_ID"

# Rebuild with new ID:
docker run --rm `
  -v ${PWD}\anchor:/anchor `
  -w /anchor `
  coral/anchor:latest `
  anchor build
```

---

## 🔄 ALTERNATIVE 1: Visual C++ Build Tools (30 minutes)

### Installation

**Step 1: Download Visual Studio Build Tools**
```
1. Go to: https://visualstudio.microsoft.com/downloads/
2. Scroll down to "Build Tools for Visual Studio 2022"
3. Click "Download"
4. Run installer
```

**Step 2: Select Workload**
```
Installer opens → Select Workloads:
□ Desktop development with C++
  ✓ MSVC v143 - VS 2022 C++ x64/x86 build tools
  ✓ Windows 10/11 SDK
  ✓ CMake tools for Windows
  ✓ C++ Build Tools core features
```

**Step 3: Install (~2-3 GB, 15 min)**
```
Click "Install" and wait for completion
```

**Step 4: Build Contract**
```powershell
cd D:\SaloneVest--main\anchor
anchor build
```

**Step 5: Deploy**
```bash
# Need Solana CLI - see next section
# Follow standard deployment steps in SMART_CONTRACT_DEPLOYMENT_GUIDE.md
```

---

## 🐧 ALTERNATIVE 2: WSL2 + Linux Tools (45 minutes)

### Install WSL2

**Step 1: Enable WSL2 (Windows 10/11)**
```powershell
# In PowerShell as Admin:
wsl --install Ubuntu-24.04

# System will restart - login to Ubuntu when prompted
```

**Step 2: Setup Linux Environment (in Ubuntu terminal)**
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm
avm install latest
avm use latest

# Verify
anchor --version
solana --version
```

**Step 3: Build Contract (in WSL2 Ubuntu terminal)**
```bash
cd /mnt/d/SaloneVest--main/anchor
anchor build
```

**Step 4: Deploy to Devnet**
```bash
# Setup wallet
solana-keygen new -o ~/.config/solana/id.json

# Set devnet
solana config set --url devnet

# Get airdrop
solana airdrop 2 ~/.config/solana/id.json

# Deploy
anchor deploy --provider.cluster devnet

# Note the Program ID
```

**Step 5: Update Windows Code**
```powershell
# In Windows PowerShell (not WSL):
powershell -File deploy.ps1 -Action update -ProgramId "YOUR_PROGRAM_ID"
```

---

## 🖥️ ALTERNATIVE 3: Remote Linux Machine

### If You Have Access to Mac/Linux Machine

**Step 1: Copy Contract**
```powershell
# From Windows:
scp -r D:\SaloneVest--main\anchor user@remote-machine:~/

# Or create archive:
Compress-Archive anchor anchor.zip
# Transfer anchor.zip via email/cloud storage
```

**Step 2: Build on Remote (SSH or physically)**
```bash
# In Linux/Mac terminal:
cd ~/anchor
cargo install --git https://github.com/coral-xyz/anchor avm
avm install latest
avm use latest

anchor build
```

**Step 3: Deploy**
```bash
# Get devnet SOL and deploy
solana config set --url devnet
solana airdrop 2
anchor deploy --provider.cluster devnet

# Note Program ID
echo "YOUR_PROGRAM_ID"
```

**Step 4: Copy Results Back**
```powershell
# From Windows:
scp user@remote-machine:~/anchor/target/deploy/investment_escrow.so .\anchor\target\deploy\

# Update code:
powershell -File deploy.ps1 -Action update -ProgramId "YOUR_PROGRAM_ID"
```

---

## 🎓 Decision Tree: Which Method to Use?

```
┌─ Do you have Docker Desktop available?
│  ├─ YES → Use Docker (FASTEST, 20 min) ✅
│  └─ NO  → Next question
│
└─ Do you have Visual Studio or Build Tools?
   ├─ YES → Use Visual C++ (30 min) ✅
   └─ NO  → Next question
      │
      ├─ Can you install WSL2? (Win 10/11 Pro/Enterprise)
      │  ├─ YES → Use WSL2 (45 min) ✅
      │  └─ NO  → Next question
      │
      └─ Do you have access to Mac/Linux?
         ├─ YES → Use Remote Machine ✅
         └─ NO  → Install one of the above
```

---

## 🛠️ Recommended Path for Windows Users

**Best Option:** Docker Desktop
- Isolates build environment
- Works across Windows 10/11 (Pro, Enterprise, Education)
- Requires only 2 GB disk space
- Can be removed after use
- Portable - works on future machines too

**Second Best:** Visual C++ Build Tools
- Native Windows installation
- No virtualization overhead
- 2-3 GB disk space required
- Useful for other C++ development

**Third Option:** WSL2
- Best if already using Linux tools
- More complex setup
- Requires Windows 10/11 Pro/Enterprise

---

## ✨ Complete Deployment Timeline

### Using Docker (RECOMMENDED)

| Step | Time | Command |
|------|------|---------|
| Install Docker | 5 min | Download & run installer |
| Build Contract | 5 min | `docker run ... anchor build` |
| Create Wallet | 2 min | `docker run ... solana-keygen new` |
| Get Devnet SOL | 1 min | `docker run ... solana airdrop 2` |
| Deploy Contract | 3 min | `docker run ... anchor deploy` |
| Update Program ID | 2 min | `powershell -File deploy.ps1 ...` |
| Rebuild Locally | 2 min | `anchor build` (requires Anchor CLI) |
| **TOTAL** | **~20 min** | Ready for testing! |

### Using Visual C++ Build Tools

| Step | Time |
|------|------|
| Download & Install | 15 min |
| Install Solana CLI | 5 min |
| Build Contract | 10 min |
| Deploy (manual steps) | 10 min |
| **TOTAL** | **~40 min** |

### Using WSL2

| Step | Time |
|------|------|
| Install WSL2 | 10 min |
| Setup Linux env | 15 min |
| Build Contract | 10 min |
| Deploy | 10 min |
| **TOTAL** | **~45 min** |

---

## 📞 Troubleshooting

### Docker Installation Issues

**Issue:** Docker daemon won't start
- Solution: Check virtualization is enabled in BIOS
- Alternative: Use Visual C++ or WSL2 instead

**Issue:** "Cannot connect to Docker daemon"
- Solution: Restart Docker Desktop
- Alternative: Use Visual C++ instead

### Build Fails in Docker

**Issue:** Out of disk space
- Solution: `docker system prune -a` to clean unused images
- Rerun build

**Issue:** Network timeout
- Solution: Check internet connection
- Rerun command (may retry automatically)

### Deployment Issues

**Issue:** "Insufficient lamports"
- Solution: Request more airdrop: `solana airdrop 2`

**Issue:** "Transaction timeout"
- Solution: Devnet may be slow, try again in 5 minutes
- Check: `solana catchup --url devnet`

**Issue:** "Program already exists"
- Solution: Use different wallet keypair for deployment

---

## 📊 Resource Requirements

| Method | Disk Space | RAM | Internet | Time |
|--------|-----------|-----|----------|------|
| Docker | 2 GB | 2 GB | Required | 20 min |
| Visual C++ | 3 GB | 2 GB | Required | 40 min |
| WSL2 | 4 GB | 3 GB | Required | 45 min |
| Remote | 0 GB | N/A | Required | 30 min |

---

## 🎯 Post-Deployment Checklist

After successful deployment:

- [ ] Program ID obtained from deployment
- [ ] Program ID updated in `lib.rs`
- [ ] Program ID updated in `Anchor.toml`
- [ ] Program ID updated in frontend config
- [ ] Contract rebuilt with new Program ID
- [ ] IDL generated: `anchor idl fetch PROGRAM_ID`
- [ ] Program verified on Solana Explorer
- [ ] Integration tests passed
- [ ] Documentation updated with Program ID
- [ ] Frontend integration tested

---

## 📚 Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| This file | Build/deployment options | 10 min |
| `SMART_CONTRACT_DEPLOYMENT_GUIDE.md` | Detailed deployment steps | 20 min |
| `BUILD_AND_DEPLOYMENT_STATUS.md` | Current build status | 5 min |
| `SMART_CONTRACT_IMPLEMENTATION.md` | Technical details | 30 min |
| `SMART_CONTRACT_QUICK_GUIDE.md` | Quick reference | 10 min |

---

## 🚀 Ready to Deploy?

Choose your method:
1. **Docker** (fastest) - 20 minutes
2. **Visual C++** (native) - 40 minutes
3. **WSL2** (integrated) - 45 minutes
4. **Remote** (alternative) - 30 minutes

**Pick one and let's deploy!**

---

**Last Updated:** December 8, 2025  
**Status:** Ready for environment setup and build  
**Next Action:** Choose deployment method and begin installation
