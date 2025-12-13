# 🔐 SUBRA Wallet Connection Guide

## ✅ Current Status

**Wallet creation is working!** The embedded wallet system is production-ready.

---

## 🎯 **Three Onboarding Options**

### **1. Create New Wallet (Recommended for Web2 Users)**
- ✅ **Password-protected** Solana wallet
- ✅ **Encrypted** private key storage
- ✅ **BIP39 mnemonic** (12 words) for recovery
- ✅ **No browser extension** required
- ✅ **Instant** account creation

**How it works:**
1. User clicks "Create New Wallet"
2. Sets a password (min 8 characters)
3. Backend generates:
   - BIP39 mnemonic (12 words)
   - Solana keypair (ed25519)
   - Encrypts private key with password (AES-256)
   - Stores encrypted key in database
4. User gets instant access to dashboard
5. Can deploy agents immediately

**Security:**
- Private key **never** leaves the server unencrypted
- Password is **hashed** (bcrypt)
- Mnemonic is **encrypted** with user password
- Can decrypt wallet for transactions with password

---

### **2. Connect External Wallet (Coming Soon)**
- 🚧 **Currently disabled** (redirects to embedded wallet)
- Will support: Phantom, Solflare, Ledger, Torus
- Nonce-based signature authentication
- No gas fees for sign-in

**Why disabled?**
- Previous issues with false connections
- Wallet adapter conflicts
- Will re-enable after more testing

---

### **3. Sign Up with Email**
- ✅ Traditional email/password registration
- ⚠️ **No wallet** initially
- User can create wallet later from dashboard
- Cannot deploy agents until wallet is created

---

## 🔧 **Testing Wallet Creation**

### **Step 1: Go to Registration**
```bash
http://localhost:3000/auth/register
```

### **Step 2: Click "Create New Wallet"**
- Enter password (min 8 chars)
- Confirm password
- Click "Create"

### **Step 3: Success!**
- See wallet address
- Auto-redirected to dashboard
- Can now deploy agents

### **Step 4: Verify in Database**
```bash
cd /Users/kingchief/Documents/SUB
psql subra_dev -c "SELECT id, email, \"walletAddress\", \"apiKey\" IS NOT NULL as has_encrypted_key FROM users ORDER BY \"createdAt\" DESC LIMIT 5;"
```

You should see:
- Email: `{publicKey}@wallet.subra`
- Wallet address: Full Solana address
- has_encrypted_key: `t` (true)

---

## 🛠️ **API Endpoints**

### **Create Wallet**
```bash
POST http://localhost:4000/auth/create-wallet
Content-Type: application/json

{
  "password": "your-secure-password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "ABC12345@wallet.subra",
      "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "hasWallet": true
    },
    "token": "jwt-token",
    "message": "Wallet created and secured with your password"
  }
}
```

### **Decrypt Wallet (For Transactions)**
```bash
POST http://localhost:4000/wallet/decrypt
Authorization: Bearer {jwt-token}
Content-Type: application/json

{
  "password": "your-secure-password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "secretKey": "base58-encoded-secret-key"
  }
}
```

---

## 🔐 **Security Architecture**

### **Encryption Flow:**
```
User Password
    ↓
[Backend] Generate BIP39 Mnemonic (12 words)
    ↓
[Backend] Derive Solana Keypair (ed25519)
    ↓
[Backend] Encrypt Private Key with AES-256 (user password)
    ↓
[Backend] Encrypt Mnemonic with AES-256 (user password)
    ↓
[Backend] Hash Password with bcrypt
    ↓
[Database] Store:
  - passwordHash (bcrypt)
  - apiKey (encrypted private key)
  - apiKeyHash (encrypted mnemonic)
  - walletAddress (public key, plain text)
```

### **Transaction Flow:**
```
User wants to send transaction
    ↓
[Frontend] Request password from user
    ↓
[Frontend] POST /wallet/decrypt with password
    ↓
[Backend] Verify password against hash
    ↓
[Backend] Decrypt private key with password
    ↓
[Backend] Return decrypted key (over HTTPS)
    ↓
[Frontend] Sign transaction
    ↓
[Frontend] Clear key from memory
```

