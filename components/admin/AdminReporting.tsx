import React from 'react';
import { Lead, Project } from '../../types';
import LeadAnalytics from './reporting/LeadAnalytics';
import SalesAnalytics from './reporting/SalesAnalytics';
import ProjectAnalytics from './reporting/ProjectAnalytics';
import TeamPerformance from './reporting/TeamPerformance';

interface AdminReportingProps {
  leads: Lead[];
  projects: Project[];
}

type ReportingTab = 'lead' | 'sales' | 'project' | 'team';

const TabButton: React.FC<{ icon: string; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            isActive
                ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
    >
        <i className={icon}></i>
        <span>{label}</span>
    </button>
);

const AdminReporting: React.FC<AdminReportingProps> = ({ leads, projects }) => {
    const [activeTab, setActiveTab] = React.useState<ReportingTab>('lead');

    const renderContent = () => {
        switch (activeTab) {
            case 'lead':
                return <LeadAnalytics leads={leads} projects={projects} />;
            case 'sales':
                return <SalesAnalytics leads={leads} />;
            case 'project':
                return <ProjectAnalytics leads={leads} projects={projects} />;
            case 'team':
                return <TeamPerformance leads={leads} />;
            default:
                return null;
        }
    };

    return (
        <div className="h-full flex flex-col gap-6">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Reporting & Analytics</h3>
             </div>

            <div className="border-b border-[var(--light-bg)]">
                <nav className="flex flex-wrap -mb-px">
                    <TabButton icon="fas fa-users" label="Lead Analytics" isActive={activeTab === 'lead'} onClick={() => setActiveTab('lead')} />
                    <TabButton icon="fas fa-dollar-sign" label="Sales Analytics" isActive={activeTab === 'sales'} onClick={() => setActiveTab('sales')} />
                    <TabButton icon="fas fa-building" label="Project Analytics" isActive={activeTab === 'project'} onClick={() => setActiveTab('project')} />
                    <TabButton icon="fas fa-user-friends" label="Team Performance" isActive={activeTab === 'team'} onClick={() => setActiveTab('team')} />
                </nav>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 animate-fadeIn">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminReporting;
