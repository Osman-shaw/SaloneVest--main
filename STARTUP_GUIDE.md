# 🚀 SaloneVest - Quick Start Guide

## Prerequisites
- **Node.js** (v16+) - [Download](https://nodejs.org/)
- **MongoDB** - [Install](https://www.mongodb.com/try/download/community) or [Cloud](https://www.mongodb.com/cloud/atlas)
- **Phantom Wallet** - [Install Chrome Extension](https://phantom.app/)
- **Git** - [Download](https://git-scm.com/)

---

## ⚙️ Setup Instructions

### 1️⃣ Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with required variables
# Copy from .env.example and configure:
# - MONGODB_URI: mongodb://localhost:27017/salonevest (or your MongoDB URL)
# - PORT: 5000
# - FRONTEND_URL: http://localhost:3000
# - SOLANA_RPC_URL: https://api.mainnet-beta.solana.com
# - JWT_SECRET: your-secret-key-here

# Start the backend server
npm start
```

**Expected Output:**
```
🚀 SaloneVest Backend Server
📡 Server running on http://localhost:5000
🌐 Frontend URL: http://localhost:3000
📊 Health check: http://localhost:5000/health
⚡ WebSocket initialized

✅ Ready to accept requests
```

### 2️⃣ Frontend Setup

In a new terminal/PowerShell:

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file (or verify existing):
# NEXT_PUBLIC_API_URL=http://localhost:5000
# NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
# NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta

# Start the development server
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 16.0.3 (Turbopack)
  - Local:        http://localhost:3000
  - Environments: .env.local
  
✓ Ready in 2.5s
```

---

## 🔗 Connect & Test

1. **Open Frontend**: Navigate to [http://localhost:3000](http://localhost:3000)
2. **Check API Status**: Visit [http://localhost:3000/debug](http://localhost:3000/debug) to verify backend connection
3. **Connect Wallet**: Click "Connect Wallet" and sign in with Phantom
4. **Seed Data**: Navigate to `/admin/investments` and click "Seed Investments (31)" to populate test data
5. **Explore Features**:
   - 🔍 **Discover**: View investment opportunities at `/dashboard`
   - 📊 **Portfolio**: Track investments at `/portfolio`
   - 💸 **Remit**: Send money or withdraw at `/remit`
   - 👤 **Profile**: Manage profile at `/profile`
   - ⚙️ **Admin**: Manage withdrawals at `/admin/withdrawals`

---

## 🆘 Troubleshooting

### ❌ "Backend API not found" Error
**Solution:**
1. Ensure backend is running: `npm start` in `/backend`
2. Check `.env.local` has correct `NEXT_PUBLIC_API_URL=http://localhost:5000`
3. Visit [http://localhost:5000/health](http://localhost:5000/health) to test API directly
4. Visit [http://localhost:3000/debug](http://localhost:3000/debug) for diagnostics

### ❌ MongoDB Connection Error
**Solution:**
1. Start MongoDB locally or verify cloud connection string
2. Update `MONGODB_URI` in `backend/.env`
3. Restart backend server

### ❌ Wallet Connection Failed
**Solution:**
1. Install Phantom Wallet extension
2. Create/import wallet
3. Ensure wallet is unlocked
4. Refresh page and retry

### ❌ Port Already in Use
**Solution:**
```powershell
# Backend (change PORT in .env)
PORT=5001

# Frontend (Next.js auto-switches if 3000 is taken)
npm run dev -- -p 3001
```

---

## 📋 Environment Variables Checklist

### Backend (`backend/.env`)
```env
✅ MONGODB_URI=mongodb://localhost:27017/salonevest
✅ PORT=5000
✅ NODE_ENV=development
✅ FRONTEND_URL=http://localhost:3000
✅ SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
✅ SOLANA_NETWORK=mainnet-beta
✅ JWT_SECRET=your-secret-key-here-change-in-production
```

### Frontend (`frontend/.env.local`)
```env
✅ NEXT_PUBLIC_API_URL=http://localhost:5000
✅ NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
✅ NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
```

---

## 🎯 Key Features Implemented

| Feature | Endpoint | Status |
|---------|----------|--------|
| Wallet Connect | `POST /api/auth/connect` | ✅ |
| User Profile | `GET /api/user/:walletAddress` | ✅ |
| Investments | `GET /api/investments` | ✅ |
| Portfolio | `GET /api/portfolio/:walletAddress` | ✅ |
| Balance | `GET /api/balance/:walletAddress` | ✅ |
| Withdrawals | `POST /api/withdrawals` | ✅ |
| Admin Approval | `PUT /api/withdrawals/:id/approve` | ✅ |
| Seed Data | `POST /api/seed/investments` | ✅ |

---

## 🧪 Testing Workflow

1. **Test Backend API**:
   ```powershell
   # Health check
   curl http://localhost:5000/health
   ```

2. **Test Frontend Connection**:
   - Visit `http://localhost:3000/debug`
   - Should show "Backend API Status: ✅ Online"

3. **Test Wallet Connection**:
   - Click "Connect Wallet"
   - Sign message in Phantom
   - Should redirect to dashboard

4. **Test Features**:
   - Seed investments: `/admin/investments` → "Seed Investments"
   - View portfolio: `/portfolio`
   - Submit withdrawal: `/remit` → Withdraw tab
   - Approve withdrawal: `/admin/withdrawals`

---

## 📞 Support

For issues:
1. Check `/debug` page for diagnostics
2. Review terminal logs (backend and frontend)
3. Verify all environment variables are set
4. Ensure all services are running (MongoDB, backend, frontend)

---

## 🎉 You're Ready!

Once both backend and frontend are running, you can:
- ✅ Connect wallet
- ✅ View investments
- ✅ Manage portfolio
- ✅ Submit withdrawals
- ✅ Admin approvals

Happy investing! 🚀
