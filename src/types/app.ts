export interface AppProject {
  id: string;
  name: string;
  description: string;
  designSystem: DesignSystem;
  screens: Screen[];
  journeys: UserJourney[];
  features: FeatureInstance[];
  aiContext: AIContext;
  lastModified: Date;
}

export interface DesignSystem {
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

export interface Screen {
  id: string;
  name: string;
  type: 'screen' | 'modal' | 'flow';
  position: { x: number; y: number };
  size: { width: number; height: number };
  connections: Connection[];
  content?: ScreenContent;
  states: ScreenState[];
}

export interface Connection {
  from: string;
  to: string;
  type: 'navigation' | 'action' | 'data';
  label?: string;
}

export interface UserJourney {
  id: string;
  name: string;
  screens: string[];
  description?: string;
}

export interface FeatureInstance {
  id: string;
  templateId: string;
  name: string;
  screens: string[];
  configuration: Record<string, any>;
}

export interface AIContext {
  analysisHistory: AIAnalysis[];
  suggestedNextSteps: NextStep[];
  completionStatus: {
    designSystem: boolean;
    coreFlows: boolean;
    authentication: boolean;
    dataModels: boolean;
  };
  userPreferences: {
    complexity: 'simple' | 'moderate' | 'advanced';
    platform: 'mobile' | 'desktop' | 'both';
    industry: string;
  };
}

export interface ScreenContent {
  // Add screen content properties as needed
  [key: string]: any;
}

export interface ScreenState {
  name: string;
  isDefault?: boolean;
}

export interface AIAnalysis {
  timestamp: Date;
  projectSnapshot: any;
  gaps: Gap[];
  suggestions: Suggestion[];
  nextSteps: NextStep[];
  confidence: number;
}

export interface Gap {
  type: 'missing_screen' | 'broken_flow' | 'design_inconsistency' | 'missing_feature';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestedFix: string;
  autoFixAvailable: boolean;
}

export interface Suggestion {
  title: string;
  description: string;
  modifications?: ProjectModification[];
}

export interface NextStep {
  id: string;
  title: string;
  description: string;
  priority: number;
  category: 'design' | 'content' | 'features' | 'flows';
  action: 'add_screen' | 'modify_design' | 'add_feature' | 'ask_question';
  buttonText: string;
  autoExecutable: boolean;
}

export interface ProjectModification {
  type: 'add_screen' | 'update_design_system' | 'add_feature' | 'modify_flow';
  target: string;
  changes: any;
  previewable: boolean;
}