

import { Lead, Message, IntegrationOptionType, LeadStatus, SiteVisit, Task, User, Source, AdminPanelSection, Project, Budget, ClientProfile, UnitType, LocationSetting, LivingPlace, Template, LeadStatusType, SiteVisitStatusType, TaskPriorityType, BookingStatusType, AgreementStatusType, PossessionStatusType, InventoryStatusType, ProjectTypeType, ProjectStatusType, UserRoleSetting, UserDesignation, CompanyProfile, PaymentPlan, FinancialSettings, ApplicationSettings } from './types';
import { v4 as uuidv4 } from 'uuid';

export const USER_AVATAR_INITIALS: string = 'RP';
export const USER_NAME: string = 'LeadSarv';
export const USER_ROLE: string = 'Admin User';
export const DEFAULT_ASSIGNED_TO: string = USER_NAME; // Default assignee for tasks

export interface AdminPanelSectionConfig {
  id: AdminPanelSection | 'dashboard'; // Added dashboard
  label: string;
  icon: string;
  subItems?: { id: string; label: string; icon: string }[];
}

export const INTEGRATION_OPTIONS: IntegrationOptionType[] = [
  { icon: 'fas fa-user-plus', label: 'New Lead', action: 'new-lead' },
  { icon: 'fas fa-calendar-check', label: 'Site Visit', action: 'site-visit' },
  { icon: 'fas fa-file-contract', label: 'Booking', action: 'booking' },
  { icon: 'fas fa-shield-alt', label: 'Admin', action: 'admin' },
];

// New: Admin Panel Sections for navigation
export const ADMIN_PANEL_SECTIONS: AdminPanelSectionConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
  { id: 'leads', label: 'Lead Management', icon: 'fas fa-users' },
  { id: 'lead-flow', label: 'Lead Flow', icon: 'fas fa-stream' },
  { id: 'task-management', label: 'Task Management', icon: 'fas fa-tasks' },
  { id: 'users', label: 'User Management', icon: 'fas fa-user-circle' },
  { id: 'projects', label: 'Project Management', icon: 'fas fa-building' },
  { id: 'channel-partners', label: 'Channel Partners', icon: 'fas fa-handshake' },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: 'fas fa-puzzle-piece',
    subItems: [
        { id: 'lead-acquisition', label: 'Lead Acquisition', icon: 'fas fa-magnet' },
        { id: 'portals', label: 'Property Portals', icon: 'fas fa-home' },
        { id: 'communication', label: 'Comm. & Telephony', icon: 'fas fa-headset' },
        { id: 'payment-gateways', label: 'Payment Gateways', icon: 'fas fa-credit-card' },
        { id: 'accounting', label: 'Accounting & ERP', icon: 'fas fa-calculator' },
        { id: 'project-management', label: 'Project Management', icon: 'fas fa-tasks' },
        { id: 'storage', label: 'Document Storage', icon: 'fas fa-hdd' },
        { id: 'marketing', label: 'Marketing & Auto.', icon: 'fas fa-bullhorn' },
        { id: 'custom', label: 'Custom Integrations', icon: 'fas fa-code' }, // New Item
        { id: 'email', label: 'Email', icon: 'fas fa-envelope' },
        { id: 'templates', label: 'Templates', icon: 'fas fa-file-alt' },
        { id: 'meta', label: 'Meta (Facebook)', icon: 'fab fa-facebook' },
        { id: 'google', label: 'Google Ads', icon: 'fab fa-google' },
        { id: 'linkedin', label: 'LinkedIn', icon: 'fab fa-linkedin' },
    ]
  },
  { id: 'reporting', label: 'Reporting', icon: 'fas fa-chart-bar' },
  { id: 'settings', label: 'Settings', icon: 'fas fa-cog' },
];

const adminMenus = ADMIN_PANEL_SECTIONS.flatMap(section => {
  const mainLabel = section.label;
  const subLabels = section.subItems ? section.subItems.map(sub => sub.label) : [];
  return [mainLabel, ...subLabels];
});

export const AVAILABLE_MENUS: string[] = [
  ...adminMenus
];

const johnSmithMessages: Message[] = [
  {
    id: 'msg1',
    content: "Hello, I'm interested in the 3BHK apartment you listed. Can you share more details?",
    time: '14:05',
    sender: 'received',
  },
  {
    id: 'msg2',
    content: "Certainly, Mr. Smith. The apartment is 1650 sq.ft. with a beautiful sea view. It includes 3 bedrooms, 2 bathrooms, and a modern kitchen.",
    time: '14:10',
    sender: 'sent',
  },
  {
    id: 'msg3',
    content: "Sounds great! What about amenities?",
    time: '14:12',
    sender: 'received',
  },
  {
    id: 'msg4',
    content: "The project includes swimming pool, gym, children's play area, 24/7 security, and dedicated parking. Would you like to schedule a site visit?",
    time: '14:15',
    sender: 'sent',
  },
  {
    id: 'msg5',
    content: "Yes, please. How about this Friday?",
    time: '14:20',
    sender: 'received',
  },
];

const emmaMillerMessages: Message[] = [
  {
    id: 'msg6',
    content: "Hi, I'm Emma. I saw your listing for the 2BHK flat. Could you send me the brochure?",
    time: '13:30',
    sender: 'received',
  },
  {
    id: 'msg7',
    content: "Hello Emma, sure, I've sent the e-brochure to your email. Let me know if you have any questions!",
    time: '13:35',
    sender: 'sent',
  },
  {
    id: 'msg8',
    content: "Thanks! I'd like to schedule a site visit for this Friday. Is 3 PM available?",
    time: '13:40',
    sender: 'received',
  },
  {
    id: 'msg9',
    content: "Yes, 3 PM on Friday works perfectly. I'll send a calendar invite.",
    time: '13:45',
    sender: 'sent',
  },
];

