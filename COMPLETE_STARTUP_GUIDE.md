# 🚀 SaloneVest Complete Startup Guide

## System Status

### ✅ Installed Components
- **Rust Toolchain:** v1.91.1 ✓
- **Cargo:** v1.91.1 ✓
- **Node.js:** Latest ✓
- **npm:** Latest ✓
- **Frontend Dependencies:** Installed ✓
- **Backend Dependencies:** Installed ✓
- **WASM Target:** Installed ✓

### ⚠️ Requires Setup
- **Anchor CLI:** Requires Visual C++ Build Tools (optional for smart contracts)
- **MongoDB:** For local backend data
- **Environment Variables:** .env files needed

---

## Quick Start (2 Minutes)

### Terminal 1: Backend Server
```powershell
cd D:\SaloneVest--main\backend
npm run dev
```

**Expected Output:**
```
🚀 SaloneVest Backend Server
📡 Server running on http://localhost:5000
✅ Ready to accept requests
```

### Terminal 2: Frontend Server
```powershell
cd D:\SaloneVest--main\frontend
npm run dev
```

**Expected Output:**
```
✓ Compiled successfully
Local: http://localhost:3000
✓ Ready in X.XXs
```

### Browser
Open: `http://localhost:3000`

---

## Detailed Setup Instructions

### Prerequisites Checklist

- [ ] Node.js installed (`node --version` should show v18+)
- [ ] npm installed (`npm --version` should show v9+)
- [ ] Two terminal windows available
- [ ] Port 3000 available (frontend)
- [ ] Port 5000 available (backend)

### Step 1: Backend Setup

#### 1a. Create Environment File
Create `D:\SaloneVest--main\backend\.env`:
```env
# Server
PORT=5000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/salonevest
DATABASE_NAME=salonevest

# Solana
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com

# Optional: Anchor
ANCHOR_WALLET=~/.config/solana/id.json
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com
```

#### 1b. Install Dependencies (Already Done ✓)
```powershell
cd D:\SaloneVest--main\backend
npm install
```

#### 1c. Start Backend
```powershell
npm run dev
```

**If MongoDB Error:**
- Download from: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### Step 2: Frontend Setup

#### 2a. Create Environment File
Create `D:\SaloneVest--main\frontend\.env.local`:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Optional: Analytics
NEXT_PUBLIC_ENVIRONMENT=development
```

#### 2b. Install Dependencies (Already Done ✓)
```powershell
cd D:\SaloneVest--main\frontend
npm install
```

#### 2c. Clear Build Cache (First Time)
```powershell
rm -r .next
```

#### 2d: Start Frontend
```powershell
npm run dev
```

### Step 3: Test Everything

#### Test Backend
```powershell
# In a new terminal
curl http://localhost:5000/health
# Should return: {"status":"ok","timestamp":"..."}
```

#### Test Frontend
1. Open: `http://localhost:3000`
2. Should see: Home page with "Connect Phantom" button
3. Check console (F12): No errors

#### Test Wallet Connection
1. Click "Connect Phantom" button
2. Phantom popup should open
3. Approve connection
4. Check console for success message
5. Should redirect to dashboard

---

## File Structure

```
D:\SaloneVest--main\
├── backend/
│   ├── src/
│   │   ├── server.ts           ← Entry point
│   │   ├── config/
│   │   │   ├── db.ts           ← MongoDB config
│   │   │   └── solana.ts       ← Solana config
│   │   ├── controllers/        ← API handlers
│   │   ├── models/             ← Data models
│   │   ├── routes/             ← API routes
│   │   └── services/           ← Business logic
│   ├── .env                    ← Environment vars (create this)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx            ← Home page
│   │   ├── dashboard/          ← Dashboard
│   │   ├── login/
│   │   └── ...
│   ├── components/
│   │   ├── wallet-connect.tsx  ← Fixed ✓
│   │   └── ...
│   ├── lib/
│   │   ├── phantom-types.ts    ← Fixed ✓
│   │   └── api-client.ts
│   ├── .env.local              ← Environment vars (create this)
│   ├── package.json
│   └── next.config.mjs
│
└── anchor/                     ← Smart contracts (optional)
    ├── templates/
    │   ├── lib.rs              ← Contract template
    │   ├── Anchor.toml
    │   └── deploy.sh
    └── ...
```

---

## Common Commands

### Backend Commands
```powershell
cd D:\SaloneVest--main\backend

# Development
npm run dev                 # Start with auto-reload

# Build
npm run build              # Compile TypeScript

# Production
npm start                  # Run compiled code

# Testing
npm test                   # Run tests
npm run seed              # Seed database
```

### Frontend Commands
```powershell
cd D:\SaloneVest--main\frontend

# Development
npm run dev               # Start Next.js dev server

# Build
npm run build            # Production build

# Test
npm run lint             # Run ESLint
npm test                # Run tests (if configured)

# Production
npm start               # Start production server
```

---

## Troubleshooting

### Issue: "Port 5000 already in use"
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Issue: "Port 3000 already in use"
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Issue: "Cannot find module" Error
```powershell
# Reinstall dependencies
rm -r node_modules
npm install
```

### Issue: MongoDB Connection Error
```powershell
# Check MongoDB is running
# Download: https://www.mongodb.com/try/download/community
# Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas
```

