
import React from 'react';

// This component is deprecated/unused. Tasks are managed via NewAdminTaskModal or FollowUpModal.
// Keeping it as a placeholder to prevent build errors if it's referenced by legacy code.
const TaskModal: React.FC<any> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return null;
};

export default TaskModal;
