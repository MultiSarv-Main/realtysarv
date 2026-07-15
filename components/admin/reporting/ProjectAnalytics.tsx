
import React from 'react';
import { Lead, Project } from '../../../types';
import ChartCard from './ChartCard';

interface ProjectAnalyticsProps {
  leads: Lead[];
  projects: Project[];
}

interface ProjectStats {
    id: string;
    name: string;
    totalLeads: number;
    convertedLeads: number;
    conversionRate: number;
    totalVisits: number;
    completedVisits: number;
    canceledVisits: number;
    visitCompletionRate: number;
}

const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = ({ leads, projects }) => {
    const safeLeads = leads || [];
    const safeProjects = projects || [];

    const projectAnalyticsData = React.useMemo((): ProjectStats[] => {
        return safeProjects.map(project => {
            const projectLeads = safeLeads.filter(lead => lead.leadProject === project.name);
            
            const totalLeads = projectLeads.length;
            const convertedLeads = projectLeads.filter(l => l.leadStatus === 'Converted').length;
            const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

            const projectVisits = projectLeads.flatMap(l => l.siteVisits || []);
            const totalVisits = projectVisits.length;
            const completedVisits = projectVisits.filter(v => v.status === 'Completed').length;
            const canceledVisits = projectVisits.filter(v => v.status === 'Canceled').length;
            const visitCompletionRate = totalVisits > 0 ? (completedVisits / totalVisits) * 100 : 0;

            return {
                id: project.id,
                name: project.name,
                totalLeads,
                convertedLeads,
                conversionRate,
                totalVisits,
                completedVisits,
                canceledVisits,
                visitCompletionRate
            };
        });
    }, [safeLeads, safeProjects]);

    const leadsByProject = React.useMemo(() => {
        return safeLeads.reduce((acc, lead) => {
            const project = lead.leadProject || 'Unassigned';
            acc[project] = (acc[project] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }, [safeLeads]);

  if (safeLeads.length === 0) {
    return (
        <div className="p-4 text-[var(--text-secondary)] text-center flex flex-col items-center justify-center h-full">
            <i className="fas fa-building text-5xl mb-4"></i>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">No Project Data Available</h3>
            <p className="mt-2">Assign leads to projects to see analytics here.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
        <ChartCard title="Leads per Project">
            <div className="max-h-[40vh] overflow-y-auto pr-2">
                <ul className="space-y-3">
                    {Object.entries(leadsByProject).sort(([, a], [, b]) => (b as number) - (a as number)).map(([project, count]) => (
                        <li key={project} className="flex items-center justify-between text-sm p-3 bg-[var(--dark-bg)] rounded-md">
                            <span className="text-[var(--text-primary)] font-semibold">{project}</span>
                            <span className="font-bold text-[var(--text-secondary)]">{(count as number).toLocaleString()} leads</span>
                        </li>
                    ))}
                </ul>
            </div>
        </ChartCard>

        <ChartCard title="Project Performance Metrics">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-[var(--light-bg)]">
                            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Project</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Total Leads</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Conversions</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Conversion Rate</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Site Visits</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--dark-bg)]">
                        {(projectAnalyticsData || []).sort((a,b) => b.totalLeads - a.totalLeads).map(p => (
                            <tr key={p.id} className="hover:bg-[var(--dark-bg)]">
                                <td className="px-4 py-3 text-sm font-semibold text-[var(--text-primary)]">{p.name}</td>
                                <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{p.totalLeads}</td>
                                <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{p.convertedLeads}</td>
                                <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{p.conversionRate.toFixed(1)}%</td>
                                <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{p.totalVisits}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ChartCard>

        <ChartCard title="Site Visit Funnel by Project">
            <div className="space-y-4">
                {(projectAnalyticsData || []).filter(p => p.totalVisits > 0).sort((a,b) => b.visitCompletionRate - a.visitCompletionRate).map(p => (
                    <div key={p.id}>
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <span className="font-semibold text-[var(--text-primary)]">{p.name}</span>
                            <span className="text-[var(--text-secondary)]">{p.completedVisits} / {p.totalVisits} completed ({p.visitCompletionRate.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-[var(--medium-bg)] rounded-full h-4">
                            <div
                                className="bg-[var(--primary-color)] h-4 rounded-full"
                                style={{ width: `${p.visitCompletionRate}%` }}
                                title={`Completed: ${p.completedVisits}, Canceled: ${p.canceledVisits}`}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </ChartCard>
    </div>
  );
};

export default ProjectAnalytics;
