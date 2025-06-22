import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Tablet, Monitor, RotateCw } from 'lucide-react';
import { Button } from '../UI/Button';
import { useAppStore } from '../../stores/appStore';
import { Screen } from '../../types/app';

interface PreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type DeviceType = 'mobile' | 'tablet' | 'desktop';

const DEVICE_SIZES = {
  mobile: { width: 375, height: 812, name: 'iPhone 12' },
  tablet: { width: 768, height: 1024, name: 'iPad' },
  desktop: { width: 1366, height: 768, name: 'Desktop' }
};

export const PreviewDialog: React.FC<PreviewDialogProps> = ({ isOpen, onClose }) => {
  const { currentProject } = useAppStore();
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('mobile');
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [isPortrait, setIsPortrait] = useState(true);

  if (!currentProject || !currentProject.screens.length) {
    return null;
  }

  const currentScreen = currentProject.screens[currentScreenIndex];
  const device = DEVICE_SIZES[selectedDevice];
  
  const width = isPortrait ? device.width : device.height;
  const height = isPortrait ? device.height : device.width;

  const handleNavigateToScreen = (screenId: string) => {
    const index = currentProject.screens.findIndex(s => s.id === screenId);
    if (index !== -1) {
      setCurrentScreenIndex(index);
    }
  };

  const renderScreenContent = (screen: Screen) => {
    return (
      <div className="w-full h-full bg-white overflow-auto">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">{screen.name}</h2>
          
          <div className="space-y-4">
            <p className="text-gray-600">Screen Type: {screen.type}</p>
            
            {screen.connections.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Connections:</h3>
                <div className="space-y-2">
                  {screen.connections.map((conn, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigateToScreen(conn.to)}
                      className="block w-full text-left px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
                    >
                      {conn.label || `Navigate to ${conn.to}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {!screen.connections.length && (
              <p className="text-gray-400 italic">No connections defined for this screen</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-8"
          >
            <div className="bg-gray-100 rounded-lg shadow-xl w-full h-full flex flex-col">
              {/* Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold">Preview Mode</h2>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={selectedDevice === 'mobile' ? 'primary' : 'outline'}
                      size="sm"
                      icon={Smartphone}
                      onClick={() => setSelectedDevice('mobile')}
                    >
                      Mobile
                    </Button>
                    <Button
                      variant={selectedDevice === 'tablet' ? 'primary' : 'outline'}
                      size="sm"
                      icon={Tablet}
                      onClick={() => setSelectedDevice('tablet')}
                    >
                      Tablet
                    </Button>
                    <Button
                      variant={selectedDevice === 'desktop' ? 'primary' : 'outline'}
                      size="sm"
                      icon={Monitor}
                      onClick={() => setSelectedDevice('desktop')}
                    >
                      Desktop
                    </Button>
                  </div>
                  {selectedDevice !== 'desktop' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={RotateCw}
                      onClick={() => setIsPortrait(!isPortrait)}
                    >
                      Rotate
                    </Button>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Device Frame */}
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="relative">
                  {/* Device Shadow */}
                  <div 
                    className="absolute inset-0 bg-black/20 rounded-3xl blur-xl transform translate-y-4"
                    style={{ width: `${width}px`, height: `${height}px` }}
                  />
                  
                  {/* Device */}
                  <div 
                    className="relative bg-gray-900 rounded-3xl p-3 shadow-2xl"
                    style={{ width: `${width + 24}px`, height: `${height + 24}px` }}
                  >
                    {/* Screen */}
                    <div 
                      className="bg-white rounded-2xl overflow-hidden"
                      style={{ width: `${width}px`, height: `${height}px` }}
                    >
                      {renderScreenContent(currentScreen)}
                    </div>
                    
                    {/* Home Indicator (for mobile) */}
                    {selectedDevice === 'mobile' && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-700 rounded-full" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Screen Navigation */}
              <div className="bg-white px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Screen {currentScreenIndex + 1} of {currentProject.screens.length}
                  </div>
                  <div className="flex items-center space-x-2">
                    {currentProject.screens.map((screen, index) => (
                      <button
                        key={screen.id}
                        onClick={() => setCurrentScreenIndex(index)}
                        className={`px-3 py-1 text-sm rounded ${
                          index === currentScreenIndex
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {screen.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};