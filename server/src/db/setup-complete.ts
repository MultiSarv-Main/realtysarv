import 'dotenv/config';
import { dbType, mysqlPool, postgresPool } from './connection';
import { INITIAL_LEADS, INITIAL_USERS, INITIAL_PROJECTS, INITIAL_SOURCES, INITIAL_PAYMENT_PLANS, INITIAL_TEMPLATES } from '../constants';

const setupDatabase = async () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Starting Database Setup in [${dbType.toUpperCase()}] mode...`);
    console.log(`${'='.repeat(60)}\n`);

    if (dbType === 'postgres') {
        if (!postgresPool) {
            console.error('PostgreSQL Pool is not initialized');
            return;
        }

        try {
            console.log('📋 Cleaning up existing database tables...');
            await postgresPool.query('DROP TABLE IF EXISTS voucher_entries CASCADE');
            await postgresPool.query('DROP TABLE IF EXISTS gst_entries CASCADE');
            await postgresPool.query('DROP TABLE IF EXISTS vouchers CASCADE');
            await postgresPool.query('DROP TABLE IF EXISTS ledger_accounts CASCADE');
            await postgresPool.query('DROP TABLE IF EXISTS agreements CASCADE');
            await postgresPool.query('DROP TABLE IF EXISTS bookings CASCADE');
            await postgresPool.query('DROP TABLE IF EXISTS site_visits CASCADE');
            await postgresPool.query('DROP TABLE IF EXISTS tasks CASCADE');
            await postgresPool.query('DROP TABLE IF EXISTS templates CASCADE');
            await postgresPool.query('DROP TABLE IF EXISTS channel_partners CASCADE');
            await postgresPool.query('DROP TABLE IF EXISTS leads CASCADE');
            await postgresPool.query('DROP TABLE IF EXISTS sources CASCADE');
            await postgresPool.query('DROP TABLE IF EXISTS payment_plans CASCADE');
            await postgresPool.query('DROP TABLE IF EXISTS projects CASCADE');
            await postgresPool.query('DROP TABLE IF EXISTS users CASCADE');
            console.log('✓ Dropped existing tables.\n');

            // ========== USERS TABLE ==========
            await postgresPool.query(`
                CREATE TABLE users (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    username VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255),
                    email VARCHAR(255) NOT NULL UNIQUE,
                    phone VARCHAR(255),
                    role VARCHAR(50) NOT NULL,
                    designation VARCHAR(100),
                    isActive BOOLEAN NOT NULL DEFAULT TRUE,
                    assignedProjectIds TEXT,
                    reportsTo VARCHAR(255),
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (reportsTo) REFERENCES users(id) ON DELETE SET NULL,
                    INDEX idx_email (email),
                    INDEX idx_role (role),
                    INDEX idx_isActive (isActive)
                )
            `);
            console.log('✓ Created `users` table with indexes');

            // ========== PROJECTS TABLE ==========
            await postgresPool.query(`
                CREATE TABLE projects (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    companyName VARCHAR(255),
                    location VARCHAR(255),
                    reraNumber VARCHAR(255) UNIQUE,
                    projectType VARCHAR(50),
                    projectStatus VARCHAR(50),
                    description TEXT,
                    totalFloors INT,
                    wings TEXT,
                    inventory TEXT,
                    parkingInventory TEXT,
                    paymentPlanIds TEXT,
                    floorPlanUrl TEXT,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_location (location),
                    INDEX idx_projectStatus (projectStatus),
                    INDEX idx_createdAt (createdAt)
                )
            `);
            console.log('✓ Created `projects` table with indexes');

            // ========== LEADS TABLE ==========
            await postgresPool.query(`
                CREATE TABLE leads (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    avatarInitials VARCHAR(10),
                    lastMessage TEXT,
                    time VARCHAR(255),
                    chatStatus VARCHAR(50),
                    leadStatus VARCHAR(50),
                    "read" BOOLEAN,
                    messages TEXT,
                    email VARCHAR(255) NOT NULL,
                    phone VARCHAR(255),
                    initialInterest TEXT,
                    siteVisits TEXT,
                    tasks TEXT,
                    channelSource VARCHAR(255),
                    leadSource VARCHAR(255),
                    preferredLocation VARCHAR(255),
                    budget VARCHAR(255),
                    clientProfile VARCHAR(255),
                    livingPlace VARCHAR(255),
                    propertyImages TEXT,
                    ownerId VARCHAR(255),
                    leadProject VARCHAR(255),
                    leadDate DATE,
                    bookingStatus VARCHAR(50),
                    agreementStatus VARCHAR(50),
                    possessionStatus VARCHAR(50),
                    tokenAmount INT,
                    bookingDetails TEXT,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE SET NULL,
                    INDEX idx_email (email),
                    INDEX idx_leadStatus (leadStatus),
                    INDEX idx_ownerId (ownerId),
                    INDEX idx_createdAt (createdAt),
                    INDEX idx_bookingStatus (bookingStatus)
                )
            `);
            console.log('✓ Created `leads` table with indexes');

            // ========== SOURCES TABLE ==========
            await postgresPool.query(`
                CREATE TABLE sources (
                    id VARCHAR(255) PRIMARY KEY,
                    channelSource VARCHAR(255) NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_channelSource (channelSource)
                )
            `);
            console.log('✓ Created `sources` table with indexes');

            // ========== PAYMENT PLANS TABLE ==========
            await postgresPool.query(`
                CREATE TABLE payment_plans (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    milestones TEXT,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `);
            console.log('✓ Created `payment_plans` table');

            // ========== TEMPLATES TABLE ==========
            await postgresPool.query(`
                CREATE TABLE templates (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    type VARCHAR(50),
                    content TEXT,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_type (type)
                )
            `);
            console.log('✓ Created `templates` table');

            // ========== TASKS TABLE ==========
            await postgresPool.query(`
                CREATE TABLE tasks (
                    id VARCHAR(255) PRIMARY KEY,
                    leadId VARCHAR(255) NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    dueDate DATE,
                    priority VARCHAR(50),
                    status VARCHAR(50),
                    assignedTo VARCHAR(255),
                    createdBy VARCHAR(255),
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (leadId) REFERENCES leads(id) ON DELETE CASCADE,
                    FOREIGN KEY (assignedTo) REFERENCES users(id) ON DELETE SET NULL,
                    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL,
                    INDEX idx_leadId (leadId),
                    INDEX idx_assignedTo (assignedTo),
                    INDEX idx_status (status),
                    INDEX idx_dueDate (dueDate),
                    INDEX idx_priority (priority)
                )
            `);
            console.log('✓ Created `tasks` table with indexes');

            // ========== SITE VISITS TABLE ==========
            await postgresPool.query(`
                CREATE TABLE site_visits (
                    id VARCHAR(255) PRIMARY KEY,
                    leadId VARCHAR(255) NOT NULL,
                    projectId VARCHAR(255),
                    scheduledDate DATETIME,
                    completedDate DATETIME,
                    status VARCHAR(50),
                    notes TEXT,
                    attendees TEXT,
                    feedback TEXT,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (leadId) REFERENCES leads(id) ON DELETE CASCADE,
                    FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE SET NULL,
                    INDEX idx_leadId (leadId),
                    INDEX idx_projectId (projectId),
                    INDEX idx_status (status),
                    INDEX idx_scheduledDate (scheduledDate)
                )
            `);
            console.log('✓ Created `site_visits` table with indexes');

            // ========== BOOKINGS TABLE ==========
            await postgresPool.query(`
                CREATE TABLE bookings (
                    id VARCHAR(255) PRIMARY KEY,
                    leadId VARCHAR(255) NOT NULL,
                    projectId VARCHAR(255),
                    unitId VARCHAR(255),
                    status VARCHAR(50),
                    tokenAmount INT,
                    registrationAmount INT,
                    totalAmount INT,
                    paymentSchedule TEXT,
                    agreementId VARCHAR(255),
                    possessionDate DATE,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (leadId) REFERENCES leads(id) ON DELETE CASCADE,
                    FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE SET NULL,
                    INDEX idx_leadId (leadId),
                    INDEX idx_projectId (projectId),
                    INDEX idx_status (status),
                    INDEX idx_createdAt (createdAt)
                )
            `);
            console.log('✓ Created `bookings` table with indexes');

            // ========== AGREEMENTS TABLE ==========
            await postgresPool.query(`
                CREATE TABLE agreements (
                    id VARCHAR(255) PRIMARY KEY,
                    bookingId VARCHAR(255) NOT NULL,
                    leadId VARCHAR(255),
                    status VARCHAR(50),
                    content TEXT,
                    signatories TEXT,
                    signedDate DATE,
                    registrationDate DATE,
                    registrationNumber VARCHAR(255),
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE,
                    FOREIGN KEY (leadId) REFERENCES leads(id) ON DELETE SET NULL,
                    INDEX idx_bookingId (bookingId),
                    INDEX idx_leadId (leadId),
                    INDEX idx_status (status)
                )
            `);
            console.log('✓ Created `agreements` table with indexes');

            // ========== LEDGER ACCOUNTS TABLE ==========
            await postgresPool.query(`
                CREATE TABLE ledger_accounts (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    code VARCHAR(50) UNIQUE,
                    "group" VARCHAR(50),
                    openingBalance DECIMAL(15,2),
                    currentBalance DECIMAL(15,2),
                    isSystem BOOLEAN DEFAULT FALSE,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_code (code),
                    INDEX idx_group ("group")
                )
            `);
            console.log('✓ Created `ledger_accounts` table with indexes');

            // ========== VOUCHERS TABLE ==========
            await postgresPool.query(`
                CREATE TABLE vouchers (
                    id VARCHAR(255) PRIMARY KEY,
                    voucherNumber VARCHAR(50) UNIQUE,
                    date DATE,
                    type VARCHAR(50),
                    entries TEXT,
                    narration TEXT,
                    projectId VARCHAR(255),
                    bookingId VARCHAR(255),
                    referenceId VARCHAR(255),
                    status VARCHAR(50),
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE SET NULL,
                    FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE SET NULL,
                    INDEX idx_date (date),
                    INDEX idx_type (type),
                    INDEX idx_status (status),
                    INDEX idx_voucherNumber (voucherNumber)
                )
            `);
            console.log('✓ Created `vouchers` table with indexes');

            // ========== VOUCHER ENTRIES TABLE ==========
            await postgresPool.query(`
                CREATE TABLE voucher_entries (
                    id VARCHAR(255) PRIMARY KEY,
                    voucherId VARCHAR(255) NOT NULL,
                    accountId VARCHAR(255) NOT NULL,
                    accountName VARCHAR(255),
                    debit DECIMAL(15,2),
                    credit DECIMAL(15,2),
                    FOREIGN KEY (voucherId) REFERENCES vouchers(id) ON DELETE CASCADE,
                    FOREIGN KEY (accountId) REFERENCES ledger_accounts(id) ON DELETE CASCADE,
                    INDEX idx_voucherId (voucherId),
                    INDEX idx_accountId (accountId)
                )
            `);
            console.log('✓ Created `voucher_entries` table with indexes');

            // ========== GST ENTRIES TABLE ==========
            await postgresPool.query(`
                CREATE TABLE gst_entries (
                    id VARCHAR(255) PRIMARY KEY,
                    date DATE,
                    voucherId VARCHAR(255),
                    type VARCHAR(50),
                    gstin VARCHAR(20),
                    taxableValue DECIMAL(15,2),
                    cgst DECIMAL(15,2),
                    sgst DECIMAL(15,2),
                    igst DECIMAL(15,2),
                    totalGst DECIMAL(15,2),
                    FOREIGN KEY (voucherId) REFERENCES vouchers(id) ON DELETE SET NULL,
                    INDEX idx_date (date),
                    INDEX idx_voucherId (voucherId),
                    INDEX idx_type (type)
                )
            `);
            console.log('✓ Created `gst_entries` table with indexes');

            // ========== CHANNEL PARTNERS TABLE ==========
            await postgresPool.query(`
                CREATE TABLE channel_partners (
                    id VARCHAR(255) PRIMARY KEY,
                    firmName VARCHAR(255) NOT NULL,
                    contactPerson VARCHAR(255),
                    email VARCHAR(255),
                    phone VARCHAR(255),
                    reraNumber VARCHAR(255),
                    status VARCHAR(50),
                    commissionRate DECIMAL(5,2),
                    totalLeads INT,
                    totalConversions INT,
                    onboardingDate DATE,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_status (status),
                    INDEX idx_email (email)
                )
            `);
            console.log('✓ Created `channel_partners` table with indexes\n');

            // Seed Data
            console.log('📊 Seeding database tables...\n');

            // Users
            for (const u of INITIAL_USERS) {
                await postgresPool.query(
                    'INSERT INTO users (id, name, username, password, email, phone, role, isActive, assignedProjectIds, reportsTo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
                    [u.id, u.name, u.username, u.password, u.email, u.phone, u.role, u.isActive, JSON.stringify(u.assignedProjectIds), u.reportsTo]
                );
            }
            console.log(`✓ Seeded ${INITIAL_USERS.length} users`);

            // Projects
            for (const p of INITIAL_PROJECTS) {
                await postgresPool.query(
                    'INSERT INTO projects (id, name, companyName, location, reraNumber, projectType, projectStatus, description, totalFloors, wings, inventory, parkingInventory, paymentPlanIds, floorPlanUrl) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
                    [p.id, p.name, p.companyName, p.location, p.reraNumber, p.projectType, p.projectStatus, p.description, p.totalFloors, JSON.stringify(p.wings), JSON.stringify(p.inventory), JSON.stringify(p.parkingInventory), JSON.stringify(p.paymentPlanIds), p.floorPlanUrl]
                );
            }
            console.log(`✓ Seeded ${INITIAL_PROJECTS.length} projects`);

            // Leads
            for (const l of INITIAL_LEADS) {
                await postgresPool.query(
                    'INSERT INTO leads (id, name, avatarInitials, lastMessage, time, chatStatus, leadStatus, "read", messages, email, phone, initialInterest, siteVisits, tasks, channelSource, leadSource, preferredLocation, budget, clientProfile, livingPlace, propertyImages, ownerId, leadProject, leadDate, bookingStatus, agreementStatus, possessionStatus, tokenAmount, bookingDetails) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)',
                    [l.id, l.name, l.avatarInitials, l.lastMessage, l.time, l.chatStatus, l.leadStatus, l.read, JSON.stringify(l.messages), l.email, l.phone, JSON.stringify(l.initialInterest), JSON.stringify(l.siteVisits), JSON.stringify(l.tasks), l.channelSource, l.leadSource, l.preferredLocation, l.budget, l.clientProfile, l.livingPlace, JSON.stringify(l.propertyImages), l.ownerId, l.leadProject, l.leadDate, l.bookingStatus, l.agreementStatus, l.possessionStatus, l.tokenAmount, JSON.stringify(l.bookingDetails)]
                );
            }
            console.log(`✓ Seeded ${INITIAL_LEADS.length} leads`);

            // Sources
            for (const s of INITIAL_SOURCES) {
                await postgresPool.query(
                    'INSERT INTO sources (id, channelSource, name, description) VALUES ($1, $2, $3, $4)',
                    [s.id, s.channelSource, s.name, s.description]
                );
            }
            console.log(`✓ Seeded ${INITIAL_SOURCES.length} sources`);

            // Payment Plans
            for (const p of INITIAL_PAYMENT_PLANS) {
                await postgresPool.query(
                    'INSERT INTO payment_plans (id, name, milestones) VALUES ($1, $2, $3)',
                    [p.id, p.name, JSON.stringify(p.milestones)]
                );
            }
            console.log(`✓ Seeded ${INITIAL_PAYMENT_PLANS.length} payment plans`);

            // Templates
            for (const t of INITIAL_TEMPLATES) {
                await postgresPool.query(
                    'INSERT INTO templates (id, name, type, content) VALUES ($1, $2, $3, $4)',
                    [t.id, t.name, t.type, t.content]
                );
            }
            console.log(`✓ Seeded ${INITIAL_TEMPLATES.length} templates`);

            console.log(`\n${'='.repeat(60)}`);
            console.log('✓ PostgreSQL Database initialization complete!');
            console.log(`${'='.repeat(60)}\n`);
        } catch (error) {
            console.error('✗ Error during PostgreSQL database setup:', error);
        } finally {
            await postgresPool.end();
            console.log('PostgreSQL pool connection closed.');
        }

    } else {
        // MySQL Mode Setup
        if (!mysqlPool) {
            console.error('MySQL Pool is not initialized');
            return;
        }

        let connection;
        try {
            connection = await mysqlPool.getConnection();
            console.log('Connected to MySQL DB for setup...\n');

            await connection.query('SET FOREIGN_KEY_CHECKS = 0');
            await connection.query('DROP TABLE IF EXISTS voucher_entries');
            await connection.query('DROP TABLE IF EXISTS gst_entries');
            await connection.query('DROP TABLE IF EXISTS vouchers');
            await connection.query('DROP TABLE IF EXISTS ledger_accounts');
            await connection.query('DROP TABLE IF EXISTS agreements');
            await connection.query('DROP TABLE IF EXISTS bookings');
            await connection.query('DROP TABLE IF EXISTS site_visits');
            await connection.query('DROP TABLE IF EXISTS tasks');
            await connection.query('DROP TABLE IF EXISTS channel_partners');
            await connection.query('DROP TABLE IF EXISTS leads');
            await connection.query('DROP TABLE IF EXISTS templates');
            await connection.query('DROP TABLE IF EXISTS sources');
            await connection.query('DROP TABLE IF EXISTS payment_plans');
            await connection.query('DROP TABLE IF EXISTS projects');
            await connection.query('DROP TABLE IF EXISTS users');
            await connection.query('SET FOREIGN_KEY_CHECKS = 1');
            console.log('✓ Dropped existing tables.\n');

            // ========== USERS TABLE ==========
            await connection.query(`
                CREATE TABLE users (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    username VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255),
                    email VARCHAR(255) NOT NULL UNIQUE,
                    phone VARCHAR(255),
                    role ENUM('Admin', 'Sales', 'User', 'Manager') NOT NULL,
                    designation VARCHAR(100),
                    isActive BOOLEAN NOT NULL DEFAULT TRUE,
                    assignedProjectIds JSON,
                    reportsTo VARCHAR(255),
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (reportsTo) REFERENCES users(id) ON DELETE SET NULL,
                    INDEX idx_email (email),
                    INDEX idx_role (role),
                    INDEX idx_isActive (isActive)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✓ Created `users` table with indexes');

            // ========== PROJECTS TABLE ==========
            await connection.query(`
                CREATE TABLE projects (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    companyName VARCHAR(255),
                    location VARCHAR(255),
                    reraNumber VARCHAR(255) UNIQUE,
                    projectType ENUM('Residential', 'Commercial', 'Mixed-Use') DEFAULT 'Residential',
                    projectStatus ENUM('Pre-launch', 'Under Construction', 'Ready to Move', 'Completed') DEFAULT 'Pre-launch',
                    description TEXT,
                    totalFloors INT,
                    wings JSON,
                    inventory JSON,
                    parkingInventory JSON,
                    paymentPlanIds JSON,
                    floorPlanUrl TEXT,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_location (location),
                    INDEX idx_projectStatus (projectStatus),
                    INDEX idx_createdAt (createdAt)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✓ Created `projects` table with indexes');

            // ========== LEADS TABLE ==========
            await connection.query(`
                CREATE TABLE leads (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    avatarInitials VARCHAR(10),
                    lastMessage TEXT,
                    time VARCHAR(255),
                    chatStatus ENUM('online', 'offline', 'away') DEFAULT 'offline',
                    leadStatus ENUM('New', 'Contacted', 'Qualified', 'Unqualified', 'Converted') DEFAULT 'New',
                    \`read\` BOOLEAN DEFAULT FALSE,
                    messages JSON,
                    email VARCHAR(255) NOT NULL,
                    phone VARCHAR(255),
                    initialInterest JSON,
                    siteVisits JSON,
                    tasks JSON,
                    channelSource VARCHAR(255),
                    leadSource VARCHAR(255),
                    preferredLocation VARCHAR(255),
                    budget VARCHAR(255),
                    clientProfile VARCHAR(255),
                    livingPlace VARCHAR(255),
                    propertyImages JSON,
                    ownerId VARCHAR(255),
                    leadProject VARCHAR(255),
                    leadDate DATE,
                    bookingStatus ENUM('Pending', 'Booked') DEFAULT 'Pending',
                    agreementStatus ENUM('Drafted', 'Sent for Signature', 'Registered') DEFAULT 'Drafted',
                    possessionStatus ENUM('Pending', 'Scheduled', 'Handed Over') DEFAULT 'Pending',
                    tokenAmount INT DEFAULT 0,
                    bookingDetails JSON,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE SET NULL,
                    INDEX idx_email (email),
                    INDEX idx_leadStatus (leadStatus),
                    INDEX idx_ownerId (ownerId),
                    INDEX idx_createdAt (createdAt),
                    INDEX idx_bookingStatus (bookingStatus)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✓ Created `leads` table with indexes');

            // ========== SOURCES TABLE ==========
            await connection.query(`
                CREATE TABLE sources (
                    id VARCHAR(255) PRIMARY KEY,
                    channelSource VARCHAR(255) NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_channelSource (channelSource)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✓ Created `sources` table with indexes');

            // ========== PAYMENT PLANS TABLE ==========
            await connection.query(`
                CREATE TABLE payment_plans (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    milestones JSON,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✓ Created `payment_plans` table');

            // ========== TEMPLATES TABLE ==========
            await connection.query(`
                CREATE TABLE templates (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    type ENUM('WhatsApp', 'Email', 'SMS') DEFAULT 'WhatsApp',
                    content TEXT,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_type (type)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✓ Created `templates` table');

            // ========== TASKS TABLE ==========
            await connection.query(`
                CREATE TABLE tasks (
                    id VARCHAR(255) PRIMARY KEY,
                    leadId VARCHAR(255) NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    dueDate DATE,
                    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
                    status ENUM('Pending', 'Completed', 'Overdue', 'Cancelled') DEFAULT 'Pending',
                    assignedTo VARCHAR(255),
                    createdBy VARCHAR(255),
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (leadId) REFERENCES leads(id) ON DELETE CASCADE,
                    FOREIGN KEY (assignedTo) REFERENCES users(id) ON DELETE SET NULL,
                    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL,
                    INDEX idx_leadId (leadId),
                    INDEX idx_assignedTo (assignedTo),
                    INDEX idx_status (status),
                    INDEX idx_dueDate (dueDate),
                    INDEX idx_priority (priority)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✓ Created `tasks` table with indexes');

            // ========== SITE VISITS TABLE ==========
            await connection.query(`
                CREATE TABLE site_visits (
                    id VARCHAR(255) PRIMARY KEY,
                    leadId VARCHAR(255) NOT NULL,
                    projectId VARCHAR(255),
                    scheduledDate DATETIME,
                    completedDate DATETIME,
                    status ENUM('Scheduled', 'Completed', 'Cancelled', 'No-Show') DEFAULT 'Scheduled',
                    notes TEXT,
                    attendees JSON,
                    feedback TEXT,
                    rating INT,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (leadId) REFERENCES leads(id) ON DELETE CASCADE,
                    FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE SET NULL,
                    INDEX idx_leadId (leadId),
                    INDEX idx_projectId (projectId),
                    INDEX idx_status (status),
                    INDEX idx_scheduledDate (scheduledDate)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✓ Created `site_visits` table with indexes');

            // ========== BOOKINGS TABLE ==========
            await connection.query(`
                CREATE TABLE bookings (
                    id VARCHAR(255) PRIMARY KEY,
                    leadId VARCHAR(255) NOT NULL,
                    projectId VARCHAR(255),
                    unitId VARCHAR(255),
                    status ENUM('Pending', 'Booked', 'Cancelled', 'Completed') DEFAULT 'Pending',
                    tokenAmount INT DEFAULT 0,
                    registrationAmount INT DEFAULT 0,
                    totalAmount INT DEFAULT 0,
                    paymentSchedule JSON,
                    agreementId VARCHAR(255),
                    possessionDate DATE,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (leadId) REFERENCES leads(id) ON DELETE CASCADE,
                    FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE SET NULL,
                    INDEX idx_leadId (leadId),
                    INDEX idx_projectId (projectId),
                    INDEX idx_status (status),
                    INDEX idx_createdAt (createdAt)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✓ Created `bookings` table with indexes');

            // ========== AGREEMENTS TABLE ==========
            await connection.query(`
                CREATE TABLE agreements (
                    id VARCHAR(255) PRIMARY KEY,
                    bookingId VARCHAR(255) NOT NULL,
                    leadId VARCHAR(255),
                    status ENUM('Drafted', 'Sent for Signature', 'Signed', 'Registered', 'Cancelled') DEFAULT 'Drafted',
                    content TEXT,
                    signatories JSON,
                    signedDate DATE,
                    registrationDate DATE,
                    registrationNumber VARCHAR(255),
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE,
                    FOREIGN KEY (leadId) REFERENCES leads(id) ON DELETE SET NULL,
                    INDEX idx_bookingId (bookingId),
                    INDEX idx_leadId (leadId),
                    INDEX idx_status (status)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✓ Created `agreements` table with indexes');

            // ========== LEDGER ACCOUNTS TABLE ==========
            await connection.query(`
                CREATE TABLE ledger_accounts (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    code VARCHAR(50) UNIQUE,
                    \`group\` ENUM('Assets', 'Liabilities', 'Income', 'Expenses', 'Equity') NOT NULL,
                    openingBalance DECIMAL(15,2) DEFAULT 0,
                    currentBalance DECIMAL(15,2) DEFAULT 0,
                    isSystem BOOLEAN DEFAULT FALSE,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_code (code),
                    INDEX idx_group (\`group\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✓ Created `ledger_accounts` table with indexes');

            // ========== VOUCHERS TABLE ==========
            await connection.query(`
                CREATE TABLE vouchers (
                    id VARCHAR(255) PRIMARY KEY,
                    voucherNumber VARCHAR(50) UNIQUE,
                    date DATE,
                    type ENUM('Journal', 'Payment', 'Receipt', 'Contra', 'Sales', 'Purchase') NOT NULL,
                    entries JSON,
                    narration TEXT,
                    projectId VARCHAR(255),
                    bookingId VARCHAR(255),
                    referenceId VARCHAR(255),
                    status ENUM('Draft', 'Posted', 'Cancelled') DEFAULT 'Draft',
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE SET NULL,
                    FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE SET NULL,
                    INDEX idx_date (date),
                    INDEX idx_type (type),
                    INDEX idx_status (status),
                    INDEX idx_voucherNumber (voucherNumber)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✓ Created `vouchers` table with indexes');

            // ========== VOUCHER ENTRIES TABLE ==========
            await connection.query(`
                CREATE TABLE voucher_entries (
                    id VARCHAR(255) PRIMARY KEY,
                    voucherId VARCHAR(255) NOT NULL,
                    accountId VARCHAR(255) NOT NULL,
                    accountName VARCHAR(255),
                    debit DECIMAL(15,2) DEFAULT 0,
                    credit DECIMAL(15,2) DEFAULT 0,
                    FOREIGN KEY (voucherId) REFERENCES vouchers(id) ON DELETE CASCADE,
                    FOREIGN KEY (accountId) REFERENCES ledger_accounts(id) ON DELETE CASCADE,
                    INDEX idx_voucherId (voucherId),
                    INDEX idx_accountId (accountId)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✓ Created `voucher_entries` table with indexes');

            // ========== GST ENTRIES TABLE ==========
            await connection.query(`
                CREATE TABLE gst_entries (
                    id VARCHAR(255) PRIMARY KEY,
                    date DATE,
                    voucherId VARCHAR(255),
                    type ENUM('Input', 'Output') NOT NULL,
                    gstin VARCHAR(20),
                    taxableValue DECIMAL(15,2) DEFAULT 0,
                    cgst DECIMAL(15,2) DEFAULT 0,
                    sgst DECIMAL(15,2) DEFAULT 0,
                    igst DECIMAL(15,2) DEFAULT 0,
                    totalGst DECIMAL(15,2) DEFAULT 0,
                    FOREIGN KEY (voucherId) REFERENCES vouchers(id) ON DELETE SET NULL,
                    INDEX idx_date (date),
                    INDEX idx_voucherId (voucherId),
                    INDEX idx_type (type)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✓ Created `gst_entries` table with indexes');

            // ========== CHANNEL PARTNERS TABLE ==========
            await connection.query(`
                CREATE TABLE channel_partners (
                    id VARCHAR(255) PRIMARY KEY,
                    firmName VARCHAR(255) NOT NULL,
                    contactPerson VARCHAR(255),
                    email VARCHAR(255),
                    phone VARCHAR(255),
                    reraNumber VARCHAR(255),
                    status ENUM('Active', 'Inactive', 'Pending', 'Suspended') DEFAULT 'Pending',
                    commissionRate DECIMAL(5,2) DEFAULT 0,
                    totalLeads INT DEFAULT 0,
                    totalConversions INT DEFAULT 0,
                    onboardingDate DATE,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_status (status),
                    INDEX idx_email (email)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✓ Created `channel_partners` table with indexes\n');

            // Seed Data
            console.log('📊 Seeding database tables...\n');

            // Users
            for (const u of INITIAL_USERS) {
                await connection.query(
                    'INSERT INTO users (id, name, username, password, email, phone, role, isActive, assignedProjectIds, reportsTo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [u.id, u.name, u.username, u.password, u.email, u.phone, u.role, u.isActive, JSON.stringify(u.assignedProjectIds), u.reportsTo]
                );
            }
            console.log(`✓ Seeded ${INITIAL_USERS.length} users`);

            // Projects
            for (const p of INITIAL_PROJECTS) {
                await connection.query(
                    'INSERT INTO projects (id, name, companyName, location, reraNumber, projectType, projectStatus, description, totalFloors, wings, inventory, parkingInventory, paymentPlanIds, floorPlanUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [p.id, p.name, p.companyName, p.location, p.reraNumber, p.projectType, p.projectStatus, p.description, p.totalFloors, JSON.stringify(p.wings), JSON.stringify(p.inventory), JSON.stringify(p.parkingInventory), JSON.stringify(p.paymentPlanIds), p.floorPlanUrl]
                );
            }
            console.log(`✓ Seeded ${INITIAL_PROJECTS.length} projects`);

            // Leads
            for (const l of INITIAL_LEADS) {
                await connection.query(
                    'INSERT INTO leads (id, name, avatarInitials, lastMessage, time, chatStatus, leadStatus, `read`, messages, email, phone, initialInterest, siteVisits, tasks, channelSource, leadSource, preferredLocation, budget, clientProfile, livingPlace, propertyImages, ownerId, leadProject, leadDate, bookingStatus, agreementStatus, possessionStatus, tokenAmount, bookingDetails) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [l.id, l.name, l.avatarInitials, l.lastMessage, l.time, l.chatStatus, l.leadStatus, l.read, JSON.stringify(l.messages), l.email, l.phone, JSON.stringify(l.initialInterest), JSON.stringify(l.siteVisits), JSON.stringify(l.tasks), l.channelSource, l.leadSource, l.preferredLocation, l.budget, l.clientProfile, l.livingPlace, JSON.stringify(l.propertyImages), l.ownerId, l.leadProject, l.leadDate, l.bookingStatus, l.agreementStatus, l.possessionStatus, l.tokenAmount, JSON.stringify(l.bookingDetails)]
                );
            }
            console.log(`✓ Seeded ${INITIAL_LEADS.length} leads`);

            // Sources
            for (const s of INITIAL_SOURCES) {
                await connection.query(
                    'INSERT INTO sources (id, channelSource, name, description) VALUES (?, ?, ?, ?)',
                    [s.id, s.channelSource, s.name, s.description]
                );
            }
            console.log(`✓ Seeded ${INITIAL_SOURCES.length} sources`);

            // Payment Plans
            for (const p of INITIAL_PAYMENT_PLANS) {
                await connection.query(
                    'INSERT INTO payment_plans (id, name, milestones) VALUES (?, ?, ?)',
                    [p.id, p.name, JSON.stringify(p.milestones)]
                );
            }
            console.log(`✓ Seeded ${INITIAL_PAYMENT_PLANS.length} payment plans`);

            // Templates
            for (const t of INITIAL_TEMPLATES) {
                await connection.query(
                    'INSERT INTO templates (id, name, type, content) VALUES (?, ?, ?, ?)',
                    [t.id, t.name, t.type, t.content]
                );
            }
            console.log(`✓ Seeded ${INITIAL_TEMPLATES.length} templates`);

            console.log(`\n${'='.repeat(60)}`);
            console.log('✓ MySQL Database initialization complete!');
            console.log(`${'='.repeat(60)}\n`);
        } catch (error) {
            console.error('✗ Error during MySQL database setup:', error);
        } finally {
            if (connection) {
                connection.release();
            }
            await mysqlPool.end();
            console.log('MySQL Pool closed.');
        }
    }
};

setupDatabase();
