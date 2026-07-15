#!/usr/bin/env npx ts-node
/**
 * Firestore Complete Schema Initialization
 * Run: npx ts-node firestore-init-run.ts
 * 
 * This script initializes all Firestore collections with complete sample data
 * including all fields for every collection type
 */

import {
    initializeFirestoreCollections,
    verifyFirestoreCollections,
    demonstrateCommonQueries
} from './firestore-init.js';

async function main() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║    RealtySarv Firestore Complete Schema Initialization        ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('\n');

    try {
        // Step 1: Initialize all collections with sample data
        console.log('📝 Step 1: Creating Firestore Collections with Complete Schema');
        console.log('─────────────────────────────────────────────────────────────────');
        await initializeFirestoreCollections();
        console.log('✅ Step 1 Complete!\n');

        // Step 2: Verify collections were created
        console.log('🔍 Step 2: Verifying Collections');
        console.log('─────────────────────────────────────────────────────────────────');
        await verifyFirestoreCollections();
        console.log('✅ Step 2 Complete!\n');

        // Step 3: Demonstrate common queries
        console.log('🚀 Step 3: Demonstrating Common Firestore Queries');
        console.log('─────────────────────────────────────────────────────────────────');
        await demonstrateCommonQueries();
        console.log('✅ Step 3 Complete!\n');

        console.log('╔════════════════════════════════════════════════════════════════╗');
        console.log('║           ✅ Firestore Initialization Complete! ✅             ║');
        console.log('╚════════════════════════════════════════════════════════════════╝');
        console.log('\n📊 Summary:');
        console.log('─────────────────────────────────────────────────────────────────');
        console.log('✓ 13 Collections Created');
        console.log('✓ Sample Records Added to Each Collection');
        console.log('✓ All Fields Populated with Realistic Data');
        console.log('✓ Relationships Established Between Collections');
        console.log('✓ Common Queries Tested');
        console.log('\n📚 Collections Created:');
        console.log('─────────────────────────────────────────────────────────────────');
        console.log('  1. companies (Company & Organization Details)');
        console.log('  2. users (User Accounts & Access Control)');
        console.log('  3. projects (Real Estate Projects & Properties)');
        console.log('  4. leads (Lead Management & Pipeline)');
        console.log('  5. tasks (Task Management & Follow-ups)');
        console.log('  6. siteVisits (Site Visit Tracking)');
        console.log('  7. bookings (Property Bookings & Sales)');
        console.log('  8. agreements (Legal Agreements & Contracts)');
        console.log('  9. ledgers (Accounting & GL Accounts)');
        console.log(' 10. vouchers (Financial Vouchers & Entries)');
        console.log(' 11. templates (Communication Templates)');
        console.log(' 12. channelPartners (Partner Management)');
        console.log(' 13. integrations (Third-party Integrations)');
        console.log(' 14. settings (Application Settings)');
        console.log('\n🔐 Firebase Project:');
        console.log('─────────────────────────────────────────────────────────────────');
        console.log('  Project ID: gen-lang-client-0873542795');
        console.log('  Database ID: ai-studio-10a71e0e-6277-4ebb-b538-3263c6ea0ada');
        console.log('  Console: https://console.firebase.google.com/');
        console.log('\n💡 Next Steps:');
        console.log('─────────────────────────────────────────────────────────────────');
        console.log('  1. Deploy Firestore Indexes:');
        console.log('     firebase deploy --only firestore:indexes --config firebase-indexes.json');
        console.log('  2. Set Firestore Security Rules:');
        console.log('     firebase deploy --only firestore:rules');
        console.log('  3. Start the application:');
        console.log('     npm run dev              (Frontend on :3000)');
        console.log('     cd server && npm run dev (Backend on :4000)');
        console.log('\n🎯 Verify Data in Firebase Console:');
        console.log('─────────────────────────────────────────────────────────────────');
        console.log('  1. Go to: https://console.firebase.google.com/');
        console.log('  2. Select Project: gen-lang-client-0873542795');
        console.log('  3. Navigate to: Firestore Database');
        console.log('  4. View Collections and Sample Records');
        console.log('\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Firestore Initialization Failed!');
        console.error('─────────────────────────────────────────────────────────────────');
        console.error('Error:', error);
        console.error('\n🔧 Troubleshooting:');
        console.error('─────────────────────────────────────────────────────────────────');
        console.error('  1. Check Firebase configuration in firebase.ts');
        console.error('  2. Verify Firebase credentials in firebase-applet-config.json');
        console.error('  3. Ensure Firestore Database exists in Firebase Console');
        console.error('  4. Check internet connection and firewall settings');
        console.error('\n');
        process.exit(1);
    }
}

main();