const robertKingMessages: Message[] = [
  {
    id: 'msg10',
    content: "Good morning, this is Robert. I'm interested in your commercial property listings. Do you have anything suitable for a small office?",
    time: '12:00',
    sender: 'received',
  },
  {
    id: 'msg11',
    content: "Good morning Robert. Yes, we have a few options. What's your preferred location and budget?",
    time: '12:05',
    sender: 'sent',
  },
  {
    id: 'msg12',
    content: "Looking for something near the business district, around 1000 sq.ft. Also, what are the typical payment plans?",
    time: '12:20',
    sender: 'received',
  },
  {
    id: 'msg13',
    content: "For commercial properties, we offer various payment plans including monthly installments and bulk payments. I'll share details shortly.",
    time: '12:30',
    sender: 'sent',
  },
];

const lisaDawsonMessages: Message[] = [
  {
    id: 'msg14',
    content: "Hi, I'm Lisa. I'm ready to proceed with the purchase of the penthouse. What documents do you need from my side?",
    time: 'Yesterday',
    sender: 'received',
  },
  {
    id: 'msg15',
    content: "Hello Lisa, great news! We'll need your ID proof, address proof, and income statements. I'll send you a detailed checklist.",
    time: 'Yesterday',
    sender: 'sent',
  },
  {
    id: 'msg16',
    content: "Understood. I've sent the scanned copies to your email.",
    time: 'Yesterday',
    sender: 'received',
  },
  {
    id: 'msg17',
    content: "Received, thank you! We'll review them and get back to you within the day.",
    time: 'Yesterday',
    sender: 'sent',
  },
];

const paulDavisMessages: Message[] = [
  {
    id: 'msg18',
    content: "Paul here. I'd like to confirm my booking for unit 701. I've transferred the booking amount.",
    time: 'Yesterday',
    sender: 'received',
  },
  {
    id: 'msg19',
    content: "Hi Paul, thank you for confirming! We've received your booking amount and your unit is now secured. Welcome to the LeadSarv family!",
    time: 'Yesterday',
    sender: 'sent',
  },
  {
    id: 'msg20',
    content: "Excellent! When can I expect the sales agreement?",
    time: 'Yesterday',
    sender: 'received',
  },
  {
    id: 'msg21',
    content: "Our team is preparing it now. It should be ready for your review by tomorrow.",
    time: 'Yesterday',
    sender: 'sent',
  },
];

const davidWilsonMessages: Message[] = [
  {
    id: 'msg22',
    content: "Is there any negotiation on the price?",
    time: '2 days ago',
    sender: 'received',
  },
  {
    id: 'msg23',
    content: "The listed price is final, as it's a promotional offer. We do have flexible payment plans, however.",
    time: '2 days ago',
    sender: 'sent',
  },
  {
    id: 'msg24',
    content: "I see. I'm looking for a better deal. I will pass for now.",
    time: '2 days ago',
    sender: 'received',
  },
];

const sarahConnorMessages: Message[] = [
  {
    id: 'msg-sc-1',
    content: "I need a safe place. Are your properties secure?",
    time: '3 days ago',
    sender: 'received',
  },
  {
    id: 'msg-sc-2',
    content: "Absolutely, Ms. Connor. All our properties feature 24/7 security, CCTV surveillance, and secure access systems. Your safety is our top priority.",
    time: '3 days ago',
    sender: 'sent',
  },
];

const kyleReeseMessages: Message[] = [
  {
    id: 'msg-kr-1',
    content: "I'm looking for a property with quick access to industrial areas. What do you have?",
    time: '4 days ago',
    sender: 'received',
  },
  {
    id: 'msg-kr-2',
    content: "Mr. Reese, our Cyberdyne Plaza project is located right in the Tech Park Area with excellent connectivity. Would you like to know more?",
    time: '4 days ago',
    sender: 'sent',
  },
];


// FIX: Export defaultCustomerDocs to be used for initializing new applicants.
export const defaultCustomerDocs = {
  'PAN Card': { status: 'Pending' as const },
  'Aadhaar Card': { status: 'Pending' as const },
  'Address Proof': { status: 'Pending' as const },
  'Passport Size Photo': { status: 'Pending' as const },
  'Bank Statement': { status: 'Pending' as const },
  'ITR / Salary Slip': { status: 'Pending' as const },
};

