import React, { useState, useEffect, useRef } from 'react';
import { Layers, Droplets, Flame, Zap, Wind, Move, Save, RotateCcw, Download, Upload } from 'lucide-react';

// --- METADANE WARSTW (Ikony i kolory nie podlegają zapisowi w JSON, co zapobiega błędom) ---
const LAYER_CONFIG = {
  co: { name: 'Ogrzewanie', icon: <Flame size={18} />, color: '#ef4444' },
  wodkan: { name: 'Wod-Kan', icon: <Droplets size={18} />, color: '#3b82f6' },
  elektryka: { name: 'Elektryka (SEP)', icon: <Zap size={18} />, color: '#eab308' },
  wentylacja: { name: 'Rekuperacja', icon: <Wind size={18} />, color: '#22c55e' }
};

// --- SZABLON STARTOWY (Tylko dane geometryczne i opisy) ---
const DEFAULT_DATA = {
  parter: {
    co: [
      { id: 'kociol', type: 'rect', x: 0.285, y: 0.02, w: 0.04, h: 0.05, color: '#f97316', label: 'Kocioł Zgazowujący', desc: 'Lewy górny róg.' },
      { id: 'bufor', type: 'circle', x: 0.355, y: 0.045, r: 0.025, color: '#f97316', label: 'Bufor Ciepła 1200L', desc: 'Obok kotła.' },
      { id: 'rozdzielacz_p', type: 'rect', x: 0.44, y: 0.45, w: 0.04, h: 0.015, color: '#dc2626', label: 'Rozdzielacz CO (Parter)' },
      { id: 'plyta', type: 'polygon', points: [[0.27, 0.02], [0.95, 0.02], [0.95, 0.88], [0.27, 0.88]], color: '#f87171', label: 'Płyta Akumulacyjna' }
    ],
    wodkan: [
      { id: 'hydrofor', type: 'rect', x: 0.285, y: 0.09, w: 0.018, h: 0.12, color: '#0ea5e9', label: 'Hydrofor i Uzdatnianie', desc: 'Na lewej ścianie, pod kotłem.' },
      { id: 'kratka', type: 'circle', x: 0.38, y: 0.26, r: 0.01, color: '#57534e', label: 'Kratka Ściekowa (Kotłownia)' },
      { id: 'pion_szary', type: 'circle', x: 0.72, y: 0.48, r: 0.015, color: '#8b5cf6', label: 'Pion Szary' },
      { id: 'pion_czarny', type: 'circle', x: 0.85, y: 0.65, r: 0.015, color: '#57534e', label: 'Pion Czarny' },
      { id: 'kuchnia_zlew', type: 'rect', x: 0.85, y: 0.80, w: 0.06, h: 0.04, color: '#57534e', label: 'Zlew i Zmywarka' }
    ],
    elektryka: [
      { id: 'rg', type: 'rect', x: 0.76, y: 0.35, w: 0.06, h: 0.03, color: '#ef4444', label: 'Rozdzielnica Główna (RG)' },
      { id: 'indukcja', type: 'rect', x: 0.92, y: 0.85, w: 0.02, h: 0.02, color: '#ef4444', label: 'Płyta Indukcyjna (Siła)' },
      // Pokoje - Gniazda (Przykładowe ramki zgodnie ze sztuką)
      { id: 'gn_salon_rtv', type: 'circle', x: 0.32, y: 0.80, r: 0.012, color: '#10b981', label: 'Ramka RTV (3x230V + LAN)' },
      { id: 'gn_biurko_p', type: 'circle', x: 0.60, y: 0.05, r: 0.012, color: '#10b981', label: 'Ramka Biurko (4x230V + LAN)' },
      { id: 'gn_biurko_z', type: 'circle', x: 0.80, y: 0.05, r: 0.012, color: '#10b981', label: 'Ramka Biurko (4x230V + LAN)' },
      { id: 'gn_kuchnia_b1', type: 'circle', x: 0.82, y: 0.75, r: 0.01, color: '#10b981', label: 'Gniazda Blat (Podwójne)' },
      { id: 'gn_kuchnia_b2', type: 'circle', x: 0.94, y: 0.75, r: 0.01, color: '#10b981', label: 'Gniazda Blat (Podwójne)' }
    ],
    wentylacja: [
      { id: 'szacht', type: 'circle', x: 0.38, y: 0.45, r: 0.02, color: '#14b8a6', label: 'Szacht Wentylacyjny' },
      { id: 'anemostat_s', type: 'circle', x: 0.55, y: 0.60, r: 0.015, color: '#22c55e', label: 'Anemostat Nawiewny (Salon)' }
    ]
  },
  pietro: {
    co: [
      { id: 'rozdzielacz_pi', type: 'rect', x: 0.50, y: 0.45, w: 0.06, h: 0.02, label: 'Rozdzielacz CO (Piętro)' },
      { id: 'strefa_rodzice', type: 'polygon', points: [[0.20, 0.05], [0.50, 0.05], [0.50, 0.30], [0.20, 0.30]], color: '#f87171', label: 'Sypialnia Rodziców' },
      { id: 'strefa_ld', type: 'polygon', points: [[0.20, 0.70], [0.50, 0.70], [0.50, 0.95], [0.20, 0.95]], color: '#f87171', label: 'Sypialnia Lewa Dolna' },
      { id: 'strefa_pd', type: 'polygon', points: [[0.52, 0.70], [0.88, 0.70], [0.88, 0.95], [0.52, 0.95]], color: '#f87171', label: 'Sypialnia Prawa Dolna' }
    ],
    wodkan: [
      { id: 'pi_szary', type: 'circle', x: 0.72, y: 0.48, r: 0.02, color: '#8b5cf6', label: 'Pion Szary' },
      { id: 'pi_czarny', type: 'circle', x: 0.85, y: 0.65, r: 0.02, color: '#57534e', label: 'Pion Czarny' }
    ],
    elektryka: [
      { id: 'sub_rg', type: 'rect', x: 0.48, y: 0.40, w: 0.04, h: 0.02, color: '#ef4444', label: 'Podrozdzielnia (Piętro)' },
      { id: 'gn_nocne_l', type: 'circle', x: 0.22, y: 0.15, r: 0.01, color: '#10b981', label: 'Gniazdo Nocne L' },
      { id: 'gn_nocne_p', type: 'circle', x: 0.45, y: 0.15, r: 0.01, color: '#10b981', label: 'Gniazdo Nocne P' }
    ],
    wentylacja: []
  }
};

