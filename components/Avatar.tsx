
import React from 'react';
import { Lead } from '../types';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg'; // small, medium, large
  chatStatus?: 'online' | 'offline'; // Updated from status
  bgColor?: string; // Tailwind background gradient class or custom color
  textColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  initials,
  size = 'md',
  chatStatus, // Updated from status
  bgColor = 'bg-gradient-to-br from-[#ff7e5f] to-[#feb47b]', // Default gradient
  textColor = 'text-white',
}) => {
  let sizeClasses = '';
  let textClasses = '';
  let statusSizeClasses = '';

  switch (size) {
    case 'sm':
      sizeClasses = 'w-9 h-9';
      textClasses = 'text-sm';
      statusSizeClasses = 'w-2 h-2';
      break;
    case 'md':
      sizeClasses = 'w-11 h-11';
      textClasses = 'text-lg';
      statusSizeClasses = 'w-[10px] h-[10px]'; // Match original '10px'
      break;
    case 'lg':
      sizeClasses = 'w-14 h-14';
      textClasses = 'text-xl';
      statusSizeClasses = 'w-3 h-3';
      break;
  }

  return (
    <div className="relative inline-block">
      <div
        className={`${sizeClasses} rounded-full ${bgColor} flex items-center justify-center font-bold ${textColor} flex-shrink-0`}
      >
        {initials}
      </div>
      {chatStatus === 'online' && ( // Updated from status
        <div
          className={`${statusSizeClasses} bg-[var(--primary-color)] rounded-full absolute bottom-0 right-0 border-2 border-[var(--dark-bg)]`}
        ></div>
      )}
    </div>
  );
};

export default Avatar;
