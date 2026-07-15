import {
    collection,
    doc,
    setDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    collectionGroup,
    writeBatch
} from 'firebase/firestore';
import { fdb } from './firebase';

/**
 * Initialize Firestore Collections and Sample Data
 * This creates the complete schema structure for RealtySarv
 */

// Type definitions for Firestore documents
interface FirestoreCollection {
    name: string;
    sampleData: Record<string, any>;
}

// Define all collections with their complete sample structures
const FIRESTORE_COLLECTIONS: FirestoreCollection[] = [
    // ========== COMPANIES COLLECTION ==========
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

    // ========== USERS COLLECTION ==========
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

    // ========== PROJECTS COLLECTION ==========
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

    // ========== LEADS COLLECTION ==========
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
    },

    // ========== TASKS COLLECTION ==========
    {
        name: 'tasks',
        sampleData: {
            taskId: 'task_001',
            companyId: 'company_001',
            leadId: 'lead_001',
            taskCode: 'TASK001',
            title: 'Follow up call with Rajesh',
            description: 'Schedule follow up call with lead regarding 2BHK unit interest',
            type: 'Call',
            category: 'Lead Follow-up',
            dueDate: new Date(Date.now() + 86400000).toISOString(),
            startDate: new Date().toISOString(),
            endDate: null,
            priority: 'High',
            status: 'Pending',
            progress: 0,
            assignedTo: 'user_001',
            assignedToName: 'Rohan Kumar',
            createdBy: 'user_001',
            createdByName: 'Rohan Kumar',
            parentTaskId: '',
            subtasks: [],
            relatedLead: 'lead_001',
            relatedProject: 'proj_001',
            relatedBooking: '',
            attachments: [],
            comments: [
                { commentId: 'cmt_001', author: 'user_001', text: 'Need to follow up', timestamp: new Date().toISOString() }
            ],
            reminders: [
                { reminderId: 'rem_001', reminderDate: new Date(Date.now() + 3600000).toISOString(), sent: false }
            ],
            tags: ['urgent', 'follow-up'],
            completedDate: null,
            completedBy: '',
            outcome: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    },

    // ========== SITE VISITS COLLECTION ==========
    {
        name: 'siteVisits',
        sampleData: {
            visitId: 'visit_001',
            companyId: 'company_001',
            leadId: 'lead_001',
            projectId: 'proj_001',
            visitCode: 'VISIT001',
            visitNumber: 1,
            scheduledDate: new Date(Date.now() + 172800000).toISOString(),
            scheduledTime: '14:00',
            actualDate: null,
            actualTime: null,
            completedDate: null,
            status: 'Scheduled',
            type: 'Site Tour',
            venue: 'Project Site - Tower A',
            location: 'Bandra West, Mumbai',
            unitsShown: ['1BHK-101', '2BHK-202'],
            attendees: ['user_001', 'lead_001'],
            attendeeNames: ['Rohan Kumar', 'Rajesh Sharma'],
            notes: 'Initial site visit - Rajesh interested in 2BHK units',
            feedback: '',
            feedbackCategory: '',
            rating: null,
            photos: [
                { photoId: 'ph_001', url: 'https://example.com/visit_photo1.jpg', uploadedDate: '2024-07-12' }
            ],
            videos: [],
            nextSteps: 'Send payment plan details',
            followUpDate: null,
            cancellationReason: '',
            cancellationNotes: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    },

    // ========== BOOKINGS COLLECTION ==========
    {
        name: 'bookings',
        sampleData: {
            bookingId: 'booking_001',
            companyId: 'company_001',
            leadId: 'lead_001',
            bookingCode: 'BK001',
            projectId: 'proj_001',
            projectName: 'Sunset Heights Mumbai',
            wingId: 'wing_001',
            wingName: 'Tower A',
            floorNumber: 5,
            unitId: 'unit_001',
            unitNumber: '501',
            unitType: '2BHK',
            carpetArea: 1250,
            builtUpArea: 1500,
            totalArea: 1750,
            areaUnit: 'sqft',
            facing: 'East',
            status: 'Pending',
            bookingDate: new Date().toISOString(),
            tokenAmount: 100000,
            tokenPaidDate: '2024-07-10',
            tokenReceipt: 'TOKEN001',
            registrationAmount: 500000,
            registrationPaidDate: null,
            totalPrice: 15000000,
            pricePerUnit: 8571,
            paymentSchedule: [
                { milestone: 'Token', amount: 100000, dueDate: '2024-07-10', paidAmount: 100000, status: 'Paid' },
                { milestone: 'Registration', amount: 500000, dueDate: '2024-08-10', paidAmount: 0, status: 'Pending' },
                { milestone: 'Construction', amount: 7200000, dueDate: '2025-01-10', paidAmount: 0, status: 'Pending' }
            ],
            totalPaidAmount: 100000,
            totalPendingAmount: 14900000,
            possessionDate: '2026-12-31',
            agreementId: '',
            agreementStatus: 'Pending',
            agreementDate: null,
            signedDate: null,
            registerationNumber: '',
            registeredDate: null,
            remarks: 'First booking for this lead, very interested',
            documents: [],
            attachments: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    },

    // ========== AGREEMENTS COLLECTION ==========
    {
        name: 'agreements',
        sampleData: {
            agreementId: 'agreement_001',
            companyId: 'company_001',
            bookingId: 'booking_001',
            leadId: 'lead_001',
            agreementCode: 'AGR001',
            projectId: 'proj_001',
            projectName: 'Sunset Heights Mumbai',
            unitNumber: '501',
            unitType: '2BHK',
            totalPrice: 15000000,
            buyerName: 'Rajesh Sharma',
            buyerEmail: 'rajesh.sharma@email.com',
            buyerPhone: '+91-9988776655',
            buyerAadhar: '123456789012',
            buyerPAN: 'ABCDE1234F',
            coByerName: '',
            coByerEmail: '',
            coByerPhone: '',
            buyerAddress: 'Mumbai',
            buyerCity: 'Mumbai',
            buyerState: 'Maharashtra',
            status: 'Drafted',
            draftedDate: new Date().toISOString(),
            draftedBy: 'user_001',
            sentForSignature: false,
            sentDate: null,
            signedDate: null,
            registeredDate: null,
            registrationNumber: '',
            registrationOffice: 'Mumbai Sub-Registrar Office',
            content: '<html><body>Agreement content...</body></html>',
            contentFormat: 'HTML',
            termsAndConditions: [
                { id: 1, title: 'Payment Terms', description: 'Payment as per schedule' },
                { id: 2, title: 'Possession', description: 'Possession on completion' }
            ],
            signatories: [
                { name: 'Rajesh Sharma', email: 'rajesh.sharma@email.com', role: 'Buyer', status: 'Pending', signedDate: null }
            ],
            signatures: [],
            attachments: [
                { docId: 'att_001', docName: 'Floor Plan', url: 'https://example.com/floorplan.pdf', uploadedDate: new Date().toISOString() }
            ],
            remarks: 'Standard agreement for 2BHK purchase',
            validityStartDate: new Date().toISOString(),
            validityEndDate: new Date(Date.now() + 7776000000).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    },

    // ========== LEDGERS COLLECTION ==========
    {
        name: 'ledgers',
        sampleData: {
            ledgerId: 'ledger_001',
            companyId: 'company_001',
            accountName: 'Sales Revenue',
            accountCode: 'AC_001',
            accountNumber: '100001',
            group: 'Income',
            accountType: 'Revenue',
            description: 'Sales revenue from property bookings',
            openingBalance: 5000000,
            openingDate: '2024-01-01',
            currentBalance: 7600000,
            totalDebit: 0,
            totalCredit: 2600000,
            currency: 'INR',
            isSystem: false,
            isActive: true,
            parentAccountCode: '',
            subAccounts: [],
            bank: null,
            bankAccountNumber: '',
            ifscCode: '',
            chequeBookStatus: '',
            monthlyReconciliation: 'Pending',
            reconciliationDate: null,
            lastReconciliation: null,
            reconciliationNotes: '',
            createdBy: 'user_001',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    },

    // ========== VOUCHERS COLLECTION ==========
    {
        name: 'vouchers',
        sampleData: {
            voucherId: 'voucher_001',
            companyId: 'company_001',
            voucherNumber: 'V202407001',
            voucherCode: 'VOI001',
            date: new Date().toISOString(),
            type: 'Receipt',
            narration: 'Token amount received from Rajesh Sharma for 2BHK unit',
            description: 'Receipt of token payment for booking BK001',
            amount: 100000,
            entries: [
                {
                    entryId: 'entry_001',
                    accountId: 'ledger_001',
                    accountName: 'Bank Account',
                    accountCode: 'AC_002',
                    debit: 100000,
                    credit: 0
                },
                {
                    entryId: 'entry_002',
                    accountId: 'ledger_002',
                    accountName: 'Sales Revenue',
                    accountCode: 'AC_001',
                    debit: 0,
                    credit: 100000
                }
            ],
            reference: 'booking_001',
            referenceType: 'Booking',
            projectId: 'proj_001',
            projectName: 'Sunset Heights Mumbai',
            bookingId: 'booking_001',
            leadId: 'lead_001',
            leadName: 'Rajesh Sharma',
            paymentMethod: 'Bank Transfer',
            bankName: 'HDFC Bank',
            transactionId: 'TXN20240710001',
            chequeNumber: '',
            chequeDate: null,
            status: 'Posted',
            draftedDate: new Date().toISOString(),
            postedDate: new Date().toISOString(),
            postedBy: 'user_001',
            cancelledDate: null,
            cancelledBy: '',
            cancellationReason: '',
            attachments: [],
            notes: 'Received via NEFT',
            approvalStatus: 'Approved',
            approvedBy: 'user_001',
            approvalDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    },

    // ========== TEMPLATES COLLECTION ==========
    {
        name: 'templates',
        sampleData: {
            templateId: 'template_001',
            companyId: 'company_001',
            templateCode: 'TPL001',
            name: 'Welcome Template',
            type: 'WhatsApp',
            category: 'Welcome',
            description: 'Welcome message template for new leads',
            content: 'Welcome to {{companyName}}! 🏡 \n\nWe are excited to help you find your dream home.\n\nProject: {{projectName}}\n\nClick here to explore: {{projectLink}}',
            variables: ['companyName', 'projectName', 'projectLink'],
            status: 'Active',
            language: 'en',
            isDefault: true,
            approvalStatus: 'Approved',
            approvedBy: 'user_001',
            approvedDate: new Date().toISOString(),
            usageCount: 45,
            createdBy: 'user_001',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    },

    // ========== CHANNEL PARTNERS COLLECTION ==========
    {
        name: 'channelPartners',
        sampleData: {
            partnerId: 'partner_001',
            companyId: 'company_001',
            partnerCode: 'CP001',
            firmName: 'Premium Associates Real Estate',
            businessType: 'Real Estate Consultant',
            contactPerson: 'Mr. Vikram Singh',
            contactPersonEmail: 'vikram@premiumassociates.com',
            contactPersonPhone: '+91-8765432100',
            alternateContact: 'Ms. Priya Sharma',
            alternateContactPhone: '+91-8765432101',
            email: 'info@premiumassociates.com',
            phone: '+91-8765432100',
            website: 'www.premiumassociates.com',
            address: '456 Business Center, Andheri, Mumbai',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400069',
            country: 'India',
            gstNumber: '27AABCU5678B1Z0',
            panNumber: 'AABCU5678B',
            reraNumber: 'RERA-MH-CP-2020-001',
            reraExpiry: '2026-12-31',
            bankDetails: {
                accountNumber: '9876543210',
                bankName: 'ICICI Bank',
                ifscCode: 'ICIC0000001'
            },
            status: 'Active',
            partnershipDate: '2023-06-01',
            commissionRate: 2.5,
            commissionType: 'Percentage',
            paymentTerms: 'Monthly',
            performanceRating: 4.8,
            totalLeads: 125,
            totalConversions: 42,
            conversionRate: 33.6,
            totalCommissionEarned: 937500,
            totalCommissionPaid: 625000,
            pendingCommission: 312500,
            agreements: [
                { agreementId: 'pa_001', date: '2023-06-01', endDate: '2026-05-31', status: 'Active' }
            ],
            documents: [
                { docId: 'pdoc_001', docType: 'Agreement', uploadedDate: '2023-06-01' }
            ],
            notes: 'Excellent performer, reliable partner',
            remarks: 'Focus on high-value leads',
            onboardingDate: new Date().toISOString(),
            lastActivityDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    },

    // ========== INTEGRATIONS COLLECTION ==========
    {
        name: 'integrations',
        sampleData: {
            integrationId: 'int_001',
            companyId: 'company_001',
            integrationCode: 'INT001',
            type: 'Accounting',
            name: 'Tally Integration',
            description: 'Integration with Tally accounting software',
            vendor: 'Tally Solutions',
            status: 'Inactive',
            isActive: false,
            isConnected: false,
            apiKey: '',
            apiSecret: '',
            webhookUrl: '',
            authMethod: 'API Key',
            lastSyncDate: null,
            lastSyncStatus: '',
            syncFrequency: 'Daily',
            syncTime: '00:00',
            autoSync: false,
            testStatus: 'Not Tested',
            testDate: null,
            errorLog: [],
            configuration: {
                accountPrefix: 'TALLY',
                syncTransactions: true,
                syncInvoices: true,
                syncPayments: true
            },
            credentials: {
                username: '',
                password: '',
                serverUrl: ''
            },
            features: ['Sync Transactions', 'Sync Invoices', 'Sync Payments'],
            supportedModules: ['Accounting', 'Inventory'],
            documentation: 'https://docs.tally.com/api',
            setupBy: 'user_001',
            setupDate: new Date().toISOString(),
            notes: 'Ready to configure',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    },

    // ========== SETTINGS COLLECTION ==========
    {
        name: 'settings',
        sampleData: {
            settingId: 'setting_001',
            companyId: 'company_001',
            settingCode: 'SET001',
            category: 'General',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24H',
            timeZone: 'Asia/Kolkata',
            currencySymbol: '₹',
            currencyCode: 'INR',
            decimalSeparator: '.',
            thousandSeparator: ',',
            language: 'en',
            languages: ['en', 'hi', 'mr'],
            theme: 'Light',
            appUrl: 'https://realtysarv.com',
            apiUrl: 'https://api.realtysarv.com',
            logoUrl: 'https://realtysarv.com/logo.png',
            faviconUrl: 'https://realtysarv.com/favicon.ico',
            companyName: 'RealtyServe Solutions',
            organizationName: 'RealtySarv',
            supportEmail: 'support@realtysarv.com',
            supportPhone: '+91-8765432100',
            adminEmail: 'admin@realtysarv.com',
            privacyPolicyUrl: 'https://realtysarv.com/privacy',
            termsUrl: 'https://realtysarv.com/terms',
            maxUploadSize: 10485760,
            sessionTimeout: 1800,
            passwordExpiryDays: 90,
            enableTwoFactor: false,
            enableAuditLog: true,
            enableBackup: true,
            backupFrequency: 'Daily',
            notificationSettings: {
                emailNotifications: true,
                smsNotifications: true,
                pushNotifications: true,
                whatsappNotifications: true
            },
            paymentSettings: {
                enableOnlinePayment: true,
                paymentGateway: 'Razorpay',
                paymentMethods: ['Card', 'NetBanking', 'UPI', 'Wallet']
            },
            gstSettings: {
                gstEnabled: true,
                gstRate: 18,
                gstApplicableOn: 'Services'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    }
];

/**
 * Initialize all Firestore collections
 */
export const initializeFirestoreCollections = async (): Promise<void> => {
    try {
        console.log('Starting Firestore collection initialization...');

        const batch = writeBatch(fdb);

        for (const coll of FIRESTORE_COLLECTIONS) {
            try {
                const colRef = collection(fdb, coll.name);
                const docRef = doc(colRef);
                batch.set(docRef, coll.sampleData);
                console.log(`✓ Initialized collection: ${coll.name}`);
            } catch (error) {
                console.error(`✗ Error initializing ${coll.name}:`, error);
            }
        }

        await batch.commit();
        console.log('✓ Firestore collections initialization complete!');
    } catch (error) {
        console.error('Error during Firestore initialization:', error);
        throw error;
    }
};

/**
 * Verify Firestore collections exist
 */
export const verifyFirestoreCollections = async (): Promise<void> => {
    try {
        console.log('Verifying Firestore collections...');

        for (const coll of FIRESTORE_COLLECTIONS) {
            const colRef = collection(fdb, coll.name);
            const snapshot = await getDocs(colRef);
            console.log(`✓ Collection '${coll.name}' exists with ${snapshot.size} documents`);
        }

        console.log('✓ All collections verified successfully!');
    } catch (error) {
        console.error('Error verifying Firestore collections:', error);
        throw error;
    }
};

/**
 * Create sample queries for common operations
 */
export const demonstrateCommonQueries = async (): Promise<void> => {
    try {
        console.log('Demonstrating common Firestore queries...');

        // Query 1: Get active leads
        const leadsRef = collection(fdb, 'leads');
        const activeLeadsQuery = query(
            leadsRef,
            where('leadStatus', '==', 'New'),
            orderBy('createdAt', 'desc'),
            limit(10)
        );
        const activeLeads = await getDocs(activeLeadsQuery);
        console.log(`✓ Found ${activeLeads.size} active leads`);

        // Query 2: Get tasks for a user
        const tasksRef = collection(fdb, 'tasks');
        const userTasksQuery = query(
            tasksRef,
            where('assignedTo', '==', 'user_001'),
            where('status', '==', 'Pending'),
            orderBy('dueDate', 'asc')
        );
        const userTasks = await getDocs(userTasksQuery);
        console.log(`✓ Found ${userTasks.size} pending tasks for user`);

        console.log('✓ Common query demonstrations complete!');
    } catch (error) {
        console.error('Error demonstrating queries:', error);
    }
};

// Export for use in components
export default {
    initializeFirestoreCollections,
    verifyFirestoreCollections,
    demonstrateCommonQueries
};
