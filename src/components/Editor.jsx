import React, { useState, useEffect, useRef } from 'react';
import { Layers, Save, Download, Upload, Menu, X, PlusCircle, Square, Activity, Trash2, Settings, MousePointerClick, ArrowLeft, XCircle, Ruler, BarChart2, Plus, Edit2, PlayCircle } from 'lucide-react';
import { LAYER_CONFIG, DEFAULT_DATA } from '../config';
import { renderCanvas } from '../utils/canvasRenderer';
import { calculateStats } from '../utils/statisticsEngine';

export default function Editor({ project, onSaveProject, onClose }) {
  const canvasRef = useRef(null);
  const [bgImage, setBgImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [installations, setInstallations] = useState(project.data || JSON.parse(JSON.stringify(DEFAULT_DATA)));
  const [backupInstallations, setBackupInstallations] = useState(null);

  // Migracja wsteczna dla starszych projektów (jeśli stary zapis, przekonwertuj w locie)
  useEffect(() => {
    if (project.data && !project.data.floors) {
      console.log('Migrating old project structure...');
      const migratedFloors = [];
      if (project.data.parter) migratedFloors.push({ id: 'parter', name: 'Parter', image: project.images?.parter || null, data: project.data.parter });
      if (project.data.pietro) migratedFloors.push({ id: 'pietro', name: 'Piętro', image: project.images?.pietro || null, data: project.data.pietro });
      setInstallations({ floors: migratedFloors });
      onSaveProject(project.id, { floors: migratedFloors });
    }
  }, []);

  const [activeFloor, setActiveFloor] = useState(installations.floors?.[0]?.id || null);
  const [editingFloorName, setEditingFloorName] = useState(null);
  const [newFloorName, setNewFloorName] = useState('');

  // Zabezpieczenie: jeśli nie ma wybranego piętra, ale istnieją piętra (np. z szablonu), wybierz pierwsze z brzegu.
  useEffect(() => {
    if (installations.floors && installations.floors.length > 0) {
      const floorExists = installations.floors.find(f => f.id === activeFloor);
      if (!floorExists) {
        setActiveFloor(installations.floors[0].id);
      }
    }
  }, [installations.floors, activeFloor]);
  
  const [activeLayers, setActiveLayers] = useState({ 
    co: true, wodkan: true, elektryka_punkty: true, elektryka_trasy: false, wentylacja: true 
  });
  const [previousLayers, setPreviousLayers] = useState(null);
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeEditLayer, setActiveEditLayer] = useState('co');
  const [selectedElement, setSelectedElement] = useState(null); 
  const [dragInfo, setDragInfo] = useState(null); 
  const [hoverInfo, setHoverInfo] = useState(null);

  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measureStart, setMeasureStart] = useState(null);
  const [measureEnd, setMeasureEnd] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [projectWidthM, setProjectWidthM] = useState(10); 

  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (!activeFloor || !installations.floors) {
       setBgImage(null); setImageLoaded(false); return;
    }
    const currentFloor = installations.floors.find(f => f.id === activeFloor);
    if (currentFloor && currentFloor.image) {
      const img = new Image();
      img.src = currentFloor.image;
      img.onload = () => { setBgImage(img); setImageLoaded(true); };
      img.onerror = () => { setBgImage(null); setImageLoaded(false); };
    } else {
      setBgImage(null); setImageLoaded(false);
    }
  }, [activeFloor, installations.floors]);

  useEffect(() => {
    if(!isEditMode) { 
      onSaveProject(project.id, installations);
    }
  }, [installations, isEditMode]);

  const handleFloorImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && activeFloor) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target.result;
        setInstallations(prev => {
          const copy = JSON.parse(JSON.stringify(prev));
          const floorIndex = copy.floors.findIndex(f => f.id === activeFloor);
          if(floorIndex > -1) copy.floors[floorIndex].image = base64Image;
          return copy;
        });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null; // Zabezpieczenie: czyszczenie inputu po wgraniu
  };

  const addFloor = () => {
    const newId = `floor_${Date.now()}`;
    const emptyData = { co: [], wodkan: [], elektryka_punkty: [], elektryka_trasy: [], wentylacja: [] };
    setInstallations(prev => ({
      ...prev,
      floors: [...(prev.floors || []), { id: newId, name: `Nowa Kondygnacja ${(prev.floors?.length || 0) + 1}`, image: null, data: emptyData }]
    }));
    setActiveFloor(newId);
  };

  const deleteFloor = (floorId) => {
    if(window.confirm('Usunąć tę kondygnację wraz ze wszystkimi instalacjami?')) {
       setInstallations(prev => {
         const newFloors = prev.floors.filter(f => f.id !== floorId);
         if(activeFloor === floorId) setActiveFloor(newFloors[0]?.id || null);
         return { ...prev, floors: newFloors };
       });
    }
  };

  const saveFloorName = (floorId) => {
    if(!newFloorName.trim()) return;
    setInstallations(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const floorIndex = copy.floors.findIndex(f => f.id === floorId);
      if(floorIndex > -1) copy.floors[floorIndex].name = newFloorName;
      return copy;
    });
    setEditingFloorName(null);
  };

  const toggleEditMode = () => {
    if (!isEditMode) {
      setBackupInstallations(JSON.parse(JSON.stringify(installations)));
      setPreviousLayers({ ...activeLayers });
      setIsMeasuring(false);
      
      const isolatedLayers = Object.keys(LAYER_CONFIG).reduce((acc, k) => ({...acc, [k]: k === activeEditLayer}), {});
      setActiveLayers(isolatedLayers);
      
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
      setBackupInstallations(null);
      setSelectedElement(null);
      if (previousLayers) setActiveLayers(previousLayers); 
    }
  };

  const cancelEditMode = () => {
    if(window.confirm('Na pewno chcesz anulować zmiany z tej sesji?')) {
      setInstallations(backupInstallations); 
      setIsEditMode(false);
      setBackupInstallations(null);
      setSelectedElement(null);
      if (previousLayers) setActiveLayers(previousLayers);
    }
  };

  const toggleMeasureMode = () => {
    setIsMeasuring(!isMeasuring);
    setMeasureStart(null);
    setMeasureEnd(null);
    if (!isMeasuring && isEditMode) toggleEditMode(); 
  };

  const getPointerPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;
    
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    return {
      x: ((clientX - rect.left) * (canvas.width / rect.width)) / canvas.width,
      y: ((clientY - rect.top) * (canvas.height / rect.height)) / canvas.height
    };
  };

  useEffect(() => { 
    if (imageLoaded && canvasRef.current) {
      renderCanvas({
        canvas: canvasRef.current, bgImage, installations, activeFloor, activeLayers,
        isEditMode, selectedElement, dragInfo,
        isMeasuring, measureStart, measureEnd, mousePos, projectWidthM
      });
    }
  }, [imageLoaded, activeLayers, bgImage, installations, isEditMode, dragInfo, selectedElement, isMeasuring, measureStart, measureEnd, mousePos, projectWidthM]);

  const handlePointerDown = (e) => {
    const pos = getPointerPos(e);

    if (isMeasuring) {
      if (!measureStart || measureEnd) {
        setMeasureStart(pos);
        setMeasureEnd(null);
      } else {
        setMeasureEnd(pos);
      }
      return;
    }

    if (!isEditMode || !canvasRef.current || !activeFloor) return;
    const floorData = installations.floors.find(f => f.id === activeFloor)?.data;
    if (!floorData) return;
    const layers = Object.keys(floorData).reverse();
    
    for (const lk of layers) {
      if (!activeLayers[lk]) continue;
      const els = floorData[lk];
      
      if (selectedElement && selectedElement.layerKey === lk) {
        const el = els[selectedElement.index];
        if (el && (el.type === 'line' || el.type === 'polygon')) {
           for (let j = 0; j < el.points.length; j++) {
             const [px, py] = el.points[j];
             if (Math.abs(pos.x - px) < 0.03 && Math.abs(pos.y - py) < 0.03 * (canvasRef.current.width/canvasRef.current.height)) {
                setDragInfo({ layerKey: lk, index: selectedElement.index, pointIndex: j });
                return;
             }
           }
        }
      }
      
      for (let i = els.length - 1; i >= 0; i--) {
        const el = els[i];
        let isHit = false;
        if (el.type === 'circle' && Math.hypot(pos.x - el.x, pos.y - el.y) < (el.r || 0.02) * 2) isHit = true;
        if (el.type === 'rect' && pos.x >= el.x && pos.x <= el.x + el.w && pos.y >= el.y && pos.y <= el.y + el.h) isHit = true;
        if (el.type === 'line' || el.type === 'polygon') {
           let minX = 1, maxX = 0, minY = 1, maxY = 0;
           el.points.forEach(p => { minX=Math.min(minX,p[0]); maxX=Math.max(maxX,p[0]); minY=Math.min(minY,p[1]); maxY=Math.max(maxY,p[1]); });
           if (pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY) isHit = true;
        }
        if (isHit) {
          setSelectedElement({ layerKey: lk, index: i });
          if (el.type === 'circle' || el.type === 'rect') setDragInfo({ layerKey: lk, index: i });
          return;
        }
      }
    }
    setSelectedElement(null);
  };

  const handlePointerMove = (e) => {
    const pos = getPointerPos(e);
    setMousePos(pos);

    if (dragInfo && activeFloor) {
      setInstallations(prev => {
        const copy = JSON.parse(JSON.stringify(prev));
        const floorIndex = copy.floors.findIndex(f => f.id === activeFloor);
        if (floorIndex === -1) return copy;
        const el = copy.floors[floorIndex].data[dragInfo.layerKey][dragInfo.index];
        if (dragInfo.pointIndex !== undefined) el.points[dragInfo.pointIndex] = [pos.x, pos.y];
        else { el.x = pos.x; el.y = pos.y; }
        return copy;
      });
    } else if (!isEditMode && !isMeasuring && e.type.includes('mouse') && activeFloor) {
      let hit = null;
      const floorData = installations.floors.find(f => f.id === activeFloor)?.data;
      if (!floorData) return;
      Object.entries(floorData).forEach(([lk, els]) => {
        if (!activeLayers[lk] || hit) return;
        els.forEach(el => {
           if (el.type === 'circle' && Math.hypot(pos.x - el.x, pos.y - el.y) < (el.r || 0.015)) hit = { ...el, lk };
           if (el.type === 'rect' && pos.x >= el.x && pos.x <= el.x + el.w && pos.y >= el.y && pos.y <= el.y + el.h) hit = { ...el, lk };
        });
      });
      setHoverInfo(hit ? { x: e.clientX, y: e.clientY, label: hit.label, desc: hit.desc, color: hit.color || LAYER_CONFIG[hit.lk].color } : null);
    }
  };

  const handlePointerUp = () => setDragInfo(null);

  const addNewElement = (type) => {
    if (!activeEditLayer || !activeFloor) return;
    const newEl = { id: `el_${Date.now()}`, type, color: LAYER_CONFIG[activeEditLayer].color, label: 'Nowy Obiekt', desc: '' };
    if(type === 'circle') { newEl.x = 0.5; newEl.y = 0.5; newEl.r = 0.015; }
    if(type === 'rect') { newEl.x = 0.5; newEl.y = 0.5; newEl.w = 0.03; newEl.h = 0.03; }
    if(type === 'line') { newEl.points = [[0.4, 0.5], [0.6, 0.5]]; newEl.thickness = 3; }
    if(type === 'polygon') { newEl.points = [[0.4, 0.4], [0.6, 0.4], [0.6, 0.6], [0.4, 0.6]]; }

    setInstallations(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const floorIndex = copy.floors.findIndex(f => f.id === activeFloor);
      copy.floors[floorIndex].data[activeEditLayer].push(newEl);
      return copy;
    });
    const currFloorData = installations.floors.find(f => f.id === activeFloor).data;
    setSelectedElement({ layerKey: activeEditLayer, index: currFloorData[activeEditLayer].length });
  };

  const deleteSelected = () => {
    if (!selectedElement || !activeFloor) return;
    setInstallations(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const floorIndex = copy.floors.findIndex(f => f.id === activeFloor);
      copy.floors[floorIndex].data[selectedElement.layerKey].splice(selectedElement.index, 1);
      return copy;
    });
    setSelectedElement(null);
  };

  const addNodeToLine = () => {
    if (!selectedElement || !activeFloor) return;
    setInstallations(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const floorIndex = copy.floors.findIndex(f => f.id === activeFloor);
      const el = copy.floors[floorIndex].data[selectedElement.layerKey][selectedElement.index];
      if (el.points && el.points.length > 0) {
        const lastP = el.points[el.points.length - 1];
        el.points.push([lastP[0] + 0.05, lastP[1] + 0.05]);
      }
      return copy;
    });
  };

  const updateSelectedProperty = (key, value) => {
    if (!selectedElement || !activeFloor) return;
    setInstallations(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const floorIndex = copy.floors.findIndex(f => f.id === activeFloor);
      const el = copy.floors[floorIndex].data[selectedElement.layerKey][selectedElement.index];
      if (['r', 'w', 'h', 'thickness'].includes(key)) el[key] = parseFloat(value) || 0.01;
      else el[key] = value;
      return copy;
    });
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(installations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `${project.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.json`);
    linkElement.click();
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = readerEvent => {
        try {
          const content = JSON.parse(readerEvent.target.result);
          setInstallations(content);
          onSaveProject(project.id, content);
        } catch (err) { alert("Błąd pliku JSON."); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const currentFloorData = activeFloor ? installations.floors?.find(f => f.id === activeFloor)?.data : null;
  const currentSelObj = (selectedElement && currentFloorData) ? currentFloorData[selectedElement.layerKey][selectedElement.index] : null;
  const currentStats = calculateStats(installations, bgImage, projectWidthM);

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden relative w-full">
      <div className="md:hidden absolute top-0 left-0 right-0 h-14 bg-slate-900 z-40 flex items-center justify-between px-2 shadow-md text-white">
         <button onClick={onClose} className="p-2 text-slate-300 hover:text-white transition">
           <ArrowLeft size={20}/>
         </button>
         <div className="font-bold truncate flex-1 text-center px-2">{project.name}</div>
         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-800 rounded">
           {isSidebarOpen ? <X size={20}/> : <Menu size={20}/>}
         </button>
      </div>

      {showStats && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/90 backdrop-blur pb-4 border-b z-10">
               <h2 className="text-2xl font-extrabold flex items-center gap-3 text-slate-800">
                 <BarChart2 className="text-blue-600" size={28}/> Zestawienie Materiałów
               </h2>
               <button onClick={() => setShowStats(false)} className="text-slate-400 hover:text-red-500 transition bg-slate-100 hover:bg-red-50 p-2 rounded-full"><X size={20}/></button>
             </div>
             
             {Object.entries(currentStats).map(([floor, layers]) => {
               const floorTotalCount = Object.values(layers).reduce((sum, d) => sum + d.count, 0);
               const floorTotalLength = Object.values(layers).reduce((sum, d) => sum + parseFloat(d.length || 0), 0);
               
               return (
                 <div key={floor} className="mb-8">
                   <div className="flex justify-between items-end mb-4 border-b-2 border-slate-100 pb-2">
                     <h3 className="font-extrabold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                       <Layers size={18} className="text-slate-400"/> 
                       Kondygnacja: {floor === 'parter' ? 'Parter' : 'Piętro'}
                     </h3>
                     {Object.keys(layers).length > 0 && (
                       <div className="text-[10px] font-bold text-slate-400 flex gap-3 uppercase bg-slate-50 p-1.5 rounded-lg border">
                         <span>Suma Pkt: <b className="text-slate-700">{floorTotalCount}</b></span>
                         <span>Suma Trasy: <b className="text-blue-600">{floorTotalLength.toFixed(1)}m</b></span>
                       </div>
                     )}
                   </div>

                   {Object.keys(layers).length === 0 ? (
                     <p className="text-sm text-slate-400 italic text-center p-6 bg-slate-50 rounded-xl border border-dashed">Brak narysowanych instalacji na tej kondygnacji.</p>
                   ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {Object.entries(layers).map(([layer, data]) => {
                         const LayerIcon = LAYER_CONFIG[layer]?.Icon || Activity;
                         return (
                           <div key={layer} className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition flex flex-col justify-between group">
                             <div className="flex items-center gap-3 mb-3">
                               <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-inner transition-transform group-hover:scale-105" style={{backgroundColor: LAYER_CONFIG[layer].color}}>
                                 <LayerIcon size={20} />
                               </div>
                               <span className="font-bold text-slate-800">{LAYER_CONFIG[layer].name}</span>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-2 mt-auto">
                               <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                                 <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Urządzenia / Pkt</p>
                                 <p className="font-extrabold text-lg text-slate-700">{data.count} <span className="text-xs font-normal text-slate-500">szt.</span></p>
                               </div>
                               <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100/50 text-center">
                                 <p className="text-[10px] uppercase font-bold text-blue-400 mb-0.5">Trasy / Rury</p>
                                 <p className="font-extrabold text-lg text-blue-700">{data.length} <span className="text-xs font-normal text-blue-500">mb</span></p>
                               </div>
                             </div>
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
      )}

      <div className={`absolute md:relative top-14 md:top-0 left-0 w-80 h-[calc(100vh-3.5rem)] md:h-screen bg-white border-r flex flex-col shadow-2xl z-30 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="hidden md:flex p-6 bg-slate-900 text-white flex-col justify-between h-32 shrink-0">
          <div>
            <h1 className="text-xl font-bold truncate">{project.name}</h1>
            <p className="text-[10px] uppercase opacity-50 tracking-widest">Edytor Projektu</p>
          </div>
          <button onClick={onClose} className="flex items-center gap-1 text-xs text-blue-300 hover:text-white transition w-fit">
            <ArrowLeft size={14}/> Wróć do projektów
          </button>
        </div>

        <div className="p-4 border-b space-y-2 bg-slate-50 shrink-0">
           {!isEditMode && !isMeasuring ? (
             <>
               <button onClick={toggleEditMode} className="w-full flex items-center justify-center gap-2 p-3 rounded-lg font-bold transition shadow-sm bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 mb-2">
                 <Settings size={18} /> Włącz Tryb Edycji
               </button>
               <div className="grid grid-cols-2 gap-2">
                 <button onClick={toggleMeasureMode} className="flex items-center justify-center gap-2 p-2 rounded-lg font-bold transition shadow-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs border border-indigo-200">
                   <Ruler size={14} /> Mierzenie
                 </button>
                 <button onClick={() => setShowStats(true)} className="flex items-center justify-center gap-2 p-2 rounded-lg font-bold transition shadow-sm bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs border border-emerald-200">
                   <BarChart2 size={14} /> Statystyki
                 </button>
               </div>
             </>
           ) : isEditMode ? (
             <div className="grid grid-cols-2 gap-2">
               <button onClick={toggleEditMode} className="flex items-center justify-center gap-2 p-2 rounded-lg font-bold transition shadow-sm bg-green-600 hover:bg-green-700 text-white text-xs">
                 <Save size={14} /> Zapisz
               </button>
               <button onClick={cancelEditMode} className="flex items-center justify-center gap-2 p-2 rounded-lg font-bold transition shadow-sm bg-red-100 hover:bg-red-200 text-red-700 text-xs border border-red-300">
                 <XCircle size={14} /> Anuluj
               </button>
             </div>
           ) : (
             <button onClick={toggleMeasureMode} className="w-full flex items-center justify-center gap-2 p-3 rounded-lg font-bold transition shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white">
               <XCircle size={18} /> Zakończ Mierzenie
             </button>
           )}

           {!isEditMode && !isMeasuring && (
             <div className="grid grid-cols-2 gap-2 mt-2">
               <button onClick={handleExportData} className="flex items-center justify-center gap-1 p-2 text-[10px] font-bold bg-white border rounded hover:bg-slate-100"><Download size={14}/> Eksport JSON</button>
               <button onClick={handleImportData} className="flex items-center justify-center gap-1 p-2 text-[10px] font-bold bg-white border rounded hover:bg-slate-100"><Upload size={14}/> Import JSON</button>
             </div>
           )}
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {/* NOWY MENEDŻER KONDYGNACJI */}
          {!isEditMode && !isMeasuring && (
            <div className="mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kondygnacje Projektu</h2>
                <button onClick={addFloor} className="text-blue-600 hover:bg-blue-100 p-1 rounded transition"><Plus size={16}/></button>
              </div>
              <div className="space-y-2">
                {installations.floors?.map(floor => (
                  <div key={floor.id} className={`flex items-center justify-between p-2 rounded-lg border transition ${activeFloor === floor.id ? 'bg-white border-blue-300 shadow-sm ring-1 ring-blue-500' : 'bg-transparent border-slate-200 hover:border-slate-300'}`}>
                     {editingFloorName === floor.id ? (
                       <div className="flex gap-1 flex-1 mr-2">
                         <input type="text" autoFocus value={newFloorName} onChange={e => setNewFloorName(e.target.value)} onKeyDown={e => e.key==='Enter' && saveFloorName(floor.id)} className="w-full text-xs p-1 rounded border border-blue-400" />
                         <button onClick={() => saveFloorName(floor.id)} className="text-green-600"><Save size={14}/></button>
                       </div>
                     ) : (
                       <button onClick={() => setActiveFloor(floor.id)} className="flex-1 text-left text-sm font-semibold truncate text-slate-700">{floor.name}</button>
                     )}
                     
                     <div className="flex gap-1 opacity-50 hover:opacity-100 transition">
                       <button onClick={() => { setEditingFloorName(floor.id); setNewFloorName(floor.name); }} className="p-1 text-slate-500 hover:text-blue-600"><Edit2 size={14}/></button>
                       <button onClick={() => deleteFloor(floor.id)} className="p-1 text-slate-500 hover:text-red-500"><Trash2 size={14}/></button>
                     </div>
                  </div>
                ))}
                {(!installations.floors || installations.floors.length === 0) && (
                   <div className="text-center p-4 text-xs text-slate-400 border border-dashed rounded-lg">Brak kondygnacji. Dodaj pierwszą!</div>
                )}
              </div>
            </div>
          )}

          {isMeasuring ? (
            <div className="space-y-4">
               <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                 <h3 className="font-bold text-indigo-800 text-sm mb-2 flex items-center gap-2"><Ruler size={16}/> Narzędzie miary</h3>
                 <p className="text-xs text-indigo-600/80 mb-4">Kliknij na rzucie dwa punkty, aby zmierzyć odległość w linii prostej.</p>
                 
                 <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Szerokość budynku (m)</label>
                 <input 
                    type="number" 
                    value={projectWidthM} 
                    onChange={e => setProjectWidthM(parseFloat(e.target.value) || 1)}
                    className="w-full text-sm p-2 rounded border border-indigo-200 focus:ring-indigo-500"
                    placeholder="np. 10"
                 />
                 <p className="text-[10px] text-slate-500 mt-1">Ustaw rzeczywistą szerokość rzutu dla poprawnej skali.</p>
               </div>
            </div>
          ) : isEditMode ? (
            <div className="space-y-6">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-inner">
                <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">Edytowana Warstwa</h3>
                <select 
                  value={activeEditLayer} 
                  onChange={(e) => {
                    const newLayer = e.target.value;
                    setActiveEditLayer(newLayer);
                    setActiveLayers(Object.keys(LAYER_CONFIG).reduce((acc, k) => ({...acc, [k]: k === newLayer}), {}));
                    setSelectedElement(null);
                  }} 
                  className="w-full font-bold text-sm p-2 mb-3 rounded border-slate-300 focus:ring-blue-500"
                >
                  {Object.entries(LAYER_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.name}</option>)}
                </select>
                
                <h3 className="text-[10px] font-bold uppercase text-slate-400 mb-1 border-t pt-2">Dodaj Nowy Obiekt</h3>
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={()=>addNewElement('circle')} className="p-2 bg-white border rounded text-xs flex items-center gap-1 hover:bg-blue-50"><PlusCircle size={14}/> Punkt / Złącze</button>
                   <button onClick={()=>addNewElement('rect')} className="p-2 bg-white border rounded text-xs flex items-center gap-1 hover:bg-blue-50"><Square size={14}/> Urządzenie</button>
                   <button onClick={()=>addNewElement('line')} className="p-2 bg-white border rounded text-xs flex items-center gap-1 hover:bg-blue-50"><Activity size={14}/> Rura / Kabel</button>
                   <button onClick={()=>addNewElement('polygon')} className="p-2 bg-white border rounded text-xs flex items-center gap-1 hover:bg-blue-50"><Layers size={14}/> Strefa</button>
                </div>
              </div>

              {currentSelObj ? (
                 <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-md">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xs font-bold uppercase text-blue-800">Właściwości Elementu</h3>
                      <button onClick={deleteSelected} className="text-red-500 bg-white hover:bg-red-100 p-1.5 rounded transition border border-red-200"><Trash2 size={16}/></button>
                    </div>
                    <div className="space-y-3">
                      <div><label className="text-[10px] font-bold text-slate-500 uppercase">Nazwa</label><input type="text" value={currentSelObj.label || ''} onChange={e => updateSelectedProperty('label', e.target.value)} className="w-full text-sm p-1.5 rounded border border-slate-300" /></div>
                      <div><label className="text-[10px] font-bold text-slate-500 uppercase">Opis</label><textarea value={currentSelObj.desc || ''} onChange={e => updateSelectedProperty('desc', e.target.value)} className="w-full text-sm p-1.5 rounded border border-slate-300 h-16 resize-none" /></div>
                      
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Wybierz Kolor</label>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="relative w-8 h-8 rounded shadow overflow-hidden border border-slate-300 cursor-pointer shrink-0">
                            <input type="color" value={currentSelObj.color || LAYER_CONFIG[activeEditLayer].color} onChange={e => updateSelectedProperty('color', e.target.value)} className="absolute inset-0 w-[200%] h-[200%] -top-2 -left-2 cursor-pointer" />
                          </div>
                          <input type="text" value={currentSelObj.color || ''} onChange={e => updateSelectedProperty('color', e.target.value)} className="w-full text-sm p-1.5 rounded border border-slate-300 uppercase font-mono" placeholder="#000000" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {(currentSelObj.type === 'circle') && (<div><label className="text-[10px] font-bold text-slate-500 uppercase">Promień</label><input type="number" step="0.005" value={currentSelObj.r} onChange={e => updateSelectedProperty('r', e.target.value)} className="w-full text-sm p-1.5 rounded border border-slate-300" /></div>)}
                        {(currentSelObj.type === 'line') && (<div><label className="text-[10px] font-bold text-slate-500 uppercase">Grubość Linii</label><input type="number" step="1" value={currentSelObj.thickness} onChange={e => updateSelectedProperty('thickness', e.target.value)} className="w-full text-sm p-1.5 rounded border border-slate-300" /></div>)}
                      </div>
                      
                      {(currentSelObj.type === 'line' || currentSelObj.type === 'polygon') && (<button onClick={addNodeToLine} className="w-full py-2 bg-blue-600 text-white rounded font-bold text-xs mt-3 hover:bg-blue-700 shadow-sm transition">Dodaj Węzeł Ścieżki</button>)}
                    </div>
                 </div>
              ) : (
                <div className="text-center p-6 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50"><MousePointerClick size={32} className="mx-auto mb-2 opacity-50"/><p className="text-xs font-medium">Kliknij obiekt na rzucie, by go edytować.</p></div>
              )}
            </div>
          ) : (
            <>
              <h2 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Widoczność Warstw</h2>
              <div className="space-y-1">
                {Object.entries(LAYER_CONFIG).map(([key, cfg]) => {
                  const IconComponent = cfg.Icon;
                  return (
                  <label key={key} className={`flex items-center p-2 rounded-lg cursor-pointer border transition ${activeLayers[key] ? 'bg-white shadow-sm border-slate-200' : 'bg-transparent border-transparent hover:bg-slate-50'}`}>
                    <input type="checkbox" checked={activeLayers[key]} onChange={() => setActiveLayers(p => ({...p, [key]: !p[key]}))} className="w-4 h-4 rounded mr-3 text-blue-600" />
                    <span className="flex items-center justify-center w-7 h-7 rounded-full text-white mr-3 shadow-inner" style={{backgroundColor: cfg.color}}><IconComponent size={18} /></span>
                    <span className="text-xs font-semibold text-slate-700">{cfg.name}</span>
                  </label>
                )})}
              </div>
            </>
          )}
        </div>
      </div>

      <div className={`flex-1 relative bg-slate-200 flex items-center justify-center p-2 md:p-8 mt-14 md:mt-0 overflow-auto ${isMeasuring ? 'cursor-crosshair' : ''}`}>
        
        {(!installations.floors || installations.floors.length === 0) && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white p-4">
             <div className="max-w-2xl w-full">
               <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative mb-8 group cursor-pointer border-4 border-slate-800">
                  {/* Placeholder Wideo Wprowadzającego */}
                  <video 
                     className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500" 
                     autoPlay loop muted playsInline
                  >
                     <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition">
                     <div className="bg-white/20 p-4 rounded-full backdrop-blur-md">
                       <PlayCircle size={64} className="text-white drop-shadow-lg" />
                     </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                     <h2 className="text-white text-2xl font-bold">Witaj w MepPlanner!</h2>
                     <p className="text-slate-200 text-sm">Zanim zaczniesz, zobacz krótki tutorial (1 min)</p>
                  </div>
               </div>
               
               <div className="text-center">
                 <button onClick={addFloor} className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 hover:scale-105 transition shadow-xl flex items-center gap-3 mx-auto">
                   <PlusCircle size={24}/> Dodaj pierwszą kondygnację
                 </button>
               </div>
             </div>
          </div>
        )}

        {(installations.floors?.length > 0 && !imageLoaded) && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4">
             <div className="text-center p-6 md:p-8 border-2 border-dashed border-slate-300 rounded-3xl max-w-sm bg-white shadow-2xl">
               <Layers size={40} className="mx-auto mb-4 text-slate-300" />
               <p className="font-bold text-slate-800 mb-2">Brak pliku rzutu</p>
               <p className="text-xs text-slate-500 mb-4 leading-relaxed">Wgraj plan architektoniczny dla kondygnacji:<br/><b className="text-blue-600">{installations.floors.find(f => f.id === activeFloor)?.name || 'Nie wybrano'}</b></p>
               
               <label className="cursor-pointer bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition inline-block shadow-sm">
                 Wgraj rzut JPG/PNG
                 <input type="file" accept="image/*" className="hidden" onChange={handleFloorImageUpload} />
               </label>
             </div>
          </div>
        )}

        <div className="relative shadow-2xl bg-white border border-slate-300 touch-none">
          <canvas 
             ref={canvasRef} 
             onMouseDown={handlePointerDown} 
             onMouseMove={handlePointerMove} 
             onMouseUp={handlePointerUp} 
             onMouseLeave={handlePointerUp} 
             onTouchStart={handlePointerDown} 
             onTouchMove={handlePointerMove} 
             onTouchEnd={handlePointerUp} 
             className={`max-w-full max-h-[85vh] ${(isEditMode || isMeasuring) ? 'cursor-crosshair' : 'cursor-default'}`} 
             style={{ touchAction: 'none' }} 
          />
        </div>
        {!isEditMode && !isMeasuring && hoverInfo && (
          <div className="hidden md:block fixed z-50 bg-white/95 backdrop-blur text-slate-800 p-4 rounded-xl shadow-2xl border border-slate-100 max-w-xs pointer-events-none transform -translate-x-1/2 -translate-y-full" style={{ left: hoverInfo.x, top: hoverInfo.y - 20 }}>
            <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: hoverInfo.color }}></div><h3 className="font-extrabold text-sm">{String(hoverInfo.label)}</h3></div>
            {hoverInfo.desc && <p className="text-[10px] text-slate-500 font-medium mt-1">{String(hoverInfo.desc)}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