const placeholderDocUrl = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="595" height="842" viewBox="0 0 595 842"><rect width="595" height="842" fill="#fff"/><text x="50%" y="20%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="#333" font-weight="bold">SAMPLE DOCUMENT</text><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="16" fill="#666">This is a simulated document preview.</text></svg>');

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'john-smith',
    name: 'John Smith',
    avatarInitials: 'JS',
    lastMessage: 'Interested in 3BHK apartment',
    time: '14:20',
    chatStatus: 'online', // Updated to chatStatus
    leadStatus: 'New', // Added leadStatus
    read: true,
    messages: johnSmithMessages,
    email: 'john.smith@example.com',
    phone: '+1-555-0101',
    initialInterest: ["3BHK"],
    siteVisits: [], // Added empty array
    tasks: [
        {
            id: 'task-1',
            leadId: 'john-smith',
            title: 'Follow-up: Call',
            description: 'Scheduled for 11:00 AM. \nNotes: Discuss project amenities.',
            dueDate: new Date().toISOString().split('T')[0], // Today's date
            priority: 'High',
            status: 'Pending',
            assignedTo: USER_NAME,
        }
    ], // Added empty array
    channelSource: 'Digital Marketing',
    leadSource: 'Website', // Added lead source
    preferredLocation: 'Downtown',
    budget: '75L - 1Cr',
    clientProfile: 'IT Professional',
    livingPlace: 'Rented Apartment',
    propertyImages: [], // Initialize empty
    ownerId: 'user-2',
    leadProject: 'The Grand Towers',
    leadDate: '2024-07-15',
    bookingStatus: 'Pending',
    agreementStatus: 'Drafted',
    possessionStatus: 'Pending',
  },
  {
    id: 'emma-miller',
    name: 'Emma Miller',
    avatarInitials: 'EM',
    lastMessage: 'Scheduled site visit for Friday',
    time: '13:45',
    chatStatus: 'offline', // Updated to chatStatus
    leadStatus: 'Contacted', // Added leadStatus
    read: true,
    messages: emmaMillerMessages,
    email: 'emma.miller@example.com',
    phone: '+1-555-0102',
    initialInterest: ["2BHK"],
    siteVisits: [], // Added empty array
    tasks: [], // Added empty array
    channelSource: 'Offline',
    leadSource: 'Referral', // Added lead source
    preferredLocation: 'Suburbs',
    budget: '50L - 75L',
    clientProfile: 'Doctor',
    livingPlace: 'Family Home',
    propertyImages: [], // Initialize empty
    ownerId: 'user-2',
    leadProject: 'Serene Gardens',
    leadDate: '2024-07-14',
    bookingStatus: 'Pending',
    agreementStatus: 'Drafted',
    possessionStatus: 'Pending',
    tokenAmount: 25000,
  },
  {
    id: 'robert-king',
    name: 'Robert King',
    avatarInitials: 'RK',
    lastMessage: 'Asked about payment plans',
    time: '12:30',
    chatStatus: 'offline', // Updated to chatStatus
    leadStatus: 'Qualified', // Added leadStatus
    read: false,
    messages: robertKingMessages,
    email: 'robert.king@example.com',
    phone: '+1-555-0103',
    initialInterest: ["Commercial Property"],
    siteVisits: [], // Added empty array
    tasks: [
        {
            id: 'task-2',
            leadId: 'robert-king',
            title: 'Follow-up: Email',
            description: 'Scheduled for 02:00 PM. \nNotes: Send payment plan details.',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
            priority: 'Medium',
            status: 'Pending',
            assignedTo: USER_NAME,
        }
    ], // Added empty array
    channelSource: 'Digital Marketing',
    leadSource: 'Google Ads', // Updated lead source
    preferredLocation: 'Downtown',
    budget: '1.5Cr+',
    clientProfile: 'Business Owner',
    livingPlace: 'Owned Apartment',
    propertyImages: [], // Initialize empty
    ownerId: 'user-1',
    leadProject: 'The Grand Towers',
    leadDate: '2024-07-12',
    bookingStatus: 'Pending',
    agreementStatus: 'Drafted',
    possessionStatus: 'Pending',
  },
  {
    id: 'lisa-dawson',
    name: 'Lisa Dawson',
    avatarInitials: 'LD',
    lastMessage: 'Sent required documents',
    time: 'Yesterday',
    chatStatus: 'online', // Updated to chatStatus
    leadStatus: 'Converted', // Added leadStatus
    read: true,
    messages: lisaDawsonMessages,
    email: 'lisa.dawson@example.com',
    phone: '+1-555-0104',
    initialInterest: ["Penthouse"],
    siteVisits: [], // Added empty array
    tasks: [], // Added empty array
    channelSource: 'Digital Marketing',
    leadSource: 'Website', // Added lead source
    preferredLocation: 'Waterfront',
    budget: '1.5Cr+',
    clientProfile: 'Business Owner',
    livingPlace: 'Owned Apartment',
    propertyImages: [], // Initialize empty
    ownerId: 'user-2',
    leadProject: 'Serene Gardens',
    leadDate: '2024-06-28',
    bookingStatus: 'Booked',
    agreementStatus: 'Sent for Signature',
    possessionStatus: 'Pending',
    tokenAmount: 100000,
    bookingDetails: {
        primaryApplicant: {
            id: uuidv4(),
            fullName: 'Lisa Dawson',
            relationValue: 'Ms. Dawson',
            dob: '1988-03-10',
            pan: 'GHIJK6789L',
            aadhaar: '9876 5432 1098',
            presentAddress: '101 Sky High Apt, Waterfront, 11111',
            permanentAddress: '101 Sky High Apt, Waterfront, 11111',
            isSameAddress: true,
            mobile: '+1-555-0104',
            email: 'lisa.dawson@example.com',
            occupation: 'Business Owner',
            nationality: 'Indian',
            customerDocuments: {
              'PAN Card': { status: 'Uploaded', fileName: 'lisa_pan.pdf', fileUrl: placeholderDocUrl },
              'Aadhaar Card': { status: 'Verified', fileName: 'lisa_aadhaar.pdf', fileUrl: placeholderDocUrl },
              'Address Proof': { status: 'Rejected', fileName: 'lisa_bill_old.pdf', fileUrl: placeholderDocUrl },
              'Passport Size Photo': { status: 'Pending' },
              'Bank Statement': { status: 'Uploaded', fileName: 'bank_statement_lisa.pdf', fileUrl: placeholderDocUrl},
              'ITR / Salary Slip': { status: 'Pending' },
            },
        },
        coApplicants: [],
        unitId: '', 
        parkingId: '',
        priceBreakup: {
            basicSalePrice: 18000000,
            floorPLC: 500000,
            otherCharges: 500000,
            societyFormationCharges: 0,
            legalCharges: 0,
            maintenanceCharges: 0,
            corpusFund: 0,
            totalConsideration: 19000000,
            gst: 950000,
            stampDuty: 1140000,
            registrationCharges: 190000,
            grandTotal: 21280000,
        },
        paymentPlanId: 'pp-2',
        tokenDetails: {
            amount: 100000,
            mode: 'RTGS',
            transactionId: 'R0987654321',
            bankName: 'Global Finance Bank',
            transactionDate: '2024-06-27',
        },
        declarationAccepted: true,
    }
  },
  {
    id: 'paul-davis',
    name: 'Paul Davis',
    avatarInitials: 'PD',
    lastMessage: 'Confirmed booking amount',
    time: 'Yesterday',
    chatStatus: 'offline', // Updated to chatStatus
    leadStatus: 'Converted', // Added leadStatus
    read: true,
    messages: paulDavisMessages,
    email: 'paul.davis@example.com',
    phone: '+1-555-0105',
    initialInterest: ["3BHK"],
    siteVisits: [], // Added empty array
    tasks: [], // Added empty array
    channelSource: 'Offline',
    leadSource: 'Referral', // Added lead source
    preferredLocation: 'Downtown',
    budget: '75L - 1Cr',
    clientProfile: 'IT Professional',
    livingPlace: 'Rented Apartment',
    propertyImages: [], // Initialize empty
    ownerId: 'user-1',
    leadProject: 'The Grand Towers',
    leadDate: '2024-06-25',
    bookingStatus: 'Booked',
    agreementStatus: 'Registered',
    possessionStatus: 'Scheduled',
    tokenAmount: 51000,
    bookingDetails: {
        primaryApplicant: {
            id: uuidv4(),
            fullName: 'Paul Davis',
            relationValue: 'Mr. Davis',
            dob: '1980-05-20',
            pan: 'ABCDE1234F',
            aadhaar: '1234 5678 9012',
            presentAddress: '456 Oak Avenue, Metropolis, 10001',
            permanentAddress: '456 Oak Avenue, Metropolis, 10001',
            isSameAddress: true,
            mobile: '+1-555-0105',
            email: 'paul.davis@example.com',
            occupation: 'Software Engineer',
            nationality: 'Indian',
            customerDocuments: {
              'PAN Card': { status: 'Verified', fileName: 'paul_pan.pdf', fileUrl: placeholderDocUrl },
              'Aadhaar Card': { status: 'Verified', fileName: 'paul_aadhaar.pdf', fileUrl: placeholderDocUrl },
              'Address Proof': { status: 'Verified', fileName: 'utility_bill.pdf', fileUrl: placeholderDocUrl },
              'Passport Size Photo': { status: 'Uploaded', fileName: 'photo.jpg', fileUrl: placeholderDocUrl },
              'Bank Statement': { status: 'Verified', fileName: 'bank_statement_paul.pdf', fileUrl: placeholderDocUrl},
              'ITR / Salary Slip': { status: 'Verified', fileName: 'paul_payslip.pdf', fileUrl: placeholderDocUrl },
            },
        },
        coApplicants: [],
        unitId: '', // Will be assigned from project inventory
        parkingId: '', // Will be assigned from project inventory
        priceBreakup: {
            basicSalePrice: 7500000,
            floorPLC: 200000,
            otherCharges: 300000,
            societyFormationCharges: 0,
            legalCharges: 0,
            maintenanceCharges: 0,
            corpusFund: 0,
            totalConsideration: 8000000,
            gst: 400000,
            stampDuty: 400000,
            registrationCharges: 80000,
            grandTotal: 8880000,
        },
        paymentPlanId: 'pp-1',
        tokenDetails: {
            amount: 51000,
            mode: 'NEFT',
            transactionId: 'N123456789',
            bankName: 'Metropolis Bank',
            transactionDate: '2024-06-24',
        },
        declarationAccepted: true,
    },
  },
  {
    id: 'david-wilson',
    name: 'David Wilson',
    avatarInitials: 'DW',
    lastMessage: 'Decided to pass for now.',
    time: '2 days ago',
    chatStatus: 'offline', // Updated to chatStatus
    leadStatus: 'Unqualified',
    read: true,
    messages: davidWilsonMessages,
    email: 'david.wilson@example.com',
    phone: '+1-555-0106',
    initialInterest: [],
    siteVisits: [],
    tasks: [],
    channelSource: 'Digital Marketing',
    leadSource: 'Google Ads',
    preferredLocation: 'Suburbs',
    budget: '50L - 75L',
    clientProfile: 'Government Employee',
    livingPlace: 'Family Home',
    propertyImages: [],
    ownerId: 'user-2',
    leadProject: 'Serene Gardens',
    leadDate: '2024-07-20',
    bookingStatus: 'Pending',
    agreementStatus: 'Drafted',
    possessionStatus: 'Pending',
  },
  {
    id: 'sarah-connor',
    name: 'Sarah Connor',
    avatarInitials: 'SC',
    lastMessage: 'Your safety is our top priority.',
    time: '3 days ago',
    chatStatus: 'offline',
    leadStatus: 'Qualified',
    read: true,
    messages: sarahConnorMessages,
    email: 'sarah.c@example.com',
    phone: '+1-555-0120',
    initialInterest: ["3BHK", "Penthouse"],
    siteVisits: [],
    tasks: [],
    channelSource: 'Offline',
    leadSource: 'Walk-in',
    preferredLocation: 'Suburbs',
    budget: '1.5Cr+',
    clientProfile: 'Entrepreneur',
    livingPlace: 'Independent House',
    propertyImages: [],
    ownerId: 'user-2',
    leadProject: 'Serene Gardens',
    leadDate: '2024-07-18',
    bookingStatus: 'Pending',
    agreementStatus: 'Drafted',
    possessionStatus: 'Pending',
  },
  {
    id: 'kyle-reese',
    name: 'Kyle Reese',
    avatarInitials: 'KR',
    lastMessage: 'Would you like to know more?',
    time: '4 days ago',
    chatStatus: 'offline',
    leadStatus: 'Contacted',
    read: false,
    messages: kyleReeseMessages,
    email: 'kyle.r@example.com',
    phone: '+1-555-0121',
    initialInterest: ["Commercial Property"],
    siteVisits: [],
    tasks: [],
    channelSource: 'Digital Marketing',
    leadSource: 'MagicBricks',
    preferredLocation: 'Tech Park Area',
    budget: '1Cr - 1.5Cr',
    clientProfile: 'IT Professional',
    livingPlace: 'Rented Apartment',
    propertyImages: [],
    ownerId: 'user-1',
    leadProject: 'Cyberdyne Plaza',
    leadDate: '2024-07-17',
    bookingStatus: 'Pending',
    agreementStatus: 'Drafted',
    possessionStatus: 'Pending',
  }
];


