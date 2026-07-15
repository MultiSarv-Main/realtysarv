/**
 * Initialize Firestore Collections to LIVE Firebase Cloud
 * NOT to local emulator
 * 
 * Run: npx ts-node firestore-init-cloud.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, writeBatch, collection, doc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

// Initialize Firebase (LIVE - not emulator)
const app = initializeApp(firebaseConfig);
const fdb = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Sample data - same as emulator but for LIVE Firebase
const FIRESTORE_COLLECTIONS = [
    {
        name: 'companies',
        sampleData: {
            companyId: 'company_001',
            name: 'RealtyServe Solutions Pvt Ltd',
            description: 'Premium Real Estate Management Platform',
            address: '123 Business Park, Bandra, Mumbai, Maharashtra 400050',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400050',
            country: 'India',
            phone: '+91-8765432100',
            email: 'info@realtysarv.com',
            website: 'www.realtysarv.com',
            logoUrl: 'https://example.com/logo.png',
            industry: 'Real Estate',
            employeeCount: 50,
            establishedDate: '2020-01-15',
            gstNumber: '27AABCU1234A1Z0',
            panNumber: 'AABCU1234A',
            bankDetails: {
                accountNumber: '1234567890',
                bankName: 'HDFC Bank',
                branchCode: 'HDFC0000123',
                ifscCode: 'HDFC0000123'
            },
            setupCompleted: false,
            customData: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    },
    {
        name: 'users',
        sampleData: {
            userId: 'user_001',
            companyId: 'company_001',
            email: 'admin@realtysarv.com',
            name: 'Rohan Kumar',
            firstName: 'Rohan',
            lastName: 'Kumar',
            phone: '+91-9876543210',
            mobile: '+91-9876543210',
            role: 'Admin',
            designation: 'System Administrator',
            department: 'Management',
            reportingTo: '',
            isActive: true,
            isVerified: true,
            avatar: 'https://example.com/avatar.jpg',
            bio: 'System Administrator',
            assignedProjectIds: ['proj_001'],
            assignedTeamIds: [],
            permissions: ['all'],
            lastLogin: new Date().toISOString(),
            loginCount: 45,
            passwordChangedAt: new Date().toISOString(),
            twoFactorEnabled: false,
            createdBy: 'system',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    },
    {
        name: 'projects',
        sampleData: {
            projectId: 'proj_001',
            companyId: 'company_001',
            name: 'Sunset Heights Mumbai',
            projectCode: 'SHM001',
            location: 'Bandra West, Mumbai',
            latitude: 19.0596,
            longitude: 72.8295,
            address: 'Plot No. 123, Off Western Express Highway, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400050',
            country: 'India',
            reraNumber: 'P-MAH-MUM-P-20220001',
            reraApprovedDate: '2022-01-15',
            projectType: 'Residential',
            projectSubType: 'Luxury Apartments',
            projectStatus: 'Under Construction',
            description: 'Luxury residential apartments with world-class amenities',
            developerId: 'dev_001',
            architectId: 'arch_001',
            companyName: 'Premium Developers Pvt Ltd',
            totalFloors: 45,
            totalWings: 3,
            totalUnits: 450,
            totalArea: 500000,
            areaUnit: 'sqft',
            launchDate: '2022-06-01',
            completionDate: '2026-12-31',
            estimatedCompletionDate: '2026-12-31',
            wings: [
                { wingName: 'Tower A', totalFloors: 15, totalUnits: 150, status: 'Under Construction' },
                { wingName: 'Tower B', totalFloors: 15, totalUnits: 150, status: 'Under Construction' },
                { wingName: 'Tower C', totalFloors: 15, totalUnits: 150, status: 'Pre-launch' }
            ],
            inventory: [
                { unitType: '1BHK', totalUnits: 100, soldUnits: 45, availableUnits: 55, minPrice: 7500000, maxPrice: 8500000 },
                { unitType: '2BHK', totalUnits: 200, soldUnits: 80, availableUnits: 120, minPrice: 12500000, maxPrice: 15000000 },
                { unitType: '3BHK', totalUnits: 150, soldUnits: 50, availableUnits: 100, minPrice: 18000000, maxPrice: 22000000 }
            ],
            parkingInventory: [
                { parkingType: 'Open', totalSlots: 200, soldSlots: 75, pricePerSlot: 500000 },
                { parkingType: 'Covered', totalSlots: 150, soldSlots: 60, pricePerSlot: 750000 }
            ],
            amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Parking', 'Garden', 'Security Gate'],
            paymentPlanIds: ['plan_001', 'plan_002'],
            approvals: ['RERA Approval', 'Municipal Approval', 'Environmental Clearance'],
            floorPlanUrl: 'https://example.com/floorplan.pdf',
            imageUrls: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
            videoUrl: 'https://example.com/video.mp4',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    },
    {
        name: 'leads',
        sampleData: {
            leadId: 'lead_001',
            companyId: 'company_001',
            leadCode: 'LEAD001',
            name: 'Rajesh Sharma',
            firstName: 'Rajesh',
            lastName: 'Sharma',
            email: 'rajesh.sharma@email.com',
            phone: '+91-9988776655',
            alternatePhone: '+91-9988776656',
            whatsappNumber: '+91-9988776655',
            gender: 'Male',
            dateOfBirth: '1985-05-15',
            age: 39,
            maritalStatus: 'Married',
            occupation: 'Business Owner',
            company: 'ABC Enterprises',
            designation: 'CEO',
            monthlyIncome: 500000,
            leadStatus: 'Qualified',
            bookingStatus: 'Pending',
            agreementStatus: 'Drafted',
            possessionStatus: 'Pending',
            channelSource: 'Website',
            leadSource: 'Organic Search',
            referredBy: '',
            sourceDetails: 'Found through Google search',
            preferredLocation: 'Mumbai',
            preferredLocations: ['Mumbai', 'Thane'],
            budget: '1.5-2 Cr',
            budgetMin: 15000000,
            budgetMax: 20000000,
            clientProfile: 'First Time Buyer',
            profileType: 'End User',
            livingPlace: 'Mumbai',
            livingPlaceCity: 'Mumbai',
            livingPlaceState: 'Maharashtra',
            projectOfInterest: 'proj_001',
            interestedUnits: ['1BHK', '2BHK'],
            ownerId: 'user_001',
            ownerName: 'Rohan Kumar',
            assignedDate: new Date().toISOString(),
            lastFollowUpDate: new Date().toISOString(),
            nextFollowUpDate: new Date(Date.now() + 86400000).toISOString(),
            followUpCount: 3,
            tokenAmount: 100000,
            tokenPaidDate: '2024-07-10',
            registrationAmount: 500000,
            totalAmountPaid: 600000,
            messages: [
                { id: 'msg_001', sender: 'user_001', content: 'Hi, interested in 2BHK?', timestamp: new Date().toISOString(), type: 'text' }
            ],
            siteVisits: [
                { visitId: 'visit_001', date: '2024-07-12', status: 'Completed', feedback: 'Very satisfied' }
            ],
            tasks: [
                { taskId: 'task_001', title: 'Follow up call', status: 'Pending', dueDate: new Date(Date.now() + 86400000).toISOString() }
            ],
            documents: [
                { docId: 'doc_001', docType: 'Aadhar', status: 'Uploaded', uploadedDate: '2024-07-10' }
            ],
            propertyImages: [
                { imageId: 'img_001', url: 'https://example.com/prop1.jpg', uploadedDate: '2024-07-10' }
            ],
            notes: 'Very interested, likely to book soon',
            rating: 4.5,
            communicationPreference: 'WhatsApp',
            doNotCall: false,
            doNotEmail: false,
            doNotSMS: false,
            privacyConsentGiven: true,
            consentDate: '2024-07-01',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    }
];

async function initializeToCloud() {
    console.log('\n🔥 Initializing Firebase CLOUD Collections...\n');
    console.log('⚠️  WARNING: This will add data to your LIVE Firebase project!');
    console.log(`📍 Project: gen-lang-client-0873542795`);
    console.log(`📊 Collections: ${FIRESTORE_COLLECTIONS.length}\n`);

    try {
        const batch = writeBatch(fdb);
        let count = 0;

        for (const coll of FIRESTORE_COLLECTIONS) {
            try {
                const colRef = collection(fdb, coll.name);
                const docRef = doc(colRef, coll.sampleData[Object.keys(coll.sampleData)[0]]);
                batch.set(docRef, coll.sampleData);
                count++;
                console.log(`✅ ${coll.name}: Ready to sync`);
            } catch (error) {
                console.error(`❌ ${coll.name}:`, error);
            }
        }

        console.log(`\n📤 Syncing ${count} collections to Firebase Cloud...`);
        await batch.commit();

        console.log('\n✅ SUCCESS! Collections initialized in your Firebase Account!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 Next: Deploy indexes and rules to Firebase');
        console.log('  firebase deploy --only firestore:indexes');
        console.log('  firebase deploy --only firestore:rules');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error: any) {
        console.error('\n❌ Error syncing to Cloud:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check Firebase credentials');
        console.log('2. Verify internet connection');
        console.log('3. Check Firestore Rules allow writes');
        console.log('4. Run: firebase login\n');
        process.exit(1);
    }
}

initializeToCloud();
