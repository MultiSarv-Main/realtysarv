
import React from 'react';
import { Project, FacebookPage, FacebookForm, FacebookLeadRaw, Lead, User } from '../../types';

interface AdminDigitalMarketingProps {
  activeItem: string;
  projects: Project[];
  users: User[];
}

const CRM_FIELDS = [
    { key: 'name', label: 'Full Name', icon: 'fas fa-user', type: 'string' },
    { key: 'email', label: 'Email Address', icon: 'fas fa-envelope', type: 'email' },
    { key: 'phone', label: 'Phone Number', icon: 'fas fa-phone', type: 'phone' },
    { key: 'budget', label: 'Budget', icon: 'fas fa-wallet', type: 'string' },
    { key: 'preferredLocation', label: 'Preferred Location', icon: 'fas fa-map-marker-alt', type: 'string' },
    { key: 'message', label: 'Notes / Message', icon: 'fas fa-comment-alt', type: 'text' },
];

const MOCK_LEAD_DATA: Record<string, FacebookLeadRaw[]> = {
    'form_1': [
        { id: 'l_001', created_time: new Date().toISOString(), form_id: 'form_1', field_data: [{ name: 'full_name', values: ['Alice Johnson'] }, { name: 'email', values: ['alice@example.com'] }, { name: 'phone_number', values: ['+15550199'] }, { name: 'city', values: ['Downtown'] }, { name: 'budget_select', values: ['$750k'] }] },
        { id: 'l_002', created_time: new Date(Date.now() - 86400000).toISOString(), form_id: 'form_1', field_data: [{ name: 'full_name', values: ['Bob Smith'] }, { name: 'email', values: ['bob@test.com'] }, { name: 'phone_number', values: ['+15550200'] }, { name: 'city', values: ['Suburbs'] }, { name: 'budget_select', values: ['$1M+'] }] },
    ],
    'form_2': [
        { id: 'l_003', created_time: new Date().toISOString(), form_id: 'form_2', field_data: [{ name: 'name', values: ['Charlie Brown'] }, { name: 'user_email', values: ['charlie@peanuts.com'] }] }
    ]
};

const MockGraphAPI = {
    login: () => new Promise<{accessToken: string, userID: string}>(resolve => setTimeout(() => resolve({ accessToken: 'mock_access_token_123', userID: '8837462910' }), 1500)),
    getPages: () => new Promise<FacebookPage[]>(resolve => setTimeout(() => resolve([
        {
            id: '1001',
            name: 'LeadSarv Realty',
            category: 'Real Estate Agent',
            imageUrl: 'https://ui-avatars.com/api/?name=LeadSarv+Realty&background=1877F2&color=fff',
            forms: [
                { 
                    id: 'form_1', 
                    name: 'Summer Villa Inquiry', 
                    status: 'ACTIVE', 
                    leadCount: 124, 
                    mappedProjectId: '', 
                    mappedUserId: '',
                    isSyncing: false,
                    fields: [
                        { key: 'full_name', label: 'Full Name', example: 'John Doe' },
                        { key: 'email', label: 'Email', example: 'john@example.com' },
                        { key: 'phone_number', label: 'Phone Number', example: '+1 555 0123' },
                        { key: 'city', label: 'City', example: 'New York' },
                        { key: 'budget_select', label: 'Your Budget', example: '$500k - $1M' }
                    ],
                    fieldMapping: {
                        'full_name': 'name',
                        'email': 'email',
                        'phone_number': 'phone'
                    }
                },
                { 
                    id: 'form_2', 
                    name: 'Downtown Apartment Interest', 
                    status: 'ACTIVE', 
                    leadCount: 85, 
                    mappedProjectId: '', 
                    mappedUserId: '',
                    isSyncing: false,
                    fields: [
                        { key: 'name', label: 'Name', example: 'Jane Smith' },
                        { key: 'user_email', label: 'User Email', example: 'jane@test.com' }
                    ],
                    fieldMapping: {}
                }
            ]
        }
    ]), 1000)),
    getLeads: (formId: string) => new Promise<FacebookLeadRaw[]>(resolve => setTimeout(() => resolve(MOCK_LEAD_DATA[formId] || []), 800))
};

const LeadsSheetModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    form: FacebookForm;
    rawLeads: FacebookLeadRaw[];
}> = ({ isOpen, onClose, form, rawLeads }) => {
    const processedLeads = React.useMemo(() => {
        return (rawLeads || []).map(raw => {
            const processed: any = { id: `fb_${raw.id}`, leadSource: 'Facebook Ads', leadDate: raw.created_time.split('T')[0], leadStatus: 'New' };
            raw.field_data.forEach(field => {
                const crmField = form.fieldMapping[field.name];
                if (crmField && field.values.length > 0) processed[crmField] = field.values[0];
            });
            if (!processed.name) processed.name = 'Unknown Lead';
            return processed;
        });
    }, [rawLeads, form.fieldMapping]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4 animate-fadeIn backdrop-blur-sm">
             <div className="bg-[var(--medium-bg)] rounded-xl shadow-2xl w-full max-w-6xl border border-[var(--light-bg)] flex flex-col h-[85vh]">
                <div className="p-6 border-b border-[var(--light-bg)] flex justify-between items-center bg-[var(--dark-bg)] rounded-t-xl">
                    <div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                            <i className="fab fa-facebook text-[#1877F2]"></i> Leads from "{form.name}"
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[var(--light-bg)] text-[var(--text-primary)] sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Name (Mapped)</th>
                                <th className="p-4 font-semibold">Email (Mapped)</th>
                                <th className="p-4 font-semibold">Phone (Mapped)</th>
                                <th className="p-4 font-semibold">Other Fields</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--light-bg)]">
                            {processedLeads.map((lead: any) => (
                                <tr key={lead.id} className="hover:bg-[var(--dark-bg)] transition-colors">
                                    <td className="p-4 text-[var(--text-secondary)] font-mono text-xs">{lead.leadDate}</td>
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{lead.name}</td>
                                    <td className="p-4 text-[var(--text-secondary)]">{lead.email || 'N/A'}</td>
                                    <td className="p-4 text-[var(--text-secondary)]">{lead.phone || 'N/A'}</td>
                                    <td className="p-4 text-xs text-[var(--text-secondary)]">
                                        {Object.entries(lead).map(([k, v]) => {
                                            if (['id', 'name', 'email', 'phone', 'leadSource', 'leadDate', 'leadStatus'].includes(k)) return null;
                                            return <span key={k} className="inline-block bg-[var(--light-bg)] px-2 py-1 rounded mr-2 mb-1">{k}: {String(v)}</span>;
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
    );
};

const MappingModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    form: FacebookForm; 
    onSave: (formId: string, mapping: Record<string, string>) => void; 
}> = ({ isOpen, onClose, form, onSave }) => {
    const [mapping, setMapping] = React.useState<Record<string, string>>(form.fieldMapping || {});
    const handleMapChange = (fbFieldKey: string, crmFieldKey: string) => setMapping(prev => ({ ...prev, [fbFieldKey]: crmFieldKey }));
    const handleSave = () => { onSave(form.id, mapping); onClose(); };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4 animate-fadeIn backdrop-blur-sm">
            <div className="bg-[var(--medium-bg)] rounded-xl shadow-2xl w-full max-w-4xl border border-[var(--light-bg)] flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-[var(--light-bg)] flex justify-between items-center bg-[var(--dark-bg)] rounded-t-xl">
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Map Facebook Fields</h3>
                    <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><i className="fas fa-times text-xl"></i></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 bg-[var(--medium-bg)]">
                    <div className="space-y-4">
                        {(form.fields || []).map((fbField) => (
                            <div key={fbField.key} className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-lg border bg-[var(--dark-bg)] border-[var(--light-bg)]">
                                <div className="flex-1 w-full">
                                    <p className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-1">Facebook Field</p>
                                    <p className="text-sm font-semibold text-[var(--text-primary)]">{fbField.label}</p>
                                </div>
                                <div className="text-[var(--text-secondary)]"><i className="fas fa-arrow-right"></i></div>
                                <div className="flex-1 w-full">
                                    <p className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-1">CRM Field</p>
                                    <select
                                        value={mapping[fbField.key] || ''}
                                        onChange={(e) => handleMapChange(fbField.key, e.target.value)}
                                        className="w-full p-2.5 rounded-md border bg-[var(--medium-bg)] border-[var(--light-bg)] text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--primary-color)]"
                                    >
                                        <option value="">-- Ignore Field --</option>
                                        {CRM_FIELDS.map(field => <option key={field.key} value={field.key}>{field.label}</option>)}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-6 border-t border-[var(--light-bg)] bg-[var(--dark-bg)] rounded-b-xl flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg border border-[var(--light-bg)] text-[var(--text-secondary)] font-medium">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-[var(--primary-color)] text-white font-bold hover:bg-[#128c7e] transition-all">Save Mapping</button>
                </div>
            </div>
        </div>
    );
};

const AdminDigitalMarketing: React.FC<AdminDigitalMarketingProps> = ({ activeItem, projects, users }) => {
    const [isFbConnected, setIsFbConnected] = React.useState(false);
    const [isFbLoading, setIsFbLoading] = React.useState(false);
    const [fbPages, setFbPages] = React.useState<FacebookPage[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [editingForm, setEditingForm] = React.useState<{ pageId: string; form: FacebookForm } | null>(null);
    const [viewingLeadsForm, setViewingLeadsForm] = React.useState<{ form: FacebookForm; leads: FacebookLeadRaw[] } | null>(null);
    const [activeTab, setActiveTab] = React.useState<'forms' | 'webhooks' | 'logs'>('forms');

    const handleFacebookLogin = async () => {
        setIsFbLoading(true);
        try {
            const authData = await MockGraphAPI.login();
            if (authData.accessToken) {
                const pages = await MockGraphAPI.getPages();
                setFbPages(pages);
                setIsFbConnected(true);
            }
        } finally {
            setIsFbLoading(false);
        }
    };

    const handleMappingChange = (pageId: string, formId: string, field: 'mappedProjectId' | 'mappedUserId', value: string) => {
        setFbPages(prev => (prev || []).map(page => page.id === pageId ? { ...page, forms: (page.forms || []).map(form => form.id === formId ? { ...form, [field]: value } : form) } : page));
    };

    const handleFieldMappingSave = (formId: string, mapping: Record<string, string>) => {
         if (!editingForm) return;
         setFbPages(prev => (prev || []).map(page => page.id === editingForm.pageId ? { ...page, forms: (page.forms || []).map(form => form.id === formId ? { ...form, fieldMapping: mapping } : form) } : page));
         setEditingForm(null);
    };

    const toggleSync = (pageId: string, formId: string) => {
        setFbPages(prev => (prev || []).map(page => page.id === pageId ? { ...page, forms: (page.forms || []).map(form => form.id === formId ? { ...form, isSyncing: !form.isSyncing } : form) } : page));
    };

    const handleFetchLeads = async (form: FacebookForm) => {
        const leads = await MockGraphAPI.getLeads(form.id);
        setViewingLeadsForm({ form, leads });
    };

    const filteredPages = React.useMemo(() => {
        const safePages = fbPages || [];
        if (!searchTerm) return safePages;
        return safePages.map(page => ({ 
            ...page, 
            forms: (page.forms || []).filter(form => form.name.toLowerCase().includes(searchTerm.toLowerCase())) 
        })).filter(page => (page.forms || []).length > 0);
    }, [fbPages, searchTerm]);

    const renderFormsView = () => (
        <div className="space-y-6">
            <div className="relative">
                <input type="text" placeholder="Search forms..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 pl-10 rounded-lg bg-[var(--dark-bg)] border border-[var(--light-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]" />
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"></i>
            </div>
            <div className="space-y-6">
                {filteredPages.map(page => (
                    <div key={page.id} className="border border-[var(--light-bg)] rounded-xl overflow-hidden bg-[var(--medium-bg)] shadow-sm">
                        <div className="p-4 bg-[var(--dark-bg)] border-b border-[var(--light-bg)] flex items-center gap-3">
                            <img src={page.imageUrl} alt={page.name} className="w-10 h-10 rounded-lg shadow-sm" />
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)]">{page.name}</h3>
                                <p className="text-xs text-[var(--text-secondary)] uppercase font-semibold">{page.category}</p>
                            </div>
                        </div>
                        <div className="divide-y divide-[var(--light-bg)]">
                            {(page.forms || []).map(form => (
                                <div key={form.id} className="p-4 flex flex-col xl:flex-row xl:items-center gap-6">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-[var(--text-primary)] truncate text-base">{form.name}</p>
                                        <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] mt-1">
                                            <span>ID: <span className="font-mono">{form.id}</span></span>
                                            <span className="flex items-center gap-1"><i className="fas fa-users"></i> {form.leadCount} Leads</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <button onClick={() => setEditingForm({ pageId: page.id, form })} className="px-4 py-2 rounded-lg border border-[var(--light-bg)] text-xs font-bold text-[var(--text-primary)] hover:border-[var(--primary-color)]">
                                            {Object.keys(form.fieldMapping || {}).length > 0 ? `${Object.keys(form.fieldMapping).length} Mapped` : 'Map Fields'}
                                        </button>
                                        <select value={form.mappedProjectId} onChange={(e) => handleMappingChange(page.id, form.id, 'mappedProjectId', e.target.value)} className="bg-[var(--dark-bg)] border border-[var(--light-bg)] text-[var(--text-primary)] text-xs p-2 rounded-lg focus:border-[var(--primary-color)] outline-none">
                                            <option value="">-- Project --</option>
                                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                        <select value={form.mappedUserId} onChange={(e) => handleMappingChange(page.id, form.id, 'mappedUserId', e.target.value)} className="bg-[var(--dark-bg)] border border-[var(--light-bg)] text-[var(--text-primary)] text-xs p-2 rounded-lg focus:border-[var(--primary-color)] outline-none">
                                            <option value="">-- Assign Owner --</option>
                                            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                        </select>
                                        <button onClick={() => handleFetchLeads(form)} className="p-2.5 rounded-lg bg-[var(--dark-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)] border border-[var(--light-bg)]" title="Preview Leads"><i className="fas fa-table"></i></button>
                                        <div className="flex items-center gap-3 pl-3 border-l border-[var(--light-bg)]">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" checked={form.isSyncing} onChange={() => toggleSync(page.id, form.id)} />
                                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderWebhooksView = () => (
        <div className="space-y-6 bg-[var(--dark-bg)] p-8 rounded-xl border border-[var(--light-bg)] shadow-inner">
            <div>
                <h5 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2 mb-2">
                    <i className="fas fa-plug text-[var(--primary-color)]"></i> Webhook Endpoint Configuration
                </h5>
                <p className="text-sm text-[var(--text-secondary)]">Use these credentials in your Facebook App's Webhooks dashboard to enable real-time lead ingestion.</p>
            </div>
            <div className="space-y-4 max-w-3xl">
                <div>
                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-1">Callback URL</label>
                    <div className="flex gap-2">
                        <input readOnly value="https://api.leadsarv.com/webhooks/facebook" className="flex-1 p-3 bg-[var(--medium-bg)] border border-[var(--light-bg)] rounded-lg text-sm text-[var(--text-primary)] font-mono" />
                        <button onClick={() => alert('URL Copied!')} className="px-4 bg-[var(--light-bg)] rounded-lg hover:bg-[var(--medium-bg)] transition-colors"><i className="far fa-copy"></i></button>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-1">Verify Token</label>
                    <div className="flex gap-2">
                        <input readOnly value="ls_v_fb_88229410" className="flex-1 p-3 bg-[var(--medium-bg)] border border-[var(--light-bg)] rounded-lg text-sm text-[var(--text-primary)] font-mono" />
                        <button onClick={() => alert('Token Copied!')} className="px-4 bg-[var(--light-bg)] rounded-lg hover:bg-[var(--medium-bg)] transition-colors"><i className="far fa-copy"></i></button>
                    </div>
                </div>
            </div>
            <div className="pt-6 border-t border-[var(--light-bg)]">
                <h6 className="text-sm font-bold text-[var(--text-primary)] mb-3">Webhook Events to Subscribe:</h6>
                <div className="flex gap-3">
                    <span className="px-3 py-1 rounded bg-[var(--light-bg)] text-xs text-[var(--text-primary)] border border-[var(--light-bg)]">leadgen</span>
                    <span className="px-3 py-1 rounded bg-[var(--light-bg)] text-xs text-[var(--text-primary)] border border-[var(--light-bg)]">page_messages</span>
                </div>
            </div>
        </div>
    );

    const renderLogsView = () => (
        <div className="bg-[var(--dark-bg)] rounded-xl border border-[var(--light-bg)] overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-[var(--light-bg)] text-[var(--text-primary)]">
                    <tr>
                        <th className="p-4">Timestamp</th>
                        <th className="p-4">Source</th>
                        <th className="p-4">Event</th>
                        <th className="p-4">Leads</th>
                        <th className="p-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--light-bg)]">
                    {[
                        { time: 'Today, 11:45 AM', source: 'Summer Villa Inquiry', event: 'Webhook Push', leads: 1, status: 'Success' },
                        { time: 'Today, 10:00 AM', source: 'Manual Sync', event: 'Polling', leads: 12, status: 'Success' },
                        { time: 'Yesterday, 09:12 PM', source: 'Downtown Apt', event: 'Webhook Push', leads: 0, status: 'Error (Mapping)' },
                    ].map((log, i) => (
                        <tr key={i} className="hover:bg-[var(--medium-bg)] transition-colors">
                            <td className="p-4 text-[var(--text-secondary)] font-mono text-xs">{log.time}</td>
                            <td className="p-4 text-[var(--text-primary)] font-medium">{log.source}</td>
                            <td className="p-4 text-[var(--text-secondary)]">{log.event}</td>
                            <td className="p-4 text-[var(--text-primary)] font-bold">{log.leads}</td>
                            <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.status.includes('Error') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                                    {log.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    if (activeItem !== 'meta') {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="w-20 h-20 bg-[var(--dark-bg)] rounded-full flex items-center justify-center border-2 border-dashed border-[var(--light-bg)] mb-4">
                    <i className={`fab fa-${activeItem} text-3xl text-[var(--text-secondary)]`}></i>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Coming Soon</h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-sm">We're building the {activeItem} integration. It will be available shortly.</p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-[var(--medium-bg)] rounded-lg shadow-md h-full flex flex-col">
            <div className="mb-6">
                <div className="flex justify-between items-start gap-4 mb-6">
                    <div>
                        <h4 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                            <div className="bg-[#1877F2] text-white p-2 rounded-lg"><i className="fab fa-facebook-f"></i></div>
                            Meta Lead Ingestion
                        </h4>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">Connect forms, map fields, and automate lead ownership for all Facebook campaigns.</p>
                    </div>
                    {!isFbConnected ? (
                        <button onClick={handleFacebookLogin} disabled={isFbLoading} className="px-6 py-2.5 rounded-lg bg-[#1877F2] text-white font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg">
                            {isFbLoading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fab fa-facebook-square"></i>}
                            Connect Meta Account
                        </button>
                    ) : (
                        <button onClick={() => setIsFbConnected(false)} className="text-xs text-red-400 hover:text-red-300 font-medium">Disconnect Account</button>
                    )}
                </div>

                {isFbConnected && (
                    <div className="flex gap-4 border-b border-[var(--light-bg)] mb-6">
                        <button onClick={() => setActiveTab('forms')} className={`px-4 py-2 text-sm font-bold transition-colors ${activeTab === 'forms' ? 'border-b-2 border-[var(--primary-color)] text-[var(--primary-color)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>Lead Forms</button>
                        <button onClick={() => setActiveTab('webhooks')} className={`px-4 py-2 text-sm font-bold transition-colors ${activeTab === 'webhooks' ? 'border-b-2 border-[var(--primary-color)] text-[var(--primary-color)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>Webhook Setup</button>
                        <button onClick={() => setActiveTab('logs')} className={`px-4 py-2 text-sm font-bold transition-colors ${activeTab === 'logs' ? 'border-b-2 border-[var(--primary-color)] text-[var(--primary-color)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>Sync History</button>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {isFbConnected ? (
                    <>
                        {activeTab === 'forms' && renderFormsView()}
                        {activeTab === 'webhooks' && renderWebhooksView()}
                        {activeTab === 'logs' && renderLogsView()}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-20">
                        <div className="w-24 h-24 bg-[#1877F2]/5 rounded-full flex items-center justify-center mb-6">
                            <i className="fab fa-facebook-f text-5xl text-[#1877F2] opacity-30"></i>
                        </div>
                        <p className="text-[var(--text-secondary)] max-w-xs">Log in to Meta to view your pages and lead forms.</p>
                    </div>
                )}
            </div>

            {editingForm && <MappingModal isOpen={!!editingForm} onClose={() => setEditingForm(null)} form={editingForm.form} onSave={handleFieldMappingSave} />}
            {viewingLeadsForm && <LeadsSheetModal isOpen={!!viewingLeadsForm} onClose={() => setViewingLeadsForm(null)} form={viewingLeadsForm.form} rawLeads={viewingLeadsForm.leads} />}
        </div>
    );
};

export default AdminDigitalMarketing;
