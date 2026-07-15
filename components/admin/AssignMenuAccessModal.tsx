import React from 'react';
import { UserRoleSetting } from '../../types';
import { AVAILABLE_MENUS } from '../../constants';

interface AssignMenuAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRoleSetting;
  onSave: (roleId: string, menus: string[]) => void;
}

const AssignMenuAccessModal: React.FC<AssignMenuAccessModalProps> = ({ isOpen, onClose, role, onSave }) => {
  const [selectedMenus, setSelectedMenus] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    if (role) {
      setSelectedMenus(role.menuAccess || []);
    }
  }, [role]);

  const handleCheckboxChange = (menu: string) => {
    setSelectedMenus(prev => 
      prev.includes(menu) ? prev.filter(m => m !== menu) : [...prev, menu]
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(role.id, selectedMenus);
    onClose();
  };

  if (!isOpen || !role) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fadeIn"
      onClick={onClose}
      aria-labelledby="assignMenuAccessModalTitle"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[var(--medium-bg)] p-6 sm:p-8 rounded-lg shadow-xl w-11/12 max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="assignMenuAccessModalTitle" className="text-xl sm:text-2xl font-bold mb-6 text-[var(--text-primary)] text-center">Menu Access for {role.name}</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-6 border border-[var(--dark-bg)] p-4 rounded-md">
            {AVAILABLE_MENUS.length === 0 ? (
              <p className="text-center text-[var(--text-secondary)]">No menus available to assign.</p>
            ) : (
              AVAILABLE_MENUS.map(menu => (
                <label key={menu} className="flex items-center gap-3 p-3 rounded-md bg-[var(--dark-bg)] hover:bg-[var(--light-bg)] cursor-pointer transition-colors">
                  <input 
                    type="checkbox"
                    checked={selectedMenus.includes(menu)}
                    onChange={() => handleCheckboxChange(menu)}
                    className="h-5 w-5 rounded border-gray-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)] bg-[var(--dark-bg)]"
                  />
                  <span className="text-[var(--text-primary)]">{menu}</span>
                </label>
              ))
            )}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-md bg-gray-700 text-[var(--text-primary)] font-medium hover:bg-gray-600 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-md bg-[var(--primary-color)] text-white font-medium hover:bg-[#128c7e] transition-colors">Save Permissions</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AssignMenuAccessModal;