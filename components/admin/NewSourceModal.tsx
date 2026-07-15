import React from 'react';
import { NewSourceData, Source } from '../../types';

interface NewSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSource: (sourceData: NewSourceData) => void;
  sources: Source[];
}

const NewSourceModal: React.FC<NewSourceModalProps> = ({ isOpen, onClose, onAddSource, sources }) => {
  const [channelSource, setChannelSource] = React.useState('');
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const uniqueChannelSources = React.useMemo(() => {
    const channels = new Set(sources.map(s => s.channelSource));
    return Array.from(channels);
  }, [sources]);

  const handleSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (channelSource.trim() && name.trim()) {
      onAddSource({ channelSource: channelSource.trim(), name: name.trim(), description: description.trim() || undefined });
      setChannelSource('');
      setName('');
      setDescription('');
      onClose();
    } else {
      alert('Please enter a Channel Source and a Source Name.');
    }
  }, [channelSource, name, description, onAddSource, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fadeIn"
      onClick={onClose}
      aria-labelledby="newSourceModalTitle"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[var(--medium-bg)] p-6 sm:p-8 rounded-lg shadow-xl w-11/12 max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="newSourceModalTitle" className="text-xl sm:text-2xl font-bold mb-6 text-[var(--text-primary)] text-center">
          Add New Lead Source
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="channelSource" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Channel Source
            </label>
            <input
              type="text"
              id="channelSource"
              list="channelSource-list"
              value={channelSource}
              onChange={(e) => setChannelSource(e.target.value)}
              placeholder="Select or type a new channel"
              className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]"
              required
              aria-required="true"
            />
            <datalist id="channelSource-list">
              {uniqueChannelSources.map(channel => (
                <option key={channel} value={channel} />
              ))}
            </datalist>
          </div>
          <div>
            <label htmlFor="sourceName" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Source Name
            </label>
            <input
              type="text"
              id="sourceName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Website, Facebook, Referral"
              className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)]"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="sourceDescription" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Source Details (Optional)
            </label>
            <textarea
              id="sourceDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="A brief description or details about this lead source."
              className="w-full p-3 rounded-md border border-[var(--light-bg)] bg-[var(--dark-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] resize-y"
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
              Add Source
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSourceModal;