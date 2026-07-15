
import React from 'react';
import { Lead } from '../../types';

interface AtsLineupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { office: string; date: string; time: string }) => void;
  lead: Lead;
}

const AtsLineupModal: React.FC<AtsLineupModalProps> = ({ isOpen, onClose, onSave, lead }) => {
  const [office, setOffice] = React.useState('Registrar Office I');
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (office && date && time) {
      onSave({ office, date, time });
      onClose();
    } else {
      alert("Please fill in all details for the ATS lineup.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[110] p-4 animate-fadeIn" onClick={onClose}>
        <div className="bg-[var(--medium-bg)] rounded-xl shadow-2xl w-full max-w-md border border-[var(--border-color)] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[var(--border-color)] bg-[var(--dark-bg)]">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Schedule ATS Lineup</h3>
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-1">Lead: {lead.name}</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-[10px] font-black uppercase text-[var(--text-secondary)] mb-1.5 tracking-wider">Sub-Registrar Office</label>
                    <input type="text" value={office} onChange={e => setOffice(e.target.value)} required className="w-full p-2.5 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-[var(--text-secondary)] mb-1.5 tracking-wider">Appointment Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full p-2.5 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition-all" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-[var(--text-secondary)] mb-1.5 tracking-wider">Appointment Time</label>
                        <input type="time" value={time} onChange={e => setTime(e.target.value)} required className="w-full p-2.5 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition-all" />
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-color)]">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-[11px] font-black uppercase text-[var(--text-secondary)] hover:bg-[var(--light-bg)] rounded transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-orange-600 text-white text-[11px] font-black uppercase rounded shadow-lg hover:bg-orange-700 transition-all">Submit Details</button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default AtsLineupModal;