export const INITIAL_USERS: User[] = [
  { id: 'user-1', name: 'John Doe', username: 'ss', password: 'sss', email: 'john.doe@example.com', phone: '+1-555-0111', role: 'Admin', isActive: true, assignedProjectIds: ['proj-1', 'proj-2'], reportsTo: null },
  { id: 'user-2', name: 'Jane Smith', username: 's1', password: 'sss', email: 'jane.smith@example.com', phone: '+1-555-0112', role: 'Sales', isActive: true, assignedProjectIds: ['proj-1'], reportsTo: 'user-1' },
  { id: 'user-3', name: 'Peter Jones', username: 'peterjones', password: 'password123', email: 'peter.jones@example.com', phone: '+1-555-0113', role: 'User', isActive: false, assignedProjectIds: [], reportsTo: 'user-2' },
  { id: 'user-4', name: 'Michael Scott', username: 'michaelscott', password: 'password123', email: 'michael.s@example.com', phone: '+1-555-0114', role: 'Sales', isActive: true, assignedProjectIds: ['proj-2'], reportsTo: 'user-1' },
  { id: 'user-5', name: 'Dwight Schrute', username: 'dwightschrute', password: 'password123', email: 'dwight.s@example.com', phone: '+1-555-0115', role: 'Sales', isActive: false, assignedProjectIds: ['proj-1', 'proj-2'], reportsTo: 'user-4' },
];

