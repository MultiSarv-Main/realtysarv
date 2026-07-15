
import React from 'react';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  docName: string;
  fileName: string;
  fileUrl: string;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ isOpen, onClose, docName, fileName, fileUrl }) => {
  if (!isOpen) return null;

  const isImage = fileUrl.startsWith('data:image/');

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="previewModalTitle"
    >
      <div
        className="bg-[var(--medium-bg)] rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-[var(--light-bg)]">
          <h3 id="previewModalTitle" className="text-lg font-semibold text-[var(--text-primary)]">
            Preview: {docName} <span className="text-sm font-normal text-[var(--text-secondary)]">- {fileName}</span>
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--light-bg)]">
            <i className="fas fa-times text-[var(--text-secondary)]"></i>
          </button>
        </div>
        <div className="flex-1 p-4 flex items-center justify-center bg-[var(--dark-bg)] overflow-auto">
          {isImage ? (
            <img src={fileUrl} alt={`Preview of ${fileName}`} className="max-w-full max-h-full object-contain" />
          ) : (
            <object data={fileUrl} type="application/pdf" className="w-full h-full">
                <div className="text-center text-[var(--text-secondary)]">
                    <i className="fas fa-exclamation-triangle text-6xl mb-4 text-yellow-500"></i>
                    <p>Unable to display preview.</p>
                    <p className="font-semibold text-[var(--text-primary)] mt-1">{fileName}</p>
                    <p className="text-xs mt-4">Your browser may not support embedding this file type.</p>
                    <a href={fileUrl} download={fileName} className="mt-4 inline-block px-4 py-2 rounded-md bg-[var(--primary-color)] text-white font-medium hover:bg-[#128c7e] transition-colors">
                        Download File
                    </a>
                </div>
            </object>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
