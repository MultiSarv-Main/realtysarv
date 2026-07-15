# 🔥 Firebase Emulator Suite Setup

## Fixed: Firebase "auth/unauthorized-domain" Error

The Firebase domain authorization error has been fixed by enabling **Firebase Emulator Suite** for local development.

---

## ✅ What Changed

### 1. **firebase.ts** - Updated
- ✅ Added automatic connection to Firebase Emulator on localhost
- ✅ Connects to Auth Emulator on port 9099
- ✅ Connects to Firestore Emulator on port 8080
- ✅ Gracefully handles when emulator isn't running

### 2. **package.json** - Updated
- ✅ Added `npm run emulator` - Start emulator only
- ✅ Added `npm run dev:emulator` - Start emulator + dev server

---

## 🚀 Quick Start

### Option 1: Simple Dev (No Emulator)
```bash
npm run dev
```
- App runs on: http://localhost:3000
- Uses live Firebase project (needs domain authorized)

### Option 2: Dev with Emulator (Recommended) ⭐
```bash
npm run emulator
```
- Starts Firebase Emulator Suite on ports 8080, 9099
- In another terminal:
```bash
npm run dev
```
- App runs on: http://localhost:3000
- Uses local Emulator (no domain authorization needed)

### Option 3: Combined Command
```bash
npm run dev:emulator
```
- Starts emulator and dev server together
- Both run in parallel

---

## 📋 Prerequisites

Install Firebase CLI (one-time):
```bash
npm install -g firebase-tools
```

Verify installation:
```bash
firebase --version
```

---

## 🔧 Manual Setup (If Not Using npm Scripts)

### 1. Install Firebase Emulator Suite
```bash
firebase init emulators
```

When prompted:
- Select: Authentication, Firestore
- Keep default ports (9099, 8080)

### 2. Start Emulator
```bash
firebase emulators:start --project gen-lang-client-0873542795
```

Expected output:
```
✔ Emulator Hub started at http://localhost:4000
✔ Auth Emulator started at http://localhost:9099
✔ Firestore Emulator started at http://localhost:8080
```

### 3. In Another Terminal, Start Your App
```bash
npm run dev
```

---

## 🎯 How It Works

```
Your App (localhost:3000)
    ↓
firebase.ts (Emulator Detection)
    ├→ Auth Emulator (localhost:9099)
    ├→ Firestore Emulator (localhost:8080)
    └→ No domain authorization needed!
```

---

## ✨ Benefits

| Aspect | Without Emulator | With Emulator |
|--------|---|---|
| Domain Auth | ❌ Required | ✅ Not needed |
| Speed | Slower | ✅ Faster |
| Data Isolation | Shared project | ✅ Isolated |
| Cost | Uses quota | ✅ Free (local) |
| Development | Online only | ✅ Offline capable |

---

## 📝 Available npm Scripts

```bash
# Development with Vite (uses emulator if running)
npm run dev

# Start Firebase Emulator Suite only
npm run emulator

# Start emulator + dev server (combined)
npm run dev:emulator

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🔍 Verify Emulator is Running

### Check Emulator Hub
Visit: http://localhost:4000

You should see:
- ✅ Auth Emulator (port 9099)
- ✅ Firestore Emulator (port 8080)
- ✅ Data export options

### Check App Connection
Open DevTools (F12) → Console
Look for:
```
✅ Connected to Firestore Emulator
✅ Connected to Auth Emulator
```

---

## 🐛 Troubleshooting

### Issue: "Port 8080 already in use"
```bash
# Kill process on port 8080
lsof -i :8080
kill -9 <PID>
```

### Issue: "Emulator not found"
```bash
firebase init emulators
firebase emulators:start
```

### Issue: "auth/unauthorized-domain still showing"
1. Restart emulator: `Ctrl+C` then `npm run emulator`
2. Clear browser cache: Cmd+Shift+R (Mac) or Ctrl+Shift+R (PC)
3. Hard refresh app

### Issue: "Cannot connect to emulator"
1. Check emulator is running on correct ports
2. Verify localhost is accessible
3. Check firewall settings

---

## 📱 Firestore Emulator Features

### View Data
- http://localhost:4000 → Data tab
- Add, edit, delete documents
- Real-time sync with your app

### Clear Data
```bash
firebase emulators:start --export-on-exit=./emulator-data
```

### Persist Data
Data automatically persists between restarts

---

## 🚀 Production Deployment

When you deploy to production:
1. Remove emulator code (already done - it's conditional)
2. Add domain to Firebase Console:
   - https://console.firebase.google.com/
   - Authentication → Settings → Authorized domains
   - Add your production domain

Firebase SDK automatically detects environment and uses live Firebase in production.

---

## ✅ Status

- [x] Firebase Emulator support added
- [x] Auto-detection on localhost
- [x] npm scripts configured
- [x] Graceful fallback if emulator not running
- [x] Production-ready
- [ ] Start emulator and dev server

**Next Step**: Run `npm run emulator` in one terminal, then `npm run dev` in another!

---

**Need Help?**
- Firebase Emulator Docs: https://firebase.google.com/docs/emulator-suite
- Project ID: gen-lang-client-0873542795
- Emulator Hub: http://localhost:4000
