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

  const handleCreateProject = async (name, initialData = null) => {
    const newId = `proj_${Date.now()}`;
    
    const emptyData = {
      parter: {
        strefy: [],
        co: [],
        wodkan: [],
        woda: [],
        kanalizacja: [],
        elektryka_punkty: [],
        elektryka_trasy: [],
        wentylacja: []
      },
      pietro: {
        strefy: [],
        co: [],
        wodkan: [],
        woda: [],
        kanalizacja: [],
        elektryka_punkty: [],
        elektryka_trasy: [],
        wentylacja: []
      },
      floors: []
    };

    let projectData = initialData ? JSON.parse(JSON.stringify(initialData)) : emptyData;

    // MAGIA SZABLONU: Automatyczna migracja starszych szablonów w locie
    if (initialData && !initialData.floors) {
        const migratedFloors = [];
        if (initialData.parter) migratedFloors.push({ id: 'parter', name: 'Parter', image: null, data: initialData.parter });
        if (initialData.pietro) migratedFloors.push({ id: 'pietro', name: 'Piętro', image: null, data: initialData.pietro });
        projectData = { floors: migratedFloors };
    }

    // Dynamiczne dogrywanie domyślnych obrazków JPG z folderu public
    if (projectData && projectData.floors) {
       try {
         for (let i = 0; i < projectData.floors.length; i++) {
           const floorName = projectData.floors[i].name.toLowerCase();
           let imgPath = null;
           
           if (floorName.includes('parter')) imgPath = '/parter.jpg';
           if (floorName.includes('piętro') || floorName.includes('pietro')) imgPath = '/pietro.jpg';

           if (imgPath) {
              const res = await fetch(imgPath);
              if (res.ok) {
                 const blob = await res.blob();
                 const reader = new FileReader();
                 const base64data = await new Promise((resolve) => {
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                 });
                 projectData.floors[i].image = base64data;
              }
           }
         }
       } catch (err) {
         console.warn("Nie udało się załadować domyślnych obrazków dla szablonu:", err);
       }
    }
    
    const newProject = {
      id: newId,
      name: name,
      data: projectData, 
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
