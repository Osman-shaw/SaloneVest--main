# 🚨 API 404 Error - Quick Fix

## The Issue

You're getting a **404 error** when trying to log in:

```
❌ API Error [404]: {}
```

## The Solution (3 Steps)

### Step 1: Start Backend ⚙️

```bash
# Open a new terminal and run:
cd backend
npm run dev
```

**Expected:** You should see:
```
🚀 SaloneVest Backend Server
📡 Server running on http://localhost:5000
✅ Ready to accept requests
```

### Step 2: Start Frontend 🚀

```bash
# Open another terminal and run:
cd frontend
npm run dev
```

**Expected:** You should see:
```
▲ Next.js 16.0.3
✓ Ready in 2.34s
Local: http://localhost:3000
```

### Step 3: Test Login 🔐

1. Open `http://localhost:3000` in browser
2. Click "Connect Phantom" button
3. Approve the signature in Phantom wallet
4. Dashboard should load ✅

---

## Why Did This Happen?

The **404 error** means the backend server isn't running or endpoints aren't accessible.

**Most Common Reasons:**
- ❌ Backend wasn't started (`npm run dev`)
- ❌ Backend crashed or stopped
- ❌ Port 5000 already in use
- ❌ MongoDB connection failed

---

## Verify It's Fixed

### Check Backend Health

Open this in your browser:
```
http://localhost:5000/health
```

Should show:
```json
{
  "status": "ok",
  "timestamp": "2025-12-08T...",
  "service": "SaloneVest Backend API"
}
```

### Check Using Diagnostics Tool

Open: `http://localhost:3000/diagnostics`

This tool will:
- ✅ Test backend connectivity
- ✅ Test all endpoints
- ✅ Show which endpoint is failing
- ✅ Provide troubleshooting steps

---

## If You Still Get 404

### Issue: Backend won't start

**Check Node.js is installed:**
```bash
node --version
```

**If not:** Install from https://nodejs.org/

**Check dependencies:**
```bash
cd backend
npm install
npm run dev
```

### Issue: Port 5000 is already in use

**Find what's using it:**
```bash
# Windows:
netstat -ano | findstr :5000

# Mac/Linux:
lsof -i :5000
```

**Kill the process or use different port:**
```bash
# Use port 5001 instead:
PORT=5001 npm run dev
```

### Issue: MongoDB connection failed

**Check your .env file:**
```bash
# backend/.env should have:
CONNECTION_STRING=mongodb://localhost:27017/salonevest
# or MongoDB Atlas connection string
```

**Ensure MongoDB is running:**
```bash
# If using local MongoDB:
mongod

# If using MongoDB Atlas:
# Just ensure CONNECTION_STRING is correct in .env
```

---

## Terminal Setup (Recommended)

You need **2 terminals** running simultaneously:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Keep this running. Shows:
```
📡 Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend  
npm run dev
```
Keep this running. Shows:
```
Local: http://localhost:3000
```

Then visit `http://localhost:3000` in your browser.

---

## Quick Troubleshooting Flowchart

```
Getting 404 error?
    ↓
Is backend running?
    ├─ YES → Go to step 2
    └─ NO  → Run: cd backend && npm run dev
        ↓
Is frontend running?
    ├─ YES → Go to step 3
    └─ NO  → Run: cd frontend && npm run dev
        ↓
Can you see "Connect Phantom" button?
    ├─ YES → Click it & test
    └─ NO  → Check console errors (F12)
        ↓
Does dashboard load after connecting?
    ├─ YES → ✅ FIXED!
    └─ NO  → Use /diagnostics tool
```

---

## What Was Added

To help debug future issues, I added:

**Diagnostics Tool:** `/frontend/app/diagnostics/page.tsx`
- Visit: `http://localhost:3000/diagnostics`
- Tests backend connectivity
- Tests all endpoints
- Shows response times
- Provides troubleshooting guide

**Error Fix Guide:** `FIX_API_404_ERROR.md`
- Detailed explanation of the error
- Step-by-step solutions
- Debugging checklist
- Common issues & fixes

---

## Test Checklist

After fixing, verify everything works:

- [ ] `http://localhost:5000/health` returns JSON
- [ ] `http://localhost:3000` loads
- [ ] "Connect Phantom" button is visible
- [ ] Click button → Phantom opens
- [ ] Approve signature → Dashboard loads
- [ ] Dashboard shows account info
- [ ] Can see 31 investment opportunities
- [ ] Can click "Invest Now"

---

## Files Modified/Created

### New Files
- `frontend/app/diagnostics/page.tsx` - Diagnostics tool
- `FIX_API_404_ERROR.md` - Detailed fix guide

### Purpose
- Help diagnose backend/API issues
- Provide step-by-step troubleshooting
- Test endpoints without manual coding

---

## Next Steps

1. **Immediate:** Start backend & frontend (see Step 1-2 above)
2. **Test:** Try connecting wallet
3. **If error:** Use `/diagnostics` tool
4. **Debug:** Check which endpoint is failing
5. **Report:** Include console errors + diagnostics results

---

## Need Help?

1. **Check logs:**
   - Browser console (F12 → Console)
   - Backend terminal output

2. **Use diagnostics tool:**
   - `http://localhost:3000/diagnostics`
   - Test endpoints
   - Follow troubleshooting guide

3. **Verify setup:**
   - Both terminals running
   - Correct ports (3000, 5000)
   - MongoDB connected (if applicable)

---

**Status:** ✅ Ready to Fix

**Time to resolve:** 2-5 minutes

**Difficulty:** Easy (just start the servers!)

