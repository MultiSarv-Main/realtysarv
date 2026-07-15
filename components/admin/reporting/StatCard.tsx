import React from 'react';

const StatCard: React.FC<{ icon: string; label: string; value: string; subtext?: string }> = ({ icon, label, value, subtext }) => (
    <div className="bg-[var(--dark-bg)] p-6 rounded-lg flex items-center gap-4 border border-[var(--light-bg)]">
        <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center bg-[var(--light-bg)] text-[var(--primary-color)] text-xl">
            <i className={icon}></i>
        </div>
        <div>
            <p className="text-sm text-[var(--text-secondary)]">{label}</p>
            <p className="text-3xl font-bold text-[var(--text-primary)]">{value}</p>
            {subtext && <p className="text-xs text-[var(--text-secondary)] mt-1">{subtext}</p>}
        </div>
    </div>
);

export default StatCard;