### Issue: Phantom Connection Error
- See: `PHANTOM_CONNECTION_ERROR_FIXED.md`
- Console (F12) will show specific error
- Check `PHANTOM_DEBUG_GUIDE.md` for solutions

### Issue: Build Errors
```powershell
# Clear cache
cd frontend
rm -r .next
npm run dev
```

### Issue: TypeScript Errors
```powershell
# Check types
npx tsc --noEmit

# Fix common issues
npm run lint -- --fix
```

---

## Terminal Setup (Recommended)

Open 3 terminals:

```
┌─────────────────────────────────────────┐
│ Terminal 1: Backend                     │
├─────────────────────────────────────────┤
│ cd D:\SaloneVest--main\backend         │
│ npm run dev                             │
│                                         │
│ PORT: 5000                              │
│ Keep running ▶                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Terminal 2: Frontend                    │
├─────────────────────────────────────────┤
│ cd D:\SaloneVest--main\frontend        │
│ npm run dev                             │
│                                         │
│ PORT: 3000                              │
│ Keep running ▶                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Terminal 3: Utilities/Testing           │
├─────────────────────────────────────────┤
│ For one-off commands:                   │
│ - npm scripts                           │
│ - Testing                               │
│ - Git operations                        │
│ - Deployments                           │
└─────────────────────────────────────────┘
```

---

## Development Workflow

### 1. Start Servers
```powershell
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### 2. Make Changes
- Edit React components in `frontend/`
- Edit API routes in `backend/src/routes/`
- Changes auto-reload in dev mode

### 3. Test Changes
- Check browser: `http://localhost:3000`
- Check API: `curl http://localhost:5000/health`
- Check console (F12) for errors

### 4. Build for Production
```powershell
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

### 5. Deploy
- Backend: Deploy to hosting service
- Frontend: Deploy to Vercel or similar

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/auth/login` | Login with Phantom signature |
| GET | `/api/user/:address` | Get user profile |
| GET | `/api/portfolio?address=...` | Get portfolio stats |
| GET | `/api/transactions?address=...` | Get transactions |
| GET | `/api/investments` | Get all investments |
| POST | `/api/investments/buy` | Create investment |

---

## Feature Checklist

### Frontend ✓
- [x] Home page with hero section
- [x] Phantom wallet connection
- [x] Dashboard with stats
- [x] Portfolio view
- [x] Investment listing
- [x] Responsive design
- [x] Dark/light mode (toggle)

### Backend ✓
- [x] Express API server
- [x] MongoDB integration
- [x] User authentication
- [x] Investment management
- [x] Portfolio calculations
- [x] Transaction tracking

### Smart Contracts ⏳
- [ ] Anchor CLI (requires Visual C++)
- [ ] Investment escrow contract
- [ ] Token management
- [ ] Fund release conditions

---

## Documentation Files

| File | Purpose |
|------|---------|
| `PHANTOM_CONNECTION_ERROR_FIXED.md` | Wallet connection fix |
| `PHANTOM_DEBUG_GUIDE.md` | Troubleshooting Phantom |
| `PHANTOM_QUICK_REFERENCE.md` | Quick Phantom reference |
| `COMPLETE_ERROR_FIX_GUIDE.md` | All error fixes |
| `BUILD_ERROR_FIXED.md` | Build fix explanation |
| `ANCHOR_DEVELOPMENT_GUIDE.md` | Smart contracts guide |
| `ANCHOR_QUICK_REFERENCE.md` | Anchor commands |

---

## Next Steps

### Immediate (Today)
1. [x] Install dependencies
2. [ ] Start backend server
3. [ ] Start frontend server
4. [ ] Test in browser at `http://localhost:3000`

### Short Term (This Week)
1. [ ] Test wallet connection
2. [ ] Verify API endpoints
3. [ ] Check dashboard data
4. [ ] Test investment flow

### Medium Term (This Month)
1. [ ] Implement smart contracts (optional)
2. [ ] Add more features
3. [ ] Security audit
4. [ ] Performance testing

### Long Term (Production)
1. [ ] Deploy backend
2. [ ] Deploy frontend
3. [ ] Launch on mainnet
4. [ ] Marketing & onboarding

---

## Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Express Docs:** https://expressjs.com/
- **Solana Docs:** https://docs.solana.com/
- **Phantom Docs:** https://docs.phantom.app/
- **MongoDB Docs:** https://docs.mongodb.com/

---

## Support & Help

### Check Logs
```powershell
# Backend errors
# Watch terminal output in Terminal 1

# Frontend errors
# Press F12 in browser → Console tab

# API errors
# Check Network tab (F12 → Network)
```

### Debug Tools
- Browser DevTools (F12)
- Solana Explorer: https://explorer.solana.com/?cluster=devnet
- Phantom Wallet Extension Settings

### Getting Help
1. Check relevant documentation file
2. Search issue in GitHub
3. Check browser console (F12)
4. Check terminal output
5. Verify .env files exist

---

## Summary

**All dependencies installed ✓**
**Environment ready ✓**

**To start development:**

```powershell
# Terminal 1
cd D:\SaloneVest--main\backend
npm run dev

# Terminal 2
cd D:\SaloneVest--main\frontend
npm run dev

# Browser
http://localhost:3000
```

**Expected:**
- Backend running on port 5000
- Frontend running on port 3000
- No console errors
- Dashboard visible after Phantom connection

