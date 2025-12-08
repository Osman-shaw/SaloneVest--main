# 🆘 Troubleshooting Guide - SaloneVest

## Common Errors & Solutions

### 1. ❌ "Network Error: No response received"

**What it means:** Frontend tried to contact backend but got no response.

**Causes:**
- Backend server is not running
- Backend is still starting up
- Port 5000 is blocked by firewall
- Wrong API URL configured

**Solutions:**

**Step 1: Check if backend is running**
```powershell
netstat -ano | findstr "5000"
```

If no output, backend is NOT running.

**Step 2: Start the backend**
```powershell
cd backend
npm install
npm start
```

**Expected output:**
```
✅ Solana connected to mainnet-beta
✅ MongoDB connected successfully
📡 Server running on http://localhost:5000
✅ Ready to accept requests
```

**Step 3: Wait for startup**
- Give backend 5-10 seconds to fully start
- Frontend will auto-retry the request

**Step 4: Verify configuration**
```powershell
# Check backend .env
cat backend\.env | findstr "PORT\|MONGODB_URI\|FRONTEND_URL"

# Check frontend .env.local
cat frontend\.env.local | findstr "NEXT_PUBLIC_API_URL"
```

**Step 5: Test API directly**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/health"
```

Should return:
```json
{"status":"ok","timestamp":"...","service":"SaloneVest Backend API"}
```

---

### 2. ❌ "Cannot connect to backend" (ECONNREFUSED)

**What it means:** Connection was actively refused - backend is not listening.

**Causes:**
- Backend crashed or exited
- Port 5000 has another application
- Backend failed to start due to MongoDB

**Solutions:**

**Check what's using port 5000:**
```powershell
$process = netstat -ano | findstr "5000" | Select-Object -Last 1
$pid = $process.Split()[-1]
tasklist | findstr $pid
```

**Kill existing process and restart:**
```powershell
Stop-Process -Id $pid -Force
cd backend
npm start
```

**Check MongoDB connection:**
```powershell
# Test MongoDB is running
# Windows: Services > MongoDB
# Or test connection in backend logs
```

---

### 3. ❌ "404 - Endpoint not found"

**What it means:** Backend is running but the endpoint doesn't exist.

**Causes:**
- Wrong API endpoint called
- Backend routes not registered
- API URL has typo

**Solutions:**

**Verify API URL:**
```powershell
# Frontend .env.local should have:
cat frontend\.env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Check backend routes:**
```powershell
# These endpoints should exist:
curl http://localhost:5000/health
curl http://localhost:5000/api/auth/connect  # (requires POST)
curl http://localhost:5000/api/user
curl http://localhost:5000/api/investments
```

---

### 4. ❌ "Backend port already in use (EADDRINUSE)"

**What it means:** Another process is already using port 5000.

**Solutions:**

**Find and kill the process:**
```powershell
$port = 5000
$process = netstat -ano | findstr ":$port " | Select-Object -Last 1
if ($process) {
    $pid = $process.Split()[-1]
    Write-Host "Killing process $pid using port $port"
    Stop-Process -Id $pid -Force
}

# Wait and retry
Start-Sleep -Seconds 2
cd backend
npm start
```

**Use a different port:**
```powershell
# In backend/.env
PORT=5001

# In frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5001

# Restart both servers
```

---

### 5. ❌ "MongoDB connection failed"

**What it means:** Backend can't connect to MongoDB.

**Causes:**
- MongoDB is not running
- Connection string is wrong
- MongoDB server is unreachable

**Solutions:**

**Check MongoDB is running (Windows):**
```powershell
Get-Service | findstr -i mongodb
```

**Start MongoDB (if installed locally):**
```powershell
# Start MongoDB service
net start MongoDB

# Or manually run mongod.exe from installation directory
```

**Verify connection string in backend/.env:**
```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/salonevest

# Or MongoDB Atlas (cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/salonevest?retryWrites=true&w=majority
```

**Test MongoDB connection:**
```powershell
# Install MongoDB tools if needed
mongo --version

# Test connection
mongo "mongodb://localhost:27017"
```

---

### 6. ✅ Everything works but login still fails

**What to do:**

1. **Clear browser cache:**
   - Press `Ctrl+Shift+Delete`
   - Clear cookies and cache
   - Reload page

2. **Check browser console:**
   - Press `F12`
   - Go to Console tab
   - Look for error messages
   - Copy full error and search below

