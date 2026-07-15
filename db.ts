
import { Dexie, type Table } from 'dexie';
import { 
  Lead, User, Project, Source, Template, PaymentPlan, Budget, ClientProfile, UnitType, 
  LocationSetting, LivingPlace, LeadStatusType, SiteVisitStatusType, TaskPriorityType, 
  BookingStatusType, AgreementStatusType, PossessionStatusType, InventoryStatusType, 
  ProjectTypeType, ProjectStatusType, UserRoleSetting, UserDesignation, CompanyProfile, 
  FinancialSettings, ApplicationSettings, ChannelPartner, FormFieldConfig, Vendor, 
  PurchaseOrder, WorkOrder, StockItem, DailyProgressReport, MaterialMaster, ServiceMaster,
  ProjectPhase, CostBudget, BOQ, BOQItem, PurchaseRequisition, ApprovalRule, AuditTrail,
  CostHeadMasterItem, LedgerAccount, Voucher, GstEntry
} from './types';
import { 
  INITIAL_LEADS, INITIAL_USERS, INITIAL_PROJECTS, INITIAL_SOURCES, INITIAL_TEMPLATES, 
  INITIAL_PAYMENT_PLANS, INITIAL_BUDGETS, INITIAL_CLIENT_PROFILES, INITIAL_UNIT_TYPES, 
  INITIAL_LOCATION_SETTINGS, INITIAL_LIVING_PLACES, INITIAL_LEAD_STATUS_TYPES, 
  INITIAL_SITE_VISIT_STATUS_TYPES, INITIAL_TASK_PRIORITY_TYPES, INITIAL_BOOKING_STATUS_TYPES, 
  INITIAL_AGREEMENT_STATUS_TYPES, INITIAL_POSSESSION_STATUS_TYPES, INITIAL_INVENTORY_STATUS_TYPES, 
  INITIAL_PROJECT_TYPE_TYPES, INITIAL_PROJECT_STATUS_TYPES, INITIAL_USER_ROLE_SETTINGS, 
  INITIAL_USER_DESIGNATIONS, INITIAL_COMPANY_PROFILE, INITIAL_FINANCIAL_SETTINGS, 
  INITIAL_APPLICATION_SETTINGS, INITIAL_CHANNEL_PARTNERS, INITIAL_FORM_FIELD_CONFIGS 
} from './constants';

export class RealtySarvDB extends Dexie {
    leads!: Table<Lead>;
    users!: Table<User>;
    projects!: Table<Project>;
    sources!: Table<Source>;
    templates!: Table<Template>;
    paymentPlans!: Table<PaymentPlan>;
    budgets!: Table<Budget>;
    clientProfiles!: Table<ClientProfile>;
    unitTypes!: Table<UnitType>;
    locationSettings!: Table<LocationSetting>;
    livingPlaces!: Table<LivingPlace>;
    leadStatusTypes!: Table<LeadStatusType>;
    siteVisitStatusTypes!: Table<SiteVisitStatusType>;
    taskPriorityTypes!: Table<TaskPriorityType>;
    bookingStatusTypes!: Table<BookingStatusType>;
    agreementStatusTypes!: Table<AgreementStatusType>;
    possessionStatusTypes!: Table<PossessionStatusType>;
    inventoryStatusTypes!: Table<InventoryStatusType>;
    projectTypeTypes!: Table<ProjectTypeType>;
    projectStatusTypes!: Table<ProjectStatusType>;
    userRoleSettings!: Table<UserRoleSetting>;
    userDesignations!: Table<UserDesignation>;
    channelPartners!: Table<ChannelPartner>;
    companyProfile!: Table<CompanyProfile, string>;
    financialSettings!: Table<FinancialSettings, number>;
    applicationSettings!: Table<ApplicationSettings, number>;
    formFieldConfigs!: Table<FormFieldConfig>;
    vendors!: Table<Vendor>;
    purchaseRequisitions!: Table<PurchaseRequisition>;
    purchaseOrders!: Table<PurchaseOrder>;
    workOrders!: Table<WorkOrder>;
    materialStock!: Table<StockItem>;
    dailyProgressReports!: Table<DailyProgressReport>;
    materialMaster!: Table<MaterialMaster>;
    serviceMaster!: Table<ServiceMaster>;
    projectPhases!: Table<ProjectPhase>;
    costBudgets!: Table<CostBudget>;
    boqs!: Table<BOQ>;
    boqItems!: Table<BOQItem>;
    approvalRules!: Table<ApprovalRule>;
    auditTrails!: Table<AuditTrail>;
    costHeadMaster!: Table<CostHeadMasterItem>;
    
