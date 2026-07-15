
import React from 'react';
import { Lead } from '../../../types';
import ChartCard from './ChartCard';

interface TeamPerformanceProps {
  leads: Lead[];
}

interface AgentStats {
    name: string;
    totalLeads: number;
    convertedLeads: number;
    conversionRate: number;
    tasksCompleted: number;
    tasksPending: number;
}

const TeamPerformance: React.FC<TeamPerformanceProps> = ({ leads }) => {
    const safeLeads = leads || [];

    const teamData = React.useMemo(() => {
        const agentStats: Record<string, AgentStats> = {};

        (safeLeads || []).forEach(lead => {
            const assignedAgents = [...new Set((lead.tasks || []).map(t => t.assignedTo))];
            assignedAgents.forEach((agentName: string) => {
                if (!agentStats[agentName]) {
                    agentStats[agentName] = {
                        name: agentName,
                        totalLeads: 0,
                        convertedLeads: 0,
                        conversionRate: 0,
                        tasksCompleted: 0,
                        tasksPending: 0
                    };
                }
            });
        });

        Object.keys(agentStats).forEach((agentName: string) => {
            const agentLeads = safeLeads.filter(l => (l.tasks || []).some(t => t.assignedTo === agentName));
            const agentTasks = safeLeads.flatMap(l => l.tasks || []).filter(t => t.assignedTo === agentName);

            agentStats[agentName].totalLeads = agentLeads.length;
            agentStats[agentName].convertedLeads = agentLeads.filter(l => l.leadStatus === 'Converted').length;
            agentStats[agentName].conversionRate = agentLeads.length > 0
                ? (agentStats[agentName].convertedLeads / agentLeads.length) * 100
                : 0;
            agentStats[agentName].tasksCompleted = agentTasks.filter(t => t.status === 'Completed').length;
            agentStats[agentName].tasksPending = agentTasks.filter(t => t.status !== 'Completed').length;
        });

        return Object.values(agentStats).sort((a, b) => b.convertedLeads - a.convertedLeads);

    }, [safeLeads]);
    
    if (teamData.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center text-[var(--text-secondary)] p-8 bg-[var(--dark-bg)] rounded-lg border border-[var(--light-bg)]">
                <i className="fas fa-user-chart text-5xl mb-4"></i>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">No Team Data Available</h3>
                <p className="mt-2">Assign tasks to users to see team performance metrics here.</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col gap-6">
            <ChartCard title="Team Leaderboard">
                 <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-[var(--light-bg)]">
                                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Agent</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Leads Handled</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Conversions</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Conversion Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--dark-bg)]">
                            {teamData.map(agent => (
                                <tr key={agent.name} className="hover:bg-[var(--dark-bg)]">
                                    <td className="px-4 py-3 text-sm font-semibold text-[var(--text-primary)]">{agent.name}</td>
                                    <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{agent.totalLeads}</td>
                                    <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{agent.convertedLeads}</td>
                                    <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{agent.conversionRate.toFixed(1)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ChartCard>

            <ChartCard title="Task Performance by Agent">
                <div className="space-y-4">
                     {teamData.map(agent => {
                        const totalTasks = agent.tasksCompleted + agent.tasksPending;
                        const completionPercentage = totalTasks > 0 ? (agent.tasksCompleted / totalTasks) * 100 : 0;
                        return (
                            <div key={agent.name} className="flex items-center gap-4 text-sm">
                                <div className="w-32 truncate text-[var(--text-secondary)]" title={agent.name}>{agent.name}</div>
                                <div className="flex-1 bg-[var(--medium-bg)] rounded-full h-5 flex">
                                    <div 
                                        className="h-full rounded-l-full bg-green-500"
                                        style={{ width: `${completionPercentage}%` }}
                                        title={`Completed: ${agent.tasksCompleted}`}
                                    ></div>
                                     <div 
                                        className="h-full rounded-r-full bg-yellow-500"
                                        style={{ width: `${100 - completionPercentage}%` }}
                                        title={`Pending: ${agent.tasksPending}`}
                                    ></div>
                                </div>
                                <div className="w-24 text-right font-semibold text-[var(--text-primary)]">
                                    {agent.tasksCompleted} / {totalTasks}
                                </div>
                            </div>
                        )
                     })}
                </div>
            </ChartCard>
        </div>
    );
};

export default TeamPerformance;
