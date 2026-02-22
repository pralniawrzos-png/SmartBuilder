import React, { useState, useEffect, useRef } from 'react';
import { Layers, Droplets, Flame, Zap, Wind, Move, Save, RotateCcw, Download, Upload } from 'lucide-react';

// --- METADANE WARSTW ---
const LAYER_CONFIG = {
  co: { name: 'Ogrzewanie', icon: <Flame size={18} />, color: '#ef4444' },
  wodkan: { name: 'Wod-Kan', icon: <Droplets size={18} />, color: '#3b82f6' },
  // ZMIANA: Zmiana nazwy i oznaczenie jako BETA
  elektryka: { name: 'Elektryka (BETA)', icon: <Zap size={18} />, color: '#eab308' },
  wentylacja: { name: 'Rekuperacja', icon: <Wind size={18} />, color: '#22c55e' }
};

// --- KOMPLETNY SZABLON STARTOWY V7 (Obejmuje Twoje przesunięcia) ---
const DEFAULT_DATA = {
  parter: {
    co: [
      { id: "kociol", type: "rect", x: 0.339, y: 0.092, w: 0.04, h: 0.05, color: "#f97316", label: "Kocioł Zgazowujący" },
      { id: "bufor", type: "circle", x: 0.449, y: 0.115, r: 0.025, color: "#f97316", label: "Bufor Ciepła 1200L" },
      { id: "zas_bufora", type: "line", points: [[0.359, 0.121], [0.451, 0.117]], thickness: 4, color: "#f97316", label: "Zasilanie Bufora" },
      { id: "rozdzielacz_p", type: "rect", x: 0.44, y: 0.45, w: 0.04, h: 0.015, color: "#dc2626", label: "Rozdzielacz CO (Parter)" },
      { id: "plyta", type: "polygon", points: [[0.294, 0.062], [0.969, 0.061], [0.95, 0.88], [0.27, 0.88]], color: "#f87171", label: "Płyta Akumulacyjna" }
    ],
    wodkan: [
      { id: "hydrofor", type: "rect", x: 0.353, y: 0.169, w: 0.018, h: 0.12, color: "#0ea5e9", label: "Hydrofor i Uzdatnianie" },
      { id: "kratka", type: "circle", x: 0.435, y: 0.278, r: 0.01, color: "#57534e", label: "Kratka Ściekowa (Syfon Suchy)" },
      { id: "pion_szary", type: "circle", x: 0.72, y: 0.48, r: 0.015, color: "#8b5cf6", label: "Pion Szary" },
      { id: "pion_czarny", type: "circle", x: 0.85, y: 0.65, r: 0.015, color: "#57534e", label: "Pion Czarny" },
      { id: "wc_parter", type: "circle", x: 0.35, y: 0.34, r: 0.015, color: "#57534e", label: "Podejście WC" },
      { id: "umywalka_p", type: "circle", x: 0.31, y: 0.31, r: 0.01, color: "#8b5cf6", label: "Podejście Umywalka" },
      { id: "kuchnia_zlew", type: "rect", x: 0.85, y: 0.8, w: 0.06, h: 0.04, color: "#57534e", label: "Zlew i Zmywarka" },
      { id: "zbiornik_szara", type: "rect", x: 0.05, y: 0.28, w: 0.12, h: 0.06, color: "#8b5cf6", label: "Zbiornik Szarej Wody" },
      { id: "linia_czarna", type: "line", points: [[0.35, 0.34], [0.85, 0.34], [0.85, 0.65], [0.95, 0.65]], thickness: 5, color: "#57534e", dashed: true, label: "Odpływ Czarny" },
      { id: "linia_szara", type: "line", points: [[0.72, 0.48], [0.72, 0.4], [0.31, 0.4], [0.31, 0.31], [0.05, 0.31]], thickness: 4, color: "#8b5cf6", dashed: true, label: "Odpływ Szary" },
      { id: "bypass_zawor", type: "circle", x: 0.72, y: 0.65, r: 0.02, color: "#ef4444", label: "Zawór Bypass" },
      { id: "bypass_linia", type: "line", points: [[0.72, 0.48], [0.72, 0.65], [0.85, 0.65]], thickness: 3, color: "#ef4444", dashed: true, label: "Bypass Zimowy" }
    ],
    elektryka: [
      { id: "rg", type: "rect", x: 0.76, y: 0.35, w: 0.06, h: 0.03, color: "#ef4444", label: "Rozdzielnica Główna (RG)" },
      { id: "gn_kuch_ind", type: "rect", x: 0.92, y: 0.85, w: 0.015, h: 0.015, color: "#ef4444", label: "Indukcja (Siła)" },
      { id: "gn_kuch_1", type: "circle", x: 0.85, y: 0.75, r: 0.01, color: "#10b981", label: "Blat Roboczy" },
      { id: "gn_kuch_zmyw", type: "circle", x: 0.85, y: 0.82, r: 0.01, color: "#3b82f6", label: "Zmywarka" },
      { id: "gn_kuch_lod", type: "circle", x: 0.88, y: 0.7, r: 0.01, color: "#3b82f6", label: "Lodówka" },
      { id: "gn_salon_tv", type: "circle", x: 0.32, y: 0.8, r: 0.012, color: "#10b981", label: "Ramka RTV" },
      { id: "gn_salon_kan1", type: "circle", x: 0.6, y: 0.85, r: 0.01, color: "#10b981", label: "Kanapa" },
      { id: "gn_biuro_p", type: "circle", x: 0.6, y: 0.05, r: 0.012, color: "#10b981", label: "Biurko P" },
      { id: "gn_biuro_z", type: "circle", x: 0.8, y: 0.05, r: 0.012, color: "#10b981", label: "Biurko Z" },
      { id: "os_salon", type: "circle", x: 0.5, y: 0.65, r: 0.015, color: "#eab308", label: "Oświetlenie Salon" },
      { id: "os_kuchnia", type: "circle", x: 0.8, y: 0.75, r: 0.015, color: "#eab308", label: "Oświetlenie Kuchnia" },
      { id: "os_biurop", type: "circle", x: 0.55, y: 0.15, r: 0.015, color: "#eab308", label: "Oświetlenie Biuro P" },
      { id: "trasa_kuchnia", type: "line", points: [[0.76, 0.36], [0.85, 0.36], [0.85, 0.85]], thickness: 2, color: "#10b981", label: "Obwód Gniazd Kuchnia" },
      { id: "trasa_sila", type: "line", points: [[0.76, 0.36], [0.92, 0.36], [0.92, 0.85]], thickness: 3, color: "#ef4444", dashed: true, label: "Siła 400V" },
      { id: "trasa_salon", type: "line", points: [[0.76, 0.36], [0.32, 0.36], [0.32, 0.8]], thickness: 2, color: "#10b981", label: "Obwód Gniazd Salon" },
      { id: "trasa_biura", type: "line", points: [[0.76, 0.35], [0.76, 0.05], [0.6, 0.05]], thickness: 2, color: "#10b981", label: "Obwód Gniazd Biura" },
      { id: "trasa_osw_salon", type: "line", points: [[0.76, 0.38], [0.5, 0.38], [0.5, 0.65]], thickness: 2, color: "#eab308", label: "Obwód Oświetlenia" },
      { id: "trasa_osw_kuchnia", type: "line", points: [[0.76, 0.38], [0.8, 0.38], [0.8, 0.75]], thickness: 2, color: "#eab308", label: "Obwód Oświetlenia" },
      { id: "trasa_osw_biura", type: "line", points: [[0.76, 0.34], [0.55, 0.34], [0.55, 0.15]], thickness: 2, color: "#eab308", label: "Obwód Oświetlenia" },
      { id: 'trasa_zmywarka', type: 'line', points: [[0.76, 0.36], [0.85, 0.36], [0.85, 0.82]], thickness: 2, color: '#3b82f6', dashed: true, label: 'Obwód dedykowany: Zmywarka' },
      { id: 'trasa_lodowka', type: 'line', points: [[0.76, 0.36], [0.88, 0.36], [0.88, 0.7]], thickness: 2, color: '#3b82f6', dashed: true, label: 'Obwód stały: Lodówka' },
      { id: 'gn_kociol', type: 'circle', x: 0.34, y: 0.15, r: 0.01, color: '#3b82f6', label: 'Zasilanie Kotła' },
      { id: 'gn_hydrofor', type: 'circle', x: 0.37, y: 0.22, r: 0.01, color: '#3b82f6', label: 'Zasilanie Hydroforu' },
      { id: 'trasa_kotlownia', type: 'line', points: [[0.76, 0.35], [0.35, 0.35], [0.35, 0.15]], thickness: 2, color: '#3b82f6', dashed: true, label: 'Zasilanie Kotłowni' },
      { id: 'falownik_pv', type: 'rect', x: 0.44, y: 0.05, w: 0.04, h: 0.03, color: '#10b981', label: 'Miejsce na Falownik PV' },
      { id: 'trasa_pv_ac', type: 'line', points: [[0.76, 0.35], [0.46, 0.35], [0.46, 0.05]], thickness: 4, color: '#10b981', dashed: true, label: 'Przygotowanie: Kabel AC Falownika' },
      { id: 'trasa_pv_dc', type: 'line', points: [[0.46, 0.05], [0.46, 0.01]], thickness: 3, color: '#10b981', dashed: true, label: 'Peszel na dach (Kable DC paneli)' }
    ],
    wentylacja: [
      { id: "szacht", type: "circle", x: 0.38, y: 0.45, r: 0.02, color: "#14b8a6", label: "Szacht Wentylacyjny" },
      { id: "anemostat_s", type: "circle", x: 0.55, y: 0.6, r: 0.015, color: "#22c55e", label: "Nawiew (Salon)" },
      { id: "anemostat_bp", type: "circle", x: 0.55, y: 0.15, r: 0.015, color: "#22c55e", label: "Nawiew (Biuro P)" },
      { id: "anemostat_wc", type: "circle", x: 0.38, y: 0.33, r: 0.015, color: "#eab308", label: "Wywiew (WC)" },
      { id: "anemostat_k", type: "circle", x: 0.82, y: 0.7, r: 0.015, color: "#eab308", label: "Wywiew (Kuchnia)" },
      { id: "kanal_naw_s", type: "line", points: [[0.38, 0.45], [0.55, 0.45], [0.55, 0.6]], thickness: 4, color: "#22c55e" },
      { id: "kanal_naw_b", type: "line", points: [[0.55, 0.45], [0.55, 0.15]], thickness: 3, color: "#22c55e" },
      { id: "kanal_wyw_wc", type: "line", points: [[0.38, 0.45], [0.38, 0.33]], thickness: 3, color: "#eab308" },
      { id: "kanal_wyw_k", type: "line", points: [[0.38, 0.45], [0.82, 0.45], [0.82, 0.7]], thickness: 4, color: "#eab308" }
    ]
  },
  pietro: {
    co: [
      { id: "rozdzielacz_pi", type: "rect", x: 0.5, y: 0.45, w: 0.06, h: 0.02, label: "Rozdzielacz CO (Piętro)" },
      { id: "strefa_rodzice", type: "polygon", points: [[0.067, 0.053], [0.5, 0.05], [0.498, 0.323], [0.056, 0.328]], color: "#f87171", label: "Sypialnia Rodziców" },
      { id: "strefa_pg", type: "polygon", points: [[0.52, 0.05], [0.934, 0.049], [0.935, 0.325], [0.511, 0.319]], color: "#f87171", label: "Sypialnia Prawa Górna" },
      { id: "strefa_ld", type: "polygon", points: [[0.061, 0.667], [0.495, 0.663], [0.486, 0.960], [0.067, 0.960]], color: "#f87171", label: "Sypialnia Lewa Dolna" },
      { id: "strefa_pd", type: "polygon", points: [[0.52, 0.7], [0.932, 0.7], [0.939, 0.961], [0.52, 0.95]], color: "#f87171", label: "Sypialnia Prawa Dolna" },
      { id: "strefa_laz_pral", type: "polygon", points: [[0.642, 0.331], [0.930, 0.336], [0.935, 0.689], [0.65, 0.68]], color: "#f87171", label: "Łazienka + Pralnia" }
    ],
    wodkan: [
      { id: "pi_szary", type: "circle", x: 0.72, y: 0.48, r: 0.02, color: "#8b5cf6", label: "Pion Szary" },
      { id: "pi_czarny", type: "circle", x: 0.85, y: 0.65, r: 0.02, color: "#57534e", label: "Pion Czarny" },
      { id: "pralka", type: "rect", x: 0.8, y: 0.4, w: 0.05, h: 0.05, color: "#8b5cf6", label: "Pralka" },
      { id: "linia_pralka", type: "line", points: [[0.8, 0.42], [0.72, 0.42], [0.72, 0.48]], thickness: 3, color: "#8b5cf6" },
      { id: "wanna", type: "rect", x: 0.82, y: 0.48, w: 0.08, h: 0.04, color: "#8b5cf6", label: "Wanna" },
      { id: "linia_wanna", type: "line", points: [[0.82, 0.5], [0.72, 0.5], [0.72, 0.48]], thickness: 3, color: "#8b5cf6" },
      { id: "wc_pietro", type: "rect", x: 0.717, y: 0.606, w: 0.04, h: 0.06, color: "#57534e", label: "Miska WC" }
    ],
    elektryka: [
      { id: "sub_rg", type: "rect", x: 0.48, y: 0.4, w: 0.04, h: 0.02, color: "#ef4444", label: "Podrozdzielnia (Piętro)" },
      { id: "gn_rodzice_l", type: "circle", x: 0.22, y: 0.15, r: 0.01, color: "#10b981", label: "Szafka Nocna L" },
      { id: "gn_rodzice_p", type: "circle", x: 0.45, y: 0.15, r: 0.01, color: "#10b981", label: "Szafka Nocna P" },
      { id: "gn_pg_b", type: "circle", x: 0.85, y: 0.1, r: 0.01, color: "#10b981", label: "Biurko Prawa Górna" },
      { id: "gn_ld_b", type: "circle", x: 0.22, y: 0.9, r: 0.01, color: "#10b981", label: "Biurko Lewa Dolna" },
      { id: "gn_laz", type: "circle", x: 0.85, y: 0.52, r: 0.01, color: "#10b981", label: "Gniazdo IP44" },
      { id: "os_rodzice", type: "circle", x: 0.35, y: 0.15, r: 0.015, color: "#eab308", label: "Światło Rodzice" },
      { id: "os_pg", type: "circle", x: 0.7, y: 0.15, r: 0.015, color: "#eab308", label: "Światło Prawa Górna" },
      { id: "os_ld", type: "circle", x: 0.35, y: 0.8, r: 0.015, color: "#eab308", label: "Światło Lewa Dolna" },
      { id: "os_laz", type: "circle", x: 0.75, y: 0.55, r: 0.015, color: "#eab308", label: "Światło Łazienka" },
      { id: "tr_os_gora", type: "line", points: [[0.48, 0.41], [0.35, 0.41], [0.35, 0.15]], thickness: 2, color: "#eab308", label: "Obwód Oświetlenia" },
      { id: "tr_os_dol", type: "line", points: [[0.5, 0.42], [0.5, 0.8], [0.35, 0.8]], thickness: 2, color: "#eab308", label: "Obwód Oświetlenia" },
      { id: "tr_gn_rodz", type: "line", points: [[0.48, 0.39], [0.22, 0.39], [0.22, 0.15]], thickness: 2, color: "#10b981", label: "Obwód Gniazd" },
      { id: "tr_gn_ld", type: "line", points: [[0.48, 0.42], [0.22, 0.42], [0.22, 0.9]], thickness: 2, color: "#10b981", label: "Obwód Gniazd" },
      { id: 'tr_gn_pg', type: 'line', points: [[0.48, 0.39], [0.85, 0.39], [0.85, 0.10]], thickness: 2, color: '#10b981', label: 'Obwód Gniazd Prawa Górna' },
      { id: 'tr_gn_pd', type: 'line', points: [[0.48, 0.42], [0.85, 0.42], [0.85, 0.90]], thickness: 2, color: '#10b981', label: 'Obwód Gniazd Prawa Dolna' },
      { id: 'tr_gn_laz', type: 'line', points: [[0.48, 0.40], [0.85, 0.40], [0.85, 0.52]], thickness: 2, color: '#10b981', label: 'Obwód Gniazd Łazienka' }
    ],
    wentylacja: [
      { id: "centrala", type: "rect", x: 0.22, y: 0.35, w: 0.08, h: 0.05, color: "#14b8a6", label: "Centrala Rekuperatora" },
      { id: "szacht_pi", type: "circle", x: 0.38, y: 0.45, r: 0.02, color: "#14b8a6", label: "Szacht (Zejście)" },
      { id: "r_linia_glowna", type: "line", points: [[0.26, 0.4], [0.26, 0.45], [0.38, 0.45]], thickness: 5, color: "#14b8a6" },
      { id: "r_lin_naw_gora", type: "line", points: [[0.26, 0.4], [0.26, 0.15], [0.7, 0.15]], thickness: 3, color: "#22c55e" },
      { id: "r_lin_naw_dol", type: "line", points: [[0.26, 0.45], [0.26, 0.8], [0.7, 0.8]], thickness: 3, color: "#22c55e" },
      { id: "r_lin_wyw", type: "line", points: [[0.26, 0.42], [0.75, 0.42], [0.75, 0.35]], thickness: 3, color: "#eab308" },
      { id: "r_naw_rl", type: "circle", x: 0.35, y: 0.15, r: 0.015, color: "#22c55e", label: "Nawiew L" },
      { id: "r_naw_rp", type: "circle", x: 0.7, y: 0.15, r: 0.015, color: "#22c55e", label: "Nawiew P" },
      { id: "r_naw_ld", type: "circle", x: 0.35, y: 0.8, r: 0.015, color: "#22c55e", label: "Nawiew LD" },
      { id: "r_naw_pd", type: "circle", x: 0.7, y: 0.8, r: 0.015, color: "#22c55e", label: "Nawiew PD" },
      { id: "r_wyw_pral", type: "circle", x: 0.75, y: 0.35, r: 0.015, color: "#eab308", label: "Wywiew Pralnia" }
    ]
  }
};

