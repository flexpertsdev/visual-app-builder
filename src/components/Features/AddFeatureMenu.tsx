import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { featureTemplates } from '../../services/featureTemplates';

interface AddFeatureMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFeature: (templateId: string) => void;
}

export const AddFeatureMenu: React.FC<AddFeatureMenuProps> = ({
  isOpen,
  onClose,
  onAddFeature
}) => {
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Add Feature</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {featureTemplates.map(template => (
            <div
              key={template.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
              onClick={() => {
                onAddFeature(template.id);
                onClose();
              }}
            >
              <h3 className="font-medium text-gray-900 mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="text-xs text-gray-500">
                Adds {template.requiredScreens.length} screens
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};