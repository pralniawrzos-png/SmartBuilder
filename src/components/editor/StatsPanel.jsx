import React from 'react';
import { BarChart2, X, Layers, Activity } from 'lucide-react';
import { LAYER_CONFIG } from '../../config';

export default function StatsPanel({ showStats, setShowStats, currentStats }) {
  if (!showStats) return null;

  return (
    <div className="absolute top-24 right-4 bottom-4 w-[360px] z-50 pointer-events-none flex flex-col">
      <div className="bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200 rounded-3xl p-5 pointer-events-auto flex flex-col h-full overflow-hidden">
         <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100 shrink-0">
           <h2 className="text-lg font-black flex items-center gap-2 text-slate-800 tracking-tight">
             <BarChart2 className="text-indigo-600" size={20} strokeWidth={3}/> Kosztorys
           </h2>
           <button onClick={() => setShowStats(false)} className="text-slate-400 hover:text-red-500 transition bg-slate-50 hover:bg-red-50 p-2 rounded-xl"><X size={16} strokeWidth={3}/></button>
         </div>
         
         <div className="overflow-y-auto flex-1 pr-1 space-y-6 custom-scrollbar">
           {Object.entries(currentStats).map(([floor, layers]) => {
             const floorTotalCount = Object.values(layers).reduce((sum, d) => sum + d.count, 0);
             const floorTotalLength = Object.values(layers).reduce((sum, d) => sum + parseFloat(d.length || 0), 0);
             return (
               <div key={floor} className="mb-2">
                 <div className="flex justify-between items-end mb-3 border-b-2 border-slate-50 pb-2">
                   <h3 className="font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                     <Layers size={14} className="text-slate-400"/> {floor}
                   </h3>
                   {Object.keys(layers).length > 0 && (
                     <div className="text-[9px] font-bold text-slate-500 flex gap-2 uppercase bg-slate-50 px-1.5 py-1 rounded-lg border border-slate-100 shadow-inner">
                       <span>Pkt: <b className="text-slate-800">{floorTotalCount}</b></span>
                       <span>Trasy: <b className="text-indigo-600">{floorTotalLength.toFixed(1)}m</b></span>
                     </div>
                   )}
                 </div>
                 {Object.keys(layers).length === 0 ? (
                   <p className="text-[10px] text-slate-400 font-medium text-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">Brak instalacji</p>
                 ) : (
                   <div className="grid grid-cols-1 gap-2.5">
                     {Object.entries(layers).map(([layer, data]) => {
                       const LayerIcon = LAYER_CONFIG[layer]?.Icon || Activity;
                       // Jeśli warstwa ma strefy (zones), wyświetl je zamiast tras
                       if (data.zones && data.zones.length > 0) {
                         return (
                           <div key={layer} className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all group flex flex-col gap-2">
                             <div className="flex items-center gap-2">
                               <div className="w-6 h-6 rounded-md flex items-center justify-center text-white shadow-inner" style={{backgroundColor: LAYER_CONFIG[layer].color}}>
                                 <LayerIcon size={12} />
                               </div>
                               <span className="font-bold text-slate-700 text-xs">{LAYER_CONFIG[layer].name}</span>
                             </div>
                             <div className="bg-blue-50 p-1.5 rounded-lg border border-blue-100 mt-2">
                               <span className="text-[8px] uppercase font-bold text-blue-400">Strefy / Powierzchnie</span>
                               {data.zones.map((zone, idx) => (
                                 <div key={idx} className="flex justify-between text-xs text-slate-600 mt-1 pl-2 border-l-2 border-blue-200">
                                   <span>{zone.label}</span>
                                   <span className="font-bold text-slate-800">{zone.area} m²</span>
                                 </div>
                               ))}
                             </div>
                           </div>
                         );
                       }
                       // Dla urządzeń/punktów pokaż listę kosztów i sumę
                       return (
                         <div key={layer} className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all group flex flex-col gap-2">
                           <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-md flex items-center justify-center text-white shadow-inner" style={{backgroundColor: LAYER_CONFIG[layer].color}}>
                               <LayerIcon size={12} />
                             </div>
                             <span className="font-bold text-slate-700 text-xs">{LAYER_CONFIG[layer].name}</span>
                           </div>
                           <div className="grid grid-cols-2 gap-2 mb-2">
                             <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex justify-between items-center">
                               <span className="text-[8px] uppercase font-bold text-slate-400">Pkt/Urz</span>
                               <span className="font-black text-xs text-slate-700">{data.count}</span>
                             </div>
                           </div>
                           {/* Lista urządzeń z kosztami */}
                           {data.devices && data.devices.length > 0 && (
                             <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-100 mb-2">
                               <span className="text-[8px] uppercase font-bold text-yellow-600">Urządzenia / Koszty</span>
                               {data.devices.map((dev, idx) => (
                                 <div key={idx} className="flex justify-between text-xs text-slate-700 mt-1 pl-2 border-l-2 border-yellow-300">
                                   <span>{dev.label}</span>
                                   <span className="font-bold text-slate-800">{dev.cost.toFixed(2)} PLN</span>
                                 </div>
                               ))}
                             </div>
                           )}
                           {/* Lista tras z kosztami */}
                           {data.groupedLines && data.groupedLines.length > 0 && (
                             <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-100 mb-2">
                               <span className="text-[8px] uppercase font-bold text-indigo-600">Trasy / Koszty</span>
                               {data.groupedLines.map((line, idx) => (
                                 <div key={idx} className="flex justify-between text-xs text-slate-700 mt-1 pl-2 border-l-2 border-indigo-300">
                                   <span>{line.label}</span>
                                   <span>{line.length} mb | <span className="font-bold text-slate-800">{line.cost.toFixed(2)} PLN</span></span>
                                 </div>
                               ))}
                             </div>
                           )}
                           {/* Podsumowanie kosztów */}
                           {data.totalCost > 0 && (
                             <div className="mt-2 pt-2 border-t border-yellow-200 text-right">
                               <span className="font-bold text-yellow-700 text-sm">Suma kosztów: {data.totalCost.toFixed(2)} PLN</span>
                             </div>
                           )}
                         </div>
                       );
                     })}
                   </div>
                 )}
               </div>
             );
           })}
         </div>
      </div>
    </div>
  );
}