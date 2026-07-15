
import React from 'react';
import { Lead, LeadStatus, User, ActiveLeadTab, AgreementStatus, LifecycleStage, LeadLifecycleStatus, CustomerDocument } from '../types';
import Avatar from './Avatar';

type ActiveMenu = 'Leads' | 'Visits' | 'Booking' | 'Agreement' | 'Possession';
type ContentTab = 'chat' | 'history' | 'details' | 'siteVisit' | 'booking' | 'ledger' | 'documents';

interface ChatItemProps {
  lead: Lead;
  users: User[];
  isActive: boolean;
  onClick: (id: string) => void;
  activeMenu?: ActiveMenu;
  activeLeadTab?: ActiveLeadTab;
  onScheduleSiteVisit: (leadId: string) => void;
  onScheduleFollowUp: (leadId: string) => void;
  onConfirmBooking?: (leadId: string) => void;
  onUpdateLeadLifecycle?: (leadId: string, stage: LifecycleStage, newStatus: LeadLifecycleStatus) => void;
  onUpdateCustomData?: (leadId: string, data: Record<string, any>) => void;
  onSwitchTab?: (tab: ContentTab, subTab?: string) => void;
  onOpenAtsLineup?: (leadId: string) => void;
  onOpenRegDetails?: (leadId: string) => void;
  onOpenExecutionDetails?: (leadId: string) => void;
}

const getLeadStatusColorClass = (status: LeadStatus) => {
    switch (status) {
      case 'New': return 'bg-blue-500/90 text-white';
      case 'Contacted': return 'bg-yellow-500/90 text-black';
      case 'Qualified': return 'bg-purple-500/90 text-white';
      case 'Converted': return 'bg-[#00a884] text-white';
      case 'Unqualified': return 'bg-red-500/90 text-white';
      default: return 'bg-gray-500 text-white';
    }
};

