
import React from 'react';
import { Project, Vendor, WorkOrder, User, WOStatus, NewWOData } from '../../types';
import { db } from '../../db';
import { v4 as uuidv4 } from 'uuid';

interface ContractingHubProps {
  wo: WorkOrder[];
  vendors: Vendor[];
  projects: Project[];
  users: User[];
}

const ContractingHub: React.FC<ContractingHubProps> = ({ wo, vendors, projects, users }) => {
  const [selectedProjectId, setSelectedProjectId] = React.useState(projects[0]?.id || '');
  const [showWOModal, setShowWOModal] = React.useState(false);

  const projectWOs = wo.filter(w => w.projectId === selectedProjectId);

  const handleCreateWO = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const newWO: WorkOrder = {
          id: uuidv4(),
          woNumber: `${Math.floor(1000 + Math.random() * 9000)}`,
          projectId: selectedProjectId,
          vendorId: fd.get('vendorId') as string,
          subject: fd.get('subject') as string,
          status: 'Active',
          billingType: fd.get('billingType') as any,
          startDate: fd.get('start') as string,
          endDate: fd.get('end') as string,
          contractValue: parseFloat(fd.get('value') as string) || 0,
          retentionPercent: parseFloat(fd.get('retention') as string) || 5,
          tdsPercent: parseFloat(fd.get('tds') as string) || 1,
          scopeOfWork: fd.get('scope') as string,
          milestones: []
      };
      await db.workOrders.add(newWO);
      setShowWOModal(false);
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 animate-fadeIn">
      {/* Header Controls */}
      <div className="bg-white p-4 rounded border border-[#dadce0] shadow-sm flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex flex-1 items-center gap-4 w-full">
              <div className="flex flex-col">
                  <h3 className="text-lg font-medium text-[#202124]">Work Order Register</h3>
                  <select 
                    value={selectedProjectId} 
                    onChange={e => setSelectedProjectId(e.target.value)}
                    className="bg-transparent text-sm text-[#1a73e8] font-semibold focus:outline-none cursor-pointer mt-0.5"
                  >
                      {projects.map(p => <option key={p.id} value={p.id} className="text-black">{p.name}</option>)}
                  </select>
              </div>
          </div>
          <button 
            onClick={() => setShowWOModal(true)}
            className="bg-[#1a73e8] text-white px-4 py-2 rounded text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
          >
              <i className="fas fa-plus"></i> RELEASE CONTRACT
          </button>
      </div>

      {/* GCP Table */}
      <div className="bg-white rounded border border-[#dadce0] shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="overflow-x-auto flex-1 custom-scrollbar">
              <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-[#f8f9fa] border-b border-[#dadce0]">
                      <tr className="text-gray-600 font-semibold uppercase text-[11px] tracking-wider">
                          <th className="px-4 py-3">Order ID</th>
                          <th className="px-4 py-3">Contractor Resource</th>
                          <th className="px-4 py-3">Contract Scope</th>
                          <th className="px-4 py-3 text-right">Value (INR)</th>
                          <th className="px-4 py-3 text-center">Retention</th>
                          <th className="px-4 py-3 text-center">State</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dadce0]">
                      {projectWOs.map(w => (
                          <tr key={w.id} className="hover:bg-[#f8f9fa] transition-colors">
                              <td className="px-4 py-4 font-medium text-[#1a73e8] hover:underline cursor-pointer">WO-{w.woNumber}</td>
                              <td className="px-4 py-4 text-gray-700 font-medium">{vendors.find(v => v.id === w.vendorId)?.firmName}</td>
                              <td className="px-4 py-4 text-gray-500 max-w-xs truncate" title={w.subject}>{w.subject}</td>
                              <td className="px-4 py-4 text-right font-mono text-gray-900 font-bold">₹{w.contractValue.toLocaleString()}</td>
                              <td className="px-4 py-4 text-center text-gray-400 font-bold">{w.retentionPercent}%</td>
                              <td className="px-4 py-4 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${w.status === 'Active' ? 'bg-[#e6f4ea] text-[#1e8e3e]' : 'bg-gray-100 text-gray-500'}`}>
                                      {w.status}
                                  </span>
                              </td>
                              <td className="px-4 py-4 text-right">
                                  <button className="text-gray-400 hover:text-[#1a73e8] p-2"><i className="fas fa-ellipsis-v"></i></button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
              {projectWOs.length === 0 && (
                   <div className="p-20 text-center text-gray-400">
                       <i className="fas fa-file-signature text-2xl mb-2 opacity-20"></i>
                       <p className="text-sm">No active service contracts recorded for this site.</p>
                   </div>
              )}
          </div>
      </div>

      {showWOModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[110] p-4 animate-fadeIn backdrop-blur-[1px]">
               <div className="bg-white rounded shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden border border-[#dadce0]" onClick={e => e.stopPropagation()}>
                    <div className="px-5 py-3.5 border-b border-[#dadce0] bg-[#f8f9fa] flex justify-between items-center flex-shrink-0">
                        <div>
                            <h3 className="text-lg font-medium text-[#202124]">Provision Service Contract</h3>
                            <p className="text-[11px] text-[#5f6368]">Configure work order and financial compliance for contractor</p>
                        </div>
                        <button onClick={() => setShowWOModal(false)} className="text-[#5f6368] hover:text-[#202124] p-1.5 hover:bg-black/5 rounded-full transition-all">
                            <i className="fas fa-times text-base"></i>
                        </button>
                    </div>
                    <form onSubmit={handleCreateWO} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        <section>
                            <h4 className="text-[11px] font-bold text-[#1a73e8] uppercase tracking-wider mb-4 pb-1 border-b border-[#e8f0fe]">1. Contract Entities</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-[#5f6368] uppercase mb-1">Contractor Resource *</label>
                                    <select name="vendorId" required className="w-full bg-[#f1f3f4] border-b border-[#dadce0] focus:border-[#1a73e8] px-3 py-2 text-sm outline-none transition-all">
                                        <option value="">-- Choose Partner --</option>
                                        {vendors.filter(v => v.vendorType !== 'Material Supplier').map(v => <option key={v.id} value={v.id}>{v.firmName}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#5f6368] uppercase mb-1">Measurement Type *</label>
                                    <select name="billingType" required className="w-full bg-[#f1f3f4] border-b border-[#dadce0] focus:border-[#1a73e8] px-3 py-2 text-sm outline-none transition-all">
                                        <option value="BOQ-based">Item-rate (Standard)</option>
                                        <option value="Lump-sum">Lump-sum (Fixed)</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h4 className="text-[11px] font-bold text-[#1a73e8] uppercase tracking-wider mb-4 pb-1 border-b border-[#e8f0fe]">2. Scope & Timeline</h4>
                            <div className="space-y-4">
                                <GCPField label="Subject / Work Title *" name="subject" required placeholder="e.g., Tower A Electrical Roughing" />
                                <div className="grid grid-cols-2 gap-4">
                                    <GCPField label="Commencement Date" name="start" type="date" />
                                    <GCPField label="Estimated Handover" name="end" type="date" />
                                </div>
                            </div>
                        </section>

                        <section>
                            <h4 className="text-[11px] font-bold text-[#1a73e8] uppercase tracking-wider mb-4 pb-1 border-b border-[#e8f0fe]">3. Commercial Terms</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <GCPField label="Total Order Value *" name="value" type="number" required placeholder="₹" />
                                <GCPField label="Retention %" name="retention" type="number" />
                                <GCPField label="TDS % (Tax)" name="tds" type="number" />
                            </div>
                        </section>

                        <section>
                            <label className="block text-[11px] font-bold text-[#5f6368] uppercase mb-1">Special Clauses / Scope Description</label>
                            <textarea name="scope" rows={3} className="w-full bg-[#f1f3f4] border-b border-[#dadce0] focus:border-[#1a73e8] p-3 text-sm outline-none transition-all resize-none" placeholder="Detailed technical clauses..."></textarea>
                        </section>
                    </form>
                    <div className="px-5 py-3 border-t border-[#dadce0] bg-[#f8f9fa] flex justify-end gap-2 flex-shrink-0">
                        <button type="button" onClick={() => setShowWOModal(false)} className="px-4 py-1.5 text-[#1a73e8] text-sm font-bold hover:bg-[#e8f0fe] rounded transition-all">CANCEL</button>
                        <button type="submit" className="px-5 py-1.5 bg-[#1a73e8] text-white text-sm font-bold rounded shadow-sm hover:shadow-md hover:bg-[#1557b0] transition-all">PROVISION</button>
                    </div>
               </div>
          </div>
      )}
    </div>
  );
};

const GCPField: React.FC<{ label: string; name: string; type?: string; required?: boolean; placeholder?: string }> = ({ label, name, type = "text", required, placeholder }) => (
    <div>
        <label className="block text-[11px] font-bold text-[#5f6368] uppercase mb-1">{label}</label>
        <input name={name} type={type} required={required} placeholder={placeholder} className="w-full bg-[#f1f3f4] border-b border-[#dadce0] focus:border-[#1a73e8] px-3 py-2 text-sm text-[#202124] outline-none transition-all" />
    </div>
);

export default ContractingHub;
