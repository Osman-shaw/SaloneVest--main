# 🚀 Quick Start - SaloneVest

## Prerequisites
✅ Node.js v16+
✅ MongoDB running
✅ Phantom Wallet installed

---

## Start the Application

### Terminal 1: Backend
```powershell
cd D:\SaloneVest--main\backend
npm start
```

**Expected output:**
```
✅ MongoDB connected successfully
📡 Server running on http://localhost:5000
✅ Ready to accept requests
```

---

### Terminal 2: Frontend
```powershell
cd D:\SaloneVest--main\frontend
npm run dev
```

**Expected output:**
```
▲ Next.js 16.0.3
✓ Ready in 2.5s
```

---

## Open the App

Visit: **http://localhost:3000**

---

## Test the Features

### 1. Connect Wallet
```
Click "Connect Wallet" button
→ Phantom opens
→ Approve connection
→ Sign message
→ Redirected to dashboard ✅
```

### 2. Seed Test Data
```
Navigate to: http://localhost:3000/admin/investments
Click "Seed Investments (31)" button
✅ 31 investment opportunities loaded
```

### 3. View Investments
```
Navigate to: http://localhost:3000/dashboard
✅ See all investment opportunities
```

### 4. Submit Withdrawal
```
Navigate to: http://localhost:3000/remit
Click "Withdraw" tab
Select payment method (Bank/Orange/Afromo)
Enter amount and details
Click "Submit Withdrawal"
✅ Withdrawal request created
```

### 5. Approve Withdrawal (Admin)
```
Navigate to: http://localhost:3000/admin/withdrawals
Click "Approve" on pending request
✅ Withdrawal approved
```

---

## Troubleshooting

### Backend won't start
```powershell
# Kill any existing Node processes
Stop-Process -Name node -Force

# Clear npm cache
npm cache clean --force

# Reinstall
cd backend
npm install
npm start
```

### MongoDB connection error
```
Verify MongoDB is running:
  Windows: mongod.exe running
  Or use: mongo.mongodb.net cloud connection
```

### Frontend build errors
```powershell
cd frontend
rm -r .next node_modules
npm install
npm run build
npm run dev
```

### Port already in use
```powershell
# Backend (change PORT in backend/.env)
# Frontend auto-switches if port taken
npm run dev -- -p 3001
```

---

## Verify Everything Works

### API Health Check
Visit: **http://localhost:5000/health**

Should return:
```json
{
  "status": "ok",
  "service": "SaloneVest Backend API"
}
```

### Frontend Diagnostics
Visit: **http://localhost:3000/debug**

Should show:
```
✅ Backend API Status: Online
```

---

## Key Endpoints

| Feature | URL |
|---------|-----|
| Home | http://localhost:3000 |
| Dashboard | http://localhost:3000/dashboard |
| Portfolio | http://localhost:3000/portfolio |
| Remit | http://localhost:3000/remit |
| Admin Withdrawals | http://localhost:3000/admin/withdrawals |
| Admin Investments | http://localhost:3000/admin/investments |
| Debug | http://localhost:3000/debug |
| Backend Health | http://localhost:5000/health |

---

## Stop the Application

```powershell
# Press Ctrl+C in each terminal
# Or:
Stop-Process -Name node -Force
```

---

## Documentation

- **Setup Guide:** `STARTUP_GUIDE.md`
- **Feature Summary:** `FEATURE_SUMMARY.md`
- **Login Fix:** `LOGIN_FIX.md`
- **API Error Fix:** `API_ERROR_FIX.md`

---

## Ready?

Your SaloneVest application is ready to use! 🎉

1. Start backend (Terminal 1)
2. Start frontend (Terminal 2)
3. Open http://localhost:3000
4. Connect wallet and explore!
