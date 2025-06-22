import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface AddScreenIndicatorProps {
  position: { x: number; y: number };
  isVisible: boolean;
}

export const AddScreenIndicator: React.FC<AddScreenIndicatorProps> = ({ position, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      style={{
        position: 'absolute',
        left: position.x - 40,
        top: position.y - 40,
        pointerEvents: 'none'
      }}
      className="w-20 h-20"
    >
      <div className="w-full h-full border-2 border-dashed border-primary-400 rounded-lg flex items-center justify-center bg-primary-50 bg-opacity-50">
        <Plus className="w-6 h-6 text-primary-600" />
      </div>
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
        Click to add screen here
      </div>
    </motion.div>
  );
};