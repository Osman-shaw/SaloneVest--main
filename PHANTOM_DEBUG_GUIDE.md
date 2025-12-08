# 🔍 Phantom Connection Debugging Guide

## What Went Wrong

**Error:**
```
Unexpected error at window.phantom?.solana?.connect()
at #n (chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/solana.js:13:42903)
at async r.connect (chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/solana.js:13:43969)
at async handleConnect (components/wallet-connect.tsx:69:24)
```

**The Issue:**
- Phantom `connect()` method can fail in various ways
- Previous code didn't handle specific error types
- No detailed logging to understand *why* it failed
- Generic "Unexpected error" message wasn't helpful

## The Fix Applied ✅

### 1. Enhanced Type Safety

**File:** `/frontend/lib/phantom-types.ts`

**What Changed:**
```typescript
// BEFORE: Generic connect method
connect(): Promise<{ publicKey: PublicKey }>

// AFTER: With optional parameters
connect(options?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: PublicKey }>

// ADDED: Error-specific interface
export interface PhantomConnectionError extends Error {
  code?: number
  message: string
}

// ADDED: Helper functions
export const isPhantomInstalled = (): boolean => { ... }
export const connectPhantom = async (onlyIfTrusted: boolean = false) => { ... }
```

**Benefits:**
- Specific error code detection (4001, 4100)
- Type-safe error handling
- Network error detection
- Reusable across all components

### 2. Improved Error Handling

**File:** `/frontend/components/wallet-connect.tsx`

**What Changed:**
```typescript
// BEFORE: Simple try-catch
const handleConnect = async () => {
  try {
    const response = await window.phantom?.solana?.connect()
    // ... rest of logic
  } catch (error) {
    console.error("Wallet connection failed:", error)
  }
}

// AFTER: Detailed error handling
const handleConnect = async () => {
  try {
    // 1. Check if Phantom installed
    if (!isPhantomInstalled()) {
      throw new Error("Phantom wallet not installed")
    }
    
    // 2. Connect with proper error handling
    const response = await connectPhantom(false)
    
    // 3. Sign message with separate try-catch
    try {
      const signedMessage = await window.phantom?.solana?.signMessage(...)
      if (!signedMessage?.signature) {
        throw new Error("No signature returned")
      }
    } catch (signError) {
      throw new Error(`Failed to sign: ${signError.message}`)
    }
    
    // 4. Detailed logging at each step
  } catch (error) {
    // 5. Specific error message handling
    let userMessage = "Failed to connect wallet"
    if (errorMessage.includes("not installed")) { ... }
    if (errorMessage.includes("rejected")) { ... }
    if (errorMessage.includes("network")) { ... }
  }
}
```

**Benefits:**
- Specific error code handling
- Separate signing error handling
- Detailed console logging
- User-friendly error messages

### 3. New Helper Functions

**In `/frontend/lib/phantom-types.ts`:**

```typescript
// Check if Phantom is available
export const isPhantomInstalled = (): boolean => {
  return typeof window !== "undefined" && !!window.phantom?.solana
}

// Safe connection with error handling
export const connectPhantom = async (onlyIfTrusted: boolean = false) => {
  if (!isPhantomInstalled()) {
    throw new Error("Phantom wallet not installed")
  }
  
  try {
    const response = await window.phantom?.solana?.connect({ onlyIfTrusted })
    if (response?.publicKey) {
      return { publicKey: response.publicKey.toString() }
    }
    throw new Error("No public key returned from Phantom")
  } catch (error) {
    // Handle specific error codes
    if (error.code === 4001) throw new Error("User rejected")
    if (error.code === 4100) throw new Error("Not authorized")
    if (error.message?.includes("network")) throw new Error("Network error")
    throw new Error(`Phantom failed: ${error.message}`)
  }
}
```

## How to Debug

### Step 1: Enable Console Logging

Open browser DevTools:
```
Chrome: Press F12
Firefox: Press F12
Safari: Cmd + Option + I
```

