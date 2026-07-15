
import React from 'react';
import { Lead, Message, TaskStatus, SiteVisitStatus, LifecycleStage, LeadLifecycleStatus, User, Project, PaymentPlan, CustomerDocument, BookingDetails } from '../types';
import Avatar from './Avatar';
import MessageBubble from './MessageBubble';
import LeadDetail from './LeadDetail';
import BookingDetailTab from './BookingDetailTab';
import LedgerTab from './LedgerTab';
import DocumentHub from './DocumentHub';
import { v4 as uuidv4 } from 'uuid';

type ContentTab = 'chat' | 'history' | 'details' | 'siteVisit' | 'booking' | 'ledger' | 'documents';

interface MainContentProps {
  selectedLead: Lead | null;
  users: User[];
  projects: Project[];
  paymentPlans: PaymentPlan[];
  onSendMessage: (leadId: string, message: Message) => void;
  onBackButtonClick: () => void;
  onToggleFollowUpModal: () => void;
  onToggleEditLeadModal: (lead: Lead) => void;
  onToggleBookingModal: (leadId: string) => void;
  onToggleEditBookingModal: (leadId: string) => void;
  onUpdateBooking: (leadId: string, bookingDetails: BookingDetails, close?: boolean) => void;
  onAddPropertyImage: (leadId: string, base64Image: string) => void;
  onRemovePropertyImage: (leadId: string, imageId: string) => void;
  onUpdateTaskStatus: (leadId: string, taskId: string, newStatus: TaskStatus) => void;
  onUpdateLeadLifecycle: (leadId: string, stage: LifecycleStage, newStatus: LeadLifecycleStatus) => void;
  onUpdateLeadOwner: (leadId: string, ownerId: string) => void;
  onUpdateApplicantDocument: (leadId: string, applicantId: string, docType: string, newDoc: CustomerDocument) => void;
  onUpdateLeadCustomData: (leadId: string, data: Record<string, any>) => void;
  activeContentTab: ContentTab;
  setActiveContentTab: (tab: ContentTab) => void;
  activeDocTab: string;
  setActiveDocTab: (tab: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  selectedLead,
  users,
  projects,
  paymentPlans,
  onSendMessage,
  onBackButtonClick,
  onToggleFollowUpModal,
  onToggleEditLeadModal,
  onToggleBookingModal,
  onToggleEditBookingModal,
  onUpdateBooking,
  onAddPropertyImage,
  onRemovePropertyImage,
  onUpdateTaskStatus,
  onUpdateLeadLifecycle,
  onUpdateLeadOwner,
  onUpdateApplicantDocument,
  onUpdateLeadCustomData,
  activeContentTab,
  setActiveContentTab,
  activeDocTab,
  setActiveDocTab,
}) => {
  const [inputMessage, setInputMessage] = React.useState<string>('');
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (activeContentTab === 'chat' && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [selectedLead?.messages, activeContentTab]);

  const handleSendMessage = React.useCallback(() => {
    if (inputMessage.trim() === '' || !selectedLead) return;
    const newMessage: Message = {
      id: uuidv4(),
      content: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'sent',
    };
    onSendMessage(selectedLead.id, newMessage);
    setInputMessage('');
    setTimeout(() => {
      const replyMessage: Message = {
        id: uuidv4(),
        content: `Acknowledged, ${selectedLead.name.split(' ')[0]}. Processing your request.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'received',
      };
      onSendMessage(selectedLead.id, replyMessage);
    }, 1200);
  }, [inputMessage, selectedLead, onSendMessage]);

  const handleKeyPress = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage();
  }, [handleSendMessage]);
  
  const getSiteVisitStatusColorClass = (status: SiteVisitStatus) => {
    switch (status) {
      case 'Visit Scheduled': return 'bg-indigo-600';
      case 'Completed': return 'bg-[#00a884]';
      case 'Canceled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  if (!selectedLead) {
    return (
      <div className="flex-1 main-content-bg flex flex-col justify-center items-center text-[var(--text-secondary)] text-lg font-light opacity-50">
        <i className="fas fa-comments text-5xl mb-4"></i>
        Select a lead to begin communication.
      </div>
    );
  }

  const renderContent = () => {
    if (activeContentTab === 'chat') {
      return (
        <>
          <div ref={chatContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
            {(selectedLead.messages || []).map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
          <div className="bg-[var(--medium-bg)] px-4 py-3 flex items-center gap-4 border-t border-[var(--border-color)]">
            <button className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"><i className="far fa-smile text-lg"></i></button>
            <button className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"><i className="fas fa-paperclip text-lg"></i></button>
            <input
              type="text"
              className="flex-1 bg-[var(--input-bg)] rounded-full px-4 py-2 text-sm border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-color)] transition-all"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            {inputMessage.trim() ? (
              <button onClick={handleSendMessage} className="bg-[var(--primary-color)] w-9 h-9 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 shadow-md">
                <i className="fas fa-paper-plane text-sm"></i>
              </button>
            ) : (
              <button className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"><i className="fas fa-microphone text-lg"></i></button>
            )}
          </div>
        </>
      );
    }

    if (activeContentTab === 'history') {
      const followUpTasks = (selectedLead.tasks || [])
        .filter(task => task.title.startsWith('Follow-up:'))
        .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

      return (
        <div className="flex-1 p-6 overflow-y-auto bg-[var(--dark-bg)]">
          {(followUpTasks || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                <i className="far fa-calendar-times text-5xl mb-4"></i>
                <h3 className="text-lg font-bold">No follow-ups recorded</h3>
                <button onClick={onToggleFollowUpModal} className="mt-4 px-4 py-2 rounded bg-[var(--primary-color)] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all">+ Schedule Now</button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex items-center justify-between mb-8 px-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">Engagement Timeline</h3>
                    <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">{followUpTasks.length} Events</span>
                </div>
                <div className="relative pl-6 space-y-8 border-l border-[var(--border-color)]">
                    {followUpTasks.map((task) => (
                        <div key={task.id} className="relative group">
                            <div className={`absolute -left-[31px] top-0 w-2.5 h-2.5 rounded-full border-2 border-[var(--dark-bg)] ${task.status === 'Completed' ? 'bg-[#00a884]' : 'bg-blue-500'}`}></div>
                            <div className="bg-[var(--medium-bg)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm group-hover:border-[var(--primary-color)] transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-bold text-sm text-[var(--text-primary)]">{task.title}</p>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${task.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>{task.status}</span>
                                </div>
                                <p className="text-xs text-[var(--text-secondary)]">{task.dueDate}</p>
                                {task.description && <p className="mt-3 text-xs text-gray-500 italic border-l-2 border-gray-300 pl-3 leading-relaxed">{task.description}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          )}
        </div>
      );
    }
    
    if (activeContentTab === 'details') return <LeadDetail lead={selectedLead} users={users} onAddPropertyImage={onAddPropertyImage} onRemovePropertyImage={onRemovePropertyImage} onUpdateLeadLifecycle={onUpdateLeadLifecycle} onUpdateLeadOwner={onUpdateLeadOwner} onToggleEditLeadModal={onToggleEditLeadModal} />;
    
    if (activeContentTab === 'siteVisit') {
      return (
        <div className="flex-1 p-6 overflow-y-auto bg-[var(--dark-bg)]">
            <div className="max-w-2xl mx-auto space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-6">Site Visit Register</h3>
                {(selectedLead.siteVisits || []).map((visit) => (
                <div key={visit.id} className="border border-[var(--border-color)] p-4 rounded-xl bg-[var(--medium-bg)] shadow-sm">
                    <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-sm text-[var(--text-primary)]">{visit.propertyOfInterest}</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1"><i className="far fa-clock mr-1"></i> {visit.date} at {visit.time}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${getSiteVisitStatusColorClass(visit.status)} shadow-sm`}>{visit.status}</span>
                    </div>
                </div>
                ))}
                {(selectedLead.siteVisits || []).length === 0 && <p className="text-center text-sm text-gray-500 py-12">No site visits scheduled for this prospect.</p>}
            </div>
        </div>
      );
    }
    
    if (activeContentTab === 'booking') {
        const projectForLead = (projects || []).find(p => p.name === selectedLead.leadProject);
        return <BookingDetailTab lead={selectedLead} project={projectForLead || null} paymentPlans={paymentPlans} onStartBooking={() => onToggleBookingModal(selectedLead.id)} onEditBooking={() => onToggleEditBookingModal(selectedLead.id)} onUpdateBooking={(leadId, details) => onUpdateBooking(leadId, details, false)} />;
    }

    if (activeContentTab === 'ledger') {
        const projectForLead = (projects || []).find(p => p.name === selectedLead.leadProject);
        return <LedgerTab lead={selectedLead} project={projectForLead || null} paymentPlans={paymentPlans} onUpdateBooking={onUpdateBooking} />;
    }

    if (activeContentTab === 'documents') {
        const projectForLead = (projects || []).find(p => p.name === selectedLead.leadProject);
        return (
          <DocumentHub 
            lead={selectedLead} 
            project={projectForLead || null} 
            onUpdateApplicantDocument={onUpdateApplicantDocument} 
            onUpdateLeadLifecycle={onUpdateLeadLifecycle}
            onUpdateCustomData={onUpdateLeadCustomData}
            activeTab={activeDocTab}
            setActiveTab={setActiveDocTab}
          />
        );
    }
    return null;
  };

  return (
    <div className="flex-1 main-content-bg flex flex-col relative h-full">
      {/* Refined Header */}
      <div className="bg-[var(--medium-bg)] px-4 py-2.5 flex justify-between items-center border-b border-[var(--border-color)] flex-shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBackButtonClick} className="md:hidden text-[var(--text-secondary)] p-1 hover:text-[var(--text-primary)]"><i className="fas fa-arrow-left"></i></button>
          <Avatar initials={selectedLead.avatarInitials} chatStatus={selectedLead.chatStatus} size="md" />
          <div className="min-w-0">
            <div className="text-[var(--text-primary)] font-bold text-sm leading-tight truncate">{selectedLead.name}</div>
            <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedLead.chatStatus === 'online' ? 'bg-[#00a884]' : 'bg-gray-400'}`}></span>
                <span className="text-[10px] text-[var(--text-secondary)] font-medium uppercase tracking-tighter">{selectedLead.chatStatus === 'online' ? 'Active now' : 'Inactive'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5 text-[var(--text-secondary)]">
          <button className="hover:text-[var(--primary-color)] transition-colors"><i className="fas fa-phone-alt"></i></button>
          <button onClick={onToggleFollowUpModal} className="hover:text-[var(--primary-color)] transition-colors"><i className="fas fa-calendar-plus"></i></button>
          <button className="hover:text-[var(--primary-color)] transition-colors"><i className="fas fa-ellipsis-v"></i></button>
        </div>
      </div>

      {/* Tighter Tab Bar */}
      <div className="bg-[var(--dark-bg)] border-b border-[var(--border-color)] flex-shrink-0 overflow-x-auto no-scrollbar z-10 flex">
        {(['chat', 'history', 'details', 'siteVisit', 'booking', 'ledger', 'documents'] as ContentTab[]).map(tab => {
           // Only show Ledger if booked
           if (tab === 'ledger' && selectedLead.bookingStatus !== 'Booked') return null;
           
           return (
            <button
                key={tab}
                className={`px-5 py-2.5 text-center cursor-pointer border-b-2 transition-all text-[11px] font-bold uppercase tracking-wider whitespace-nowrap
                ${activeContentTab === tab ? 'border-[var(--primary-color)] text-[var(--primary-color)] bg-[var(--primary-color)]/5' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                onClick={() => setActiveContentTab(tab)}
            >
                {tab === 'siteVisit' ? 'Site Visit' : tab === 'documents' ? 'Files' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
           );
        })}
      </div>
      
      {/* Content Scroller */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {renderContent()}
      </div>
    </div>
  );
};

export default MainContent;
