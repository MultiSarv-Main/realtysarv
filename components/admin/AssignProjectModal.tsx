import React from 'react';
import { User, Project } from '../../types';

interface AssignProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  projects: Project[];
  onAssignProjects: (userId: string, projectIds: string[]) => void;
}

const AssignProjectModal: React.FC<AssignProjectModalProps> = ({ isOpen, onClose, user, projects, onAssignProjects }) => {
  const [selectedProjectIds, setSelectedProjectIds] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    if (user) {
      setSelectedProjectIds(user.assignedProjectIds);
    }
  }, [user]);

  const handleCheckboxChange = (projectId: string) => {
    setSelectedProjectIds(prev => 
      prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssignProjects(user.id, selectedProjectIds);
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fadeIn"
      onClick={onClose}
      aria-labelledby="assignProjectModalTitle"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[var(--medium-bg)] p-6 sm:p-8 rounded-lg shadow-xl w-11/12 max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="assignProjectModalTitle" className="text-xl sm:text-2xl font-bold mb-6 text-[var(--text-primary)] text-center">Assign Projects to {user.name}</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-6 border border-[var(--dark-bg)] p-4 rounded-md">
            {projects.length === 0 ? (
              <p className="text-center text-[var(--text-secondary)]">No projects available to assign.</p>
            ) : (
              projects.map(project => (
                <label key={project.id} className="flex items-center gap-3 p-3 rounded-md bg-[var(--dark-bg)] hover:bg-[var(--light-bg)] cursor-pointer transition-colors">
                  <input 
                    type="checkbox"
                    checked={selectedProjectIds.includes(project.id)}
                    onChange={() => handleCheckboxChange(project.id)}
                    className="h-5 w-5 rounded border-gray-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)] bg-[var(--dark-bg)]"
                  />
                  <span className="text-[var(--text-primary)]">{project.name}</span>
                </label>
              ))
            )}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-md bg-gray-700 text-[var(--text-primary)] font-medium hover:bg-gray-600 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-md bg-[var(--primary-color)] text-white font-medium hover:bg-[#128c7e] transition-colors">Save Assignments</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AssignProjectModal;
