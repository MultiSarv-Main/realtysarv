
import React from 'react';
import { Lead } from '../../types';

interface ExecutionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { executionDate: string; remarks: string }) => void;
  lead: Lead;
}

const ExecutionDetailsModal: React.FC<ExecutionDetailsModalProps> = ({ isOpen, onClose, onSave, lead }) => {
  const [executionDate, setExecutionDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (executionDate) {
      onSave({ executionDate, remarks });
      onClose();
    } else {
      alert("Please enter the execution date.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[110] p-4 animate-fadeIn" onClick={onClose}>
        <div className="bg-[var(--medium-bg)] rounded-xl shadow-2xl w-full max-w-md border border-[var(--border-color)] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[var(--border-color)] bg-green-900/10">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Execution Completion</h3>
                <p className="text-[10px] text-green-500 font-black uppercase tracking-widest mt-1">Final Transaction Stamping</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-[10px] font-black uppercase text-[var(--text-secondary)] mb-1.5 tracking-wider">Actual Execution Date *</label>
                    <input type="date" value={executionDate} onChange={e => setExecutionDate(e.target.value)} required className="w-full p-2.5 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition-all" />
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase text-[var(--text-secondary)] mb-1.5 tracking-wider">Execution Remarks (Optional)</label>
                    <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={3} placeholder="Any specific notes on witness or handover..." className="w-full p-3 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] resize-none transition-all"></textarea>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-color)]">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-[11px] font-black uppercase text-[var(--text-secondary)] hover:bg-[var(--light-bg)] rounded transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-green-600 text-white text-[11px] font-black uppercase rounded shadow-lg hover:bg-green-700 transition-all">Confirm Execution</button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default ExecutionDetailsModal;
