
import React from 'react';
import { Lead, LeadStatus, SiteVisit, Task, SiteVisitStatus, User, ActiveLeadTab, AgreementStatus, PossessionStatus, LifecycleStage, LeadLifecycleStatus } from '../types';
import { USER_AVATAR_INITIALS, USER_NAME, USER_ROLE } from '../constants';
import Avatar from './Avatar';
import ChatItem from './ChatItem';
import VisitItem from './VisitItem';

type ActiveMenu = 'Leads' | 'Visits' | 'Booking' | 'Agreement' | 'Possession';
type ContentTab = 'chat' | 'history' | 'details' | 'siteVisit' | 'booking' | 'ledger' | 'documents';

interface SidebarProps {
  leads: Lead[];
  users: User[];
  selectedLeadId: string | null;
  onSelectLead: (leadId: string) => void;
  onToggleNewLeadModal: () => void;
  onToggleSiteVisitModal: (visitToEdit?: SiteVisit) => void;
  onToggleFollowUpModal: (context: ActiveMenu) => void;
  onNavigateToAdmin: () => void;
  onLogout: () => void;
  onUpdateSiteVisitStatus: (leadId: string, visitId: string, newStatus: SiteVisitStatus) => void;
  onToggleBookingModal: (leadId: string) => void;
  onToggleTokenEntryModal: (leadId: string) => void;
  onUpdateLeadLifecycle: (leadId: string, stage: LifecycleStage, newStatus: LeadLifecycleStatus) => void;
  onUpdateLeadCustomData: (leadId: string, data: Record<string, any>) => void;
  onSwitchTab?: (tab: ContentTab, subTab?: string) => void;
  onOpenAtsLineup?: (leadId: string) => void;
  onOpenRegDetails?: (leadId: string) => void;
  onOpenExecutionDetails?: (leadId: string) => void;
}

type ActiveVisitTab = 'Scheduled' | 'Pending' | 'Completed';
type ActiveBookingTab = 'Token Booking' | 'Confirmed Booking';

const leadTabs: ActiveLeadTab[] = ['Follow-up', 'Active', 'Inactive'];
const visitTabs: ActiveVisitTab[] = ['Scheduled', 'Pending', 'Completed'];
const bookingTabs: ActiveBookingTab[] = ['Token Booking', 'Confirmed Booking'];
const agreementTabs: AgreementStatus[] = ['Drafted', 'Signature', 'ATS', 'Registered'];
const possessionTabs: (PossessionStatus | 'All')[] = ['All', 'Pending', 'Scheduled', 'Handed Over'];

