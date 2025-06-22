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

interface AIChatProps {
  inPanel?: boolean;
}

export const AIChat: React.FC<AIChatProps> = ({ inPanel = false }) => {
  const { messages, isOpen, toggleChat, addMessage } = useChatStore();
  const { currentProject, updateProject, addScreen, updateScreen } = useAppStore();
  const [input, setInput] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiService = useRef(AIService.getInstance());
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Ensure AI service is initialized with latest API key
    aiService.current.initialize();
  }, []);
  
  const executeStep = React.useCallback(async (step: NextStep) => {
    if (!currentProject) return;
    
    setIsProcessing(true);
    const modifications = await aiService.current.generateModifications(step, currentProject);
    
    // Apply modifications to project
    modifications.forEach(mod => {
      if (mod.type === 'add_screen') {
        const newScreen = {
          id: mod.changes.id || `screen-${Date.now()}`,
          name: mod.changes.name || 'New Screen',
          type: mod.changes.type || 'default',
          position: mod.changes.position || { x: 100 + Math.random() * 300, y: 100 + Math.random() * 200 },
          connections: mod.changes.connections || [],
          size: mod.changes.size || { width: 256, height: 384 },
          states: mod.changes.states || [{ name: 'default', isDefault: true }]
        };
        addScreen(newScreen);
        
        // Add screen to journey if specified
        if (mod.changes.journeyId && currentProject) {
          const journey = currentProject.journeys.find(j => j.id === mod.changes.journeyId);
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
      }
      
      if (mod.type === 'update_screen') {
        if (mod.target) {
          updateScreen(mod.target, mod.changes);
        }
      }
      
      if (mod.type === 'update_design_system') {
        updateProject({
          designSystem: { ...currentProject.designSystem, ...mod.changes }
        });
      }
      
      if (mod.type === 'add_feature') {
        // Features are managed separately, not as part of screens
        // TODO: Implement feature addition logic
      }
    });
    
    setIsProcessing(false);
    addMessage({
      id: Date.now().toString(),
      type: 'assistant',
      content: `✅ ${step.title} completed!`,
      timestamp: new Date()
    });
  }, [currentProject, updateProject, addMessage, addScreen, updateScreen]);
  
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
  
  const handleSendMessage = React.useCallback(async () => {
    if (!input.trim() || !currentProject || isProcessing) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    
    addMessage(userMessage);
    setInput('');
    setIsProcessing(true);
    
    try {
      // Process natural language input
      const response = await aiService.current.processUserRequest(input, currentProject);
      
      // Add AI response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.message,
        timestamp: new Date()
      };
      
      if (response.modifications && response.modifications.length > 0) {
        // Apply modifications
        response.modifications.forEach(mod => {
          if (mod.type === 'add_screen') {
            const newScreen = {
              id: mod.changes.id || `screen-${Date.now()}`,
              name: mod.changes.name || 'New Screen',
              type: mod.changes.type || 'default',
              position: mod.changes.position || { x: 100 + Math.random() * 300, y: 100 + Math.random() * 200 },
                  connections: mod.changes.connections || [],
              size: mod.changes.size || { width: 256, height: 384 },
              states: mod.changes.states || [{ name: 'default', isDefault: true }]
            };
            addScreen(newScreen);
            
            // Add screen to journey if specified
            if (mod.changes.journeyId && currentProject) {
              const journey = currentProject.journeys.find(j => j.id === mod.changes.journeyId);
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
          }
          
          if (mod.type === 'update_screen') {
            if (mod.target) {
              updateScreen(mod.target, mod.changes);
            }
          }
          
          if (mod.type === 'update_design_system') {
            updateProject({
              designSystem: { ...currentProject.designSystem, ...mod.changes }
            });
          }
        });
        
        // Add quick actions if available
        if (response.nextSteps && response.nextSteps.length > 0) {
          aiMessage.quickActions = response.nextSteps.slice(0, 3).map(step => ({
            text: step.buttonText,
            action: () => executeStep(step)
          }));
        }
      }
      
      addMessage(aiMessage);
    } catch (error) {
      console.error('Error processing message:', error);
      addMessage({
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      });
    } finally {
      setIsProcessing(false);
    }
  }, [input, currentProject, isProcessing, addMessage, addScreen, updateScreen, updateProject, executeStep]);
  
  if (inPanel) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <ChatMessageComponent key={message.id} message={message} />
          ))}
          {isProcessing && (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="animate-pulse">AI is thinking...</div>
            </div>
          )}
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
                  handleSendMessage();
                }
              }}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!input.trim()}
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
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
            {isProcessing && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="animate-pulse">AI is thinking...</div>
              </div>
            )}
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
                    handleSendMessage();
                  }
                }}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};