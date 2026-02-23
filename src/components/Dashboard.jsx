import React, { useState } from 'react';
import { Layers, FolderPlus, FolderOpen, Trash2 } from 'lucide-react';
import { DEFAULT_DATA } from '../config';

export default function Dashboard({ projects, onSelectProject, onCreateProject, onDeleteProject }) {
  const [newProjName, setNewProjName] = useState('');

  const handleImportNewProject = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = JSON.parse(event.target.result);
        const name = file.name.replace('.json', '');
        onCreateProject(name, content);
      } catch (err) {
        alert("Błąd: Nieprawidłowy plik JSON.");
      }
    };
    reader.readAsText(file);
    e.target.value = null; 
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
             <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                <Layers className="text-blue-600" /> MepPlanner SaaS
             </h1>
             <p className="text-slate-500 mt-2">Zarządzanie projektami instalacyjnymi</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-dashed border-slate-300 flex flex-col justify-center items-center text-center">
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
               <FolderPlus size={28}/>
             </div>
             <h3 className="font-bold text-slate-800 mb-2">Nowy Projekt</h3>
             <div className="flex flex-col gap-2 w-full">
               <input type="text" value={newProjName} onChange={e => setNewProjName(e.target.value)} placeholder="Nazwa projektu..." className="w-full text-sm p-2 rounded border border-slate-300 text-center focus:ring-2 focus:ring-blue-500 outline-none transition" />
               <button disabled={!newProjName.trim()} onClick={async () => { await onCreateProject(newProjName, null); setNewProjName(''); }} className="bg-blue-600 text-white font-bold px-4 py-2 text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition w-full">Utwórz Pusty Projekt</button>
               
               <div className="w-full h-px bg-slate-200 my-2"></div>
               
               <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Z gotowego szablonu</h4>
               <div className="flex gap-2 w-full">
                 <select className="flex-1 text-xs p-2 rounded border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none font-medium text-slate-700">
                    <option value="nowodworce">Dom w Nowodworcach</option>
                 </select>
                 <button onClick={async () => { await onCreateProject(newProjName.trim() || 'Dom w Nowodworcach', DEFAULT_DATA); setNewProjName(''); }} className="bg-orange-500 text-white font-bold px-4 py-2 text-xs rounded-lg hover:bg-orange-600 transition shadow-sm">Utwórz</button>
               </div>
               
               <div className="w-full h-px bg-slate-200 my-2"></div>

               <label className="cursor-pointer bg-slate-100 text-slate-700 border border-slate-300 font-bold px-4 py-2 text-sm rounded-lg hover:bg-slate-200 transition w-full text-center block">Zaimportuj plik .json<input type="file" accept=".json,application/json" className="hidden" onChange={handleImportNewProject} /></label>
             </div>
          </div>

          {Object.entries(projects).reverse().map(([id, proj]) => (
            <div key={id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition">
               <div>
                 <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-slate-100 rounded-lg text-slate-600"><FolderOpen size={24}/></div>
                   <button onClick={(e) => { e.stopPropagation(); if(window.confirm('Usunąć projekt bezpowrotnie?')) onDeleteProject(id); }} className="text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
                 </div>
                 <h3 className="font-bold text-lg text-slate-800 mb-1 line-clamp-1">{proj.name}</h3>
                 <p className="text-xs text-slate-400">Ostatnia edycja: {new Date(proj.updatedAt || Date.now()).toLocaleDateString()}</p>
               </div>
               <button onClick={() => onSelectProject(id)} className="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg transition">Otwórz Edytor</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}