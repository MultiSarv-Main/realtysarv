
import React from 'react';
import { Project, MaterialMaster, ServiceMaster, BOQ, BOQItem, BOQStatus, NewBOQData } from '../../types';
import { db } from '../../db';
import { v4 as uuidv4 } from 'uuid';

interface BOQPlanningProps {
  projects: Project[];
  materials: MaterialMaster[];
  services: ServiceMaster[];
  boqs: BOQ[];
  boqItems: BOQItem[];
}

const BOQPlanning: React.FC<BOQPlanningProps> = ({ projects, materials, services, boqs, boqItems }) => {
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>(projects[0]?.id || '');
  const [activeTab, setActiveTab] = React.useState<'boq-list' | 'material-demand' | 'variance-analysis'>('boq-list');
  const [showNewBOQModal, setShowNewBOQModal] = React.useState(false);
  const [selectedBOQId, setSelectedBOQId] = React.useState<string | null>(null);

  const projectBOQs = boqs.filter(b => b.projectId === selectedProjectId);
  const selectedBOQ = boqs.find(b => b.id === selectedBOQId);
  const selectedItems = boqItems.filter(item => item.boqId === selectedBOQId);

  const handleCreateBOQ = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const name = fd.get('name') as string;
      const newVersion = projectBOQs.length + 1;
      const newBOQ: BOQ = {
          id: uuidv4(),
          projectId: selectedProjectId,
          name: name,
          version: newVersion,
          revisionLabel: `Rev-${newVersion - 1}`,
          status: 'Draft',
          createdAt: new Date().toISOString().split('T')[0],
          totalEstimate: 0
      };
      await db.boqs.add(newBOQ);
      setShowNewBOQModal(false);
      setSelectedBOQId(newBOQ.id);
  };

  const handleAddItemToBOQ = async (type: 'Material' | 'Service', masterId: string) => {
      if (!selectedBOQId) return;
      const newItem: BOQItem = {
          id: uuidv4(),
          boqId: selectedBOQId,
          masterId,
          itemType: type,
          quantity: 0,
          estimatedRate: 0,
          amount: 0
      };
      await db.boqItems.add(newItem);
  };

  const handleUpdateItem = async (itemId: string, qty: number, rate: number) => {
      await db.boqItems.update(itemId, { 
          quantity: qty, 
          estimatedRate: rate, 
          amount: qty * rate 
      });
      if (selectedBOQId) {
          const updatedItems = await db.boqItems.where({ boqId: selectedBOQId }).toArray();
          const total = updatedItems.reduce((s, i) => s + (i.amount || 0), 0);
          await db.boqs.update(selectedBOQId, { totalEstimate: total });
      }
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 animate-fadeIn">
      {/* GCP Header */}
      <div className="bg-white p-4 rounded border border-[#dadce0] shadow-sm flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex-1 flex flex-col">
              <h3 className="text-lg font-medium text-[#202124]">Resource Estimation (BOQ)</h3>
              <select 
                value={selectedProjectId} 
                onChange={e => setSelectedProjectId(e.target.value)}
                className="bg-transparent text-sm text-[#1a73e8] font-semibold focus:outline-none cursor-pointer mt-0.5"
              >
                  {projects.map(p => <option key={p.id} value={p.id} className="text-black">{p.name}</option>)}
              </select>
          </div>
          <button onClick={() => setShowNewBOQModal(true)} className="bg-[#1a73e8] text-white px-4 py-2 rounded text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap">
              <i className="fas fa-plus"></i> CREATE VERSION
          </button>
      </div>

      <div className="flex border-b border-[#dadce0]">
          <TabBtn active={activeTab === 'boq-list'} onClick={() => setActiveTab('boq-list')} label="BILL OF QUANTITIES" icon="fas fa-list-check" />
          <TabBtn active={activeTab === 'material-demand'} onClick={() => setActiveTab('material-demand')} label="DEMAND FORECAST" icon="fas fa-chart-pie" />
      </div>

      <div className="flex-1 overflow-hidden flex gap-6">
          <div className="flex-1 bg-white rounded border border-[#dadce0] overflow-hidden shadow-sm flex flex-col">
              {activeTab === 'boq-list' && (
                  <div className="flex flex-1 overflow-hidden">
                      {/* Sidebar - Revisions */}
                      <div className="w-64 border-r border-[#dadce0] flex flex-col bg-[#f8f9fa]">
                          <div className="p-3 border-b border-[#dadce0] text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Revisions</div>
                          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                              {projectBOQs.map(boq => (
                                  <button 
                                    key={boq.id} 
                                    onClick={() => setSelectedBOQId(boq.id)}
                                    className={`w-full p-3 rounded text-left transition-all ${selectedBOQId === boq.id ? 'bg-[#e8f0fe] border border-[#1a73e8] text-[#1a73e8] font-bold' : 'text-[#3c4043] hover:bg-gray-200'}`}
                                  >
                                      <div className="flex justify-between items-start mb-0.5">
                                          <span className="text-[10px] uppercase">{boq.revisionLabel}</span>
                                          <span className={`text-[8px] font-bold px-1 py-0.5 rounded uppercase ${boq.status === 'Approved' ? 'bg-[#e6f4ea] text-[#1e8e3e]' : 'bg-gray-100 text-gray-500'}`}>{boq.status}</span>
                                      </div>
                                      <p className="text-xs truncate">{boq.name}</p>
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Main Editor */}
                      <div className="flex-1 flex flex-col overflow-hidden bg-white">
                          {selectedBOQ ? (
                              <>
                                  <div className="p-4 border-b border-[#dadce0] flex justify-between items-center bg-[#f8f9fa]">
                                      <h4 className="font-medium text-[#202124] text-sm">{selectedBOQ.name}</h4>
                                      <div className="flex items-center gap-2">
                                          <select onChange={e => handleAddItemToBOQ('Material', e.target.value)} className="bg-white border border-[#dadce0] text-[10px] font-bold p-1 rounded outline-none cursor-pointer">
                                              <option>+ ADD MATERIAL</option>
                                              {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                          </select>
                                          <select onChange={e => handleAddItemToBOQ('Service', e.target.value)} className="bg-white border border-[#dadce0] text-[10px] font-bold p-1 rounded outline-none cursor-pointer">
                                              <option>+ ADD SERVICE</option>
                                              {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                          </select>
                                      </div>
                                  </div>
                                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                                      <table className="w-full text-left text-sm">
                                          <thead className="bg-[#f8f9fa] border-b border-[#dadce0] sticky top-0 z-10">
                                              <tr className="text-gray-600 font-semibold uppercase text-[11px]">
                                                  <th className="px-4 py-3">Resource Item</th>
                                                  <th className="px-4 py-3">Unit</th>
                                                  <th className="px-4 py-3">Quantity</th>
                                                  <th className="px-4 py-3">Rate</th>
                                                  <th className="px-4 py-3 text-right">Amount</th>
                                              </tr>
                                          </thead>
                                          <tbody className="divide-y divide-[#dadce0]">
                                              {selectedItems.map(item => {
                                                  const master = item.itemType === 'Material' ? materials.find(m => m.id === item.masterId) : services.find(s => s.id === item.masterId);
                                                  return (
                                                      <tr key={item.id} className="hover:bg-[#f8f9fa]">
                                                          <td className="px-4 py-4">
                                                              <p className="font-medium text-gray-900">{master?.name}</p>
                                                              <p className="text-[10px] text-[#1a73e8] font-bold uppercase">{item.itemType}</p>
                                                          </td>
                                                          <td className="px-4 py-4 font-bold text-gray-400">{master?.uom}</td>
                                                          <td className="px-4 py-4">
                                                              <input type="number" defaultValue={item.quantity} onBlur={e => handleUpdateItem(item.id, parseFloat(e.target.value) || 0, item.estimatedRate)} className="w-20 bg-[#f1f3f4] border-b border-[#dadce0] p-1 text-sm text-center" />
                                                          </td>
                                                          <td className="px-4 py-4">
                                                              <input type="number" defaultValue={item.estimatedRate} onBlur={e => handleUpdateItem(item.id, item.quantity, parseFloat(e.target.value) || 0)} className="w-20 bg-[#f1f3f4] border-b border-[#dadce0] p-1 text-sm text-center" />
                                                          </td>
                                                          <td className="px-4 py-4 text-right font-mono font-bold text-gray-900">₹{item.amount.toLocaleString()}</td>
                                                      </tr>
                                                  );
                                              })}
                                          </tbody>
                                      </table>
                                  </div>
                                  <div className="p-4 bg-[#f8f9fa] border-t border-[#dadce0] flex justify-between items-center">
                                      <span className="text-[11px] font-bold text-gray-500 uppercase">Estimated Project Value</span>
                                      <span className="text-xl font-medium text-gray-900">₹{selectedBOQ.totalEstimate.toLocaleString()}</span>
                                  </div>
                              </>
                          ) : (
                              <div className="flex-1 flex items-center justify-center text-gray-400 italic text-sm">Select a revision to begin planning.</div>
                          )}
                      </div>
                  </div>
              )}
          </div>
      </div>

      {showNewBOQModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[110] p-4 animate-fadeIn backdrop-blur-[1px]">
              <div className="bg-white rounded shadow-2xl w-full max-w-xl border border-[#dadce0] overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="px-5 py-3.5 border-b border-[#dadce0] bg-[#f8f9fa] flex justify-between items-center">
                      <h3 className="text-base font-medium text-[#202124]">Create BOQ Revision</h3>
                      <button onClick={() => setShowNewBOQModal(false)} className="text-[#5f6368] p-1.5 hover:bg-black/5 rounded-full transition-all"><i className="fas fa-times"></i></button>
                  </div>
                  <form onSubmit={handleCreateBOQ} className="p-6 space-y-4">
                      <div>
                          <label className="block text-[11px] font-bold text-[#5f6368] uppercase mb-1">Revision Title *</label>
                          <input name="name" required placeholder="e.g., Structure & MEP Revision" className="w-full bg-[#f1f3f4] border-b border-[#dadce0] focus:border-[#1a73e8] p-2.5 text-sm text-[#202124] outline-none" />
                      </div>
                      <div className="flex justify-end gap-2 pt-4 border-t border-[#dadce0]">
                          <button type="button" onClick={() => setShowNewBOQModal(false)} className="px-4 py-1.5 text-[#1a73e8] text-sm font-bold hover:bg-[#e8f0fe] rounded transition-all">CANCEL</button>
                          <button type="submit" className="px-5 py-1.5 bg-[#1a73e8] text-white text-sm font-bold rounded shadow-sm hover:shadow-md hover:bg-[#1557b0] transition-all">CREATE</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

const TabBtn: React.FC<{ active: boolean; label: string; icon: string; onClick: () => void }> = ({ active, label, icon, onClick }) => (
    <button 
        onClick={onClick}
        className={`px-8 py-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest border-b-2 transition-all ${active ? 'border-[#1a73e8] text-[#1a73e8] bg-white shadow-sm' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
    >
        <i className={icon}></i>
        {label}
    </button>
);

export default BOQPlanning;
