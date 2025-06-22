import { create } from 'zustand';
import { AppProject, Screen } from '../types/app';
import { ProjectStore } from '../services/projectStore';
import { featureTemplates } from '../services/featureTemplates';

interface AppState {
  currentProject: AppProject | null;
  isLoading: boolean;
  error: string | null;
}

interface AppActions {
  createProject: (name: string, description: string) => void;
  loadProject: (id: string) => void;
  updateProject: (updates: Partial<AppProject>) => void;
  saveProject: () => void;
  addScreen: (screen: Screen) => void;
  updateScreen: (screenId: string, updates: Partial<Screen>) => void;
  deleteScreen: (screenId: string) => void;
  addFeature: (templateId: string) => void;
}

const projectStore = new ProjectStore();

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  currentProject: null,
  isLoading: false,
  error: null,
  
  createProject: (name, description) => {
    const newProject: AppProject = {
      id: Date.now().toString(),
      name,
      description,
      designSystem: {
        colors: {
          primary: '#2563eb',
          background: '#ffffff',
          text: '#111827'
        },
        typography: {
          fontFamily: 'Inter',
          scale: 'normal'
        },
        borderRadius: 'lg',
        spacing: 'normal'
      },
      screens: [],
      journeys: [
        {
          id: 'onboarding',
          name: 'User Onboarding',
          screens: [],
          description: 'First-time user experience'
        },
        {
          id: 'core-flow',
          name: 'Core Experience',
          screens: [],
          description: 'Main app functionality'
        }
      ],
      features: [],
      aiContext: {
        analysisHistory: [],
        suggestedNextSteps: [],
        completionStatus: {
          designSystem: false,
          coreFlows: false,
          authentication: false,
          dataModels: false
        },
        userPreferences: {
          complexity: 'simple',
          platform: 'mobile',
          industry: ''
        }
      },
      lastModified: new Date()
    };
    
    set({ currentProject: newProject });
    projectStore.saveProject(newProject);
  },
  
  loadProject: (id) => {
    set({ isLoading: true });
    const project = projectStore.loadProject(id);
    
    if (project) {
      set({ currentProject: project, isLoading: false });
    } else {
      set({ error: 'Project not found', isLoading: false });
    }
  },
  
  updateProject: (updates) => {
    const { currentProject } = get();
    if (!currentProject) return;
    
    const updatedProject = {
      ...currentProject,
      ...updates,
      lastModified: new Date()
    };
    
    set({ currentProject: updatedProject });
    projectStore.saveProject(updatedProject);
  },
  
  saveProject: () => {
    const { currentProject } = get();
    if (currentProject) {
      projectStore.saveProject(currentProject);
    }
  },
  
  addScreen: (screen) => {
    const { currentProject } = get();
    if (!currentProject) return;
    
    get().updateProject({
      screens: [...currentProject.screens, screen]
    });
  },
  
  updateScreen: (screenId, updates) => {
    const { currentProject } = get();
    if (!currentProject) return;
    
    const updatedScreens = currentProject.screens.map(screen =>
      screen.id === screenId ? { ...screen, ...updates } : screen
    );
    
    get().updateProject({ screens: updatedScreens });
  },
  
  deleteScreen: (screenId) => {
    const { currentProject } = get();
    if (!currentProject) return;
    
    const updatedScreens = currentProject.screens.filter(s => s.id !== screenId);
    get().updateProject({ screens: updatedScreens });
  },
  
  addFeature: (templateId) => {
    const { currentProject } = get();
    if (!currentProject) return;
    
    const template = featureTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    // Generate new screens from template
    const newScreens: Screen[] = template.requiredScreens.map((screenTemplate, index) => ({
      id: `${Date.now()}-${index}`,
      name: screenTemplate.name,
      type: screenTemplate.type,
      position: { 
        x: 100 + (index % 3) * 300, 
        y: 100 + Math.floor(index / 3) * 200 
      },
      size: { width: 256, height: 384 },
      connections: screenTemplate.connections.map(conn => ({
        ...conn,
        from: `${Date.now()}-${index}`,
        type: conn.type as 'navigation' | 'action' | 'data'
      })),
      states: [{ name: 'default', isDefault: true }]
    }));
    
    // Update connections to use new IDs
    newScreens.forEach(screen => {
      screen.connections = screen.connections.map(conn => {
        const targetScreen = newScreens.find(s => 
          s.name === conn.to
        );
        return {
          ...conn,
          to: targetScreen?.id || conn.to
        };
      });
    });
    
    get().updateProject({
      screens: [...currentProject.screens, ...newScreens],
      features: [...currentProject.features, {
        id: Date.now().toString(),
        templateId,
        name: template.name,
        screens: newScreens.map(s => s.id),
        configuration: {}
      }]
    });
  }
}));