Go to **Console** tab (not Network or Elements)

### Step 2: Trigger the Error

1. Click "Connect Phantom" button
2. Watch console output
3. Note the exact error message

### Step 3: Identify the Stage

Connection has 5 stages:

```
Stage 1: Check Phantom installed
         ✓ Shows: "Attempting to connect to Phantom..."
         ✗ Shows: "Phantom wallet not installed"

Stage 2: Connect to Phantom
         ✓ Shows: "Successfully connected to Phantom: [address]"
         ✗ Shows: "User rejected" or "Network error"

Stage 3: Request signature
         ✓ Shows: "Requesting message signature from Phantom..."
         ✗ Shows: "Network error" or "Unexpected error"

Stage 4: Sign message
         ✓ Shows: "Successfully signed message"
         ✗ Shows: "No signature returned" or "Network error"

Stage 5: Login to backend
         ✓ Shows: "Successfully logged in, redirecting..."
         ✗ Shows: API error or 404

```

### Step 4: Match Error to Solution

See table below for each stage

## Common Phantom Error Codes

| Code | Name | Meaning | Solution |
|------|------|---------|----------|
| 4001 | User Rejected | User clicked "Reject" | Click "Approve" next time |
| 4100 | Unauthorized | Phantom not allowed | Clear Phantom cache, re-approve |
| 4200 | Method Not Found | Bad method call | Update Phantom extension |
| -1 | Internal Error | Phantom internal issue | Restart Phantom |
| -32603 | RPC Error | Network issue | Check internet, switch RPC |

## Troubleshooting by Stage

### Stage 1 Error: "Phantom wallet not installed"

**Cause:** Extension not installed or disabled

**Solutions:**
1. **Install Phantom:**
   - Go to https://phantom.app/
   - Click "Install" for your browser
   - Complete installation

2. **Enable Extension:**
   - Open Extensions menu
   - Find "Phantom Wallet"
   - Toggle to ON

3. **Check Extensions Allowed:**
   - Check you're not in Incognito mode
   - Extensions don't work in Incognito

### Stage 2 Error: "User rejected the connection request"

**Cause:** User clicked "Reject" button in Phantom

**Solutions:**
1. Click "Connect Phantom" again
2. In popup, click "Approve" (not "Reject")
3. Should see success message

### Stage 2 Error: "Network error"

**Cause:** Phantom can't reach Solana RPC endpoint

**Solutions:**
1. **Check Internet:**
   ```bash
   ping google.com
   ```
   Should show responses

2. **Check Phantom Network:**
   - Open Phantom extension
   - Top-right corner = Network selector
   - Try: Mainnet, Devnet, or Testnet
   - Different networks may have better connectivity

3. **Restart Phantom:**
   - Close Phantom popup
   - Reload page (Ctrl+R)
   - Try again

4. **Check App Configuration:**
   - Phantom on "Mainnet" → App must use Mainnet RPC
   - Phantom on "Devnet" → App must use Devnet RPC
   - Mismatch causes network errors

### Stage 3 Error: "No signature returned from Phantom"

**Cause:** Phantom didn't return signature properly

**Solutions:**
1. Reload page completely (Ctrl+Shift+R)
2. Restart Phantom extension
3. Update Phantom to latest version

### Stage 5 Error: "API Error [404]"

**Cause:** Backend not running

**Solutions:**
1. **Check backend is running:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **If fails, start backend:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Wait for:**
   ```
   📡 Server running on http://localhost:5000
   ✅ Ready to accept requests
   ```

4. **Then try connecting again**

## Console Output Examples

### ✅ SUCCESS - Full Connection Flow
```
Attempting to connect to Phantom...
Successfully connected to Phantom: 2P1k6yJ4cEHe1pZ9k8mL5nO6qR2sT3uV
Requesting message signature from Phantom...
Successfully signed message
Successfully logged in, redirecting to dashboard...
```

