import { AppProject, Screen, FeatureInstance } from '../types/app';

export class ExportService {
  generateExportFiles(project: AppProject): Record<string, string> {
    const files: Record<string, string> = {
      '1-project-overview.md': this.generateProjectOverview(project),
      '2-user-journeys.md': this.generateUserJourneys(project),
      '3-screens-and-flows.md': this.generateScreensAndFlows(project),
      '4-features-and-components.md': this.generateFeaturesAndComponents(project),
      '5-design-system.md': this.generateDesignSystem(project),
    };
    
    return files;
  }
  
  private generateProjectOverview(project: AppProject): string {
    const overview = `# Project Overview: ${project.name}

## Project Description
${project.description || 'A modern web application built with React and TypeScript.'}

## Key Statistics
- Total Screens: ${project.screens.length}
- Total Features: ${project.features.length}
- User Journeys: ${project.journeys.length}
- Last Modified: ${new Date(project.lastModified).toLocaleDateString()}

## Technology Stack
- Frontend: React 18 with TypeScript
- State Management: Zustand
- Styling: Tailwind CSS
- Animation: Framer Motion
- Build Tool: Create React App
- Package Manager: npm

## Project Structure
\`\`\`
${project.name}/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── features/       # Feature modules
│   ├── services/       # Business logic and API
│   ├── stores/         # State management
│   ├── types/          # TypeScript definitions
│   └── utils/          # Helper functions
├── public/             # Static assets
└── package.json        # Dependencies
\`\`\`

## Core Concepts
1. **Component-Based Architecture**: Every UI element is a reusable component
2. **Type Safety**: Full TypeScript coverage for reliability
3. **State Management**: Centralized state with Zustand stores
4. **Responsive Design**: Mobile-first approach with Tailwind CSS
5. **Performance**: Optimized with React best practices

## Getting Started
\`\`\`bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
\`\`\`

## Development Guidelines
- Use functional components with hooks
- Implement proper TypeScript types
- Follow the established component structure
- Write clean, self-documenting code
- Use semantic HTML and accessibility best practices
`;
    
    return overview;
  }
  
  private generateUserJourneys(project: AppProject): string {
    let content = `# User Journeys

## Overview
This document describes the key user journeys through the ${project.name} application. Each journey represents a complete user flow from entry to goal completion.

`;
    
    project.journeys.forEach((journey, index) => {
      const screens = journey.screens.map(id => 
        project.screens.find(s => s.id === id)
      ).filter(Boolean) as Screen[];
      
      content += `## Journey ${index + 1}: ${journey.name}

### Description
${journey.description || 'User journey through the application'}

### Flow Diagram
\`\`\`mermaid
graph LR
`;
      
      screens.forEach((screen, idx) => {
        if (idx > 0) {
          content += `    ${screens[idx - 1].name.replace(/\s+/g, '')} --> ${screen.name.replace(/\s+/g, '')}\n`;
        }
      });
      
      content += `\`\`\`

### Screens in Journey
`;
      
      screens.forEach((screen, idx) => {
        content += `
${idx + 1}. **${screen.name}**
   - Purpose: ${this.getScreenPurpose(screen)}
   - Key Actions: ${this.getScreenActions(screen, project)}
   - Next Steps: ${this.getNextSteps(screen, screens[idx + 1])}
`;
      });
      
      content += '\n---\n\n';
    });
    
    return content;
  }
  
