
import React from 'react';
import { FormFieldConfig } from '../types';

interface DynamicFieldRendererProps {
  config: FormFieldConfig;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({ config, value, onChange, error }) => {
    const commonClasses = `w-full p-3 rounded-md border ${error ? 'border-red-500' : 'border-[var(--light-bg)]'} bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition-colors`;

    const labelElement = (
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            {config.label}{config.isRequired ? '*' : ''}
        </label>
    );

    const renderInput = () => {
        switch (config.fieldType) {
            case 'textarea':
                return (
                    <textarea 
                        value={value || ''} 
                        onChange={e => onChange(e.target.value)} 
                        placeholder={`Enter ${config.label}`}
                        rows={3}
                        className={`${commonClasses} resize-y`}
                    />
                );
            case 'select':
                return (
                    <select 
                        value={value || ''} 
                        onChange={e => onChange(e.target.value)}
                        className={commonClasses}
                    >
                        <option value="">Select {config.label}</option>
                        {config.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                );
            case 'number':
                return (
                    <input 
                        type="number" 
                        value={value || ''} 
                        onChange={e => onChange(e.target.value)} 
                        placeholder={`Enter ${config.label}`}
                        className={commonClasses}
                    />
                );
            case 'date':
                return (
                    <input 
                        type="date" 
                        value={value || ''} 
                        onChange={e => onChange(e.target.value)} 
                        className={commonClasses}
                    />
                );
            default:
                return (
                    <input 
                        type="text" 
                        value={value || ''} 
                        onChange={e => onChange(e.target.value)} 
                        placeholder={`Enter ${config.label}`}
                        className={commonClasses}
                    />
                );
        }
    };

    return (
        <div className="w-full">
            {labelElement}
            {renderInput()}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default DynamicFieldRenderer;
