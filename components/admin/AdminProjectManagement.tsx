
import React from 'react';
import { Project, NewProjectData, ProjectStatus, PaymentPlan } from '../../types';
import NewProjectModal from './NewProjectModal';
import ProjectInventory from './ProjectInventory';

interface AdminProjectManagementProps {
  projects: Project[];
  paymentPlans: PaymentPlan[];
  onUpdateProjects: (updatedProjects: Project[]) => void;
  onAddProject: (projectData: NewProjectData) => void;
  onDeleteProject: (projectId: string) => void;
}

const AdminProjectManagement: React.FC<AdminProjectManagementProps> = ({
  projects,
  paymentPlans,
  onUpdateProjects,
  onAddProject,
  onDeleteProject,
}) => {
  const [showNewProjectModal, setShowNewProjectModal] = React.useState(false);
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null);

  const selectedProject = React.useMemo(() => {
    const safeProjects = projects || [];
    return safeProjects.find(p => p.id === selectedProjectId);
  }, [projects, selectedProjectId]);
  
  const handleUpdateProject = (updatedProject: Project) => {
    const safeProjects = projects || [];
    const updatedProjects = safeProjects.map(p => p.id === updatedProject.id ? updatedProject : p);
    onUpdateProjects(updatedProjects);
  };

  const getStatusColorClass = (status: ProjectStatus) => {
    switch (status) {
      case 'Pre-launch':
        return 'bg-blue-600';
      case 'Under Construction':
        return 'bg-yellow-600';
      case 'Ready to Move':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (selectedProject) {
    return (
      <ProjectInventory 
        project={selectedProject} 
        paymentPlans={paymentPlans || []}
        onUpdateProject={handleUpdateProject} 
        onDeleteProject={onDeleteProject}
        onBack={() => setSelectedProjectId(null)} 
      />
    );
  }

  const safeProjects = projects || [];

  return (
    <div className="p-4 bg-[var(--medium-bg)] rounded-lg shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">Project Management</h3>
        <button
          onClick={() => setShowNewProjectModal(true)}
          className="px-4 py-2 rounded-md bg-[var(--primary-color)] text-white font-medium hover:bg-[#128c7e] transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus-circle"></i> Register New Project
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {safeProjects.length === 0 ? (
          <p className="text-[var(--text-secondary)] text-center mt-8">No projects registered yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeProjects.map((project) => (
              <div key={project.id} className="bg-[var(--dark-bg)] p-4 rounded-lg shadow-lg border border-[var(--light-bg)] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-[var(--text-primary)]">{project.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColorClass(project.projectStatus)}`}>
                        {project.projectStatus}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2 mt-1">
                    <i className="fas fa-map-marker-alt"></i>
                    {project.location}
                  </p>
                  <div className="mt-4 pt-4 border-t border-[var(--light-bg)] flex justify-between text-sm text-[var(--text-secondary)]">
                    <span><span className="font-semibold text-[var(--text-primary)]">{project.totalFloors}</span> Floors</span>
                    <span><span className="font-semibold text-[var(--text-primary)]">{(project.inventory || []).length}</span> Total Units</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedProjectId(project.id)}
                  className="mt-4 w-full text-center py-2 rounded-md bg-[var(--primary-color)] text-white font-medium hover:bg-[#128c7e] transition-colors text-sm"
                >
                  Manage Inventory
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <NewProjectModal 
        isOpen={showNewProjectModal} 
        onClose={() => setShowNewProjectModal(false)} 
        onAddProject={onAddProject} 
      />
    </div>
  );
};

export default AdminProjectManagement;
