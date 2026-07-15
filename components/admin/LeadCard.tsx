
import React from 'react';
import { Lead, LeadStatus, User } from '../../types';
import Avatar from '../Avatar';

const timeSince = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";

    interval = seconds / 86400;
    if (interval >= 1) return Math.floor(interval) + "d";

    interval = seconds / 3600;
    if (interval >= 1) return Math.floor(interval) + "h";

    interval = seconds / 60;
    if (interval >= 1) return Math.floor(interval) + "m";
    
    return "now";
};

interface LeadCardProps {
    lead: Lead;
    onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
    users: User[];
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onStatusChange, users }) => {
    const owner = React.useMemo(() => users.find(u => u.id === lead.ownerId), [users, lead.ownerId]);
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('leadId', lead.id);
        e.currentTarget.style.opacity = '0.5';
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.style.opacity = '1';
    };

    const getStatusColorClass = (status: LeadStatus) => {
        switch (status) {
          case 'New': return 'bg-blue-600/20 text-blue-400 ring-blue-500/30';
          case 'Contacted': return 'bg-yellow-600/20 text-yellow-400 ring-yellow-500/30';
          case 'Qualified': return 'bg-purple-600/20 text-purple-400 ring-purple-500/30';
          case 'Converted': return 'bg-green-600/20 text-green-400 ring-green-500/30';
          case 'Unqualified': return 'bg-red-600/20 text-red-400 ring-red-500/30';
          default: return 'bg-gray-600/20 text-gray-400 ring-gray-500/30';
        }
    };
    
    const todayStr = new Date().toISOString().split('T')[0];

    const hasOverdueTask = (lead.tasks || []).some(t => t.status === 'Pending' && t.dueDate < todayStr);
    const hasUpcomingTask = (lead.tasks || []).some(t => t.status === 'Pending' && t.dueDate >= todayStr);

    const hasOverdueSiteVisit = (lead.siteVisits || []).some(v => v.status === 'Visit Scheduled' && v.date < todayStr);
    const hasUpcomingSiteVisit = (lead.siteVisits || []).some(v => v.status === 'Visit Scheduled' && v.date >= todayStr);

    const leadAge = timeSince(lead.leadDate);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="bg-[var(--dark-bg)] p-3 rounded-lg shadow-md border border-[var(--light-bg)] cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start gap-3">
        <Avatar initials={lead.avatarInitials} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[var(--text-primary)] truncate" title={lead.name}>{lead.name}</p>
          <p className="text-xs text-[var(--text-secondary)] truncate" title={lead.leadProject}>{lead.leadProject}</p>
        </div>
        <div className="relative">
            <i className="fas fa-info-circle text-[var(--text-secondary)] cursor-help" title={(lead.initialInterest || []).join(', ')}></i>
        </div>
      </div>
      <div className="mt-3 flex justify-between items-end gap-2">
        <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-1 flex-wrap min-w-0">
                <span className="inline-block bg-[var(--light-bg)] text-[var(--text-secondary)] text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                    {lead.leadSource}
                </span>
                {owner && (
                    <span className="inline-flex items-center gap-1 bg-gray-700 text-gray-300 text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap" title={`Owned by ${owner.name}`}>
                        <i className="fas fa-user-tag text-xs"></i>
                        {owner.name.split(' ')[0]}
                    </span>
                )}
            </div>
            <div className="relative flex-shrink-0">
                <select
                    value={lead.leadStatus}
                    onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
                    onMouseDown={(e) => e.stopPropagation()} 
                    className={`appearance-none text-xs font-semibold py-1 pl-2 pr-6 rounded-md border-none ring-1 ring-inset focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)] transition-all ${getStatusColorClass(lead.leadStatus)}`}
                    aria-label={`Current status: ${lead.leadStatus}. Change status.`}
                >
                    <option value="New" className="bg-[var(--medium-bg)] text-[var(--text-primary)]">New</option>
                    <option value="Contacted" className="bg-[var(--medium-bg)] text-[var(--text-primary)]">Contacted</option>
                    <option value="Qualified" className="bg-[var(--medium-bg)] text-[var(--text-primary)]">Qualified</option>
                    <option value="Converted" className="bg-[var(--medium-bg)] text-[var(--text-primary)]">Converted</option>
                    <option value="Unqualified" className="bg-[var(--medium-bg)] text-[var(--text-primary)]">Unqualified</option>
                </select>
                <i className="fas fa-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[var(--text-secondary)] pointer-events-none"></i>
            </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-xs text-[var(--text-secondary)]">
             <div className="flex items-center gap-3">
                {hasOverdueTask && <i className="fas fa-tasks text-red-500" title="Overdue task(s)"></i>}
                {hasUpcomingTask && !hasOverdueTask && <i className="fas fa-tasks" title="Upcoming task(s)"></i>}
                
                {hasOverdueSiteVisit && <i className="fas fa-calendar-check text-red-500" title="Overdue site visit(s)"></i>}
                {hasUpcomingSiteVisit && !hasOverdueSiteVisit && <i className="fas fa-calendar-check" title="Upcoming site visit(s)"></i>}
            </div>
            <span title={`Lead created on ${lead.leadDate}`}>{leadAge}</span>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
