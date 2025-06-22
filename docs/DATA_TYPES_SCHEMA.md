# Visual App Builder - Data Types Schema Documentation

## Overview

This document describes the data types and schema used in the Visual App Builder application, including how the AI chat integrates with the visual canvas.

## Core Data Types

### 1. AppProject
The main container for an entire application project.

```typescript
interface AppProject {
  id: string;
  name: string;
  description: string;
  designSystem: DesignSystem;
  screens: Screen[];
  journeys: UserJourney[];
  features: FeatureInstance[];
  aiContext: AIContext;
  lastModified: Date;
  updatedAt?: Date;
  starred?: boolean;
}
```

### 2. Screen
Represents a single screen/page in the application.

```typescript
interface Screen {
  id: string;
  name: string;
  type: 'screen' | 'modal' | 'flow';
  position: { x: number; y: number };  // Canvas position
  size: { width: number; height: number };
  connections: Connection[];  // Links to other screens
  content?: ScreenContent;    // Future: actual UI elements
  states: ScreenState[];      // Different states (e.g., loading, error)
}
```

### 3. Connection
Defines navigation between screens.

```typescript
interface Connection {
  from: string;    // Source screen ID
  to: string;      // Target screen ID
  type: 'navigation' | 'action' | 'data';
  label?: string;  // Display text for the connection
}
```

### 4. UserJourney
Groups screens into logical user flows.

```typescript
interface UserJourney {
  id: string;
  name: string;
  screens: string[];  // Array of screen IDs
  description?: string;
}
```

### 5. DesignSystem
Global design settings for the project.

```typescript
interface DesignSystem {
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
    background: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    scale: 'compact' | 'normal' | 'spacious';
  };
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  spacing: 'tight' | 'normal' | 'relaxed';
}
```

## AI Integration

### How AI Chat Works with Canvas

1. **Natural Language Processing**: Users can type commands like:
   - "Add a login screen"
   - "Create a dashboard"
   - "Change the primary color to blue"
   - "Connect the login screen to the home screen"

2. **AI Service Flow**:
   ```
   User Input → AI Service → Project Modifications → Canvas Update
   ```

3. **Modification Types**:
   ```typescript
   type ProjectModification = {
     type: 'add_screen' | 'update_screen' | 'update_design_system' | 'add_feature';
     target?: string;  // ID of element to modify
     changes: any;     // Specific changes to apply
     previewable: boolean;
   }
   ```

### AI Response Format

When processing user requests, the AI returns:

```typescript
interface ProcessUserRequestResponse {
  message: string;                    // Friendly explanation
  modifications?: ProjectModification[];  // Changes to apply
  nextSteps?: NextStep[];            // Suggested follow-up actions
}
```

### Example AI Interactions

1. **Adding Authentication**:
   - User: "Add login functionality"
   - AI creates: Login screen, Sign Up screen, Password Reset screen
   - Automatically positions them on canvas
   - Creates connections between screens

2. **Updating Design**:
   - User: "Make the app use a blue theme"
   - AI updates: Primary color in design system
   - All screens inherit the new color

## Multi-Level Zoom Architecture (Planned)

### Level 1: Screen Detail (Highest Zoom)
- Full interactive HTML wireframe
- Screen-specific features and components
- Related data stores and queries
- Individual screen AI chat context

### Level 2: User Journey View
- Series of connected screens
- Flow visualization
- Journey-specific actions

### Level 3: Feature View
- Groups of related journeys
- Feature boundaries
- Cross-feature connections

### Level 4: App Overview (Lowest Zoom)
- All screens in grid layout
- Grouped by features
- High-level app architecture

## State Management

### Canvas State
```typescript
interface CanvasState {
  zoom: number;
  panOffset: { x: number; y: number };
  selectedScreenId: string | null;
  isAddMode: boolean;
  isDragging: boolean;
}
```

### Chat State
```typescript
interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isProcessing: boolean;
}
```

## Data Flow

1. **User Action** → Update Store → Re-render Components
2. **AI Command** → Generate Modifications → Apply to Store → Update Canvas
3. **Canvas Interaction** → Update Screen Positions → Save to LocalStorage

## Persistence

All project data is saved to browser LocalStorage:
- Projects are stored with unique IDs
- Auto-save on every change
- Current project ID tracked separately

## Future Enhancements

1. **Screen Content**:
   - Actual UI components (buttons, forms, etc.)
   - Component properties and styling
   - Event handlers and interactions

2. **Data Models**:
   - Define data structures
   - API endpoints
   - Database queries

3. **Code Generation**:
   - Export to React/Vue/Angular
   - Generate backend APIs
   - Create database schemas