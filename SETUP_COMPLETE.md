# RealtySarv Complete Setup Guide

## 📋 Project Overview

RealtySarv is a comprehensive real estate CRM application built with:
- **Frontend**: React 19 + TypeScript + Vite + Firebase + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Databases**: 
  - **Firestore** (Cloud) - Primary database for real-time features
  - **MySQL/PostgreSQL** (Backend) - Transactional data & analytics
- **Cloud**: Firebase (Auth, Firestore, Storage)

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server && npm install
```

### Step 2: Configure Environment

#### Frontend (.env in root)
The app already uses Firebase configuration from `firebase-applet-config.json`:
```json
{
  "projectId": "gen-lang-client-0873542795",
  "appId": "1:47783702491:web:ca3a599937ab2fd0d601fe",
  "apiKey": "AIzaSyD5FxTATKRYv_WlwkqgtX53DyGjod8xCaA",
  "authDomain": "gen-lang-client-0873542795.firebaseapp.com",
  "firestoreDatabaseId": "ai-studio-10a71e0e-6277-4ebb-b538-3263c6ea0ada",
  "storageBucket": "gen-lang-client-0873542795.firebasestorage.app",
  "messagingSenderId": "47783702491"
}
```

#### Backend (server/.env)
Create or update `.env` file in `/server` directory:

**For MySQL (Local Development):**
```env
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=realtysarv_db
DB_PORT=3306
```

**For PostgreSQL (Production):**
```env
PORT=4000
DATABASE_URL=postgresql://user:password@hostname:5432/realtysarv_db
```

**Firebase Admin Credentials:**
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
```

### Step 3: Initialize Databases

#### Create MySQL Database (Local)
```bash
# Using MySQL CLI
mysql -u root -p
CREATE DATABASE realtysarv_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

#### Run Database Setup
```bash
cd server
npm run db:setup
```

This creates all tables with proper indexes:
- **Core**: users, projects, leads, sources, payment_plans, templates
- **Lead Workflow**: tasks, site_visits, bookings, agreements
- **Finance**: ledger_accounts, vouchers, voucher_entries, gst_entries
- **Partners**: channel_partners

### Step 4: Initialize Firestore

#### Method 1: Run the Firestore Init Script (In Progress)
```bash
# From root directory
npx ts-node firestore-init.ts
```

#### Method 2: Manual Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `gen-lang-client-0873542795`
3. Navigate to Firestore Database
4. Create collections with IDs:
   - `companies`
   - `users`
   - `projects`
   - `leads`
   - `tasks`
   - `siteVisits`
   - `bookings`
   - `agreements`
   - `ledgers`
   - `vouchers`
   - `templates`
   - `channelPartners`
   - `integrations`
   - `settings`

#### Method 3: Deploy Firestore Indexes
```bash
# Using Firebase CLI
firebase deploy --only firestore:indexes --config firebase-indexes.json
```

### Step 5: Run the Application

**Terminal 1 - Frontend (Port 3000):**
```bash
npm run dev
```

**Terminal 2 - Backend (Port 4000):**
```bash
cd server
npm run dev
```

The backend API will be available at `http://localhost:4000`

---

## 📊 Database Schema

### Core Tables

#### Users
- `id` (VARCHAR 255, PK)
- `name`, `email`, `phone`
- `role` (Admin, Sales, User, Manager)
- `assignedProjectIds` (JSON)
- `reportsTo` (FK to Users)
- Indexes: email, role, isActive

#### Projects
- `id` (VARCHAR 255, PK)
- `name`, `location`, `reraNumber`
- `projectType` (Residential, Commercial, Mixed-Use)
- `projectStatus` (Pre-launch, Under Construction, Ready, Completed)
- `wings`, `inventory`, `parkingInventory` (JSON)
- Indexes: location, projectStatus, createdAt

#### Leads
- `id` (VARCHAR 255, PK)
- `name`, `email`, `phone`
- `leadStatus` (New, Contacted, Qualified, Unqualified, Converted)
- `bookingStatus` (Pending, Booked)
- `agreementStatus` (Drafted, Sent for Signature, Registered)
- `possessionStatus` (Pending, Scheduled, Handed Over)
- `ownerId` (FK to Users)
- Indexes: email, leadStatus, ownerId, bookingStatus, createdAt

