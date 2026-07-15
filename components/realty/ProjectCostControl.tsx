
import React from 'react';
import { Project, CostBudget, CostHeadType, User } from '../../types';
import { db } from '../../db';
import { v4 as uuidv4 } from 'uuid';

interface ProjectCostControlProps {
  projects: Project[];
  budgets: CostBudget[];
  currentUser: User;
}

const COST_HEADS: CostHeadType[] = [
  'Land Cost', 'Approval & Liaison', 'Excavation', 'RCC', 'Masonry', 'Finishing', 'MEP', 'Amenities', 'Infra & External Dev', 'Marketing', 'Admin & Overheads'
];

const ProjectCostControl: React.FC<ProjectCostControlProps> = ({ projects, budgets, currentUser }) => {
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>(projects[0]?.id || '');

  const projectBudgets = budgets.filter(b => b.projectId === selectedProjectId);

  const totalEstimated = projectBudgets.reduce((s, b) => s + b.estimatedAmount, 0);
  const totalUtilized = projectBudgets.reduce((s, b) => s + b.utilizedAmount, 0);

  const handleUpdateBudget = async (costHead: CostHeadType, estimated: number) => {
      const existing = projectBudgets.find(b => b.costHead === costHead);
      if (existing?.isFrozen && currentUser.role !== 'Admin') {
          alert("This budget head is frozen. Only Admins can modify frozen budgets.");
          return;
      }

      const timestamp = new Date().toISOString();
      if (existing) {
          await db.costBudgets.update(existing.id, { estimatedAmount: estimated, lastUpdated: timestamp });
      } else {
          await db.costBudgets.add({
              id: uuidv4(),
              projectId: selectedProjectId,
              costHead,
              estimatedAmount: estimated,
              utilizedAmount: 0,
              lastUpdated: timestamp
          });
      }

      await db.auditTrails.add({
          id: uuidv4(),
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'BUDGET_UPDATED',
          module: 'Cost Center',
          entityId: selectedProjectId,
          timestamp,
          details: `Updated estimated budget for ${costHead} to ₹${estimated.toLocaleString()}`
      });
  };

  const handleToggleFreeze = async (budgetId: string, costHead: string, currentStatus: boolean) => {
      if (currentUser.role !== 'Admin') return;
      await db.costBudgets.update(budgetId, { isFrozen: !currentStatus });
      await db.auditTrails.add({
          id: uuidv4(),
          userId: currentUser.id,
          userName: currentUser.name,
          action: currentStatus ? 'BUDGET_UNFROZEN' : 'BUDGET_FROZEN',
          module: 'Cost Center',
          entityId: budgetId,
          timestamp: new Date().toISOString(),
          details: `${currentStatus ? 'Unfroze' : 'Froze'} budget head ${costHead}`
      });
  };

  return (
    <div className="p-8 h-full flex flex-col gap-8 animate-fadeIn">
      {/* Project Selector */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
          <div>
              <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wider mb-1">Project Cost Center</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Budget Allocation & Cost Monitoring</p>
          </div>
          <select 
            value={selectedProjectId} 
            onChange={e => setSelectedProjectId(e.target.value)}
            className="w-full sm:w-72 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-blue-600 font-bold focus:border-blue-500 outline-none shadow-inner"
          >
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
      </div>

      {/* Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Project Budget</p>
              <p className="text-3xl font-bold text-slate-800">₹{(totalEstimated / 10000000).toFixed(2)} <span className="text-xs">Cr</span></p>
              <div className="mt-4 flex items-center gap-2">
                   <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-blue-600 h-full w-full"></div>
                   </div>
              </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Actual Expenditure</p>
              <p className="text-3xl font-bold text-green-600">₹{(totalUtilized / 10000000).toFixed(2)} <span className="text-xs">Cr</span></p>
              <div className="mt-4 flex items-center gap-2">
                   <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                       <div className={`h-full ${totalUtilized > totalEstimated ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min((totalUtilized / (totalEstimated || 1)) * 100, 100)}%` }}></div>
                   </div>
                   <span className="text-[10px] font-bold text-slate-400">{((totalUtilized / (totalEstimated || 1)) * 100).toFixed(0)}%</span>
              </div>
          </div>
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Budget Overrun Risk</p>
              <div className="flex justify-between items-end">
                  {totalUtilized > totalEstimated * 0.9 ? (
                      <p className="text-3xl font-bold text-red-500">HIGH</p>
                  ) : (
                      <p className="text-3xl font-bold text-green-600">LOW</p>
                  )}
              </div>
          </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col flex-1">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Master Budget Allocation</h4>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">By Cost Head</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-blue-600 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                          <th className="p-4 border-b border-slate-100">Cost Head</th>
                          <th className="p-4 text-right border-b border-slate-100">Estimated (INR)</th>
                          <th className="p-4 text-right border-b border-slate-100">Utilized (INR)</th>
                          <th className="p-4 text-center border-b border-slate-100">Status</th>
                          <th className="p-4 border-b border-slate-100"></th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                      {COST_HEADS.map(head => {
                          const budget = projectBudgets.find(b => b.costHead === head);
                          const utilization = budget ? (budget.utilizedAmount / (budget.estimatedAmount || 1)) * 100 : 0;
                          return (
                              <tr key={head} className={`hover:bg-slate-50 transition-colors ${budget?.isFrozen ? 'opacity-60 bg-slate-50/50' : ''}`}>
                                  <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                                      {head}
                                      {budget?.isFrozen && <i className="fas fa-lock text-[10px] text-orange-500" title="Cost Head Frozen"></i>}
                                  </td>
                                  <td className="p-4 text-right">
                                      <input 
                                        type="number" 
                                        disabled={budget?.isFrozen && currentUser.role !== 'Admin'}
                                        defaultValue={budget?.estimatedAmount || 0}
                                        onBlur={e => handleUpdateBudget(head, parseFloat(e.target.value) || 0)}
                                        className="bg-transparent border-b border-slate-100 text-right w-32 focus:border-blue-500 outline-none font-mono text-slate-600 disabled:cursor-not-allowed"
                                      />
                                  </td>
                                  <td className={`p-4 text-right font-mono ${budget && budget.utilizedAmount > budget.estimatedAmount ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                                      ₹{(budget?.utilizedAmount || 0).toLocaleString()}
                                  </td>
                                  <td className="p-4">
                                      <div className="w-24 mx-auto bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                          <div className={`h-full ${utilization > 100 ? 'bg-red-600' : utilization > 80 ? 'bg-orange-500' : 'bg-blue-600'}`} style={{ width: `${Math.min(utilization, 100)}%` }}></div>
                                      </div>
                                  </td>
                                  <td className="p-4 text-right">
                                      {currentUser.role === 'Admin' && budget && (
                                          <button 
                                            onClick={() => handleToggleFreeze(budget.id, head, !!budget.isFrozen)}
                                            className={`p-2 rounded hover:bg-slate-100 transition-colors ${budget.isFrozen ? 'text-orange-500' : 'text-slate-400'}`}
                                            title={budget.isFrozen ? 'Unfreeze' : 'Freeze'}
                                          >
                                              <i className={`fas ${budget.isFrozen ? 'fa-lock' : 'fa-lock-open'}`}></i>
                                          </button>
                                      )}
                                  </td>
                              </tr>
                          );
                      })}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};

export default ProjectCostControl;