const Sidebar: React.FC<SidebarProps> = ({
  leads,
  users,
  selectedLeadId,
  onSelectLead,
  onToggleNewLeadModal,
  onToggleSiteVisitModal,
  onToggleFollowUpModal,
  onNavigateToAdmin,
  onLogout,
  onUpdateSiteVisitStatus,
  onToggleBookingModal,
  onToggleTokenEntryModal,
  onUpdateLeadLifecycle,
  onUpdateLeadCustomData,
  onSwitchTab,
  onOpenAtsLineup,
  onOpenRegDetails,
  onOpenExecutionDetails
}) => {
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [isSearchPopupOpen, setIsSearchPopupOpen] = React.useState<boolean>(false);
  const [projectFilter, setProjectFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [sourceFilter, setSourceFilter] = React.useState<string>('all');
  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');
  const [isFilterPopupOpen, setIsFilterPopupOpen] = React.useState(false);
  const [isAgendaPopupOpen, setIsAgendaPopupOpen] = React.useState(false);
  
  const searchPopupRef = React.useRef<HTMLDivElement>(null);
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const filterPopupRef = React.useRef<HTMLDivElement>(null);
  const filterButtonRef = React.useRef<HTMLButtonElement>(null);
  const agendaPopupRef = React.useRef<HTMLDivElement>(null);
  const agendaButtonRef = React.useRef<HTMLButtonElement>(null);
  
  const [activeMenu, setActiveMenu] = React.useState<ActiveMenu>('Leads');
  const [activeLeadTab, setActiveLeadTab] = React.useState<ActiveLeadTab>('Active');
  const [activeVisitTab, setActiveVisitTab] = React.useState<ActiveVisitTab>('Scheduled');
  const [activeBookingTab, setActiveBookingTab] = React.useState<ActiveBookingTab>('Token Booking');
  const [activeAgreementTab, setActiveAgreementTab] = React.useState<AgreementStatus>('Drafted');
  const [activePossessionTab, setActivePossessionTab] = React.useState<PossessionStatus | 'All'>('All');

  const menuItems: { id: ActiveMenu; label: string; icon: string }[] = [
    { id: 'Leads', label: 'Leads', icon: 'fas fa-users' },
    { id: 'Visits', label: 'Visits', icon: 'fas fa-map-marked-alt' },
    { id: 'Booking', label: 'Booking', icon: 'fas fa-file-signature' },
    { id: 'Agreement', label: 'Agreement', icon: 'fas fa-file-contract' },
    { id: 'Possession', label: 'Possession', icon: 'fas fa-key' },
  ];

  const safeLeads = React.useMemo(() => leads || [], [leads]);

  const filterOptions = React.useMemo(() => {
    const projects = ['all', ...Array.from(new Set(safeLeads.map(lead => lead.leadProject)))];
    const statuses: Array<'all' | LeadStatus> = ['all', 'New', 'Contacted', 'Qualified', 'Unqualified', 'Converted'];
    const sources = ['all', ...Array.from(new Set(safeLeads.map(lead => lead.leadSource)))];
    return { projects, statuses, sources };
  }, [safeLeads]);
  
  const isFilterActive = projectFilter !== 'all' || (activeMenu === 'Leads' && statusFilter !== 'all') || sourceFilter !== 'all' || startDate !== '' || endDate !== '';

  const filteredLeads = React.useMemo(() => {
    const hasCompletedVisit = (lead: Lead) => (lead.siteVisits || []).some(v => v.status === 'Completed');
    const hasToken = (lead: Lead) => !!lead.tokenAmount && lead.tokenAmount > 0 && lead.bookingStatus === 'Pending';
    const isBooked = (lead: Lead) => lead.bookingStatus === 'Booked';

    const bookedLeads = safeLeads.filter(l => isBooked(l));
    const tokenLeads = safeLeads.filter(l => hasToken(l) && !isBooked(l));
    const completedVisitLeads = safeLeads.filter(l => hasCompletedVisit(l) && !hasToken(l) && !isBooked(l));
    const generalLeads = safeLeads.filter(l => !isBooked(l) && !hasToken(l) && !hasCompletedVisit(l));

    let menuFilteredLeads: Lead[];
    switch (activeMenu) {
        case 'Leads':
            if (activeLeadTab === 'Follow-up') {
                menuFilteredLeads = generalLeads.filter(lead =>
                    (lead.tasks || []).some(task => task.title.startsWith('Follow-up:') && task.status === 'Pending')
                );
            } else if (activeLeadTab === 'Active') {
                menuFilteredLeads = generalLeads.filter(lead => lead.leadStatus !== 'Unqualified');
            } else { menuFilteredLeads = generalLeads.filter(lead => lead.leadStatus === 'Unqualified'); }
            break;
        case 'Visits':
            const todayVisit = new Date(); todayVisit.setHours(0, 0, 0, 0);
            if (activeVisitTab === 'Completed') menuFilteredLeads = completedVisitLeads;
            else {
                menuFilteredLeads = generalLeads.filter(lead =>
                    (lead.siteVisits || []).some(visit => {
                        const vDate = new Date(visit.date + 'T00:00:00');
                        if (activeVisitTab === 'Scheduled') return visit.status === 'Visit Scheduled' && vDate >= todayVisit;
                        if (activeVisitTab === 'Pending') return visit.status === 'Visit Scheduled' && vDate < todayVisit;
                        return false;
                    })
                );
            }
            break;
        case 'Booking':
            menuFilteredLeads = activeBookingTab === 'Token Booking' ? tokenLeads : bookedLeads;
            break;
        case 'Agreement':
            menuFilteredLeads = bookedLeads.filter(lead => lead.agreementStatus === activeAgreementTab);
            break;
        case 'Possession':
            menuFilteredLeads = bookedLeads;
            if (activePossessionTab !== 'All') menuFilteredLeads = menuFilteredLeads.filter(lead => lead.possessionStatus === activePossessionTab);
            break;
        default: menuFilteredLeads = safeLeads;
    }
    if (!menuFilteredLeads) menuFilteredLeads = [];
    return menuFilteredLeads.filter((lead) => {
        const searchMatch = lead.name.toLowerCase().includes(searchTerm.toLowerCase());
        const projectMatch = projectFilter === 'all' || lead.leadProject === projectFilter;
        const statusMatch = activeMenu !== 'Leads' || statusFilter === 'all' || lead.leadStatus === statusFilter;
        const sourceMatch = sourceFilter === 'all' || lead.leadSource === sourceFilter;
        let dateMatch = true;
        if (startDate && lead.leadDate < startDate) dateMatch = false;
        if (endDate && lead.leadDate > endDate) dateMatch = false;
        return searchMatch && projectMatch && statusMatch && sourceMatch && dateMatch;
    });
  }, [safeLeads, searchTerm, projectFilter, statusFilter, sourceFilter, startDate, endDate, activeMenu, activeLeadTab, activeVisitTab, activeBookingTab, activeAgreementTab, activePossessionTab]);

  const visitsToRender = React.useMemo(() => {
    if (activeMenu !== 'Visits') return [];
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return filteredLeads.flatMap(lead => 
        (lead.siteVisits || []).filter(visit => {
                const vDate = new Date(visit.date + 'T00:00:00');
                if (activeVisitTab === 'Scheduled') return visit.status === 'Visit Scheduled' && vDate >= today;
                if (activeVisitTab === 'Pending') return visit.status === 'Visit Scheduled' && vDate < today;
                if (activeVisitTab === 'Completed') return visit.status === 'Completed';
                return false;
            }).map(visit => ({ visit, lead }))
    ).sort((a, b) => new Date(a.visit.date).getTime() - new Date(b.visit.date).getTime());
  }, [filteredLeads, activeVisitTab, activeMenu]);
  
  const todaysEvents = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const siteVisits = safeLeads.flatMap(lead => (lead.siteVisits || []).filter(v => v.date === today).map(v => ({ ...v, leadName: lead.name, type: 'visit', leadId: lead.id })));
    const followUps = safeLeads.flatMap(lead => (lead.tasks || []).filter(t => t.dueDate === today).map(t => ({ ...t, leadName: lead.name, type: 'follow-up', leadId: lead.id })));
    return { siteVisits, followUps };
  }, [safeLeads]);

  const todaysEventsCount = todaysEvents.siteVisits.length + todaysEvents.followUps.length;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchPopupRef.current && !searchPopupRef.current.contains(event.target as Node) && searchButtonRef.current && !searchButtonRef.current.contains(event.target as Node)) setIsSearchPopupOpen(false);
      if (filterPopupRef.current && !filterPopupRef.current.contains(event.target as Node) && filterButtonRef.current && !filterButtonRef.current.contains(event.target as Node)) setIsFilterPopupOpen(false);
      if (agendaPopupRef.current && !agendaPopupRef.current.contains(event.target as Node) && agendaButtonRef.current && !agendaButtonRef.current.contains(event.target as Node)) setIsAgendaPopupOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScheduleSiteVisit = (leadId: string) => { onSelectLead(leadId); onToggleSiteVisitModal(); };
  const handleScheduleFollowUp = (leadId: string) => { onSelectLead(leadId); onToggleFollowUpModal(activeMenu); };

  return (
    <div className="bg-[var(--medium-bg)] w-full flex flex-col h-full border-r border-[var(--border-color)] overflow-hidden">
      {/* Menu Grid */}
      <div className="border-b border-[var(--border-color)] bg-[var(--dark-bg)] grid grid-cols-5 flex-shrink-0">
        {menuItems.map(item => (
          <button key={item.id} onClick={() => setActiveMenu(item.id)} className={`flex flex-col items-center justify-center py-2 transition-all border-b-2 ${activeMenu === item.id ? 'bg-[var(--light-bg)] text-[var(--primary-color)] border-[var(--primary-color)]' : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]'}`}>
              <i className={`${item.icon} text-lg mb-0.5`}></i>
              <span className="text-[10px] font-semibold uppercase tracking-tight truncate w-full text-center px-1">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="p-2 border-b border-[var(--border-color)] flex items-center justify-between gap-1 flex-shrink-0 bg-[var(--medium-bg)]">
          <div className="flex items-center gap-1">
              <button onClick={onToggleNewLeadModal} className="h-7 w-7 rounded flex items-center justify-center bg-[var(--dark-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title="New Lead"><i className="fas fa-plus text-xs"></i></button>
              <button onClick={() => onToggleSiteVisitModal()} className="h-7 w-7 rounded flex items-center justify-center bg-[var(--dark-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title="Visit"><i className="fas fa-calendar-plus text-xs"></i></button>
              <div className="w-px h-4 bg-[var(--border-color)] mx-1"></div>
              <button ref={searchButtonRef} onClick={() => setIsSearchPopupOpen(!isSearchPopupOpen)} className={`h-7 w-7 rounded flex items-center justify-center transition-all ${isSearchPopupOpen ? 'bg-[var(--primary-color)] text-white' : 'bg-[var(--dark-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} title="Search"><i className="fas fa-search text-xs"></i></button>
              <button ref={filterButtonRef} onClick={() => setIsFilterPopupOpen(!isFilterPopupOpen)} className={`h-7 w-7 rounded flex items-center justify-center transition-all ${isFilterActive ? 'bg-[var(--primary-color)] text-white' : 'bg-[var(--dark-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} title="Filters"><i className="fas fa-filter text-xs"></i></button>
          </div>
          <button ref={agendaButtonRef} onClick={() => setIsAgendaPopupOpen(!isAgendaPopupOpen)} className="h-7 w-7 rounded bg-[var(--dark-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center relative" title="Agenda">
              <i className="fas fa-calendar-day text-xs"></i>
              {todaysEventsCount > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 text-[8px] bg-red-600 text-white rounded-full flex items-center justify-center font-bold">{todaysEventsCount}</span>}
          </button>
          
          {/* Popups */}
          {isSearchPopupOpen && (
            <div ref={searchPopupRef} className="absolute top-full left-2 right-2 mt-1 bg-[var(--medium-bg)] p-2 z-[40] rounded border border-[var(--border-color)] shadow-xl animate-fadeIn">
                <input autoFocus type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[var(--dark-bg)] rounded px-3 py-1.5 text-xs text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none" />
            </div>
          )}

          {isFilterPopupOpen && (
            <div ref={filterPopupRef} className="absolute top-full left-2 right-2 mt-1 bg-[var(--medium-bg)] p-3 z-[40] rounded border border-[var(--border-color)] shadow-xl animate-fadeIn space-y-2">
                <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)} className="w-full text-xs p-1.5 rounded border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)]">
                    {filterOptions.projects.map(p => <option key={p} value={p}>{p === 'all' ? 'All Projects' : p}</option>)}
                </select>
                {activeMenu === 'Leads' && (
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full text-xs p-1.5 rounded border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)]">
                        {filterOptions.statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>)}
                    </select>
                )}
            </div>
          )}
          
          {isAgendaPopupOpen && (
            <div ref={agendaPopupRef} className="absolute top-full right-2 mt-1 w-64 bg-[var(--medium-bg)] p-2 z-[40] rounded border border-[var(--border-color)] shadow-xl animate-fadeIn">
                <h4 className="font-semibold text-[9px] uppercase tracking-widest text-center py-1 opacity-60">Today's Agenda</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                    {(todaysEvents.followUps as any[]).concat(todaysEvents.siteVisits).map((ev: any, i) => (
                        <div key={i} onClick={() => {onSelectLead(ev.leadId); setIsAgendaPopupOpen(false);}} className="p-2 rounded bg-[var(--dark-bg)] hover:bg-[var(--light-bg)] cursor-pointer text-[11px]">
                            <p className="font-bold truncate text-[var(--text-primary)]">{ev.leadName}</p>
                            <p className="text-[9px] text-[var(--text-secondary)] opacity-70 uppercase tracking-tighter">{(ev.type || 'Visit').replace('-', ' ')} • {ev.time || 'N/A'}</p>
                        </div>
                    ))}
                    {todaysEventsCount === 0 && <p className="text-center text-[10px] text-gray-500 py-4 italic">No scheduled events</p>}
                </div>
            </div>
          )}
      </div>

      {/* Tabs */}
      <div className="flex bg-[var(--dark-bg)] border-b border-[var(--border-color)] flex-shrink-0">
          {(activeMenu === 'Leads' ? leadTabs : activeMenu === 'Visits' ? visitTabs : activeMenu === 'Booking' ? bookingTabs : activeMenu === 'Agreement' ? agreementTabs : possessionTabs).map(tab => (
            <button key={tab} onClick={() => {
                if(activeMenu === 'Leads') setActiveLeadTab(tab as any);
                else if(activeMenu === 'Visits') setActiveVisitTab(tab as any);
                else if(activeMenu === 'Booking') setActiveBookingTab(tab as any);
                else if(activeMenu === 'Agreement') setActiveAgreementTab(tab as any);
                else setActivePossessionTab(tab as any);
            }} className={`flex-1 py-2 text-[10px] font-semibold uppercase tracking-tight transition-all border-b-2 ${
              (activeMenu === 'Leads' ? activeLeadTab : activeMenu === 'Visits' ? activeVisitTab : activeMenu === 'Booking' ? activeBookingTab : activeMenu === 'Agreement' ? activeAgreementTab : activePossessionTab) === tab
              ? 'text-[var(--primary-color)] border-[var(--primary-color)]' : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}>{tab}</button>
          ))}
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeMenu !== 'Visits' ? (
              filteredLeads.map(lead => (
                  <ChatItem 
                    key={lead.id} 
                    lead={lead} 
                    users={users} 
                    isActive={lead.id === selectedLeadId} 
                    onClick={onSelectLead} 
                    activeMenu={activeMenu} 
                    activeLeadTab={activeLeadTab} 
                    onScheduleSiteVisit={handleScheduleSiteVisit} 
                    onScheduleFollowUp={handleScheduleFollowUp} 
                    onConfirmBooking={onToggleBookingModal} 
                    onUpdateLeadLifecycle={onUpdateLeadLifecycle}
                    onUpdateCustomData={onUpdateLeadCustomData}
                    onSwitchTab={onSwitchTab}
                    onOpenAtsLineup={onOpenAtsLineup}
                    onOpenRegDetails={onOpenRegDetails}
                    onOpenExecutionDetails={onOpenExecutionDetails}
                  />
              ))
          ) : (
              visitsToRender.map(({ visit, lead }) => (
                  <VisitItem 
                    key={visit.id} 
                    visit={visit} 
                    lead={lead} 
                    activeTab={activeVisitTab} 
                    onMarkAsCompleted={(l, v) => onUpdateSiteVisitStatus(l, v, 'Completed')} 
                    onReschedule={(v) => onToggleSiteVisitModal(v)} 
                    onScheduleFollowUp={handleScheduleFollowUp}
                    onClick={onSelectLead} 
                    onBooking={onToggleBookingModal} 
                    onTokenEntry={onToggleTokenEntryModal} 
                    isActive={visit.leadId === selectedLeadId} 
                  />
              ))
          )}
          {filteredLeads.length === 0 && <div className="p-12 text-center opacity-40 flex flex-col items-center"><i className="fas fa-inbox text-4xl mb-4"></i><p className="text-xs font-semibold uppercase tracking-widest">No matching leads</p></div>}
      </div>

      {/* Profile Footer */}
      <div className="p-2 flex justify-between items-center border-t border-[var(--border-color)] flex-shrink-0 bg-[var(--medium-bg)]">
          <div className="flex items-center gap-2">
            <Avatar initials={USER_AVATAR_INITIALS} size="sm" />
            <div className="min-w-0">
                <div className="font-bold text-[var(--text-primary)] text-xs truncate leading-tight">{USER_NAME}</div>
                <div className="text-[9px] text-[var(--text-secondary)] font-semibold uppercase truncate tracking-tight opacity-70">{USER_ROLE}</div>
            </div>
          </div>
          <div className="flex gap-1.5 pr-1">
              <button onClick={onNavigateToAdmin} className="h-7 w-7 rounded flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"><i className="fas fa-shield-alt text-xs"></i></button>
              <button onClick={onLogout} className="h-7 w-7 rounded flex items-center justify-center text-[var(--text-secondary)] hover:text-red-500 transition-colors"><i className="fas fa-sign-out-alt text-xs"></i></button>
          </div>
      </div>
    </div>
  );
};

export default Sidebar;
