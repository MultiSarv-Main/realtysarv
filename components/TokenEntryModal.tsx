import React from 'react';
import { Lead } from '../types';

interface TokenEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmToken: (leadId: string, tokenAmount: number) => void;
  lead: Lead | null;
}

const TokenEntryModal: React.FC<TokenEntryModalProps> = ({ isOpen, onClose, onConfirmToken, lead }) => {
  const [tokenAmount, setTokenAmount] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(tokenAmount);
    if (lead && !isNaN(amount) && amount > 0) {
      onConfirmToken(lead.id, amount);
      onClose();
    } else {
      alert('Please enter a valid token amount.');
    }
  };
  
  React.useEffect(() => {
    if (isOpen) {
        setTokenAmount(lead?.tokenAmount?.toString() || '');
    }
  }, [isOpen, lead]);

  if (!isOpen || !lead) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tokenEntryModalTitle"
    >
      <div
        className="bg-[var(--medium-bg)] p-6 sm:p-8 rounded-lg shadow-xl w-11/12 max-w-lg relative"
        onClick={e => e.stopPropagation()}
      >
        <h3 id="tokenEntryModalTitle" className="text-xl sm:text-2xl font-bold mb-6 text-[var(--text-primary)] text-center">
          Token Entry for {lead.name}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="tokenAmount" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Token Amount (INR)
            </label>
            <input
              id="tokenAmount"
              type="number"
              value={tokenAmount}
              onChange={e => setTokenAmount(e.target.value)}
              placeholder="e.g., 51000"
              required
              className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]"
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md bg-gray-700 text-[var(--text-primary)] font-medium hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-[var(--primary-color)] text-white font-medium hover:bg-[#128c7e] transition-colors"
            >
              Confirm Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TokenEntryModal;