import React, { useState } from 'react';
import { Sparkles, TrendingUp, Zap, Users, Shield, Gauge, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { motion } from 'framer-motion';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'performance' | 'ux' | 'feature' | 'security';
  icon: React.ElementType;
  action: () => void;
}

export const AISuggestions: React.FC = () => {
  const { addScreen } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const suggestions: Suggestion[] = [
    {
      id: '1',
      title: 'Add User Dashboard',
      description: 'Users need a central place to view their data and activity. A dashboard would improve engagement.',
      impact: 'high',
      category: 'feature',
      icon: TrendingUp,
      action: () => {
        addScreen({
          id: `screen-${Date.now()}`,
          name: 'Dashboard',
          type: 'screen',
          position: { x: 400, y: 200 },
          size: { width: 256, height: 384 },
          connections: [],
          states: [{ name: 'default', isDefault: true }]
        });
      }
    },
    {
      id: '2',
      title: 'Implement Loading States',
      description: 'Add skeleton screens and loading indicators to improve perceived performance.',
      impact: 'medium',
      category: 'ux',
      icon: Zap,
      action: () => console.log('Add loading states')
    },
    {
      id: '3',
      title: 'Add Multi-User Support',
      description: 'Enable collaboration features to allow teams to work together on projects.',
      impact: 'high',
      category: 'feature',
      icon: Users,
      action: () => console.log('Add collaboration')
    },
    {
      id: '4',
      title: 'Enhance Security',
      description: 'Implement two-factor authentication for better account security.',
      impact: 'high',
      category: 'security',
      icon: Shield,
      action: () => console.log('Add 2FA')
    },
    {
      id: '5',
      title: 'Optimize Performance',
      description: 'Lazy load screens and implement virtualization for better performance with large projects.',
      impact: 'medium',
      category: 'performance',
      icon: Gauge,
      action: () => console.log('Optimize performance')
    }
  ];
  
  const categories = [
    { id: 'all', label: 'All', count: suggestions.length },
    { id: 'feature', label: 'Features', count: suggestions.filter(s => s.category === 'feature').length },
    { id: 'ux', label: 'UX', count: suggestions.filter(s => s.category === 'ux').length },
    { id: 'security', label: 'Security', count: suggestions.filter(s => s.category === 'security').length },
    { id: 'performance', label: 'Performance', count: suggestions.filter(s => s.category === 'performance').length }
  ];
  
  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory);
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Category filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${selectedCategory === category.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>
      
      {/* Suggestions list */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredSuggestions.map((suggestion) => {
            const Icon = suggestion.icon;
            return (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer group"
                onClick={suggestion.action}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{suggestion.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(suggestion.impact)}`}>
                        {suggestion.impact} impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{suggestion.description}</p>
                    <div className="mt-2 flex items-center text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-medium">Apply suggestion</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-primary-50 to-purple-50">
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <Sparkles className="w-4 h-4 text-primary-600" />
          <span>AI analyzes your project continuously to provide relevant suggestions</span>
        </div>
      </div>
    </div>
  );
};