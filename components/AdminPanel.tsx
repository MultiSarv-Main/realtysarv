
import React from 'react';
import { AdminPanelSection, Lead, User, NewUserData, NewSourceData, Project, NewProjectData, Source, Budget, NewBudgetData, ClientProfile, NewClientProfileData, UnitType, NewUnitTypeData, LocationSetting, NewLocationSettingData, LivingPlace, NewLivingPlaceData, Template, NewTemplateData, LeadStatusType, SiteVisitStatusType, TaskPriorityType, BookingStatusType, AgreementStatusType, PossessionStatusType, InventoryStatusType, ProjectTypeType, ProjectStatusType, NewLeadStatusTypeData, NewSiteVisitStatusTypeData, NewTaskPriorityTypeData, NewBookingStatusTypeData, NewAgreementStatusTypeData, NewPossessionStatusTypeData, NewInventoryStatusTypeData, NewProjectTypeTypeData, NewProjectStatusTypeData, UserRoleSetting, NewUserRoleSettingData, UserDesignation, NewUserDesignationData, CompanyProfile, PaymentPlan, FinancialSettings, FormFieldConfig, ChannelPartner, NewChannelPartnerData } from '../types';
import { ADMIN_PANEL_SECTIONS } from '../constants';
import AdminSidebar from './admin/AdminSidebar';
import AdminLeadManagement from './admin/AdminLeadManagement';
import AdminUserManagement from './admin/AdminUserManagement';
import AdminSourceManagement from './admin/AdminSourceManagement';
import AdminProjectManagement from './admin/AdminProjectManagement';
import AdminGenericSettingManagement from './admin/AdminGenericSettingManagement';
import AdminConnectSarv from './admin/AdminConnectSarv';
import AdminTemplateManagement from './admin/AdminTemplateManagement';
import AdminLeadFlow from './admin/AdminLeadFlow';
import AdminTaskManagement from './admin/AdminTaskManagement';
import AdminCompanyProfile from './admin/AdminCompanyProfile';
import AdminBilling from './admin/AdminBilling';
import AdminReporting from './admin/AdminReporting';
import AdminPaymentPlanManagement from './admin/AdminPaymentPlanManagement';
import AdminFinancialSettings from './admin/AdminFinancialSettings';
import AdminAppearanceSettings from './admin/AdminAppearanceSettings';
import AdminChannelPartnerManagement from './admin/AdminChannelPartnerManagement';

interface AdminPanelProps {
  leads: Lead[];
  onUpdateLeads: (updatedLeads: Lead[]) => void;
  users: User[];
  onUpdateUsers: (updatedUsers: User[]) => void;
  onAddUser: (userData: NewUserData) => void;
  onUpdateUser: (updatedUser: User) => void;
  sources: Source[];
  onUpdateSources: (updatedSources: Source[]) => void;
  onAddSource: (sourceData: NewSourceData) => void;
  projects: Project[];
  onUpdateProjects: (updatedProjects: Project[]) => void;
  onAddProject: (projectData: NewProjectData) => void;
  onDeleteProject: (projectId: string) => void;
  templates: Template[];
  onUpdateTemplates: (updatedTemplates: Template[]) => void;
  onAddTemplate: (templateData: NewTemplateData) => void;
  paymentPlans: PaymentPlan[];
  onUpdatePaymentPlans: (updatedPlans: PaymentPlan[]) => void;
  onDeletePaymentPlan: (planId: string) => void;
  
  budgets: Budget[];
  onUpdateBudgets: (updated: Budget[]) => void;
  onAddBudget: (data: NewBudgetData) => void;
  clientProfiles: ClientProfile[];
  onUpdateClientProfiles: (updated: ClientProfile[]) => void;
  onAddClientProfile: (data: NewClientProfileData) => void;
  unitTypes: UnitType[];
  onUpdateUnitTypes: (updated: UnitType[]) => void;
  onAddUnitType: (data: NewUnitTypeData) => void;
  locationSettings: LocationSetting[];
  onUpdateLocationSettings: (updated: LocationSetting[]) => void;
  onAddLocationSetting: (data: NewLocationSettingData) => void;
  livingPlaces: LivingPlace[];
  onUpdateLivingPlaces: (updated: LivingPlace[]) => void;
  onAddLivingPlace: (data: NewLivingPlaceData) => void;