export const INITIAL_SOURCES: Source[] = [
  { id: 'source-1', channelSource: 'Digital Marketing', name: 'Website', description: 'Leads from official company website' },
  { id: 'source-2', channelSource: 'Offline', name: 'Referral', description: 'Leads from client referrals' },
  { id: 'source-3', channelSource: 'Digital Marketing', name: 'Google Ads', description: 'Leads from Google search advertisements' },
  { id: 'source-4', channelSource: 'Digital Marketing', name: 'Facebook', description: 'Leads from social media campaigns on Facebook' },
  { id: 'source-5', channelSource: 'Channel Partners', name: 'Realty Inc.', description: 'Leads sourced via channel partner Realty Inc.'},
  { id: 'source-6', channelSource: 'Digital Marketing', name: 'MagicBricks', description: 'Leads from MagicBricks property portal' },
  { id: 'source-7', channelSource: 'Offline', name: 'Walk-in', description: 'Prospective clients visiting the site office directly' },
];

export const INITIAL_PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'pp-1',
    name: 'Standard CLP (10/15/10/15/25/15/10)',
    milestones: [
      { id: uuidv4(), name: 'On Booking', percentage: 10 },
      { id: uuidv4(), name: 'On Agreement', percentage: 15 },
      { id: uuidv4(), name: 'On Completion of Foundation', percentage: 10 },
      { id: uuidv4(), name: 'On Completion of 5th Floor Slab', percentage: 15 },
      { id: uuidv4(), name: 'On Completion of Terrace', percentage: 25 },
      { id: uuidv4(), name: 'On Application for OC', percentage: 15 },
      { id: uuidv4(), name: 'On Possession', percentage: 10 },
    ],
  },
  {
    id: 'pp-2',
    name: 'Flexi Pay (30/70)',
    milestones: [
      { id: uuidv4(), name: 'On Booking', percentage: 30 },
      { id: uuidv4(), name: 'On Possession', percentage: 70 },
    ],
  },
  {
    id: 'pp-3',
    name: '50/50 Plan',
    milestones: [
      { id: uuidv4(), name: 'On Booking', percentage: 50 },
      { id: uuidv4(), name: 'On Possession', percentage: 50 },
    ],
  },
  {
    id: 'pp-4',
    name: 'Down Payment Plan (20/80)',
    milestones: [
      { id: uuidv4(), name: 'On Booking (Down Payment)', percentage: 20 },
      { id: uuidv4(), name: 'Within 45 days (Bank Loan)', percentage: 80 },
    ],
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'The Grand Towers',
    companyName: 'LeadSarv Real Estate',
    location: 'Downtown Metropolis',
    reraNumber: 'A51800001234',
    projectType: 'Residential',
    projectStatus: 'Under Construction',
    description: 'Luxurious high-rise apartments with a stunning city view and world-class amenities.',
    totalFloors: 20,
    wings: ['A', 'B'],
    inventory: [],
    parkingInventory: [],
    paymentPlanIds: ['pp-1', 'pp-2'],
    floorPlanUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMzAwIiBzdHJva2U9IiM5Y2EzYWYiIGZpbGw9Im5vbmUiPjxyZWN0IHdpZHRoPSIzOTgiIGhlaWdodD0iMjk4IiB4PSIxIiB5PSIxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZT0iIzRiNTU2MyIgZmlsbD0iIzIwMmMzMyIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxMjAiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9Ijg1IiB5PSI3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzljYTNhZiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkJlZHJvb20gMTwvdGV4dD48cmVjdCB4PSIxMCIgeT0iMTQwIiB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iODUiIHk9IjIxNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzljYTNhZiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkxpdmluZyBSb29tPC90ZXh0PjxyZWN0IHg9IjE3MCIgeT0iMTAiIHdpZHRoPSIyMjAiIGhlaWdodD0iMTIwIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIyODAiIHk9Ijc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCI+TWFzdGVyIEJlZHJvb208L3RleHQ+PHJlY3QgeD0iMTcwIiB5PSIxNDAiIHdpZHRoPSIxMTAiIGhlaWdodD0iODAiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjIyNSIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCI+S2l0Y2hlbjwvdGV4dD48cmVjdCB4PSIyOTAiIHk9IjE0MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI4MCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMzQwIiB5PSIxODUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Y2EzYWYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0Ij5CYXRoPC90ZXh0PjxyZWN0IHg9IjE3MCIgeT0iMjMwIiB3aWR0aD0iMjIwIiBoZWlnaHQ9IjYwIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIyODAiIHk9IjI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzljYTNhZiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkJhbGNvbnk8L3RleHQ+PC9zdmc+',
  },
  {
    id: 'proj-2',
    name: 'Serene Gardens',
    companyName: 'LeadSarv Real Estate',
    location: 'Green Valley Suburbs',
    reraNumber: 'P51700005678',
    projectType: 'Residential',
    projectStatus: 'Ready to Move',
    description: 'Peaceful garden apartments perfect for families, featuring lush green landscapes and modern facilities.',
    totalFloors: 10,
    inventory: [],
    parkingInventory: [],
    paymentPlanIds: ['pp-2'],
  },
  {
    id: 'proj-3',
    name: 'Cyberdyne Plaza',
    companyName: 'LeadSarv Real Estate',
    location: 'Tech Park Area',
    reraNumber: 'C51800009999',
    projectType: 'Commercial',
    projectStatus: 'Pre-launch',
    description: 'State-of-the-art commercial spaces for modern businesses.',
    totalFloors: 15,
    inventory: [],
    parkingInventory: [],
    paymentPlanIds: ['pp-4'],
  },
  {
    id: 'proj-4',
    name: 'Skynet Towers',
    companyName: 'LeadSarv Real Estate',
    location: 'Downtown Metropolis',
    reraNumber: 'A51800008888',
    projectType: 'Mixed-Use',
    projectStatus: 'Under Construction',
    description: 'A mix of premium residential and commercial units.',
    totalFloors: 40,
    inventory: [],
    parkingInventory: [],
    paymentPlanIds: ['pp-1', 'pp-3'],
  },
];

