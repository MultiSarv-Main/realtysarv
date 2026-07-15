
import React from 'react';
import { AdminPanelSection } from '../../types';
import { ADMIN_PANEL_SECTIONS, AdminPanelSectionConfig } from '../../constants';

interface AdminTopbarProps {
  activeSection: AdminPanelSection | 'dashboard';
  onSelectSection: (section: AdminPanelSection | 'dashboard', subSection?: string) => void;
  activeSubSection: string | null;
  onNavigateToMain: () => void;
  onLogout: () => void;
}

const AdminTopbar: React.FC<AdminTopbarProps> = ({ 
  activeSection, 
  onSelectSection, 
  activeSubSection,
  onNavigateToMain,
  onLogout
}) => {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (section: AdminPanelSectionConfig) => {
    if (section.subItems) {
      setOpenDropdown(prev => prev === section.id ? null : section.id);
    } else {
      onSelectSection(section.id);
      setOpenDropdown(null);
    }
  };

  const handleSubItemClick = (sectionId: AdminPanelSection | 'dashboard', subId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectSection(sectionId, subId);
    setOpenDropdown(null);
  };

  return (
    <div className="bg-[var(--medium-bg)] border-b border-[var(--border-color)] px-4 py-2 flex items-center justify-between w-full" ref={dropdownRef}>
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
        {ADMIN_PANEL_SECTIONS.map((section) => (
          <div key={section.id} className="relative">
            <button
              onClick={() => handleMenuClick(section)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeSection === section.id 
                  ? 'bg-[var(--primary-color)] text-white' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--light-bg)] hover:text-[var(--text-primary)]'
              }`}
            >
              <i className={section.icon}></i>
              <span className="hidden sm:inline">{section.label}</span>
              {section.subItems && (
                <i className={`fas fa-chevron-down text-xs ml-1 transition-transform ${openDropdown === section.id ? 'rotate-180' : ''}`}></i>
              )}
            </button>

            {section.subItems && openDropdown === section.id && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-[var(--medium-bg)] border border-[var(--border-color)] rounded-md shadow-lg z-50 animate-fadeIn">
                <ul className="py-1">
                  {section.subItems.map((subItem) => (
                    <li key={subItem.id}>
                      <button
                        onClick={(e) => handleSubItemClick(section.id, subItem.id, e)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--dark-bg)] transition-colors flex items-center ${
                          activeSection === section.id && activeSubSection === subItem.id
                            ? 'text-[var(--primary-color)] font-semibold'
                            : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        <i className={`${subItem.icon} mr-2 w-4 text-center`}></i>
                        {subItem.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 ml-4 border-l border-[var(--border-color)] pl-4 flex-shrink-0">
        <button 
            onClick={onNavigateToMain}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-2 rounded-md hover:bg-[var(--light-bg)] transition-colors"
            title="Back to Main App"
        >
            <i className="fas fa-arrow-left"></i>
        </button>
        <button 
            onClick={onLogout}
            className="text-red-500 hover:text-red-400 p-2 rounded-md hover:bg-[var(--light-bg)] transition-colors"
            title="Logout"
        >
            <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>
  );
};

export default AdminTopbar;
