import React from 'react';
import { Settings, MessageSquare, User, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '../UI/Button';
import { useCanvasStore, ZOOM_LEVELS } from '../../stores/canvasStore';

interface HeaderProps {
  projectName: string;
  onZoomChange: (zoom: number) => void;
  currentZoom: number;
}

export const Header: React.FC<HeaderProps> = ({ projectName, onZoomChange, currentZoom }) => {
  const { zoomLevel } = useCanvasStore();
  
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" icon={Settings}>
          <span className="sr-only">Settings</span>
        </Button>
        <h1 className="text-lg font-semibold">{projectName}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Zoom controls */}
        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onZoomChange(Math.max(25, currentZoom - 25))}
            disabled={currentZoom <= 25}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          
          <div className="text-sm font-medium text-gray-700 min-w-[140px] text-center">
            {zoomLevel.name}
            <span className="text-xs text-gray-500 ml-1">({currentZoom}%)</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onZoomChange(Math.min(200, currentZoom + 25))}
            disabled={currentZoom >= 200}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Quick zoom presets */}
        <div className="flex items-center space-x-1">
          {ZOOM_LEVELS.map(level => (
            <button
              key={level.value}
              onClick={() => onZoomChange(level.value)}
              className={`
                px-2 py-1 text-xs rounded
                ${currentZoom === level.value 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
              title={level.description}
            >
              {level.value}%
            </button>
          ))}
        </div>
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