// New: Initial data for new settings
export const INITIAL_BUDGETS: Budget[] = [
  { id: 'b1', name: '50L - 75L', description: 'Mid-range budget' },
  { id: 'b2', name: '75L - 1Cr', description: 'Upper mid-range' },
  { id: 'b3', name: '1Cr - 1.5Cr', description: 'Premium budget' },
  { id: 'b4', name: '1.5Cr+', description: 'Luxury segment' },
  { id: 'b5', name: '2Cr - 3Cr', description: 'High-end segment' },
  { id: 'b6', name: '3Cr+', description: 'Ultra-luxury segment' },
];

export const INITIAL_CLIENT_PROFILES: ClientProfile[] = [ // Renamed from INITIAL_ROLE_SETTINGS
  { id: 'rs1', name: 'IT Professional', description: 'Works in the technology sector' },
  { id: 'rs2', name: 'Business Owner', description: 'Self-employed or owns a company' },
  { id: 'rs3', name: 'Doctor', description: 'Medical professional' },
  { id: 'rs4', name: 'Government Employee', description: 'Works in the public sector' },
  { id: 'rs5', name: 'Lawyer', description: 'Legal professional' },
  { id: 'rs6', name: 'Entrepreneur', description: 'Founder or co-founder of a startup/company' },
];

export const INITIAL_UNIT_TYPES: UnitType[] = [
  { id: 'ut1', name: '1BHK', description: 'One Bedroom, Hall, Kitchen' },
  { id: 'ut2', name: '2BHK', description: 'Two Bedrooms, Hall, Kitchen' },
  { id: 'ut3', name: '3BHK', description: 'Three Bedrooms, Hall, Kitchen' },
  { id: 'ut4', name: 'Penthouse', description: 'Luxury unit on the top floor' },
  { id: 'ut5', name: 'Villa', description: 'Independent house unit' },
  { id: 'ut6', name: 'Commercial Property', description: 'Office or retail space' },
  { id: 'ut7', name: 'Studio Apartment', description: 'Single room unit with kitchen and bathroom' },
  { id: 'ut8', name: 'Duplex', description: 'An apartment with two floors' },
];

