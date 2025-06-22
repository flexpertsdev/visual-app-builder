import React from 'react';
import { motion } from 'framer-motion';
import { Screen } from '../../types/app';
import { useCanvasStore } from '../../stores/canvasStore';
import { Card } from '../UI/Card';

interface ScreenCardProps {
  screen: Screen;
  onUpdate: (updates: Partial<Screen>) => void;
}

export const ScreenCard: React.FC<ScreenCardProps> = ({ screen, onUpdate }) => {
  const { zoom, selectedScreenId, selectScreen } = useCanvasStore();
  const isSelected = selectedScreenId === screen.id;
  
  const getCardSize = () => {
    if (zoom < 50) return { width: 128, height: 96 };
    if (zoom < 100) return { width: 192, height: 128 };
    return { width: 256, height: 384 };
  };
  
  const size = getCardSize();
  
  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(e, info) => {
        onUpdate({
          position: {
            x: screen.position.x + info.offset.x,
            y: screen.position.y + info.offset.y
          }
        });
      }}
      style={{
        position: 'absolute',
        left: screen.position.x,
        top: screen.position.y,
        width: size.width,
        height: size.height
      }}
      className={`cursor-move ${isSelected ? 'z-10' : 'z-0'}`}
      onClick={() => selectScreen(screen.id)}
    >
      <Card
        className={`
          w-full h-full p-4 transition-all
          ${isSelected ? 'ring-2 ring-primary-500 shadow-lg' : ''}
        `}
        hoverable
      >
        <h3 className="font-medium text-gray-900 mb-2">{screen.name}</h3>
        
        {zoom >= 100 && (
          <div className="text-sm text-gray-600">
            {screen.type}
          </div>
        )}
        
        {zoom >= 200 && screen.content && (
          <div className="mt-4">
            {/* Render screen preview */}
          </div>
        )}
      </Card>
    </motion.div>
  );
};