const STORAGE_KEY = 'mep_stodola_storage_v8';

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
  // ZMIANA: Elektryka domyślnie WYŁĄCZONA po załadowaniu
  const [activeLayers, setActiveLayers] = useState({ co: true, wodkan: true, elektryka: false, wentylacja: true });
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

    // 1. LINIE I POLIGONY (Z tyłu)
    Object.entries(floorData).forEach(([layerKey, elements]) => {
      if (!activeLayers[layerKey]) return;
      elements.forEach(el => {
        if (el.type === 'polygon') {
          ctx.beginPath();
          ctx.fillStyle = (el.color || LAYER_CONFIG[layerKey].color) + '30';
          ctx.strokeStyle = el.color || LAYER_CONFIG[layerKey].color;
          ctx.lineWidth = 2;
          ctx.moveTo(el.points[0][0] * w, el.points[0][1] * h);
          el.points.forEach(p => ctx.lineTo(p[0] * w, p[1] * h));
          ctx.closePath(); ctx.fill(); ctx.stroke();
          
          if (isEditMode) {
             ctx.fillStyle = '#ef4444';
             el.points.forEach(p => {
               ctx.fillRect((p[0] * w) - 5, (p[1] * h) - 5, 10, 10);
               ctx.strokeRect((p[0] * w) - 5, (p[1] * h) - 5, 10, 10);
             });
          }
        } else if (el.type === 'line') {
          ctx.beginPath();
          ctx.strokeStyle = el.color || LAYER_CONFIG[layerKey].color;
          ctx.lineWidth = el.thickness || 3;
          if (el.dashed) ctx.setLineDash([15, 10]); else ctx.setLineDash([]);
          ctx.moveTo(el.points[0][0] * w, el.points[0][1] * h);
          for (let i = 1; i < el.points.length; i++) {
             ctx.lineTo(el.points[i][0] * w, el.points[i][1] * h);
          }
          ctx.stroke();
          ctx.setLineDash([]); 

          if (isEditMode) {
            ctx.fillStyle = '#ef4444';
            el.points.forEach(p => {
              ctx.fillRect((p[0] * w) - 4, (p[1] * h) - 4, 8, 8);
            });
          }
        }
      });
    });

    // 2. SYMBOLE NA WIERZCHU
    Object.entries(floorData).forEach(([layerKey, elements]) => {
      if (!activeLayers[layerKey]) return;
      elements.forEach((el, index) => {
        if (el.type !== 'circle' && el.type !== 'rect') return;
        const isDrag = dragInfo && dragInfo.layerKey === layerKey && dragInfo.index === index && dragInfo.pointIndex === undefined;
        
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
    if (!isEditMode || !canvasRef.current) return;
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
        if (el.type === 'line' || el.type === 'polygon') {
           for (let j = 0; j < el.points.length; j++) {
             const [px, py] = el.points[j];
             if (Math.abs(mx - px) < 0.02 && Math.abs(my - py) < 0.02 * (canvasRef.current.width/canvasRef.current.height)) {
                setDragInfo({ layerKey: lk, index: i, pointIndex: j });
                return;
             }
           }
        }
      }
      
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
        if (dragInfo.pointIndex !== undefined) {
           el.points[dragInfo.pointIndex] = [mx, my];
        } else {
           el.x = mx; el.y = my;
        }
        return copy;
      });
    } else if (!isEditMode) {
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
          <h1 className="text-xl font-bold">MepPlanner Pro v7</h1>
          <p className="text-[10px] uppercase opacity-50 tracking-widest">Wizualizacja Instalacji</p>
        </div>

        <div className="p-4 border-b space-y-2 bg-slate-50">
           <button onClick={() => setIsEditMode(!isEditMode)} 
             className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg font-bold transition shadow-sm ${isEditMode ? 'bg-orange-600 text-white animate-pulse' : 'bg-white text-slate-700 border hover:bg-slate-100'}`}>
             <Move size={18} /> {isEditMode ? 'Zapisz i Wyjdź' : 'Tryb Edycji (Przesuń)'}
           </button>
           <div className="grid grid-cols-2 gap-2">
             <button onClick={exportData} className="flex items-center justify-center gap-1 p-2 text-[10px] bg-white border rounded hover:bg-slate-100">
               <Download size={14}/> Eksport na PC
             </button>
             <button onClick={importData} className="flex items-center justify-center gap-1 p-2 text-[10px] bg-white border rounded hover:bg-slate-100">
               <Upload size={14}/> Import do Tel.
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
            <button onClick={() => { if(confirm('Zresetować wszystko do danych fabrycznych?')) setInstallations(DEFAULT_DATA)}} className="text-[10px] text-slate-400 hover:text-red-500 flex items-center gap-1 uppercase font-bold">
                <RotateCcw size={12}/> Reset (Wymaga przeładowania)
            </button>
        </div>
      </div>

      <div className="flex-1 relative bg-slate-200 flex items-center justify-center p-8">
        {!imageLoaded && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/95">
             <div className="text-center p-8 border-2 border-dashed border-slate-300 rounded-3xl max-w-sm">
               <Layers size={40} className="mx-auto mb-4 text-slate-300" />
               <p className="font-bold text-slate-800">Brak plików rzutów</p>
               <p className="text-xs text-slate-500 mt-2 leading-relaxed">Upewnij się, że pliki <b>parter.jpg</b> i <b>pietro.jpg</b> znajdują się w folderze public.</p>
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