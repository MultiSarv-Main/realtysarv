
import React from 'react';
import { CompanyProfile, NewProjectData, NewUserData, Project, User, NewSourceData, FinancialSettings, Source } from '../types';
import NewProjectModal from './admin/NewProjectModal';
import NewUserModal from './admin/NewUserModal';
import AdminFinancialSettings from './admin/AdminFinancialSettings';
import NewSourceModal from './admin/NewSourceModal';

interface SetupWizardProps {
    user: User;
    onComplete: () => void;
    companyProfile: CompanyProfile;
    onUpdateCompanyProfile: (profile: CompanyProfile) => void;
    onAddProject: (data: NewProjectData) => void;
    onAddUser: (data: NewUserData) => void;
    onUpdateFinancialSettings: (settings: FinancialSettings) => void;
    onAddSource: (data: NewSourceData) => void;
    projects: Project[];
    users: User[];
    financialSettings: FinancialSettings;
    sources: Source[];
}

const helpContent: Record<number, { title: string; description: string; tips: string[] }> = {
    2: {
        title: "Product Infrastructure",
        description: "Select and enable the core modules that will run your operations.",
        tips: [
            "Enable CRM for sales and marketing automation.",
            "Enable ERP for construction and procurement tracking.",
            "You can scale your module access at any time from billing."
        ]
    },
    3: {
        title: "Defining Projects",
        description: "Projects represent physical sites or developments. They act as containers for your inventory and pricing rules.",
        tips: [
            "Use the official RERA registration name.",
            "Inventory can be batch-generated later in Project Settings.",
            "Assigning projects to users controls data visibility."
        ]
    },
    4: {
        title: "IAM & Team Setup",
        description: "Identity and Access Management ensures that your team members have exactly the permissions they need.",
        tips: [
            "Admin: Root access to all financials and settings.",
            "Sales: Standard access for lead tracking and bookings.",
            "Assign users to specific projects to limit their dashboard scope."
        ]
    }
};

