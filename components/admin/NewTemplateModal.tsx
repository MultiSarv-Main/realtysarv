import React from 'react';
import { NewTemplateData, TemplateType } from '../../types';

interface NewTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTemplate: (templateData: NewTemplateData) => void;
}

const NewTemplateModal: React.FC<NewTemplateModalProps> = ({ isOpen, onClose, onAddTemplate }) => {
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState<TemplateType>('WhatsApp');
  const [content, setContent] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && content.trim()) {
      onAddTemplate({ name: name.trim(), type, content: content.trim() });
      setName('');
      setType('WhatsApp');
      setContent('');
      onClose();
    } else {
      alert('Please fill in the Template Name and Content.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fadeIn"
      onClick={onClose}
      aria-labelledby="newTemplateModalTitle"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[var(--medium-bg)] p-6 sm:p-8 rounded-lg shadow-xl w-11/12 max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="newTemplateModalTitle" className="text-xl sm:text-2xl font-bold mb-6 text-[var(--text-primary)] text-center">Create New Template</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="templateName" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Template Name</label>
            <input
              type="text"
              id="templateName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Welcome Message, Site Visit Confirmation"
              className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]"
              required
            />
          </div>
          <div>
            <label htmlFor="templateType" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Template Type</label>
            <select
              id="templateType"
              value={type}
              onChange={(e) => setType(e.target.value as TemplateType)}
              className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]"
              required
            >
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
            </select>
          </div>
          <div>
            <label htmlFor="templateContent" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Content</label>
            <textarea
              id="templateContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="Enter the template message. Use placeholders like {{lead_name}} or {{project_name}} for dynamic content."
              className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] resize-y font-mono"
              required
            ></textarea>
            {/* Fix: Wrap string in curly braces to prevent JSX parsing error for '{{lead_name}}' */}
            <p className="text-xs text-[var(--text-secondary)] mt-1">{'Placeholders like `{{lead_name}}` will be replaced automatically.'}</p>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-md bg-gray-700 text-[var(--text-primary)] font-medium hover:bg-gray-600 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-md bg-[var(--primary-color)] text-white font-medium hover:bg-[#128c7e] transition-colors">Create Template</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTemplateModal;