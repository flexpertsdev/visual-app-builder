import { AppProject } from '../types/app';

export class ProjectStore {
  private static STORAGE_KEY = 'visual-app-builder-projects';
  private static CURRENT_PROJECT_KEY = 'visual-app-builder-current-project';
  
  saveProject(project: AppProject): void {
    const projects = this.getAllProjects();
    const index = projects.findIndex(p => p.id === project.id);
    
    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.push(project);
    }
    
    localStorage.setItem(ProjectStore.STORAGE_KEY, JSON.stringify(projects));
    localStorage.setItem(ProjectStore.CURRENT_PROJECT_KEY, project.id);
  }
  
  loadProject(id: string): AppProject | null {
    const projects = this.getAllProjects();
    return projects.find(p => p.id === id) || null;
  }
  
  getAllProjects(): AppProject[] {
    const data = localStorage.getItem(ProjectStore.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
  
  getCurrentProjectId(): string | null {
    return localStorage.getItem(ProjectStore.CURRENT_PROJECT_KEY);
  }
  
  deleteProject(id: string): void {
    const projects = this.getAllProjects().filter(p => p.id !== id);
    localStorage.setItem(ProjectStore.STORAGE_KEY, JSON.stringify(projects));
    
    if (this.getCurrentProjectId() === id) {
      localStorage.removeItem(ProjectStore.CURRENT_PROJECT_KEY);
    }
  }
  
  enableAutoSave(project: AppProject): () => void {
    const intervalId = setInterval(() => {
      this.saveProject(project);
    }, 30000); // Auto-save every 30 seconds
    
    return () => clearInterval(intervalId);
  }
}