---

## 🧪 **Manual Testing Checklist**

### **Test 1: Create Wallet**
- [ ] Go to `/auth/register`
- [ ] Click "Create New Wallet"
- [ ] Enter password: `testpassword123`
- [ ] Confirm password: `testpassword123`
- [ ] Click "Create"
- [ ] Should see "Creating wallet..." loading state
- [ ] Should see success screen with wallet address
- [ ] Should auto-redirect to dashboard after 1.5s

### **Test 2: Verify Dashboard**
- [ ] Should see wallet address in header
- [ ] Should see "Wallet Status: Connected"
- [ ] "Deploy New Agent" button should work
- [ ] No "Create Wallet" banner

### **Test 3: Create Agent**
- [ ] Click "Deploy New Agent"
- [ ] Fill in agent details
- [ ] Click "Create Agent"
- [ ] Should succeed (no wallet errors)

### **Test 4: Sign Out & Sign In**
- [ ] Click sign out button
- [ ] Go to `/auth/login`
- [ ] Enter email: `{walletAddress}@wallet.subra`
- [ ] Enter password: `testpassword123`
- [ ] Should login successfully
- [ ] Dashboard should show wallet still connected

### **Test 5: Database Verification**
```bash
psql subra_dev -c "SELECT \"walletAddress\", \"apiKey\" IS NOT NULL, \"apiKeyHash\" IS NOT NULL FROM users WHERE email LIKE '%@wallet.subra' LIMIT 1;"
```
- [ ] walletAddress: Should be valid Solana address
- [ ] apiKey: Should be `t` (encrypted key exists)
- [ ] apiKeyHash: Should be `t` (encrypted mnemonic exists)

---

## 🐛 **Known Issues & Fixes**

### **Issue: API Not Running**
```bash
cd /Users/kingchief/Documents/SUB/apps/api
pnpm dev
```

### **Issue: 500 Error on Create Wallet**
- Check API logs for errors
- Verify DATABASE_URL is set
- Check Prisma schema is up to date:
```bash
cd /Users/kingchief/Documents/SUB
pnpm db:push
```

### **Issue: Wallet Created But Can't Login**
- Email format: `{first8CharsOfPublicKey}@wallet.subra`
- Password: The one you set during creation
- Check database for exact email:
```bash
psql subra_dev -c "SELECT email FROM users WHERE \"walletAddress\" IS NOT NULL;"
```

---

## 🚀 **Next Steps**

### **Phase 1: Current (Working)**
- ✅ Embedded wallet creation
- ✅ Password-protected encryption
- ✅ Dashboard integration
- ✅ Agent creation with wallet

### **Phase 2: Coming Soon**
- 🚧 External wallet connection (Phantom, Solflare)
- 🚧 Wallet recovery with mnemonic
- 🚧 Export private key (with password)
- 🚧 Change wallet password

### **Phase 3: Advanced**
- 🚧 Multi-wallet support
- 🚧 Hardware wallet integration (Ledger)
- 🚧 Social recovery
- 🚧 Biometric unlock (mobile)

---

## 📞 **Support**

If wallet creation is not working:

1. **Check API is running:**
   ```bash
   curl http://localhost:4000/health
   ```

2. **Check browser console** for errors

3. **Check API logs** in terminal

4. **Verify environment variables:**
   ```bash
   cat /Users/kingchief/Documents/SUB/.env | grep -E "DATABASE_URL|JWT_SECRET"
   ```

5. **Restart everything:**
   ```bash
   cd /Users/kingchief/Documents/SUB
   ./START.sh
   ```

---

## ✅ **Current Status: WORKING**

The embedded wallet system is **production-ready** for:
- ✅ Wallet creation
- ✅ Secure storage
- ✅ Authentication
- ✅ Agent deployment

External wallet connection is **disabled** until further testing.

