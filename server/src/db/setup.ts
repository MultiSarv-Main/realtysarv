import 'dotenv/config';
import { dbType, mysqlPool, postgresPool } from './connection';
import { INITIAL_LEADS, INITIAL_USERS, INITIAL_PROJECTS, INITIAL_SOURCES, INITIAL_PAYMENT_PLANS, INITIAL_TEMPLATES } from '../constants';

const setupDatabase = async () => {
    console.log(`Starting Database Setup in [${dbType.toUpperCase()}] mode...`);

    if (dbType === 'postgres') {
        if (!postgresPool) {
            console.error('PostgreSQL Pool is not initialized');
            return;
        }
        
        try {
            // Drop existing tables with CASCADE to clean constraints
            console.log('Cleaning up existing database tables...');
            await postgresPool.query('DROP TABLE IF EXISTS leads CASCADE');
            await postgresPool.query('DROP TABLE IF EXISTS users CASCADE');
            await postgresPool.query('DROP TABLE IF EXISTS projects CASCADE');
            await postgresPool.query('DROP TABLE IF EXISTS sources CASCADE');
            await postgresPool.query('DROP TABLE IF EXISTS payment_plans CASCADE');
            await postgresPool.query('DROP TABLE IF EXISTS templates CASCADE');
            console.log('Dropped existing tables.');

            // Create Users Table
            await postgresPool.query(`
                CREATE TABLE users (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    username VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255),
                    email VARCHAR(255) NOT NULL UNIQUE,
                    phone VARCHAR(255),
                    role VARCHAR(50) NOT NULL,
                    isActive BOOLEAN NOT NULL DEFAULT TRUE,
                    assignedProjectIds TEXT,
                    reportsTo VARCHAR(255),
                    FOREIGN KEY (reportsTo) REFERENCES users(id) ON DELETE SET NULL
                )
            `);
            console.log('Created `users` table.');

            // Create Projects Table
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
                    floorPlanUrl TEXT
                )
            `);
            console.log('Created `projects` table.');

            // Create Leads Table (Note the "read" column has double quotes in pg)
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
                    FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE SET NULL
                )
            `);
            console.log('Created `leads` table.');

            // Create Sources Table
            await postgresPool.query(`
                CREATE TABLE sources (
                    id VARCHAR(255) PRIMARY KEY,
                    channelSource VARCHAR(255) NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    description TEXT
                )
            `);
            console.log('Created `sources` table.');

            // Create Payment Plans Table
            await postgresPool.query(`
                CREATE TABLE payment_plans (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    milestones TEXT
                )
            `);
            console.log('Created `payment_plans` table.');

            // Create Templates Table
            await postgresPool.query(`
                CREATE TABLE templates (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    type VARCHAR(50),
                    content TEXT
                )
            `);
            console.log('Created `templates` table.');

            // Seed Data one by one
            console.log('Seeding PostgreSQL database tables...');

            // Users
            for (const u of INITIAL_USERS) {
                await postgresPool.query(
                    'INSERT INTO users (id, name, username, password, email, phone, role, isActive, assignedProjectIds, reportsTo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
                    [u.id, u.name, u.username, u.password, u.email, u.phone, u.role, u.isActive, JSON.stringify(u.assignedProjectIds), u.reportsTo]
                );
            }
            console.log('Seeded `users`.');

            // Projects
            for (const p of INITIAL_PROJECTS) {
                await postgresPool.query(
                    'INSERT INTO projects (id, name, companyName, location, reraNumber, projectType, projectStatus, description, totalFloors, wings, inventory, parkingInventory, paymentPlanIds, floorPlanUrl) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
                    [p.id, p.name, p.companyName, p.location, p.reraNumber, p.projectType, p.projectStatus, p.description, p.totalFloors, JSON.stringify(p.wings), JSON.stringify(p.inventory), JSON.stringify(p.parkingInventory), JSON.stringify(p.paymentPlanIds), p.floorPlanUrl]
                );
            }
            console.log('Seeded `projects`.');

            // Leads
            for (const l of INITIAL_LEADS) {
                await postgresPool.query(
                    'INSERT INTO leads (id, name, avatarInitials, lastMessage, time, chatStatus, leadStatus, "read", messages, email, phone, initialInterest, siteVisits, tasks, channelSource, leadSource, preferredLocation, budget, clientProfile, livingPlace, propertyImages, ownerId, leadProject, leadDate, bookingStatus, agreementStatus, possessionStatus, tokenAmount, bookingDetails) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)',
                    [l.id, l.name, l.avatarInitials, l.lastMessage, l.time, l.chatStatus, l.leadStatus, l.read, JSON.stringify(l.messages), l.email, l.phone, JSON.stringify(l.initialInterest), JSON.stringify(l.siteVisits), JSON.stringify(l.tasks), l.channelSource, l.leadSource, l.preferredLocation, l.budget, l.clientProfile, l.livingPlace, JSON.stringify(l.propertyImages), l.ownerId, l.leadProject, l.leadDate, l.bookingStatus, l.agreementStatus, l.possessionStatus, l.tokenAmount, JSON.stringify(l.bookingDetails)]
                );
            }
            console.log('Seeded `leads`.');

            // Sources
            for (const s of INITIAL_SOURCES) {
                await postgresPool.query(
                    'INSERT INTO sources (id, channelSource, name, description) VALUES ($1, $2, $3, $4)',
                    [s.id, s.channelSource, s.name, s.description]
                );
            }
            console.log('Seeded `sources`.');

            // Payment Plans
            for (const p of INITIAL_PAYMENT_PLANS) {
                await postgresPool.query(
                    'INSERT INTO payment_plans (id, name, milestones) VALUES ($1, $2, $3)',
                    [p.id, p.name, JSON.stringify(p.milestones)]
                );
            }
            console.log('Seeded `payment_plans`.');

            // Templates
            for (const t of INITIAL_TEMPLATES) {
                await postgresPool.query(
                    'INSERT INTO templates (id, name, type, content) VALUES ($1, $2, $3, $4)',
                    [t.id, t.name, t.type, t.content]
                );
            }
            console.log('Seeded `templates`.');

            console.log('PostgreSQL Database initialization complete!');
        } catch (error) {
            console.error('Error during PostgreSQL database setup:', error);
        } finally {
            await postgresPool.end();
            console.log('PostgreSQL pool connection closed.');
        }

    } else {
        // Fallback to MySQL Mode Setup
        if (!mysqlPool) {
            console.error('MySQL Pool is not initialized');
            return;
        }

        let connection;
        try {
            connection = await mysqlPool.getConnection();
            console.log('Connected to MySQL DB for setup...');

            await connection.query('SET FOREIGN_KEY_CHECKS = 0');
            await connection.query('DROP TABLE IF EXISTS leads, users, projects, sources, payment_plans, templates');
            await connection.query('SET FOREIGN_KEY_CHECKS = 1');
            console.log('Dropped existing tables.');

            // Create Users Table
            await connection.query(`
                CREATE TABLE users (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    username VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255),
                    email VARCHAR(255) NOT NULL UNIQUE,
                    phone VARCHAR(255),
                    role ENUM('Admin', 'Sales', 'User') NOT NULL,
                    isActive BOOLEAN NOT NULL DEFAULT TRUE,
                    assignedProjectIds JSON,
                    reportsTo VARCHAR(255),
                    FOREIGN KEY (reportsTo) REFERENCES users(id) ON DELETE SET NULL
                )
            `);
            console.log('Created `users` table.');

            // Create Projects Table
            await connection.query(`
                CREATE TABLE projects (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    companyName VARCHAR(255),
                    location VARCHAR(255),
                    reraNumber VARCHAR(255) UNIQUE,
                    projectType ENUM('Residential', 'Commercial', 'Mixed-Use'),
                    projectStatus ENUM('Pre-launch', 'Under Construction', 'Ready to Move'),
                    description TEXT,
                    totalFloors INT,
                    wings JSON,
                    inventory JSON,
                    parkingInventory JSON,
                    paymentPlanIds JSON,
                    floorPlanUrl TEXT
                )
            `);
            console.log('Created `projects` table.');

            // Create Leads Table
            await connection.query(`
                CREATE TABLE leads (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    avatarInitials VARCHAR(10),
                    lastMessage TEXT,
                    time VARCHAR(255),
                    chatStatus ENUM('online', 'offline'),
                    leadStatus ENUM('New', 'Contacted', 'Qualified', 'Unqualified', 'Converted'),
                    \`read\` BOOLEAN,
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
                    bookingStatus ENUM('Pending', 'Booked'),
                    agreementStatus ENUM('Drafted', 'Sent for Signature', 'Registered'),
                    possessionStatus ENUM('Pending', 'Scheduled', 'Handed Over'),
                    tokenAmount INT,
                    bookingDetails JSON,
                    FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE SET NULL
                )
            `);
            console.log('Created `leads` table.');

            // Create Other Tables
            await connection.query(`
                CREATE TABLE sources (
                    id VARCHAR(255) PRIMARY KEY,
                    channelSource VARCHAR(255) NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    description TEXT
                )
            `);
            console.log('Created `sources` table.');

            await connection.query(`
                CREATE TABLE payment_plans (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    milestones JSON
                )
            `);
            console.log('Created `payment_plans` table.');
            
            await connection.query(`
                CREATE TABLE templates (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    type ENUM('WhatsApp', 'Email'),
                    content TEXT
                )
            `);
            console.log('Created `templates` table.');

            // Seed Data
            console.log('Seeding MySQL database tables...');

            const userValues = INITIAL_USERS.map(user => [
                user.id, user.name, user.username, user.password, user.email, user.phone,
                user.role, user.isActive, JSON.stringify(user.assignedProjectIds), user.reportsTo
            ]);
            await connection.query(
                'INSERT INTO users (id, name, username, password, email, phone, role, isActive, assignedProjectIds, reportsTo) VALUES ?',
                [userValues]
            );
            console.log('Seeded `users`.');

            const projectValues = INITIAL_PROJECTS.map(p => [
                p.id, p.name, p.companyName, p.location, p.reraNumber, p.projectType, p.projectStatus,
                p.description, p.totalFloors, JSON.stringify(p.wings), JSON.stringify(p.inventory),
                JSON.stringify(p.parkingInventory), JSON.stringify(p.paymentPlanIds), p.floorPlanUrl
            ]);
            await connection.query(
                'INSERT INTO projects (id, name, companyName, location, reraNumber, projectType, projectStatus, description, totalFloors, wings, inventory, parkingInventory, paymentPlanIds, floorPlanUrl) VALUES ?',
                [projectValues]
            );
            console.log('Seeded `projects`.');

            const leadValues = INITIAL_LEADS.map(l => [
                l.id, l.name, l.avatarInitials, l.lastMessage, l.time, l.chatStatus, l.leadStatus,
                l.read, JSON.stringify(l.messages), l.email, l.phone, JSON.stringify(l.initialInterest),
                JSON.stringify(l.siteVisits), JSON.stringify(l.tasks), l.channelSource, l.leadSource,
                l.preferredLocation, l.budget, l.clientProfile, l.livingPlace, JSON.stringify(l.propertyImages),
                l.ownerId, l.leadProject, l.leadDate, l.bookingStatus, l.agreementStatus, l.possessionStatus,
                l.tokenAmount, JSON.stringify(l.bookingDetails)
            ]);
            await connection.query(
                'INSERT INTO leads (id, name, avatarInitials, lastMessage, time, chatStatus, leadStatus, `read`, messages, email, phone, initialInterest, siteVisits, tasks, channelSource, leadSource, preferredLocation, budget, clientProfile, livingPlace, propertyImages, ownerId, leadProject, leadDate, bookingStatus, agreementStatus, possessionStatus, tokenAmount, bookingDetails) VALUES ?',
                [leadValues]
            );
            console.log('Seeded `leads`.');

            const sourceValues = INITIAL_SOURCES.map(s => [s.id, s.channelSource, s.name, s.description]);
            await connection.query('INSERT INTO sources (id, channelSource, name, description) VALUES ?', [sourceValues]);
            console.log('Seeded `sources`.');

            const planValues = INITIAL_PAYMENT_PLANS.map(p => [p.id, p.name, JSON.stringify(p.milestones)]);
            await connection.query('INSERT INTO payment_plans (id, name, milestones) VALUES ?', [planValues]);
            console.log('Seeded `payment_plans`.');

            const templateValues = INITIAL_TEMPLATES.map(t => [t.id, t.name, t.type, t.content]);
            await connection.query('INSERT INTO templates (id, name, type, content) VALUES ?', [templateValues]);
            console.log('Seeded `templates`.');

            console.log('MySQL Database initialization complete!');
        } catch (error) {
            console.error('Error during MySQL database setup:', error);
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
