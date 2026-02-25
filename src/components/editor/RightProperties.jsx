import React, { useState } from 'react';
import { Settings, Trash2, PaintBucket, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { LAYER_CONFIG } from '../../config';

export default function RightProperties({
  currentSelObj,
  activeEditLayer,
  updateSelectedProperty,
  deleteSelected,
  addNodeToLine,
  removeNodeFromLine,
  setSelectedElement,
  dragInfo,
  projectWidthM,
}) {
  const [isPropCollapsed, setIsPropCollapsed] = useState(false);
  if (!currentSelObj) return null;

  // Ghost mode: panel blednie i przepuszcza kliknięcia podczas dragowania
  const ghostClass = dragInfo ? 'opacity-30 pointer-events-none' : 'opacity-100 pointer-events-auto';
  // Kompaktowe zwijanie: minimalny padding i wysokość
  const collapsedClass = isPropCollapsed ? 'p-1 min-h-[48px] max-h-[56px]' : 'p-5';

  return (
    <div className={`absolute top-24 right-4 bottom-4 w-80 z-40 ${ghostClass}`}>
      <div className={`bg-white/90 backdrop-blur-xl shadow-xl border border-slate-200 rounded-3xl ${collapsedClass} h-auto max-h-full overflow-y-auto custom-scrollbar transition-all duration-200`}> 
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
          <h3 className="text-xs font-black uppercase text-slate-800 tracking-widest flex items-center gap-2"><Settings size={14}/> Właściwości</h3>
          <button
            onClick={() => setIsPropCollapsed(!isPropCollapsed)}
            className="text-slate-500 hover:text-slate-800 p-1 bg-white rounded border ml-auto mr-2"
            aria-label="Zwiń panel"
          >
            {isPropCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          <button onClick={deleteSelected} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition tooltip-delete"><Trash2 size={16}/></button>
        </div>

        {!isPropCollapsed && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Nazwa etykiety</label>
              <input type="text" value={currentSelObj.label || ''} onChange={e => updateSelectedProperty('label', e.target.value)} className="w-full text-sm font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition" />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Krótki Opis</label>
              <textarea value={currentSelObj.desc || ''} onChange={e => updateSelectedProperty('desc', e.target.value)} className="w-full text-sm p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition h-24 resize-none leading-relaxed" />
            </div>

            {/* Pole kosztu dla urządzeń */}
            {(currentSelObj.type === 'circle' || currentSelObj.type === 'rect') && (
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Koszt (PLN)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentSelObj.cost === undefined ? '' : currentSelObj.cost}
                  onChange={e => updateSelectedProperty('cost', e.target.value)}
                  className="w-full text-sm font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition"
                  placeholder="Wpisz koszt urządzenia"
                />
              </div>
            )}

            {/* Wybór kształtu dla punktu/urządzenia */}
            {(currentSelObj.type === 'circle' || currentSelObj.type === 'rect') && (
              <div className="mb-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Kształt obiektu</label>
                <select
                  value={currentSelObj.type}
                  onChange={e => {
                    const newType = e.target.value;
                    if (newType === 'rect') {
                      updateSelectedProperty('type', 'rect');
                      updateSelectedProperty('w', 0.03);
                      updateSelectedProperty('h', 0.03);
                    } else if (newType === 'circle') {
                      updateSelectedProperty('type', 'circle');
                      updateSelectedProperty('r', 0.015);
                    }
                  }}
                  className="w-full text-sm font-semibold p-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="circle">Okrąg</option>
                  <option value="rect">Prostokąt/Kwadrat</option>
                </select>
              </div>
            )}

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><PaintBucket size={12}/> Wygląd Obiektu</label>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-10 h-10 rounded-xl shadow-sm overflow-hidden border border-slate-200 shrink-0 bg-white">
                  <input type="color" value={currentSelObj.color || LAYER_CONFIG[activeEditLayer].color} onChange={e => updateSelectedProperty('color', e.target.value)} className="absolute inset-0 w-[200%] h-[200%] -top-2 -left-2 cursor-pointer" />
                </div>
                <input type="text" value={currentSelObj.color || LAYER_CONFIG[activeEditLayer].color} onChange={e => updateSelectedProperty('color', e.target.value)} className="flex-1 text-sm font-mono font-bold p-2 rounded-lg border border-slate-200 uppercase bg-white" />
              </div>

              {/* Pola wymiarów zależne od typu */}
              <div className="grid grid-cols-2 gap-3">
                {currentSelObj.type === 'circle' && (
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Promień (m)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={currentSelObj.r && projectWidthM ? Number((currentSelObj.r * projectWidthM).toFixed(2)) : ''}
                      onChange={e => updateSelectedProperty('r', e.target.value === '' ? '' : parseFloat(e.target.value) / projectWidthM)}
                      className="w-full text-sm font-semibold p-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                )}
                {currentSelObj.type === 'rect' && (
                  <>
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Szerokość (m)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={currentSelObj.w && projectWidthM ? Number((currentSelObj.w * projectWidthM).toFixed(2)) : ''}
                        onChange={e => updateSelectedProperty('w', e.target.value === '' ? '' : parseFloat(e.target.value) / projectWidthM)}
                        className="w-full text-sm font-semibold p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Wysokość (m)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={currentSelObj.h && projectWidthM ? Number((currentSelObj.h * projectWidthM).toFixed(2)) : ''}
                        onChange={e => updateSelectedProperty('h', e.target.value === '' ? '' : parseFloat(e.target.value) / projectWidthM)}
                        className="w-full text-sm font-semibold p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </>
                )}
                {currentSelObj.type === 'line' && (
                  <>
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Grubość</label>
                      <input type="number" step="1" value={currentSelObj.thickness} onChange={e => updateSelectedProperty('thickness', e.target.value)} className="w-full text-sm font-semibold p-2 rounded-lg border border-slate-200 bg-white" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-indigo-600 uppercase mt-2">Koszt za 1 mb (PLN)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={currentSelObj.costPerMeter === undefined ? '' : currentSelObj.costPerMeter}
                        onChange={e => updateSelectedProperty('costPerMeter', e.target.value)}
                        className="w-full text-sm font-semibold p-2 rounded-lg border border-indigo-200 bg-indigo-50 focus:bg-white focus:border-indigo-500 outline-none transition mt-1"
                        placeholder="Wpisz koszt za mb"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {(currentSelObj.type === 'line' || currentSelObj.type === 'polygon') && (
              <div className="flex gap-2 mt-3">
                <button onClick={addNodeToLine} className="flex-1 py-2 bg-blue-600 text-white rounded font-bold text-xs hover:bg-blue-700 transition">+ Dodaj węzeł</button>
                <button onClick={removeNodeFromLine} className="flex-1 py-2 bg-red-100 text-red-700 rounded font-bold text-xs hover:bg-red-200 transition border border-red-200">- Usuń węzeł</button>
              </div>
            )}
            <button onClick={() => setSelectedElement(null)} className="w-full py-3 bg-emerald-500 text-white rounded-lg font-bold text-sm mt-4 hover:bg-emerald-600 transition shadow-md">✔ Zatwierdź obiekt</button>
          </div>
        )}
      </div>
    </div>
  );
}