#### Tasks
- `id` (VARCHAR 255, PK)
- `leadId` (FK to Leads)
- `title`, `description`, `dueDate`
- `priority` (Low, Medium, High, Critical)
- `status` (Pending, Completed, Overdue, Cancelled)
- `assignedTo` (FK to Users)
- Indexes: leadId, assignedTo, status, dueDate, priority

#### Site Visits
- `id` (VARCHAR 255, PK)
- `leadId` (FK to Leads)
- `projectId` (FK to Projects)
- `scheduledDate`, `completedDate`
- `status` (Scheduled, Completed, Cancelled, No-Show)
- `attendees` (JSON), `feedback`, `rating`
- Indexes: leadId, projectId, status, scheduledDate

#### Bookings
- `id` (VARCHAR 255, PK)
- `leadId` (FK to Leads)
- `projectId` (FK to Projects)
- `unitId`, `status`
- `tokenAmount`, `registrationAmount`, `totalAmount`
- `paymentSchedule` (JSON)
- Indexes: leadId, projectId, status, createdAt

#### Agreements
- `id` (VARCHAR 255, PK)
- `bookingId` (FK to Bookings)
- `leadId` (FK to Leads)
- `status` (Drafted, Sent, Signed, Registered, Cancelled)
- `registrationNumber`, `signedDate`
- Indexes: bookingId, leadId, status

### Finance Tables

#### Ledger Accounts
- `id` (VARCHAR 255, PK)
- `name`, `code` (UNIQUE)
- `group` (Assets, Liabilities, Income, Expenses, Equity)
- `openingBalance`, `currentBalance`
- Indexes: code, group

#### Vouchers
- `id` (VARCHAR 255, PK)
- `voucherNumber` (UNIQUE)
- `date`, `type` (Journal, Payment, Receipt, Contra, Sales, Purchase)
- `status` (Draft, Posted, Cancelled)
- `entries` (JSON - array of VoucherEntry)
- `projectId`, `bookingId`, `referenceId`
- Indexes: date, type, status, voucherNumber

#### Voucher Entries
- `id` (VARCHAR 255, PK)
- `voucherId` (FK to Vouchers)
- `accountId` (FK to Ledger Accounts)
- `debit`, `credit` (DECIMAL 15,2)
- Indexes: voucherId, accountId

#### GST Entries
- `id` (VARCHAR 255, PK)
- `date`, `voucherId` (FK to Vouchers)
- `type` (Input, Output)
- `gstin`, `taxableValue`, `cgst`, `sgst`, `igst`, `totalGst`
- Indexes: date, voucherId, type

---

## 🔐 Firestore Collections Structure

