import React from 'react';
import { Settings, MessageSquare, User } from 'lucide-react';
import { Button } from '../UI/Button';

interface HeaderProps {
  projectName: string;
  onZoomChange: (zoom: number) => void;
  currentZoom: number;
}

export const Header: React.FC<HeaderProps> = ({ projectName, onZoomChange, currentZoom }) => {
  const zoomLevels = [25, 50, 100, 200];
  
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" icon={Settings}>
          <span className="sr-only">Settings</span>
        </Button>
        <h1 className="text-lg font-semibold">{projectName}</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        {zoomLevels.map(level => (
          <button
            key={level}
            onClick={() => onZoomChange(level)}
            className={`
              px-3 py-1 text-sm rounded
              ${currentZoom === level 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            {level}%
          </button>
        ))}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" icon={MessageSquare}>
          <span className="sr-only">Messages</span>
        </Button>
        <Button variant="ghost" size="sm" icon={User}>
          <span className="sr-only">Profile</span>
        </Button>
      </div>
    </header>
  );
};