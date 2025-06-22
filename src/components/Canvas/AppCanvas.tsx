import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useCanvasStore } from '../../stores/canvasStore';
import { ScreenCard } from './ScreenCard';
import { ConnectionLines } from './ConnectionLines';
import { Screen } from '../../types/app';

interface AppCanvasProps {
  screens: Screen[];
  onScreenUpdate: (screenId: string, updates: Partial<Screen>) => void;
}

export const AppCanvas: React.FC<AppCanvasProps> = ({ screens, onScreenUpdate }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { zoom, pan, isDragging, setDragging, setPan } = useCanvasStore();
  
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
        <ConnectionLines screens={screens} />
        
        {screens.map(screen => (
          <ScreenCard
            key={screen.id}
            screen={screen}
            onUpdate={(updates) => onScreenUpdate(screen.id, updates)}
          />
        ))}
      </motion.div>
    </div>
  );
};