import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useAppStore } from '../../stores/appStore';
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import { QuickActions } from './QuickActions';
import { AIService } from '../../services/aiService';
import { NextStep } from '../../types/app';
import { ChatMessage } from '../../types/ai';

export const AIChat: React.FC = () => {
  const { messages, isOpen, toggleChat, addMessage } = useChatStore();
  const { currentProject, updateProject } = useAppStore();
  const [input, setInput] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiService = useRef(new AIService());
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const executeStep = React.useCallback(async (step: NextStep) => {
    if (!currentProject) return;
    
    const modifications = await aiService.current.generateModifications(step, currentProject);
    
    // Apply modifications to project
    modifications.forEach(mod => {
      if (mod.type === 'add_screen') {
        // Add screen logic
      } else if (mod.type === 'update_design_system') {
        updateProject({
          designSystem: { ...currentProject.designSystem, ...mod.changes }
        });
      }
    });
    
    addMessage({
      id: Date.now().toString(),
      type: 'assistant',
      content: `✅ ${step.title} completed!`,
      timestamp: new Date()
    });
  }, [currentProject, updateProject, addMessage]);
  
  const analyzeProject = React.useCallback(async () => {
    if (!currentProject) return;
    
    const analysis = await aiService.current.analyzeProject(currentProject);
    
    if (analysis.suggestions.length > 0) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: analysis.suggestions[0].description,
        timestamp: new Date(),
        quickActions: analysis.nextSteps.slice(0, 3).map((step: NextStep) => ({
          text: step.buttonText,
          action: () => executeStep(step)
        }))
      };
      
      addMessage(message);
    }
  }, [currentProject, addMessage, executeStep]);
  
  useEffect(() => {
    if (currentProject) {
      analyzeProject();
    }
  }, [currentProject, analyzeProject]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col z-50"
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <button
              onClick={toggleChat}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <ChatMessageComponent key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <QuickActions />
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && input.trim()) {
                    // Handle send message
                  }
                }}
              />
              <button className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};