const STORAGE_KEY = 'mep_stodola_storage_v3';

export default function App() {
  const canvasRef = useRef(null);
  const [bgImage, setBgImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const [installations, setInstallations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_DATA;
    } catch {
      return DEFAULT_DATA;
    }
  });

  const [activeFloor, setActiveFloor] = useState('parter');
  const [activeLayers, setActiveLayers] = useState({ co: true, wodkan: true, elektryka: true, wentylacja: true });
  const [isEditMode, setIsEditMode] = useState(false);
  const [dragInfo, setDragInfo] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(installations));
  }, [installations]);

  useEffect(() => {
    const img = new Image();
    img.src = activeFloor === 'parter' ? '/parter.jpg' : '/pietro.jpg';
    img.onload = () => { setBgImage(img); setImageLoaded(true); };
    img.onerror = () => { setImageLoaded(false); };
  }, [activeFloor]);

  const exportData = () => {
    const dataStr = JSON.stringify(installations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `projekt_stodola_${new Date().toISOString().slice(0,10)}.json`);
    linkElement.click();
  };

  const importData = () => {
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
        } catch (err) { alert("Błąd pliku JSON."); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !bgImage) return;
    const ctx = canvas.getContext('2d');
    canvas.width = bgImage.width;
    canvas.height = bgImage.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const floorData = installations[activeFloor];

    // 1. Poligony (Tło)
    Object.entries(floorData).forEach(([layerKey, elements]) => {
      if (!activeLayers[layerKey]) return;
      elements.forEach(el => {
        if (el.type !== 'polygon') return;
        ctx.beginPath();
        ctx.fillStyle = (el.color || LAYER_CONFIG[layerKey].color) + '30';
        ctx.strokeStyle = el.color || LAYER_CONFIG[layerKey].color;
        ctx.lineWidth = 2;
        ctx.moveTo(el.points[0][0] * w, el.points[0][1] * h);
        el.points.forEach(p => ctx.lineTo(p[0] * w, p[1] * h));
        ctx.closePath(); ctx.fill(); ctx.stroke();
      });
    });

    // 2. Symbole
    Object.entries(floorData).forEach(([layerKey, elements]) => {
      if (!activeLayers[layerKey]) return;
      elements.forEach((el, index) => {
        if (el.type !== 'circle' && el.type !== 'rect') return;
        const isDrag = dragInfo && dragInfo.layerKey === layerKey && dragInfo.index === index;
        
        ctx.beginPath();
        ctx.strokeStyle = el.color || LAYER_CONFIG[layerKey].color;
        ctx.fillStyle = isDrag ? '#ffffff' : (el.color || LAYER_CONFIG[layerKey].color) + '95'; 
        ctx.lineWidth = isDrag ? 5 : 3;

        if (el.type === 'circle') {
          ctx.arc(el.x * w, el.y * h, (el.r || 0.01) * w, 0, 2 * Math.PI);
        } else {
          ctx.rect(el.x * w, el.y * h, (el.w || 0.02) * w, (el.h || 0.02) * h);
        }
        ctx.fill(); ctx.stroke();
        
        if (isEditMode) {
          ctx.fillStyle = '#000';
          ctx.fillRect((el.x * w) - 3, (el.y * h) - 3, 6, 6);
        }
      });
    });
  };

  useEffect(() => { if (imageLoaded) drawCanvas(); }, [imageLoaded, activeLayers, bgImage, installations, isEditMode, dragInfo]);

  const handleMouseDown = (e) => {
    if (!isEditMode) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) * (canvasRef.current.width / rect.width)) / canvasRef.current.width;
    const my = ((e.clientY - rect.top) * (canvasRef.current.height / rect.height)) / canvasRef.current.height;
    
    const floorData = installations[activeFloor];
    const layers = Object.keys(floorData).reverse();
    for (const lk of layers) {
      if (!activeLayers[lk]) continue;
      const els = floorData[lk];
      for (let i = els.length - 1; i >= 0; i--) {
        const el = els[i];
        if (el.type === 'circle' && Math.hypot(mx - el.x, my - el.y) < (el.r || 0.02) * 2) {
          setDragInfo({ layerKey: lk, index: i }); return;
        }
        if (el.type === 'rect' && mx >= el.x && mx <= el.x + el.w && my >= el.y && my <= el.y + el.h) {
          setDragInfo({ layerKey: lk, index: i }); return;
        }
      }
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) * (canvasRef.current.width / rect.width)) / canvasRef.current.width;
    const my = ((e.clientY - rect.top) * (canvasRef.current.height / rect.height)) / canvasRef.current.height;

    if (dragInfo) {
      setInstallations(prev => {
        const copy = JSON.parse(JSON.stringify(prev));
        const el = copy[activeFloor][dragInfo.layerKey][dragInfo.index];
        el.x = mx; el.y = my;
        return copy;
      });
    } else if (!isEditMode) {
      // Tooltip detection
      let hit = null;
      const floorData = installations[activeFloor];
      Object.entries(floorData).forEach(([lk, els]) => {
        if (!activeLayers[lk] || hit) return;
        els.forEach(el => {
           if (el.type === 'circle' && Math.hypot(mx - el.x, my - el.y) < (el.r || 0.015)) hit = { ...el, lk };
           if (el.type === 'rect' && mx >= el.x && mx <= el.x + el.w && my >= el.y && my <= el.y + el.h) hit = { ...el, lk };
        });
      });
      setHoverInfo(hit ? { x: e.clientX, y: e.clientY, label: hit.label, desc: hit.desc, color: hit.color || LAYER_CONFIG[hit.lk].color } : null);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      <div className="w-80 bg-white border-r flex flex-col shadow-lg z-20">
        <div className="p-6 bg-slate-900 text-white">
          <h1 className="text-xl font-bold">MepPlanner Pro v3</h1>
          <p className="text-[10px] uppercase opacity-50 tracking-widest">System Projektowy</p>
        </div>

        <div className="p-4 border-b space-y-2 bg-slate-50">
           <button onClick={() => setIsEditMode(!isEditMode)} 
             className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg font-bold transition shadow-sm ${isEditMode ? 'bg-orange-600 text-white animate-pulse' : 'bg-white text-slate-700 border hover:bg-slate-100'}`}>
             <Move size={18} /> {isEditMode ? 'Zapisz i Wyjdź' : 'Tryb Edycji (Przesuń)'}
           </button>
           <div className="grid grid-cols-2 gap-2">
             <button onClick={exportData} className="flex items-center justify-center gap-1 p-2 text-[10px] bg-white border rounded hover:bg-slate-100">
               <Download size={14}/> Eksport
             </button>
             <button onClick={importData} className="flex items-center justify-center gap-1 p-2 text-[10px] bg-white border rounded hover:bg-slate-100">
               <Upload size={14}/> Import
             </button>
           </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Kondygnacja</h2>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {['parter', 'pietro'].map(f => (
                <button key={f} onClick={() => setActiveFloor(f)} 
                  className={`flex-1 py-1.5 text-xs rounded-md transition ${activeFloor === f ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-500'}`}>
                  {f === 'parter' ? 'Parter' : 'Piętro'}
                </button>
              ))}
            </div>
          </div>

          <h2 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Warstwy Instalacji</h2>
          <div className="space-y-1">
            {Object.entries(LAYER_CONFIG).map(([key, cfg]) => (
              <label key={key} className="flex items-center p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200">
                <input type="checkbox" checked={activeLayers[key]} 
                  onChange={() => setActiveLayers(p => ({...p, [key]: !p[key]}))} className="w-4 h-4 rounded mr-3" />
                <span className="flex items-center justify-center w-7 h-7 rounded-full text-white mr-3" style={{backgroundColor: cfg.color}}>{cfg.icon}</span>
                <span className="text-xs font-semibold text-slate-700">{cfg.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t flex justify-center">
            <button onClick={() => { if(confirm('Zresetować wszystko?')) setInstallations(DEFAULT_DATA)}} className="text-[10px] text-slate-400 hover:text-red-500 flex items-center gap-1 uppercase font-bold">
                <RotateCcw size={12}/> Resetuj do fabrycznych
            </button>
        </div>
      </div>

      <div className="flex-1 relative bg-slate-200 flex items-center justify-center p-8">
        {!imageLoaded && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/95">
             <div className="text-center p-8 border-2 border-dashed border-slate-300 rounded-3xl max-w-sm">
               <Layers size={40} className="mx-auto mb-4 text-slate-300" />
               <p className="font-bold text-slate-800">Wymagane pliki .jpg w folderze PUBLIC</p>
               <p className="text-xs text-slate-500 mt-2 leading-relaxed">Przenieś obrazy "parter.jpg" i "pietro.jpg" do głównego folderu <b>public</b> w Twoim projekcie.</p>
             </div>
          </div>
        )}
        <div className="relative shadow-2xl bg-white border border-slate-300 p-1">
          <canvas ref={canvasRef} 
            onMouseDown={handleMouseDown} 
            onMouseMove={handleMouseMove} 
            onMouseUp={() => setDragInfo(null)}
            className={`max-w-full max-h-[90vh] ${isEditMode ? 'cursor-move' : 'cursor-crosshair'}`} 
          />
        </div>

        {!isEditMode && hoverInfo && (
          <div className="fixed z-50 bg-white/95 backdrop-blur text-slate-800 p-4 rounded-xl shadow-2xl border border-slate-100 max-w-xs pointer-events-none transform -translate-x-1/2 -translate-y-full" style={{ left: hoverInfo.x, top: hoverInfo.y - 20 }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: hoverInfo.color }}></div>
              <h3 className="font-extrabold text-sm">{hoverInfo.label}</h3>
            </div>
            {hoverInfo.desc && <p className="text-[10px] text-slate-500 font-medium">{hoverInfo.desc}</p>}
          </div>
        )}
      </div>
    </div>
  );
}