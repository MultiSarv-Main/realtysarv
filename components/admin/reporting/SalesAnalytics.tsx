
import React from 'react';
import { Lead, Project, LeadStatus } from '../../../types';
import StatCard from './StatCard';
import ChartCard from './ChartCard';

interface SalesAnalyticsProps {
  leads: Lead[];
}

const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({ leads }) => {
    const safeLeads = leads || [];

    const salesData = React.useMemo(() => {
        const convertedLeads = safeLeads.filter(l => l.leadStatus === 'Converted' && l.bookingDetails);
        const unqualifiedLeads = safeLeads.filter(l => l.leadStatus === 'Unqualified');

        const totalRevenue = convertedLeads.reduce((sum, lead) => sum + (lead.bookingDetails?.priceBreakup.grandTotal || 0), 0);
        const avgDealSize = convertedLeads.length > 0 ? totalRevenue / convertedLeads.length : 0;
        
        const winRate = (convertedLeads.length + unqualifiedLeads.length) > 0 
            ? (convertedLeads.length / (convertedLeads.length + unqualifiedLeads.length)) * 100
            : 0;

        const totalCycleDays = convertedLeads.reduce((sum, lead) => {
            const startDate = new Date(lead.leadDate);
            const endDate = new Date(); 
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return sum + diffDays;
        }, 0);
        const avgSalesCycle = convertedLeads.length > 0 ? totalCycleDays / convertedLeads.length : 0;
        
        const funnel = {
            'All Leads': safeLeads.length,
            'Contacted': safeLeads.filter(l => ['Contacted', 'Qualified', 'Converted'].includes(l.leadStatus)).length,
            'Qualified': safeLeads.filter(l => ['Qualified', 'Converted'].includes(l.leadStatus)).length,
            'Converted': convertedLeads.length,
        };

        const revenueByProject = convertedLeads.reduce((acc, lead) => {
            const project = lead.leadProject || 'Unassigned';
            const revenue = lead.bookingDetails?.priceBreakup.grandTotal || 0;
            acc[project] = (acc[project] || 0) + revenue;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalRevenue,
            avgDealSize,
            winRate,
            avgSalesCycle,
            funnel,
            revenueByProject,
        };
    }, [safeLeads]);
    
    if (safeLeads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-[var(--text-secondary)] p-8 bg-[var(--dark-bg)] rounded-lg border border-[var(--light-bg)]">
                <i className="fas fa-funnel-dollar text-5xl mb-4"></i>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">No Sales Data Available</h3>
                <p className="mt-2">Sales analytics will appear here once leads are converted.</p>
            </div>
        );
    }

    const FunnelStage: React.FC<{ stage: string; count: number; maxCount: number; color: string }> = ({ stage, count, maxCount, color }) => {
        const widthPercentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
        const conversionFromMax = maxCount > 0 ? (count / maxCount) * 100 : 0;
        return (
            <div className="flex items-center gap-4 group">
                <div className="w-28 text-right text-sm text-[var(--text-secondary)]">{stage}</div>
                <div className="flex-1 bg-[var(--medium-bg)] rounded-full h-8 flex items-center p-1">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${widthPercentage}%`, backgroundColor: color }}></div>
                </div>
                <div className="w-28 text-left font-semibold text-[var(--text-primary)]">
                    {count.toLocaleString()}
                    <span className="text-xs font-normal text-[var(--text-secondary)] ml-2 opacity-0 group-hover:opacity-100 transition-opacity">({conversionFromMax.toFixed(1)}%)</span>
                </div>
            </div>
        );
    };

    const maxRevenue = Object.values(salesData.revenueByProject).length > 0 ? Math.max(...Object.values(salesData.revenueByProject) as number[]) : 1;

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon="fas fa-wallet" label="Total Revenue" value={`₹${(salesData.totalRevenue / 100000).toFixed(2)} L`} />
                <StatCard icon="fas fa-receipt" label="Avg. Deal Size" value={`₹${(salesData.avgDealSize / 100000).toFixed(2)} L`} />
                <StatCard icon="fas fa-bullseye" label="Win Rate" value={`${salesData.winRate.toFixed(1)}%`} />
                <StatCard icon="fas fa-hourglass-half" label="Avg. Sales Cycle" value={`${salesData.avgSalesCycle.toFixed(0)} days`} />
            </div>
            
            <ChartCard title="Sales Funnel">
                <div className="space-y-3">
                    <FunnelStage stage="All Leads" count={salesData.funnel['All Leads']} maxCount={salesData.funnel['All Leads']} color="#3b82f6" />
                    <FunnelStage stage="Contacted" count={salesData.funnel['Contacted']} maxCount={salesData.funnel['All Leads']} color="#f59e0b" />
                    <FunnelStage stage="Qualified" count={salesData.funnel['Qualified']} maxCount={salesData.funnel['All Leads']} color="#a855f7" />
                    <FunnelStage stage="Converted" count={salesData.funnel['Converted']} maxCount={salesData.funnel['All Leads']} color="#22c55e" />
                </div>
            </ChartCard>

            <ChartCard title="Revenue by Project">
                <div className="space-y-4">
                    {Object.entries(salesData.revenueByProject).sort(([,a],[,b]) => (b as number) - (a as number)).map(([project, revenue]) => (
                        <div key={project} className="flex items-center gap-4 text-sm">
                            <div className="w-40 truncate text-[var(--text-secondary)]" title={project}>{project}</div>
                            <div className="flex-1 bg-[var(--medium-bg)] rounded-full h-5">
                                <div 
                                    className="h-full rounded-full bg-gradient-to-r from-[var(--primary-color)] to-[#128c7e]"
                                    style={{ width: `${((revenue as number) / maxRevenue) * 100}%` }}
                                ></div>
                            </div>
                            <div className="w-28 text-right font-semibold text-[var(--text-primary)]">₹{((revenue as number) / 100000).toFixed(2)} L</div>
                        </div>
                    ))}
                </div>
            </ChartCard>
        </div>
    );
};

export default SalesAnalytics;
