
import React from 'react';
import { Lead, SiteVisit } from '../types';
import Avatar from './Avatar';

interface VisitItemProps {
  visit: SiteVisit;
  lead: Lead;
  activeTab: 'Scheduled' | 'Pending' | 'Completed';
  onMarkAsCompleted: (leadId: string, visitId: string) => void;
  onReschedule: (visit: SiteVisit) => void;
  onScheduleFollowUp: (leadId: string) => void;
  onClick: (leadId: string) => void;
  onBooking: (leadId: string) => void;
  onTokenEntry: (leadId: string) => void;
  isActive: boolean;
}

const VisitItem: React.FC<VisitItemProps> = ({ 
    visit, 
    lead, 
    activeTab, 
    onMarkAsCompleted, 
    onReschedule, 
    onScheduleFollowUp,
    onClick, 
    onBooking, 
    onTokenEntry, 
    isActive 
}) => {
  const handleCompleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsCompleted(visit.leadId, visit.id);
  };

  const handleRescheduleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReschedule(visit);
  };
  
  const handleFollowUpClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onScheduleFollowUp(lead.id);
  };

  const handleBookingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBooking(lead.id);
  };

  const handleTokenEntryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTokenEntry(lead.id);
  };

  return (
    <div
      onClick={() => onClick(visit.leadId)}
      className={`group relative flex p-3 gap-3 cursor-pointer border-b border-[var(--border-color)] transition-colors hover:bg-[var(--medium-bg)] ${
        isActive ? 'bg-[var(--light-bg)]' : ''
      }`}
    >
      <Avatar initials={lead.avatarInitials} size="lg" />
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <p className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-base text-white">
            {lead.name}
          </p>
          <p className="text-xs text-[var(--text-secondary)] flex-shrink-0 group-hover:opacity-0 transition-opacity">
            {new Date(visit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
          {visit.propertyOfInterest}
        </p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-[var(--text-secondary)]">
            <i className="far fa-clock mr-1 text-[var(--primary-color)]"></i>
            {visit.time}
          </p>
          <div className="flex items-center gap-1.5">
              {(activeTab === 'Scheduled' || activeTab === 'Pending') && (
                <>
                  <button
                    onClick={handleCompleteClick}
                    className="px-2 py-1 text-[9px] rounded bg-green-600 text-white font-semibold uppercase hover:bg-green-700 transition-colors shadow-sm"
                  >
                    Done
                  </button>
                  <button
                    onClick={handleRescheduleClick}
                    className="px-2 py-1 text-[9px] rounded bg-gray-700 text-white font-semibold uppercase hover:bg-gray-600 transition-colors shadow-sm"
                  >
                    Resched
                  </button>
                </>
              )}
              
              {activeTab === 'Completed' && lead.bookingStatus !== 'Booked' && (
                <>
                    <button
                        onClick={handleTokenEntryClick}
                        className="px-2 py-1 text-[9px] rounded bg-yellow-600 text-white font-semibold uppercase hover:bg-yellow-700 transition-colors shadow-sm"
                    >
                        Token
                    </button>
                    <button
                        onClick={handleBookingClick}
                        className="px-2 py-1 text-[9px] rounded bg-purple-600 text-white font-semibold uppercase hover:bg-purple-700 transition-colors shadow-sm"
                    >
                        Book
                    </button>
                </>
              )}
              
              {activeTab === 'Completed' && lead.bookingStatus === 'Booked' && (
                 <span className="px-2 py-1 text-[9px] rounded bg-green-800 text-green-100 font-semibold uppercase border border-green-700">
                    Booked
                 </span>
              )}
          </div>
        </div>
      </div>

      {/* Hover Actions Group - Consistent with ChatItem */}
      <div className="absolute right-2 top-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
          <button 
            onClick={handleFollowUpClick}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-blue-500 text-white shadow-md hover:bg-blue-600 transition-all border border-blue-400"
            title="Schedule Follow-up"
          >
            <i className="fas fa-phone-alt text-[10px]"></i>
          </button>
      </div>
    </div>
  );
};

export default VisitItem;
