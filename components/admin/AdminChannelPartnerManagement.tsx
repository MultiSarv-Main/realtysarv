
import React from 'react';
import { ChannelPartner, NewChannelPartnerData } from '../../types';
import NewChannelPartnerModal from './NewChannelPartnerModal';

interface AdminChannelPartnerManagementProps {
  partners: ChannelPartner[];
  onAddPartner: (data: NewChannelPartnerData) => void;
  onUpdatePartners: (updated: ChannelPartner[]) => void;
}

const StatCard: React.FC<{ label: string; value: string; icon: string; color: string }> = ({ label, value, icon, color }) => (
    <div className="bg-[var(--dark-bg)] p-4 rounded-lg border border-[var(--light-bg)] flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${color}`}>
            <i className={icon}></i>
        </div>
        <div>
            <p className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold text-[var(--text-primary)]">{value}</p>
        </div>
    </div>
);

const AdminChannelPartnerManagement: React.FC<AdminChannelPartnerManagementProps> = ({ partners, onAddPartner, onUpdatePartners }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [showNewModal, setShowNewModal] = React.useState(false);
    const [filterStatus, setFilterStatus] = React.useState<'All' | 'Active' | 'Inactive' | 'Pending'>('All');

    const safePartners = React.useMemo(() => partners || [], [partners]);

    const stats = React.useMemo(() => ({
        total: safePartners.length,
        active: safePartners.filter(p => p.status === 'Active').length,
        pending: safePartners.filter(p => p.status === 'Pending').length,
        leads: safePartners.reduce((sum, p) => sum + p.totalLeads, 0)
    }), [safePartners]);

    const filteredPartners = React.useMemo(() => {
        return safePartners.filter(p => {
            const matchesSearch = p.firmName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                p.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                p.reraNumber.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [safePartners, searchTerm, filterStatus]);

    const handleToggleStatus = (id: string) => {
        const updated = safePartners.map(p => {
            if (p.id === id) {
                return { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } as ChannelPartner;
            }
            return p;
        });
        onUpdatePartners(updated);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to remove this channel partner?")) {
            onUpdatePartners(safePartners.filter(p => p.id !== id));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Inactive': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    return (
        <div className="p-4 bg-[var(--medium-bg)] rounded-lg shadow-md h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Channel Partners</h3>
                <button
                    onClick={() => setShowNewModal(true)}
                    className="px-4 py-2 rounded-md bg-[var(--primary-color)] text-white font-medium hover:bg-[#128c7e] transition-colors flex items-center gap-2"
                >
                    <i className="fas fa-handshake"></i> Register New Partner
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Partners" value={stats.total.toString()} icon="fas fa-users" color="bg-blue-600" />
                <StatCard label="Active Partners" value={stats.active.toString()} icon="fas fa-check-double" color="bg-green-600" />
                <StatCard label="Pending Verif." value={stats.pending.toString()} icon="fas fa-user-clock" color="bg-yellow-600" />
                <StatCard label="Leads Sourced" value={stats.leads.toLocaleString()} icon="fas fa-magnet" color="bg-purple-600" />
            </div>

            {/* Filters */}
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search by Firm, Contact or RERA No..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-9 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] text-sm"
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"></i>
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="p-2 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] text-sm"
                >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            {/* Partner Table */}
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[var(--border-color)]">
                        <thead className="bg-[var(--dark-bg)] text-[var(--text-secondary)]">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Partner Details</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">RERA No.</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Performance</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Commission</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {filteredPartners.map((cp) => (
                                <tr key={cp.id} className="hover:bg-[var(--dark-bg)] transition-colors">
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="font-bold text-[var(--text-primary)]">{cp.firmName}</div>
                                        <div className="text-xs text-[var(--text-secondary)]">{cp.contactPerson}</div>
                                        <div className="text-[10px] text-[var(--text-secondary)] mt-1 opacity-70">{cp.email} • {cp.phone}</div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap font-mono text-xs text-[var(--text-secondary)]">
                                        {cp.reraNumber}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-[var(--text-primary)] font-semibold">{cp.totalLeads} Leads</span>
                                            <span className="text-[10px] text-green-500 font-bold">{cp.totalConversions} Closures</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(cp.status)}`}>
                                            {cp.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-[var(--text-primary)] font-bold">
                                        {cp.commissionRate}%
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-xs font-medium">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleToggleStatus(cp.id)}
                                                className={`p-1.5 rounded bg-[var(--medium-bg)] border border-[var(--light-bg)] hover:border-[var(--primary-color)] transition-colors ${cp.status === 'Active' ? 'text-yellow-500' : 'text-green-500'}`}
                                                title={cp.status === 'Active' ? 'Deactivate' : 'Activate'}
                                            >
                                                <i className={`fas ${cp.status === 'Active' ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                                            </button>
                                            <button 
                                                className="p-1.5 rounded bg-[var(--medium-bg)] border border-[var(--light-bg)] hover:border-blue-500 text-blue-400 transition-colors"
                                                title="View Ledger"
                                                onClick={() => alert(`Opening commission ledger for ${cp.firmName}...`)}
                                            >
                                                <i className="fas fa-file-invoice"></i>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(cp.id)}
                                                className="p-1.5 rounded bg-[var(--medium-bg)] border border-[var(--light-bg)] hover:border-red-500 text-red-400 transition-colors"
                                                title="Delete"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredPartners.length === 0 && (
                    <div className="text-center py-10 opacity-60">
                        <i className="fas fa-search text-3xl mb-2"></i>
                        <p>No partners found matching criteria.</p>
                    </div>
                )}
            </div>

            <NewChannelPartnerModal 
                isOpen={showNewModal} 
                onClose={() => setShowNewModal(false)} 
                onAdd={onAddPartner} 
            />
        </div>
    );
};

export default AdminChannelPartnerManagement;
