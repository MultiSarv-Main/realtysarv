
import React from 'react';
import { Lead, NewLeadData, LeadStatus, UnitType, Source, LocationSetting, Budget, ClientProfile, LivingPlace, Project, FormFieldConfig, User } from '../types';
import DynamicFieldRenderer from './DynamicFieldRenderer';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead?: (leadData: NewLeadData) => void;
  onUpdateLead?: (leadData: Lead) => void;
  leadToEdit?: Lead | null;
  unitTypes: UnitType[];
  locationSettings: LocationSetting[];
  sources: Source[];
  budgets: Budget[];
  clientProfiles: ClientProfile[];
  livingPlaces: LivingPlace[];
  projects: Project[];
  formConfigs: FormFieldConfig[];
  users: User[];
}

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onAddLead, onUpdateLead, leadToEdit, unitTypes, locationSettings, sources, budgets, clientProfiles, livingPlaces, projects, formConfigs, users }) => {
  const isEditing = !!leadToEdit;

  // System Fields
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [initialInterest, setInitialInterest] = React.useState<string[]>([]);
  const [preferredLocation, setPreferredLocation] = React.useState('');
  const [budget, setBudget] = React.useState('');
  const [clientProfile, setClientProfile] = React.useState('');
  const [livingPlace, setLivingPlace] = React.useState('');
  const [leadStatus, setLeadStatus] = React.useState<LeadStatus>('New');
  const [channelSource, setChannelSource] = React.useState('');
  const [sourceName, setSourceName] = React.useState('');
  const [leadProject, setLeadProject] = React.useState('');
  const [message, setMessage] = React.useState('');
  
  // Follow-up Fields (only for new lead)
  const [followUpActive, setFollowUpActive] = React.useState(false);
  const [followUpType, setFollowUpType] = React.useState<'Call' | 'Email' | 'Meeting'>('Call');
  const [followUpDate, setFollowUpDate] = React.useState('');
  const [followUpTime, setFollowUpTime] = React.useState('');
  const [followUpNotes, setFollowUpNotes] = React.useState('');
  const [followUpAssignedTo, setFollowUpAssignedTo] = React.useState('');
  
  // Custom Fields State
  const [customData, setCustomData] = React.useState<Record<string, any>>({});

  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [isInterestDropdownOpen, setIsInterestDropdownOpen] = React.useState(false);
  const interestDropdownRef = React.useRef<HTMLDivElement>(null);

  const activeConfigs = React.useMemo(() => (formConfigs || []).filter(c => c.module === 'lead' && c.isVisible), [formConfigs]);
  const customConfigs = React.useMemo(() => activeConfigs.filter(c => !c.isSystem), [activeConfigs]);
  const isVisible = (fieldName: string) => activeConfigs.some(c => c.fieldName === fieldName);
  const isRequired = (fieldName: string) => activeConfigs.find(c => c.fieldName === fieldName)?.isRequired || false;

  const channelSources = React.useMemo(() => [...new Set(sources.map(s => s.channelSource))], [sources]);
  const sourceNames = React.useMemo(() => {
    if (!channelSource) return [];
    return sources.filter(s => s.channelSource === channelSource);
  }, [sources, channelSource]);

  React.useEffect(() => {
    if (channelSource) {
      if (!isEditing) {
        const details = sources.filter(s => s.channelSource === channelSource);
        setSourceName(details[0]?.name || '');
      }
    } else {
      setSourceName('');
    }
  }, [channelSource, sources, isEditing]);
  
  React.useEffect(() => {
    if (isOpen) {
      if (isEditing && leadToEdit) {
        const nameParts = leadToEdit.name.split(' ');
        const first = nameParts.shift() || '';
        const last = nameParts.join(' ');
        setFirstName(first);
        setLastName(last);
        setEmail(leadToEdit.email);
        setPhone(leadToEdit.phone);
        setInitialInterest(leadToEdit.initialInterest || []);
        setPreferredLocation(leadToEdit.preferredLocation);
        setBudget(leadToEdit.budget || '');
        setClientProfile(leadToEdit.clientProfile || '');
        setLivingPlace(leadToEdit.livingPlace || '');
        setLeadStatus(leadToEdit.leadStatus);
        setChannelSource(leadToEdit.channelSource);
        setSourceName(leadToEdit.leadSource);
        setLeadProject(leadToEdit.leadProject);
        setCustomData(leadToEdit.customData || {});
        setMessage('');
        setEmailError(null);
      } else {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setInitialInterest([]);
        setPreferredLocation(locationSettings[0]?.name || '');
        setBudget(budgets[0]?.name || '');
        setClientProfile(clientProfiles[0]?.name || '');
        setLivingPlace(livingPlaces[0]?.name || '');
        setLeadStatus('New');
        setChannelSource(channelSources[0] || '');
        setLeadProject(projects[0]?.name || '');
        setCustomData({});
        setMessage('');
        setEmailError(null);
        // Reset follow-up
        setFollowUpActive(false);
        setFollowUpType('Call');
        setFollowUpDate('');
        setFollowUpTime('');
        setFollowUpNotes('');
        setFollowUpAssignedTo(users[0]?.name || '');
      }
      setIsInterestDropdownOpen(false);
    }
  }, [isOpen, isEditing, leadToEdit, unitTypes, locationSettings, channelSources, budgets, clientProfiles, livingPlaces, projects, users]);

  const handleCustomChange = (field: string, value: any) => {
      setCustomData(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (isVisible('email')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.trim() && !emailRegex.test(email)) {
            setEmailError('Please enter a valid email address.');
            return false;
        }
    }
    
    if (isRequired('firstName') && !firstName.trim()) return false;
    if (isRequired('phone') && !phone.trim()) return false;
    if (isRequired('email') && !email.trim()) return false;
    if (isRequired('leadProject') && !leadProject.trim()) return false;

    for (const config of customConfigs) {
        if (config.isRequired && !customData[config.fieldName]) {
            alert(`${config.label} is required.`);
            return false;
        }
    }

    if (followUpActive && (!followUpDate || !followUpTime)) {
        alert("Please provide date and time for the follow-up.");
        return false;
    }

    return true;
  };

  const handleSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      if (isEditing && onUpdateLead && leadToEdit) {
        const updatedLead: Lead = {
          ...leadToEdit,
          name: `${firstName} ${lastName}`.trim(),
          avatarInitials: `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase(),
          email,
          phone,
          initialInterest,
          preferredLocation,
          budget,
          clientProfile,
          livingPlace,
          leadStatus,
          channelSource,
          leadSource: sourceName,
          leadProject: leadProject,
          customData: customData,
        };
        onUpdateLead(updatedLead);
      } else if (!isEditing && onAddLead) {
        onAddLead({ 
            firstName, lastName, email, phone, initialInterest, preferredLocation, budget, clientProfile, livingPlace, leadStatus, channelSource, sourceName, leadProject, message, customData,
            followUp: followUpActive ? { type: followUpType, date: followUpDate, time: followUpTime, notes: followUpNotes, assignedTo: followUpAssignedTo } : undefined
        });
      }
      onClose();
    }
  }, [firstName, lastName, email, phone, initialInterest, preferredLocation, budget, clientProfile, livingPlace, leadStatus, channelSource, sourceName, leadProject, message, customData, isEditing, leadToEdit, onAddLead, onUpdateLead, validate, onClose, followUpActive, followUpType, followUpDate, followUpTime, followUpNotes, followUpAssignedTo]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fadeIn" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bg-[var(--medium-bg)] p-6 sm:p-8 rounded-lg shadow-xl w-11/12 max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl sm:text-2xl font-bold mb-6 text-[var(--text-primary)] text-center flex-shrink-0">
          {isEditing ? 'Edit Lead' : 'Create New Lead'}
        </h3>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-4 -mr-4 flex flex-col gap-4 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isVisible('firstName') && (
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">First Name{isRequired('firstName') ? '*' : ''}</label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Enter first name" className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]" required={isRequired('firstName')} />
                </div>
            )}
            {isVisible('lastName') && (
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Last Name{isRequired('lastName') ? '*' : ''}</label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Enter last name" className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]" required={isRequired('lastName')} />
                </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isVisible('phone') && (
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Phone{isRequired('phone') ? '*' : ''}</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter phone number" className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]" required={isRequired('phone')} />
                </div>
            )}
            {isVisible('email') && (
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email{isRequired('email') ? '*' : ''}</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email address" className={`w-full p-3 rounded-md border ${emailError ? 'border-red-500' : 'border-[var(--light-bg)]'} bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]`} required={isRequired('email')} />
                    {emailError && <span className="text-red-500 text-xs mt-1 block">{emailError}</span>}
                </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isVisible('leadProject') && (
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Project{isRequired('leadProject') ? '*' : ''}</label>
                    <select value={leadProject} onChange={e => setLeadProject(e.target.value)} className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]" required={isRequired('leadProject')}>
                        <option value="" disabled>Select Project</option>
                        {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                </div>
            )}
            {isVisible('initialInterest') && (
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Initial Interest{isRequired('initialInterest') ? '*' : ''}</label>
                    <div className="relative" ref={interestDropdownRef}>
                        <button type="button" onClick={() => setIsInterestDropdownOpen(!isInterestDropdownOpen)} className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] text-left flex justify-between items-center">
                            <span className="truncate">{initialInterest.length > 0 ? initialInterest.join(', ') : 'Select Interests'}</span>
                            <i className={`fas fa-chevron-down text-xs transition-transform ${isInterestDropdownOpen ? 'rotate-180' : ''}`}></i>
                        </button>
                        {isInterestDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-[var(--dark-bg)] border border-[var(--light-bg)] rounded-md shadow-lg max-h-40 overflow-y-auto animate-fadeInPopup">
                                <ul className="p-1">
                                    {(unitTypes || []).map(ut => (
                                        <li key={ut.id} className="flex items-center gap-2 p-2 hover:bg-[var(--light-bg)] rounded cursor-pointer" onClick={() => setInitialInterest(prev => prev.includes(ut.name) ? prev.filter(i => i !== ut.name) : [...prev, ut.name])}>
                                            <input type="checkbox" checked={initialInterest.includes(ut.name)} readOnly className="h-4 w-4 rounded text-[var(--primary-color)]" />
                                            <span className="text-sm text-[var(--text-primary)]">{ut.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {isVisible('preferredLocation') && (
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Preferred Location{isRequired('preferredLocation') ? '*' : ''}</label>
                    <select value={preferredLocation} onChange={e => setPreferredLocation(e.target.value)} className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)]" required={isRequired('preferredLocation')}>
                        <option value="" disabled>Select Location</option>
                        {(locationSettings || []).map(ls => <option key={ls.id} value={ls.name}>{ls.name}</option>)}
                    </select>
                </div>
             )}
             {isVisible('budget') && (
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Budget{isRequired('budget') ? '*' : ''}</label>
                    <select value={budget} onChange={e => setBudget(e.target.value)} className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)]" required={isRequired('budget')}>
                        <option value="" disabled>Select Budget</option>
                        {(budgets || []).map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                    </select>
                </div>
             )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isVisible('clientProfile') && (
                  <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Client Profile</label>
                      <select value={clientProfile} onChange={e => setClientProfile(e.target.value)} className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)]">
                          <option value="" disabled>Select Profile</option>
                          {(clientProfiles || []).map(cp => <option key={cp.id} value={cp.name}>{cp.name}</option>)}
                      </select>
                  </div>
              )}
              {isVisible('livingPlace') && (
                  <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Current Living Place</label>
                      <select value={livingPlace} onChange={e => setLivingPlace(e.target.value)} className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)]">
                          <option value="" disabled>Select Living Place</option>
                          {(livingPlaces || []).map(lp => <option key={lp.id} value={lp.name}>{lp.name}</option>)}
                      </select>
                  </div>
              )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isVisible('channelSource') && (
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Channel Source*</label>
                    <select value={channelSource} onChange={e => setChannelSource(e.target.value)} className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)]" required>
                        <option value="" disabled>Select Channel</option>
                        {channelSources.map(cs => <option key={cs} value={cs}>{cs}</option>)}
                    </select>
                </div>
              )}
              {isVisible('sourceName') && (
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Source Name*</label>
                    <select value={sourceName} onChange={e => setSourceName(e.target.value)} className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)]" required disabled={!channelSource}>
                        <option value="" disabled>Select Source</option>
                        {sourceNames.map(sd => <option key={sd.id} value={sd.name}>{sd.name}</option>)}
                    </select>
                </div>
              )}
          </div>
          
          {isVisible('message') && !isEditing && (
              <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Initial Message</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} rows={2} placeholder="Initial notes..." className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)]" />
              </div>
          )}

          {/* Follow-up Section (New Lead Only) */}
          {!isEditing && (
            <div className="mt-4 p-4 rounded-lg bg-[var(--dark-bg)] border border-[var(--light-bg)]">
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                    <input 
                        type="checkbox" 
                        checked={followUpActive} 
                        onChange={e => setFollowUpActive(e.target.checked)} 
                        className="h-4 w-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                    />
                    <span className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Schedule Initial Follow-up</span>
                </label>

                {followUpActive && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Follow-up Type</label>
                            <select value={followUpType} onChange={e => setFollowUpType(e.target.value as any)} className="w-full p-2 text-sm rounded bg-[var(--medium-bg)] border border-[var(--light-bg)] text-[var(--text-primary)]">
                                <option value="Call">Call</option>
                                <option value="Email">Email</option>
                                <option value="Meeting">Meeting</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Assigned To</label>
                            <select value={followUpAssignedTo} onChange={e => setFollowUpAssignedTo(e.target.value)} className="w-full p-2 text-sm rounded bg-[var(--medium-bg)] border border-[var(--light-bg)] text-[var(--text-primary)]">
                                {users.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Date</label>
                            <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className="w-full p-2 text-sm rounded bg-[var(--medium-bg)] border border-[var(--light-bg)] text-[var(--text-primary)]" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Time</label>
                            <input type="time" value={followUpTime} onChange={e => setFollowUpTime(e.target.value)} className="w-full p-2 text-sm rounded bg-[var(--medium-bg)] border border-[var(--light-bg)] text-[var(--text-primary)]" />
                        </div>
                        <div className="sm:col-span-2">
                             <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Notes (Optional)</label>
                             <textarea value={followUpNotes} onChange={e => setFollowUpNotes(e.target.value)} rows={2} placeholder="Add follow-up context..." className="w-full p-2 text-sm rounded bg-[var(--medium-bg)] border border-[var(--light-bg)] text-[var(--text-primary)] resize-none" />
                        </div>
                    </div>
                )}
            </div>
          )}

          {/* Render Custom Fields */}
          {customConfigs.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[var(--light-bg)]">
                  <h4 className="text-sm font-bold text-[var(--primary-color)] uppercase tracking-wider mb-4">Additional Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {customConfigs.map(config => (
                          <DynamicFieldRenderer 
                            key={config.id} 
                            config={config} 
                            value={customData[config.fieldName]} 
                            onChange={(val) => handleCustomChange(config.fieldName, val)} 
                          />
                      ))}
                  </div>
              </div>
          )}

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--light-bg)] flex-shrink-0">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-md bg-gray-700 text-[var(--text-primary)] font-medium hover:bg-gray-600 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-md bg-[var(--primary-color)] text-white font-medium hover:bg-[#128c7e] transition-colors shadow-lg">
              {isEditing ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
