import React from 'react';
import { NewSiteVisitData, SiteVisit } from '../types';

interface SiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVisit: (visitData: NewSiteVisitData) => void;
  visitToEdit?: SiteVisit | null;
}

const SiteVisitModal: React.FC<SiteVisitModalProps> = ({ isOpen, onClose, onAddVisit, visitToEdit }) => {
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [propertyOfInterest, setPropertyOfInterest] = React.useState('');
  const [notes, setNotes] = React.useState('');

  const isEditing = !!visitToEdit;

  React.useEffect(() => {
    if (isOpen) {
      if (visitToEdit) {
        setDate(visitToEdit.date);
        setTime(visitToEdit.time);
        setPropertyOfInterest(visitToEdit.propertyOfInterest);
        setNotes(visitToEdit.notes || '');
      } else {
        // Reset form when opening for a new visit
        setDate('');
        setTime('');
        setPropertyOfInterest('');
        setNotes('');
      }
    }
  }, [isOpen, visitToEdit]);

  const handleSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (date.trim() && time.trim() && propertyOfInterest.trim()) {
      onAddVisit({ date, time, propertyOfInterest, notes: notes.trim() || undefined });
      onClose();
    } else {
      alert('Please fill in all required fields (Date, Time, Property of Interest).');
    }
  }, [date, time, propertyOfInterest, notes, onAddVisit, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fadeIn"
      onClick={onClose}
      aria-labelledby="siteVisitModalTitle"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[var(--medium-bg)] p-6 sm:p-8 rounded-lg shadow-xl w-11/12 max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="siteVisitModalTitle" className="text-xl sm:text-2xl font-bold mb-6 text-[var(--text-primary)] text-center">
          {isEditing ? 'Reschedule Site Visit' : 'Schedule Site Visit'}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="visitDate" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Date
            </label>
            <input
              type="date"
              id="visitDate"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="visitTime" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Time
            </label>
            <input
              type="time"
              id="visitTime"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="propertyOfInterest" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Property of Interest
            </label>
            <input
              type="text"
              id="propertyOfInterest"
              value={propertyOfInterest}
              onChange={(e) => setPropertyOfInterest(e.target.value)}
              placeholder="e.g., The Grand Towers, Unit 1001"
              className="w-full p-3 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="visitNotes" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Notes (Optional)
            </label>
            <textarea
              id="visitNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any specific instructions or client requests..."
              className="w-full p-3 rounded-md border border-[var(--border-color)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] resize-y"
            ></textarea>
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
              {isEditing ? 'Update Visit' : 'Schedule Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteVisitModal;