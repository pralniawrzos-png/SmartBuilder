import React from 'react';
import { PlusCircle, Square, Activity, Layers } from 'lucide-react';
import { LAYER_CONFIG } from '../../config';

export default function BottomTools({ activeEditLayer, addNewElement }) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
       <div className="bg-slate-900/95 backdrop-blur-xl shadow-2xl rounded-full p-2 flex gap-1 pointer-events-auto border border-slate-700 items-center ring-4 ring-slate-900/20">
          <div className="px-4 py-1 flex items-center gap-2 border-r border-slate-700 mr-1">
             <div className="w-3 h-3 rounded-full" style={{backgroundColor: LAYER_CONFIG[activeEditLayer].color}}></div>
             <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{LAYER_CONFIG[activeEditLayer].name}</span>
          </div>
          <button onClick={()=>addNewElement('circle')} className="flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-slate-800 text-white font-semibold text-sm transition group"><PlusCircle size={18} className="text-slate-400 group-hover:text-white transition"/> Punkt</button>
          <button onClick={()=>addNewElement('rect')} className="flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-slate-800 text-white font-semibold text-sm transition group"><Square size={18} className="text-slate-400 group-hover:text-white transition"/> Urządzenie</button>
          <button onClick={()=>addNewElement('line')} className="flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-slate-800 text-white font-semibold text-sm transition group"><Activity size={18} className="text-slate-400 group-hover:text-white transition"/> Linia</button>
          <button onClick={()=>addNewElement('polygon')} className="flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-slate-800 text-white font-semibold text-sm transition group"><Layers size={18} className="text-slate-400 group-hover:text-white transition"/> Strefa</button>
       </div>
    </div>
  );
}