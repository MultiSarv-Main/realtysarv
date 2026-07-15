
import React from 'react';

interface IntegrationItem {
    id: string;
    label: string;
    icon: string;
    color: string;
    description: string;
    status: 'Connected' | 'Not Connected' | 'Coming Soon';
    navTarget?: string;
}

const LEAD_SOURCES: IntegrationItem[] = [
    { id: 'fb-ads', label: 'Facebook Lead Ads', icon: 'fab fa-facebook-f', color: 'text-blue-600', description: 'Sync leads from FB forms.', status: 'Connected', navTarget: 'meta' },
    { id: 'insta-ads', label: 'Instagram Lead Ads', icon: 'fab fa-instagram', color: 'text-pink-600', description: 'Sync leads from IG forms.', status: 'Connected', navTarget: 'meta' },
    { id: 'google-ads', label: 'Google Ads Forms', icon: 'fab fa-google', color: 'text-red-500', description: 'Capture leads from search ads.', status: 'Not Connected', navTarget: 'google' },
    { id: 'gmb', label: 'Google Business Profile', icon: 'fas fa-store', color: 'text-blue-500', description: 'Leads from maps & search.', status: 'Not Connected' },
    { id: 'website', label: 'Website Enquiry Forms', icon: 'fas fa-globe', color: 'text-green-500', description: 'API/Webhook integration.', status: 'Connected', navTarget: 'custom' },
    { id: 'landing-page', label: 'Landing Page Forms', icon: 'fas fa-laptop-code', color: 'text-purple-500', description: 'Capture from campaigns.', status: 'Not Connected' },
    { id: 'chatbot', label: 'Chatbot Lead Capture', icon: 'fas fa-robot', color: 'text-indigo-500', description: 'Automated chat leads.', status: 'Coming Soon' },
    { id: 'qr-code', label: 'QR Code Capture', icon: 'fas fa-qrcode', color: 'text-gray-700', description: 'Physical marketing leads.', status: 'Not Connected' },
    { id: 'whatsapp-chat', label: 'WhatsApp Click-to-Chat', icon: 'fab fa-whatsapp', color: 'text-green-500', description: 'Direct chat entry.', status: 'Connected', navTarget: 'whatsapp' },
    { id: 'email-parse', label: 'Email Parsing', icon: 'fas fa-envelope-open-text', color: 'text-yellow-600', description: 'Extract leads from emails.', status: 'Not Connected', navTarget: 'email' },
    { id: 'broker-app', label: 'Broker/Partner Apps', icon: 'fas fa-handshake', color: 'text-orange-500', description: 'External partner feeds.', status: 'Coming Soon' },
    { id: 'cp-portal', label: 'Channel Partner Portal', icon: 'fas fa-network-wired', color: 'text-cyan-500', description: 'Partner submissions.', status: 'Coming Soon' },
];

const LEAD_DISTRIBUTION: IntegrationItem[] = [
    { id: 'round-robin', label: 'Round Robin API', icon: 'fas fa-circle-notch', color: 'text-blue-400', description: 'Distribute leads evenly.', status: 'Connected', navTarget: 'custom' },
    { id: 'auto-alloc', label: 'Auto Allocation Engine', icon: 'fas fa-cogs', color: 'text-gray-500', description: 'Rule-based assignment.', status: 'Not Connected' },
    { id: 'call-center', label: 'Call Center Push', icon: 'fas fa-headset', color: 'text-red-400', description: 'Send to dialer systems.', status: 'Coming Soon' },
];

interface AdminLeadIntegrationsProps {
    onNavigate: (subId: string) => void;
}

const IntegrationCard: React.FC<{ item: IntegrationItem; onNavigate: (target: string) => void }> = ({ item, onNavigate }) => (
    <div className="bg-[var(--dark-bg)] p-4 rounded-lg border border-[var(--light-bg)] flex flex-col justify-between hover:border-[var(--primary-color)] transition-colors group">
        <div>
            <div className="flex justify-between items-start mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-[var(--medium-bg)] ${item.color} text-xl shadow-sm border border-[var(--light-bg)]`}>
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
            <h4 className="font-bold text-[var(--text-primary)] text-sm mb-1">{item.label}</h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed h-8 overflow-hidden">{item.description}</p>
        </div>
        <button 
            className={`mt-4 w-full py-2 rounded-md text-xs font-bold transition-colors ${
                item.status === 'Coming Soon' 
                ? 'bg-[var(--light-bg)] text-[var(--text-secondary)] cursor-not-allowed opacity-60' 
                : 'bg-[var(--medium-bg)] text-[var(--text-primary)] hover:bg-[var(--primary-color)] hover:text-white border border-[var(--light-bg)] group-hover:border-[var(--primary-color)]'
            }`}
            disabled={item.status === 'Coming Soon'}
            onClick={() => item.navTarget ? onNavigate(item.navTarget) : alert(`Configuration for ${item.label} coming soon!`)}
        >
            {item.status === 'Connected' ? 'Manage' : 'Connect'}
        </button>
    </div>
);

const AdminLeadIntegrations: React.FC<AdminLeadIntegrationsProps> = ({ onNavigate }) => {
    return (
        <div className="p-4 bg-[var(--medium-bg)] rounded-lg shadow-md h-full overflow-hidden flex flex-col">
            <div className="flex-shrink-0 mb-6">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Lead Acquisition & Management</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Manage incoming lead sources and automated distribution rules.</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="mb-8">
                    <h4 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2 border-b border-[var(--light-bg)] pb-2">
                        <i className="fas fa-inbox text-[var(--primary-color)]"></i> Lead Source Integrations
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {LEAD_SOURCES.map(item => <IntegrationCard key={item.id} item={item} onNavigate={onNavigate} />)}
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2 border-b border-[var(--light-bg)] pb-2">
                        <i className="fas fa-share-alt text-[var(--primary-color)]"></i> Lead Distribution Integrations
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {LEAD_DISTRIBUTION.map(item => <IntegrationCard key={item.id} item={item} onNavigate={onNavigate} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLeadIntegrations;