export const INITIAL_LOCATION_SETTINGS: LocationSetting[] = [
  { id: 'ls1', name: 'Downtown', description: 'City center / business district' },
  { id: 'ls2', name: 'Suburbs', description: 'Residential areas outside the city center' },
  { id: 'ls3', name: 'Waterfront', description: 'Properties with a view of a body of water' },
  { id: 'ls4', name: 'Gated Community', description: 'Secure, enclosed residential area' },
  { id: 'ls5', name: 'Tech Park Area', description: 'Areas close to major IT and business parks' },
  { id: 'ls6', name: 'Airport Proximity', description: 'Locations with easy access to the airport' },
];

export const INITIAL_LIVING_PLACES: LivingPlace[] = [
  { id: 'lp1', name: 'Rented Apartment', description: 'Currently living in a rented flat' },
  { id: 'lp2', name: 'Owned Apartment', description: 'Currently owns an apartment' },
  { id: 'lp3', name: 'Family Home', description: 'Living with family' },
  { id: 'lp4', name: 'Independent House', description: 'Living in an owned/rented house' },
  { id: 'lp5', name: 'Company Quarters', description: 'Accommodation provided by an employer' },
  { id: 'lp6', name: 'Paying Guest', description: 'Renting a part of a house' },
];

// New: Initial data for templates
export const INITIAL_TEMPLATES: Template[] = [
  { id: 'tpl-wa-1', name: 'Welcome Message', type: 'WhatsApp', content: 'Hi {{lead_name}}! Thanks for your interest in {{project_name}}. How can I help you today?' },
  { id: 'tpl-wa-2', name: 'Site Visit Confirmation', type: 'WhatsApp', content: 'This is to confirm your site visit for {{project_name}} on {{visit_date}} at {{visit_time}}. We look forward to seeing you!' },
  { id: 'tpl-em-1', name: 'Brochure Email', type: 'Email', content: 'Dear {{lead_name}},\n\nPlease find the attached e-brochure for our project, {{project_name}}. Feel free to reach out with any questions.\n\nBest Regards,\n{{user_name}}' },
  { id: 'tpl-wa-3', name: 'Document Reminder', type: 'WhatsApp', content: 'Hi {{lead_name}}, this is a friendly reminder to please submit the pending documents for your booking at {{project_name}}.' },
  { id: 'tpl-em-2', name: 'Project Update', type: 'Email', content: 'Dear {{lead_name}},\n\nWe are excited to share a new construction update for {{project_name}}. Please see the attached photos for the latest progress.\n\nBest Regards,\n{{user_name}}' },
];

// New: Initial data for new settings
export const INITIAL_LEAD_STATUS_TYPES: LeadStatusType[] = [
  { id: 'lst-1', name: 'New', description: 'A fresh lead that requires initial contact.' },
  { id: 'lst-2', name: 'Contacted', description: 'Contact has been made with the lead.' },
  { id: 'lst-3', name: 'Qualified', description: 'The lead has been vetted and shows potential.' },
  { id: 'lst-4', name: 'Converted', description: 'The lead has completed a sale.' },
  { id: 'lst-5', name: 'Unqualified', description: 'The lead is not a good fit.' },
  { id: 'lst-6', name: 'Follow-up', description: 'Lead requires a follow-up action.' },
  { id: 'lst-7', name: 'Site Visit Scheduled', description: 'A site visit has been booked for the lead.' },
];

export const INITIAL_SITE_VISIT_STATUS_TYPES: SiteVisitStatusType[] = [
  { id: 'svst-1', name: 'Visit Scheduled', description: 'A site visit has been booked.' },
  { id: 'svst-2', name: 'Completed', description: 'The lead has completed the site visit.' },
  { id: 'svst-3', name: 'Canceled', description: 'The site visit was canceled.' },
  { id: 'svst-4', name: 'Rescheduled', description: 'The site visit was rescheduled.' },
  { id: 'svst-5', name: 'No Show', description: 'The lead did not show up for the scheduled visit.' },
];

export const INITIAL_TASK_PRIORITY_TYPES: TaskPriorityType[] = [
  { id: 'tpt-1', name: 'Low', description: 'Non-urgent tasks.' },
  { id: 'tpt-2', name: 'Medium', description: 'Standard priority tasks.' },
  { id: 'tpt-3', name: 'High', description: 'Urgent and important tasks.' },
  { id: 'tpt-4', name: 'Critical', description: 'Extremely urgent tasks that need immediate attention.' },
  { id: 'tpt-5', name: 'Informational', description: 'Tasks for information purposes, no action needed.' },
];

export const INITIAL_BOOKING_STATUS_TYPES: BookingStatusType[] = [
  { id: 'bst-1', name: 'Pending', description: 'Booking is not yet confirmed.' },
  { id: 'bst-2', name: 'Booked', description: 'The unit has been officially booked.' },
  { id: 'bst-3', name: 'Token Received', description: 'A token amount has been received, booking not yet confirmed.' },
  { id: 'bst-4', name: 'Cancelled', description: 'The booking was cancelled.' },
];

export const INITIAL_AGREEMENT_STATUS_TYPES: AgreementStatusType[] = [
  { id: 'ast-1', name: 'Drafted', description: 'The agreement is being prepared.' },
  { id: 'ast-2', name: 'Sent for Signature', description: 'Agreement sent to the client.' },
  { id: 'ast-3', name: 'Registered', description: 'The agreement is legally registered.' },
  { id: 'ast-4', name: 'Pending Client Signature', description: 'Agreement is with the client for their signature.' },
  { id: 'ast-5', name: 'Pending Registration', description: 'Agreement is signed and pending legal registration.' },
];