3. **Check backend logs:**
   - Look at backend terminal window
   - Copy error message
   - Check for database or validation errors

4. **Visit diagnostics page:**
   ```
   http://localhost:3000/debug
   ```
   Should show "✅ Backend API Status: Online"

---

## 🔧 Quick Diagnostic Commands

```powershell
# Test backend health
Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing

# Check port 5000
netstat -ano | findstr "5000"

# Check Node processes
Get-Process node

# Kill all Node processes
Stop-Process -Name node -Force

# Check MongoDB running
Get-Service | findstr mongodb

# View backend logs (last 50 lines)
Get-Content backend\package-lock.json  # Just to verify file exists
```

---

## 🎯 Startup Checklist

Before using the app, verify in order:

- [ ] MongoDB is running
  ```powershell
  Get-Service MongoDB
  # Or: mongo --version
  ```

- [ ] Backend dependencies installed
  ```powershell
  cd backend
  npm install
  ```

- [ ] Backend starts successfully
  ```powershell
  npm start
  # Should show: ✅ Ready to accept requests
  ```

- [ ] Backend responds to health check
  ```powershell
  Invoke-WebRequest http://localhost:5000/health
  # Should return 200 OK
  ```

- [ ] Frontend dependencies installed
  ```powershell
  cd frontend
  npm install
  ```

- [ ] Frontend starts successfully
  ```powershell
  npm run dev
  # Should show: ✓ Ready in X seconds
  ```

- [ ] Frontend debug page shows connected
  ```
  http://localhost:3000/debug
  # Should show: ✅ Backend API Status: Online
  ```

- [ ] Can connect wallet
  - Click "Connect Wallet"
  - Sign message in Phantom
  - Should show user profile

---

## 📊 Error Reference Table

| Error | Most Likely Cause | Fix |
|-------|------------------|-----|
| Network Error: No response | Backend not running | `cd backend && npm start` |
| ECONNREFUSED | Backend crashed | Kill process, restart |
| EADDRINUSE | Port in use | Kill process or use different port |
| MongoDB connection failed | DB not running | Start MongoDB service |
| 404 - Route not found | Wrong endpoint | Check API URL config |
| 500 - Server error | Backend error | Check backend logs |
| ETIMEDOUT | Backend too slow | Check backend logs, restart |
| CORS error | Wrong FRONTEND_URL | Check `backend/.env` |

---

## 🎓 Where to Find Help

1. **Debug Dashboard:** `http://localhost:3000/debug`
   - Real-time API status
   - Environment variables
   - Startup instructions

2. **Startup Guide:** Read `STARTUP_GUIDE.md`
   - Step-by-step setup
   - All environment variables
   - Common issues

3. **Feature Summary:** Read `FEATURE_SUMMARY.md`
   - Architecture overview
   - API endpoints
   - Data models

4. **Terminal Logs:**
   - Backend: Check terminal where `npm start` runs
   - Frontend: Press `F12` → Console tab

5. **Browser Console:**
   - Press `F12` → Console
   - Look for red error messages
   - Check for network requests (Network tab)

---

## 💡 Pro Tips

### Tip 1: Monitor Both Servers
Keep two terminals open:
```
Terminal 1: cd backend; npm start
Terminal 2: cd frontend; npm run dev
```

### Tip 2: Use Debug Page
Always check `/debug` when things aren't working.

### Tip 3: Read the Logs
Both backend and frontend output error details. Read them carefully!

### Tip 4: Clear Cache Frequently
After code changes:
```powershell
# Frontend
Delete-Item -Path frontend\.next -Recurse
npm run dev
```

### Tip 5: Test API Directly
Use PowerShell to test endpoints:
```powershell
$headers = @{"Content-Type" = "application/json"}
Invoke-WebRequest -Uri "http://localhost:5000/api/investments" -Headers $headers
```

---

## 🚀 Get Back Online

**Nuclear option (start completely fresh):**

```powershell
# Kill everything
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Stop-Process -Name mongod -Force -ErrorAction SilentlyContinue

# Clear caches
Remove-Item -Path frontend\.next -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path backend\dist -Recurse -Force -ErrorAction SilentlyContinue

# Start MongoDB
net start MongoDB

# Start backend
cd backend
npm install
npm start

# (In new terminal) Start frontend
cd frontend
npm install
npm run dev

# Open browser
start http://localhost:3000
```

If this doesn't work, check all the diagnostics above and share the error message!

---

**Still stuck? Visit `/debug` page and share what it shows!** 🆘