  leadStatusTypes: LeadStatusType[];
  onUpdateLeadStatusTypes: (updated: LeadStatusType[]) => void;
  onAddLeadStatusType: (data: NewLeadStatusTypeData) => void;
  siteVisitStatusTypes: SiteVisitStatusType[];
  onUpdateSiteVisitStatusTypes: (updated: SiteVisitStatusType[]) => void;
  onAddSiteVisitStatusType: (data: NewSiteVisitStatusTypeData) => void;
  taskPriorityTypes: TaskPriorityType[];
  onUpdateTaskPriorityTypes: (updated: TaskPriorityType[]) => void;
  onAddTaskPriorityType: (data: NewTaskPriorityTypeData) => void;
  bookingStatusTypes: BookingStatusType[];
  onUpdateBookingStatusTypes: (updated: BookingStatusType[]) => void;
  onAddBookingStatusType: (data: NewBookingStatusTypeData) => void;
  agreementStatusTypes: AgreementStatusType[];
  onUpdateAgreementStatusTypes: (updated: AgreementStatusType[]) => void;
  onAddAgreementStatusType: (data: NewAgreementStatusTypeData) => void;
  possessionStatusTypes: PossessionStatusType[];
  onUpdatePossessionStatusTypes: (updated: PossessionStatusType[]) => void;
  onAddPossessionStatusType: (data: NewPossessionStatusTypeData) => void;
  inventoryStatusTypes: InventoryStatusType[];
  onUpdateInventoryStatusTypes: (updated: InventoryStatusType[]) => void;
  onAddInventoryStatusType: (data: NewInventoryStatusTypeData) => void;
  projectTypeTypes: ProjectTypeType[];
  onUpdateProjectTypeTypes: (updated: ProjectTypeType[]) => void;
  onAddProjectTypeType: (data: NewProjectTypeTypeData) => void;
  projectStatusTypes: ProjectStatusType[];
  onUpdateProjectStatusTypes: (updated: ProjectStatusType[]) => void;
  onAddProjectStatusType: (data: NewProjectStatusTypeData) => void;

  userRoleSettings: UserRoleSetting[];
  onUpdateUserRoleSettings: (updated: UserRoleSetting[]) => void;
  onAddUserRoleSetting: (data: NewUserRoleSettingData) => void;
  onUpdateUserRoleMenuAccess: (roleId: string, menus: string[]) => void;
  userDesignations: UserDesignation[];
  onUpdateUserDesignations: (updated: UserDesignation[]) => void;
  onAddUserDesignation: (data: NewUserDesignationData) => void;
  companyProfile: CompanyProfile;
  onUpdateCompanyProfile: (updated: CompanyProfile) => void;
  financialSettings: FinancialSettings;
  onUpdateFinancialSettings: (updated: FinancialSettings) => void;
  applicationSettings: any; // Placeholder as types.ts in root might not have ApplicationSettings? Checked types.ts, it has.
  onUpdateApplicationSettings: (s: any) => void;

  // FIX: Added missing form field configuration props to AdminPanelProps.
  formFieldConfigs: FormFieldConfig[];
  onUpdateFormFieldConfigs: (updated: FormFieldConfig[]) => void;

  themeColor: string;
  onThemeColorChange: (color: string) => void;
  themeMode: 'light' | 'dark';
  onThemeModeChange: (mode: 'light' | 'dark') => void;
  
  channelPartners: ChannelPartner[];
  onAddChannelPartner: (data: NewChannelPartnerData) => void;
  onUpdateChannelPartners: (updated: ChannelPartner[]) => void;

  onNavigateToMain: () => void;
  onLogout: () => void;
}

type SettingsTab = 'lead' | 'project' | 'booking' | 'user' | 'company';

