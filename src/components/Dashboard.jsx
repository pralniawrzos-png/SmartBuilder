import React, { useState } from 'react';
import { Building2, FolderPlus, FileJson, Trash2, LayoutTemplate, ArrowRight, FolderOpen, Blocks } from 'lucide-react';
import { DEFAULT_DATA } from '../config';

export default function Dashboard({ projects, onSelectProject, onCreateProject, onDeleteProject }) {
  const [newProjName, setNewProjName] = useState('');
  const [template, setTemplate] = useState('nowodworce');

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
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 selection:text-indigo-900 text-slate-800">
      
      {/* 🟢 HEADER */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 sticky top-0 z-50 shadow-sm">
         <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-200">
                  <Building2 size={26} strokeWidth={2.5} />
               </div>
               <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                 SmartBuilder<span className="text-indigo-600">.io</span>
               </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
                Panel Architekta
              </span>
            </div>
         </div>
      </header>

      {/* 🟢 MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Twoje Projekty</h2>
          <p className="text-slate-500 font-medium">Zarządzaj instalacjami budynków, szacuj koszty i dziel się wizją.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* 🟠 KARTA KREATORA */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-dashed border-indigo-200 flex flex-col justify-between hover:shadow-xl hover:border-indigo-400 transition-all duration-300 group">
             <div>
               <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <FolderPlus size={28} strokeWidth={2}/>
               </div>
               <h3 className="font-bold text-lg text-slate-800 mb-3">Rozpocznij nowy</h3>
               
               <div className="space-y-4">
                 <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Nazwa Projektu (opcjonalnie)</label>
                   <input type="text" value={newProjName} onChange={e => setNewProjName(e.target.value)} placeholder="np. Willa pod miastem" className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                 </div>
                 
                 <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Szablon początkowy</label>
                   <div className="flex gap-2 relative">
                     <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400"><LayoutTemplate size={16}/></div>
                     <select value={template} onChange={e => setTemplate(e.target.value)} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition font-medium appearance-none">
                        <option value="empty">Czysta karta</option>
                        <option value="nowodworce">Dom w Nowodworcach</option>
                     </select>
                   </div>
                 </div>
               </div>
             </div>
             
             <div className="mt-8 space-y-3">
               <button onClick={async () => { await onCreateProject(newProjName.trim() || (template === 'empty' ? 'Nowy Projekt' : 'Dom w Nowodworcach'), template === 'empty' ? null : DEFAULT_DATA); setNewProjName(''); }} className="bg-indigo-600 text-white font-bold px-4 py-3 rounded-xl hover:bg-indigo-700 hover:-translate-y-0.5 transition shadow-lg shadow-indigo-200 w-full flex justify-center items-center gap-2">
                 Utwórz Projekt <ArrowRight size={18}/>
               </button>
               
               <div className="relative">
                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                 <div className="relative flex justify-center"><span className="bg-white px-2 text-[10px] text-slate-400 uppercase font-bold tracking-widest">LUB</span></div>
               </div>

               <label className="cursor-pointer bg-white text-slate-600 border border-slate-200 font-bold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition w-full text-center flex justify-center items-center gap-2">
                 <FileJson size={16}/> Wgraj plik .json
                 <input type="file" accept=".json,application/json" className="hidden" onChange={handleImportNewProject} />
               </label>
             </div>
          </div>

          {/* 🔵 LISTA PROJEKTÓW */}
          {Object.entries(projects).reverse().map(([id, proj]) => (
            <div key={id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onClick={() => onSelectProject(id)}>
               <div>
                 <div className="flex justify-between items-start mb-6">
                   <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"><Blocks size={24}/></div>
                   <button onClick={(e) => { e.stopPropagation(); if(window.confirm('Na pewno usunąć projekt bezpowrotnie?')) onDeleteProject(id); }} className="text-slate-300 hover:text-red-500 bg-white hover:bg-red-50 p-2 rounded-full transition-colors"><Trash2 size={18}/></button>
                 </div>
                 <div className="mb-2 flex items-center gap-2">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-extrabold uppercase tracking-widest rounded-md border border-emerald-100">BIM Model</span>
                 </div>
                 <h3 className="font-extrabold text-xl text-slate-800 mb-1 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">{proj.name}</h3>
               </div>
               
               <div className="mt-8 border-t border-slate-100 pt-4 flex items-center justify-between">
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ostatnia edycja</p>
                   <p className="text-xs font-semibold text-slate-600">{new Date(proj.updatedAt || Date.now()).toLocaleDateString('pl-PL')}</p>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                   <ArrowRight size={16}/>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}