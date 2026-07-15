
import React from 'react';
import { Vendor, NewVendorData, VendorType } from '../../types';
import NewVendorModal from './NewVendorModal';

interface VendorManagementProps {
  vendors: Vendor[];
  onAddVendor: (data: NewVendorData) => void;
  onUpdateVendors: (updated: Vendor[]) => void;
  mode: 'Vendors' | 'Contractors' | 'All';
}

const VendorManagement: React.FC<VendorManagementProps> = ({ vendors, onAddVendor, onUpdateVendors, mode }) => {
  const [showModal, setShowModal] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<VendorType | 'All'>('All');

  const safeVendors = vendors || [];

  const filtered = safeVendors.filter(v => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      v.firmName.toLowerCase().includes(term) ||
      v.vendorCode.toLowerCase().includes(term) ||
      v.contactPerson.toLowerCase().includes(term) ||
      v.gstin.toLowerCase().includes(term) ||
      v.pan.toLowerCase().includes(term);
    
    let matchesMode = true;
    if (mode === 'Vendors') matchesMode = v.vendorType === 'Material Supplier';
    if (mode === 'Contractors') matchesMode = v.vendorType !== 'Material Supplier';
    
    const matchesType = typeFilter === 'All' || v.vendorType === typeFilter;
    
    return matchesSearch && matchesMode && matchesType;
  });

  const handleToggleActive = async (v: Vendor) => {
      const updated = safeVendors.map(vendor => 
          vendor.id === v.id ? { ...vendor, isActive: !vendor.isActive } : vendor
      );
      onUpdateVendors(updated);
  };

  const handleBlacklist = async (v: Vendor) => {
      if (v.isBlacklisted) {
          if (window.confirm(`Revoke block for ${v.firmName}?`)) {
              const updated = safeVendors.map(vendor => 
                  vendor.id === v.id ? { ...vendor, isBlacklisted: false, blacklistReason: '' } : vendor
              );
              onUpdateVendors(updated);
          }
          return;
      }
      const reason = window.prompt("Enter reason for blocking this entity:", "");
      if (reason !== null && reason.trim() !== "") {
          const updated = safeVendors.map(vendor => 
              vendor.id === v.id ? { ...vendor, isBlacklisted: true, blacklistReason: reason } : vendor
          );
          onUpdateVendors(updated);
      }
  };

  return (
    <div className="p-6 flex flex-col h-full gap-6 animate-fadeIn">
      {/* Search and Action Bar */}
      <div className="bg-white p-4 rounded border border-[#dadce0] shadow-sm flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex flex-1 items-center gap-4 w-full">
            <div className="relative w-full max-w-md">
                 <input 
                    type="text" 
                    placeholder="Filter vendors by firm name, GST, or contact..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-[#f1f3f4] border-b border-transparent focus:border-[#1a73e8] rounded-t px-10 py-2 text-sm text-gray-900 outline-none transition-all"
                 />
                 <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
            </div>
            <div className="h-6 w-px bg-[#dadce0] hidden lg:block"></div>
            <select 
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as any)}
                className="bg-transparent text-sm text-[#1a73e8] font-semibold focus:outline-none cursor-pointer"
            >
                <option value="All">All Classifications</option>
                <option value="Material Supplier">Material Suppliers</option>
                <option value="Labour Contractor">Labour Contractors</option>
                <option value="Sub-Contractor">Sub-Contractors</option>
            </select>
        </div>
        <button 
            onClick={() => setShowModal(true)}
            className="bg-[#1a73e8] text-white px-4 py-2 rounded text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
        >
            <i className="fas fa-plus"></i> CREATE RESOURCE
        </button>
      </div>

      {/* GCP Table */}
      <div className="bg-white rounded border border-[#dadce0] shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="overflow-x-auto flex-1 custom-scrollbar">
              <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-[#f8f9fa] border-b border-[#dadce0]">
                      <tr className="text-gray-600 font-semibold uppercase text-[11px] tracking-wider">
                          <th className="px-4 py-3">Resource Name</th>
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3">Compliance ID</th>
                          <th className="px-4 py-3 text-right">Credit (Days)</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dadce0]">
                      {filtered.map(vendor => (
                          <tr key={vendor.id} className={`${vendor.isBlacklisted ? 'bg-red-50/50' : 'bg-white'}`}>
                              <td className="px-4 py-4">
                                  <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${vendor.isBlacklisted ? 'bg-red-100 text-red-700' : 'bg-[#e8f0fe] text-[#1a73e8]'}`}>
                                          {vendor.firmName.charAt(0)}
                                      </div>
                                      <div>
                                          <div className="font-medium text-[#1a73e8] hover:underline cursor-pointer">{vendor.firmName}</div>
                                          <div className="text-[11px] text-gray-500 flex items-center gap-2">
                                              <span className="font-mono">{vendor.vendorCode}</span>
                                              <span>•</span>
                                              <span>{vendor.contactPerson}</span>
                                          </div>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-4 py-4 text-gray-600">{vendor.vendorType}</td>
                              <td className="px-4 py-4">
                                  <div className="flex flex-col gap-0.5">
                                      <span className="text-[11px] font-mono font-medium text-gray-900">GST: {vendor.gstin || 'EXEMPT'}</span>
                                      <span className="text-[11px] font-mono text-gray-400">PAN: {vendor.pan}</span>
                                  </div>
                              </td>
                              <td className="px-4 py-4 text-right font-medium text-gray-900">{vendor.creditDays}</td>
                              <td className="px-4 py-4 text-center">
                                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                      vendor.isBlacklisted ? 'bg-red-100 text-red-700' : 
                                      vendor.isActive ? 'bg-[#e6f4ea] text-[#1e8e3e]' : 
                                      'bg-gray-100 text-gray-500'
                                  }`}>
                                      {vendor.isBlacklisted ? 'Blocked' : vendor.isActive ? 'Active' : 'Inactive'}
                                  </span>
                              </td>
                              <td className="px-4 py-4 text-right">
                                  <div className="flex justify-end gap-1">
                                      <button onClick={() => handleToggleActive(vendor)} className="p-2 text-gray-500 hover:text-[#1a73e8] transition-colors" title="Toggle Status"><i className="fas fa-power-off text-xs"></i></button>
                                      <button onClick={() => handleBlacklist(vendor)} className={`p-2 transition-colors ${vendor.isBlacklisted ? 'text-red-600' : 'text-gray-400 hover:text-red-500'}`} title="Block Resource"><i className="fas fa-ban text-xs"></i></button>
                                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><i className="fas fa-ellipsis-v text-xs"></i></button>
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          {filtered.length === 0 && (
              <div className="p-20 text-center text-gray-500">
                  <i className="fas fa-search text-2xl mb-2 opacity-20"></i>
                  <p className="text-sm">No resources match the current filter.</p>
              </div>
          )}
      </div>

      <NewVendorModal isOpen={showModal} onClose={() => setShowModal(false)} onAdd={onAddVendor} />
    </div>
  );
};

export default VendorManagement;