### leads Collection
```json
{
  "leadId": "string",
  "companyId": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "leadStatus": "New|Contacted|Qualified|Unqualified|Converted",
  "bookingStatus": "Pending|Booked",
  "agreementStatus": "Drafted|Sent for Signature|Registered",
  "possessionStatus": "Pending|Scheduled|Handed Over",
  "channelSource": "string",
  "leadSource": "string",
  "preferredLocation": "string",
  "budget": "string",
  "clientProfile": "string",
  "messages": [],
  "siteVisits": [],
  "tasks": [],
  "propertyImages": [],
  "ownerId": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### tasks Collection
```json
{
  "taskId": "string",
  "companyId": "string",
  "leadId": "string",
  "title": "string",
  "description": "string",
  "dueDate": "date",
  "priority": "Low|Medium|High|Critical",
  "status": "Pending|Completed|Overdue|Cancelled",
  "assignedTo": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### bookings Collection
```json
{
  "bookingId": "string",
  "companyId": "string",
  "leadId": "string",
  "projectId": "string",
  "unitId": "string",
  "status": "Pending|Booked|Cancelled|Completed",
  "tokenAmount": "number",
  "registrationAmount": "number",
  "paymentSchedule": [],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### vouchers Collection
```json
{
  "voucherId": "string",
  "companyId": "string",
  "voucherNumber": "string",
  "date": "date",
  "type": "Journal|Payment|Receipt|Contra|Sales|Purchase",
  "entries": [],
  "narration": "string",
  "status": "Draft|Posted|Cancelled",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## 📑 Firestore Indexes

Indexes have been created for optimal query performance:

1. **leads** - Multi-field indexes:
   - `companyId` + `leadStatus` + `createdAt` (DESC)
   - `companyId` + `ownerId` + `createdAt` (DESC)

2. **tasks** - Multi-field indexes:
   - `companyId` + `assignedTo` + `status` + `dueDate`
   - `companyId` + `leadId` + `createdAt` (DESC)

3. **bookings** - Multi-field indexes:
   - `companyId` + `projectId` + `status`
   - `companyId` + `leadId`

4. **siteVisits** - Multi-field indexes:
   - `companyId` + `leadId` + `scheduledDate`
   - `companyId` + `projectId` + `status`

5. **vouchers** - Multi-field indexes:
   - `companyId` + `date` (DESC)
   - `companyId` + `type` + `status`

---

## 🔗 API Endpoints Structure

```
/api
├── /leads
│   ├── GET    /               (Get all leads)
│   ├── POST   /               (Create lead)
│   ├── GET    /:id            (Get lead by ID)
│   ├── PUT    /:id            (Update lead)
│   └── DELETE /:id            (Delete lead)
├── /projects
│   ├── GET    /
│   ├── POST   /
│   └── ...
├── /tasks
├── /bookings
├── /vouchers
├── /finance
└── ...
```

---

## ✨ Key Features Configured

### ✅ Multi-Tenant Support
- Company-level isolation
- Role-based access control
- User hierarchy (reportsTo)

### ✅ Lead Management
- Lead status tracking (New → Contacted → Qualified → Converted)
- Multi-step booking flow (Token → Registration → Agreement → Possession)
- Site visit scheduling
- Task assignment

### ✅ Financial Management
- Double-entry accounting (GST-ready)
- Voucher system (Journal, Payment, Receipt, etc.)
- Ledger accounts
- GST entry tracking

### ✅ Real-Time Features (Firestore)
- Live chat/messaging
- Real-time task updates
- Instant booking notifications
- Live report generation

### ✅ Query Optimization
- Database indexes on all frequently queried fields
- Firestore composite indexes for complex queries
- Pagination support

---

## 🛠 Troubleshooting

### MySQL Connection Error
```bash
# Check MySQL is running
brew services list

# Start MySQL (macOS)
brew services start mysql

# Verify connection
mysql -u root -p -e "SELECT 1;"
```

### PostgreSQL Connection Error
```bash
# For Neon Serverless, verify DATABASE_URL format:
postgresql://user:password@hostname:5432/database

# Test connection
psql -d "postgresql://user:password@hostname:5432/database"
```

### Firebase Authentication Issues
```bash
# Verify Firebase config
cat firebase-applet-config.json

# Check Firestore rules
firebase rules:read --project gen-lang-client-0873542795
```

### Port Already in Use
```bash
# Find process on port 3000
lsof -i :3000

# Find process on port 4000
lsof -i :4000

# Kill process
kill -9 <PID>
```

---

## 📚 Important Files

| File | Purpose |
|------|---------|
| `firebase.ts` | Firebase & Firestore initialization |
| `firebase-applet-config.json` | Firebase project configuration |
| `firebase-indexes.json` | Firestore composite indexes |
| `firestore-init.ts` | Firestore collections initialization |
| `server/src/db/setup-complete.ts` | Complete database schema setup |
| `server/.env` | Backend environment variables |
| `firestore.rules` | Firestore security rules |

---

## 🎯 Next Steps

1. ✅ Initialize Firebase - Done (firestore-init.ts created)
2. ✅ Create MySQL/PostgreSQL Schema - Done (setup-complete.ts created)
3. ✅ Create Firestore Indexes - Done (firebase-indexes.json created)
4. 📋 Deploy indexes to Firebase Console
5. 📋 Set up Firestore security rules
6. 📋 Configure integrations (Accounting, CRM, SMS, Email)
7. 📋 Set up admin panel
8. 📋 Run comprehensive tests

---

## 📞 Support

For issues or questions:
1. Check logs in console
2. Verify environment variables
3. Check Firebase console for real-time data
4. Review database schema in respective console

---

**Last Updated**: July 2026  
**Status**: ✅ Complete Setup Ready
