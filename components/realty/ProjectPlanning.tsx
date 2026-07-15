
import React from 'react';
import { Project, ProjectPhase } from '../../types';
import { db } from '../../db';
import { v4 as uuidv4 } from 'uuid';

interface ProjectPlanningProps {
  projects: Project[];
  phases: ProjectPhase[];
}

const ProjectPlanning: React.FC<ProjectPlanningProps> = ({ projects, phases }) => {
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>(projects[0]?.id || '');
  const [showAddPhaseModal, setShowAddPhaseModal] = React.useState(false);

  const projectPhases = phases.filter(p => p.projectId === selectedProjectId);

  const handleAddPhase = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const newPhase: ProjectPhase = {
          id: uuidv4(),
          projectId: selectedProjectId,
          name: fd.get('name') as string,
          startDate: fd.get('start') as string,
          estimatedEndDate: fd.get('end') as string,
          status: 'Planning'
      };
      await db.projectPhases.add(newPhase);
      setShowAddPhaseModal(false);
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 animate-fadeIn">
      {/* GCP Bar */}
      <div className="bg-white p-4 rounded border border-[#dadce0] shadow-sm flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex flex-1 items-center gap-4 w-full">
              <div className="flex flex-col">
                  <h3 className="text-lg font-medium text-[#202124]">Project Timeline</h3>
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
            onClick={() => setShowAddPhaseModal(true)}
            className="bg-[#1a73e8] text-white px-4 py-2 rounded text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
          >
              <i className="fas fa-plus"></i> ADD PHASE
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total Phases" value={projectPhases.length.toString()} icon="fas fa-layer-group" color="bg-blue-600" />
          <StatCard label="Completed" value={projectPhases.filter(p => p.status === 'Completed').length.toString()} icon="fas fa-check-double" color="bg-green-600" />
          <StatCard label="Active" value={projectPhases.filter(p => p.status === 'Active').length.toString()} icon="fas fa-person-digging" color="bg-blue-600" />
          <StatCard label="Critical Path" value="2" icon="fas fa-clock" color="bg-red-500" />
      </div>

      <div className="bg-white rounded border border-[#dadce0] shadow-sm flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-1 custom-scrollbar">
              <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-[#f8f9fa] border-b border-[#dadce0]">
                      <tr className="text-gray-600 font-semibold uppercase text-[11px] tracking-wider">
                          <th className="px-4 py-3">Schedule Item</th>
                          <th className="px-4 py-3">Start</th>
                          <th className="px-4 py-3">Finish (Est)</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Health</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dadce0]">
                      {projectPhases.map(phase => (
                          <tr key={phase.id} className="hover:bg-[#f8f9fa] transition-colors">
                              <td className="px-4 py-4 font-medium text-gray-900">{phase.name}</td>
                              <td className="px-4 py-4 text-gray-500 font-mono text-xs">{phase.startDate}</td>
                              <td className="px-4 py-4 text-gray-500 font-mono text-xs">{phase.estimatedEndDate}</td>
                              <td className="px-4 py-4">
                                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                      phase.status === 'Completed' ? 'bg-[#e6f4ea] text-[#1e8e3e]' :
                                      phase.status === 'Active' ? 'bg-[#e8f0fe] text-[#1a73e8]' :
                                      'bg-gray-100 text-gray-500'
                                  }`}>
                                      {phase.status}
                                  </span>
                              </td>
                              <td className="px-4 py-4 text-right">
                                  <div className="flex items-center justify-end gap-3">
                                      <div className="w-20 bg-[#f1f3f4] h-1 rounded-full overflow-hidden">
                                          <div className="bg-[#1a73e8] h-full w-1/3"></div>
                                      </div>
                                      <span className="text-[10px] font-bold text-gray-400">On Track</span>
                                  </div>
                              </td>
                          </tr>
                      ))}
                      {projectPhases.length === 0 && (
                          <tr>
                              <td colSpan={6} className="p-20 text-center text-gray-400 italic">No schedule defined for this project context.</td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>

      {showAddPhaseModal && (
           <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[110] p-4 animate-fadeIn backdrop-blur-[1px]">
                <div className="bg-white rounded shadow-2xl w-full max-w-xl border border-[#dadce0] overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="px-5 py-3.5 border-b border-[#dadce0] bg-[#f8f9fa] flex justify-between items-center">
                        <h3 className="text-lg font-medium text-[#202124]">Create Project Phase</h3>
                        <button onClick={() => setShowAddPhaseModal(false)} className="text-[#5f6368] hover:text-[#202124] p-1.5 hover:bg-black/5 rounded-full transition-all">
                            <i className="fas fa-times text-base"></i>
                        </button>
                    </div>
                    <form onSubmit={handleAddPhase} className="p-6 space-y-4 bg-white">
                        <div>
                            <label className="block text-[11px] font-bold text-[#5f6368] uppercase mb-1">Phase Identifier *</label>
                            <input name="name" required placeholder="e.g., Piling & Foundation" className="w-full bg-[#f1f3f4] border-b border-[#dadce0] focus:border-[#1a73e8] p-2.5 text-sm text-[#202124] outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-[#5f6368] uppercase mb-1">Planned Start *</label>
                                <input name="start" type="date" required className="w-full bg-[#f1f3f4] border-b border-[#dadce0] focus:border-[#1a73e8] p-2.5 text-sm text-[#202124] outline-none" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-[#5f6368] uppercase mb-1">Planned Completion *</label>
                                <input name="end" type="date" required className="w-full bg-[#f1f3f4] border-b border-[#dadce0] focus:border-[#1a73e8] p-2.5 text-sm text-[#202124] outline-none" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4 border-t border-[#dadce0]">
                            <button type="button" onClick={() => setShowAddPhaseModal(false)} className="px-4 py-1.5 text-[#1a73e8] text-sm font-bold hover:bg-[#e8f0fe] rounded transition-all">CANCEL</button>
                            <button type="submit" className="px-5 py-1.5 bg-[#1a73e8] text-white text-sm font-bold rounded shadow-sm hover:shadow-md hover:bg-[#1557b0] transition-all">CREATE</button>
                        </div>
                    </form>
                </div>
           </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; icon: string; color: string }> = ({ label, value, icon, color }) => (
    <div className="bg-white p-4 rounded border border-[#dadce0] shadow-sm flex items-center gap-4">
        <div className={`w-10 h-10 rounded flex items-center justify-center text-white text-base ${color} shadow-sm`}>
            <i className={icon}></i>
        </div>
        <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-xl font-medium text-gray-900">{value}</p>
        </div>
    </div>
);

export default ProjectPlanning;
