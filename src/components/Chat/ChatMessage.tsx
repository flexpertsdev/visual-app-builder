import React from 'react';
import { ChatMessage as ChatMessageType } from '../../types/ai';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className="mb-4">
      <div className={`
        rounded-lg p-3 mb-2
        ${message.type === 'assistant' 
          ? 'bg-gray-100' 
          : 'bg-primary-600 text-white ml-auto max-w-[80%]'
        }
      `}>
        {message.content}
      </div>
      
      {message.quickActions && (
        <div className="flex flex-wrap gap-2">
          {message.quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="px-3 py-1 text-sm bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
            >
              {action.text}
            </button>
          ))}
        </div>
      )}
      
      {message.modifications && (
        <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
          <div className="text-sm text-blue-700">
            Ready to apply {message.modifications.length} changes
          </div>
          <button className="text-xs text-blue-600 hover:text-blue-800">
            Preview Changes
          </button>
        </div>
      )}
    </div>
  );
};