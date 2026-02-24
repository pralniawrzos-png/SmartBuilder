import React from 'react';
import { ArrowLeft, Menu, BarChart2, PenTool, XCircle, Save, Download, Ruler } from 'lucide-react';

export default function TopToolbar({
  projectName, onClose, isEditMode, isMeasuring, showStats, setShowStats,
  toggleEditMode, cancelEditMode, toggleMeasureMode, handleExportData,
  isSidebarOpen, setIsSidebarOpen
}) {
  return (
    <div className="absolute top-4 left-4 right-4 z-40 pointer-events-none flex justify-between items-start">
       <div className="bg-white/90 backdrop-blur-xl shadow-lg border border-slate-200 rounded-2xl p-2.5 flex items-center gap-4 pointer-events-auto">
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"><ArrowLeft size={20}/></button>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition" aria-label="Menu"><Menu size={20}/></button>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <h1 className="font-black text-slate-800 text-lg leading-none tracking-tight">{projectName}</h1>
            <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest mt-0.5">Środowisko Projektowe</p>
          </div>
       </div>
       
       <div className="flex flex-col items-end gap-3 pointer-events-auto">
         <div className="bg-white/90 backdrop-blur-xl shadow-lg border border-slate-200 rounded-2xl p-1.5 flex gap-1">
           {!isEditMode && !isMeasuring ? (
             <>
               <button onClick={() => setShowStats(!showStats)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${showStats ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}><BarChart2 size={16}/> Kosztorys</button>
               <div className="w-px bg-slate-200 mx-1 my-1"></div>
               <button onClick={toggleEditMode} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md shadow-indigo-200"><PenTool size={16}/> Projektuj</button>
             </>
           ) : isEditMode ? (
             <>
               <button onClick={cancelEditMode} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition"><XCircle size={16}/> Anuluj</button>
               <button onClick={toggleEditMode} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-black text-white bg-emerald-500 hover:bg-emerald-600 transition shadow-md shadow-emerald-200"><Save size={16}/> Zapisz Projekt</button>
             </>
           ) : (
             <button onClick={toggleMeasureMode} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md shadow-indigo-200"><XCircle size={16}/> Zakończ Miarę</button>
           )}
         </div>

         {!isEditMode && !isMeasuring && (
           <div className="bg-white/90 backdrop-blur-xl shadow-lg border border-slate-200 rounded-2xl p-1.5 flex gap-1">
             <button onClick={toggleMeasureMode} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition" title="Linijka"><Ruler size={18}/></button>
             <button onClick={handleExportData} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition" title="Pobierz Projekt"><Download size={18}/></button>
           </div>
         )}
       </div>
    </div>
  );
}