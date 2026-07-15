
import React from 'react';
import { Lead } from '../../types';

interface RegistrationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { regNumber: string; bookNumber: string; volume: string; regDate: string }) => void;
  lead: Lead;
}

const RegistrationDetailsModal: React.FC<RegistrationDetailsModalProps> = ({ isOpen, onClose, onSave, lead }) => {
  const [regNumber, setRegNumber] = React.useState('');
  const [bookNumber, setBookNumber] = React.useState('Book 1');
  const [volume, setVolume] = React.useState('');
  const [regDate, setRegDate] = React.useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regNumber && regDate) {
      onSave({ regNumber, bookNumber, volume, regDate });
      onClose();
    } else {
      alert("Please fill in the registration number and date.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[110] p-4 animate-fadeIn" onClick={onClose}>
        <div className="bg-[var(--medium-bg)] rounded-xl shadow-2xl w-full max-w-md border border-[var(--border-color)] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[var(--border-color)] bg-blue-900/10">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Agreement Registration Details</h3>
                <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">Official Sub-Registrar Records</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-[10px] font-black uppercase text-[var(--text-secondary)] mb-1.5 tracking-wider">Registration / Serial Number *</label>
                    <input type="text" value={regNumber} onChange={e => setRegNumber(e.target.value)} required placeholder="e.g., 1234/2024" className="w-full p-2.5 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--primary-color)] transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-[var(--text-secondary)] mb-1.5 tracking-wider">Registration Date</label>
                        <input type="date" value={regDate} onChange={e => setRegDate(e.target.value)} required className="w-full p-2.5 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition-all" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-[var(--text-secondary)] mb-1.5 tracking-wider">Book Number</label>
                        <input type="text" value={bookNumber} onChange={e => setBookNumber(e.target.value)} className="w-full p-2.5 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition-all" />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase text-[var(--text-secondary)] mb-1.5 tracking-wider">Volume / Page Details (Optional)</label>
                    <input type="text" value={volume} onChange={e => setVolume(e.target.value)} className="w-full p-2.5 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition-all" />
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-color)]">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-[11px] font-black uppercase text-[var(--text-secondary)] hover:bg-[var(--light-bg)] rounded transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white text-[11px] font-black uppercase rounded shadow-lg hover:bg-blue-700 transition-all">Mark Registered</button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default RegistrationDetailsModal;
