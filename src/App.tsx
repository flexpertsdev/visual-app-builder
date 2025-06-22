import React, { useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { LeftPanel } from './components/Layout/LeftPanel';
import { AppCanvas } from './components/Canvas/AppCanvas';
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
      
      <div className="flex-1 relative flex">
        <LeftPanel />
        
        <div className="flex-1 relative">
          <AppCanvas
            screens={currentProject.screens}
            onScreenUpdate={updateScreen}
          />
          
          <AddButton />
        </div>
      </div>
    </div>
  );
}

export default App;
