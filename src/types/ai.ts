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

export interface Suggestion {
  title: string;
  description: string;
  modifications?: ProjectModification[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  quickActions?: QuickAction[];
  modifications?: ProjectModification[];
}

export interface QuickAction {
  text: string;
  action: () => void;
}

export interface ProjectModification {
  type: 'add_screen' | 'update_design_system' | 'add_feature' | 'modify_flow';
  target: string;
  changes: any;
  previewable: boolean;
}

export interface AIQuestion {
  id: string;
  question: string;
  context: string;
  responseType: 'single_choice' | 'multiple_choice' | 'text' | 'confirmation';
  options?: QuestionOption[];
  followUp?: AIQuestion[];
}

export interface QuestionOption {
  id: string;
  text: string;
  description?: string;
  icon?: string;
  consequence: ProjectModification[];
}