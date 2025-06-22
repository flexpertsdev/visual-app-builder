import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Palette, 
  Type, 
  Square, 
  Move, 
  Check,
  Copy,
  RefreshCw
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { DesignSystem } from '../../types/app';

interface DesignSystemEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

const presetColors = [
  { name: 'Blue', value: '#2563eb' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Green', value: '#10b981' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Indigo', value: '#6366f1' }
];

const fontFamilies = [
  { name: 'Inter', value: 'Inter' },
  { name: 'System', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto' },
  { name: 'Helvetica', value: 'Helvetica Neue, Helvetica, Arial' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Mono', value: 'ui-monospace, SFMono-Regular, Consolas' }
];

export const DesignSystemEditor: React.FC<DesignSystemEditorProps> = ({ isOpen, onClose }) => {
  const { currentProject, updateProject } = useAppStore();
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'preview'>('colors');
  const [localDesignSystem, setLocalDesignSystem] = useState<DesignSystem | null>(
    currentProject?.designSystem || null
  );
  
  if (!localDesignSystem) return null;
  
  const updateDesignSystem = (updates: Partial<DesignSystem>) => {
    const newDesignSystem = { ...localDesignSystem, ...updates };
    setLocalDesignSystem(newDesignSystem);
  };
  
  const updateColor = (key: keyof DesignSystem['colors'], value: string) => {
    updateDesignSystem({
      colors: { ...localDesignSystem.colors, [key]: value }
    });
  };
  
  const applyChanges = () => {
    if (currentProject) {
      updateProject({ designSystem: localDesignSystem });
      onClose();
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  const generateColorVariations = (baseColor: string) => {
    // Simple color variation generator
    const variations = [];
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Lighter variations
    for (let i = 1; i <= 3; i++) {
      const factor = 1 + (i * 0.15);
      const newR = Math.min(255, Math.round(r * factor));
      const newG = Math.min(255, Math.round(g * factor));
      const newB = Math.min(255, Math.round(b * factor));
      variations.push(`#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`);
    }
    
    // Darker variations
    for (let i = 1; i <= 3; i++) {
      const factor = 1 - (i * 0.15);
      const newR = Math.max(0, Math.round(r * factor));
      const newG = Math.max(0, Math.round(g * factor));
      const newB = Math.max(0, Math.round(b * factor));
      variations.push(`#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`);
    }
    
    return variations;
  };
  
  const tabs = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'spacing', label: 'Spacing', icon: Move },
    { id: 'preview', label: 'Preview', icon: Square }
  ];
  
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
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-0 top-0 bottom-0 w-[480px] bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Design System</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-colors
                      ${activeTab === tab.id
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'colors' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Brand Colors</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Primary Color</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={localDesignSystem.colors.primary}
                            onChange={(e) => updateColor('primary', e.target.value)}
                            className="w-12 h-12 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={localDesignSystem.colors.primary}
                            onChange={(e) => updateColor('primary', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                          />
                          <button
                            onClick={() => copyToClipboard(localDesignSystem.colors.primary)}
                            className="p-2 hover:bg-gray-100 rounded"
                          >
                            <Copy className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                        
                        <div className="mt-2 flex space-x-2">
                          {presetColors.map(preset => (
                            <button
                              key={preset.value}
                              onClick={() => updateColor('primary', preset.value)}
                              className="relative w-8 h-8 rounded-lg transition-transform hover:scale-110"
                              style={{ backgroundColor: preset.value }}
                              title={preset.name}
                            >
                              {localDesignSystem.colors.primary === preset.value && (
                                <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Background Color</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={localDesignSystem.colors.background}
                            onChange={(e) => updateColor('background', e.target.value)}
                            className="w-12 h-12 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={localDesignSystem.colors.background}
                            onChange={(e) => updateColor('background', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Text Color</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={localDesignSystem.colors.text}
                            onChange={(e) => updateColor('text', e.target.value)}
                            className="w-12 h-12 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={localDesignSystem.colors.text}
                            onChange={(e) => updateColor('text', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Color Palette</h3>
                    <div className="grid grid-cols-7 gap-2">
                      {generateColorVariations(localDesignSystem.colors.primary).map((color, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-lg cursor-pointer transition-transform hover:scale-110"
                          style={{ backgroundColor: color }}
                          onClick={() => copyToClipboard(color)}
                          title={`Click to copy ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'typography' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Font Family</label>
                    <div className="space-y-2">
                      {fontFamilies.map(font => (
                        <button
                          key={font.value}
                          onClick={() => updateDesignSystem({
                            typography: { ...localDesignSystem.typography, fontFamily: font.value }
                          })}
                          className={`
                            w-full text-left p-4 rounded-lg border-2 transition-all
                            ${localDesignSystem.typography.fontFamily === font.value
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                          style={{ fontFamily: font.value }}
                        >
                          <div className="font-medium">{font.name}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            The quick brown fox jumps over the lazy dog
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Type Scale</label>
                    <div className="space-y-2">
                      {(['compact', 'normal', 'spacious'] as const).map(scale => (
                        <button
                          key={scale}
                          onClick={() => updateDesignSystem({
                            typography: { ...localDesignSystem.typography, scale }
                          })}
                          className={`
                            w-full text-left p-4 rounded-lg border-2 transition-all
                            ${localDesignSystem.typography.scale === scale
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                        >
                          <div className="font-medium capitalize">{scale}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {scale === 'compact' && 'Smaller text sizes, tighter spacing'}
                            {scale === 'normal' && 'Default text sizes and spacing'}
                            {scale === 'spacious' && 'Larger text sizes, more breathing room'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'spacing' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Border Radius</label>
                    <div className="space-y-2">
                      {(['none', 'sm', 'md', 'lg', 'xl'] as const).map(radius => (
                        <button
                          key={radius}
                          onClick={() => updateDesignSystem({ borderRadius: radius })}
                          className={`
                            w-full text-left p-4 rounded-lg border-2 transition-all
                            ${localDesignSystem.borderRadius === radius
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium capitalize">{radius === 'none' ? 'None' : radius.toUpperCase()}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                {radius === 'none' && 'Sharp corners (0px)'}
                                {radius === 'sm' && 'Subtle rounding (4px)'}
                                {radius === 'md' && 'Medium rounding (8px)'}
                                {radius === 'lg' && 'Large rounding (12px)'}
                                {radius === 'xl' && 'Extra large rounding (16px)'}
                              </div>
                            </div>
                            <div 
                              className="w-12 h-12 bg-primary-200"
                              style={{
                                borderRadius: radius === 'none' ? '0' :
                                            radius === 'sm' ? '4px' :
                                            radius === 'md' ? '8px' :
                                            radius === 'lg' ? '12px' : '16px'
                              }}
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Spacing System</label>
                    <div className="space-y-2">
                      {(['tight', 'normal', 'relaxed'] as const).map(spacing => (
                        <button
                          key={spacing}
                          onClick={() => updateDesignSystem({ spacing })}
                          className={`
                            w-full text-left p-4 rounded-lg border-2 transition-all
                            ${localDesignSystem.spacing === spacing
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                        >
                          <div className="font-medium capitalize">{spacing}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {spacing === 'tight' && 'Compact layout with minimal spacing'}
                            {spacing === 'normal' && 'Balanced spacing throughout'}
                            {spacing === 'relaxed' && 'Generous spacing for breathing room'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'preview' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-lg border border-gray-200" style={{
                    backgroundColor: localDesignSystem.colors.background,
                    fontFamily: localDesignSystem.typography.fontFamily
                  }}>
                    <h3 className="text-2xl font-bold mb-4" style={{ color: localDesignSystem.colors.text }}>
                      Preview Your Design System
                    </h3>
                    <p className="mb-4" style={{ color: localDesignSystem.colors.text, opacity: 0.8 }}>
                      This is how your app will look with the current design system settings.
                    </p>
                    
                    <div className="space-y-3">
                      <button
                        className="px-4 py-2 rounded font-medium"
                        style={{
                          backgroundColor: localDesignSystem.colors.primary,
                          color: 'white',
                          borderRadius: localDesignSystem.borderRadius === 'none' ? '0' :
                                      localDesignSystem.borderRadius === 'sm' ? '4px' :
                                      localDesignSystem.borderRadius === 'md' ? '8px' :
                                      localDesignSystem.borderRadius === 'lg' ? '12px' : '16px'
                        }}
                      >
                        Primary Button
                      </button>
                      
                      <div 
                        className="p-4 border"
                        style={{
                          borderColor: localDesignSystem.colors.primary,
                          borderRadius: localDesignSystem.borderRadius === 'none' ? '0' :
                                      localDesignSystem.borderRadius === 'sm' ? '4px' :
                                      localDesignSystem.borderRadius === 'md' ? '8px' :
                                      localDesignSystem.borderRadius === 'lg' ? '12px' : '16px'
                        }}
                      >
                        <h4 className="font-semibold mb-2" style={{ color: localDesignSystem.colors.text }}>
                          Card Component
                        </h4>
                        <p className="text-sm" style={{ color: localDesignSystem.colors.text, opacity: 0.7 }}>
                          This is how cards will appear in your application.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Export CSS Variables</h4>
                    <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto">
{`:root {
  --primary: ${localDesignSystem.colors.primary};
  --background: ${localDesignSystem.colors.background};
  --text: ${localDesignSystem.colors.text};
  --font-family: ${localDesignSystem.typography.fontFamily};
  --type-scale: ${localDesignSystem.typography.scale};
  --border-radius: ${localDesignSystem.borderRadius};
  --spacing: ${localDesignSystem.spacing};
}`}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(`:root {
  --primary: ${localDesignSystem.colors.primary};
  --background: ${localDesignSystem.colors.background};
  --text: ${localDesignSystem.colors.text};
  --font-family: ${localDesignSystem.typography.fontFamily};
  --type-scale: ${localDesignSystem.typography.scale};
  --border-radius: ${localDesignSystem.borderRadius};
  --spacing: ${localDesignSystem.spacing};
}`)}
                      className="mt-2 text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy CSS</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  onClick={() => setLocalDesignSystem(currentProject?.designSystem || localDesignSystem)}
                  className="flex-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={applyChanges}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply Changes</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};