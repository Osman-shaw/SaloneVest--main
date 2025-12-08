# 🔧 Fix API 404 Error - Complete Guide

## The Problem

```
❌ API Error [404]: {}
at <unknown> (lib/api-client.ts:78:21)
at async retryRequest (lib/api-client.ts:26:16)
at async login (context/user-context.tsx:50:38)
```

### What This Means

**404 = "Not Found"** - The backend endpoint the frontend is trying to reach doesn't exist or isn't accessible.

---

## ✅ Solution Steps

### Step 1: Start the Backend

The most common cause - the backend isn't running!

```bash
# Terminal 1 - Start the Backend
cd backend
npm install          # If you haven't installed dependencies
npm run dev          # Start in development mode
```

**Expected output:**
```
🚀 SaloneVest Backend Server
📡 Server running on http://localhost:5000
🌐 Frontend URL: http://localhost:3000
📊 Health check: http://localhost:5000/health
⚡ WebSocket initialized

✅ Ready to accept requests
```

**If this doesn't work**, check:
- Node.js is installed: `node --version`
- Dependencies are installed: Check `/backend/package.json`
- Port 5000 isn't being used: Try `lsof -i :5000` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows)

---

### Step 2: Start the Frontend

```bash
# Terminal 2 - Start the Frontend
cd frontend
npm install          # If you haven't installed dependencies
npm run dev          # Start in development mode
```

**Expected output:**
```
  ▲ Next.js 16.0.3
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.34s
```

---

### Step 3: Verify Backend is Working

Visit the health check endpoint:

**In Browser:**
```
http://localhost:5000/health
```

**Should return:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-08T14:30:00.000Z",
  "service": "SaloneVest Backend API"
}
```

**Or using cURL:**
```bash
curl http://localhost:5000/health
```

---

### Step 4: Test the Login Endpoint

**Option A: Using Frontend Diagnostics Tool (Easiest)**

1. Open: `http://localhost:3000/diagnostics`
2. Click "Test All" button
3. Check if `/api/auth/connect` shows ✅ success

**Option B: Using cURL**

```bash
curl -X POST http://localhost:5000/api/auth/connect \
  -H "Content-Type: application/json" \
  -d '{
    "publicKey": "test-wallet-address",
    "signature": "test-signature",
    "message": "test-message"
  }'
```

**Should return error because signature is invalid (expected):**
```json
{
  "error": "Signature verification failed"
}
```

The important part is it **doesn't return 404** - endpoint exists!

---

### Step 5: Test Login Flow in Frontend

1. Open: `http://localhost:3000`
2. Click "Connect Phantom" button
3. Approve Phantom signature request
4. Should redirect to dashboard with data

**If you still get 404:**
- Check browser console (F12 → Console tab)
- Check Network tab to see full request/response
- Check backend terminal for error messages

---

## 🔍 Debugging Checklist

### Backend Running?
```bash
# Check if backend is running
curl http://localhost:5000/health

# Should return 200 OK with JSON
# If error: "Connection refused" → Backend not running
# If error: "404 Not Found" → Health endpoint missing
```

### Endpoints Registered?
Check `/backend/src/server.ts` has these lines:
```typescript
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/admin', adminRoutes);
```

### Routes Exported?
Check `/backend/src/routes/auth.routes.ts`:
```typescript
router.post('/connect', connectWallet);
export default router;
```

### API URL Correct?
Check environment variables:
```bash
# Frontend: /frontend/.env.local or .env
NEXT_PUBLIC_API_URL=http://localhost:5000

# Backend: /backend/.env
PORT=5000
FRONTEND_URL=http://localhost:3000
```

---

## 📋 Common Errors & Solutions

### Error: "Cannot connect to localhost:5000"
**Cause:** Backend not running
**Fix:**
```bash
cd backend
npm run dev
```

### Error: "Endpoint not found [404]"
**Cause:** Wrong endpoint URL or route not mounted
**Fix:** Use `/diagnostics` tool to identify which endpoint is failing

### Error: "Connection refused"
**Cause:** Port 5000 already in use or firewall blocking
**Fix:**
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID {PID} /F

# Mac/Linux:
lsof -i :5000
kill -9 {PID}

# Or use different port:
PORT=5001 npm run dev
```

### Error: "CORS error"
**Cause:** Backend and frontend URLs don't match
**Fix:** Check FRONTEND_URL in backend/.env matches your frontend URL

### Error: "Database connection failed"
**Cause:** MongoDB not running or connection string wrong
**Fix:**
```bash
# Check MongoDB is running
# Update CONNECTION_STRING in backend/.env
```

---

## 🚀 Quick Fix Command

If everything is broken, start fresh:

```bash
# Terminal 1
cd backend
npm install
npm run dev

# Terminal 2  
cd frontend
npm install
npm run dev

# Then visit
http://localhost:3000
```

---

## 📱 Using Diagnostics Tool

**Path:** `http://localhost:3000/diagnostics`

