import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, Clock, Star, Settings } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { useAppStore } from '../stores/appStore';
import { ProjectStore } from '../services/projectStore';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentProject, loadProject, createProject } = useAppStore();
  const projectStore = new ProjectStore();
  const projects = projectStore.getAllProjects();

  const handleCreateProject = () => {
    createProject(
      `New Project ${projects.length + 1}`,
      'A new app project created from dashboard'
    );
    navigate('/editor');
  };

  const handleOpenProject = (projectId: string) => {
    loadProject(projectId);
    navigate('/editor');
  };

  const recentProjects = projects
    .sort((a, b) => new Date(b.updatedAt || b.lastModified).getTime() - new Date(a.updatedAt || a.lastModified).getTime())
    .slice(0, 5);

  const starredProjects = projects.filter(p => p.starred === true);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">Visual App Builder</h1>
            <Button
              variant="ghost"
              size="sm"
              icon={Settings}
              onClick={() => navigate('/settings')}
            >
              Settings
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome back!</h2>
          <Button
            onClick={handleCreateProject}
            icon={Plus}
            className="mb-6"
          >
            Create New Project
          </Button>
        </div>

        {starredProjects.length > 0 && (
          <section className="mb-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Starred Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {starredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onOpen={() => handleOpenProject(project.id)}
                  isCurrent={currentProject?.id === project.id}
                />
              ))}
            </div>
          </section>
        )}

        <section className="mb-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-500" />
            Recent Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={() => handleOpenProject(project.id)}
                isCurrent={currentProject?.id === project.id}
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FolderOpen className="w-5 h-5 mr-2 text-gray-500" />
            All Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={() => handleOpenProject(project.id)}
                isCurrent={currentProject?.id === project.id}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

interface ProjectCardProps {
  project: any;
  onOpen: () => void;
  isCurrent: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpen, isCurrent }) => {
  const screenCount = project.screens?.length || 0;
  
  return (
    <div
      className={`
        bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer
        ${isCurrent ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-200'}
      `}
      onClick={onOpen}
    >
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-lg font-semibold text-gray-900">{project.name}</h4>
        {project.starred && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        {screenCount} screen{screenCount !== 1 ? 's' : ''}
      </p>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Updated {format(new Date(project.updatedAt || project.lastModified), 'MMM d, yyyy')}</span>
        {isCurrent && (
          <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded">
            Current
          </span>
        )}
      </div>
    </div>
  );
};