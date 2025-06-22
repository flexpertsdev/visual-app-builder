import React from 'react';
import { Plus, Palette, Navigation, Database } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const actions = [
    { icon: Plus, label: 'Add Screen', action: () => console.log('Add Screen') },
    { icon: Palette, label: 'Update Design', action: () => console.log('Update Design') },
    { icon: Navigation, label: 'Add Flow', action: () => console.log('Add Flow') },
    { icon: Database, label: 'Add Feature', action: () => console.log('Add Feature') },
  ];

  return (
    <div className="p-2 border-t border-gray-200">
      <div className="text-xs text-gray-500 mb-2">Quick Actions</div>
      <div className="grid grid-cols-4 gap-1">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="p-2 flex flex-col items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <action.icon className="w-4 h-4 text-gray-600 mb-1" />
            <span className="text-xs text-gray-600">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};