import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Map, Layout, Grid3X3, Package, Component } from 'lucide-react';
import { AddFeatureMenu } from './AddFeatureMenu';
import { AddScreenDialog } from './AddScreenDialog';
import { useAppStore } from '../../stores/appStore';
import { useCanvasStore } from '../../stores/canvasStore';

export const AddButton: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScreenDialogOpen, setIsScreenDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { addFeature, currentProject, updateProject } = useAppStore();
  const { zoomLevel, setZoom } = useCanvasStore();
  
  const getAddOptions = () => {
    switch (zoomLevel.value) {
      case 25:
        return {
          icon: Map,
          label: 'Add Journey',
          action: () => addJourney()
        };
      case 50:
        return {
          icon: Layout,
          label: 'Add Screen',
          action: () => setIsScreenDialogOpen(true)
        };
      case 100:
        return {
          icon: Grid3X3,
          label: 'Add Feature',
          action: () => setIsMenuOpen(true)
        };
      case 150:
        return {
          icon: Package,
          label: 'Add Section',
          action: () => addSection()
        };
      case 200:
        return {
          icon: Component,
          label: 'Add Component',
          action: () => addComponent()
        };
      default:
        return {
          icon: Plus,
          label: 'Add',
          action: () => setIsMenuOpen(true)
        };
    }
  };
  
  const addJourney = () => {
    if (!currentProject) return;
    
    const newJourney = {
      id: `journey-${Date.now()}`,
      name: `New Journey ${currentProject.journeys.length + 1}`,
      screens: [],
      description: 'New user journey'
    };
    
    updateProject({
      journeys: [...currentProject.journeys, newJourney]
    });
    
    setIsExpanded(false);
  };
  
  
  const addSection = () => {
    // TODO: Implement section addition
    console.log('Add section - to be implemented');
    setIsExpanded(false);
  };
  
  const addComponent = () => {
    // TODO: Implement component addition
    console.log('Add component - to be implemented');
    setIsExpanded(false);
  };
  
  const option = getAddOptions();
  const Icon = option.icon;
  
  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-2 min-w-[200px]"
            >
              <div className="text-xs font-medium text-gray-500 px-3 py-1">
                Current: {zoomLevel.name}
              </div>
              <button
                onClick={() => {
                  option.action();
                  setIsExpanded(false);
                }}
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 flex items-center space-x-2"
              >
                <Icon className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
              
              <div className="border-t mt-2 pt-2">
                <div className="text-xs font-medium text-gray-500 px-3 py-1">
                  Quick add at other levels:
                </div>
                {[25, 50, 100, 150, 200].filter(v => v !== zoomLevel.value).map(value => {
                  const levelName = value === 25 ? 'App Overview' : 
                                    value === 50 ? 'Screen Flow' :
                                    value === 100 ? 'Screen Detail' :
                                    value === 150 ? 'Feature Detail' :
                                    'Component Level';
                  
                  return (
                    <button
                      key={value}
                      onClick={() => {
                        setZoom(value);
                        setIsExpanded(false);
                      }}
                      className="w-full text-left px-3 py-1 rounded hover:bg-gray-50 text-xs text-gray-600"
                    >
                      Go to {levelName}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
          onContextMenu={(e) => {
            e.preventDefault();
            option.action();
          }}
        >
          <Icon className="w-6 h-6" />
        </motion.button>
        
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="bg-gray-900 text-white text-xs px-2 py-1 rounded"
              >
                Right-click for {option.label}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <AddFeatureMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onAddFeature={addFeature}
      />
      
      <AddScreenDialog
        isOpen={isScreenDialogOpen}
        onClose={() => setIsScreenDialogOpen(false)}
      />
    </>
  );
};