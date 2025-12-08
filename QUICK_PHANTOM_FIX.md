# ⚡ Quick Phantom Error Debug - 2 Minutes

## You Got This Error
```
Unexpected error at window.phantom?.solana?.connect()
```

## The Fix ✅

**Files updated:**
1. ✅ `/frontend/lib/phantom-types.ts` - Better types
2. ✅ `/frontend/components/wallet-connect.tsx` - Better error handling

**Changes made:**
- Added error handling helper function
- Added specific error code detection
- Added detailed console logging
- Added network error detection

## To Fix It Now

### Step 1: Rebuild Frontend
```bash
cd frontend
rm -rf .next
npm run dev
```

Wait for: `✓ Compiled successfully`

### Step 2: Test Connection
1. Open `http://localhost:3000`
2. Press `F12` (open DevTools)
3. Go to `Console` tab
4. Click "Connect Phantom"
5. Approve in Phantom popup
6. **Check Console** - You should see:

✅ Success:
```
Attempting to connect to Phantom...
Successfully connected to Phantom: [your-address]
Requesting message signature from Phantom...
Successfully signed message
Successfully logged in, redirecting to dashboard...
```

❌ Error (will show specific reason):
```
Wallet connection failed: [SPECIFIC ERROR MESSAGE]
```

### Step 3: If Still Broken

**Check these in order:**

1. **Is Phantom installed?**
   - Chrome → Extensions → Phantom Wallet
   - Should see "Enabled" ✓

2. **Is Phantom on correct network?**
   - Open Phantom
   - Top-right = Network selector
   - Choose: Mainnet, Devnet, or Testnet (whatever your app uses)

3. **Is browser in incognito?**
   - Extensions don't work in incognito
   - Use normal window instead

4. **Check Console Error:**
   - F12 → Console
   - What's the exact error message?
   - Search that error below:

## Error Message Decoder

| Error | Solution |
|-------|----------|
| "Phantom wallet not installed" | Install at https://phantom.app/ |
| "User rejected the connection request" | Click Approve next time |
| "Network error" | Check internet connection |
| "Unexpected error" | Reload page, restart Phantom |
| "No public key returned" | Reload and try again |

## Test Endpoint

If connection works but login fails:

```bash
# Test backend is running
curl http://localhost:5000/health
# Should return JSON
```

## Success = Dashboard Shows ✅

After "Successfully logged in" message:
- Redirected to dashboard
- Wallet address visible in navbar
- Portfolio data showing
- Can see investments

**Not seeing that?** → Backend API issue, not connection issue

## One Command Fix

```bash
cd frontend && rm -rf .next && npm run dev
```

Then reload browser and test.

---

**Done in 2 min!** ✅