  private generateScreensAndFlows(project: AppProject): string {
    let content = `# Screens and Navigation Flows

## Screen Inventory
Total Screens: ${project.screens.length}

`;
    
    // Group screens by type
    const screensByType = this.groupScreensByType(project.screens);
    
    Object.entries(screensByType).forEach(([type, screens]) => {
      content += `### ${this.formatScreenType(type)} Screens (${screens.length})
`;
      
      screens.forEach(screen => {
        content += `
#### ${screen.name}
- **ID**: ${screen.id}
- **Type**: ${screen.type}
- **Position**: (${screen.position.x}, ${screen.position.y})
- **States**: ${screen.states.map(s => s.name).join(', ')}

**Connections:**
`;
        
        if (screen.connections.length > 0) {
          screen.connections.forEach(conn => {
            const targetScreen = project.screens.find(s => s.id === conn.to);
            content += `- → ${targetScreen?.name || 'Unknown'} (${conn.type})\n`;
          });
        } else {
          content += `- No outgoing connections\n`;
        }
        
        const incomingConnections = project.screens.filter(s => 
          s.connections.some(c => c.to === screen.id)
        );
        
        if (incomingConnections.length > 0) {
          content += `\n**Incoming from:**\n`;
          incomingConnections.forEach(source => {
            content += `- ← ${source.name}\n`;
          });
        }
        
        content += '\n';
      });
    });
    
    // Navigation Matrix
    content += `## Navigation Matrix

\`\`\`mermaid
graph TD
`;
    
    project.screens.forEach(screen => {
      screen.connections.forEach(conn => {
        const target = project.screens.find(s => s.id === conn.to);
        if (target) {
          content += `    ${screen.name.replace(/\s+/g, '')} --> ${target.name.replace(/\s+/g, '')}\n`;
        }
      });
    });
    
    content += `\`\`\`

## Screen Implementation Templates

`;
    
    // Generate basic component templates
    project.screens.forEach(screen => {
      content += `### ${screen.name} Component

\`\`\`typescript
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ${screen.name.replace(/\s+/g, '')}Screen: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="screen ${screen.type}-screen">
      <h1>${screen.name}</h1>
      {/* TODO: Implement ${screen.name} UI */}
    </div>
  );
};
\`\`\`

`;
    });
    
    return content;
  }
  
  private generateFeaturesAndComponents(project: AppProject): string {
    let content = `# Features and Components

## Feature Inventory
Total Features: ${project.features.length}

`;
    
    // Group features by screen
    const featuresByScreen = this.groupFeaturesByScreen(project.features, project.screens);
    
    Object.entries(featuresByScreen).forEach(([screenName, features]) => {
      content += `## ${screenName}

`;
      
      features.forEach(feature => {
        content += `### ${feature.name}
- **Template ID**: ${feature.templateId}
- **Configuration**: ${JSON.stringify(feature.configuration, null, 2)}

**Implementation:**
\`\`\`typescript
// ${feature.name} Component
${this.generateFeatureTemplate(feature)}
\`\`\`

`;
      });
    });
    
    // Shared Components
    content += `## Shared Components

### Button Component
\`\`\`typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  onClick,
  disabled,
  children
}) => {
  return (
    <button
      className={\`btn btn-\${variant} btn-\${size}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
\`\`\`

### Input Component
\`\`\`typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  error
}) => {
  return (
    <div className="input-wrapper">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={\`input \${error ? 'input-error' : ''}\`}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
\`\`\`

### Card Component
\`\`\`typescript
interface CardProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, actions }) => {
  return (
    <div className="card">
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">{children}</div>
      {actions && <div className="card-actions">{actions}</div>}
    </div>
  );
};
\`\`\`
`;
    
    return content;
  }
  
  private generateDesignSystem(project: AppProject): string {
    const content = `# Design System

## Color Palette

### Primary Colors
\`\`\`css
:root {
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;
}
\`\`\`

### Neutral Colors
\`\`\`css
:root {
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
}
\`\`\`

### Semantic Colors
\`\`\`css
:root {
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
\`\`\`

## Typography

### Font Family
\`\`\`css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
\`\`\`

### Font Sizes
\`\`\`css
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
\`\`\`

## Spacing System

\`\`\`css
/* Spacing scale (rem) */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
\`\`\`

## Component Styles

### Buttons
\`\`\`css
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700;
  @apply focus:ring-primary-500;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-900 hover:bg-gray-300;
  @apply focus:ring-gray-500;
}

.btn-ghost {
  @apply bg-transparent text-gray-700 hover:bg-gray-100;
  @apply focus:ring-gray-500;
}
\`\`\`

### Forms
\`\`\`css
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500;
  @apply focus:border-transparent;
}

.input-error {
  @apply border-red-500 focus:ring-red-500;
}

.label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
\`\`\`

### Cards
\`\`\`css
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
  @apply p-6;
}

.card-title {
  @apply text-lg font-semibold text-gray-900 mb-4;
}

.card-content {
  @apply text-gray-600;
}
\`\`\`

## Layout System

### Container
\`\`\`css
.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}
\`\`\`

### Grid
\`\`\`css
.grid {
  @apply grid gap-4;
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
\`\`\`

### Flexbox
\`\`\`css
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.space-x-4 > * + * { margin-left: 1rem; }
.space-y-4 > * + * { margin-top: 1rem; }
\`\`\`

## Animation Guidelines

### Transitions
\`\`\`css
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
\`\`\`

### Hover Effects
\`\`\`css
.hover\\:scale-105:hover {
  transform: scale(1.05);
}

.hover\\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
\`\`\`

## Accessibility Guidelines

1. **Color Contrast**: Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
2. **Focus Indicators**: Always visible and high contrast
3. **Keyboard Navigation**: All interactive elements must be keyboard accessible
4. **Screen Readers**: Use semantic HTML and ARIA labels where needed
5. **Motion**: Respect prefers-reduced-motion preference

## Implementation Notes

- Use Tailwind CSS utility classes for styling
- Extend the theme in tailwind.config.js for custom values
- Create component classes for frequently used patterns
- Maintain consistency across all screens and components
- Test on multiple devices and screen sizes
`;
    
    return content;
  }
  
