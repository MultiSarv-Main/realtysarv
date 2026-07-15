import React from 'react';
import { Lead, LeadStatus, User } from '../../types';
import LeadCard from './LeadCard';

interface FlowColumnProps {
  status: LeadStatus;
  leads: Lead[];
  users: User[];
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: LeadStatus) => void;
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
}

const FlowColumn: React.FC<FlowColumnProps> = ({ status, leads, users, onDrop, onStatusChange }) => {
    const [isOver, setIsOver] = React.useState(false);

    const getStatusColorClass = (status: LeadStatus) => {
        switch (status) {
          case 'New': return 'border-t-blue-500';
          case 'Contacted': return 'border-t-yellow-500';
          case 'Qualified': return 'border-t-purple-500';
          case 'Converted': return 'border-t-green-500';
          case 'Unqualified': return 'border-t-red-500';
          default: return 'border-t-gray-500';
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        setIsOver(false);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        onDrop(e, status);
        setIsOver(false);
    }

  return (
    <div className="flex flex-col flex-shrink-0 w-full">
      <div className={`p-3 bg-[var(--medium-bg)] rounded-t-lg border-t-4 ${getStatusColorClass(status)}`}>
        <h4 className="font-semibold text-[var(--text-primary)] text-sm">
          {status} <span className="text-xs font-normal text-[var(--text-secondary)]">({leads.length})</span>
        </h4>
      </div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex-1 bg-[var(--medium-bg)] rounded-b-lg p-3 space-y-3 overflow-y-auto transition-colors ${isOver ? 'bg-[var(--dark-bg)]' : ''}`}
        style={{ minHeight: '200px' }}
      >
        {leads.length > 0 ? (
          leads.map(lead => <LeadCard key={lead.id} lead={lead} onStatusChange={onStatusChange} users={users} />)
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-[var(--text-secondary)] italic">
            No leads in this stage.
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowColumn;