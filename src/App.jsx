import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';

const MAIN_STORAGE_KEY = 'mepplanner_saas_projects_v11';
const LAST_PROJECT_KEY = 'mepplanner_last_project_id';

export default function App() {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(MAIN_STORAGE_KEY);
      if (!saved) {
        // Fallback do poprzednich wersji
        const v10 = localStorage.getItem('mepplanner_saas_projects_v10');
        if (v10) return JSON.parse(v10);
        return {};
      }
      return JSON.parse(saved);
    } catch {
      return {};
    }
  });

  const [currentProjectId, setCurrentProjectId] = useState(() => {
    return localStorage.getItem(LAST_PROJECT_KEY) || null;
  });

  useEffect(() => {
    localStorage.setItem(MAIN_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (currentProjectId) {
      localStorage.setItem(LAST_PROJECT_KEY, currentProjectId);
    } else {
      localStorage.removeItem(LAST_PROJECT_KEY);
    }
  }, [currentProjectId]);

  const handleCreateProject = (name, initialData = null) => {
    const newId = `proj_${Date.now()}`;
    
    const emptyData = {
      parter: { co: [], wodkan: [], elektryka_punkty: [], elektryka_trasy: [], wentylacja: [] },
      pietro: { co: [], wodkan: [], elektryka_punkty: [], elektryka_trasy: [], wentylacja: [] }
    };
    
    const newProject = {
      id: newId,
      name: name,
      data: initialData ? JSON.parse(JSON.stringify(initialData)) : emptyData, 
      images: { parter: null, pietro: null }, 
      updatedAt: Date.now()
    };
    
    setProjects(prev => ({ ...prev, [newId]: newProject }));
    setCurrentProjectId(newId);
  };

  const handleDeleteProject = (id) => {
    setProjects(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    if (currentProjectId === id) {
      setCurrentProjectId(null);
    }
  };

  const handleSaveProjectData = (id, newData, newImages = null) => {
    setProjects(prev => {
      if (!prev[id]) return prev;
      const updatedProj = { ...prev[id], data: newData, updatedAt: Date.now() };
      if (newImages) updatedProj.images = newImages; 
      return {
        ...prev,
        [id]: updatedProj
      };
    });
  };

  if (!currentProjectId || !projects[currentProjectId]) {
    return (
      <Dashboard 
        projects={projects} 
        onSelectProject={setCurrentProjectId} 
        onCreateProject={handleCreateProject} 
        onDeleteProject={handleDeleteProject} 
      />
    );
  }

  return (
    <Editor 
       project={projects[currentProjectId]} 
       onSaveProject={handleSaveProjectData} 
       onClose={() => setCurrentProjectId(null)} 
    />
  );
}
