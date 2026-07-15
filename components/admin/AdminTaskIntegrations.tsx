
import React from 'react';

interface ProviderItem {
    id: string;
    label: string;
    icon: string;
    color: string;
    status: 'Connected' | 'Not Connected' | 'Coming Soon';
    description: string;
}

const TASK_PROVIDERS: ProviderItem[] = [
    { id: 'trello', label: 'Trello', icon: 'fab fa-trello', color: 'text-blue-600', status: 'Connected', description: 'Kanban-style project management.' },
    { id: 'asana', label: 'Asana', icon: 'fas fa-check-circle', color: 'text-pink-500', status: 'Not Connected', description: 'Work management platform.' },
    { id: 'jira', label: 'Jira Software', icon: 'fab fa-jira', color: 'text-blue-500', status: 'Connected', description: 'Issue & project tracking.' },
    { id: 'monday', label: 'Monday.com', icon: 'fas fa-table', color: 'text-yellow-500', status: 'Not Connected', description: 'Work OS for workflow automation.' },
    { id: 'clickup', label: 'ClickUp', icon: 'fas fa-layer-group', color: 'text-purple-500', status: 'Coming Soon', description: 'All-in-one productivity platform.' },
    { id: 'basecamp', label: 'Basecamp', icon: 'fas fa-campground', color: 'text-green-600', status: 'Coming Soon', description: 'Real-time communication tool.' },
];

const ProviderCard: React.FC<{ item: ProviderItem }> = ({ item }) => (
    <div className="bg-[var(--dark-bg)] p-4 rounded-lg border border-[var(--light-bg)] flex flex-col justify-between hover:border-[var(--primary-color)] transition-colors group">
        <div>
            <div className="flex justify-between items-start mb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-[var(--medium-bg)] ${item.color} text-2xl shadow-sm border border-[var(--light-bg)]`}>
                    <i className={item.icon}></i>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    item.status === 'Connected' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                    item.status === 'Coming Soon' ? 'bg-gray-500/10 text-gray-500 border-gray-500/20' :
                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                }`}>
                    {item.status}
                </span>
            </div>
            <h4 className="font-bold text-[var(--text-primary)] text-base mb-1">{item.label}</h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed h-8 overflow-hidden">{item.description}</p>
        </div>
        <button 
            className={`mt-4 w-full py-2 rounded-md text-xs font-bold transition-colors ${
                item.status === 'Coming Soon' 
                ? 'bg-[var(--light-bg)] text-[var(--text-secondary)] cursor-not-allowed opacity-60' 
                : 'bg-[var(--medium-bg)] text-[var(--text-primary)] hover:bg-[var(--primary-color)] hover:text-white border border-[var(--light-bg)] group-hover:border-[var(--primary-color)]'
            }`}
            disabled={item.status === 'Coming Soon'}
            onClick={() => alert(`Configuration for ${item.label} coming soon!`)}
        >
            {item.status === 'Connected' ? 'Configure' : 'Connect'}
        </button>
    </div>
);

const FeatureToggle: React.FC<{ label: string; description: string }> = ({ label, description }) => (
    <div className="flex items-center justify-between p-3 rounded bg-[var(--dark-bg)] border border-[var(--light-bg)] hover:border-[var(--primary-color)] transition-colors">
        <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{label}</p>
            <p className="text-xs text-[var(--text-secondary)]">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
        </label>
    </div>
);

const AdminTaskIntegrations: React.FC = () => {
    return (
        <div className="p-4 bg-[var(--medium-bg)] rounded-lg shadow-md h-full overflow-hidden flex flex-col">
            <div className="flex-shrink-0 mb-6">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Project & Task Management</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Integrate external project management tools for advanced workflow handling and support ticketing.</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8">
                
                {/* Global Settings */}
                <div className="p-6 bg-[var(--medium-bg)]/50 border border-[var(--light-bg)] rounded-lg">
                    <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <i className="fas fa-sliders-h text-[var(--primary-color)]"></i> Workflow Automation Features
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FeatureToggle label="CRM Ticketing Sync" description="Convert support requests into external tickets." />
                        <FeatureToggle label="Workflow State Mapping" description="Map CRM deal stages to Kanban columns." />
                        <FeatureToggle label="Support Escalations" description="Auto-create high-priority tasks for overdue items." />
                        <FeatureToggle label="Two-Way Task Sync" description="Sync CRM tasks with external provider tasks." />
                        <FeatureToggle label="New Lead Board Card" description="Create a card on Trello/Asana for every new lead." />
                        <FeatureToggle label="Document Attachment Sync" description="Upload CRM docs to task attachments." />
                    </div>
                </div>

                {/* Providers List */}
                <div>
                    <h4 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2 border-b border-[var(--light-bg)] pb-2">
                        <i className="fas fa-tasks text-[var(--primary-color)]"></i> Supported Platforms
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {TASK_PROVIDERS.map(item => <ProviderCard key={item.id} item={item} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTaskIntegrations;
