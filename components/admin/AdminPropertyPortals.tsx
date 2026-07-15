
import React from 'react';

interface PortalItem {
    id: string;
    label: string;
    icon: string; // FontAwesome class
    color: string;
    features: string[];
    status: 'Connected' | 'Not Connected' | 'Coming Soon';
}

const PORTALS: PortalItem[] = [
    { id: '99acres', label: '99acres', icon: 'fas fa-building', color: 'text-blue-600', features: ['Inventory Sync', 'Lead Fetching'], status: 'Connected' },
    { id: 'magicbricks', label: 'MagicBricks', icon: 'fas fa-cube', color: 'text-red-600', features: ['Inventory Sync', 'Lead Fetching'], status: 'Connected' },
    { id: 'housing', label: 'Housing.com', icon: 'fas fa-home', color: 'text-purple-600', features: ['Inventory Sync', 'Lead Fetching'], status: 'Not Connected' },
    { id: 'nobroker', label: 'NoBroker', icon: 'fas fa-hand-holding-usd', color: 'text-green-600', features: ['Lead Fetching'], status: 'Not Connected' },
    { id: 'makaan', label: 'Makaan.com', icon: 'fas fa-map-marker-alt', color: 'text-red-500', features: ['Lead Fetching'], status: 'Coming Soon' },
    { id: 'commonfloor', label: 'Commonfloor', icon: 'fas fa-layer-group', color: 'text-orange-500', features: ['Inventory Sync'], status: 'Coming Soon' },
    { id: 'proptiger', label: 'Proptiger', icon: 'fas fa-tiger', color: 'text-yellow-600', features: ['Lead Fetching'], status: 'Coming Soon' },
    { id: 'olx', label: 'OLX Real Estate', icon: 'fas fa-ad', color: 'text-teal-600', features: ['Lead Fetching'], status: 'Not Connected' },
    { id: 'quikr', label: 'QuikrHomes', icon: 'fas fa-bolt', color: 'text-blue-400', features: ['Lead Fetching'], status: 'Coming Soon' },
];

const PortalCard: React.FC<{ item: PortalItem }> = ({ item }) => (
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
            <h4 className="font-bold text-[var(--text-primary)] text-base mb-2">{item.label}</h4>
            <div className="flex flex-wrap gap-2 mb-4">
                {item.features.map(feature => (
                    <span key={feature} className="text-[10px] bg-[var(--medium-bg)] text-[var(--text-secondary)] px-2 py-1 rounded border border-[var(--light-bg)]">
                        {feature}
                    </span>
                ))}
            </div>
        </div>
        <div className="flex gap-2">
             <button 
                className={`flex-1 py-2 rounded-md text-xs font-bold transition-colors ${
                    item.status === 'Coming Soon' 
                    ? 'bg-[var(--light-bg)] text-[var(--text-secondary)] cursor-not-allowed opacity-60' 
                    : 'bg-[var(--medium-bg)] text-[var(--text-primary)] hover:bg-[var(--primary-color)] hover:text-white border border-[var(--light-bg)] group-hover:border-[var(--primary-color)]'
                }`}
                disabled={item.status === 'Coming Soon'}
                onClick={() => alert(`Configuring ${item.label}...`)}
            >
                {item.status === 'Connected' ? 'Settings' : 'Connect'}
            </button>
             {item.status === 'Connected' && (
                <button 
                    className="w-8 flex items-center justify-center rounded-md bg-[var(--medium-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)] border border-[var(--light-bg)]"
                    title="Sync Now"
                    onClick={() => alert(`Syncing ${item.label}...`)}
                >
                    <i className="fas fa-sync-alt"></i>
                </button>
            )}
        </div>
    </div>
);

const AdminPropertyPortals: React.FC = () => {
    return (
        <div className="p-4 bg-[var(--medium-bg)] rounded-lg shadow-md h-full overflow-hidden flex flex-col">
            <div className="flex-shrink-0 mb-6">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Property Portal Integrations</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Sync inventory availability, prices, and fetch leads automatically from major real estate portals.</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {PORTALS.map(item => <PortalCard key={item.id} item={item} />)}
                </div>
                
                <div className="mt-8 p-6 bg-[var(--dark-bg)] rounded-lg border border-[var(--light-bg)]">
                    <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2 border-b border-[var(--light-bg)] pb-2">
                        <i className="fas fa-cogs text-[var(--primary-color)]"></i> Global Portal Settings
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center justify-between p-3 rounded bg-[var(--medium-bg)] border border-[var(--light-bg)] cursor-pointer hover:border-[var(--primary-color)] transition-colors">
                            <span className="text-sm text-[var(--text-secondary)]">Auto-sync Inventory (Daily)</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
                            </div>
                        </label>
                        <label className="flex items-center justify-between p-3 rounded bg-[var(--medium-bg)] border border-[var(--light-bg)] cursor-pointer hover:border-[var(--primary-color)] transition-colors">
                            <span className="text-sm text-[var(--text-secondary)]">Fetch Leads Every 15 mins</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
                            </div>
                        </label>
                         <label className="flex items-center justify-between p-3 rounded bg-[var(--medium-bg)] border border-[var(--light-bg)] cursor-pointer hover:border-[var(--primary-color)] transition-colors">
                            <span className="text-sm text-[var(--text-secondary)]">Auto-Assign Source based on Portal</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
                            </div>
                        </label>
                         <label className="flex items-center justify-between p-3 rounded bg-[var(--medium-bg)] border border-[var(--light-bg)] cursor-pointer hover:border-[var(--primary-color)] transition-colors">
                            <span className="text-sm text-[var(--text-secondary)]">Send Auto-Response to Portal Leads</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPropertyPortals;
