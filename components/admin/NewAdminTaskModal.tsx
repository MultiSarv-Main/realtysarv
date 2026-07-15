import React from 'react';
import { NewTaskData, TaskPriority, Lead, User } from '../../types';
import { DEFAULT_ASSIGNED_TO } from '../../constants';

interface NewAdminTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (taskData: NewTaskData, leadId: string) => void;
  leads: Lead[];
  users: User[];
}

const NewAdminTaskModal: React.FC<NewAdminTaskModalProps> = ({ isOpen, onClose, onAddTask, leads, users }) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');
  const [priority, setPriority] = React.useState<TaskPriority>('Medium');
  const [assignedTo, setAssignedTo] = React.useState(users[0]?.name || DEFAULT_ASSIGNED_TO);
  const [selectedLeadId, setSelectedLeadId] = React.useState<string>(leads[0]?.id || '');

  React.useEffect(() => {
    // Ensure a lead is selected if available
    if (!selectedLeadId && leads.length > 0) {
      setSelectedLeadId(leads[0].id);
    }
  }, [leads, selectedLeadId]);

  const handleSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim() && dueDate.trim() && selectedLeadId) {
      onAddTask({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate,
        priority,
        assignedTo: assignedTo.trim(),
      }, selectedLeadId);
      
      // Reset form fields
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Medium');
      onClose();
    } else {
      alert('Please fill in all required fields (Lead, Title, Due Date).');
    }
  }, [title, description, dueDate, priority, assignedTo, selectedLeadId, onAddTask, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fadeIn"
      onClick={onClose}
      aria-labelledby="taskModalTitle"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[var(--medium-bg)] p-6 sm:p-8 rounded-lg shadow-xl w-11/12 max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="taskModalTitle" className="text-xl sm:text-2xl font-bold mb-6 text-[var(--text-primary)] text-center">
          Create New Task
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="taskLead" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Lead
            </label>
            <select
              id="taskLead"
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]"
              required
            >
              {leads.length === 0 ? (
                <option disabled>No leads available</option>
              ) : (
                leads.map(lead => <option key={lead.id} value={lead.id}>{lead.name}</option>)
              )}
            </select>
          </div>

          <div>
            <label htmlFor="taskTitle" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Task Title
            </label>
            <input
              type="text"
              id="taskTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Follow up on site visit"
              className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]"
              required
            />
          </div>
          <div>
            <label htmlFor="taskDescription" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Description (Optional)
            </label>
            <textarea
              id="taskDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add more details about the task..."
              className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] resize-y"
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="taskDueDate" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="taskDueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]"
                required
              />
            </div>
            <div>
              <label htmlFor="taskPriority" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Priority
              </label>
              <select
                id="taskPriority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]"
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="taskAssignedTo" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Assigned To
            </label>
             <select
              id="taskAssignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]"
              required
            >
              {users.map(user => <option key={user.id} value={user.name}>{user.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md bg-gray-700 text-[var(--text-primary)] font-medium hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-[var(--primary-color)] text-white font-medium hover:bg-[#128c7e] transition-colors"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAdminTaskModal;