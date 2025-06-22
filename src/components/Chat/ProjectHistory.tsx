import React from 'react';
import { Clock, FileText, Layout, Package, Settings } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';

interface HistoryItem {
  id: string;
  type: 'screen' | 'feature' | 'design' | 'project';
  action: string;
  timestamp: Date;
  details: string;
  icon: React.ElementType;
}

export const ProjectHistory: React.FC = () => {
  const { currentProject } = useAppStore();
  
  // Mock history items - in a real app, this would come from a history store
  const historyItems: HistoryItem[] = [
    {
      id: '1',
      type: 'screen',
      action: 'Added Login Screen',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      details: 'Created authentication flow with email and password fields',
      icon: Layout
    },
    {
      id: '2',
      type: 'feature',
      action: 'Added Search Feature',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      details: 'Implemented global search functionality',
      icon: Package
    },
    {
      id: '3',
      type: 'design',
      action: 'Updated Color Scheme',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      details: 'Changed primary color to match brand guidelines',
      icon: Settings
    },
    {
      id: '4',
      type: 'project',
      action: 'Project Created',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      details: `Started "${currentProject?.name || 'New Project'}" with AI assistance`,
      icon: FileText
    }
  ];
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'screen': return 'bg-blue-100 text-blue-700';
      case 'feature': return 'bg-green-100 text-green-700';
      case 'design': return 'bg-purple-100 text-purple-700';
      case 'project': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {historyItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(item.type)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{item.action}</h4>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          View Full History
        </button>
      </div>
    </div>
  );
};