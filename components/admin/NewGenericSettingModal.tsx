import React from 'react';

interface NewGenericSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (itemData: { name: string; description?: string }) => void;
  title: string;
  itemNoun: string; // e.g., "Budget", "Role"
}

const NewGenericSettingModal: React.FC<NewGenericSettingModalProps> = ({ isOpen, onClose, onAddItem, title, itemNoun }) => {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddItem({ name: name.trim(), description: description.trim() || undefined });
      setName('');
      setDescription('');
      onClose();
    } else {
      alert(`Please enter a ${itemNoun} Name.`);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fadeIn"
      onClick={onClose}
      aria-labelledby="newGenericItemModalTitle"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[var(--medium-bg)] p-6 sm:p-8 rounded-lg shadow-xl w-11/12 max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="newGenericItemModalTitle" className="text-xl sm:text-2xl font-bold mb-6 text-[var(--text-primary)] text-center">{title}</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="itemName" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{itemNoun} Name</label>
            <input
              type="text"
              id="itemName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`e.g., 50L - 75L, IT Professional...`}
              className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="itemDescription" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description (Optional)</label>
            <textarea
              id="itemDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="A brief description or details..."
              className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] resize-y"
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-md bg-gray-700 text-[var(--text-primary)] font-medium hover:bg-gray-600 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-md bg-[var(--primary-color)] text-white font-medium hover:bg-[#128c7e] transition-colors">Add {itemNoun}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewGenericSettingModal;
