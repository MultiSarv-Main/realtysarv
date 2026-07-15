
import React from 'react';
import { Lead, Project } from '../../types';
import BookingFormTemplate from '../document_templates/BookingFormTemplate';
import AllotmentLetterTemplate from '../document_templates/AllotmentLetterTemplate';
import PossessionLetterTemplate from '../document_templates/PossessionLetterTemplate';
import PaymentReceiptTemplate from '../document_templates/PaymentReceiptTemplate';
import DemandLetterTemplate from '../document_templates/DemandLetterTemplate';

// Exported type to be used in other components like DocumentHub to ensure type consistency
export type UnitDocTemplate = 
    | 'Booking Form' 
    | 'Allotment Letter' 
    | 'Possession Letter' 
    | 'Agreement Draft' 
    | 'Registered Agreement'
    | 'Tripartite Agreement'
    | 'Maintenance Agreement'
    | 'Parking Allotment Letter' 
    | 'Possession Receipt' 
    | 'Flat NOC' 
    | 'Payment Receipt' 
    | 'Demand Letter'
    | 'Handover Checklist'
    | 'Unit Layout Plan'
    | 'Share Certificate'
    | 'Interest Letter'
    | 'GST Installment Letter'
    | 'Payment Reminder'
    | 'Cancellation Notice'
    | 'Challan Copy'; // Added 'Challan Copy' to resolve type error on line 454 of DocumentHub


interface UnitDocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateType: UnitDocTemplate;
  lead: Lead;
  project: Project | null;
  extraData?: any; // For passing specific payment record or milestone
}

const UnitDocumentViewerModal: React.FC<UnitDocumentViewerModalProps> = ({ isOpen, onClose, templateType, lead, project, extraData }) => {
  const printRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
        const printWindow = window.open('', '', 'height=800,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print Document</title>');
            printWindow.document.write('<style>body { font-family: "Times New Roman", Times, serif; } table { width: 100%; border-collapse: collapse; } td, th { border: 1px solid #ccc; padding: 8px; } .no-print { display: none; } </style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(printContent.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    }
  };
  
  const handleDownload = () => {
      alert("Simulating PDF download...");
  };

  const renderTemplate = () => {
    switch(templateType) {
        case 'Booking Form':
            return <BookingFormTemplate lead={lead} project={project} />;
        case 'Allotment Letter':
            return <AllotmentLetterTemplate lead={lead} project={project} />;
        case 'Possession Letter':
            return <PossessionLetterTemplate lead={lead} project={project} />;
        case 'Payment Receipt':
            return <PaymentReceiptTemplate lead={lead} project={project} payment={extraData} />;
        case 'Demand Letter':
            return <DemandLetterTemplate lead={lead} project={project} data={extraData?.milestone ? extraData : undefined} milestone={!extraData?.milestone ? extraData : undefined} />;
        default:
            return (
                <div className="p-8 text-center text-gray-400">
                    <i className="fas fa-file-invoice text-5xl mb-4"></i>
                    <p>A template for <strong>{templateType}</strong> is being prepared based on your ledger data.</p>
                    <p className="text-xs mt-2">You can preview the statutory content and layout here once finalized.</p>
                </div>
            );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[var(--medium-bg)] rounded-lg shadow-xl w-full max-w-4xl h-[95vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-[var(--light-bg)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Document Viewer: {templateType}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--light-bg)]">
            <i className="fas fa-times text-[var(--text-secondary)]"></i>
          </button>
        </div>
        
        <div className="flex-1 bg-gray-200 p-4 sm:p-6 overflow-y-auto text-black">
          <div ref={printRef} className="bg-white max-w-[210mm] min-h-[297mm] mx-auto p-12 shadow-lg">
             {renderTemplate()}
          </div>
        </div>

        <div className="flex-shrink-0 flex justify-end items-center p-3 border-t border-[var(--light-bg)] gap-3">
          <button onClick={handleDownload} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
            <i className="fas fa-file-pdf"></i> Download as PDF
          </button>
          <button onClick={handlePrint} className="px-4 py-2 text-sm rounded-md bg-[var(--primary-color)] text-white font-medium hover:bg-[#128c7e] transition-colors flex items-center gap-2">
            <i className="fas fa-print"></i> Print Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnitDocumentViewerModal;
