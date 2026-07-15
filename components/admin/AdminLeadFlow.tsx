
import React from 'react';
import { Lead, LeadStatus, User } from '../../types';
import FlowColumn from './FlowColumn';

interface AdminLeadFlowProps {
  leads: Lead[];
  users: User[];
  onUpdateLeads: (updatedLeads: Lead[]) => void;
}

const AdminLeadFlow: React.FC<AdminLeadFlowProps> = ({ leads, users, onUpdateLeads }) => {
  const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Converted', 'Unqualified'];
  const safeLeads = leads || [];
  
  const handleDrop = React.useCallback((e: React.DragEvent<HTMLDivElement>, newStatus: LeadStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    const leadToMove = safeLeads.find(l => l.id === leadId);

    if (leadToMove && leadToMove.leadStatus !== newStatus) {
      const updatedLeads = safeLeads.map(lead =>
        lead.id === leadId ? { ...lead, leadStatus: newStatus } : lead
      );
      onUpdateLeads(updatedLeads);
    }
  }, [safeLeads, onUpdateLeads]);

  const handleStatusChange = React.useCallback((leadId: string, newStatus: LeadStatus) => {
    const updatedLeads = safeLeads.map(lead =>
      lead.id === leadId ? { ...lead, leadStatus: newStatus } : lead
    );
    onUpdateLeads(updatedLeads);
  }, [safeLeads, onUpdateLeads]);

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Lead Flow</h3>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 overflow-x-auto pb-4">
        {statuses.map(status => (
          <FlowColumn
            key={status}
            status={status}
            leads={(safeLeads || []).filter(lead => lead.leadStatus === status)}
            onDrop={handleDrop}
            onStatusChange={handleStatusChange}
            users={users}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminLeadFlow;