const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  const [activeSection, setActiveSection] = React.useState<AdminPanelSection>('leads');
  const [activeSetting, setActiveSetting] = React.useState<string | null>(null);
  const [activeConnectSarvItem, setActiveConnectSarvItem] = React.useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = React.useState<SettingsTab>('lead');


  React.useEffect(() => {
    // When the main section changes, reset the sub-setting view
    if (activeSection !== 'settings') {
      setActiveSetting(null);
    }
    if (activeSection !== 'integrations') {
      setActiveConnectSarvItem(null);
    }
  }, [activeSection]);
  
  const handleSelectSection = (section: AdminPanelSection, subSection?: string) => {
    setActiveSection(section);
    if(section === 'integrations') {
        setActiveConnectSarvItem(subSection || null);
    }
    setIsSidebarOpen(false); // Close sidebar on selection for mobile
  };

  const SETTING_TITLES: Record<string, string> = {
    sources: 'Source Management',
    budgets: 'Budget Management',
    'client-profiles': 'Client Profile Management',
    'unit-types': 'Unit Type Management',
    locations: 'Preferred Location Management',
    'living-places': 'Current Living Place Management',
    'lead-statuses': 'Lead Status Management',
    'site-visit-statuses': 'Site Visit Status Management',
    'task-priorities': 'Task Priority Management',
    'booking-statuses': 'Booking Status Management',
    'agreement-statuses': 'Agreement Status Management',
    'possession-statuses': 'Possession Status Management',
    'inventory-statuses': 'Inventory Status Management',
    'project-types': 'Project Type Management',
    'project-statuses': 'Project Status Management',
    'user-roles': 'User Roles & Permissions',
    'user-designations': 'User Designations',
    'company-profile': 'Company Profile',
    'billing': 'Billing & Subscription',
    'payment-plans': 'Payment Plan Management',
    'financial-settings': 'Financial Settings',
    'appearance': 'Appearance',
  };

  const SettingCard: React.FC<{
    settingKey: string;
    icon: string;
    title: string;
    description: string;
    onClick: (key: string) => void;
    isDisabled?: boolean;
  }> = ({ settingKey, icon, title, description, onClick, isDisabled = false }) => (
    <div
      onClick={() => !isDisabled && onClick(settingKey)}
      className={`bg-[var(--medium-bg)] p-6 rounded-lg shadow-lg border border-[var(--light-bg)] flex flex-col transition-all ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--primary-color)]'}`}
      role={isDisabled ? undefined : "button"}
      tabIndex={isDisabled ? -1 : 0}
    >
      <div className={`text-3xl ${isDisabled ? 'text-[var(--text-secondary)]' : 'text-[var(--primary-color)]'} mb-3`}>
        <i className={icon}></i>
      </div>
      <h4 className="text-lg font-bold text-[var(--text-primary)] mb-1">{title}</h4>
      <p className="text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
  );

  const SettingsTabButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
  }> = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        isActive
          ? 'border-[var(--primary-color)] text-[var(--text-primary)]'
          : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
      }`}
    >
      {label}
    </button>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'leads':
        return <AdminLeadManagement leads={props.leads} onUpdateLeads={props.onUpdateLeads} />;
      case 'lead-flow':
        return <AdminLeadFlow leads={props.leads} users={props.users} onUpdateLeads={props.onUpdateLeads} />;
      case 'task-management':
        return <AdminTaskManagement leads={props.leads} users={props.users} onUpdateLeads={props.onUpdateLeads} />;
      case 'users':
        return <AdminUserManagement users={props.users} onUpdateUsers={props.onUpdateUsers} onAddUser={props.onAddUser} onUpdateUser={props.onUpdateUser} projects={props.projects} />;
      case 'projects':
        return <AdminProjectManagement projects={props.projects} onUpdateProjects={props.onUpdateProjects} onAddProject={props.onAddProject} onDeleteProject={props.onDeleteProject} paymentPlans={props.paymentPlans} />;
      case 'channel-partners':
        return (
          <AdminChannelPartnerManagement
            partners={props.channelPartners}
            onAddPartner={props.onAddChannelPartner}
            onUpdatePartners={props.onUpdateChannelPartners}
          />
        );
      case 'reporting':
        return <AdminReporting leads={props.leads} projects={props.projects} />;
      case 'integrations':
        if (activeConnectSarvItem === 'templates') {
            return <AdminTemplateManagement templates={props.templates} onUpdateTemplates={props.onUpdateTemplates} onAddTemplate={props.onAddTemplate} />;
        }
        if (!activeConnectSarvItem) {
          return (
            <div className="p-4 text-[var(--text-secondary)] text-center">
              Please select an integration from the "Connect Sarv" menu to configure.
            </div>
          );
        }
        return <AdminConnectSarv activeItem={activeConnectSarvItem} />;
      case 'settings':
        if (activeSetting) {
            switch (activeSetting) {
                case 'sources': return <AdminSourceManagement sources={props.sources} onUpdateSources={props.onUpdateSources} onAddSource={props.onAddSource} />;
                case 'budgets': return <AdminGenericSettingManagement title="Budget Management" itemNoun="Budget" items={props.budgets} onUpdateItems={props.onUpdateBudgets} onAddItem={props.onAddBudget} />;
                case 'client-profiles': return <AdminGenericSettingManagement title="Client Profile Management" itemNoun="Profile" items={props.clientProfiles} onUpdateItems={props.onUpdateClientProfiles} onAddItem={props.onAddClientProfile} />;
                case 'unit-types': return <AdminGenericSettingManagement title="Unit Type Management" itemNoun="Unit Type" items={props.unitTypes} onUpdateItems={props.onUpdateUnitTypes} onAddItem={props.onAddUnitType} />;
                case 'locations': return <AdminGenericSettingManagement title="Preferred Location Management" itemNoun="Location" items={props.locationSettings} onUpdateItems={props.onUpdateLocationSettings} onAddItem={props.onAddLocationSetting} />;
                case 'living-places': return <AdminGenericSettingManagement title="Current Living Place Management" itemNoun="Living Place" items={props.livingPlaces} onUpdateItems={props.onUpdateLivingPlaces} onAddItem={props.onAddLivingPlace} />;
                case 'lead-statuses': return <AdminGenericSettingManagement title="Lead Status Management" itemNoun="Lead Status" items={props.leadStatusTypes} onUpdateItems={props.onUpdateLeadStatusTypes} onAddItem={props.onAddLeadStatusType} />;
                case 'site-visit-statuses': return <AdminGenericSettingManagement title="Site Visit Status Management" itemNoun="Site Visit Status" items={props.siteVisitStatusTypes} onUpdateItems={props.onUpdateSiteVisitStatusTypes} onAddItem={props.onAddSiteVisitStatusType} />;
                case 'task-priorities': return <AdminGenericSettingManagement title="Task Priority Management" itemNoun="Task Priority" items={props.taskPriorityTypes} onUpdateItems={props.onUpdateTaskPriorityTypes} onAddItem={props.onAddTaskPriorityType} />;
                case 'booking-statuses': return <AdminGenericSettingManagement title="Booking Status Management" itemNoun="Booking Status" items={props.bookingStatusTypes} onUpdateItems={props.onUpdateBookingStatusTypes} onAddItem={props.onAddBookingStatusType} />;
                case 'agreement-statuses': return <AdminGenericSettingManagement title="Agreement Status Management" itemNoun="Agreement Status" items={props.agreementStatusTypes} onUpdateItems={props.onUpdateAgreementStatusTypes} onAddItem={props.onAddAgreementStatusType} />;
                case 'possession-statuses': return <AdminGenericSettingManagement title="Possession Status Management" itemNoun="Possession Status" items={props.possessionStatusTypes} onUpdateItems={props.onUpdatePossessionStatusTypes} onAddItem={props.onAddPossessionStatusType} />;
                case 'inventory-statuses': return <AdminGenericSettingManagement title="Inventory Status Management" itemNoun="Inventory Status" items={props.inventoryStatusTypes} onUpdateItems={props.onUpdateInventoryStatusTypes} onAddItem={props.onAddInventoryStatusType} />;
                case 'project-types': return <AdminGenericSettingManagement title="Project Type Management" itemNoun="Project Type" items={props.projectTypeTypes} onUpdateItems={props.onUpdateProjectTypeTypes} onAddItem={props.onAddProjectTypeType} />;
                case 'project-statuses': return <AdminGenericSettingManagement title="Project Status Management" itemNoun="Project Status" items={props.projectStatusTypes} onUpdateItems={props.onUpdateProjectStatusTypes} onAddItem={props.onAddProjectStatusType} />;
                case 'user-roles': return <AdminGenericSettingManagement title="User Roles & Permissions" itemNoun="User Role" items={props.userRoleSettings} onUpdateItems={props.onUpdateUserRoleSettings} onAddItem={props.onAddUserRoleSetting} onUpdateMenuAccess={props.onUpdateUserRoleMenuAccess} />;
                case 'user-designations': return <AdminGenericSettingManagement title="User Designations" itemNoun="Designation" items={props.userDesignations} onUpdateItems={props.onUpdateUserDesignations} onAddItem={props.onAddUserDesignation} />;
                // FIX: Passed required 'formConfigs' prop to AdminCompanyProfile.
                case 'company-profile': return <AdminCompanyProfile profile={props.companyProfile} onUpdateProfile={props.onUpdateCompanyProfile} formConfigs={props.formFieldConfigs} />;
                case 'billing': return <AdminBilling />;
                case 'payment-plans': return <AdminPaymentPlanManagement plans={props.paymentPlans} onUpdatePlans={props.onUpdatePaymentPlans} onDeletePlan={props.onDeletePaymentPlan} />;
                case 'financial-settings': return <AdminFinancialSettings settings={props.financialSettings} onUpdateSettings={props.onUpdateFinancialSettings} />;
                case 'appearance': return <AdminAppearanceSettings profile={props.companyProfile} onUpdateProfile={props.onUpdateCompanyProfile} themeColor={props.themeColor} onThemeColorChange={props.onThemeColorChange} themeMode={props.themeMode} onThemeModeChange={props.onThemeModeChange} />;
                default: setActiveSetting(null); return null;
            }
        }
        
        return (
          <div className="p-4">
            <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Application Settings</h3>
            <div className="border-b border-[var(--light-bg)] mb-6 -mx-4 px-4">
                <nav className="flex space-x-2 flex-wrap">
                    <SettingsTabButton label="Lead" isActive={activeSettingsTab === 'lead'} onClick={() => setActiveSettingsTab('lead'} />
                    <SettingsTabButton label="Project" isActive={activeSettingsTab === 'project'} onClick={() => setActiveSettingsTab('project')} />
                    <SettingsTabButton label="Booking" isActive={activeSettingsTab === 'booking'} onClick={() => setActiveSettingsTab('booking')} />
                    <SettingsTabButton label="User" isActive={activeSettingsTab === 'user'} onClick={() => setActiveSettingsTab('user')} />
                    <SettingsTabButton label="Company" isActive={activeSettingsTab === 'company'} onClick={() => setActiveSettingsTab('company')} />
                </nav>
            </div>
            
            <div className="animate-fadeIn">
                {activeSettingsTab === 'lead' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SettingCard settingKey="sources" icon="fas fa-bullhorn" title="Source Management" description="Manage lead channels and sources where leads originate from." onClick={setActiveSetting} />
                        <SettingCard settingKey="lead-statuses" icon="fas fa-flag" title="Lead Statuses" description="Customize the stages of your lead pipeline." onClick={setActiveSetting} />
                        <SettingCard settingKey="site-visit-statuses" icon="fas fa-calendar-check" title="Site Visit Statuses" description="Define outcomes for scheduled site visits." onClick={setActiveSetting} />
                        <SettingCard settingKey="task-priorities" icon="fas fa-exclamation-circle" title="Task Priorities" description="Set priority levels for tasks like Low, Medium, High." onClick={setActiveSetting} />
                        <SettingCard settingKey="budgets" icon="fas fa-wallet" title="Budget Management" description="Define budget ranges for lead qualification and filtering." onClick={setActiveSetting} />
                        <SettingCard settingKey="client-profiles" icon="fas fa-user-tie" title="Client Profile Management" description="Manage client professional profiles for better segmentation." onClick={setActiveSetting} />
                        <SettingCard settingKey="locations" icon="fas fa-map-marked-alt" title="Preferred Locations" description="Manage list of preferred locations for leads." onClick={setActiveSetting} />
                        <SettingCard settingKey="living-places" icon="fas fa-home" title="Current Living Place" description="Define types of current residences for leads." onClick={setActiveSetting} />
                    </div>
                )}
                {activeSettingsTab === 'project' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SettingCard settingKey="project-types" icon="fas fa-th-large" title="Project Types" description="Define project categories like Residential, Commercial." onClick={setActiveSetting} />
                        <SettingCard settingKey="project-statuses" icon="fas fa-tasks" title="Project Statuses" description="Manage project lifecycle statuses like Pre-launch." onClick={setActiveSetting} />
                        <SettingCard settingKey="unit-types" icon="fas fa-door-open" title="Unit Type Management" description="Configure available property unit types like 2BHK, 3BHK, etc." onClick={setActiveSetting} />
                        <SettingCard settingKey="inventory-statuses" icon="fas fa-boxes" title="Inventory Statuses" description="Manage unit statuses like Available, Booked, On Hold." onClick={setActiveSetting} />
                    </div>
                )}
                {activeSettingsTab === 'booking' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         <SettingCard settingKey="booking-statuses" icon="fas fa-file-signature" title="Booking Statuses" description="Manage the different states of property booking." onClick={setActiveSetting} />
                         <SettingCard settingKey="agreement-statuses" icon="fas fa-file-contract" title="Agreement Statuses" description="Define the lifecycle of a sales agreement." onClick={setActiveSetting} />
                         <SettingCard settingKey="possession-statuses" icon="fas fa-key" title="Possession Statuses" description="Track the property handover process." onClick={setActiveSetting} />
                         <SettingCard settingKey="payment-plans" icon="fas fa-percent" title="Payment Plans" description="Manage construction-linked payment plans." onClick={setActiveSetting} />
                         <SettingCard settingKey="financial-settings" icon="fas fa-calculator" title="Financial Settings" description="Manage GST, Stamp Duty, and other dynamic charges." onClick={setActiveSetting} />
                    </div>
                )}
                {activeSettingsTab === 'user' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SettingCard settingKey="user-roles" icon="fas fa-users-cog" title="User Roles & Permissions" description="Define user roles and control access to different modules." onClick={setActiveSetting} />
                        <SettingCard settingKey="user-designations" icon="fas fa-id-badge" title="User Designations" description="Manage official employee designations." onClick={setActiveSetting} />
                    </div>
                )}
                {activeSettingsTab === 'company' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SettingCard settingKey="company-profile" icon="fas fa-building" title="Company Profile" description="Manage your company's name, address, and branding." onClick={setActiveSetting} />
                        <SettingCard settingKey="billing" icon="fas fa-credit-card" title="Billing & Subscription" description="View your current plan, invoices, and manage payment methods." onClick={setActiveSetting} />
                        <SettingCard settingKey="appearance" icon="fas fa-paint-brush" title="Appearance" description="Customize the look and feel of the application." onClick={setActiveSetting} />
                    </div>
                )}
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4 text-[var(--text-secondary)] text-center">
            Select a section from the sidebar.
          </div>
        );
    }
  };
  
  const getPageTitle = () => {
    if (activeSection === 'settings' && activeSetting && SETTING_TITLES[activeSetting]) {
      return SETTING_TITLES[activeSetting];
    }
    if (activeSection === 'integrations' && activeConnectSarvItem) {
      const connectSarvSection = ADMIN_PANEL_SECTIONS.find(s => s.id === 'integrations');
      return connectSarvSection?.subItems?.find(sub => sub.id === activeConnectSarvItem)?.label || 'Connect Sarv';
    }
    return ADMIN_PANEL_SECTIONS.find(sec => sec.id === activeSection)?.label || 'Overview';
  };

  return (
    <div
      className="w-full h-full relative flex overflow-hidden bg-[var(--dark-bg)]"
      aria-labelledby="adminPanelTitle"
      role="region"
    >
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
          <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
          ></div>
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed md:relative top-0 left-0 h-full z-50 
        transform md:transform-none transition-all duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'}
      `}>
          <AdminSidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
            activeSubSection={activeConnectSarvItem}
            onClose={() => setIsSidebarOpen(false)}
          />
      </div>

      <div className="flex-1 flex flex-col w-full md:w-auto overflow-hidden">
        <div className="bg-[var(--medium-bg)] p-4 border-b border-[var(--light-bg)] flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-2 rounded-full hover:bg-[var(--light-bg)] transition-colors text-lg md:hidden"
                aria-label="Open sidebar"
            >
                <i className="fas fa-bars"></i>
            </button>
            {activeSection === 'settings' && activeSetting && (
              <button
                onClick={() => setActiveSetting(null)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-2 rounded-full hover:bg-[var(--light-bg)] transition-colors text-lg"
                aria-label="Back to settings"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
            )}
            <h3 id="adminPanelTitle" className="text-xl font-bold text-[var(--text-primary)]">
              Admin Panel - {getPageTitle()}
            </h3>
          </div>
          <div className="flex items-center gap-3">
              <button
                onClick={props.onNavigateToMain}
                className="px-4 py-2 rounded-md bg-[var(--primary-color)] text-white font-medium hover:bg-[#128c7e] transition-colors flex items-center gap-2"
                aria-label="Back to Main App"
              >
                <i className="fas fa-arrow-left text-base"></i>
                <span className="hidden sm:inline">Back to Main App</span>
              </button>
              <button
                onClick={props.onLogout}
                className="px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                aria-label="Logout"
              >
                <i className="fas fa-sign-out-alt text-base"></i>
                <span className="hidden sm:inline">Logout</span>
              </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[var(--dark-bg)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
