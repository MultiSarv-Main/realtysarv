
import { USER_NAME } from "./constants";

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Unqualified' | 'Converted';
export type SiteVisitStatus = 'Visit Scheduled' | 'Completed' | 'Canceled';
export type TaskStatus = 'Pending' | 'Completed' | 'Overdue';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type UserRole = 'Admin' | 'Sales' | 'User';
export type BookingStatus = 'Pending' | 'Booked';
export type AgreementStatus = 'Drafted' | 'Sent for Signature' | 'Registered';
export type PossessionStatus = 'Pending' | 'Scheduled' | 'Handed Over';

// New: Types for interactive lifecycle management
export type LifecycleStage = 'leadStatus' | 'bookingStatus' | 'agreementStatus' | 'possessionStatus';
export type LeadLifecycleStatus = LeadStatus | BookingStatus | AgreementStatus | PossessionStatus;

export interface SiteVisit {
  id: string;
  leadId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  propertyOfInterest: string;
  notes?: string; // Optional
  status: SiteVisitStatus;
}

export interface Task {
  id: string;
  leadId: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string;
}

export interface PropertyImage {
  id: string;
  url: string; // Base64 encoded string or URL
}

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  assignedProjectIds: string[];
  reportsTo?: string | null;
}

export interface Source {
  id: string;
  channelSource: string; // Parent category for the source
  name: string; // Specific source name, e.g., Facebook
  description?: string; // Details about the source
}

export interface CustomerDocument {
  status: 'Pending' | 'Uploaded' | 'Verified' | 'Rejected';
  fileName?: string;
  fileUrl?: string; // For future use
}

// RERA Booking Form Types
export interface Applicant {
  id: string;
  fullName: string;
  relationValue: string; // S/o, W/o, D/o
  dob: string;
  pan: string;
  aadhaar: string;
  presentAddress: string;
  permanentAddress: string;
  isSameAddress: boolean;
  mobile: string;
  email: string;
  occupation: string;
  nationality: string;
  relationshipWithPrimary?: string; // For co-applicants
  customerDocuments: Record<string, CustomerDocument>;
}

export interface PriceBreakup {
  basicSalePrice: number;
  floorPLC: number;
  otherCharges: number;
  societyFormationCharges: number;
  legalCharges: number;
  maintenanceCharges: number;
  corpusFund: number;
  // New: Store custom charges calculations
  customCharges?: Record<string, number>; 
  totalConsideration: number;
  gst: number;
  stampDuty: number;
  registrationCharges: number;
  grandTotal: number;
}

export interface TokenDetails {
  amount: number;
  mode: 'Cheque' | 'NEFT' | 'RTGS' | 'UPI' | 'Other';
  transactionId: string; // Cheque no, transaction ref
  bankName: string;
  transactionDate: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  mode: string;
  transactionId: string;
  bankName?: string;
  notes?: string;
  milestoneName?: string; // Optional: Link payment to a specific milestone
}

export interface Nominee {
  fullName: string;
  relationship: string;
  address: string;
  contact: string;
}

export interface PaymentPlanMilestone {
  id: string;
  name: string;
  percentage: number;
  achievedDate?: string; // YYYY-MM-DD
}

export interface PaymentPlan {
  id: string;
  name: string;
  milestones: PaymentPlanMilestone[];
}

export type CalculationBasis = 'rate' | 'consideration' | 'grandTotal';

export interface DemandRecord {
  milestoneId: string;
  generatedDate: string;
  dueDate: string;
  milestoneDate?: string;
}

export interface BookingDetails {
  primaryApplicant: Applicant;
  coApplicants: Applicant[];
  unitId: string;
  parkingId: string;
  priceBreakup: PriceBreakup;
  paymentPlanId: string;
  tokenDetails: TokenDetails;
  payments?: PaymentRecord[]; // New: Track all payments
  demands?: DemandRecord[]; // New: Track generated demands
  settlementMapping?: Record<string, number>; // New: Track settled amount per cost head
  nominee?: Nominee;
  declarationAccepted: boolean;
}

export interface Lead {
  id: string;
  name: string;
  avatarInitials: string;
  lastMessage: string;
  time: string;
  chatStatus: 'online' | 'offline';
  leadStatus: LeadStatus;
  read: boolean;
  messages: Message[];
  email: string;
  phone: string;
  initialInterest: string[];
  siteVisits: SiteVisit[];
  tasks: Task[];
  channelSource: string;
  leadSource: string; // This is sourceName
  preferredLocation: string;
  budget?: string;
  clientProfile?: string;
  livingPlace?: string;
  propertyImages: PropertyImage[];
  ownerId: string;

