import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useCanvasStore } from '../../stores/canvasStore';
import { ScreenCard } from './ScreenCard';
import { ConnectionLines } from './ConnectionLines';
import { JourneyOverlay } from './JourneyOverlay';
import { AddScreenIndicator } from './AddScreenIndicator';
import { AddScreenDialog } from '../Features/AddScreenDialog';
import { Screen } from '../../types/app';
import { useAppStore } from '../../stores/appStore';

interface AppCanvasProps {
  screens: Screen[];
  onScreenUpdate: (screenId: string, updates: Partial<Screen>) => void;
}

export const AppCanvas: React.FC<AppCanvasProps> = ({ screens, onScreenUpdate }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addPosition, setAddPosition] = useState<{ x: number; y: number } | undefined>();
  
  const { zoom, pan, isDragging, setDragging, setPan, zoomLevel } = useCanvasStore();
  const { currentProject } = useAppStore();
  
  // Enable add mode with keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'a' && !e.ctrlKey && !e.metaKey && zoomLevel.value === 50) {
        setIsAddMode(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'a') {
        setIsAddMode(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [zoomLevel]);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isAddMode) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setHoverPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  };
  
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isAddMode && e.target === canvasRef.current) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setAddPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        setShowAddDialog(true);
        setIsAddMode(false);
      }
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current && !isAddMode) {
      setDragging(true);
      const startX = e.clientX - pan.x;
      const startY = e.clientY - pan.y;
      
      const handleMouseMove = (e: MouseEvent) => {
        setPan({
          x: e.clientX - startX,
          y: e.clientY - startY
        });
      };
      
      const handleMouseUp = () => {
        setDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };
  
  return (
    <>
      <div 
        ref={canvasRef}
        className="relative w-full h-full overflow-hidden bg-gray-50"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onClick={handleCanvasClick}
        style={{ 
          cursor: isAddMode ? 'crosshair' : isDragging ? 'grabbing' : 'grab' 
        }}
      >
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <motion.div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
          transformOrigin: '0 0'
        }}
        className="relative"
      >
        {/* Journey overlay at highest zoom out */}
        {zoomLevel.showJourneys && currentProject?.journeys && (
          <JourneyOverlay 
            journeys={currentProject.journeys} 
            screens={screens} 
          />
        )}
        
        {/* Connection lines when appropriate */}
        {zoomLevel.showConnections && (
          <ConnectionLines screens={screens} />
        )}
        
        {/* Screen cards with appropriate detail level */}
        {screens.map(screen => (
          <ScreenCard
            key={screen.id}
            screen={screen}
            zoomLevel={zoomLevel}
            onUpdate={(updates) => onScreenUpdate(screen.id, updates)}
          />
        ))}
        
        {/* Add screen indicator */}
        <AddScreenIndicator
          position={hoverPosition}
          isVisible={isAddMode}
        />
      </motion.div>
      
      {/* Add mode indicator */}
      {isAddMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="text-sm font-medium">Add Mode Active</div>
          <div className="text-xs opacity-90">Click anywhere to add a screen</div>
        </div>
      )}
    </div>
    
    <AddScreenDialog
      isOpen={showAddDialog}
      onClose={() => {
        setShowAddDialog(false);
        setAddPosition(undefined);
      }}
      position={addPosition}
    />
    </>
  );
};