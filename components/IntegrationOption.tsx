
import React from 'react';
import { IntegrationOptionType } from '../types';

interface IntegrationOptionProps {
  option: IntegrationOptionType;
  onClick: (action: string) => void;
}

const IntegrationOption: React.FC<IntegrationOptionProps> = ({ option, onClick }) => {
  const handleClick = React.useCallback(() => {
    onClick(option.action);
  }, [option.action, onClick]);

  return (
    <div
      className="flex flex-col items-center cursor-pointer transition-colors text-[var(--text-secondary)] p-2 rounded-lg min-w-[60px] hover:text-[var(--primary-color)] hover:bg-[var(--dark-bg)]"
      onClick={handleClick}
    >
      <div className="text-xl sm:text-2xl mb-1">
        <i className={option.icon}></i>
      </div>
      <div className="text-xs text-center">{option.label}</div>
    </div>
  );
};

export default IntegrationOption;
