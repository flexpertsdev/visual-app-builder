import React from 'react';
import { UserJourney, Screen } from '../../types/app';

interface JourneyOverlayProps {
  journeys: UserJourney[];
  screens: Screen[];
}

const JOURNEY_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500'
];

export const JourneyOverlay: React.FC<JourneyOverlayProps> = ({ journeys, screens }) => {
  const getScreenPosition = (screenId: string) => {
    const screen = screens.find(s => s.id === screenId);
    return screen ? screen.position : { x: 0, y: 0 };
  };

  const getJourneyPath = (journey: UserJourney) => {
    const points = journey.screens
      .map(screenId => getScreenPosition(screenId))
      .filter(pos => pos.x !== 0 || pos.y !== 0);
    
    if (points.length < 2) return '';
    
    // Create a smooth curve through all points
    let path = `M ${points[0].x + 128} ${points[0].y + 48}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2 + 128;
      const cpy = (prev.y + curr.y) / 2 + 48;
      
      path += ` Q ${cpx} ${cpy}, ${curr.x + 128} ${curr.y + 48}`;
    }
    
    return path;
  };

  return (
    <svg 
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    >
      {journeys.map((journey, index) => {
        const color = JOURNEY_COLORS[index % JOURNEY_COLORS.length];
        const path = getJourneyPath(journey);
        
        if (!path) return null;
        
        return (
          <g key={journey.id}>
            {/* Journey path */}
            <path
              d={path}
              stroke={color.replace('bg-', '#').replace('-500', '')}
              strokeWidth="8"
              strokeOpacity="0.3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Journey name label */}
            <text
              x={getScreenPosition(journey.screens[0]).x + 128}
              y={getScreenPosition(journey.screens[0]).y - 10}
              className="text-lg font-semibold"
              fill={color.replace('bg-', '#').replace('-500', '')}
              textAnchor="middle"
            >
              {journey.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};