import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from './UI/Button';
import { useAppStore } from '../stores/appStore';

export const WelcomeScreen: React.FC = () => {
  const [input, setInput] = useState('');
  const { createProject } = useAppStore();
  
  const examples = [
    "WhatsApp but red",
    "Instagram for food photos",
    "Notion for team tasks",
    "Airbnb for co-working spaces"
  ];
  
  const handleCreate = () => {
    if (input.trim()) {
      createProject('New App', input);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Design Apps Visually
          </h1>
          <p className="text-xl text-gray-600">
            with AI Guidance
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-primary-600" />
            Describe Your App Idea
          </h2>
          
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setInput(example)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your app in simple terms..."
              className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
          
          <Button
            onClick={handleCreate}
            size="lg"
            className="w-full"
            icon={Sparkles}
          >
            Generate App
          </Button>
        </div>
      </motion.div>
    </div>
  );
};