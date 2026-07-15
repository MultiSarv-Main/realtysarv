
import React from 'react';
import { Template, NewTemplateData, TemplateType } from '../../types';
import NewTemplateModal from './NewTemplateModal';

interface AdminTemplateManagementProps {
  templates: Template[];
  onUpdateTemplates: (updatedTemplates: Template[]) => void;
  onAddTemplate: (templateData: NewTemplateData) => void;
}

const AdminTemplateManagement: React.FC<AdminTemplateManagementProps> = ({ templates, onUpdateTemplates, onAddTemplate }) => {
  const [showNewTemplateModal, setShowNewTemplateModal] = React.useState(false);
  const [filterType, setFilterType] = React.useState<TemplateType | 'All'>('All');

  const safeTemplates = templates || [];

  const filteredTemplates = React.useMemo(() => {
    if (filterType === 'All') {
      return safeTemplates;
    }
    return safeTemplates.filter(t => t.type === filterType);
  }, [safeTemplates, filterType]);
  
  const groupedTemplates = React.useMemo(() => {
    const groups: Record<TemplateType, Template[]> = {
      WhatsApp: [],
      Email: [],
    };
    (filteredTemplates || []).forEach(template => {
      if (groups[template.type]) {
          groups[template.type].push(template);
      }
    });
    return groups;
  }, [filteredTemplates]);

  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template? This cannot be undone.')) {
      onUpdateTemplates(safeTemplates.filter(t => t.id !== templateId));
    }
  };

  const getTypeIcon = (type: TemplateType) => {
    return type === 'WhatsApp' 
      ? <i className="fab fa-whatsapp text-green-500 text-lg"></i> 
      : <i className="fas fa-envelope text-blue-500 text-lg"></i>;
  };

  return (
    <div className="p-4 bg-[var(--medium-bg)] rounded-lg shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">Template Management</h3>
        <button
          onClick={() => setShowNewTemplateModal(true)}
          className="px-4 py-2 rounded-md bg-[var(--primary-color)] text-white font-medium hover:bg-[#128c7e] transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus-circle"></i> Add New Template
        </button>
      </div>

      <div className="mb-4 flex items-center gap-3 text-[var(--text-secondary)]">
        <label htmlFor="typeFilter" className="font-medium">Filter by Type:</label>
        <select
          id="typeFilter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as TemplateType | 'All')}
          className="p-2 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] text-sm"
        >
          <option value="All">All Types</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Email">Email</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {(Object.entries(groupedTemplates) as [TemplateType, Template[]][]).map(([type, templatesInGroup]) => {
          if (templatesInGroup.length === 0) return null;
          return (
            <div key={type} className="border border-[var(--light-bg)] rounded-md">
              <h4 className="p-4 bg-[var(--light-bg)] text-lg font-semibold text-[var(--text-primary)] flex items-center gap-3">
                {getTypeIcon(type as TemplateType)}
                {type} Templates ({templatesInGroup.length})
              </h4>
              <div className="p-4 space-y-4">
                {templatesInGroup.map(template => (
                  <div key={template.id} className="border border-[var(--dark-bg)] p-4 rounded-md bg-[var(--medium-bg)]">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-[var(--text-primary)]">{template.name}</p>
                        <p className="text-sm text-[var(--text-secondary)] mt-2 whitespace-pre-wrap font-mono bg-[var(--dark-bg)] p-2 rounded-md">
                          {template.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => alert(`Edit for ${template.name} coming soon!`)}
                          className="text-sm px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                          aria-label={`Edit ${template.name}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-sm px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white"
                          aria-label={`Delete ${template.name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {(filteredTemplates || []).length === 0 && (
          <p className="text-[var(--text-secondary)] text-center mt-8">
            {filterType === 'All' ? 'No templates created yet.' : `No ${filterType} templates found.`}
          </p>
        )}
      </div>

      <NewTemplateModal isOpen={showNewTemplateModal} onClose={() => setShowNewTemplateModal(false)} onAddTemplate={onAddTemplate} />
    </div>
  );
};

export default AdminTemplateManagement;
