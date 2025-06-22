import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronLeft, ChevronRight, Brain, History, Sparkles } from 'lucide-react';
import { AIChat } from '../Chat/AIChat';
import { ProjectHistory } from '../Chat/ProjectHistory';
import { AISuggestions } from '../Chat/AISuggestions';

export const LeftPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'history' | 'suggestions'>('chat');
  
  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'history', label: 'History', icon: History },
    { id: 'suggestions', label: 'AI Ideas', icon: Sparkles }
  ];
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-16 bottom-0 w-80 bg-white border-r border-gray-200 shadow-lg z-30 flex flex-col"
      >
        {/* Toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-10 top-6 bg-white border border-gray-200 rounded-r-lg p-2 hover:bg-gray-50 transition-colors shadow-md"
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        
        {/* Header with tabs */}
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between p-4 pb-0">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold text-gray-900">AI Assistant</h2>
            </div>
          </div>
          
          <div className="flex space-x-1 px-4 mt-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-t-lg text-sm font-medium transition-colors
                    ${activeTab === tab.id 
                      ? 'bg-gray-100 text-gray-900 border-b-2 border-primary-600' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chat' && <AIChat inPanel />}
          {activeTab === 'history' && <ProjectHistory />}
          {activeTab === 'suggestions' && <AISuggestions />}
        </div>
      </motion.div>
      
      {/* Floating toggle when closed */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-20 bg-primary-600 text-white p-3 rounded-lg shadow-lg hover:bg-primary-700 transition-colors z-30"
        >
          <MessageSquare className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};