
import React from 'react';
import { Project, Vendor, MaterialMaster, ServiceMaster, PurchaseRequisition, PurchaseOrder, User, PRStatus, POStatus, PurchaseOrderItem } from '../../types';
import { db } from '../../db';
import { v4 as uuidv4 } from 'uuid';

interface ProcurementHubProps {
  prs: PurchaseRequisition[];
  po: PurchaseOrder[];
  vendors: Vendor[];
  projects: Project[];
  materials: MaterialMaster[];
  services: ServiceMaster[];
  users: User[];
  currentUser: User;
}

const ProcurementHub: React.FC<ProcurementHubProps> = ({ prs, po, vendors, projects, materials, services, users, currentUser }) => {
  const [activeTab, setActiveTab] = React.useState<'pr' | 'po'>('pr');
  const [showPRModal, setShowPRModal] = React.useState(false);
  const [showPOModal, setShowPOModal] = React.useState(false);
  const [selectedProjectId, setSelectedProjectId] = React.useState(projects[0]?.id || '');

  // SYNC: Ensure selectedProjectId is updated once projects load from the database
  React.useEffect(() => {
      if (!selectedProjectId && projects && projects.length > 0) {
          setSelectedProjectId(projects[0].id);
      }
  }, [projects, selectedProjectId]);

  const projectPRs = prs.filter(p => p.projectId === selectedProjectId);
  const projectPOs = po.filter(p => p.projectId === selectedProjectId);

  const handleCreatePR = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      if (!selectedProjectId) {
          alert("Error: No Project Site selected. Please create or select a project first.");
          return;
      }

      const fd = new FormData(e.currentTarget);
      const isEmergency = fd.get('emergency') === 'on';
      const timestamp = new Date().toISOString();
      const prId = uuidv4();
      const remarks = fd.get('remarks') as string;
      
      const newPR: PurchaseRequisition = {
          id: prId,
          prNumber: `PR-${Math.floor(100000 + Math.random() * 900000)}`,
          projectId: selectedProjectId,
          requesterId: currentUser.id,
          date: timestamp.split('T')[0],
          status: isEmergency ? 'Approved' : 'Pending Project Mgr',
          isEmergency,
          emergencyReason: isEmergency ? remarks : undefined,
          items: [],
          remarks: remarks,
          totalAmount: 0,
          approvalHistory: []
      };

      try {
          await db.purchaseRequisitions.add(newPR);
          
          await db.auditTrails.add({
              id: uuidv4(),
              userId: currentUser.id,
              userName: currentUser.name,
              action: 'PR_CREATED',
              module: 'Procurement',
              entityId: prId,
              timestamp,
              details: `Created ${isEmergency ? 'Emergency ' : ''}Requisition: ${newPR.prNumber}`
          });

          setShowPRModal(false);
      } catch (err) {
          console.error("Failed to create PR:", err);
          alert("Submission failed. Please check your database connection.");
      }
  };

  const handleCreatePO = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const vendorId = fd.get('vendorId') as string;
      const baseAmount = parseFloat(fd.get('baseAmount') as string) || 0;
      
      if (!selectedProjectId || !vendorId) {
          alert("Please select a project and a vendor.");
          return;
      }

      const poId = uuidv4();
      const gstAmount = baseAmount * 0.18; // Default 18% for demo
      const timestamp = new Date().toISOString();

      const newPO: PurchaseOrder = {
          id: poId,
          poNumber: `PO-${Math.floor(100000 + Math.random() * 900000)}`,
          vendorId,
          projectId: selectedProjectId,
          date: timestamp.split('T')[0],
          status: 'Draft',
          items: [],
          baseAmount,
          gstAmount,
          freightAmount: 0,
          grandTotal: baseAmount + gstAmount,
          version: 1,
          approvalHistory: []
      };

      try {
          await db.purchaseOrders.add(newPO);
          setShowPOModal(false);
      } catch (err) {
          console.error("Failed to create PO:", err);
          alert("PO Creation failed.");
      }
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 animate-fadeIn">
      {/* GCP Header Strip */}
      <div className="bg-white p-4 rounded border border-[#dadce0] shadow-sm flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex flex-1 items-center gap-4 w-full">
              <div className="flex flex-col">
                  <h3 className="text-lg font-medium text-[#202124]">Procurement Hub</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                      <select 
                        value={selectedProjectId} 
                        onChange={e => setSelectedProjectId(e.target.value)}
                        className="bg-transparent text-sm text-[#1a73e8] font-semibold focus:outline-none cursor-pointer"
                      >
                          {projects.length === 0 && <option value="">No Projects Available</option>}
                          {projects.map(p => <option key={p.id} value={p.id} className="text-black">{p.name}</option>)}
                      </select>
                  </div>
              </div>
              <div className="h-10 w-px bg-[#dadce0] hidden lg:block mx-2"></div>
              <div className="flex gap-1 bg-[#f1f3f4] p-1 rounded">
                <button onClick={() => setActiveTab('pr')} className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'pr' ? 'bg-white text-[#1a73e8] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>REQUISITIONS</button>
                <button onClick={() => setActiveTab('po')} className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'po' ? 'bg-white text-[#1a73e8] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>PURCHASE ORDERS</button>
              </div>
          </div>
          <button 
            onClick={() => activeTab === 'pr' ? setShowPRModal(true) : setShowPOModal(true)}
            className="bg-[#1a73e8] text-white px-4 py-2 rounded text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
          >
              <i className="fas fa-plus"></i> {activeTab === 'pr' ? 'CREATE PR' : 'CREATE PO'}
          </button>
      </div>

      {/* GCP Table View */}
      <div className="bg-white rounded border border-[#dadce0] shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="overflow-x-auto flex-1 custom-scrollbar">
              <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-[#f8f9fa] border-b border-[#dadce0]">
                      <tr className="text-gray-600 font-semibold uppercase text-[11px] tracking-wider">
                          {activeTab === 'pr' ? (
                            <>
                                <th className="px-4 py-3">Indent ID</th>
                                <th className="px-4 py-3">Creation Date</th>
                                <th className="px-4 py-3">Requester</th>
                                <th className="px-4 py-3 text-center">Priority</th>
                                <th className="px-4 py-3">Workflow State</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </>
                          ) : (
                            <>
                                <th className="px-4 py-3">Order ID</th>
                                <th className="px-4 py-3">Vendor Resource</th>
                                <th className="px-4 py-3 text-right">Base Amount</th>
                                <th className="px-4 py-3 text-right">Total Payable</th>
                                <th className="px-4 py-3 text-center">Fulfillment</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </>
                          )}
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dadce0]">
                      {activeTab === 'pr' ? (
                          projectPRs.map(pr => (
                              <tr key={pr.id} className="hover:bg-[#f8f9fa] transition-colors">
                                  <td className="px-4 py-4 font-medium text-[#1a73e8] hover:underline cursor-pointer">{pr.prNumber}</td>
                                  <td className="px-4 py-4 text-gray-500 font-mono text-xs">{pr.date}</td>
                                  <td className="px-4 py-4 text-gray-700">{users.find(u => u.id === pr.requesterId)?.name || 'Unknown'}</td>
                                  <td className="px-4 py-4 text-center">
                                      {pr.isEmergency ? 
                                        <span className="text-red-600 text-[10px] font-bold uppercase"><i className="fas fa-bolt mr-1"></i> Urgent</span> :
                                        <span className="text-gray-400 text-[10px] font-bold uppercase">Normal</span>
                                      }
                                  </td>
                                  <td className="px-4 py-4">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${pr.status === 'Approved' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-[#e8f0fe] text-[#1a73e8] border border-blue-200'}`}>
                                          {pr.status}
                                      </span>
                                  </td>
                                  <td className="px-4 py-4 text-right">
                                      <button className="text-[#1a73e8] font-bold text-xs hover:underline">RESOURCES</button>
                                  </td>
                              </tr>
                          ))
                      ) : (
                          projectPOs.map(p => (
                              <tr key={p.id} className="hover:bg-[#f8f9fa] transition-colors">
                                  <td className="px-4 py-4 font-medium text-[#1a73e8] hover:underline cursor-pointer">{p.poNumber}</td>
                                  <td className="px-4 py-4 font-medium text-gray-700">{vendors.find(v => v.id === p.vendorId)?.firmName || 'Unknown Vendor'}</td>
                                  <td className="px-4 py-4 text-right text-gray-500 font-mono">₹{p.baseAmount.toLocaleString()}</td>
                                  <td className="px-4 py-4 text-right font-bold text-gray-900 font-mono">₹{p.grandTotal.toLocaleString()}</td>
                                  <td className="px-4 py-4 text-center">
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e8f0fe] text-[#1a73e8] border border-blue-200 uppercase">{p.status}</span>
                                  </td>
                                  <td className="px-4 py-4 text-right">
                                      <button className="text-gray-400 hover:text-[#1a73e8] p-2"><i className="fas fa-print"></i></button>
                                  </td>
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
              {(activeTab === 'pr' ? projectPRs.length : projectPOs.length) === 0 && (
                  <div className="p-20 text-center text-gray-400">
                      <i className="fas fa-search text-2xl mb-2 opacity-20"></i>
                      <p className="text-sm">No procurement records match the current view.</p>
                  </div>
              )}
          </div>
      </div>

      {/* REQUISITION MODAL */}
      {showPRModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[110] p-4 animate-fadeIn backdrop-blur-[1px]">
               <div className="bg-white rounded shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-[#dadce0]" onClick={e => e.stopPropagation()}>
                    <div className="px-5 py-3.5 border-b border-[#dadce0] bg-[#f8f9fa] flex justify-between items-center flex-shrink-0">
                        <div>
                            <h3 className="text-lg font-medium text-[#202124]">Create Purchase Requisition</h3>
                            <p className="text-[11px] text-[#5f6368]">Draft a new site indent for material procurement</p>
                        </div>
                        <button onClick={() => setShowPRModal(false)} className="text-[#5f6368] hover:text-[#202124] p-1.5 hover:bg-black/5 rounded-full transition-all">
                            <i className="fas fa-times text-base"></i>
                        </button>
                    </div>
                    <form onSubmit={handleCreatePR} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        <div className="p-4 rounded bg-[#fef2f2] border border-[#fee2e2] flex items-center gap-3">
                             <input type="checkbox" name="emergency" id="emergency" className="w-4 h-4 accent-red-600 rounded" />
                             <label htmlFor="emergency" className="text-xs font-bold text-red-700 uppercase tracking-tight cursor-pointer">Mark as Emergency Requisition (High Priority)</label>
                        </div>
                        
                        <div>
                            <label className="block text-[11px] font-bold text-[#5f6368] uppercase mb-1">Procurement Remarks / Justification *</label>
                            <textarea 
                                name="remarks" 
                                required 
                                rows={4}
                                className="w-full bg-[#f1f3f4] border-b border-[#dadce0] focus:border-[#1a73e8] p-3 text-sm text-[#202124] outline-none transition-all resize-none" 
                                placeholder="Explain why these resources are required now..."
                            ></textarea>
                        </div>

                        <div className="bg-[#e8f0fe] p-4 rounded border border-[#d2e3fc]">
                             <p className="text-[11px] text-[#1967d2] leading-relaxed font-medium">
                                 <i className="fas fa-info-circle mr-2"></i> 
                                 Line items can be added from the approved project BOQ after this draft is created.
                             </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 border border-[#dadce0] rounded bg-[#f8f9fa]">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Project Site</p>
                                <p className="text-sm font-medium text-gray-900">{projects.find(p => p.id === selectedProjectId)?.name || 'None'}</p>
                            </div>
                            <div className="p-3 border border-[#dadce0] rounded bg-[#f8f9fa]">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Requester ID</p>
                                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                            </div>
                        </div>
                    </form>
                    <div className="px-5 py-3 border-t border-[#dadce0] bg-[#f8f9fa] flex justify-end gap-2 flex-shrink-0">
                        <button type="button" onClick={() => setShowPRModal(false)} className="px-4 py-1.5 text-[#1a73e8] text-sm font-bold hover:bg-[#e8f0fe] rounded transition-all">CANCEL</button>
                        <button type="submit" className="px-5 py-1.5 bg-[#1a73e8] text-white text-sm font-bold rounded shadow-sm hover:shadow-md hover:bg-[#1557b0] transition-all">CREATE DRAFT</button>
                    </div>
               </div>
          </div>
      )}

      {/* PURCHASE ORDER MODAL */}
      {showPOModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[110] p-4 animate-fadeIn backdrop-blur-[1px]">
               <div className="bg-white rounded shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-[#dadce0]" onClick={e => e.stopPropagation()}>
                    <div className="px-5 py-3.5 border-b border-[#dadce0] bg-[#f8f9fa] flex justify-between items-center flex-shrink-0">
                        <div>
                            <h3 className="text-lg font-medium text-[#202124]">Generate Purchase Order</h3>
                            <p className="text-[11px] text-[#5f6368]">Direct purchase from a registered vendor resource</p>
                        </div>
                        <button onClick={() => setShowPOModal(false)} className="text-[#5f6368] hover:text-[#202124] p-1.5 hover:bg-black/5 rounded-full transition-all">
                            <i className="fas fa-times text-base"></i>
                        </button>
                    </div>
                    <form onSubmit={handleCreatePO} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        <div>
                            <label className="block text-[11px] font-bold text-[#5f6368] uppercase mb-1">Select Vendor *</label>
                            <select name="vendorId" required className="w-full bg-[#f1f3f4] border-b border-[#dadce0] focus:border-[#1a73e8] p-2.5 text-sm text-[#202124] outline-none transition-all">
                                <option value="">-- Choose Vendor --</option>
                                {vendors.filter(v => v.vendorType === 'Material Supplier').map(v => <option key={v.id} value={v.id}>{v.firmName}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-[#5f6368] uppercase mb-1">Base Order Amount (Excl. Tax) *</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                <input type="number" name="baseAmount" required className="w-full bg-[#f1f3f4] border-b border-[#dadce0] focus:border-[#1a73e8] pl-8 pr-3 py-2.5 text-sm text-[#202124] outline-none" placeholder="0.00" />
                            </div>
                        </div>

                        <div className="p-4 bg-[#f8f9fa] rounded border border-[#dadce0] space-y-2">
                             <div className="flex justify-between text-xs text-gray-500 font-bold uppercase tracking-widest">
                                 <span>Default GST (Simulation)</span>
                                 <span>18%</span>
                             </div>
                             <p className="text-[10px] text-gray-400">Total payable including taxes will be calculated automatically upon creation.</p>
                        </div>
                    </form>
                    <div className="px-5 py-3 border-t border-[#dadce0] bg-[#f8f9fa] flex justify-end gap-2 flex-shrink-0">
                        <button type="button" onClick={() => setShowPOModal(false)} className="px-4 py-1.5 text-[#1a73e8] text-sm font-bold hover:bg-[#e8f0fe] rounded transition-all">CANCEL</button>
                        <button type="submit" className="px-5 py-1.5 bg-[#1a73e8] text-white text-sm font-bold rounded shadow-sm hover:shadow-md hover:bg-[#1557b0] transition-all">GENERATE PO</button>
                    </div>
               </div>
          </div>
      )}
    </div>
  );
};

export default ProcurementHub;