    // FinanceSarv tables
    ledgerAccounts!: Table<LedgerAccount>;
    vouchers!: Table<Voucher>;
    gstEntries!: Table<GstEntry>;

    constructor() {
        super('RealtySarvDB');
        (this as any).version(14).stores({
            leads: 'id, name, leadStatus, leadProject, ownerId, leadDate',
            users: 'id, username, role',
            projects: 'id, name, projectStatus',
            sources: 'id, channelSource, name',
            templates: 'id, name, type',
            paymentPlans: 'id, name',
            budgets: 'id, name',
            clientProfiles: 'id, name',
            unitTypes: 'id, name',
            locationSettings: 'id, name',
            livingPlaces: 'id, name',
            leadStatusTypes: 'id, name',
            siteVisitStatusTypes: 'id, name',
            taskPriorityTypes: 'id, name',
            bookingStatusTypes: 'id, name',
            agreementStatusTypes: 'id, name',
            possessionStatusTypes: 'id, name',
            inventoryStatusTypes: 'id, name',
            projectTypeTypes: 'id, name',
            projectStatusTypes: 'id, name',
            userRoleSettings: 'id, name',
            userDesignations: 'id, name',
            channelPartners: 'id, firmName, status',
            companyProfile: 'name',
            financialSettings: '++id',
            applicationSettings: '++id',
            formFieldConfigs: 'id, module, fieldName',
            vendors: 'id, firmName, vendorType, isActive',
            purchaseRequisitions: 'id, prNumber, projectId, requesterId, status',
            purchaseOrders: 'id, poNumber, vendorId, projectId, status, prId',
            workOrders: 'id, woNumber, vendorId, projectId, status',
            materialStock: 'id, materialName, category',
            dailyProgressReports: 'id, date, projectId, status',
            materialMaster: 'id, itemCode, name, category',
            serviceMaster: 'id, serviceCode, name, category',
            projectPhases: 'id, projectId, status',
            costBudgets: 'id, projectId, phaseId, costHead',
            boqs: 'id, projectId, status, version',
            boqItems: 'id, boqId, masterId, towerId',
            approvalRules: 'id, module, minAmount',
            auditTrails: 'id, userId, module, entityId, timestamp',
            costHeadMaster: 'id, name, category',
            ledgerAccounts: 'id, name, code, group',
            vouchers: 'id, voucherNumber, date, type, status, projectId',
            gstEntries: 'id, date, type, gstin'
        });
    }
}

export const db = new RealtySarvDB();

