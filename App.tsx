
import React from 'react';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import MainAppContainer from './components/MainAppContainer';
import ProjectSarvContainer from './components/realty/ProjectSarvContainer';
import FinanceSarvContainer from './components/realty/FinanceSarvContainer';
import SystemSwitcher from './components/SystemSwitcher';
import { Lead, User, Project, NewUserData, SystemType, PaymentPlan, Budget, ClientProfile, UnitType, LocationSetting, LivingPlace, FormFieldConfig, FinancialSettings, ApplicationSettings, ChannelPartner, NewChannelPartnerData, TaskStatus, LifecycleStage, LeadLifecycleStatus } from './types';
import { db } from './db';
import { useLiveQuery } from 'dexie-react-hooks';
import { INITIAL_USERS } from './constants';
import { v4 as uuidv4 } from 'uuid';
import InstallationWizard from './components/InstallationWizard';
import SetupWizard from './components/SetupWizard';
import AdminPanel from './components/admin/AdminPanel';
import { auth, fdb } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const syncEntityToFirestore = async (collectionName: string, item: Record<string, any>) => {
  try {
    const id = item?.id || item?.leadId || item?.userId || item?.projectId || item?.companyId || uuidv4();
    await setDoc(doc(fdb, collectionName, String(id)), {
      ...item,
      id: String(id),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Failed to sync ${collectionName} to Firestore:`, error);
  }
};

const createTenantFirestoreSeed = async (
  companyName: string,
  subdomain: string,
  adminData: NewUserData,
  adminId: string
) => {
  const companyId = `company_${Date.now()}`;
  const projectId = `project_${Date.now()}`;
  const leadId = `lead_${Date.now()}`;
  const now = new Date().toISOString();

  const companyDoc = {
    id: companyId,
    companyId,
    name: companyName || 'My RealtySarv Workspace',
    subdomain: (subdomain || '').toLowerCase(),
    setupCompleted: false,
    createdAt: now,
    updatedAt: now,
  };

  const projectDoc = {
    id: projectId,
    projectId,
    companyId,
    name: `${companyName || 'My RealtySarv Workspace'} Project`,
    projectStatus: 'Draft',
    createdAt: now,
    updatedAt: now,
  };

  const leadDoc = {
    id: leadId,
    leadId,
    companyId,
    ownerId: adminId,
    name: adminData.name || 'New Lead',
    leadStatus: 'New',
    createdAt: now,
    updatedAt: now,
  };

  await Promise.all([
    setDoc(doc(fdb, 'companies', companyId), companyDoc),
    setDoc(doc(fdb, 'users', adminId), {
      id: adminId,
      companyId,
      email: (adminData.email || '').trim().toLowerCase(),
      name: adminData.name || 'Workspace Admin',
      role: 'Admin',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }),
    setDoc(doc(fdb, 'projects', projectId), projectDoc),
    setDoc(doc(fdb, 'leads', leadId), leadDoc),
  ]);
};

const getInitialTheme = (): string => {
  try {
    const savedTheme = localStorage.getItem('realtySarvThemeColor');
    return savedTheme || '#1a73e8';
  } catch (error) {
    return '#1a73e8';
  }
};

const getInitialThemeMode = (): 'light' | 'dark' => {
  try {
    const savedMode = localStorage.getItem('realtySarvThemeMode');
    return savedMode === 'light' ? 'light' : 'dark';
  } catch (error) {
    return 'dark';
  }
};

const App: React.FC = () => {
  const [activeSystem, setActiveSystem] = React.useState<SystemType>(() => {
    return (localStorage.getItem('lastActiveSystem') as SystemType) || 'LeadSarv';
  });
  const [isInstalled, setIsInstalled] = React.useState<boolean>(() => localStorage.getItem('isRealtySarvInstalled') === 'true');
  const [showInstallationWizard, setShowInstallationWizard] = React.useState<boolean>(false);

  // viewState controls exactly what the user sees: the marketing landing page, the sign-in screen, or the app itself
  const [viewState, setViewState] = React.useState<'landing' | 'login' | 'authenticated'>('landing');

  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [themeColor, setThemeColorState] = React.useState<string>(getInitialTheme);
  const [themeMode, setThemeModeState] = React.useState<'light' | 'dark'>(getInitialThemeMode);
  const [currentAppView, setCurrentAppView] = React.useState<'main' | 'admin'>('main');
  const [dbError, setDbError] = React.useState<string | null>(null);

  const leads = useLiveQuery(() => db.leads.toArray(), []);
  const users = useLiveQuery(() => db.users.toArray(), []);
  const projects = useLiveQuery(() => db.projects.toArray(), []);
  const sources = useLiveQuery(() => db.sources.toArray(), []);
  const templates = useLiveQuery(() => db.templates.toArray(), []);
  const paymentPlans = useLiveQuery(() => db.paymentPlans.toArray(), []);
  const budgets = useLiveQuery(() => db.budgets.toArray(), []);
  const clientProfiles = useLiveQuery(() => db.clientProfiles.toArray(), []);
  const unitTypes = useLiveQuery(() => db.unitTypes.toArray(), []);
  const locationSettings = useLiveQuery(() => db.locationSettings.toArray(), []);
  const livingPlaces = useLiveQuery(() => db.livingPlaces.toArray(), []);
  const leadStatusTypes = useLiveQuery(() => db.leadStatusTypes.toArray(), []);
  const siteVisitStatusTypes = useLiveQuery(() => db.siteVisitStatusTypes.toArray(), []);
  const taskPriorityTypes = useLiveQuery(() => db.taskPriorityTypes.toArray(), []);
  const bookingStatusTypes = useLiveQuery(() => db.bookingStatusTypes.toArray(), []);
  const agreementStatusTypes = useLiveQuery(() => db.agreementStatusTypes.toArray(), []);
  const possessionStatusTypes = useLiveQuery(() => db.possessionStatusTypes.toArray(), []);
  const inventoryStatusTypes = useLiveQuery(() => db.inventoryStatusTypes.toArray(), []);
  const projectTypeTypes = useLiveQuery(() => db.projectTypeTypes.toArray(), []);
  const projectStatusTypes = useLiveQuery(() => db.projectStatusTypes.toArray(), []);
  const userRoleSettings = useLiveQuery(() => db.userRoleSettings.toArray(), []);
  const userDesignations = useLiveQuery(() => db.userDesignations.toArray(), []);
  const channelPartners = useLiveQuery(() => db.channelPartners.toArray(), []);
  const formFieldConfigs = useLiveQuery(() => db.formFieldConfigs.toArray(), []);
  const companyProfile = useLiveQuery(async () => (await db.companyProfile.toArray())[0]);
  const financialSettings = useLiveQuery(async () => (await db.financialSettings.toArray())[0]);
  const applicationSettings = useLiveQuery(async () => (await db.applicationSettings.toArray())[0]);

  React.useEffect(() => {
    (db as any).open().catch((err: any) => {
      console.error("Failed to open database:", err);
      setDbError("Local Database (IndexedDB) connection failed. Please ensure your browser supports storage and try refreshing.");
    });
  }, []);

  React.useEffect(() => {
    const seedUsers = async () => {
      if (users !== undefined && users.length === 0) {
        const count = await db.users.count();
        if (count === 0) await db.users.bulkAdd(INITIAL_USERS);
      }
    };
    seedUsers();
  }, [users]);

  React.useEffect(() => {
    const body = document.body;
    if (activeSystem === 'ProjectSarv' && viewState === 'authenticated') {
      body.classList.add('realty-theme');
      document.documentElement.style.setProperty('--primary-color', '#3b82f6');
    } else if (activeSystem === 'FinanceSarv' && viewState === 'authenticated') {
      body.classList.remove('realty-theme');
      document.documentElement.style.setProperty('--primary-color', '#6366f1');
    } else {
      body.classList.remove('realty-theme');
      document.documentElement.style.setProperty('--primary-color', themeColor);
    }
    localStorage.setItem('lastActiveSystem', activeSystem);
  }, [activeSystem, themeColor, viewState]);

  React.useEffect(() => {
    const body = document.body;
    if (themeMode === 'light') body.classList.add('light');
    else body.classList.remove('light');
    localStorage.setItem('realtySarvThemeMode', themeMode);
    localStorage.setItem('realtySarvThemeColor', themeColor);
  }, [themeMode, themeColor]);

  const handleInstallComplete = async (
    adminData: NewUserData,
    companyName: string,
    plan: string,
    modules: { crm: boolean; erp: boolean },
    subdomain: string
  ) => {
    const normalizedEmail = (adminData.email || '').trim().toLowerCase();
    const password = adminData.password || '';

    if (!normalizedEmail || !password) {
      window.alert('Please provide a valid email and password for the workspace administrator.');
      return;
    }

    let firebaseUserId = '';
    try {
      console.log('Creating Firebase Auth user for onboarding:', normalizedEmail);
      const authResult = await createUserWithEmailAndPassword(auth, normalizedEmail, password).catch(async (error: any) => {
        if (error?.code === 'auth/email-already-in-use') {
          console.log('Firebase Auth email already exists; signing in instead:', normalizedEmail);
          const signInResult = await signInWithEmailAndPassword(auth, normalizedEmail, password);
          return signInResult;
        }
        throw error;
      });
      firebaseUserId = authResult.user.uid;
      console.log('Firebase Auth user ready:', firebaseUserId);
    } catch (error: any) {
      console.error('Failed to create Firebase Auth user:', error);
      window.alert(`Unable to create the Firebase account for ${normalizedEmail}. Please check your network or Firebase configuration and try again.`);
      return;
    }

    // 1. Purge all operational transactional tables for a clean new tenant workspace
    await db.users.clear();
    await db.leads.clear();
    await db.projects.clear();
    await db.channelPartners.clear();
    await db.vendors.clear();
    await db.purchaseRequisitions.clear();
    await db.purchaseOrders.clear();
    await db.workOrders.clear();
    await db.materialStock.clear();
    await db.dailyProgressReports.clear();
    await db.projectPhases.clear();
    await db.costBudgets.clear();
    await db.boqs.clear();
    await db.boqItems.clear();
    await db.vouchers.clear();
    await db.gstEntries.clear();

    // 2. Add root Admin Account locally and in Firestore
    const newAdmin: User = { id: firebaseUserId || uuidv4(), ...adminData, email: normalizedEmail, role: 'Admin', isActive: true, assignedProjectIds: [] };
    await db.users.add(newAdmin);

    try {
      await createTenantFirestoreSeed(companyName, subdomain, adminData, newAdmin.id);
      console.log('Firestore tenant seed created for:', newAdmin.id);
    } catch (firestoreError: any) {
      console.error('Failed to write tenant seed to Firestore:', firestoreError);
    }

    // 3. Setup the Company Profile with setupCompleted: false so SetupWizard loads on login
    await db.companyProfile.clear();
    await db.companyProfile.add({
      name: companyName || "My RealtySarv Workspace",
      address: "123 Business Avenue",
      phone: adminData.phone || "",
      website: "",
      setupCompleted: false,
      customData: { subdomain: (subdomain || "").toLowerCase() }
    });

    localStorage.setItem('realtySarvActiveSubdomain', (subdomain || "").toLowerCase());
    setIsInstalled(true);
    localStorage.setItem('isRealtySarvInstalled', 'true');
    setShowInstallationWizard(false);
    setViewState('login');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setViewState('authenticated');
  };

  const handleLeadsUpdate = async (updatedLeads: Lead[]) => {
    await db.leads.bulkPut(updatedLeads);
    await Promise.all(updatedLeads.map((lead) => syncEntityToFirestore('leads', lead)));
  };

  const handleUsersUpdate = async (updatedUsers: User[]) => {
    await db.users.bulkPut(updatedUsers);
    await Promise.all(updatedUsers.map((user) => syncEntityToFirestore('users', user)));
  };

  const handleProjectsUpdate = async (updatedProjects: Project[]) => {
    await db.projects.bulkPut(updatedProjects);
    await Promise.all(updatedProjects.map((project) => syncEntityToFirestore('projects', project)));
  };

  const handleLogout = () => {
    setViewState('landing');
    setCurrentUser(null);
    setCurrentAppView('main');
  };

  if (dbError) {
    return (
      <div className="flex h-screen w-screen flex-col justify-center items-center bg-[var(--dark-bg)] text-white p-6 text-center">
        <i className="fas fa-exclamation-triangle text-5xl text-red-500 mb-4"></i>
        <h2 className="text-2xl font-bold mb-2">Database Connection Error</h2>
        <p className="text-[var(--text-secondary)] max-w-md">{dbError}</p>
        <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-blue-600 rounded-md font-bold">Retry Connection</button>
      </div>
    );
  }

  if (showInstallationWizard) return <InstallationWizard onComplete={handleInstallComplete} onGoToLogin={() => setShowInstallationWizard(false)} />;

  if (
    leads === undefined || users === undefined || projects === undefined || sources === undefined || templates === undefined || paymentPlans === undefined ||
    budgets === undefined || clientProfiles === undefined || unitTypes === undefined || locationSettings === undefined || livingPlaces === undefined ||
    leadStatusTypes === undefined || siteVisitStatusTypes === undefined || taskPriorityTypes === undefined || bookingStatusTypes === undefined ||
    agreementStatusTypes === undefined || possessionStatusTypes === undefined || inventoryStatusTypes === undefined || projectTypeTypes === undefined ||
    projectStatusTypes === undefined || userRoleSettings === undefined || userDesignations === undefined || companyProfile === undefined || financialSettings === undefined || applicationSettings === undefined || channelPartners === undefined || formFieldConfigs === undefined
  ) {
    return <div className="flex h-screen w-screen justify-center items-center bg-[var(--dark-bg)] text-white">Connecting to database...</div>;
  }

  const showSetupWizard = viewState === 'authenticated' && currentUser?.role === 'Admin' && companyProfile && !companyProfile.setupCompleted;

  const renderActiveSystem = () => {
    if (activeSystem === 'ProjectSarv') {
      return <ProjectSarvContainer currentUser={currentUser!} users={users} projects={projects} onSwitchSystem={setActiveSystem} />;
    }

    if (activeSystem === 'FinanceSarv') {
      return <FinanceSarvContainer currentUser={currentUser!} users={users} projects={projects} onSwitchSystem={setActiveSystem} />;
    }

    if (currentAppView === 'main') {
      return (
        <MainAppContainer
          leads={leads}
          users={users}
          projects={projects}
          paymentPlans={paymentPlans}
          financialSettings={financialSettings}
          unitTypes={unitTypes}
          locationSettings={locationSettings}
          sources={sources}
          budgets={budgets}
          clientProfiles={clientProfiles}
          livingPlaces={livingPlaces}
          formConfigs={formFieldConfigs}
          onLeadsUpdate={handleLeadsUpdate}
          onProjectsUpdate={handleProjectsUpdate}
          onNavigateToAdmin={() => setCurrentAppView('admin')}
          onLogout={handleLogout}
          onUpdateTaskStatus={async (leadId, taskId, status) => await db.leads.where({ id: leadId }).modify(l => { const t = l.tasks.find(x => x.id === taskId); if (t) t.status = status; })}
          onUpdateLeadLifecycle={async (leadId, stage, status) => await db.leads.update(leadId, { [stage]: status } as any)}
          onUpdateLeadOwner={async (leadId, ownerId) => await db.leads.update(leadId, { ownerId })}
        />
      );
    }

    return (
      <AdminPanel
        leads={leads} onUpdateLeads={handleLeadsUpdate}
        users={users} onUpdateUsers={handleUsersUpdate} onAddUser={async (u) => await db.users.add({ id: uuidv4(), ...u, isActive: true, assignedProjectIds: [] })} onUpdateUser={async (u) => await db.users.put(u)}
        sources={sources} onUpdateSources={async (s) => await db.sources.bulkPut(s)} onAddSource={async (s) => await db.sources.add({ id: uuidv4(), ...s })}
        projects={projects} onUpdateProjects={handleProjectsUpdate} onAddProject={async (p) => await db.projects.add({ id: uuidv4(), ...p, inventory: [], parkingInventory: [] })} onDeleteProject={async (id) => await db.projects.delete(id)}
        templates={templates} onUpdateTemplates={async (t) => await db.templates.bulkPut(t)} onAddTemplate={async (t) => await db.templates.add({ id: uuidv4(), ...t })}
        paymentPlans={paymentPlans} onUpdatePaymentPlans={async (p) => await db.paymentPlans.bulkPut(p)} onDeletePaymentPlan={async (id) => await db.paymentPlans.delete(id)}
        channelPartners={channelPartners} onAddChannelPartner={async (c) => await db.channelPartners.add({ id: uuidv4(), ...c, status: 'Pending', totalLeads: 0, totalConversions: 0, onboardingDate: new Date().toISOString().split('T')[0] })} onUpdateChannelPartners={async (c) => await db.channelPartners.bulkPut(c)}
        budgets={budgets} onUpdateBudgets={async (b) => await db.budgets.bulkPut(b)} onAddBudget={async (b) => await db.budgets.add({ id: uuidv4(), ...b })}
        clientProfiles={clientProfiles} onUpdateClientProfiles={async (c) => await db.clientProfiles.bulkPut(c)} onAddClientProfile={async (c) => await db.clientProfiles.add({ id: uuidv4(), ...c })}
        unitTypes={unitTypes} onUpdateUnitTypes={async (u) => await db.unitTypes.bulkPut(u)} onAddUnitType={async (u) => await db.unitTypes.add({ id: uuidv4(), ...u })}
        locationSettings={locationSettings} onUpdateLocationSettings={async (l) => await db.locationSettings.bulkPut(l)} onAddLocationSetting={async (l) => await db.locationSettings.add({ id: uuidv4(), ...l })}
        livingPlaces={livingPlaces} onUpdateLivingPlaces={async (l) => await db.livingPlaces.bulkPut(l)} onAddLivingPlace={async (l) => await db.livingPlaces.add({ id: uuidv4(), ...l })}
        leadStatusTypes={leadStatusTypes} onUpdateLeadStatusTypes={async (l) => await db.leadStatusTypes.bulkPut(l)} onAddLeadStatusType={async (l) => await db.leadStatusTypes.add({ id: uuidv4(), ...l })}
        siteVisitStatusTypes={siteVisitStatusTypes} onUpdateSiteVisitStatusTypes={async (s) => await db.siteVisitStatusTypes.bulkPut(s)} onAddSiteVisitStatusType={async (s) => await db.siteVisitStatusTypes.add({ id: uuidv4(), ...s })}
        taskPriorityTypes={taskPriorityTypes} onUpdateTaskPriorityTypes={async (t) => await db.taskPriorityTypes.bulkPut(t)} onAddTaskPriorityType={async (t) => await db.taskPriorityTypes.add({ id: uuidv4(), ...t })}
        bookingStatusTypes={bookingStatusTypes} onUpdateBookingStatusTypes={async (b) => await db.bookingStatusTypes.bulkPut(b)} onAddBookingStatusType={async (b) => await db.bookingStatusTypes.add({ id: uuidv4(), ...b })}
        agreementStatusTypes={agreementStatusTypes} onUpdateAgreementStatusTypes={async (a) => await db.agreementStatusTypes.bulkPut(a)} onAddAgreementStatusType={async (a) => await db.agreementStatusTypes.add({ id: uuidv4(), ...a })}
        possessionStatusTypes={possessionStatusTypes} onUpdatePossessionStatusTypes={async (p) => await db.possessionStatusTypes.bulkPut(p)} onAddPossessionStatusType={async (p) => await db.possessionStatusTypes.add({ id: uuidv4(), ...p })}
        inventoryStatusTypes={inventoryStatusTypes} onUpdateInventoryStatusTypes={async (i) => await db.inventoryStatusTypes.bulkPut(i)} onAddInventoryStatusType={async (i) => await db.inventoryStatusTypes.add({ id: uuidv4(), ...i })}
        projectTypeTypes={projectTypeTypes} onUpdateProjectTypeTypes={async (p) => await db.projectTypeTypes.bulkPut(p)} onAddProjectTypeType={async (p) => await db.projectTypeTypes.add({ id: uuidv4(), ...p })}
        projectStatusTypes={projectStatusTypes} onUpdateProjectStatusTypes={async (p) => await db.projectStatusTypes.bulkPut(p)} onAddProjectStatusType={async (p) => await db.projectStatusTypes.add({ id: uuidv4(), ...p })}
        userRoleSettings={userRoleSettings} onUpdateUserRoleSettings={async (u) => await db.userRoleSettings.bulkPut(u)} onAddUserRoleSetting={async (u) => await db.userRoleSettings.add({ id: uuidv4(), ...u, menuAccess: [] })} onUpdateUserRoleMenuAccess={async (id, m) => await db.userRoleSettings.update(id, { menuAccess: m })}
        userDesignations={userDesignations} onUpdateUserDesignations={async (u) => await db.userDesignations.bulkPut(u)} onAddUserDesignation={async (u) => await db.userDesignations.add({ id: uuidv4(), ...u })}
        companyProfile={companyProfile} onUpdateCompanyProfile={async (p) => { if (p) await db.companyProfile.put(p); }}
        financialSettings={financialSettings} onUpdateFinancialSettings={async (s) => { if (s) await db.financialSettings.put(s); }}
        applicationSettings={applicationSettings} onUpdateApplicationSettings={async (s) => { if (s) await db.applicationSettings.put(s); }}
        formFieldConfigs={formFieldConfigs} onUpdateFormFieldConfigs={async (f) => { await db.formFieldConfigs.clear(); await db.formFieldConfigs.bulkAdd(f); }}
        onNavigateToMain={() => setCurrentAppView('main')}
        onLogout={handleLogout}
        themeColor={themeColor} onThemeColorChange={(c) => setThemeColorState(c)}
        themeMode={themeMode} onThemeModeChange={(m) => setThemeModeState(m)}
      />
    );
  };

  return (
    <div className="app-container relative flex flex-col h-screen w-screen bg-[var(--dark-bg)] overflow-hidden">
      {viewState === 'authenticated' && !showSetupWizard && (
        <SystemSwitcher
          activeSystem={activeSystem}
          onSwitch={setActiveSystem}
          onGoToAdmin={() => setCurrentAppView('admin')}
          currentAppView={currentAppView}
        />
      )}

      <div className="flex-1 overflow-hidden relative">
        {viewState === 'authenticated' ? (
          showSetupWizard ? (
            <SetupWizard
              user={currentUser!}
              onComplete={async () => { if (companyProfile) await db.companyProfile.update(companyProfile.name, { setupCompleted: true }); setCurrentAppView('admin'); }}
              companyProfile={companyProfile!}
              onUpdateCompanyProfile={async (p) => await db.companyProfile.put(p)}
              onAddProject={async (p) => await db.projects.add({ id: uuidv4(), ...p, inventory: [], parkingInventory: [] })}
              onAddUser={async (u) => await db.users.add({ id: uuidv4(), ...u, isActive: true, assignedProjectIds: [] })}
              onUpdateFinancialSettings={async (s) => await db.financialSettings.put(s)}
              onAddSource={async (s) => await db.sources.add({ id: uuidv4(), ...s })}
              projects={projects}
              users={users}
              financialSettings={financialSettings!}
              sources={sources}
            />
          ) : renderActiveSystem()
        ) : viewState === 'login' ? (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onGoToInstall={() => setShowInstallationWizard(true)}
            isInstalled={isInstalled}
            users={users || []}
            companyProfile={companyProfile}
            onBackToLanding={() => setViewState('landing')}
          />
        ) : (
          <LandingPage
            onSignInClick={() => setViewState('login')}
            onStartFreeClick={() => setShowInstallationWizard(true)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
