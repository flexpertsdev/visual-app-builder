import React, { useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { AppCanvas } from './components/Canvas/AppCanvas';
import { AIChat } from './components/Chat/AIChat';
import { AddButton } from './components/Features/AddButton';
import { useAppStore } from './stores/appStore';
import { useCanvasStore } from './stores/canvasStore';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ProjectStore } from './services/projectStore';

function App() {
  const { currentProject, loadProject, updateScreen } = useAppStore();
  const { zoom, setZoom } = useCanvasStore();
  
  useEffect(() => {
    // Try to load last project
    const projectStore = new ProjectStore();
    const lastProjectId = projectStore.getCurrentProjectId();
    if (lastProjectId) {
      loadProject(lastProjectId);
    }
  }, [loadProject]);
  
  if (!currentProject) {
    return <WelcomeScreen />;
  }
  
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        projectName={currentProject.name}
        currentZoom={zoom}
        onZoomChange={setZoom}
      />
      
      <div className="flex-1 relative">
        <AppCanvas
          screens={currentProject.screens}
          onScreenUpdate={updateScreen}
        />
        
        <AIChat />
        <AddButton />
      </div>
    </div>
  );
}

export default App;
