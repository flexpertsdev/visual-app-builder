import OpenAI from 'openai';
import { AppProject, AIAnalysis, NextStep, ProjectModification } from '../types/app';

export class AIService {
  private openai: OpenAI | null = null;
  private isConfigured: boolean = false;
  
  constructor() {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    if (!apiKey || apiKey === 'your-openai-api-key') {
      console.warn('OpenAI API key not configured. AI features will be disabled.');
      console.warn('Add REACT_APP_OPENAI_API_KEY to your environment variables.');
      this.isConfigured = false;
    } else {
      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // For POC only - in production, use a backend proxy
      });
      this.isConfigured = true;
    }
  }
  
  async analyzeProject(project: AppProject): Promise<AIAnalysis> {
    if (!this.isConfigured || !this.openai) {
      return this.getMockAnalysis(project);
    }

    const prompt = `
    Analyze this app project and identify gaps, inconsistencies, and next steps:
    
    App Type: ${project.description}
    Current Screens: ${project.screens.map(s => s.name).join(', ')}
    Features: ${project.features.map(f => f.name).join(', ')}
    Design System: ${JSON.stringify(project.designSystem)}
    
    Return analysis in JSON format with:
    - gaps: array of {type, severity, description, suggestedFix, autoFixAvailable}
    - suggestions: array of {title, description, modifications}
    - nextSteps: array of {id, title, description, priority, category, action, buttonText, autoExecutable}
    - confidence: number 0-1
    `;
    
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });
      
      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        timestamp: new Date(),
        projectSnapshot: project,
        gaps: analysis.gaps || [],
        suggestions: analysis.suggestions || [],
        nextSteps: analysis.nextSteps || [],
        confidence: analysis.confidence || 0.8
      };
    } catch (error) {
      console.error('AI analysis error:', error);
      return this.getMockAnalysis(project);
    }
  }
  
  async generateModifications(
    step: NextStep, 
    project: AppProject
  ): Promise<ProjectModification[]> {
    if (!this.isConfigured || !this.openai) {
      return this.getMockModifications(step, project);
    }

    const prompt = `
    Generate specific modifications for this step:
    Step: ${JSON.stringify(step)}
    Current Project: ${JSON.stringify(project)}
    
    Return array of modifications with:
    - type: 'add_screen' | 'update_design_system' | 'add_feature' | 'modify_flow'
    - target: string (id of target element)
    - changes: object with specific changes
    - previewable: boolean
    `;
    
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });
      
      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result.modifications || [];
    } catch (error) {
      console.error('AI modification generation error:', error);
      return this.getMockModifications(step, project);
    }
  }

  private getMockAnalysis(project: AppProject): AIAnalysis {
    return {
      timestamp: new Date(),
      projectSnapshot: project,
      gaps: [
        {
          type: 'missing_feature',
          severity: 'medium',
          description: 'No user authentication system',
          suggestedFix: 'Add login and signup screens',
          autoFixAvailable: true
        }
      ],
      suggestions: [
        {
          title: 'Add User Authentication',
          description: 'Your app needs a way for users to sign in',
          modifications: []
        }
      ],
      nextSteps: [
        {
          id: 'add-auth',
          title: 'Add Authentication',
          description: 'Add login and signup screens to your app',
          priority: 'high',
          category: 'Security',
          action: 'add_screens',
          buttonText: 'Add Auth Screens',
          autoExecutable: true
        }
      ],
      confidence: 0.9
    };
  }

  private getMockModifications(step: NextStep, project: AppProject): ProjectModification[] {
    if (step.action === 'add_screens' && step.id === 'add-auth') {
      return [
        {
          type: 'add_screen',
          target: 'screens',
          changes: {
            id: 'login',
            name: 'Login',
            type: 'auth' as const,
            features: ['login-form'],
            position: { x: 100, y: 100 },
            connections: []
          },
          previewable: true
        },
        {
          type: 'add_screen',
          target: 'screens',
          changes: {
            id: 'signup',
            name: 'Sign Up',
            type: 'auth' as const,
            features: ['signup-form'],
            position: { x: 300, y: 100 },
            connections: []
          },
          previewable: true
        }
      ];
    }
    return [];
  }
}