export const INITIAL_POSSESSION_STATUS_TYPES: PossessionStatusType[] = [
  { id: 'pst-1', name: 'Pending', description: 'Possession is yet to be scheduled.' },
  { id: 'pst-2', name: 'Scheduled', description: 'A date for handover has been fixed.' },
  { id: 'pst-3', name: 'Handed Over', description: 'The client has taken possession of the property.' },
  { id: 'pst-4', name: 'Delayed', description: 'The possession has been delayed.' },
  { id: 'pst-5', name: 'Fit-out Period', description: 'Client is doing interior work before moving in.' },
];

export const INITIAL_INVENTORY_STATUS_TYPES: InventoryStatusType[] = [
  { id: 'ist-1', name: 'Available', description: 'The unit is open for sale.' },
  { id: 'ist-2', name: 'Booked', description: 'The unit has been sold and booked.' },
  { id: 'ist-3', name: 'On Hold', description: 'The unit is temporarily reserved.' },
  { id: 'ist-4', name: 'Sold', description: 'The unit has been fully sold and registered.' },
  { id: 'ist-5', name: 'Not for Sale', description: 'The unit is not available for sale.' },
];

export const INITIAL_PROJECT_TYPE_TYPES: ProjectTypeType[] = [
    { id: 'pt-1', name: 'Residential', description: 'Properties for living purposes.' },
    { id: 'pt-2', name: 'Commercial', description: 'Properties for business purposes.' },
    { id: 'pt-3', name: 'Mixed-Use', description: 'Properties with both residential and commercial spaces.' },
    { id: 'pt-4', name: 'Plotted Development', description: 'Selling of land plots.' },
    { id: 'pt-5', name: 'Industrial', description: 'Properties for industrial use like warehouses.' },
];

export const INITIAL_PROJECT_STATUS_TYPES: ProjectStatusType[] = [
    { id: 'ps-1', name: 'Pre-launch', description: 'The project is announced but not yet open for booking.' },
    { id: 'ps-2', name: 'Under Construction', description: 'The project is currently being built.' },
    { id: 'ps-3', name: 'Ready to Move', description: 'The project is complete and ready for occupancy.' },
    { id: 'ps-4', name: 'On Hold', description: 'The project construction or sales are temporarily paused.' },
    { id: 'ps-5', name: 'Sold Out', description: 'All units in the project have been sold.' },
];

// New: User & Company settings data
export const INITIAL_USER_ROLE_SETTINGS: UserRoleSetting[] = [
  { id: 'urs-1', name: 'Sales Manager', description: 'Manages sales team and high-value leads', menuAccess: [] },
  { id: 'urs-2', name: 'Sales Executive', description: 'Handles day-to-day lead interactions', menuAccess: [] },
  { id: 'urs-3', name: 'Accountant', description: 'Manages bookings and payment records', menuAccess: [] },
  { id: 'urs-4', name: 'Marketing Team', description: 'Manages marketing campaigns and lead generation', menuAccess: [] },
  { id: 'urs-5', name: 'Support Staff', description: 'Handles customer support and queries', menuAccess: [] },
];

export const INITIAL_USER_DESIGNATIONS: UserDesignation[] = [
  { id: 'ud-1', name: 'Senior Sales Executive', description: '' },
  { id: 'ud-2', name: 'Junior Sales Executive', description: '' },
  { id: 'ud-3', name: 'Telecaller', description: '' },
  { id: 'ud-4', name: 'General Manager', description: '' },
  { id: 'ud-5', name: 'Front Desk Executive', description: '' },
];

export const INITIAL_COMPANY_PROFILE: CompanyProfile = {
    name: "LeadSarv Real Estate",
    address: "123 Business Avenue, Metropolis, 10001",
    phone: "+1-800-555-LEAD",
    website: "www.leadsarv.com",
    setupCompleted: false,
};

export const INITIAL_FINANCIAL_SETTINGS: FinancialSettings = {
    gstPercentage: 5,
    stampDutyRules: [
        { id: uuidv4(), operator: 'less_than', value: 5000000, ruleType: 'percentage', percentage: 4 },
        { id: uuidv4(), operator: 'between', value: 5000000, value2: 10000000, ruleType: 'percentage', percentage: 5 },
        { id: uuidv4(), operator: 'greater_than', value: 10000000, ruleType: 'percentage', percentage: 6 },
    ],
    registrationRules: [
        { id: uuidv4(), operator: 'less_than_or_equal_to', value: 4500000, ruleType: 'fixed', fixedAmount: 30000 },
        { id: uuidv4(), operator: 'greater_than', value: 4500000, ruleType: 'percentage', percentage: 1 },
    ],
    societyFormationCharges: { basis: 'fixedAmount', value: 25000, applyGst: false },
    legalCharges: { basis: 'fixedAmount', value: 25000, applyGst: false },
    maintenanceCharges: { basis: 'saleableArea', value: 2, months: 24, applyGst: false },
    corpusFund: { basis: 'saleableArea', value: 50, applyGst: false },
    customCharges: [],
};

export const INITIAL_APPLICATION_SETTINGS: ApplicationSettings = {
    dateFormat: 'DD/MM/YYYY',
    timeZone: 'UTC',
    currencySymbol: '₹',
    appUrl: '',
};