const ChatItem: React.FC<ChatItemProps> = ({ 
    lead, 
    users, 
    isActive, 
    onClick, 
    activeMenu, 
    onScheduleSiteVisit, 
    onScheduleFollowUp, 
    onConfirmBooking,
    onUpdateLeadLifecycle,
    onUpdateCustomData,
    onSwitchTab,
    onOpenAtsLineup,
    onOpenRegDetails,
    onOpenExecutionDetails
}) => {
  const { id, avatarInitials, name, time, chatStatus, leadStatus, leadSource, ownerId, agreementStatus, customData = {} } = lead;
  const [isProcessing, setIsProcessing] = React.useState(false);
  
  const owner = React.useMemo(() => users.find(u => u.id === ownerId), [users, ownerId]);

  const verifiedKycCount = React.useMemo(() => {
    if (!lead.bookingDetails) return 0;
    // FIX: Explicitly cast docs to Record<string, CustomerDocument> to prevent 'unknown' type error on status property access (Line 62)
    const docs = (lead.bookingDetails.primaryApplicant.customerDocuments || {}) as Record<string, CustomerDocument>;
    return Object.values(docs).filter(d => d.status === 'Verified').length;
  }, [lead.bookingDetails]);

  // FIX: Explicitly cast unitDocuments to Record<string, CustomerDocument> to avoid 'unknown' type inference errors
  const unitDocs = lead.bookingDetails?.unitDocuments as Record<string, CustomerDocument> | undefined;
  const isSignedDraftVerified = unitDocs?.['Agreement Draft']?.status === 'Verified';
  const isChallanVerified = unitDocs?.['Challan Copy']?.status === 'Verified';

  const handleRedirectToFiles = (e: React.MouseEvent, subTab: 'Customer KYC' | 'Unit Documents' = 'Unit Documents') => {
    e.stopPropagation();
    onClick(id);
    onSwitchTab?.('documents', subTab);
  };

  const handleGenerateDraft = async (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsProcessing(true);
      setTimeout(() => {
          onUpdateCustomData?.(id, { agreementDraftGenerated: true });
          setIsProcessing(false);
      }, 1000);
  };

  const handleSendSignature = async (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsProcessing(true);
      setTimeout(() => {
          alert(`Agreement sent to ${name} via Email and WhatsApp for digital signature.`);
          onUpdateLeadLifecycle?.(id, 'agreementStatus', 'Signature');
          setIsProcessing(false);
      }, 1500);
  };

  const handleAtsLineup = (e: React.MouseEvent) => {
      e.stopPropagation();
      onOpenAtsLineup?.(id);
  };

  const handleMarkRegistered = (e: React.MouseEvent) => {
      e.stopPropagation();
      onOpenRegDetails?.(id);
  };

  const handleMarkExecutionDone = (e: React.MouseEvent) => {
      e.stopPropagation();
      onOpenExecutionDetails?.(id);
  };

  return (
    <div
      className={`group relative flex py-3 px-3 gap-3 cursor-pointer border-b border-[var(--border-color)] transition-all hover:bg-[var(--medium-bg)] ${isActive ? 'bg-[var(--light-bg)]' : ''}`}
      onClick={() => onClick(id)}
    >
      <div className="flex-shrink-0">
        <Avatar initials={avatarInitials} size="sm" chatStatus={chatStatus} />
      </div>
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex justify-between items-center h-4">
            <div className="text-[9px] text-gray-500 font-mono tracking-tight opacity-70">L:{id.substring(0,6).toUpperCase()}</div>
            <div className="text-[10px] text-[var(--text-secondary)] font-medium group-hover:opacity-0 transition-opacity">{time}</div>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="font-bold text-[13px] text-[var(--text-primary)] truncate">{name}</span>
          <span className="text-[11px] text-[var(--text-secondary)] truncate opacity-80">- {lead.leadProject}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
            <span className={`px-1.5 py-0.5 text-[9px] rounded font-semibold uppercase tracking-wider ${getLeadStatusColorClass(leadStatus)}`}>{leadStatus}</span>
            <span className="px-1.5 py-0.5 text-[9px] rounded font-bold uppercase bg-[var(--light-bg)] text-[var(--text-secondary)] border border-[var(--border-color)]">{leadSource}</span>
            
            {activeMenu === 'Booking' && onConfirmBooking && lead.bookingStatus === 'Pending' && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onConfirmBooking(id); }}
                    className="ml-auto text-[9px] font-semibold uppercase bg-purple-600 text-white px-2 py-0.5 rounded shadow-sm hover:bg-purple-700 transition-all border border-purple-500/50"
                >
                    Confirm Booking
                </button>
            )}

            {activeMenu === 'Agreement' && (
                <div className="ml-auto flex items-center">
                    {agreementStatus === 'Drafted' && (
                        <>
                            {verifiedKycCount < 4 ? (
                                <button 
                                    onClick={(e) => handleRedirectToFiles(e, 'Customer KYC')}
                                    className="text-[9px] font-semibold uppercase bg-orange-500 text-white px-2 py-0.5 rounded shadow-sm hover:bg-orange-600 transition-all border border-orange-400/50"
                                >
                                    Complete KYC ({verifiedKycCount}/4 Verified)
                                </button>
                            ) : !customData.agreementDraftGenerated ? (
                                <button 
                                    onClick={handleGenerateDraft}
                                    disabled={isProcessing}
                                    className="text-[9px] font-semibold uppercase bg-blue-600 text-white px-2 py-0.5 rounded shadow-sm hover:bg-blue-700 transition-all border border-blue-500/50 disabled:opacity-50"
                                >
                                    {isProcessing ? 'Generating...' : 'Generate Draft'}
                                </button>
                            ) : (
                                <button 
                                    onClick={handleSendSignature}
                                    disabled={isProcessing}
                                    className="text-[9px] font-semibold uppercase bg-indigo-600 text-white px-2 py-0.5 rounded shadow-sm hover:bg-indigo-700 transition-all border border-indigo-500/50 disabled:opacity-50"
                                >
                                    {isProcessing ? 'Sending...' : 'Send for Signature'}
                                </button>
                            )}
                        </>
                    )}
                    {agreementStatus === 'Signature' && (
                        <button 
                            onClick={(e) => isSignedDraftVerified ? onUpdateLeadLifecycle?.(id, 'agreementStatus', 'ATS') : handleRedirectToFiles(e, 'Unit Documents')}
                            className="text-[9px] font-semibold uppercase bg-green-600 text-white px-2 py-0.5 rounded shadow-sm hover:bg-green-700 transition-all border border-green-500/50"
                        >
                            {isSignedDraftVerified ? 'Schedule ATS' : 'Upload Signed Draft'}
                        </button>
                    )}
                    {agreementStatus === 'ATS' && (
                        <div className="flex flex-col items-end">
                            {!isChallanVerified ? (
                                <button 
                                    onClick={(e) => handleRedirectToFiles(e, 'Unit Documents')}
                                    className="text-[9px] font-semibold uppercase bg-blue-600 text-white px-2 py-0.5 rounded shadow-sm hover:bg-blue-700 transition-all border border-blue-500/50"
                                >
                                    Upload Challan Receipt
                                </button>
                            ) : !customData.isLineupDone ? (
                                <button 
                                    onClick={handleAtsLineup}
                                    className="text-[9px] font-semibold uppercase bg-orange-600 text-white px-2 py-0.5 rounded shadow-sm hover:bg-orange-700 transition-all border border-orange-400/50"
                                >
                                    ATS Lineup
                                </button>
                            ) : !customData.isRegistrationDetailsDone ? (
                                <div className="flex flex-col items-end gap-1">
                                    <div className="text-[8px] text-gray-500 uppercase font-semibold tracking-tight">
                                        <i className="fas fa-building-columns mr-1"></i>
                                        {customData.atsLineupDetails?.office} • {customData.atsLineupDetails?.date}
                                    </div>
                                    <button 
                                        onClick={handleMarkRegistered}
                                        className="text-[9px] font-semibold uppercase bg-blue-600 text-white px-2 py-0.5 rounded shadow-sm hover:bg-blue-700 border border-blue-500/50"
                                    >
                                        Mark Registered
                                    </button>
                                </div>
                            ) : !customData.isExecutionDone ? (
                                <div className="flex flex-col items-end gap-1">
                                    <div className="text-[8px] text-blue-500 uppercase font-semibold tracking-tight">
                                        ATS Under Execution
                                    </div>
                                    <button 
                                        onClick={handleMarkExecutionDone}
                                        className="text-[9px] font-semibold uppercase bg-green-600 text-white px-2 py-0.5 rounded shadow-sm hover:bg-green-700 border border-green-500/50"
                                    >
                                        Mark Done
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={(e) => handleRedirectToFiles(e, 'Unit Documents')}
                                    className="text-[9px] font-semibold uppercase bg-blue-600 text-white px-2 py-0.5 rounded shadow-sm hover:bg-blue-700 transition-all border border-blue-500/50"
                                >
                                    Upload Registered Draft
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {owner && !onConfirmBooking && activeMenu !== 'Agreement' && <div className="ml-auto text-[9px] font-bold text-gray-500 px-1.5 py-0.5 bg-gray-200/30 rounded group-hover:opacity-0 transition-opacity">{owner.name.split(' ')[0]}</div>}
        </div>
      </div>

      {(activeMenu === 'Leads' || activeMenu === 'Booking' || activeMenu === 'Agreement' || activeMenu === 'Possession') && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
              <button 
                onClick={(e) => { e.stopPropagation(); onScheduleFollowUp(id); }}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-blue-500 text-white shadow-md hover:bg-blue-600 transition-all border border-blue-400"
                title="Schedule Follow-up"
              >
                <i className="fas fa-phone-alt text-[10px]"></i>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onScheduleSiteVisit(id); }}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-indigo-500 text-white shadow-md hover:bg-indigo-600 transition-colors border border-indigo-400"
                title="Schedule Site Visit"
              >
                <i className="fas fa-calendar-alt text-[10px]"></i>
              </button>
          </div>
      )}
    </div>
  );
};

export default ChatItem;