const VerticalStepper: React.FC<{ currentStep: number; maxReached: number; onJump: (s: number) => void }> = ({ currentStep, maxReached, onJump }) => {
    const steps = [
        { id: 1, title: 'Welcome', desc: 'Initialize' },
        { id: 2, title: 'Modules', desc: 'Configure Stack' },
        { id: 3, title: 'Projects', desc: 'Infrastructure' },
        { id: 4, title: 'Team', desc: 'IAM Permissions' },
        { id: 5, title: 'Deploy', desc: 'Finalize' },
    ];

    return (
        <div className="flex flex-col gap-6 py-4">
            {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                const isLocked = step.id > maxReached;

                return (
                    <div 
                        key={step.id} 
                        onClick={() => !isLocked && onJump(step.id)}
                        className={`flex items-start gap-4 relative ${isLocked ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                    >
                        {index < steps.length - 1 && (
                            <div className={`absolute left-[15px] top-8 bottom-[-24px] w-0.5 ${isCompleted ? 'bg-[#1a73e8]' : 'bg-[#dadce0]'} transition-colors duration-500`}></div>
                        )}
                        
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 z-10 transition-all duration-300 ${
                            isActive ? 'bg-[#1a73e8] border-[#1a73e8] text-white shadow-md' : 
                            isCompleted ? 'bg-[#1a73e8] border-[#1a73e8] text-white' : 
                            'bg-white border-[#dadce0] text-gray-400'
                        }`}>
                            {isCompleted ? <i className="fas fa-check text-[10px]"></i> : <span className="text-xs font-bold">{step.id}</span>}
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-[#1a73e8]' : 'text-gray-600'}`}>{step.title}</span>
                            <span className="text-[10px] text-gray-400 font-medium">{step.desc}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const SetupWizard: React.FC<SetupWizardProps> = ({
    user,
    onComplete,
    companyProfile,
    onAddProject,
    onAddUser,
    projects,
    users
}) => {
    const [step, setStep] = React.useState(1);
    const [maxStepReached, setMaxStepReached] = React.useState(1);
    const [showProjectModal, setShowProjectModal] = React.useState(false);
    const [showUserModal, setShowUserModal] = React.useState(false);
    const [enabledModules, setEnabledModules] = React.useState({ crm: true, erp: false });

    const handleNext = () => {
        const nextStep = step + 1;
        setStep(nextStep);
        if (nextStep > maxStepReached) setMaxStepReached(nextStep);
    };

    const handleJumpToStep = (targetStep: number) => {
        if (targetStep <= maxStepReached) setStep(targetStep);
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-[#f1f3f4] flex items-center justify-center p-4 selection:bg-[#e8f0fe] selection:text-[#1a73e8]">
            <div className="w-full h-full max-w-7xl bg-white rounded-2xl shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] flex overflow-hidden max-h-[95vh]">
                
                {/* GCP Sidebar */}
                <div className="w-64 bg-[#f8f9fa] border-r border-[#dadce0] flex flex-col flex-shrink-0">
                    <div className="p-8 border-b border-[#dadce0]">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#1a73e8] rounded flex items-center justify-center text-white shadow-sm">
                                <i className="fas fa-cube text-sm"></i>
                            </div>
                            <h1 className="text-xl font-bold text-[#202124] tracking-tight">Console</h1>
                        </div>
                        <p className="text-[10px] text-[#5f6368] font-bold uppercase tracking-tight mt-1 ml-11">Workspace Setup</p>
                    </div>
                    
                    <div className="flex-1 p-8">
                        <VerticalStepper currentStep={step} maxReached={maxStepReached} onJump={handleJumpToStep} />
                    </div>

                    <div className="p-6 border-t border-[#dadce0] bg-[#f1f3f4]/50">
                        <div className="flex items-center gap-3 text-[#5f6368]">
                             <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-sm">
                                {user.name.charAt(0)}
                             </div>
                             <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-[#202124] truncate">{user.name}</span>
                                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-tight">Project Owner</span>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col relative min-w-0">
                    <div className="flex-1 overflow-y-auto p-10 md:p-16 custom-scrollbar">
                        <div className="max-w-4xl mx-auto animate-fadeIn">
                            {step === 1 && (
                                <div className="space-y-8 py-10 text-center">
                                    <div className="relative inline-block">
                                        <div className="w-24 h-24 bg-[#e8f0fe] rounded-3xl flex items-center justify-center text-5xl text-[#1a73e8] shadow-inner mb-6">
                                            <i className="fas fa-rocket"></i>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center text-white text-xs">
                                            <i className="fas fa-check"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-medium text-[#202124] mb-3">Initialize your workspace</h2>
                                        <p className="text-lg text-[#5f6368] max-w-xl mx-auto leading-relaxed">
                                            Setup your identity, enable core product modules, and deploy your first project infrastructure.
                                        </p>
                                    </div>
                                    <div className="pt-10">
                                        <button 
                                            onClick={handleNext}
                                            className="px-10 py-3 rounded bg-[#1a73e8] text-white font-bold text-sm shadow-md hover:bg-[#174ea6] transition-all transform active:scale-95"
                                        >
                                            GET STARTED
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-10">
                                    <StepHeader title="Product Configuration" subtitle="Enable the architectural modules required for your enterprise." />
                                    
                                    <div className="grid grid-cols-1 gap-6">
                                        {/* LeadSarv Card */}
                                        <div 
                                            onClick={() => setEnabledModules(prev => ({...prev, crm: !prev.crm}))}
                                            className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex gap-6 ${enabledModules.crm ? 'border-[#1a73e8] bg-[#f8faff] shadow-md' : 'border-[#dadce0] hover:border-[#1a73e8]'}`}
                                        >
                                            <div className="flex-shrink-0">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${enabledModules.crm ? 'bg-[#1a73e8] text-white shadow-lg' : 'bg-[#f1f3f4] text-[#5f6368]'}`}>
                                                    <i className="fas fa-users-rays"></i>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="font-bold text-xl text-[#202124] mb-1">LeadSarv CRM</h3>
                                                        <p className="text-sm font-bold text-[#1a73e8]">₹3,999<span className="text-[10px] text-gray-500 font-medium uppercase ml-1">per month</span></p>
                                                    </div>
                                                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${enabledModules.crm ? 'bg-[#1a73e8] border-[#1a73e8] text-white' : 'border-[#dadce0]'}`}>
                                                        {enabledModules.crm && <i className="fas fa-check text-[10px]"></i>}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-[#5f6368] mb-4">Master lead ingestion, automated follow-ups, and RERA-compliant inventory management.</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                                                    {['Omnichannel Leads', 'RERA Booking Engine', 'WhatsApp API', 'Inventory Plan'].map(f => (
                                                        <div key={f} className="flex items-center gap-2 text-xs text-[#5f6368]">
                                                            <i className="fas fa-circle-check text-[#1a73e8]/70"></i> {f}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* ProjectSarv Card */}
                                        <div 
                                            onClick={() => setEnabledModules(prev => ({...prev, erp: !prev.erp}))}
                                            className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex gap-6 ${enabledModules.erp ? 'border-[#1a73e8] bg-[#f8faff] shadow-md' : 'border-[#dadce0] hover:border-[#1a73e8]'}`}
                                        >
                                            <div className="flex-shrink-0">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${enabledModules.erp ? 'bg-[#1a73e8] text-white shadow-lg' : 'bg-[#f1f3f4] text-[#5f6368]'}`}>
                                                    <i className="fas fa-hard-hat"></i>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="font-bold text-xl text-[#202124] mb-1">ProjectSarv ERP</h3>
                                                        <p className="text-sm font-bold text-[#1a73e8]">₹6,999<span className="text-[10px] text-gray-500 font-medium uppercase ml-1">per month</span></p>
                                                    </div>
                                                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${enabledModules.erp ? 'bg-[#1a73e8] border-[#1a73e8] text-white' : 'border-[#dadce0]'}`}>
                                                        {enabledModules.erp && <i className="fas fa-check text-[10px]"></i>}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-[#5f6368] mb-4">Comprehensive construction management from BOQ planning to final contractor settlement.</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                                                    {['Procurement PR/PO', 'Store Inventory', 'Contractor Ledger', 'DPR Reporting'].map(f => (
                                                        <div key={f} className="flex items-center gap-2 text-xs text-[#5f6368]">
                                                            <i className="fas fa-circle-check text-[#1a73e8]/70"></i> {f}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-8">
                                    <StepHeader title="Infrastructure" subtitle="Define the physical projects and developments in your portfolio." />
                                    <div className="grid grid-cols-1 gap-4">
                                        {projects.map(p => (
                                            <ResourceCard key={p.id} title={p.name} meta={p.location} tag={p.projectType} icon="fa-building" />
                                        ))}
                                        <button 
                                            onClick={() => setShowProjectModal(true)}
                                            className="p-6 border-2 border-dashed border-[#dadce0] rounded-xl flex items-center justify-center gap-3 text-[#5f6368] hover:border-[#1a73e8] hover:text-[#1a73e8] hover:bg-[#f8faff] transition-all group"
                                        >
                                            <i className="fas fa-plus-circle text-xl group-hover:scale-110 transition-transform"></i>
                                            <span className="font-bold text-sm uppercase tracking-wider">Register New Project</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-8">
                                    <StepHeader title="Identity & Access" subtitle="Provision accounts for your sales team, managers, and accountants." />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {users.map(u => (
                                            <ResourceCard key={u.id} title={u.name} meta={u.role} icon="fa-user-shield" accent={u.id === user.id} />
                                        ))}
                                        <button 
                                            onClick={() => setShowUserModal(true)}
                                            className="p-4 border-2 border-dashed border-[#dadce0] rounded-xl flex items-center justify-center gap-3 text-[#5f6368] hover:border-[#1a73e8] hover:text-[#1a73e8] hover:bg-[#f8faff] transition-all group"
                                        >
                                            <i className="fas fa-user-plus text-lg"></i>
                                            <span className="font-bold text-xs uppercase tracking-wider">Invite Member</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 5 && (
                                <div className="space-y-8 text-center py-10">
                                    <div className="w-24 h-24 bg-[#e6f4ea] text-[#1e8e3e] rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
                                        <i className="fas fa-check-double"></i>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-medium text-[#202124]">Deployment Successful</h2>
                                        <p className="text-lg text-[#5f6368] mt-2">Your workspace is now optimized for statutory compliance.</p>
                                    </div>
                                    <div className="pt-6">
                                        <button 
                                            onClick={onComplete}
                                            className="px-12 py-4 rounded bg-[#1a73e8] text-white font-bold text-lg shadow-xl hover:bg-[#174ea6] transition-all hover:-translate-y-1 active:scale-95"
                                        >
                                            LAUNCH DASHBOARD
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    {step > 1 && step < 5 && (
                        <div className="px-10 py-6 border-t border-[#dadce0] bg-white flex justify-between items-center">
                            <button 
                                onClick={() => setStep(step - 1)}
                                className="text-sm font-bold text-[#5f6368] hover:text-[#202124] uppercase tracking-wider"
                            >
                                Back
                            </button>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={onComplete}
                                    className="text-sm font-bold text-[#1a73e8] hover:underline uppercase tracking-wider px-4"
                                >
                                    Skip Setup
                                </button>
                                <button 
                                    onClick={handleNext}
                                    disabled={step === 3 && projects.length === 0}
                                    className={`px-8 py-2.5 rounded font-bold text-sm shadow-sm transition-all flex items-center gap-2 ${
                                        step === 3 && projects.length === 0 
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                        : 'bg-[#1a73e8] text-white hover:bg-[#174ea6] hover:shadow-md'
                                    }`}
                                >
                                    Continue <i className="fas fa-arrow-right text-[10px]"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Help Sidebar */}
                {helpContent[step] && (
                    <div className="w-80 bg-[#f8f9fa] border-l border-[#dadce0] p-8 hidden xl:block animate-fadeIn">
                        <div className="sticky top-0">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-yellow-400/20 text-yellow-600 flex items-center justify-center">
                                    <i className="fas fa-lightbulb"></i>
                                </div>
                                <h4 className="font-bold text-[#202124] text-sm uppercase tracking-wider">Guidance</h4>
                            </div>
                            <h3 className="text-lg font-medium text-[#202124] mb-3">{helpContent[step].title}</h3>
                            <p className="text-sm text-[#5f6368] leading-relaxed mb-8">{helpContent[step].description}</p>
                            
                            <h5 className="text-[10px] font-black text-[#5f6368] uppercase tracking-[0.2em] mb-4 pb-1 border-b border-[#dadce0]">Best Practices</h5>
                            <ul className="space-y-4">
                                {helpContent[step].tips.map((tip, i) => (
                                    <li key={i} className="flex gap-3 text-xs text-[#5f6368] leading-relaxed">
                                        <i className="fas fa-check-circle text-blue-500 mt-0.5"></i>
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            <NewProjectModal isOpen={showProjectModal} onClose={() => setShowProjectModal(false)} onAddProject={onAddProject} />
            <NewUserModal isOpen={showUserModal} onClose={() => setShowUserModal(false)} onAddUser={onAddUser} users={users} />
        </div>
    );
};

/* --- MINI COMPONENTS --- */

const StepHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
    <div className="mb-10">
        <h2 className="text-3xl font-medium text-[#202124] tracking-tight">{title}</h2>
        <p className="text-base text-[#5f6368] mt-2">{subtitle}</p>
    </div>
);

const ResourceCard: React.FC<{ title: string; meta: string; icon: string; tag?: string; accent?: boolean; small?: boolean }> = 
({ title, meta, icon, tag, accent, small }) => (
    <div className={`p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${accent ? 'border-[#1a73e8] bg-[#e8f0fe]' : 'border-[#dadce0] bg-white'}`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm ${accent ? 'bg-[#1a73e8] text-white shadow-lg shadow-blue-500/20' : 'bg-[#f1f3f4] text-[#5f6368]'}`}>
            <i className={`fas ${icon}`}></i>
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
                <h4 className={`font-bold truncate ${small ? 'text-xs' : 'text-sm'} text-[#202124]`}>{title}</h4>
                {tag && <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-[#1a73e8] border border-blue-200">{tag}</span>}
            </div>
            <p className="text-[10px] font-medium text-[#5f6368] uppercase tracking-tighter truncate mt-0.5">{meta}</p>
        </div>
    </div>
);

export default SetupWizard;
