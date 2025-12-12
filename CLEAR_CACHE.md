# Clear Browser Cache for Wallet Connection

If wallet is connecting silently without popup (due to previous project like ExePay), follow these steps:

## Option 1: Clear Browser Cache in Chrome

1. Open Chrome DevTools (Right-click → Inspect, or F12)
2. Go to **Application** tab
3. In the left sidebar, under **Storage**, click:
   - **Local Storage** → `http://localhost:3000` → Delete all
   - **Session Storage** → `http://localhost:3000` → Delete all
4. Right-click the **Refresh** button → **Empty Cache and Hard Reload**
5. Close and reopen the browser tab

## Option 2: Use Incognito/Private Window

1. Open Chrome Incognito Window (Cmd+Shift+N on Mac, Ctrl+Shift+N on Windows)
2. Go to `http://localhost:3000`
3. This ensures no cached wallet connections

## Option 3: Clear Specific Wallet Cache

Run this in browser console (F12 → Console tab):

```javascript
// Clear all wallet-related cache
localStorage.clear();
sessionStorage.clear();
// Also clear Phantom's cache
localStorage.removeItem('walletName');
localStorage.removeItem('walletAdapter');
localStorage.removeItem('wallet-adapter');
// Reload page
location.reload();
```

## After Clearing Cache:

1. Go to `http://localhost:3000/auth/wallet`
2. Make sure Phantom is **unlocked**
3. Click "Connect Wallet"
4. **Phantom popup SHOULD appear** asking you to choose wallet
5. Select wallet and click "Connect"
6. Click "Sign to Authenticate"
7. **Phantom popup SHOULD appear** asking you to sign
8. Click "Sign" → Authenticated! ✅

---

## Why This Happens

Solana Wallet Adapter caches wallet connections in browser localStorage. If you previously connected to `localhost` in ExePay, that connection is cached and reused by SUBRA (same domain).

The code now:
- Clears old cache on load
- Uses unique localStorage key: `subra-wallet-v1`
- Forces disconnect of any cached connections
- Never auto-connects (`autoConnect={false}`)