**Features:**
- ✅ Backend health check
- ✅ Test all endpoints
- ✅ See response times
- ✅ View error messages
- ✅ Troubleshooting guide

**Steps:**
1. Open `/diagnostics` page
2. Verify "Backend Running" shows ✅
3. Click "Test All" to test endpoints
4. Check which endpoint shows ❌
5. Reference troubleshooting guide

---

## 🔐 Auth Flow Diagram

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │
       │ 1. User clicks "Connect Phantom"
       ↓
┌─────────────────┐
│ Phantom Wallet  │
│   Extension     │
└──────┬──────────┘
       │
       │ 2. User approves → returns publicKey + signs message
       ↓
┌──────────────────────────────────┐
│  Frontend (wallet-connect.tsx)   │
│  - Gets publicKey & signature    │
│  - Prepares POST request         │
└──────┬───────────────────────────┘
       │
       │ 3. POST /api/auth/connect
       │    {publicKey, signature, message}
       ↓
┌──────────────────────────────────┐
│  Backend API (port 5000)         │
│  /api/auth/connect endpoint      │
│  - Verifies signature            │
│  - Creates/finds user            │
│  - Returns user data             │
└──────┬───────────────────────────┘
       │
       │ 4. 200 OK + user data
       ↓
┌──────────────────────────────────┐
│  Frontend (Dashboard)            │
│  - Stores wallet address         │
│  - Saves user data               │
│  - Shows portfolio & investments │
└──────────────────────────────────┘
```

---

## ✨ Expected Behavior After Fix

### Before Connecting Wallet
```
✅ Frontend: http://localhost:3000
❌ Backend: Not running
Result: "Connect Your Wallet" message
```

### After Backend Starts
```
✅ Frontend: http://localhost:3000
✅ Backend: http://localhost:5000
✅ Health: http://localhost:5000/health
Result: Can click "Connect Phantom"
```

### After Connecting Wallet
```
✅ Frontend: Running
✅ Backend: Running  
✅ Auth endpoint: Working
✅ Wallet address: Stored
Result: Dashboard displays with data
```

---

## 📊 Request/Response Examples

### Successful Login Flow

**Frontend sends:**
```bash
POST http://localhost:5000/api/auth/connect
Content-Type: application/json

{
  "publicKey": "EPjFWaYbxUqkfJzaGEHqJpzUa8CJe3Rbn...",
  "signature": "4wEi...xyz",
  "message": "Sign this message to authenticate..."
}
```

**Backend responds:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "walletAddress": "EPjFWaYbxUqkfJzaGEHqJpzUa8CJe3Rbn...",
    "role": "user",
    "createdAt": "2025-12-08T14:30:00Z"
  }
}
```

**Frontend receives:**
- ✅ 200 OK
- ✅ User data
- ✅ Redirects to dashboard

---

## 🎯 Verification Steps

After applying the fix:

- [ ] Backend running: `http://localhost:5000/health` returns 200 OK
- [ ] Frontend running: `http://localhost:3000` loads
- [ ] Can see "Connect Phantom" button
- [ ] Can click button (Phantom extension opens)
- [ ] Can approve signature (Phantom modal)
- [ ] Redirected to dashboard (no errors)
- [ ] Dashboard shows account & portfolio
- [ ] Can see all 31 investments
- [ ] Can click "Invest Now" on any investment

---

## 📞 Still Having Issues?

### Check Logs

**Frontend Console (F12):**
- Open Developer Tools (F12)
- Go to Console tab
- Look for red ❌ errors
- Note the exact error message

**Backend Terminal:**
- Check for error messages
- Note timestamp and error details
- Screenshot helpful for debugging

### Run Diagnostics

```
Visit: http://localhost:3000/diagnostics
- Check backend status
- Test all endpoints
- View troubleshooting guide
```

### Verify Endpoints

```bash
# Check auth endpoint
curl -X POST http://localhost:5000/api/auth/connect \
  -H "Content-Type: application/json" \
  -d '{"publicKey":"test","signature":"test","message":"test"}'

# Should return 400 or 401 error (invalid data)
# NOT 404 (endpoint doesn't exist)
```

---

## ✅ Status Checklist

| Item | Status | How to Check |
|------|--------|--------------|
| Backend Running | ? | `curl http://localhost:5000/health` |
| Frontend Running | ? | Visit `http://localhost:3000` |
| Auth Endpoint | ? | Test in Diagnostics page |
| Database | ? | Check backend console |
| API Response | ? | Browser DevTools → Network tab |
| Login Flow | ? | Click "Connect Phantom" |

---

## 🚀 Next Steps After Fix

1. ✅ Fix the 404 error (this guide)
2. ✅ Verify backend running
3. ✅ Test login flow
4. ✅ Check dashboard loads
5. ✅ Browse investments
6. ✅ Try making an investment
7. ✅ Check portfolio page
8. ✅ Test all features

---

**Last Updated:** December 8, 2025
**Next.js Version:** 16.0.3 (Turbopack)
**Backend:** Node.js + Express
**Database:** MongoDB

**Status:** Ready to fix! 🎉

