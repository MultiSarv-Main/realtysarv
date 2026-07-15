
import React from 'react';
import { NewFollowUpData, User } from '../types';
import { DEFAULT_ASSIGNED_TO } from '../constants';

type FollowUpContext = 'Leads' | 'Visits' | 'Booking' | 'Agreement' | 'Possession';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFollowUp: (followUpData: NewFollowUpData) => void;
  users: User[];
  context?: FollowUpContext;
}

const FollowUpModal: React.FC<FollowUpModalProps> = ({ isOpen, onClose, onAddFollowUp, users, context = 'Leads' }) => {
  const [type, setType] = React.useState<'Call' | 'Email' | 'Meeting'>('Call');
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [assignedTo, setAssignedTo] = React.useState(users[0]?.name || DEFAULT_ASSIGNED_TO);
  const [notes, setNotes] = React.useState('');

  const handleSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (date.trim() && time.trim()) {
      onAddFollowUp({ type, date, time, assignedTo, notes: notes.trim() || undefined });
      setType('Call');
      setDate('');
      setTime('');
      setNotes('');
      onClose();
    } else {
      alert('Please fill in required fields (Date and Time).');
    }
  }, [type, date, time, assignedTo, notes, onAddFollowUp, onClose]);

  if (!isOpen) return null;

  const isLeads = context === 'Leads';
  const isVisits = context === 'Visits';
  const isTransaction = context === 'Booking' || context === 'Agreement' || context === 'Possession';

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4 animate-fadeIn"
      onClick={onClose}
      aria-labelledby="followUpModalTitle"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[var(--medium-bg)] rounded-xl shadow-2xl w-full max-w-lg relative overflow-hidden border border-[var(--border-color)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 border-b border-[var(--border-color)] ${isTransaction ? 'bg-purple-900/10' : 'bg-[var(--dark-bg)]'}`}>
            <h3 id="followUpModalTitle" className="text-xl font-bold text-[var(--text-primary)]">
                {isTransaction ? `${context} Follow-up` : 'Schedule Follow-up'}
            </h3>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1 uppercase font-bold tracking-wider opacity-70">
                Context: {context} Management
            </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh] custom-scrollbar">
            
            {isTransaction && (
                <div className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20 mb-2">
                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-tight">
                        <i className="fas fa-file-invoice-dollar mr-1"></i> Transaction Integrity Note
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">This reminder is specifically for {context} documentation, payments, or legal requirements.</p>
                </div>
            )}

            {/* Remove Lead Type (Type) for Leads and Visits modules */}
            {!isLeads && !isVisits && (
              <div>
                <label htmlFor="followUpType" className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1.5 tracking-wider">
                  Requirement Type
                </label>
                <select
                  id="followUpType"
                  value={type}
                  onChange={(e) => setType(e.target.value as 'Call' | 'Email' | 'Meeting')}
                  className="w-full p-2.5 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition-all"
                  required
                >
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Meeting">Meeting / Collection</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="followUpDate" className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1.5 tracking-wider">
                    Due Date
                    </label>
                    <input
                    type="date"
                    id="followUpDate"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition-all"
                    required
                    />
                </div>
                <div>
                    <label htmlFor="followUpTime" className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1.5 tracking-wider">
                    Time
                    </label>
                    <input
                    type="time"
                    id="followUpTime"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2.5 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition-all"
                    required
                    />
                </div>
            </div>
          
            {/* Remove Assigned To for Leads and Visits module */}
            {!isLeads && !isVisits && (
                <div>
                    <label htmlFor="followUpAssignedTo" className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1.5 tracking-wider">
                    Owner / Executive
                    </label>
                    <select
                    id="followUpAssignedTo"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full p-2.5 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition-all"
                    required
                    >
                    {users.map(user => <option key={user.id} value={user.name}>{user.name}</option>)}
                    </select>
                </div>
            )}

            <div>
              <label htmlFor="followUpNotes" className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1.5 tracking-wider">
                Follow-up Notes
              </label>
              <textarea
                id="followUpNotes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Specific instructions or conversation goals..."
                className="w-full p-3 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] resize-none transition-all"
              ></textarea>
            </div>
          </div>
          
          <div className="p-4 bg-[var(--dark-bg)] border-t border-[var(--border-color)] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md bg-gray-700 text-[var(--text-primary)] font-bold text-xs uppercase tracking-widest hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-8 py-2 rounded-md text-white font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all ${isTransaction ? 'bg-purple-600 hover:bg-purple-700' : 'bg-[var(--primary-color)] hover:brightness-110'}`}
            >
              Set Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FollowUpModal;
