
import React from 'react';
import { Lead, User, Task, NewTaskData, TaskStatus, TaskPriority } from '../../types';
import NewAdminTaskModal from './NewAdminTaskModal';
import { v4 as uuidv4 } from 'uuid';

interface AdminTaskManagementProps {
  leads: Lead[];
  users: User[];
  onUpdateLeads: (updatedLeads: Lead[]) => void;
}

const AdminTaskManagement: React.FC<AdminTaskManagementProps> = ({ leads, users, onUpdateLeads }) => {
  const [showNewTaskModal, setShowNewTaskModal] = React.useState(false);
  const [filterStatus, setFilterStatus] = React.useState<TaskStatus | 'All'>('All');
  const [filterPriority, setFilterPriority] = React.useState<TaskPriority | 'All'>('All');

  const safeLeads = leads || [];

  const allTasks = React.useMemo(() => {
    return (safeLeads || []).flatMap(lead =>
      (lead.tasks || []).map(task => ({
        ...task,
        leadName: lead.name,
        leadId: lead.id,
      }))
    );
  }, [safeLeads]);
  
  const isOverdue = (dueDate: string, status: TaskStatus) => {
    if (status === 'Completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const filteredTasks = React.useMemo(() => {
    return (allTasks || []).filter(task => {
      const taskIsOverdue = isOverdue(task.dueDate, task.status);
      const effectiveStatus: TaskStatus = taskIsOverdue ? 'Overdue' : task.status;
      
      const statusMatch = filterStatus === 'All' || effectiveStatus === filterStatus;
      const priorityMatch = filterPriority === 'All' || task.priority === filterPriority;
      return statusMatch && priorityMatch;
    });
  }, [allTasks, filterStatus, filterPriority]);

  const handleAddTask = (taskData: NewTaskData, leadId: string) => {
    const newTask: Task = {
      id: uuidv4(),
      leadId: leadId,
      status: 'Pending',
      ...taskData,
    };
    const updatedLeads = safeLeads.map(lead =>
      lead.id === leadId ? { ...lead, tasks: [...(lead.tasks || []), newTask] } : lead
    );
    onUpdateLeads(updatedLeads);
  };

  const handleUpdateTaskStatus = (leadId: string, taskId: string, newStatus: TaskStatus) => {
    const updatedLeads = safeLeads.map(lead => {
      if (lead.id === leadId) {
        const updatedTasks = (lead.tasks || []).map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        );
        return { ...lead, tasks: updatedTasks };
      }
      return lead;
    });
    onUpdateLeads(updatedLeads);
  };
  
  const getPriorityColorClass = (priority: TaskPriority) => {
    switch (priority) {
      case 'Low':
        return 'bg-gray-500';
      case 'Medium':
        return 'bg-yellow-600';
      case 'High':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusColorClass = (status: TaskStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-blue-600';
      case 'Completed':
        return 'bg-green-600';
      case 'Overdue':
        return 'bg-red-700';
      default:
        return 'bg-gray-600';
    }
  };
  
  return (
    <div className="p-4 bg-[var(--medium-bg)] rounded-lg shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">Task Management</h3>
        <button
          onClick={() => setShowNewTaskModal(true)}
          className="px-4 py-2 rounded-md bg-[var(--primary-color)] text-white font-medium hover:bg-[#128c7e] transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus-circle"></i> Add New Task
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4 text-[var(--text-secondary)]">
        <div>
          <label htmlFor="statusFilter" className="font-medium mr-2">Status:</label>
          <select id="statusFilter" value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="p-2 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] text-sm">
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
        <div>
          <label htmlFor="priorityFilter" className="font-medium mr-2">Priority:</label>
          <select id="priorityFilter" value={filterPriority} onChange={e => setFilterPriority(e.target.value as any)} className="p-2 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] text-sm">
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--light-bg)]">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Task / Lead</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Assigned To</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Due Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--light-bg)]">
              {(filteredTasks || []).length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-[var(--text-secondary)]">No tasks match the current filters.</td></tr>
              ) : (
                filteredTasks.map(task => {
                  const taskIsOverdue = isOverdue(task.dueDate, task.status);
                  const effectiveStatus: TaskStatus = taskIsOverdue ? 'Overdue' : task.status;
                  return (
                  <tr key={task.id} className="hover:bg-[var(--dark-bg)] transition-colors">
                    <td className="px-4 py-4 whitespace-normal text-sm font-medium text-[var(--text-primary)]">
                        <div>{task.title}</div>
                        <div className="text-xs text-[var(--text-secondary)]">for {task.leadName}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">{task.assignedTo}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">{task.dueDate}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColorClass(task.priority)} text-white`}>{task.priority}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(effectiveStatus)} text-white`}>{effectiveStatus}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {task.status !== 'Completed' && (
                        <button onClick={() => handleUpdateTaskStatus(task.leadId, task.id, 'Completed')} className="text-sm px-3 py-1 rounded-md bg-green-500 hover:bg-green-600 text-white">
                          Mark Complete
                        </button>
                      )}
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <NewAdminTaskModal 
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        onAddTask={handleAddTask}
        leads={safeLeads}
        users={users}
      />
    </div>
  );
};

export default AdminTaskManagement;
