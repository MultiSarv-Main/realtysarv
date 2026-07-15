
import React from 'react';

// This component is deprecated/unused in favor of LeadModal.tsx
// Keeping it as a placeholder to prevent build errors if it's referenced by legacy code.
const NewLeadModal: React.FC<any> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return null; 
};

export default NewLeadModal;
