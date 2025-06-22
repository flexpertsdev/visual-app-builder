import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useCanvasStore } from '../../stores/canvasStore';
import { ScreenCard } from './ScreenCard';
import { ConnectionLines } from './ConnectionLines';
import { JourneyOverlay } from './JourneyOverlay';
import { Screen } from '../../types/app';
import { useAppStore } from '../../stores/appStore';

interface AppCanvasProps {
  screens: Screen[];
  onScreenUpdate: (screenId: string, updates: Partial<Screen>) => void;
}

export const AppCanvas: React.FC<AppCanvasProps> = ({ screens, onScreenUpdate }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { zoom, pan, isDragging, setDragging, setPan, zoomLevel } = useCanvasStore();
  const { currentProject } = useAppStore();
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
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
    <div 
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden bg-gray-50"
      onMouseDown={handleMouseDown}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
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
      </motion.div>
    </div>
  );
};