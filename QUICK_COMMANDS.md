# ⚡ Quick Commands Reference

## Start Development Servers (Copy & Paste)

### Backend (Terminal 1)
```powershell
cd D:\SaloneVest--main\backend; npm run dev
```

### Frontend (Terminal 2)
```powershell
cd D:\SaloneVest--main\frontend; npm run dev
```

### Then Open in Browser
```
http://localhost:3000
```

---

## Verify Installation

```powershell
# Check Node.js
node --version

# Check npm
npm --version

# Check Rust
rustc --version
cargo --version

# Check Cargo can build
cargo --version
```

---

## Environment Files

### Backend `.env` (Create this file)
**Location:** `D:\SaloneVest--main\backend\.env`

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/salonevest
DATABASE_NAME=salonevest
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
```

### Frontend `.env.local` (Create this file)
**Location:** `D:\SaloneVest--main\frontend\.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ENVIRONMENT=development
```

---

## Install Dependencies (Already Done ✓)

```powershell
# Frontend
cd D:\SaloneVest--main\frontend
npm install

# Backend
cd D:\SaloneVest--main\backend
npm install
```

---

## Build Commands

### Frontend Build
```powershell
cd D:\SaloneVest--main\frontend
npm run build
npm start
```

### Backend Build
```powershell
cd D:\SaloneVest--main\backend
npm run build
npm start
```

---

## Test Commands

### Frontend
```powershell
cd D:\SaloneVest--main\frontend
npm run lint
```

### Backend
```powershell
cd D:\SaloneVest--main\backend
npm test
```

---

## Utility Commands

### Clear Build Cache
```powershell
cd D:\SaloneVest--main\frontend
rm -r .next
npm run dev
```

### Reinstall Dependencies
```powershell
# Choose one folder
cd D:\SaloneVest--main\frontend
# or
cd D:\SaloneVest--main\backend

# Then:
rm -r node_modules
npm install
```

### Check Ports In Use
```powershell
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5000
```

### Kill Process on Port
```powershell
# Kill port 3000 (replace PID)
taskkill /PID <PID> /F

# Or use the PID directly
taskkill /PID 5432 /F
```

---

## Rust Commands

### Check Rust Installation
```powershell
rustc --version
cargo --version
rustup toolchain list
```

### Add WASM Target (Already Done ✓)
```powershell
rustup target add wasm32-unknown-unknown
```

---

## Anchor Commands (Requires Visual C++ Build Tools)

### Install Anchor
```powershell
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install latest
avm use latest
```

### Build Smart Contract
```powershell
cd D:\SaloneVest--main\anchor
anchor build
```

### Run Tests
```powershell
cd D:\SaloneVest--main\anchor
anchor test
```

### Deploy
```powershell
anchor deploy --provider.cluster devnet
```

---

## Git Commands

### Check Status
```powershell
git status
```

### Add Changes
```powershell
git add .
```

### Commit Changes
```powershell
git commit -m "Your message"
```

### Push Changes
```powershell
git push origin main
```

---

## Docker Commands (Optional)

### Build Image
```powershell
docker build -t salonevest-backend ./backend
docker build -t salonevest-frontend ./frontend
```

### Run Container
```powershell
docker run -p 5000:5000 salonevest-backend
docker run -p 3000:3000 salonevest-frontend
```

---

## Database Commands

### MongoDB Local Start
```powershell
# Windows: Start MongoDB service
net start MongoDB

# Or if using mongod directly
mongod --dbpath "C:\data\db"
```

### MongoDB Check
```powershell
mongo --version
```

---

## One-Liner Commands

### Full Setup & Start
```powershell
cd D:\SaloneVest--main; npm install --prefix backend; npm install --prefix frontend; echo "Installing complete! Run backend and frontend in separate terminals"
```

### Start Both (Requires 2 terminals)
```powershell
# Terminal 1
cd D:\SaloneVest--main\backend && npm run dev

# Terminal 2
cd D:\SaloneVest--main\frontend && npm run dev
```

### Test Backend API
```powershell
curl http://localhost:5000/health
```

### Test Frontend
```powershell
# Open in browser
start http://localhost:3000
```

---

## Troubleshooting Commands

### Check npm cache
```powershell
npm cache clean --force
```

### Update npm
```powershell
npm install -g npm@latest
```

### Update Node.js
```powershell
# Download from: https://nodejs.org/
```

### Check npm config
```powershell
npm config list
```

### Fix permissions
```powershell
npm config set prefix "C:\Program Files\nodejs"
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Start backend | `cd backend; npm run dev` |
| Start frontend | `cd frontend; npm run dev` |
| Build backend | `cd backend; npm run build` |
| Build frontend | `cd frontend; npm run build` |
| Install deps | `npm install` |
| Clear cache | `npm cache clean --force` |
| Test API | `curl http://localhost:5000/health` |
| Open app | `start http://localhost:3000` |
| Kill port 3000 | `netstat -ano \| findstr :3000` then `taskkill /PID X /F` |
| Check Rust | `rustc --version` |
| Install Anchor | `cargo install --git https://github.com/coral-xyz/anchor avm` |

---

## Copy-Paste Terminal Setup

### Run This First
```powershell
cd D:\SaloneVest--main\backend
npm install
cd D:\SaloneVest--main\frontend
npm install
```

### Terminal 1 (Backend)
```powershell
cd D:\SaloneVest--main\backend
npm run dev
```

### Terminal 2 (Frontend)
```powershell
cd D:\SaloneVest--main\frontend
npm run dev
```

### Browser
```
http://localhost:3000
```

---