  // Lifecycle fields
  leadProject: string;
  leadDate: string; // YYYY-MM-DD
  bookingStatus: BookingStatus;
  agreementStatus: AgreementStatus;
  possessionStatus: PossessionStatus;
  tokenAmount?: number;
  bookingDetails?: BookingDetails;
}

export interface Message {
  id: string;
  content: string;
  time: string;
  sender: 'sent' | 'received';
}

export interface IntegrationOptionType {
  icon: string;
  label: string;
  action: string;
}

export type ActiveLeadTab = 'Follow-up' | 'Active' | 'Inactive';
export type ActiveFollowUpTab = 'All' | 'Due Today' | 'Overdue' | 'Upcoming';

export type AdminPanelSection = 'leads' | 'users' | 'projects' | 'channel-partners' | 'integrations' | 'lead-flow' | 'task-management' | 'reporting' | 'settings';

export interface NewLeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  initialInterest: string[]; // Unit Type
  preferredLocation: string;
  budget: string;
  clientProfile: string;
  livingPlace: string;
  leadStatus: LeadStatus;
  channelSource: string;
  sourceName: string;
  message?: string;
}

export interface NewSiteVisitData {
  date: string;
  time: string;
  propertyOfInterest: string;
  notes?: string;
}

export interface NewTaskData {
  title: string;
  description?: string;
  dueDate: string;
  priority: TaskPriority;
  assignedTo: string;
}

export interface NewFollowUpData {
  type: 'Call' | 'Email' | 'Meeting';
  date: string;
  time: string;
  notes?: string;
  assignedTo: string;
}

export interface NewUserData {
  name: string;
  username: string;
  password?: string;
  confirmPassword?: string;
  email: string;
  phone: string;
  role: UserRole;
  reportsTo?: string | null;
}

export interface NewSourceData {
  channelSource: string;
  name: string;
  description?: string;
}

// Project Management Types
export type InventoryUnitStatus = 'Available' | 'Booked' | 'On Hold' | 'Sold' | 'Not for Sale';

export interface InventoryUnit {
  id: string;
  unitNumber: string;
  wing?: string;
  floor: number;
  type: string;
  area: number; // Represents Saleable Area
  carpetArea?: number;
  price: number;
  status: InventoryUnitStatus;
  calculationBasis?: CalculationBasis;
  bedrooms?: number;
  bathrooms?: number;
}

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  level: string;
  status: InventoryUnitStatus;
  assignedUnitId?: string;
}

export type ProjectType = 'Residential' | 'Commercial' | 'Mixed-Use';
export type ProjectStatus = 'Pre-launch' | 'Under Construction' | 'Ready to Move';

export interface Project {
  id: string;
  name: string;
  companyName: string;
  location: string;
  reraNumber: string;
  projectType: ProjectType;
  projectStatus: ProjectStatus;
  description: string;
  totalFloors: number;
  wings?: string[];
  inventory: InventoryUnit[];
  parkingInventory: ParkingSlot[];
  paymentPlanIds?: string[];
  floorPlanUrl?: string;
}

export interface NewProjectData {
  name: string;
  companyName: string;
  location: string;
  reraNumber: string;
  projectType: ProjectType;
  projectStatus: ProjectStatus;
  description: string;
  totalFloors: number;
  wings?: string[];
}

// Template types
export type TemplateType = 'WhatsApp' | 'Email';

export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  content: string;
}

export interface NewTemplateData {
  name:string;
  type: TemplateType;
  content: string;
}

// Setting Types
export interface Budget {
  id: string;
  name: string;
  description?: string;
}
export interface NewBudgetData {
  name: string;
  description?: string;
}

export interface ClientProfile { // Renamed from RoleSetting
  id: string;
  name: string; // e.g., "IT Professional", "Business Owner"
  description?: string;
}
export interface NewClientProfileData { // Renamed from NewRoleSettingData
  name: string;
  description?: string;
}

export interface UnitType {
  id: string;
  name: string;
  description?: string;
}
export interface NewUnitTypeData {
  name: string;
  description?: string;
}

export interface LocationSetting {
  id: string;
  name: string;
  description?: string;
}
export interface NewLocationSettingData {
  name: string;
  description?: string;
}

export interface LivingPlace {
  id: string;
  name: string;
  description?: string;
}
export interface NewLivingPlaceData {
  name: string;
  description?: string;
}

