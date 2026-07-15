
import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { content, time, sender } = message;
  const isSent = sender === 'sent';

  return (
    <div
      className={`max-w-[75%] px-3.5 py-2 rounded-2xl mb-1 relative animate-fadeIn flex flex-col ${
        isSent
          ? 'bg-[#d9fdd3] dark:bg-[#005c4b] self-end rounded-tr-none text-gray-900 dark:text-[#e9edef]'
          : 'bg-white dark:bg-[#202c33] self-start rounded-tl-none border border-black/5 dark:border-white/5 shadow-sm text-gray-900 dark:text-[#e9edef]'
      }`}
    >
      <div className="text-[13px] leading-relaxed whitespace-pre-wrap">{content}</div>
      <div className={`text-[9px] mt-1 self-end font-medium tracking-tighter opacity-60 ${isSent ? 'text-gray-600 dark:text-[#8696a0]' : 'text-gray-500 dark:text-[#8696a0]'}`}>
          {time}
          {isSent && <i className="fas fa-check-double ml-1 text-blue-400"></i>}
      </div>
    </div>
  );
};

export default MessageBubble;
