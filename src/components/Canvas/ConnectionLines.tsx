import React from 'react';
import { Screen } from '../../types/app';

interface ConnectionLinesProps {
  screens: Screen[];
}

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({ screens }) => {
  const getScreenCenter = (screen: Screen) => {
    const size = screen.size || { width: 256, height: 384 };
    return {
      x: screen.position.x + size.width / 2,
      y: screen.position.y + size.height / 2
    };
  };

  const getCurvedPath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const offsetX = dx * 0.3;
    const offsetY = dy * 0.3;
    
    return `M ${from.x} ${from.y} Q ${from.x + offsetX} ${from.y + offsetY}, ${to.x} ${to.y}`;
  };

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#9ca3af"
          />
        </marker>
      </defs>
      
      {screens.map(screen => 
        screen.connections.map((connection, index) => {
          const toScreen = screens.find(s => s.id === connection.to);
          if (!toScreen) return null;
          
          const from = getScreenCenter(screen);
          const to = getScreenCenter(toScreen);
          
          return (
            <g key={`${screen.id}-${connection.to}-${index}`}>
              <path
                d={getCurvedPath(from, to)}
                stroke="#9ca3af"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowhead)"
                className="transition-all hover:stroke-primary-500"
              />
              {connection.label && (
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {connection.label}
                </text>
              )}
            </g>
          );
        })
      )}
    </svg>
  );
};