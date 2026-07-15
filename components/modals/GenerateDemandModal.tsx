




import React from 'react';
import { PaymentPlanMilestone } from '../../types';

interface GenerateDemandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: { milestoneId: string; demandDate: string; dueDate: string; milestoneDate: string }) => void;
  milestones: PaymentPlanMilestone[];
  initialMilestoneId?: string;
}

const GenerateDemandModal: React.FC<GenerateDemandModalProps> = ({ isOpen, onClose, onGenerate, milestones, initialMilestoneId }) => {
  const [milestoneId, setMilestoneId] = React.useState('');
  const [milestoneDate, setMilestoneDate] = React.useState('');
  const [demandDate, setDemandDate] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const due = new Date();
      due.setDate(today.getDate() + 15); // Default 15 days due

      const todayStr = today.toISOString().split('T')[0];
      setDemandDate(todayStr);
      setDueDate(due.toISOString().split('T')[0]);
      setMilestoneId(initialMilestoneId || (milestones.length > 0 ? milestones[0].id : ''));
    }
  }, [isOpen, initialMilestoneId, milestones]);

  React.useEffect(() => {
      const selectedMilestone = milestones.find(m => m.id === milestoneId);
      if (selectedMilestone?.achievedDate) {
          setMilestoneDate(selectedMilestone.achievedDate);
      } else {
          // Only reset to today if no date is set and the field is empty
          if (!milestoneDate) {
              setMilestoneDate(new Date().toISOString().split('T')[0]);
          }
      }
  }, [milestoneId, milestones]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (milestoneId && demandDate && dueDate && milestoneDate) {
      onGenerate({ milestoneId, demandDate, dueDate, milestoneDate });
      onClose();
    } else {
      alert('Please fill in all dates.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fadeIn" onClick={onClose}>
      <div className="bg-[var(--medium-bg)] p-6 rounded-lg shadow-xl w-11/12 max-w-lg" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Generate Demand Letter</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1">Select Milestone</label>
            <select
              value={milestoneId}
              onChange={(e) => setMilestoneId(e.target.value)}
              className="w-full p-2 rounded bg-[var(--dark-bg)] text-[var(--text-primary)] border border-[var(--light-bg)] focus:outline-none focus:border-[var(--primary-color)]"
              required
            >
              <option value="" disabled>-- Select Milestone --</option>
              {milestones.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.percentage}%)
                </option>
              ))}
            </select>
          </div>
          
          <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Milestone Achieved Date</label>
              <input
                type="date"
                value={milestoneDate}
                onChange={(e) => setMilestoneDate(e.target.value)}
                className="w-full p-2 rounded bg-[var(--dark-bg)] text-[var(--text-primary)] border border-[var(--light-bg)] focus:outline-none focus:border-[var(--primary-color)]"
                required
              />
              <p className="text-xs text-[var(--text-secondary)] mt-1">The date when construction reached this stage.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Demand Letter Date</label>
              <input
                type="date"
                value={demandDate}
                onChange={(e) => setDemandDate(e.target.value)}
                className="w-full p-2 rounded bg-[var(--dark-bg)] text-[var(--text-primary)] border border-[var(--light-bg)] focus:outline-none focus:border-[var(--primary-color)]"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 rounded bg-[var(--dark-bg)] text-[var(--text-primary)] border border-[var(--light-bg)] focus:outline-none focus:border-[var(--primary-color)]"
                required
              />
            </div>
          </div>

          <div className="bg-[var(--dark-bg)] p-3 rounded border border-[var(--light-bg)] text-xs text-[var(--text-secondary)]">
            <p><i className="fas fa-info-circle mr-1"></i> The generated letter will include payment instructions and bank details automatically.</p>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-[var(--text-secondary)] hover:bg-[var(--light-bg)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[var(--primary-color)] text-white hover:bg-[#128c7e] transition-colors font-medium shadow-sm"
            >
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateDemandModal;