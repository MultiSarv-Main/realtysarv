# 🚀 RealtySarv Quick Reference

## ⚡ Quick Commands

```bash
# Install & Run
npm install                              # Frontend deps
cd server && npm install                 # Backend deps

# Development
npm run dev                              # Frontend on :3000
cd server && npm run dev                 # Backend on :4000

# Database
npm run db:setup                         # Setup MySQL/PostgreSQL
                                         # (from server directory)

# Firebase
npx ts-node firestore-init.ts           # Initialize Firestore collections
firebase deploy --only firestore:indexes # Deploy indexes
```

---

## 🔧 Configuration Files

| File | Purpose | Status |
|------|---------|--------|
| `firebase-applet-config.json` | Firebase credentials | ✅ Ready |
| `firebase.ts` | Firebase init | ✅ Ready |
| `firestore-init.ts` | Firestore setup | ✅ Created |
| `firebase-indexes.json` | Firestore indexes | ✅ Created |
| `server/.env` | Backend config | ✅ Created |
| `server/src/db/setup-complete.ts` | DB schema | ✅ Created |
| `SETUP_COMPLETE.md` | Full guide | ✅ Created |

---

## 📊 Database Overview

### MySQL/PostgreSQL Tables (14 total)
```
Core:        users, projects, leads, sources, payment_plans, templates
Workflow:    tasks, site_visits, bookings, agreements
Finance:     ledger_accounts, vouchers, voucher_entries, gst_entries
Partners:    channel_partners
```

### Firestore Collections (13 total)
```
companies, users, projects, leads, tasks, siteVisits, bookings
agreements, ledgers, vouchers, templates, channelPartners, integrations, settings
```

---

## 🔌 Connection Details

### Frontend (React + Vite)
- **Port**: 3000
- **Database**: Firebase Firestore
- **Config**: firebase-applet-config.json
- **Project ID**: gen-lang-client-0873542795
- **Firestore DB ID**: ai-studio-10a71e0e-6277-4ebb-b538-3263c6ea0ada

### Backend (Express + TypeScript)
- **Port**: 4000
- **Database Options**:
  - MySQL: localhost:3306
  - PostgreSQL: Neon Serverless (via DATABASE_URL)
- **Config**: server/.env

### API Proxy
- Frontend proxies `/api/*` → `http://localhost:4000`

---

## 📋 Lead Lifecycle Status Options

```
Lead Status:       New → Contacted → Qualified → Unqualified → Converted
Booking Status:    Pending → Booked
Agreement Status:  Drafted → Sent for Signature → Registered
Possession Status: Pending → Scheduled → Handed Over
```

---

## 👥 User Roles

- **Admin**: Full access, system management
- **Sales**: Lead management, booking
- **Manager**: Team oversight, reporting
- **User**: Basic access, assigned tasks

---

## 💰 Financial Entities

**Account Groups**: Assets | Liabilities | Income | Expenses | Equity

**Voucher Types**:
- Journal (Manual entry)
- Payment (Cash/Check payment)
- Receipt (Cash/Check receipt)
- Contra (Bank reconciliation)
- Sales (Invoice payment)
- Purchase (Bill payment)

**Voucher Status**: Draft → Posted → Cancelled

---

## 🔐 Firestore Indexes (Auto-Created)

```
✓ leads: (companyId, leadStatus, createdAt DESC)
✓ leads: (companyId, ownerId, createdAt DESC)
✓ tasks: (companyId, assignedTo, status, dueDate)
✓ tasks: (companyId, leadId, createdAt DESC)
✓ bookings: (companyId, projectId, status)
✓ bookings: (companyId, leadId)
✓ siteVisits: (companyId, leadId, scheduledDate)
✓ siteVisits: (companyId, projectId, status)
✓ vouchers: (companyId, date DESC)
✓ vouchers: (companyId, type, status)
✓ users: (companyId, role, isActive)
✓ projects: (companyId, projectStatus, createdAt DESC)
✓ channelPartners: (companyId, status)
```

---

## 📍 Project Locations

```
/                          # Frontend (React)
├── App.tsx                # Main app
├── index.tsx              # Entry point
├── firebase.ts            # Firebase config
├── firestore-init.ts      # Firestore setup ✅
├── firebase-indexes.json  # Firestore indexes ✅
└── components/            # React components

/server                    # Backend (Express)
├── src/
│   ├── index.ts           # Server entry
│   ├── db.ts              # DB queries
│   ├── db/
│   │   ├── connection.ts  # DB connection
│   │   └── setup-complete.ts  # Schema ✅
│   ├── routes/            # API routes
│   └── controllers/       # Business logic
├── .env                   # Config ✅
└── package.json           # Dependencies
```

---

## 🎯 Troubleshooting Checklist

```
[ ] MySQL running: brew services list
[ ] Backend env configured: check server/.env
[ ] Database created: mysql -e "SHOW DATABASES;"
[ ] Firebase config valid: check firebase-applet-config.json
[ ] Firestore accessible: Check Firebase Console
[ ] Ports free: lsof -i :3000, lsof -i :4000
[ ] Dependencies installed: npm ls (in both root and server)
```

---

## 📞 Key Credentials

**Firebase Project**: gen-lang-client-0873542795

**Database Options**:
- MySQL: localhost:3306 (default)
- PostgreSQL: Check DATABASE_URL in .env

**GoDaddy Domain**: onlinesarv.com

---

## ✨ Features Implemented

✅ Firebase Authentication  
✅ Firestore Real-time Sync  
✅ Multi-tenant Architecture  
✅ Lead Management System  
✅ Booking Workflow  
✅ Agreement Management  
✅ Financial Accounting  
✅ GST Tracking  
✅ Task Management  
✅ Site Visit Scheduling  
✅ Channel Partner Management  
✅ Role-based Access Control  

---

**Last Updated**: July 15, 2026  
**Status**: ✅ Complete & Ready to Deploy