export interface LeadStatusType { id: string; name: string; description?: string; }
export interface NewLeadStatusTypeData { name: string; description?: string; }

export interface SiteVisitStatusType { id: string; name: string; description?: string; }
export interface NewSiteVisitStatusTypeData { name: string; description?: string; }

export interface TaskPriorityType { id: string; name: string; description?: string; }
export interface NewTaskPriorityTypeData { name: string; description?: string; }

export interface BookingStatusType { id: string; name: string; description?: string; }
export interface NewBookingStatusTypeData { name: string; description?: string; }

export interface AgreementStatusType { id: string; name: string; description?: string; }
export interface NewAgreementStatusTypeData { name: string; description?: string; }

export interface PossessionStatusType { id: string; name: string; description?: string; }
export interface NewPossessionStatusTypeData { name: string; description?: string; }

export interface InventoryStatusType { id: string; name: string; description?: string; }
export interface NewInventoryStatusTypeData { name: string; description?: string; }

export interface ProjectTypeType { id: string; name: string; description?: string; }
export interface NewProjectTypeTypeData { name: string; description?: string; }

export interface ProjectStatusType { id: string; name: string; description?: string; }
export interface NewProjectStatusTypeData { name: string; description?: string; }

// New User & Company Settings
export interface UserRoleSetting {
  id: string;
  name: string; // e.g., "Sales Manager", "Accountant"
  description?: string;
  menuAccess: string[];
}
export interface NewUserRoleSettingData {
  name: string;
  description?: string;
}

export interface UserDesignation {
  id: string;
  name: string; // e.g., "Senior Sales Executive"
  description?: string;
}
export interface NewUserDesignationData {
  name: string;
  description?: string;
}

export interface CompanyProfile {
  name: string;
  address: string;
  phone: string;
  website: string;
  logoUrl?: string; // URL or Base64 string
  setupCompleted?: boolean; // Tracks if the admin wizard is done
}

// New types for conditional financial rules
export type ConditionOperator =
  | 'greater_than_or_equal_to'
  | 'greater_than'
  | 'less_than_or_equal_to'
  | 'less_than'
  | 'between'; // inclusive

export type FinancialRuleType = 'percentage' | 'fixed';

export interface ConditionalFinancialRule {
  id: string;
  operator: ConditionOperator;
  value: number;
  value2?: number; // for 'between' operator
  ruleType: FinancialRuleType;
  percentage?: number;
  fixedAmount?: number;
}

// New types for other dynamic charges
export type OtherChargeBasis = 'fixedAmount' | 'basicSalePrice' | 'totalConsideration' | 'saleableArea';

export interface OtherChargeSetting {
    basis: OtherChargeBasis;
    value: number;
    months?: number; // Only for maintenance
    applyGst: boolean;
    gstPercentage?: number;
}

export interface CustomChargeSetting extends OtherChargeSetting {
    id: string;
    name: string;
    partOfTotalConsideration?: boolean; // New property to toggle if charge is part of TC
}

export interface FinancialSettings {
  gstPercentage: number;
  stampDutyRules: ConditionalFinancialRule[];
  registrationRules: ConditionalFinancialRule[];
  societyFormationCharges: OtherChargeSetting;
  legalCharges: OtherChargeSetting;
  maintenanceCharges: OtherChargeSetting;
  corpusFund: OtherChargeSetting;
  customCharges: CustomChargeSetting[];
}

export interface ApplicationSettings {
  id?: number;
  dateFormat: string;
  timeZone: string;
  currencySymbol: string;
  appUrl?: string;
}

// --- Facebook Integration Types ---

export interface FacebookLeadRaw {
  id: string;
  created_time: string;
  ad_id?: string;
  form_id: string;
  field_data: {
      name: string;
      values: string[];
  }[];
}

export interface FacebookField {
  key: string;
  label: string;
  example: string;
}

export interface FacebookForm {
  id: string;
  name: string;
  status: 'ACTIVE' | 'ARCHIVED';
  leadCount: number;
  mappedProjectId: string | '';
  /* FIX: Added missing mappedUserId property to FacebookForm interface to maintain consistency with frontend types. */
  mappedUserId: string | '';
  isSyncing: boolean;
  fields: FacebookField[];
  fieldMapping: Record<string, string>; // key: fbFieldKey, value: crmFieldKey
  leads?: FacebookLeadRaw[]; // Store raw leads locally
}

export interface FacebookPage {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  forms: FacebookForm[];
}
