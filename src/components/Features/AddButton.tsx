import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { AddFeatureMenu } from './AddFeatureMenu';
import { useAppStore } from '../../stores/appStore';

export const AddButton: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { addFeature } = useAppStore();
  
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors z-40"
        onClick={() => setIsMenuOpen(true)}
      >
        <Plus className="w-6 h-6" />
      </motion.button>
      
      <AddFeatureMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onAddFeature={addFeature}
      />
    </>
  );
};