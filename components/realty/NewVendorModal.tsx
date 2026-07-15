
import React from 'react';
import { NewVendorData, VendorType, MSMEType, TDSCategory } from '../../types';

interface NewVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: NewVendorData) => void;
}

const NewVendorModal: React.FC<NewVendorModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = React.useState<NewVendorData>({
    firmName: '',
    vendorType: 'Material Supplier',
    contactPerson: '',
    email: '',
    phone: '',
    gstin: '',
    pan: '',
    msmeType: 'Not Registered',
    msmeNumber: '',
    tdsCategory: '194C (Contractors)',
    creditDays: 30,
    labourLicenseNo: '',
    pfEsicRegistration: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: '',
    address: '',
    city: '',
    state: '',
    vendorRating: 5,
    customData: {}
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: (name === 'creditDays' || name === 'vendorRating') ? parseInt(value, 10) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firmName || !formData.vendorType || !formData.pan) {
        alert("Firm Name, Type, and PAN are mandatory.");
        return;
    }
    onAdd({
        ...formData,
        pan: formData.pan.toUpperCase(),
        gstin: formData.gstin.toUpperCase()
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[100] p-4 animate-fadeIn backdrop-blur-[1px]">
        <div className="bg-white rounded shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden border border-[#dadce0]" onClick={e => e.stopPropagation()}>
            {/* GCP Header - Compact */}
            <div className="px-5 py-3.5 border-b border-[#dadce0] bg-[#f8f9fa] flex justify-between items-center flex-shrink-0">
                <div>
                    <h3 className="text-lg font-medium text-[#202124]">Create Vendor Resource</h3>
                    <p className="text-[11px] text-[#5f6368]">Register a new material supplier or service contractor</p>
                </div>
                <button onClick={onClose} className="text-[#5f6368] hover:text-[#202124] p-1.5 hover:bg-black/5 rounded-full transition-all">
                    <i className="fas fa-times text-base"></i>
                </button>
            </div>

            {/* High Density Scrollable Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="space-y-8">
                    {/* Basic Identity */}
                    <section>
                        <h4 className="text-[11px] font-bold text-[#1a73e8] uppercase tracking-wider mb-4 pb-1 border-b border-[#e8f0fe]">1. General Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="md:col-span-2">
                                <GCPField label="Legal Firm Name *" name="firmName" value={formData.firmName} onChange={handleChange} required placeholder="Full registered company name" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-[#5f6368] uppercase mb-1">Resource Type *</label>
                                <select name="vendorType" value={formData.vendorType} onChange={handleChange} className="w-full bg-[#f1f3f4] border-b border-[#dadce0] focus:border-[#1a73e8] px-3 py-2 text-sm outline-none transition-all cursor-pointer">
                                    <option value="Material Supplier">Material Supplier</option>
                                    <option value="Labour Contractor">Labour Contractor</option>
                                    <option value="EPC / Civil Contractor">EPC / Civil Contractor</option>
                                    <option value="Sub-Contractor">Sub-Contractor</option>
                                    <option value="Consultant (Architect, Liaison, Legal)">Consultant</option>
                                </select>
                            </div>
                            <GCPField label="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="POC Name" />
                            <GCPField label="Mobile Number" name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+91" />
                            <GCPField label="Work Email" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="example@firm.com" />
                        </div>
                    </section>

                    {/* Statutory Compliance */}
                    <section>
                        <h4 className="text-[11px] font-bold text-[#1a73e8] uppercase tracking-wider mb-4 pb-1 border-b border-[#e8f0fe]">2. Compliance & Credit</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                            <GCPField label="PAN Card *" name="pan" value={formData.pan} onChange={handleChange} required placeholder="ABCDE1234F" />
                            <GCPField label="GSTIN" name="gstin" value={formData.gstin} onChange={handleChange} placeholder="27AAAAA..." />
                            <div>
                                <label className="block text-[11px] font-bold text-[#5f6368] uppercase mb-1">TDS Default</label>
                                <select name="tdsCategory" value={formData.tdsCategory} onChange={handleChange} className="w-full bg-[#f1f3f4] border-b border-[#dadce0] focus:border-[#1a73e8] px-3 py-2 text-sm outline-none transition-all cursor-pointer">
                                    <option value="194C (Contractors)">194C (2%)</option>
                                    <option value="194J (Professional)">194J (10%)</option>
                                    <option value="No TDS">Exempt</option>
                                </select>
                            </div>
                            <GCPField label="Credit Days" name="creditDays" type="number" value={formData.creditDays.toString()} onChange={handleChange} />
                            <div>
                                <label className="block text-[11px] font-bold text-[#5f6368] uppercase mb-1">MSME Slab</label>
                                <select name="msmeType" value={formData.msmeType} onChange={handleChange} className="w-full bg-[#f1f3f4] border-b border-[#dadce0] focus:border-[#1a73e8] px-3 py-2 text-sm outline-none transition-all cursor-pointer">
                                    <option value="Not Registered">Not Registered</option>
                                    <option value="Micro">Micro</option>
                                    <option value="Small">Small</option>
                                    <option value="Medium">Medium</option>
                                </select>
                            </div>
                            <GCPField label="MSME Number" name="msmeNumber" value={formData.msmeNumber || ''} onChange={handleChange} />
                        </div>
                    </section>

                    {/* Settlement Banking */}
                    <section>
                        <h4 className="text-[11px] font-bold text-[#1a73e8] uppercase tracking-wider mb-4 pb-1 border-b border-[#e8f0fe]">3. Payment Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <GCPField label="Bank Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
                            <GCPField label="Bank IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
                            <GCPField label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} />
                            <GCPField label="Branch Location" name="branchName" value={formData.branchName || ''} onChange={handleChange} />
                        </div>
                    </section>

                    {/* Address Detail */}
                    <section>
                        <h4 className="text-[11px] font-bold text-[#1a73e8] uppercase tracking-wider mb-4 pb-1 border-b border-[#e8f0fe]">4. Address</h4>
                        <div className="space-y-4">
                            <div className="w-full">
                                <label className="block text-[11px] font-bold text-[#5f6368] uppercase mb-1">Registered Address</label>
                                <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full bg-[#f1f3f4] border-b border-[#dadce0] focus:border-[#1a73e8] px-3 py-2 text-sm outline-none transition-all resize-none" placeholder="Street, Building..."></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <GCPField label="City" name="city" value={formData.city || ''} onChange={handleChange} />
                                <GCPField label="State" name="state" value={formData.state || ''} onChange={handleChange} />
                            </div>
                        </div>
                    </section>
                </div>
            </form>

            {/* GCP Action Bar - Consistent Height */}
            <div className="px-5 py-3 border-t border-[#dadce0] bg-[#f8f9fa] flex justify-end gap-2 flex-shrink-0">
                <button type="button" onClick={onClose} className="px-4 py-1.5 text-[#1a73e8] text-sm font-bold hover:bg-[#e8f0fe] rounded transition-all">CANCEL</button>
                <button onClick={handleSubmit} className="px-5 py-1.5 bg-[#1a73e8] text-white text-sm font-bold rounded shadow-sm hover:shadow-md hover:bg-[#1557b0] transition-all">CREATE</button>
            </div>
        </div>
    </div>
  );
};

const GCPField: React.FC<{ label: string; name: string; value: string; onChange: any; required?: boolean; placeholder?: string; type?: string }> = 
({ label, name, value, onChange, required, placeholder, type = 'text' }) => (
    <div className="w-full">
        <label className="block text-[11px] font-bold text-[#5f6368] uppercase mb-1">{label}</label>
        <input 
            type={type} 
            name={name} 
            value={value} 
            onChange={onChange} 
            required={required} 
            placeholder={placeholder}
            className="w-full bg-[#f1f3f4] border-b border-[#dadce0] focus:border-[#1a73e8] px-3 py-2 text-sm text-[#202124] outline-none transition-all placeholder:text-gray-400" 
        />
    </div>
);

export default NewVendorModal;
