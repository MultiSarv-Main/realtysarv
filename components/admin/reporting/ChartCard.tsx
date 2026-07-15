import React from 'react';

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-[var(--dark-bg)] p-6 rounded-lg border border-[var(--light-bg)]">
        <h4 className="text-lg font-bold text-[var(--text-primary)] mb-4">{title}</h4>
        <div>{children}</div>
    </div>
);

export default ChartCard;
