import React from 'react';
import { motion } from 'framer-motion';
import { Screen } from '../../types/app';
import { useCanvasStore, ZoomLevel } from '../../stores/canvasStore';
import { Card } from '../UI/Card';
import { Home, Users, ShoppingCart, Settings, Lock, Bell } from 'lucide-react';

interface ScreenCardProps {
  screen: Screen;
  zoomLevel: ZoomLevel;
  onUpdate: (updates: Partial<Screen>) => void;
}

export const ScreenCard: React.FC<ScreenCardProps> = ({ screen, zoomLevel, onUpdate }) => {
  const { selectedScreenId, selectScreen } = useCanvasStore();
  const isSelected = selectedScreenId === screen.id;
  
  const getCardSize = () => {
    switch (zoomLevel.value) {
      case 25: return { width: 120, height: 80 };
      case 50: return { width: 180, height: 120 };
      case 100: return { width: 240, height: 320 };
      case 150: return { width: 280, height: 400 };
      case 200: return { width: 320, height: 480 };
      default: return { width: 240, height: 320 };
    }
  };
  
  const size = getCardSize();
  
  // Mock screen icons based on type
  const getScreenIcon = () => {
    if (screen.name.toLowerCase().includes('home')) return Home;
    if (screen.name.toLowerCase().includes('login') || 
        screen.name.toLowerCase().includes('auth')) return Lock;
    if (screen.name.toLowerCase().includes('profile')) return Users;
    if (screen.name.toLowerCase().includes('settings')) return Settings;
    if (screen.name.toLowerCase().includes('shop') || 
        screen.name.toLowerCase().includes('cart')) return ShoppingCart;
    return Bell;
  };
  
  const Icon = getScreenIcon();
  
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
          w-full h-full transition-all overflow-hidden
          ${isSelected ? 'ring-2 ring-primary-500 shadow-lg' : ''}
          ${zoomLevel.value <= 50 ? 'p-2' : 'p-4'}
        `}
        hoverable
      >
        {/* Minimal view for App Overview */}
        {zoomLevel.value === 25 && (
          <div className="flex items-center justify-center h-full">
            <Icon className="w-6 h-6 text-gray-400" />
          </div>
        )}
        
        {/* Screen Flow view */}
        {zoomLevel.value === 50 && (
          <div className="flex flex-col items-center justify-center h-full">
            <Icon className="w-8 h-8 text-gray-500 mb-1" />
            <h3 className="text-xs font-medium text-gray-700 text-center">{screen.name}</h3>
          </div>
        )}
        
        {/* Screen Detail view */}
        {zoomLevel.value === 100 && (
          <>
            <div className="flex items-center mb-3">
              <Icon className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="font-medium text-gray-900">{screen.name}</h3>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Type: {screen.type}
            </div>
            {/* Mock screen preview */}
            <div className="mt-4 bg-gray-50 rounded-lg p-3 h-48">
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          </>
        )}
        
        {/* Feature Detail view */}
        {zoomLevel.value === 150 && (
          <>
            <div className="flex items-center mb-3">
              <Icon className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="font-medium text-gray-900">{screen.name}</h3>
            </div>
            <div className="text-sm text-gray-600 mb-3">
              Type: {screen.type}
            </div>
            {/* Mock features list */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-700 mb-1">Features:</div>
              <div className="bg-blue-50 p-2 rounded text-xs">User Authentication</div>
              <div className="bg-green-50 p-2 rounded text-xs">Form Validation</div>
              <div className="bg-purple-50 p-2 rounded text-xs">API Integration</div>
            </div>
            {/* Screen preview */}
            <div className="mt-4 bg-gray-50 rounded-lg p-3 h-48">
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </>
        )}
        
        {/* Component Level view */}
        {zoomLevel.value === 200 && (
          <>
            <div className="flex items-center mb-3">
              <Icon className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="font-medium text-gray-900">{screen.name}</h3>
            </div>
            {/* Mock component tree */}
            <div className="text-xs space-y-2">
              <div className="font-semibold text-gray-700">Components:</div>
              <div className="pl-2 border-l-2 border-gray-200">
                <div className="py-1">📦 Header</div>
                <div className="pl-4 py-1">📄 Logo</div>
                <div className="pl-4 py-1">📄 Navigation</div>
              </div>
              <div className="pl-2 border-l-2 border-gray-200">
                <div className="py-1">📦 Form Container</div>
                <div className="pl-4 py-1">📄 Input Field</div>
                <div className="pl-4 py-1">📄 Button</div>
              </div>
              <div className="pl-2 border-l-2 border-gray-200">
                <div className="py-1">📦 Footer</div>
                <div className="pl-4 py-1">📄 Links</div>
              </div>
            </div>
            {/* Detailed preview */}
            <div className="mt-4 bg-gray-50 rounded-lg p-3">
              <div className="space-y-2">
                <div className="bg-blue-100 p-2 rounded text-xs">Header Component</div>
                <div className="bg-white p-3 rounded border">
                  <div className="h-6 bg-gray-300 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
                <div className="bg-green-100 p-2 rounded text-xs">Footer Component</div>
              </div>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
};