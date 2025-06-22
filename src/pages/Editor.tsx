import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Layout/Header';
import { LeftPanel } from '../components/Layout/LeftPanel';
import { AppCanvas } from '../components/Canvas/AppCanvas';
import { AddButton } from '../components/Features/AddButton';
import { useAppStore } from '../stores/appStore';
import { useCanvasStore } from '../stores/canvasStore';

export const Editor: React.FC = () => {
  const navigate = useNavigate();
  const { currentProject, updateScreen } = useAppStore();
  const { zoom, setZoom } = useCanvasStore();

  if (!currentProject) {
    navigate('/');
    return null;
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
};