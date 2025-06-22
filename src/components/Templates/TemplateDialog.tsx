import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ShoppingBag, Users, CheckSquare, BarChart3, Gamepad, ArrowRight } from 'lucide-react';
import { projectTemplates, ProjectTemplate } from '../../services/projectTemplates';
import { useAppStore } from '../../stores/appStore';

interface TemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryIcons = {
  business: BarChart3,
  social: Users,
  ecommerce: ShoppingBag,
  productivity: CheckSquare,
  entertainment: Gamepad
};

export const TemplateDialog: React.FC<TemplateDialogProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const { createProject } = useAppStore();
  
  const categories = [
    { id: 'all', name: 'All Templates', count: projectTemplates.length },
    { id: 'business', name: 'Business', count: projectTemplates.filter(t => t.category === 'business').length },
    { id: 'social', name: 'Social', count: projectTemplates.filter(t => t.category === 'social').length },
    { id: 'ecommerce', name: 'E-Commerce', count: projectTemplates.filter(t => t.category === 'ecommerce').length },
    { id: 'productivity', name: 'Productivity', count: projectTemplates.filter(t => t.category === 'productivity').length },
    { id: 'entertainment', name: 'Entertainment', count: projectTemplates.filter(t => t.category === 'entertainment').length }
  ];
  
  const filteredTemplates = projectTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
  
  const handleUseTemplate = () => {
    if (!selectedTemplate) return;
    
    // Create project from template
    const newProject = {
      ...selectedTemplate.project,
      id: Date.now().toString(),
      name: selectedTemplate.project.name || selectedTemplate.name,
      description: selectedTemplate.project.description || selectedTemplate.description,
      designSystem: selectedTemplate.project.designSystem || {
        colors: {
          primary: '#2563eb',
          background: '#ffffff',
          text: '#111827'
        },
        typography: {
          fontFamily: 'Inter',
          scale: 'normal' as const
        },
        borderRadius: 'lg' as const,
        spacing: 'normal' as const
      },
      screens: selectedTemplate.project.screens || [],
      journeys: selectedTemplate.project.journeys || [],
      features: selectedTemplate.project.features || [],
      aiContext: {
        analysisHistory: [],
        suggestedNextSteps: [],
        completionStatus: {
          designSystem: true,
          coreFlows: true,
          authentication: false,
          dataModels: false
        },
        userPreferences: {
          complexity: 'simple' as const,
          platform: 'both' as const,
          industry: selectedTemplate.category
        }
      },
      lastModified: new Date()
    };
    
    createProject(newProject.name, newProject.description);
    
    // Apply template data
    const store = useAppStore.getState();
    if (store.currentProject) {
      store.updateProject(newProject);
    }
    
    onClose();
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
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-[900px] max-h-[80vh] z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold">Choose a Template</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Start with a pre-built template to jumpstart your project
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Search and Filters */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search templates..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex space-x-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${selectedCategory === category.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      {category.name}
                      {category.count > 0 && (
                        <span className="ml-1 text-xs opacity-70">({category.count})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Template Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-3 gap-4">
                {filteredTemplates.map(template => {
                  const Icon = categoryIcons[template.category];
                  const isSelected = selectedTemplate?.id === template.id;
                  
                  return (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTemplate(template)}
                      className={`
                        relative p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${isSelected
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                        }
                      `}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl">{template.thumbnail}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{template.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                          <div className="flex items-center mt-3 text-xs text-gray-500">
                            <Icon className="w-3 h-3 mr-1" />
                            <span>{template.category}</span>
                            <span className="mx-2">•</span>
                            <span>{template.project.screens?.length || 0} screens</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {template.tags.map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
              
              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No templates found matching your search.</p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {selectedTemplate ? (
                    <span>Selected: <strong>{selectedTemplate.name}</strong></span>
                  ) : (
                    <span>Select a template to get started</span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUseTemplate}
                    disabled={!selectedTemplate}
                    className={`
                      px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2
                      ${selectedTemplate
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};