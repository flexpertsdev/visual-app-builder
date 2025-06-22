import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Layout, 
  Clock, 
  Trash2, 
  MoreVertical,
  Search,
  Grid,
  List
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { ProjectStore } from '../../services/projectStore';
import { format } from 'date-fns';

interface ProjectDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ isOpen, onClose }) => {
  const { currentProject, loadProject, createProject } = useAppStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  
  const projectStore = new ProjectStore();
  const projects = projectStore.listProjects();
  
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName, newProjectDescription);
      setShowNewProjectDialog(false);
      setNewProjectName('');
      setNewProjectDescription('');
      onClose();
    }
  };
  
  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      projectStore.deleteProject(projectId);
      if (currentProject?.id === projectId) {
        // Load another project or show welcome screen
        const remainingProjects = projectStore.listProjects();
        if (remainingProjects.length > 0) {
          loadProject(remainingProjects[0].id);
        }
      }
    }
  };
  
  const handleSelectProject = (projectId: string) => {
    loadProject(projectId);
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-8"
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[80vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold">My Projects</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage and switch between your app projects
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Toolbar */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search projects..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewProjectDialog(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </button>
              </div>
              
              {/* Projects */}
              <div className="flex-1 overflow-y-auto p-6">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-3 gap-4">
                    {filteredProjects.map(project => (
                      <motion.div
                        key={project.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleSelectProject(project.id)}
                        className={`
                          relative p-6 rounded-lg border-2 cursor-pointer transition-all
                          ${currentProject?.id === project.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                          }
                        `}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Layout className="w-8 h-8 text-gray-400" />
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: Show context menu
                              }}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>Updated {format(new Date(project.lastModified), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                          {project.screens.length} screens • {project.features.length} features
                        </div>
                        {currentProject?.id === project.id && (
                          <div className="absolute top-2 right-2 px-2 py-1 bg-primary-600 text-white text-xs rounded">
                            Current
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredProjects.map(project => (
                      <motion.div
                        key={project.id}
                        whileHover={{ x: 4 }}
                        onClick={() => handleSelectProject(project.id)}
                        className={`
                          flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all
                          ${currentProject?.id === project.id
                            ? 'bg-primary-50 border-l-4 border-primary-500'
                            : 'hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-4">
                          <Layout className="w-6 h-6 text-gray-400" />
                          <div>
                            <h3 className="font-medium text-gray-900">{project.name}</h3>
                            <p className="text-sm text-gray-600">{project.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              {format(new Date(project.lastModified), 'MMM d, yyyy')}
                            </div>
                            <div className="text-xs text-gray-400">
                              {project.screens.length} screens
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {filteredProjects.length === 0 && (
                  <div className="text-center py-12">
                    <Layout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No projects found</p>
                    <button
                      onClick={() => setShowNewProjectDialog(true)}
                      className="mt-4 text-primary-600 hover:text-primary-700"
                    >
                      Create your first project
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* New Project Dialog */}
          {showNewProjectDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-8"
              onClick={() => setShowNewProjectDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
              >
                <h3 className="text-lg font-semibold mb-4">Create New Project</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="My Awesome App"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      placeholder="Describe your app idea..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 h-24 resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowNewProjectDialog(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateProject}
                    disabled={!newProjectName.trim()}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-colors
                      ${newProjectName.trim()
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    Create Project
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};