(db as any).on('populate', () => {
    db.users.bulkAdd(INITIAL_USERS);
    db.leads.bulkAdd(INITIAL_LEADS);
    db.projects.bulkAdd(INITIAL_PROJECTS);
    db.sources.bulkAdd(INITIAL_SOURCES);
    db.templates.bulkAdd(INITIAL_TEMPLATES);
    db.paymentPlans.bulkAdd(INITIAL_PAYMENT_PLANS);
    db.budgets.bulkAdd(INITIAL_BUDGETS);
    db.clientProfiles.bulkAdd(INITIAL_CLIENT_PROFILES);
    db.unitTypes.bulkAdd(INITIAL_UNIT_TYPES);
    db.locationSettings.bulkAdd(INITIAL_LOCATION_SETTINGS);
    db.livingPlaces.bulkAdd(INITIAL_LIVING_PLACES);
    db.leadStatusTypes.bulkAdd(INITIAL_LEAD_STATUS_TYPES);
    db.siteVisitStatusTypes.bulkAdd(INITIAL_SITE_VISIT_STATUS_TYPES);
    db.taskPriorityTypes.bulkAdd(INITIAL_TASK_PRIORITY_TYPES);
    db.bookingStatusTypes.bulkAdd(INITIAL_BOOKING_STATUS_TYPES);
    db.agreementStatusTypes.bulkAdd(INITIAL_AGREEMENT_STATUS_TYPES);
    db.possessionStatusTypes.bulkAdd(INITIAL_POSSESSION_STATUS_TYPES);
    db.inventoryStatusTypes.bulkAdd(INITIAL_INVENTORY_STATUS_TYPES);
    db.projectTypeTypes.bulkAdd(INITIAL_PROJECT_TYPE_TYPES);
    db.projectStatusTypes.bulkAdd(INITIAL_PROJECT_STATUS_TYPES);
    db.userRoleSettings.bulkAdd(INITIAL_USER_ROLE_SETTINGS);
    db.userDesignations.bulkAdd(INITIAL_USER_DESIGNATIONS);
    db.channelPartners.bulkAdd(INITIAL_CHANNEL_PARTNERS);
    db.companyProfile.add(INITIAL_COMPANY_PROFILE);
    db.financialSettings.add(INITIAL_FINANCIAL_SETTINGS);
    db.applicationSettings.add(INITIAL_APPLICATION_SETTINGS);
    db.formFieldConfigs.bulkAdd(INITIAL_FORM_FIELD_CONFIGS);
    
    // Finance Master Data
    db.ledgerAccounts.bulkAdd([
        { id: 'l1', name: 'HDFC Bank - 0012', code: 'BANK001', group: 'Assets', openingBalance: 5000000, currentBalance: 5000000, isSystem: true },
        { id: 'l2', name: 'GST Input Credit', code: 'GST001', group: 'Assets', openingBalance: 0, currentBalance: 0, isSystem: true },
        { id: 'l3', name: 'GST Output Payable', code: 'GST002', group: 'Liabilities', openingBalance: 0, currentBalance: 0, isSystem: true },
        { id: 'l4', name: 'Accounts Payable', code: 'AP001', group: 'Liabilities', openingBalance: 0, currentBalance: 0, isSystem: true },
        { id: 'l5', name: 'Advance from Customers', code: 'AR001', group: 'Liabilities', openingBalance: 0, currentBalance: 0, isSystem: true },
        { id: 'l6', name: 'Project Revenue', code: 'REV001', group: 'Income', openingBalance: 0, currentBalance: 0, isSystem: true },
        { id: 'l7', name: 'Material Procurement', code: 'EXP001', group: 'Expenses', openingBalance: 0, currentBalance: 0, isSystem: true },
    ]);

    db.materialMaster.bulkAdd([
        { id: 'm1', itemCode: 'MAT-0001', name: 'Cement (OPC 53)', category: 'Cement', uom: 'Bag', hsnCode: '2523', gstPercent: 28, standardWastage: 2, qualityGrade: 'IS 12269', isActive: true },
        { id: 'm2', itemCode: 'MAT-0002', name: 'Steel (TMT 12mm)', category: 'Steel', uom: 'MT', hsnCode: '7214', gstPercent: 18, standardWastage: 5, qualityGrade: 'Fe 500D', isActive: true },
    ]);

    db.serviceMaster.bulkAdd([
        { id: 's1', serviceCode: 'SRV-0001', name: 'Excavation - Hard Rock', category: 'Excavation', uom: 'Cum', sacCode: '9954', gstPercent: 18, isActive: true },
    ]);

    db.materialStock.bulkAdd([
        { id: 'ms1', materialName: 'Cement (OPC)', unit: 'Bags', category: 'Raw Materials', currentStock: 450, minThreshold: 100, lastPurchasePrice: 380 },
        { id: 'ms2', materialName: 'Steel Reinforcement 12mm', unit: 'MT', category: 'Raw Materials', currentStock: 12, minThreshold: 5, lastPurchasePrice: 62000 },
    ]);

    db.approvalRules.bulkAdd([
        { id: 'rule-1', module: 'PR', minAmount: 0, maxAmount: 50000, workflowSteps: ['Project Mgr'] },
        { id: 'rule-2', module: 'PR', minAmount: 50001, maxAmount: 500000, workflowSteps: ['Project Mgr', 'Accounts'] },
        { id: 'rule-3', module: 'PR', minAmount: 500001, maxAmount: 100000000, workflowSteps: ['Project Mgr', 'Accounts', 'Director'] },
    ]);

    db.costHeadMaster.bulkAdd([
        { id: 'ch1', name: 'Land & Legal Cost', category: 'Direct', description: 'Land acquisition, registry and lawyer fees.', isActive: true },
        { id: 'ch2', name: 'Approval & Liaison', category: 'Direct', description: 'Government approvals, RERA, and architect fees.', isActive: true },
        { id: 'ch3', name: 'Civil: Foundation', category: 'Construction', description: 'Excavation, piling and sub-structure.', isActive: true },
        { id: 'ch4', name: 'Civil: RCC Structure', category: 'Construction', description: 'Slab casting, columns and structural steel.', isActive: true },
        { id: 'ch9', name: 'Marketing & Sales', category: 'Indirect', description: 'Advertisements, events and sales commissions.', isActive: true },
    ]);
});