### ❌ FAILURE - User Rejected
```
Attempting to connect to Phantom...
Wallet connection failed: User rejected the connection request
User-friendly message: Connection request was rejected
```

### ❌ FAILURE - Network Error
```
Attempting to connect to Phantom...
Wallet connection failed: Network error - please check your connection
User-friendly message: Network error - please check your internet connection
```

### ❌ FAILURE - Not Installed
```
Attempting to connect to Phantom...
Wallet connection failed: Phantom wallet not installed
User-friendly message: Phantom wallet not installed. Please install it first.
```

## Advanced Debugging

### Enable Extra Logging

Edit `/frontend/components/wallet-connect.tsx` and add:

```typescript
const handleConnect = async () => {
  setIsLoading(true)
  console.log("=== PHANTOM CONNECTION DEBUG ===")
  console.log("1. Phantom installed:", isPhantomInstalled())
  console.log("2. Window.phantom:", window.phantom)
  console.log("3. Window.phantom.solana:", window.phantom?.solana)
  
  try {
    // ... rest of code
  } catch (error) {
    console.error("=== ERROR DETAILS ===")
    console.error("Name:", error.name)
    console.error("Message:", error.message)
    console.error("Code:", (error as any).code)
    console.error("Stack:", error.stack)
  }
}
```

### Check Network Requests

1. Open DevTools (F12)
2. Click "Network" tab
3. Connect wallet
4. Look for requests to:
   - `localhost:5000/auth/login` - Should be 200 OK
   - `localhost:5000/health` - Should be 200 OK
   - Any other `/api/*` - Check for 404s

### Check Phantom Extension Settings

1. Click Phantom icon in browser
2. Click gear icon (Settings)
3. Check:
   - **Network:** Should match your app (Mainnet/Devnet)
   - **Connected Sites:** Your site should be approved
   - **Version:** Latest version installed

## Performance Considerations

The connection should take:
- 1-2 seconds for Phantom popup to appear
- 2-3 seconds for user to approve
- 1-2 seconds to sign message
- 1-2 seconds to login to backend

**Total: 5-10 seconds**

If taking longer:
- Check internet connection speed
- Check if backend is slow
- Check browser DevTools Network tab for slow requests

## Prevention Tips

1. **Always check return values:**
   ```typescript
   if (!response?.publicKey) throw new Error("No key")
   if (!signedMessage?.signature) throw new Error("No sig")
   ```

2. **Wrap critical operations in try-catch:**
   ```typescript
   try {
     const sig = await phantom.signMessage(msg)
   } catch (e) {
     handleSignError(e)
   }
   ```

3. **Log at key points:**
   ```typescript
   console.log("Starting step X...")
   // do step X
   console.log("Step X completed")
   ```

4. **Test with both networks:**
   ```
   Test with Phantom on Mainnet
   Test with Phantom on Devnet
   Test with Phantom on Testnet
   ```

5. **Test error scenarios:**
   ```
   Click Reject (to test rejection handling)
   Disconnect internet (to test network error)
   Uninstall Phantom (to test not installed)
   ```

## Files Changed

| File | Change | Impact |
|------|--------|--------|
| `/frontend/lib/phantom-types.ts` | Added helpers, types | Better error handling |
| `/frontend/components/wallet-connect.tsx` | Enhanced logic, logging | More reliable |

## Build Status

```
✅ Frontend compiles without errors
✅ TypeScript types check out
✅ No build warnings
✅ Ready to test
```

## Next Steps

1. Rebuild frontend: `npm run dev`
2. Open `http://localhost:3000`
3. Press F12 to open console
4. Click "Connect Phantom"
5. Check console output
6. Match output to solutions above
7. If working → Dashboard should load
8. If not → Use this guide to troubleshoot

## Success Criteria

You'll know it's working when:
- ✅ Console shows "Successfully signed message"
- ✅ Redirected to `/dashboard`
- ✅ Wallet address shows in navbar
- ✅ Portfolio data displays
- ✅ Can see 31 investment opportunities

