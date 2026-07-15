
import React from 'react';
import { User, UserRole, NewUserData, Project } from '../../types';
import NewUserModal from './NewUserModal';
import EditUserModal from './EditUserModal';
import AssignProjectModal from './AssignProjectModal';
import OrganizationChart from './OrganizationChart';

interface AdminUserManagementProps {
  users: User[];
  onUpdateUsers: (updatedUsers: User[]) => void;
  onAddUser: (userData: NewUserData) => void;
  onUpdateUser: (updatedUser: User) => void;
  projects: Project[];
}

const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ users, onUpdateUsers, onAddUser, onUpdateUser, projects }) => {
  const [activeTab, setActiveTab] = React.useState<'list' | 'chart'>('list');
  const [showNewUserModal, setShowNewUserModal] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [showAssignProjectModal, setShowAssignProjectModal] = React.useState(false);
  const [selectedUserForProjects, setSelectedUserForProjects] = React.useState<User | null>(null);
  
  // Filter states
  const [filterRole, setFilterRole] = React.useState<UserRole | 'All'>('All');
  const [filterStatus, setFilterStatus] = React.useState<'All' | 'Active' | 'Inactive'>('All');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredUsers = React.useMemo(() => {
    const safeUsers = users || [];
    return safeUsers.filter(user => {
      const matchesRole = filterRole === 'All' || user.role === filterRole;
      const matchesStatus = filterStatus === 'All' || (filterStatus === 'Active' ? user.isActive : !user.isActive);
      const matchesSearch = searchTerm === '' || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [users, filterRole, filterStatus, searchTerm]);

  const toggleUserActiveStatus = React.useCallback((userId: string) => {
    const safeUsers = users || [];
    const userToUpdate = safeUsers.find(u => u.id === userId);
    if (userToUpdate) {
        onUpdateUser({ ...userToUpdate, isActive: !userToUpdate.isActive });
    }
  }, [users, onUpdateUser]);

  const handleOpenAssignModal = (user: User) => {
    setSelectedUserForProjects(user);
    setShowAssignProjectModal(true);
  };
  
  const handleAssignProjects = (userId: string, projectIds: string[]) => {
    const safeUsers = users || [];
    const userToUpdate = safeUsers.find(u => u.id === userId);
    if (userToUpdate) {
        onUpdateUser({ ...userToUpdate, assignedProjectIds: projectIds });
    }
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const safeUsers = users || [];
    const userToUpdate = safeUsers.find(u => u.id === userId);
    if (userToUpdate) {
      onUpdateUser({ ...userToUpdate, role: newRole });
    }
  };

  const handleSaveUser = (updatedUser: User) => {
    onUpdateUser(updatedUser);
    setEditingUser(null);
  };

  const getProjectsForUser = (user: User) => {
    const safeProjects = projects || [];
    if (!user.assignedProjectIds || user.assignedProjectIds.length === 0) {
        return <span className="text-xs italic">No projects assigned</span>;
    }
    return user.assignedProjectIds.map(pid => {
        const project = safeProjects.find(p => p.id === pid);
        return project ? <span key={pid} className="inline-block bg-[var(--light-bg)] text-[var(--text-secondary)] text-xs font-medium mr-2 mt-1 px-2.5 py-0.5 rounded-full">{project.name}</span> : null;
    }).filter(Boolean);
  };

  return (
    <div className="p-4 bg-[var(--medium-bg)] rounded-lg shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">User Management</h3>
        <button
          onClick={() => setShowNewUserModal(true)}
          className="px-4 py-2 rounded-md bg-[var(--primary-color)] text-white font-medium hover:bg-[#128c7e] transition-colors flex items-center gap-2"
        >
          <i className="fas fa-user-plus"></i> Add New User
        </button>
      </div>
      
      <div className="border-b border-[var(--light-bg)] mb-6">
          <nav className="flex space-x-2">
              <button onClick={() => setActiveTab('list')} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'list' ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                  User List
              </button>
              <button onClick={() => setActiveTab('chart')} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'chart' ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                  Organization Chart
              </button>
          </nav>
      </div>

      {activeTab === 'list' && (
        <div className="flex-1 flex flex-col animate-fadeIn">
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search by name, username or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-9 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] text-sm"
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"></i>
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <label htmlFor="roleFilter" className="font-medium text-sm whitespace-nowrap">Role:</label>
                        <select
                            id="roleFilter"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value as UserRole | 'All')}
                            className="p-2 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] text-sm cursor-pointer"
                        >
                            <option value="All">All</option>
                            <option value="Admin">Admin</option>
                            <option value="Sales">Sales</option>
                            <option value="User">User</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <label htmlFor="statusFilter" className="font-medium text-sm whitespace-nowrap">Status:</label>
                        <select
                            id="statusFilter"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as 'All' | 'Active' | 'Inactive')}
                            className="p-2 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] text-sm cursor-pointer"
                        >
                            <option value="All">All</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                {(filteredUsers || []).length === 0 ? (
                <p className="text-[var(--text-secondary)] text-center mt-8">No users found matching your criteria.</p>
                ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[var(--border-color)]">
                    <thead>
                        <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">User</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Username</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Assigned Projects</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-[var(--dark-bg)] transition-colors">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[var(--text-primary)]">
                                <div>{user.name}</div>
                                <div className="text-xs text-[var(--text-secondary)]">{user.email}</div>
                                <div className="text-xs text-[var(--text-secondary)]">{user.phone}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-[var(--text-secondary)]">
                            {user.username}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                className="p-2 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] text-sm cursor-pointer"
                                aria-label={`Role for ${user.name}`}
                            >
                                <option value="User">User</option>
                                <option value="Sales">Sales</option>
                                <option value="Admin">Admin</option>
                            </select>
                            </td>
                            <td className="px-4 py-4 whitespace-normal text-sm text-[var(--text-secondary)] w-1/3">
                            {getProjectsForUser(user)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex flex-wrap gap-2">
                                <button
                                onClick={() => setEditingUser(user)}
                                className="text-sm px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                                >
                                Edit
                                </button>
                                <button
                                onClick={() => handleOpenAssignModal(user)}
                                className="text-sm px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                                >
                                Projects
                                </button>
                                <button
                                onClick={() => toggleUserActiveStatus(user.id)}
                                className={`text-sm px-3 py-1 rounded-md transition-colors ${user.isActive ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                                aria-label={user.isActive ? `Deactivate ${user.name}` : `Activate ${user.name}`}
                                >
                                {user.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}
            </div>
        </div>
      )}

      {activeTab === 'chart' && (
        <div className="flex-1 overflow-auto animate-fadeIn org-chart-container">
            <OrganizationChart users={users || []} />
        </div>
      )}

      <NewUserModal isOpen={showNewUserModal} onClose={() => setShowNewUserModal(false)} onAddUser={onAddUser} users={users || []} />
      
      <EditUserModal isOpen={!!editingUser} onClose={() => setEditingUser(null)} user={editingUser} onSaveUser={handleSaveUser} users={users || []} />

      {selectedUserForProjects && (
        <AssignProjectModal 
          isOpen={showAssignProjectModal} 
          onClose={() => setShowAssignProjectModal(false)}
          user={selectedUserForProjects}
          projects={projects || []}
          onAssignProjects={handleAssignProjects}
        />
      )}
    </div>
  );
};

export default AdminUserManagement;
