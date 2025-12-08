# 📡 API Error Diagnosis & Architecture Guide

## Current Issue: 404 Error on Login

When you try to connect your Phantom wallet, you get:
```
❌ API Error [404]: {}
```

## Root Cause

The 404 error means **the backend server is not running** or the API endpoint doesn't exist.

### Connection Flow

```
┌─────────────────────────────────────────────────────┐
│ Your Browser (http://localhost:3000)               │
│                                                      │
│  User clicks: "Connect Phantom"                    │
│       ↓                                             │
│  Phantom signs a message                           │
│       ↓                                             │
│  Frontend sends: POST /api/auth/connect            │
│  + publicKey, signature, message                   │
└────────────────┬────────────────────────────────────┘
                 │
                 │ Network Request (HTTP)
                 ↓
┌─────────────────────────────────────────────────────┐
│ Backend Server (http://localhost:5000)             │
│                                                      │
│ ❌ IF NOT RUNNING → 404 Error                       │
│ ✅ IF RUNNING → Processes request                   │
│    - Verifies signature                             │
│    - Creates/finds user in database                 │
│    - Returns user data (200 OK)                     │
└─────────────────────────────────────────────────────┘
```

## Solution: Start the Backend

### What You Need

**2 Terminal Windows:**

```
Terminal 1                          Terminal 2
═══════════════════════════════════════════════════════
cd backend                         cd frontend
npm run dev                        npm run dev

Server listens on:                 Server listens on:
http://localhost:5000              http://localhost:3000

Handles API calls                  Renders UI
```

### Step by Step

**Terminal 1 - Start Backend:**
```bash
cd backend
npm install  # First time only
npm run dev
```

When successful, you'll see:
```
🚀 SaloneVest Backend Server
📡 Server running on http://localhost:5000
🌐 Frontend URL: http://localhost:3000
📊 Health check: http://localhost:5000/health
⚡ WebSocket initialized

✅ Ready to accept requests
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm install  # First time only
npm run dev
```

When successful, you'll see:
```
▲ Next.js 16.0.3
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 1.23s
```

**Browser:**
1. Open `http://localhost:3000`
2. Click "Connect Phantom"
3. Should work! ✅

---

## How to Know If It's Working

### Check 1: Health Endpoint
```bash
# Open in browser or terminal:
http://localhost:5000/health
```

**Success:** Returns JSON with "ok" status
```json
{
  "status": "ok",
  "timestamp": "2025-12-08T14:30:00Z",
  "service": "SaloneVest Backend API"
}
```

**Failure:** Shows "Connection refused" or "Cannot reach server"

### Check 2: Diagnostics Tool
```
http://localhost:3000/diagnostics
```

This shows:
- Backend status
- Which endpoints work/fail
- Response times
- Troubleshooting tips

### Check 3: Browser DevTools
```
1. Open http://localhost:3000
2. Press F12 → Network tab
3. Click "Connect Phantom"
4. Watch network request to /api/auth/connect
5. Should show 200/201 OK, not 404
```

---

## Architecture Overview

### File Structure

```
SaloneVest/
├── backend/
│   ├── src/
│   │   ├── server.ts              ← Starts Express server on :5000
│   │   ├── routes/
│   │   │   └── auth.routes.ts     ← POST /api/auth/connect endpoint
│   │   ├── controllers/
│   │   │   └── auth.controller.ts ← Handles wallet verification
│   │   └── models/
│   │       └── User.ts            ← Database schema
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx              ← Home page (port 3000)
│   │   ├── dashboard/page.tsx    ← Logged-in dashboard
│   │   └── diagnostics/page.tsx  ← NEW: Debug tool
│   ├── components/
│   │   └── wallet-connect.tsx    ← "Connect Phantom" button
│   ├── context/
│   │   └── user-context.tsx      ← Calls /api/auth/connect
│   ├── lib/
│   │   └── api-client.ts         ← HTTP client (axios)
│   └── package.json
│
├── QUICK_FIX_404.md              ← NEW: Quick fix guide
└── FIX_API_404_ERROR.md          ← NEW: Detailed guide
```

### Request Flow

```
1. Browser & Frontend (Port 3000)
   └─ User clicks "Connect Phantom"
   └─ wallet-connect.tsx handles it
   └─ Calls api.auth.connect()
   └─ Sends HTTP POST request

2. HTTP Request Layer
   └─ URL: http://localhost:5000/api/auth/connect
   └─ Method: POST
   └─ Headers: Content-Type: application/json
   └─ Body: {publicKey, signature, message}

3. Backend Server (Port 5000)
   └─ Express.js receives request
   └─ Routes it to /api/auth
   └─ Calls auth.routes.ts
   └─ Dispatches to auth.controller.ts

4. Authentication Logic
   └─ Verifies signature using NaCl
   └─ Checks if user exists in MongoDB
   └─ Creates user if new
   └─ Returns user data

5. Response Back to Frontend
   └─ Status: 200 OK
   └─ Body: {success: true, user: {...}}
   └─ Frontend stores data & redirects
```

---

## API Endpoints

### Core Endpoints Used

| Endpoint | Method | Purpose | Frontend Calls |
|----------|--------|---------|-----------------|
| `/health` | GET | Check if backend running | /diagnostics |
| `/api/auth/connect` | POST | Authenticate wallet | wallet-connect.tsx |
| `/api/user/{address}` | GET | Get user profile | user-context.tsx |
| `/api/portfolio/{address}` | GET | Get portfolio balance | portfolio hook |
| `/api/investments` | GET | List all investments | dashboard |
| `/api/admin/stats` | GET | Admin statistics | admin page |

