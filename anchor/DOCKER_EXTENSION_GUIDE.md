# Build Anchor Using Docker Extension in VS Code

You have the **Docker extension** installed! Here's how to use it:

## Option 1: Build via Docker Extension UI (Easiest)

### Step 1: Open Docker Extension
- Click the **Docker icon** in left sidebar (looks like whale 🐳)
- Or press `Ctrl + Shift + P` → "Docker: Show Overview"

### Step 2: Verify Docker Desktop
If Docker isn't running:
- Install Docker Desktop: https://docker.com/products/docker-desktop
- Or just use the extension's built-in Docker commands

### Step 3: Build Docker Image
In VS Code Terminal:
```powershell
cd D:\SaloneVest--main\anchor
pwsh build-anchor.ps1 build
```

The Docker extension will show you:
- Image creation progress
- Container status
- Port mappings
- Logs in real-time

---

## Option 2: Use Docker Extension with Dev Containers

Install the **Dev Containers** extension:
```vscode-extensions
ms-vscode-remote.remote-containers
```

Then:
1. Click Docker icon → "Dev Containers: Open Folder in Container"
2. Select the anchor folder
3. VS Code reopens inside Docker
4. Run build commands in the integrated terminal

---

## Option 3: Visual Build Process

### Step 1: Open Docker Extension
Click the whale icon 🐳 in sidebar

### Step 2: View Available Commands
- **Images** → See Docker images
- **Containers** → See running containers
- **Registries** → Pull public images

### Step 3: Right-click to Execute
- Right-click Dockerfile → "Build Image"
- Right-click Image → "Run Interactive"
- Watch build progress in output panel

---

## Complete Workflow Using Docker Extension

### 1. Ensure Docker Desktop Installed
Download: https://docker.com/products/docker-desktop
- Install and launch
- Wait for it to appear in system tray

### 2. Open Terminal in VS Code
```powershell
Ctrl + `
```

### 3. Build the Docker Image
```powershell
cd D:\SaloneVest--main\anchor
pwsh build-anchor.ps1 build
```

**Watch in Docker Extension:**
- Images tab will show new `salonevest-anchor:latest` image
- Shows build time: ~5-10 minutes first time

### 4. Compile Smart Contract
```powershell
pwsh build-anchor.ps1 compile
```

**Output visible in:**
- Terminal (real-time compilation)
- Docker extension logs
- `target/deploy/` folder shows `.so` file

### 5: Run Tests
```powershell
pwsh build-anchor.ps1 test
```

**Expected:**
```
test result: ok
```

### 6: Deploy to Devnet
```powershell
pwsh build-anchor.ps1 deploy
```

**You'll see:**
- Program ID
- Deployment confirmation
- Transaction signature

---

## Docker Extension Features You Can Use

| Feature | How to Access |
|---------|---------------|
| View images | Docker icon → Images |
| View containers | Docker icon → Containers |
| View logs | Right-click container → View Logs |
| Stop container | Right-click container → Stop |
| Remove image | Right-click image → Remove |
| Pull from Docker Hub | Registries → Search → Pull |
| Build image | Right-click Dockerfile → Build Image |
| Run container | Right-click image → Run |
| Open shell in container | Right-click container → Open in Integrated Terminal |

---

## Quick Setup Summary

**Prerequisites:**
- ✅ Docker extension (already installed)
- ⏳ Docker Desktop (download if needed)
- ✅ VS Code terminal
- ✅ build-anchor.ps1 script (already created)

**Execute in order:**
```powershell
# 1. Navigate
cd D:\SaloneVest--main\anchor

# 2. Build Docker image (first time: 5-10 min)
pwsh build-anchor.ps1 build

# 3. Compile contract (1-2 min)
pwsh build-anchor.ps1 compile

# 4. Run tests
pwsh build-anchor.ps1 test

# 5. Deploy to devnet
pwsh build-anchor.ps1 deploy
```

---

## If Docker Desktop Isn't Installed Yet

### Quick Install (via Terminal):
```powershell
# Using winget (Windows Package Manager)
winget install Docker.DockerDesktop
```

Or download manually:
https://docker.com/products/docker-desktop

After install:
- Restart VS Code
- Docker extension will auto-detect Docker
- Ready to build!

---

## Troubleshooting

**Issue: "Docker daemon not running"**
- Open Docker Desktop from Start menu
- Wait for system tray icon to show it's running
- Refresh Docker extension (press F5)

**Issue: "Docker command not found"**
- Close VS Code and Docker Desktop
- Restart both
- Docker should be in PATH after installation

**Issue: "Permission denied"**
- Run VS Code as Administrator
- Or add your user to docker group (Linux/WSL)

**Issue: Build hangs**
- Check internet connection (downloading 2GB+)
- Check disk space (need 10GB+)
- Try again: `pwsh build-anchor.ps1 build`

---

## Next Steps After Build

1. **Verify Files Created:**
   ```powershell
   ls target/deploy/
   ```
   Should see: `investment_escrow.so` and `idl/` folder

2. **Copy IDL to Frontend:**
   ```powershell
   Copy-Item target/deploy/idl/investment_escrow.json ..\frontend\lib\idl\
   ```

3. **Update Frontend Integration:**
   - See: `frontend/lib/idl/investment_escrow.json`
   - Update contract address in frontend config

4. **Deploy to Devnet:**
   ```powershell
   pwsh build-anchor.ps1 deploy
   ```

---

**Ready to build? Install Docker Desktop and you're good to go!**