  // Helper methods
  private groupScreensByType(screens: Screen[]): Record<string, Screen[]> {
    return screens.reduce((acc, screen) => {
      const type = screen.type || 'default';
      if (!acc[type]) acc[type] = [];
      acc[type].push(screen);
      return acc;
    }, {} as Record<string, Screen[]>);
  }
  
  private formatScreenType(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
  
  private getScreenPurpose(screen: Screen): string {
    const purposes: Record<string, string> = {
      auth: 'User authentication and account access',
      home: 'Main entry point and navigation hub',
      profile: 'User account management and settings',
      dashboard: 'Data visualization and metrics overview',
      settings: 'Application configuration and preferences',
      shop: 'Product browsing and purchase flows',
      screen: 'General application screen'
    };
    
    return purposes[screen.type] || 'Application screen';
  }
  
  private getScreenActions(screen: Screen, project: AppProject): string {
    const features = project.features.filter(f => f.screens.includes(screen.id));
    
    if (features.length === 0) return 'Navigate to other screens';
    
    return features.map(f => f.name).join(', ');
  }
  
  private getNextSteps(screen: Screen, nextScreen?: Screen): string {
    if (nextScreen) {
      return `Navigate to ${nextScreen.name}`;
    }
    
    if (screen.connections.length > 0) {
      return 'Multiple navigation options available';
    }
    
    return 'End of journey or return to previous screen';
  }
  
  private groupFeaturesByScreen(features: FeatureInstance[], screens: Screen[]): Record<string, FeatureInstance[]> {
    const grouped: Record<string, FeatureInstance[]> = {
      'Shared Features': []
    };
    
    features.forEach(feature => {
      if (feature.screens && feature.screens.length > 0) {
        feature.screens.forEach(screenId => {
          const screen = screens.find(s => s.id === screenId);
          const screenName = screen?.name || 'Unknown Screen';
          
          if (!grouped[screenName]) grouped[screenName] = [];
          grouped[screenName].push(feature);
        });
      } else {
        grouped['Shared Features'].push(feature);
      }
    });
    
    // Remove empty groups
    Object.keys(grouped).forEach(key => {
      if (grouped[key].length === 0) delete grouped[key];
    });
    
    return grouped;
  }
  
  private generateFeatureTemplate(feature: FeatureInstance): string {
    const templates: Record<string, string> = {
      navigation: `const ${feature.name}Navigation = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  return (
    <nav className="navigation">
      {/* Navigation items */}
    </nav>
  );
};`,
      
      form: `const ${feature.name}Form = () => {
  const [formData, setFormData] = useState({
    // Form fields
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};`,
      
      data: `const ${feature.name}Data = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch data
  }, []);
  
  return (
    <div className="data-display">
      {loading ? <Spinner /> : <DataList items={data} />}
    </div>
  );
};`,
      
      interaction: `const ${feature.name}Interaction = () => {
  const [state, setState] = useState(false);
  
  const handleInteraction = () => {
    setState(!state);
    // Handle interaction
  };
  
  return (
    <button onClick={handleInteraction}>
      {state ? 'Active' : 'Inactive'}
    </button>
  );
};`
    };
    
    // Map templateId to feature type
    const typeMap: Record<string, string> = {
      'auth-basic': 'form',
      'search-basic': 'interaction',
      'profile-basic': 'data',
      'social-feed': 'data',
      'chat-basic': 'interaction',
      'cart-basic': 'data'
    };
    
    const type = typeMap[feature.templateId] || 'interaction';
    return templates[type] || templates.interaction;
  }
}