### Why 404?

Each endpoint needs:

```
1. Route Definition
   ✅ backend/src/routes/auth.routes.ts:
      router.post('/connect', connectWallet)

2. Controller Function
   ✅ backend/src/controllers/auth.controller.ts:
      export const connectWallet = async (req, res) => { ... }

3. Route Mounting
   ✅ backend/src/server.ts:
      app.use('/api/auth', authRoutes)

4. Server Running
   ❌ If server isn't running → 404 Error
```

---

## Common Problems & Solutions

### Problem 1: "Connection refused"
```
Error: ECONNREFUSED 127.0.0.1:5000
```

**Cause:** Backend not running

**Fix:**
```bash
cd backend
npm run dev
```

---

### Problem 2: "404 Not Found"
```
GET http://localhost:5000/api/auth/connect 404
```

**Causes:**
1. Backend not running
2. Route not properly registered
3. Wrong endpoint URL

**Fix:**
1. Verify backend running: `curl http://localhost:5000/health`
2. Check routes mounted in server.ts
3. Verify endpoint path is `/api/auth/connect`

---

### Problem 3: "Cannot GET /api/auth/connect"
```
Cannot GET /api/auth/connect
```

**Cause:** Using GET instead of POST

**Fix:** Check frontend is using POST method

---

### Problem 4: "Port 5000 already in use"
```
Error: listen EADDRINUSE :::5000
```

**Cause:** Another process using port 5000

**Fix:**
```bash
# Option 1: Kill the process
# Windows:
netstat -ano | findstr :5000
taskkill /PID {PID} /F

# Mac/Linux:
lsof -i :5000
kill -9 {PID}

# Option 2: Use different port
PORT=5001 npm run dev
```

---

## Environment Configuration

### Backend (.env or .env.local)
```
# backend/.env
PORT=5000
FRONTEND_URL=http://localhost:3000
CONNECTION_STRING=mongodb://localhost:27017/salonevest
NODE_ENV=development
```

### Frontend (.env.local)
```
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**If these don't match → 404 or CORS errors**

---

## Debugging with Tools

### Built-in Diagnostics

**Visit:** `http://localhost:3000/diagnostics`

**Tests:**
- Backend connectivity
- All API endpoints
- Response times
- Provides solutions

### Browser DevTools

**Press F12 → Network Tab:**

1. Open `http://localhost:3000`
2. Click "Connect Phantom"
3. Watch requests appear
4. Click on `/api/auth/connect` request
5. See:
   - Status code (200 = good, 404 = bad)
   - Headers sent
   - Response body
   - Response time

### Terminal Logs

**Backend Terminal:**
Shows all incoming requests and errors
```
2025-12-08T14:30:00 - POST /api/auth/connect
Authentication successful for EPjF...
User created: {...}
```

**Frontend Terminal:**
Shows build errors and warnings
```
✓ Compiled successfully
```

---

## Quick Verification

Run this to verify setup:

```bash
# 1. Check backend health
curl http://localhost:5000/health

# 2. Check frontend health  
curl http://localhost:3000

# 3. Check auth endpoint (will fail signature, but proves endpoint exists)
curl -X POST http://localhost:5000/api/auth/connect \
  -H "Content-Type: application/json" \
  -d '{"publicKey":"test","signature":"test","message":"test"}'

# Expected: Error about invalid signature (not 404!)
```

---

## Success Indicators

✅ Backend running:
```bash
$ npm run dev
🚀 SaloneVest Backend Server
📡 Server running on http://localhost:5000
```

✅ Frontend running:
```bash
$ npm run dev
▲ Next.js 16.0.3
Local: http://localhost:3000
```

✅ Can connect Phantom:
- Click "Connect Phantom"
- Phantom opens
- Can approve signature
- Redirected to dashboard

✅ Dashboard loads:
- See wallet address
- See portfolio balance
- See 31 investments
- Can click "Invest Now"

---

## Troubleshooting Checklist

- [ ] Both terminals running (backend + frontend)?
- [ ] Backend shows "Ready to accept requests"?
- [ ] Frontend shows "Ready"?
- [ ] Can access http://localhost:5000/health?
- [ ] Can access http://localhost:3000?
- [ ] Phantom wallet extension installed?
- [ ] Phantom set to Devnet?
- [ ] /diagnostics page shows backend online?
- [ ] Can click "Connect Phantom" button?
- [ ] Phantom signature dialog appears?
- [ ] Dashboard loads after approval?

---

## After Fixing This Issue

Once you have both servers running and can login:

1. **Test Features:**
   - Browse 31 investments
   - Click "Invest Now"
   - Check portfolio page
   - View withdrawal options

2. **Explore Admin Panel:**
   - Visit `/admin/investments`
   - Visit `/admin/withdrawals`
   - Seed test data if needed

3. **Check All Pages:**
   - `/dashboard` - Home
   - `/portfolio` - Your portfolio
   - `/investments` - Opportunities
   - `/remit` - Withdrawals
   - `/profile` - User profile

---

**Status:** Ready to Fix! 🚀

**Time Required:** 5-10 minutes

**Difficulty:** Very Easy (just start servers)

