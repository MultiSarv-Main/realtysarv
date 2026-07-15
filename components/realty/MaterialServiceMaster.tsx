
import React from 'react';
import { MaterialMaster, ServiceMaster, MaterialCategory, ServiceCategory, UOM, NewMaterialData, NewServiceData } from '../../types';
import { db } from '../../db';
import { v4 as uuidv4 } from 'uuid';

interface MaterialServiceMasterProps {
  materials: MaterialMaster[];
  services: ServiceMaster[];
  forceMode?: 'materials' | 'services';
}

const MATERIAL_CATEGORIES: MaterialCategory[] = ['Cement', 'Steel', 'Sand', 'Aggregate', 'RMC', 'Electrical', 'Plumbing', 'Finishing', 'General'];
const SERVICE_CATEGORIES: ServiceCategory[] = ['Excavation', 'Shuttering', 'Brickwork', 'Plumbing Labour', 'Electrical Labour', 'Liaison', 'Legal', 'Consultancy'];
const UOMS: UOM[] = ['Bag', 'MT', 'Brass', 'SqFt', 'Cum', 'Running Ft', 'Nos', 'Kg', 'Bundle', 'Ltr'];

const MaterialServiceMaster: React.FC<MaterialServiceMasterProps> = ({ materials, services, forceMode }) => {
  const [internalTab, setInternalTab] = React.useState<'materials' | 'services'>('materials');
  const [showModal, setShowModal] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const activeTab = forceMode || internalTab;

  const filteredMaterials = (materials || []).filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServices = (services || []).filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.serviceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMaterial = async (data: NewMaterialData) => {
    const newItem: MaterialMaster = {
      ...data,
      id: uuidv4(),
      itemCode: `MAT-${Math.floor(1000 + Math.random() * 9000)}`,
      isActive: true
    };
    await db.materialMaster.add(newItem);
  };

  const handleAddService = async (data: NewServiceData) => {
    const newItem: ServiceMaster = {
      ...data,
      id: uuidv4(),
      serviceCode: `SRV-${Math.floor(1000 + Math.random() * 9000)}`,
      isActive: true
    };
    await db.serviceMaster.add(newItem);
  };

  const toggleItemActive = async (id: string, type: 'materials' | 'services', current: boolean) => {
      if (type === 'materials') {
          await db.materialMaster.update(id, { isActive: !current });
      } else {
          await db.serviceMaster.update(id, { isActive: !current });
      }
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 animate-fadeIn">
      {/* Header Controls */}
      <div className="bg-white p-4 rounded border border-[#dadce0] shadow-sm flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex flex-1 items-center gap-4 w-full">
            <div className="relative w-full max-w-md">
                 <input 
                    type="text" 
                    placeholder={`Search ${activeTab === 'materials' ? 'inventory SKUs' : 'service items'}...`} 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-[#f1f3f4] border-b border-transparent focus:border-[#1a73e8] rounded-t px-10 py-2 text-sm text-gray-900 outline-none transition-all"
                 />
                 <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
            </div>
            {!forceMode && (
                <>
                    <div className="h-6 w-px bg-[#dadce0] hidden lg:block"></div>
                    <div className="flex items-center gap-1 bg-[#f1f3f4] p-1 rounded">
                        <button onClick={() => setInternalTab('materials')} className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'materials' ? 'bg-white text-[#1a73e8] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>MATERIALS</button>
                        <button onClick={() => setInternalTab('services')} className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'services' ? 'bg-white text-[#1a73e8] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>SERVICES</button>
                    </div>
                </>
            )}
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#1a73e8] text-white px-4 py-2 rounded text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> CREATE {activeTab === 'materials' ? 'MATERIAL' : 'SERVICE'}
        </button>
      </div>

      {/* Resource Grid / Table */}
      <div className="bg-white rounded border border-[#dadce0] shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="overflow-x-auto flex-1 custom-scrollbar">
              <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-[#f8f9fa] border-b border-[#dadce0]">
                      <tr className="text-gray-600 font-semibold uppercase text-[11px] tracking-wider">
                          <th className="px-4 py-3">Resource Nomenclature</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3 text-center">Base UOM</th>
                          <th className="px-4 py-3">Tax Detail (GST)</th>
                          {activeTab === 'materials' && <th className="px-4 py-3 text-center">Std. Wastage</th>}
                          <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dadce0]">
                      {activeTab === 'materials' ? (
                          filteredMaterials.map(mat => (
                              <tr key={mat.id} className={`hover:bg-[#f8f9fa] transition-all group ${!mat.isActive ? 'opacity-50' : ''}`}>
                                  <td className="px-4 py-4">
                                      <div className="font-medium text-[#1a73e8] hover:underline cursor-pointer">{mat.name}</div>
                                      <div className="text-[11px] font-mono text-gray-500 mt-0.5">{mat.itemCode}</div>
                                  </td>
                                  <td className="px-4 py-4"><span className="text-xs text-gray-600 font-medium">{mat.category}</span></td>
                                  <td className="px-4 py-4 text-center font-bold text-gray-900">{mat.uom}</td>
                                  <td className="px-4 py-4 text-gray-600 text-xs font-mono">HSN: {mat.hsnCode} ({mat.gstPercent}%)</td>
                                  <td className="px-4 py-4 text-center text-red-600 font-medium">{mat.standardWastage}%</td>
                                  <td className="px-4 py-4 text-right">
                                      <button onClick={() => toggleItemActive(mat.id, 'materials', mat.isActive)} className="p-2 text-gray-400 hover:text-[#1a73e8]"><i className={`fas ${mat.isActive ? 'fa-check-circle text-green-600' : 'fa-power-off'}`}></i></button>
                                  </td>
                              </tr>
                          ))
                      ) : (
                          filteredServices.map(srv => (
                              <tr key={srv.id} className={`hover:bg-[#f8f9fa] transition-all group ${!srv.isActive ? 'opacity-50' : ''}`}>
                                  <td className="px-4 py-4">
                                      <div className="font-medium text-[#1a73e8] hover:underline cursor-pointer">{srv.name}</div>
                                      <div className="text-[11px] font-mono text-gray-500 mt-0.5">{srv.serviceCode}</div>
                                  </td>
                                  <td className="px-4 py-4"><span className="text-xs text-gray-600 font-medium">{srv.category}</span></td>
                                  <td className="px-4 py-4 text-center font-bold text-gray-900">{srv.uom}</td>
                                  <td className="px-4 py-4 text-gray-600 text-xs font-mono">SAC: {srv.sacCode} ({srv.gstPercent}%)</td>
                                  <td className="px-4 py-4 text-right">
                                      <button onClick={() => toggleItemActive(srv.id, 'services', srv.isActive)} className="p-2 text-gray-400 hover:text-[#1a73e8]"><i className={`fas ${srv.isActive ? 'fa-check-circle text-green-600' : 'fa-power-off'}`}></i></button>
                                  </td>
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
              {(activeTab === 'materials' ? filteredMaterials.length : filteredServices.length) === 0 && (
                  <div className="p-24 text-center flex flex-col items-center">
                       <i className="fas fa-box-open text-4xl text-gray-200 mb-4"></i>
                       <p className="text-sm font-medium text-gray-400">Inventory master is empty for current filters.</p>
                  </div>
              )}
          </div>
      </div>

      {showModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[110] p-4 animate-fadeIn backdrop-blur-[1px]">
              <div className="bg-white rounded shadow-2xl w-full max-w-2xl border border-[#dadce0] overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="px-5 py-3.5 border-b border-[#dadce0] flex justify-between items-center bg-[#f8f9fa]">
                      <h3 className="text-base font-medium text-[#202124]">Add {activeTab === 'materials' ? 'Material' : 'Service'} Resource</h3>
                      <button onClick={() => setShowModal(false)} className="text-[#5f6368] hover:text-[#202124] p-1 hover:bg-black/5 rounded-full transition-all">
                          <i className="fas fa-times text-base"></i>
                      </button>
                  </div>
                  <form 
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        const baseData = {
                            name: fd.get('name') as string,
                            category: fd.get('category') as any,
                            uom: fd.get('uom') as any,
                            gstPercent: parseInt(fd.get('gst') as string, 10),
                        };
                        if (activeTab === 'materials') {
                            await handleAddMaterial({
                                ...baseData,
                                hsnCode: fd.get('code') as string,
                                standardWastage: parseInt(fd.get('wastage') as string, 10),
                                qualityGrade: fd.get('quality') as string,
                            });
                        } else {
                            await handleAddService({
                                ...baseData,
                                sacCode: fd.get('code') as string,
                            });
                        }
                        setShowModal(false);
                    }}
                    className="p-6 space-y-4"
                  >
                      <div className="space-y-4">
                          <GCPField label="Product / Service Nomenclature *" name="name" required placeholder="e.g. OPC Cement 53 Grade" />
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-[11px] font-bold text-[#5f6368] uppercase mb-1">Category *</label>
                                  <select name="category" required className="w-full bg-[#f1f3f4] border-b border-[#dadce0] focus:border-[#1a73e8] px-3 py-2 text-sm outline-none transition-all cursor-pointer">
                                      {(activeTab === 'materials' ? MATERIAL_CATEGORIES : SERVICE_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-[11px] font-bold text-[#5f6368] uppercase mb-1">Standard UOM *</label>
                                  <select name="uom" required className="w-full bg-[#f1f3f4] border-b border-[#dadce0] focus:border-[#1a73e8] px-3 py-2 text-sm outline-none transition-all cursor-pointer">
                                      {UOMS.map(u => <option key={u} value={u}>{u}</option>)}
                                  </select>
                              </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <GCPField label={activeTab === 'materials' ? 'HSN Code *' : 'SAC Code *'} name="code" required placeholder="Statutory code" />
                              <GCPField label="Default GST (%) *" name="gst" type="number" required placeholder="18" />
                          </div>
                          {activeTab === 'materials' && (
                              <div className="grid grid-cols-2 gap-4">
                                  <GCPField label="Std Wastage (%)" name="wastage" type="number" placeholder="5" />
                                  <GCPField label="Tech Specification" name="quality" placeholder="Grade/Standard" />
                              </div>
                          )}
                      </div>
                      <div className="flex justify-end gap-2 pt-4 border-t border-[#dadce0]">
                          <button type="button" onClick={() => setShowModal(false)} className="px-4 py-1.5 text-[#1a73e8] text-sm font-bold hover:bg-[#e8f0fe] rounded transition-all">CANCEL</button>
                          <button type="submit" className="px-5 py-1.5 bg-[#1a73e8] text-white text-sm font-bold rounded shadow-sm hover:bg-[#1557b0] transition-all">ADD</button>
                      </div>
                  </form>
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

export default MaterialServiceMaster;
