
import React from 'react';
import { Lead, LeadStatus } from '../../types';

interface AdminLeadManagementProps {
  leads: Lead[];
  onUpdateLeads: (updatedLeads: Lead[]) => void;
}

const AdminLeadManagement: React.FC<AdminLeadManagementProps> = ({ leads, onUpdateLeads }) => {
  const [tempLeadStatuses, setTempLeadStatuses] = React.useState<Record<string, LeadStatus>>({});
  const [expandedSources, setExpandedSources] = React.useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    // Initialize temp statuses when leads data changes
    const initialStatuses: Record<string, LeadStatus> = {};
    (leads || []).forEach(lead => {
      initialStatuses[lead.id] = lead.leadStatus;
    });
    setTempLeadStatuses(initialStatuses);

    // Initialize all sources as expanded by default
    const initialExpanded: Record<string, boolean> = {};
    const uniqueSources = Array.from(new Set((leads || []).map(lead => lead.leadSource)));
    uniqueSources.forEach(source => {
      // FIX: Cast 'source' to string as it's inferred as 'unknown'.
      initialExpanded[source as string] = true;
    });
    setExpandedSources(initialExpanded);

  }, [leads]);

  const handleStatusChange = React.useCallback((leadId: string, newStatus: LeadStatus) => {
    setTempLeadStatuses(prev => ({
      ...prev,
      [leadId]: newStatus,
    }));
  }, []);

  const handleSaveChanges = React.useCallback(() => {
    const updatedLeads = (leads || []).map(lead => ({
      ...lead,
      leadStatus: tempLeadStatuses[lead.id] || lead.leadStatus,
    }));
    onUpdateLeads(updatedLeads);
    alert('Lead statuses updated successfully!');
  }, [leads, tempLeadStatuses, onUpdateLeads]);
  
  const handleExportCSV = () => {
      const headers = ["ID", "Name", "Phone", "Email", "Status", "Source", "Project", "Date"];
      const rows = (leads || []).map(l => [l.id, l.name, l.phone, l.email, l.leadStatus, l.leadSource, l.leadProject, l.leadDate]);
      
      const csvContent = [
          headers.join(','),
          ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "leads_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const getLeadStatusColorClass = (status: LeadStatus) => {
    switch (status) {
      case 'New': return 'bg-blue-600';
      case 'Contacted': return 'bg-yellow-600';
      case 'Qualified': return 'bg-green-600';
      case 'Unqualified': return 'bg-red-600';
      case 'Converted': return 'bg-[var(--primary-color)]';
      default: return 'bg-gray-600';
    }
  };
  
  const filteredLeads = React.useMemo(() => {
      if (!leads) return [];
      if (!searchTerm) return leads;
      const term = searchTerm.toLowerCase();
      return leads.filter(lead => 
        lead.name.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term) ||
        lead.phone.includes(term) ||
        (lead.leadProject && lead.leadProject.toLowerCase().includes(term))
      );
  }, [leads, searchTerm]);

  const groupedLeads = React.useMemo(() => {
    const groups: Record<string, Lead[]> = {};
    filteredLeads.forEach(lead => {
      const source = lead.leadSource || 'Unspecified Source';
      if (!groups[source]) {
        groups[source] = [];
      }
      groups[source].push(lead);
    });
    return groups;
  }, [filteredLeads]);

  const toggleSourceExpansion = React.useCallback((sourceName: string) => {
    setExpandedSources(prev => ({
      ...prev,
      [sourceName]: !prev[sourceName],
    }));
  }, []);

  return (
    <div className="p-4 bg-[var(--medium-bg)] rounded-lg shadow-md h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">Lead Management</h3>
        <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
                <input 
                    type="text" 
                    placeholder="Search leads..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]"
                />
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"></i>
            </div>
            <button 
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-md bg-[var(--light-bg)] text-[var(--text-primary)] hover:bg-[var(--dark-bg)] border border-[var(--light-bg)] transition-colors flex items-center gap-2"
                title="Export to CSV"
            >
                <i className="fas fa-file-csv"></i> <span className="hidden sm:inline">Export</span>
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {(Object.keys(groupedLeads) as string[]).length === 0 ? (
          <div className="text-center py-10 bg-[var(--dark-bg)] rounded-lg border border-[var(--light-bg)]">
              <i className="fas fa-search text-4xl text-[var(--text-secondary)] mb-3"></i>
              <p className="text-[var(--text-secondary)]">No leads found matching your criteria.</p>
          </div>
        ) : (
          (Object.entries(groupedLeads) as [string, Lead[]][]).map(([sourceName, leadsInGroup]) => (
            <div key={sourceName} className="border border-[var(--border-color)] rounded-md overflow-hidden">
              <button
                onClick={() => toggleSourceExpansion(sourceName)}
                className="w-full text-left p-4 bg-[var(--light-bg)] hover:bg-[var(--dark-bg)] transition-colors flex justify-between items-center text-lg font-semibold text-[var(--text-primary)]"
                aria-expanded={expandedSources[sourceName]}
              >
                <span>{sourceName} <span className="text-sm font-normal text-[var(--text-secondary)] ml-2">({leadsInGroup.length})</span></span>
                <i className={`fas ${expandedSources[sourceName] ? 'fa-chevron-up' : 'fa-chevron-down'} text-sm text-[var(--text-secondary)]`}></i>
              </button>
              {expandedSources[sourceName] && (
                <div className="p-4 space-y-4 bg-[var(--medium-bg)]">
                  {leadsInGroup.map(lead => (
                    <div key={lead.id} className="border border-[var(--light-bg)] p-4 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--dark-bg)]">
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <p className="font-semibold text-[var(--text-primary)] truncate">{lead.name}</p>
                            <span className="text-xs text-[var(--text-secondary)] sm:hidden">{lead.leadDate}</span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] truncate">{lead.email}</p>
                        <p className="text-sm text-[var(--text-secondary)]">{lead.phone}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-[var(--text-secondary)]">
                            <span className="truncate" title={lead.leadProject}><i className="fas fa-building mr-1"></i> {lead.leadProject}</span>
                            <span className="hidden sm:inline"><i className="far fa-calendar-alt mr-1"></i> {lead.leadDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 mt-2 sm:mt-0">
                        <label htmlFor={`status-${lead.id}`} className="sr-only">Status for {lead.name}</label>
                        <select
                          id={`status-${lead.id}`}
                          value={tempLeadStatuses[lead.id] || lead.leadStatus}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          className="p-2 rounded-md border border-[var(--light-bg)] bg-[var(--medium-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] text-sm cursor-pointer"
                          aria-label={`Current status: ${tempLeadStatuses[lead.id] || lead.leadStatus}`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Unqualified">Unqualified</option>
                          <option value="Converted">Converted</option>
                        </select>
                        <div className={`w-3 h-3 rounded-full ${getLeadStatusColorClass(tempLeadStatuses[lead.id] || lead.leadStatus)}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-color)]">
        <button
          type="button"
          onClick={handleSaveChanges}
          className="px-5 py-2 rounded-md bg-[var(--primary-color)] text-white font-medium hover:bg-[#128c7e] transition-colors shadow-md"
        >
          Save Status Changes
        </button>
      </div>
    </div>
  );
};

export default AdminLeadManagement;
