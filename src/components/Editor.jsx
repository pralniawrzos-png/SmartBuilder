import React, { useState, useEffect, useRef } from 'react';
import { Layers, Upload, PlayCircle, PlusCircle } from 'lucide-react';
import { LAYER_CONFIG, DEFAULT_DATA } from '../config';
import { renderCanvas } from '../utils/canvasRenderer';
import { calculateStats } from '../utils/statisticsEngine';

// Importujemy zrefaktoryzowane komponenty UI
import TopToolbar from './editor/TopToolbar';
import LeftSidebar from './editor/LeftSidebar';
import BottomTools from './editor/BottomTools';
import RightProperties from './editor/RightProperties';
import StatsPanel from './editor/StatsPanel';
import AiAssistant from './editor/AiAssistant';

export default function Editor({ project, onSaveProject, onClose }) {
  const canvasRef = useRef(null);
  const [bgImage, setBgImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const [installations, setInstallations] = useState(() => {
    const data = project.data ? JSON.parse(JSON.stringify(project.data)) : JSON.parse(JSON.stringify(DEFAULT_DATA));
    // Automatyczna migracja starych projektów (wodkan -> woda + kanalizacja) na gorąco!
    if (data.floors) {
       data.floors.forEach(floor => {
          if (floor.data.wodkan) {
             floor.data.woda = floor.data.wodkan.filter(el => el.color === '#0284c7' || el.color === '#0ea5e9' || el.label?.toLowerCase().includes('wod'));
             floor.data.kanalizacja = floor.data.wodkan.filter(el => !(el.color === '#0284c7' || el.color === '#0ea5e9' || el.label?.toLowerCase().includes('wod')));
             delete floor.data.wodkan;
          }
          if (!floor.data.woda) floor.data.woda = [];
          if (!floor.data.kanalizacja) floor.data.kanalizacja = [];
       });
    }
    return data;
  });
  const [backupInstallations, setBackupInstallations] = useState(null);

  useEffect(() => {
    if (project.data && !project.data.floors) {
      const migratedFloors = [];
      if (project.data.parter) migratedFloors.push({ id: 'parter', name: 'Parter', image: project.images?.parter || null, data: project.data.parter });
      if (project.data.pietro) migratedFloors.push({ id: 'pietro', name: 'Piętro', image: project.images?.pietro || null, data: project.data.pietro });
      
      // Zabezpieczenie migracyjne dla starej struktury przed samym zapisem
      migratedFloors.forEach(floor => {
          if (floor.data.wodkan) {
             floor.data.woda = floor.data.wodkan.filter(el => el.color === '#0284c7' || el.color === '#0ea5e9' || el.label?.toLowerCase().includes('wod'));
             floor.data.kanalizacja = floor.data.wodkan.filter(el => !(el.color === '#0284c7' || el.color === '#0ea5e9' || el.label?.toLowerCase().includes('wod')));
             delete floor.data.wodkan;
          }
          if (!floor.data.woda) floor.data.woda = [];
          if (!floor.data.kanalizacja) floor.data.kanalizacja = [];
      });
      
      setInstallations({ floors: migratedFloors });
      onSaveProject(project.id, { floors: migratedFloors });
    }
  }, []);

  const [activeFloor, setActiveFloor] = useState(installations.floors?.[0]?.id || null);
  const [editingFloorName, setEditingFloorName] = useState(null);
  const [newFloorName, setNewFloorName] = useState('');

  useEffect(() => {
    if (installations.floors && installations.floors.length > 0) {
      const floorExists = installations.floors.find(f => f.id === activeFloor);
      if (!floorExists) setActiveFloor(installations.floors[0].id);
    }
  }, [installations.floors, activeFloor]);
  
  const [activeLayers, setActiveLayers] = useState({ co: false, wentylacja: false, woda: false, kanalizacja: false, elektryka_punkty: false, elektryka_trasy: false });
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!activeFloor || !installations.floors) { setBgImage(null); setImageLoaded(false); return; }
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

  useEffect(() => { if(!isEditMode) onSaveProject(project.id, installations); }, [installations, isEditMode]);

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
    e.target.value = null;
  };

  const addFloor = () => {
    const newId = `floor_${Date.now()}`;
    const emptyData = { co: [], wentylacja: [], woda: [], kanalizacja: [], elektryka_punkty: [], elektryka_trasy: [] };
    setInstallations(prev => ({ ...prev, floors: [...(prev.floors || []), { id: newId, name: `Nowa Kondygnacja`, image: null, data: emptyData }] }));
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
      setShowStats(false);
      const isolatedLayers = Object.keys(LAYER_CONFIG).reduce((acc, k) => ({...acc, [k]: k === activeEditLayer}), {});
      setActiveLayers(isolatedLayers);
      setIsEditMode(true);
    } else {
      setIsEditMode(false); setBackupInstallations(null); setSelectedElement(null);
      if (previousLayers) setActiveLayers(previousLayers); 
    }
  };

  const cancelEditMode = () => {
    if(window.confirm('Na pewno anulować zmiany?')) {
      setInstallations(backupInstallations); setIsEditMode(false); setBackupInstallations(null); setSelectedElement(null);
      if (previousLayers) setActiveLayers(previousLayers);
    }
  };

  const toggleMeasureMode = () => {
    setIsMeasuring(!isMeasuring); setMeasureStart(null); setMeasureEnd(null);
    if (!isMeasuring && isEditMode) toggleEditMode(); 
  };

  const getPointerPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX = e.clientX; let clientY = e.clientY;
    if (e.touches && e.touches.length > 0) { clientX = e.touches[0].clientX; clientY = e.touches[0].clientY; }
    return { x: ((clientX - rect.left) * (canvas.width / rect.width)) / canvas.width, y: ((clientY - rect.top) * (canvas.height / rect.height)) / canvas.height };
  };

  useEffect(() => { 
    if (canvasRef.current) {
      renderCanvas({ canvas: canvasRef.current, bgImage, installations, activeFloor, activeLayers, isEditMode, selectedElement, dragInfo, isMeasuring, measureStart, measureEnd, mousePos, projectWidthM });
    }
  }, [imageLoaded, activeLayers, bgImage, installations, isEditMode, dragInfo, selectedElement, isMeasuring, measureStart, measureEnd, mousePos, projectWidthM, activeFloor]);

  const handlePointerDown = (e) => {
    const pos = getPointerPos(e);
    if (isMeasuring) {
      if (!measureStart || measureEnd) { setMeasureStart(pos); setMeasureEnd(null); } else { setMeasureEnd(pos); }
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
                setDragInfo({ layerKey: lk, index: selectedElement.index, pointIndex: j }); return;
             }
           }
        }
      }
      for (let i = els.length - 1; i >= 0; i--) {
        const el = els[i]; let isHit = false;
        if (el.type === 'circle' && Math.hypot(pos.x - el.x, pos.y - el.y) < (el.r || 0.02) * 2) isHit = true;
        if (el.type === 'rect' && pos.x >= el.x && pos.x <= el.x + el.w && pos.y >= el.y && pos.y <= el.y + el.h) isHit = true;
        if (el.type === 'line' || el.type === 'polygon') {
           let minX = 1, maxX = 0, minY = 1, maxY = 0;
           el.points.forEach(p => { minX=Math.min(minX,p[0]); maxX=Math.max(maxX,p[0]); minY=Math.min(minY,p[1]); maxY=Math.max(maxY,p[1]); });
           if (pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY) isHit = true;
        }
        if (isHit) { setSelectedElement({ layerKey: lk, index: i }); if (el.type === 'circle' || el.type === 'rect') setDragInfo({ layerKey: lk, index: i }); return; }
      }
    }
    setSelectedElement(null);
  };

  const handlePointerMove = (e) => {
    const pos = getPointerPos(e); setMousePos(pos);
    if (dragInfo && activeFloor) {
      setInstallations(prev => {
        const copy = JSON.parse(JSON.stringify(prev));
        const floorIndex = copy.floors.findIndex(f => f.id === activeFloor);
        if (floorIndex === -1) return copy;
        const el = copy.floors[floorIndex].data[dragInfo.layerKey][dragInfo.index];
        if (dragInfo.pointIndex !== undefined) el.points[dragInfo.pointIndex] = [pos.x, pos.y]; else { el.x = pos.x; el.y = pos.y; }
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
      if (['r', 'w', 'h', 'thickness'].includes(key)) el[key] = parseFloat(value) || 0.01; else el[key] = value;
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
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'application/json';
    input.onchange = e => {
      const file = e.target.files[0]; const reader = new FileReader();
      reader.onload = readerEvent => {
        try { const content = JSON.parse(readerEvent.target.result); setInstallations(content); onSaveProject(project.id, content); } catch (err) { alert("Błąd pliku JSON."); }
      }; reader.readAsText(file);
    }; input.click();
  };

  const currentFloorData = activeFloor ? installations.floors?.find(f => f.id === activeFloor)?.data : null;
  const currentSelObj = (selectedElement && currentFloorData) ? currentFloorData[selectedElement.layerKey][selectedElement.index] : null;
  const currentStats = calculateStats(installations, bgImage, projectWidthM);

  return (
    <div className="flex h-screen bg-[#F0F2F5] font-sans overflow-hidden relative w-full text-slate-800">
      
      {/* 🔴 TŁO KROPKOWE DLA CANVASU */}
      {imageLoaded && <div className="absolute inset-0 pointer-events-none opacity-40 z-0" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>}

      <StatsPanel showStats={showStats} setShowStats={setShowStats} currentStats={currentStats} />

      {/* ZMIANA: Dodano md:pl-[300px] by ekran powitalny nie wjeżdżał pod lewy panel */}
      <div className="absolute inset-0 z-10 flex items-center justify-center overflow-auto touch-none md:pl-[300px]">
        {(!installations.floors || installations.floors.length === 0) && (
          <div className="max-w-3xl w-full mx-auto px-8 z-20">
             <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative mb-10 group cursor-pointer border-8 border-slate-800 ring-4 ring-white/50">
                <video className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition duration-700" autoPlay loop muted playsInline>
                   <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition duration-500">
                   <div className="bg-white/20 p-5 rounded-full backdrop-blur-lg transform group-hover:scale-110 transition duration-300">
                     <PlayCircle size={72} className="text-white drop-shadow-xl" strokeWidth={1.5} />
                   </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                   <h2 className="text-white text-3xl font-black mb-2 tracking-tight">Witaj w SmartBuilder!</h2>
                   <p className="text-slate-300 font-medium text-lg">Zobacz krótki tutorial i zacznij projektować jak profesjonalista.</p>
                </div>
             </div>
             <div className="text-center">
               <button onClick={addFloor} className="bg-indigo-600 text-white px-10 py-5 rounded-2xl text-xl font-black hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-xl shadow-indigo-200 flex items-center gap-3 mx-auto">
                 <PlusCircle size={28}/> Dodaj pierwszą kondygnację
               </button>
             </div>
          </div>
        )}

        {(installations.floors?.length > 0 && !imageLoaded) && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/5 backdrop-blur-sm p-4">
             <div className="text-center p-10 border border-slate-200 rounded-[2rem] max-w-md bg-white/95 shadow-2xl backdrop-blur-xl">
               <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><Layers size={40} /></div>
               <h2 className="font-black text-2xl text-slate-800 mb-2 tracking-tight">Brak rzutu architektonicznego</h2>
               <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">Aby rozpocząć rysowanie instalacji, wgraj podkład dla kondygnacji:<br/><b className="text-indigo-600 text-base block mt-2">{installations.floors.find(f => f.id === activeFloor)?.name || 'Nie wybrano'}</b></p>
               <label className="cursor-pointer bg-slate-900 text-white px-6 py-4 rounded-xl text-sm font-bold hover:bg-black transition-transform hover:scale-105 shadow-xl inline-flex items-center gap-2">
                 <Upload size={18}/> Wgraj rzut JPG/PNG
                 <input type="file" accept="image/*" className="hidden" onChange={handleFloorImageUpload} />
               </label>
             </div>
          </div>
        )}

        {installations.floors?.length > 0 && (
          <div className="relative shadow-[0_0_50px_rgba(0,0,0,0.1)] bg-white border border-slate-200 ring-8 ring-white/50 rounded-lg overflow-auto mt-20 md:mt-0">
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
              style={{ touchAction: (isEditMode || isMeasuring) ? 'none' : 'auto' }}
            />
          </div>
        )}
      </div>

      <TopToolbar 
         projectName={project.name}
         onClose={onClose}
         isEditMode={isEditMode}
         isMeasuring={isMeasuring}
         showStats={showStats}
         setShowStats={setShowStats}
         isSidebarOpen={isSidebarOpen}
         setIsSidebarOpen={setIsSidebarOpen}
         toggleEditMode={toggleEditMode}
         cancelEditMode={cancelEditMode}
         toggleMeasureMode={toggleMeasureMode}
         handleExportData={handleExportData}
      />

      <LeftSidebar 
         installations={installations}
         activeFloor={activeFloor}
         setActiveFloor={setActiveFloor}
         addFloor={addFloor}
         deleteFloor={deleteFloor}
         editingFloorName={editingFloorName}
         setEditingFloorName={setEditingFloorName}
         newFloorName={newFloorName}
         setNewFloorName={setNewFloorName}
         saveFloorName={saveFloorName}
         isEditMode={isEditMode}
         isMeasuring={isMeasuring}
         activeLayers={activeLayers}
         setActiveLayers={setActiveLayers}
         activeEditLayer={activeEditLayer}
         setActiveEditLayer={setActiveEditLayer}
         setSelectedElement={setSelectedElement}
         projectWidthM={projectWidthM}
         setProjectWidthM={setProjectWidthM}
         isSidebarOpen={isSidebarOpen}
      />

      {isEditMode && <BottomTools activeEditLayer={activeEditLayer} addNewElement={addNewElement} />}

      {isEditMode && currentSelObj && (
        <RightProperties 
          currentSelObj={currentSelObj}
          activeEditLayer={activeEditLayer}
          updateSelectedProperty={updateSelectedProperty}
          deleteSelected={deleteSelected}
          addNodeToLine={addNodeToLine}
        />
      )}

      {/* TOOLTIPY HOVER (Podgląd obiektu) */}
      {!isEditMode && !isMeasuring && hoverInfo && (
        <div className="absolute z-50 pointer-events-none transform -translate-x-1/2 -translate-y-[120%]" style={{ left: hoverInfo.x, top: hoverInfo.y }}>
          <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700 max-w-xs min-w-[150px]">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-3.5 h-3.5 rounded-full shadow-inner ring-2 ring-white/20" style={{ backgroundColor: hoverInfo.color }}></div>
              <h3 className="font-bold text-sm leading-tight">{String(hoverInfo.label)}</h3>
            </div>
            {hoverInfo.desc && <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-1 pl-6">{String(hoverInfo.desc)}</p>}
          </div>
          <div className="w-3 h-3 bg-slate-900/95 border-r border-b border-slate-700 transform rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
        </div>
      )}

      <AiAssistant
        installations={installations}
        setInstallations={setInstallations}
        activeFloor={activeFloor}
        currentImage={project.images?.[activeFloor]}
      />

    </div>
  );
}