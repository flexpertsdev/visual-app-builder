import OpenAI from 'openai';
import { AppProject, AIAnalysis, NextStep, ProjectModification } from '../types/app';

export class AIService {
  private openai: OpenAI;
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // For POC only
    });
  }
  
  async analyzeProject(project: AppProject): Promise<AIAnalysis> {
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
      return {
        timestamp: new Date(),
        projectSnapshot: project,
        gaps: [],
        suggestions: [],
        nextSteps: [],
        confidence: 0
      };
    }
  }
  
  async generateModifications(
    step: NextStep, 
    project: AppProject
  ): Promise<ProjectModification[]> {
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
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });
    
    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.modifications || [];
  }
}