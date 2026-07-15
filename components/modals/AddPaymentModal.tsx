
import React from 'react';
import { PaymentRecord, PaymentPlanMilestone } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: PaymentRecord) => void;
  milestones: PaymentPlanMilestone[];
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ isOpen, onClose, onSave, milestones }) => {
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [mode, setMode] = React.useState('NEFT');
  const [transactionId, setTransactionId] = React.useState('');
  const [bankName, setBankName] = React.useState('');
  const [milestoneName, setMilestoneName] = React.useState('');
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => {
      if (isOpen) {
          setAmount('');
          setDate(new Date().toISOString().split('T')[0]);
          setMode('NEFT');
          setTransactionId('');
          setBankName('');
          setMilestoneName('');
          setNotes('');
      }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date || !mode) {
        alert("Please fill in required fields.");
        return;
    }

    const payment: PaymentRecord = {
        id: uuidv4(),
        amount: parseFloat(amount),
        date,
        mode,
        transactionId,
        bankName,
        milestoneName: milestoneName || undefined,
        notes
    };

    onSave(payment);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fadeIn" onClick={onClose}>
        <div className="bg-[var(--medium-bg)] p-6 rounded-lg shadow-xl w-11/12 max-w-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Record Payment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-1">Amount</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 rounded bg-[var(--dark-bg)] text-[var(--text-primary)] border border-[var(--light-bg)]" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-1">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 rounded bg-[var(--dark-bg)] text-[var(--text-primary)] border border-[var(--light-bg)]" required />
                    </div>
                    <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-1">Mode</label>
                        <select value={mode} onChange={e => setMode(e.target.value)} className="w-full p-2 rounded bg-[var(--dark-bg)] text-[var(--text-primary)] border border-[var(--light-bg)]">
                            <option value="NEFT">NEFT</option>
                            <option value="RTGS">RTGS</option>
                            <option value="UPI">UPI</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Cash">Cash</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-1">Transaction ID / Cheque No.</label>
                        <input type="text" value={transactionId} onChange={e => setTransactionId(e.target.value)} className="w-full p-2 rounded bg-[var(--dark-bg)] text-[var(--text-primary)] border border-[var(--light-bg)]" />
                    </div>
                    <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-1">Bank Name</label>
                        <input type="text" value={bankName} onChange={e => setBankName(e.target.value)} className="w-full p-2 rounded bg-[var(--dark-bg)] text-[var(--text-primary)] border border-[var(--light-bg)]" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-1">Against Milestone (Optional)</label>
                    <select value={milestoneName} onChange={e => setMilestoneName(e.target.value)} className="w-full p-2 rounded bg-[var(--dark-bg)] text-[var(--text-primary)] border border-[var(--light-bg)]">
                        <option value="">-- Select Milestone --</option>
                        {milestones.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-1">Notes</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full p-2 rounded bg-[var(--dark-bg)] text-[var(--text-primary)] border border-[var(--light-bg)] resize-none"></textarea>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded text-[var(--text-secondary)] hover:bg-[var(--light-bg)]">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded bg-[var(--primary-color)] text-white hover:opacity-90">Add Payment</button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default AddPaymentModal;
