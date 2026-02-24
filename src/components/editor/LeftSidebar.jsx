import React from 'react';
import { Plus, Edit2, Trash2, Ruler, Save } from 'lucide-react';
import { LAYER_CONFIG } from '../../config';

const CheckIcon = ({size, className}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"></polyline></svg>
);

export default function LeftSidebar({
  installations, activeFloor, setActiveFloor, addFloor, deleteFloor,
  editingFloorName, setEditingFloorName, newFloorName, setNewFloorName, saveFloorName,
  isEditMode, isMeasuring, activeLayers, setActiveLayers, activeEditLayer, setActiveEditLayer,
  setSelectedElement, projectWidthM, setProjectWidthM, isSidebarOpen
}) {
  return (
    <div className={`absolute md:relative top-24 left-4 bottom-4 w-72 z-40 pointer-events-none flex flex-col gap-4 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
       <div className="bg-white/90 backdrop-blur-xl shadow-xl border border-slate-200 rounded-3xl p-5 pointer-events-auto flex flex-col overflow-hidden max-h-full">
         
         {/* Sekcja Kondygnacji */}
         <div className="mb-6 shrink-0">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kondygnacje</h2>
              {!isEditMode && !isMeasuring && <button onClick={addFloor} className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition"><Plus size={16}/></button>}
            </div>
            <div className="space-y-1.5 overflow-y-auto max-h-40 pr-1 custom-scrollbar">
              {installations.floors?.map(floor => (
                <div key={floor.id} className={`flex items-center justify-between p-2 rounded-xl border-2 transition-all ${activeFloor === floor.id ? 'bg-indigo-50 border-indigo-500 shadow-sm' : 'bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-200'}`}>
                   {editingFloorName === floor.id ? (
                     <div className="flex gap-1 flex-1 mr-2">
                       <input type="text" autoFocus value={newFloorName} onChange={e => setNewFloorName(e.target.value)} onKeyDown={e => e.key==='Enter' && saveFloorName(floor.id)} className="w-full text-xs font-bold p-1 rounded border border-indigo-400 outline-none text-slate-800" />
                       <button onClick={() => saveFloorName(floor.id)} className="text-emerald-600 bg-emerald-50 p-1 rounded"><Save size={12}/></button>
                     </div>
                   ) : (
                     <button onClick={() => setActiveFloor(floor.id)} className={`flex-1 text-left text-sm font-bold truncate ${activeFloor === floor.id ? 'text-indigo-700' : 'text-slate-600'}`}>{floor.name}</button>
                   )}
                   
                   {!isEditMode && !isMeasuring && (
                     <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
                       <button onClick={() => { setEditingFloorName(floor.id); setNewFloorName(floor.name); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg"><Edit2 size={14}/></button>
                       <button onClick={() => deleteFloor(floor.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
                     </div>
                   )}
                </div>
              ))}
            </div>
         </div>

         <div className="w-full h-px bg-slate-100 my-2 shrink-0"></div>

         {/* Sekcja Warstw z Pogrupowaniem */}
         <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{isEditMode ? 'Edytowana Warstwa' : 'Kategorie i Widoczność'}</h2>
            
            {isEditMode ? (
              <div className="space-y-4">
                 {Object.entries(
                   Object.entries(LAYER_CONFIG).reduce((acc, [k, cfg]) => {
                     if(!acc[cfg.group]) acc[cfg.group] = [];
                     acc[cfg.group].push({k, ...cfg});
                     return acc;
                   }, {})
                 ).map(([groupName, layers]) => (
                   <div key={groupName}>
                     <h3 className="text-[9px] font-bold text-slate-400 uppercase mb-2 ml-1">{groupName}</h3>
                     <div className="space-y-1.5">
                       {layers.map(layer => {
                          const isSelected = activeEditLayer === layer.k;
                          return (
                            <button key={layer.k} onClick={() => { setActiveEditLayer(layer.k); setActiveLayers(Object.keys(LAYER_CONFIG).reduce((acc, l) => ({...acc, [l]: l === layer.k}), {})); setSelectedElement(null); }} className={`w-full flex items-center p-2.5 rounded-xl border-2 transition-all text-left ${isSelected ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-50' : 'bg-slate-50 border-slate-100 hover:border-slate-200 text-slate-500 hover:text-slate-700'}`}>
                               <div className="w-6 h-6 rounded-md flex items-center justify-center text-white shadow-inner mr-3" style={{backgroundColor: layer.color}}><layer.Icon size={14} /></div>
                               <span className={`text-xs font-bold ${isSelected ? 'text-slate-900' : ''}`}>{layer.name}</span>
                            </button>
                          )
                       })}
                     </div>
                   </div>
                 ))}
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(
                   Object.entries(LAYER_CONFIG).reduce((acc, [k, cfg]) => {
                     if(!acc[cfg.group]) acc[cfg.group] = [];
                     acc[cfg.group].push({k, ...cfg});
                     return acc;
                   }, {})
                 ).map(([groupName, layers]) => (
                   <div key={groupName}>
                     <h3 className="text-[9px] font-bold text-slate-400 uppercase mb-2 ml-1">{groupName}</h3>
                     <div className="space-y-1.5">
                       {layers.map(layer => (
                         <label key={layer.k} className={`flex items-center p-2 rounded-xl cursor-pointer border-2 transition-all ${activeLayers[layer.k] ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-transparent hover:bg-slate-100 opacity-60'}`}>
                           <div className={`w-4 h-4 rounded flex items-center justify-center mr-3 transition-colors ${activeLayers[layer.k] ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                              {activeLayers[layer.k] && <CheckIcon size={10} className="text-white" strokeWidth="4"/>}
                           </div>
                           <input type="checkbox" checked={activeLayers[layer.k] || false} onChange={() => setActiveLayers(p => ({...p, [layer.k]: !p[layer.k]}))} className="hidden" />
                           <span className="flex items-center justify-center w-6 h-6 rounded-md text-white mr-3 shadow-inner" style={{backgroundColor: layer.color}}><layer.Icon size={12} /></span>
                           <span className="text-xs font-bold text-slate-700">{layer.name}</span>
                         </label>
                       ))}
                     </div>
                   </div>
                ))}
              </div>
            )}
         </div>

         {/* Narzędzie Miarki (Gdy Aktywne) */}
         {isMeasuring && (
           <div className="mt-4 pt-4 border-t border-slate-100 shrink-0">
             <h3 className="font-bold text-indigo-600 text-xs mb-2 flex items-center gap-1.5 uppercase tracking-wide"><Ruler size={14}/> Kalibracja skali</h3>
             <label className="text-[10px] font-bold text-slate-500 block mb-1">Rzeczywista szer. rzutu (m)</label>
             <input type="number" value={projectWidthM} onChange={e => setProjectWidthM(parseFloat(e.target.value) || 1)} className="w-full text-sm font-bold text-slate-800 p-2 rounded-xl border-2 border-indigo-100 bg-indigo-50 focus:border-indigo-500 outline-none transition" />
           </div>
         )}
       </div>
    </div>
  );
}