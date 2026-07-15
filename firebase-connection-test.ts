/**
 * Firebase Connection Test
 * Tests if Firebase is properly connected (Emulator or Live)
 * 
 * Run in browser console or integrate into app
 */

import { fdb, auth } from './firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';

export async function testFirebaseConnection() {
    console.log('\n🔥 Firebase Connection Test Started...\n');

    try {
        // Test 1: Check if Firebase app is initialized
        console.log('✓ Step 1: Firebase App initialized');

        // Test 2: Check if using Emulator
        const isEmulator = auth.emulatorConfig !== undefined;
        console.log(`✓ Step 2: Emulator Mode: ${isEmulator ? '✅ YES (localhost:9099)' : '❌ NO (Live Firebase)'}`);

        // Test 3: Check Firestore connection
        const firestoreHost = fdb._firestore?.host;
        const isFirestoreEmulator = firestoreHost?.includes('localhost');
        console.log(`✓ Step 3: Firestore Emulator: ${isFirestoreEmulator ? '✅ YES (localhost:8080)' : '❌ NO (Live Firebase)'}`);

        // Test 4: Try to read from Firestore
        console.log('\n📝 Attempting to read from Firestore...');
        const companiesRef = collection(fdb, 'companies');
        const q = query(companiesRef, limit(1));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log('⚠️  Firestore connected but collections are empty');
            console.log('💡 Run: npx ts-node firestore-init-run.ts');
        } else {
            console.log(`✅ Firestore connected! Found ${snapshot.size} document(s)`);
            snapshot.docs.forEach(doc => {
                console.log(`   📄 ${doc.ref.path}: ${JSON.stringify(doc.data()).substring(0, 100)}...`);
            });
        }

        // Test 5: Check all collections
        console.log('\n📊 Checking all collections...');
        const collections = ['companies', 'users', 'projects', 'leads', 'tasks', 'siteVisits', 'bookings', 'agreements', 'ledgers', 'vouchers', 'templates', 'channelPartners', 'integrations', 'settings'];

        for (const collName of collections) {
            const ref = collection(fdb, collName);
            const snap = await getDocs(query(ref, limit(1)));
            console.log(`   ${snap.empty ? '❌' : '✅'} ${collName}: ${snap.size} document(s)`);
        }

        console.log('\n✅ Firebase Connection Test Complete!\n');

        return {
            connected: true,
            emulatorMode: isEmulator,
            firestoreEmulator: isFirestoreEmulator,
            collectionsAvailable: collections.length
        };

    } catch (error: any) {
        console.error('\n❌ Firebase Connection Test Failed!\n');
        console.error('Error:', error.message);

        if (error.message.includes('PERMISSION_DENIED')) {
            console.error('\n🔐 Permission Denied - Check Firestore Security Rules');
        } else if (error.message.includes('network')) {
            console.error('\n🌐 Network Error - Check internet connection');
        } else if (error.message.includes('offline')) {
            console.error('\n📡 Offline - Check emulator is running');
        }

        console.log('\n🔧 Troubleshooting Steps:');
        console.log('1. Is emulator running? Run: npm run emulator');
        console.log('2. Check emulator hub: http://localhost:4000');
        console.log('3. Check browser console for errors: F12');
        console.log('4. Clear cache: Cmd+Shift+R (Mac) or Ctrl+Shift+R (PC)');

        return {
            connected: false,
            error: error.message
        };
    }
}

// Auto-run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
    testFirebaseConnection();
}
