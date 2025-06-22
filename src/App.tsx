import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { Settings } from './pages/Settings';
import { useAppStore } from './stores/appStore';
import { ProjectStore } from './services/projectStore';

function App() {
  const { currentProject, loadProject } = useAppStore();
  
  useEffect(() => {
    // Try to load last project
    const projectStore = new ProjectStore();
    const lastProjectId = projectStore.getCurrentProjectId();
    if (lastProjectId) {
      loadProject(lastProjectId);
    }
  }, [loadProject]);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/editor" element={currentProject ? <Editor /> : <Navigate to="/" />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
