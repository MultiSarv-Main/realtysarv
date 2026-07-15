
import React from 'react';
import { NewChannelPartnerData } from '../../types';

interface NewChannelPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: NewChannelPartnerData) => void;
}

const NewChannelPartnerModal: React.FC<NewChannelPartnerModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = React.useState<NewChannelPartnerData>({
    firmName: '',
    contactPerson: '',
    email: '',
    phone: '',
    reraNumber: '',
    commissionRate: 2.0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'commissionRate' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firmName || !formData.email || !formData.phone || !formData.reraNumber) {
        alert("Please fill in all mandatory fields including RERA Number.");
        return;
    }
    onAdd(formData);
    onClose();
    // Reset form
    setFormData({
        firmName: '',
        contactPerson: '',
        email: '',
        phone: '',
        reraNumber: '',
        commissionRate: 2.0
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fadeIn" onClick={onClose}>
        <div className="bg-[var(--medium-bg)] p-6 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Register Channel Partner</h3>
                <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><i className="fas fa-times"></i></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Firm / Agency Name *</label>
                    <input 
                        type="text" 
                        name="firmName" 
                        value={formData.firmName} 
                        onChange={handleChange} 
                        required 
                        placeholder="e.g., Star Realty Ltd"
                        className="w-full p-2 rounded bg-[var(--dark-bg)] text-[var(--text-primary)] border border-[var(--light-bg)] focus:border-[var(--primary-color)] outline-none" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Contact Person Name *</label>
                    <input 
                        type="text" 
                        name="contactPerson" 
                        value={formData.contactPerson} 
                        onChange={handleChange} 
                        required 
                        placeholder="Primary spokesperson"
                        className="w-full p-2 rounded bg-[var(--dark-bg)] text-[var(--text-primary)] border border-[var(--light-bg)] focus:border-[var(--primary-color)] outline-none" 
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email ID *</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            className="w-full p-2 rounded bg-[var(--dark-bg)] text-[var(--text-primary)] border border-[var(--light-bg)] focus:border-[var(--primary-color)] outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Phone Number *</label>
                        <input 
                            type="tel" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            required 
                            className="w-full p-2 rounded bg-[var(--dark-bg)] text-[var(--text-primary)] border border-[var(--light-bg)] focus:border-[var(--primary-color)] outline-none" 
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Broker RERA No. *</label>
                        <input 
                            type="text" 
                            name="reraNumber" 
                            value={formData.reraNumber} 
                            onChange={handleChange} 
                            required 
                            placeholder="A518000..."
                            className="w-full p-2 rounded bg-[var(--dark-bg)] text-[var(--text-primary)] border border-[var(--light-bg)] focus:border-[var(--primary-color)] outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Commission Rate (%)</label>
                        <input 
                            type="number" 
                            step="0.1" 
                            name="commissionRate" 
                            value={formData.commissionRate} 
                            onChange={handleChange} 
                            className="w-full p-2 rounded bg-[var(--dark-bg)] text-[var(--text-primary)] border border-[var(--light-bg)] focus:border-[var(--primary-color)] outline-none" 
                        />
                    </div>
                </div>
                
                <div className="bg-blue-500/10 p-3 rounded-md border border-blue-500/20 text-[10px] text-blue-400">
                    <p><i className="fas fa-info-circle mr-1"></i> Partners will remain in 'Pending' status until RERA details are verified by your compliance team.</p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--light-bg)]">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded text-[var(--text-secondary)] hover:bg-[var(--light-bg)] font-medium transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2 rounded bg-[var(--primary-color)] text-white font-bold hover:bg-[#128c7e] shadow-lg transition-all">Submit Registration</button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default NewChannelPartnerModal;
