import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, User, ShoppingCart, Settings, Lock, Grid3X3, Bell, Mail } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useCanvasStore } from '../../stores/canvasStore';

interface AddScreenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

const SCREEN_TEMPLATES = [
  { id: 'home', name: 'Home', icon: Home, color: 'bg-blue-100' },
  { id: 'profile', name: 'Profile', icon: User, color: 'bg-green-100' },
  { id: 'login', name: 'Login', icon: Lock, color: 'bg-purple-100' },
  { id: 'settings', name: 'Settings', icon: Settings, color: 'bg-gray-100' },
  { id: 'shop', name: 'Shop', icon: ShoppingCart, color: 'bg-orange-100' },
  { id: 'dashboard', name: 'Dashboard', icon: Grid3X3, color: 'bg-indigo-100' },
  { id: 'notifications', name: 'Notifications', icon: Bell, color: 'bg-yellow-100' },
  { id: 'messages', name: 'Messages', icon: Mail, color: 'bg-pink-100' },
];

export const AddScreenDialog: React.FC<AddScreenDialogProps> = ({ isOpen, onClose, position }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [screenName, setScreenName] = useState('');
  const { addScreen, currentProject, updateProject } = useAppStore();
  const { pan, zoom } = useCanvasStore();
  
  const handleAddScreen = () => {
    if (!screenName.trim() && !selectedTemplate) return;
    
    const template = SCREEN_TEMPLATES.find(t => t.id === selectedTemplate);
    const name = screenName.trim() || template?.name || 'New Screen';
    
    // Calculate position relative to canvas
    const canvasPosition = position ? {
      x: (position.x - pan.x) / (zoom / 100),
      y: (position.y - pan.y) / (zoom / 100)
    } : {
      x: 300 + Math.random() * 200,
      y: 200 + Math.random() * 200
    };
    
    const newScreen = {
      id: `screen-${Date.now()}`,
      name,
      type: 'screen' as const,
      position: canvasPosition,
      size: { width: 256, height: 384 },
      connections: [],
      states: [{ name: 'default', isDefault: true }]
    };
    
    addScreen(newScreen);
    
    // Add to appropriate journey based on screen type
    if (currentProject) {
      const journeyId = template?.id === 'login' ? 'onboarding' : 'core-flow';
      const journey = currentProject.journeys.find(j => j.id === journeyId);
      
      if (journey) {
        updateProject({
          journeys: currentProject.journeys.map(j => 
            j.id === journey.id 
              ? { ...j, screens: [...j.screens, newScreen.id] }
              : j
          )
        });
      }
    }
    
    onClose();
    setScreenName('');
    setSelectedTemplate(null);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-96 z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add New Screen</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Screen Name
              </label>
              <input
                type="text"
                value={screenName}
                onChange={(e) => setScreenName(e.target.value)}
                placeholder={selectedTemplate ? SCREEN_TEMPLATES.find(t => t.id === selectedTemplate)?.name : "Enter screen name"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Template (Optional)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {SCREEN_TEMPLATES.map(template => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`
                        p-3 rounded-lg border-2 transition-all
                        ${selectedTemplate === template.id 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className={`${template.color} p-2 rounded mb-1`}>
                        <Icon className="w-5 h-5 mx-auto" />
                      </div>
                      <div className="text-xs text-gray-600">{template.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddScreen}
                disabled={!screenName.trim() && !selectedTemplate}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Screen
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};