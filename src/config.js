import { Droplets, Flame, Zap, Activity, Wind } from 'lucide-react';

export const LAYER_CONFIG = {
  co: { name: 'Ogrzewanie', Icon: Flame, color: '#ef4444' },
  wodkan: { name: 'Wod-Kan / Przyłącza', Icon: Droplets, color: '#3b82f6' },
  elektryka_punkty: { name: 'Elektryka - Punkty', Icon: Zap, color: '#eab308' },
  elektryka_trasy: { name: 'Elektryka - Kable', Icon: Activity, color: '#f59e0b' },
  wentylacja: { name: 'Rekuperacja', Icon: Wind, color: '#22c55e' }
};

export const DEFAULT_DATA = {
  parter: {
    co: [
      { id: "kociol", type: "rect", x: 0.339, y: 0.092, w: 0.04, h: 0.05, color: "#f97316", label: "Kocioł Zgazowujący" },
      { id: "bufor", type: "circle", x: 0.449, y: 0.115, r: 0.025, color: "#f97316", label: "Bufor Ciepła 1200L" },
      { id: "zas_bufora", type: "line", points: [[0.359, 0.121], [0.451, 0.117]], thickness: 4, color: "#f97316", label: "Zasilanie Bufora" },
      { id: "rozdzielacz_p", type: "rect", x: 0.44, y: 0.45, w: 0.04, h: 0.015, color: "#dc2626", label: "Rozdzielacz CO (Parter)" },
      { id: "plyta", type: "polygon", points: [[0.294, 0.062], [0.969, 0.061], [0.95, 0.88], [0.27, 0.88]], color: "#f87171", label: "Płyta Akumulacyjna" }
    ],
    wodkan: [
      { id: "przylacze_woda", type: "circle", x: 0.1, y: 0.1, r: 0.02, color: "#0284c7", label: "Główne Przyłącze Wody" },
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
      { id: "bypass_linia", type: "line", points: [[0.72, 0.48], [0.72, 0.65], [0.85, 0.65]], thickness: 3, color: "#ef4444", dashed: true, label: "Bypass Zimowy" },
      { id: "linia_zasilania_wody", type: "line", points: [[0.1, 0.1], [0.353, 0.169]], thickness: 4, color: "#0284c7", label: "Zasilanie z sieci" }
    ],
    elektryka_punkty: [
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
      { id: 'gn_kociol', type: 'circle', x: 0.34, y: 0.15, r: 0.01, color: '#3b82f6', label: 'Zasilanie Kotła' },
      { id: 'gn_hydrofor', type: 'circle', x: 0.37, y: 0.22, r: 0.01, color: '#3b82f6', label: 'Zasilanie Hydroforu' },
      { id: 'falownik_pv', type: 'rect', x: 0.44, y: 0.05, w: 0.04, h: 0.03, color: '#10b981', label: 'Falownik PV' }
    ],
    elektryka_trasy: [
      { id: "trasa_kuchnia", type: "line", points: [[0.76, 0.36], [0.85, 0.36], [0.85, 0.85]], thickness: 2, color: "#10b981", label: "Obwód Gniazd Kuchnia" },
      { id: "trasa_sila", type: "line", points: [[0.76, 0.36], [0.92, 0.36], [0.92, 0.85]], thickness: 3, color: "#ef4444", dashed: true, label: "Siła 400V" },
      { id: "trasa_salon", type: "line", points: [[0.76, 0.36], [0.32, 0.36], [0.32, 0.8]], thickness: 2, color: "#10b981", label: "Obwód Gniazd Salon" },
      { id: "trasa_biura", type: "line", points: [[0.76, 0.35], [0.76, 0.05], [0.6, 0.05]], thickness: 2, color: "#10b981", label: "Obwód Gniazd Biura" },
      { id: "trasa_osw_salon", type: "line", points: [[0.76, 0.38], [0.5, 0.38], [0.5, 0.65]], thickness: 2, color: "#eab308", label: "Obwód Oświetlenia" },
      { id: "trasa_osw_kuchnia", type: "line", points: [[0.76, 0.38], [0.8, 0.38], [0.8, 0.75]], thickness: 2, color: "#eab308", label: "Obwód Oświetlenia" },
      { id: "trasa_osw_biura", type: "line", points: [[0.76, 0.34], [0.55, 0.34], [0.55, 0.15]], thickness: 2, color: "#eab308", label: "Obwód Oświetlenia" },
      { id: 'trasa_zmywarka', type: 'line', points: [[0.76, 0.36], [0.85, 0.36], [0.85, 0.82]], thickness: 2, color: '#3b82f6', dashed: true, label: 'Dedykowany: Zmywarka' },
      { id: 'trasa_lodowka', type: 'line', points: [[0.76, 0.36], [0.88, 0.36], [0.88, 0.7]], thickness: 2, color: '#3b82f6', dashed: true, label: 'Stały: Lodówka' },
      { id: 'trasa_kotlownia', type: 'line', points: [[0.76, 0.35], [0.35, 0.35], [0.35, 0.15]], thickness: 2, color: '#3b82f6', dashed: true, label: 'Zasilanie Kotłowni' },
      { id: 'trasa_pv_ac', type: 'line', points: [[0.76, 0.35], [0.46, 0.35], [0.46, 0.05]], thickness: 4, color: '#10b981', dashed: true, label: 'Kabel AC Falownika' },
      { id: 'trasa_pv_dc', type: 'line', points: [[0.46, 0.05], [0.46, 0.01]], thickness: 3, color: '#10b981', dashed: true, label: 'Peszel na dach' }
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
      { id: "rozdzielacz_pi", type: "rect", x: 0.5, y: 0.45, w: 0.06, h: 0.02, label: "Rozdzielacz CO (Piętro)", color: "#dc2626" },
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
    elektryka_punkty: [
      { id: "sub_rg", type: "rect", x: 0.48, y: 0.4, w: 0.04, h: 0.02, color: "#ef4444", label: "Podrozdzielnia (Piętro)" },
      { id: "gn_rodzice_l", type: "circle", x: 0.22, y: 0.15, r: 0.01, color: "#10b981", label: "Szafka Nocna L" },
      { id: "gn_rodzice_p", type: "circle", x: 0.45, y: 0.15, r: 0.01, color: "#10b981", label: "Szafka Nocna P" },
      { id: "gn_pg_b", type: "circle", x: 0.85, y: 0.1, r: 0.01, color: "#10b981", label: "Biurko Prawa Górna" },
      { id: "gn_ld_b", type: "circle", x: 0.22, y: 0.9, r: 0.01, color: "#10b981", label: "Biurko Lewa Dolna" },
      { id: "gn_laz", type: "circle", x: 0.85, y: 0.52, r: 0.01, color: "#10b981", label: "Gniazdo IP44" },
      { id: "os_rodzice", type: "circle", x: 0.35, y: 0.15, r: 0.015, color: "#eab308", label: "Światło Rodzice" },
      { id: "os_pg", type: "circle", x: 0.7, y: 0.15, r: 0.015, color: "#eab308", label: "Światło Prawa Górna" },
      { id: "os_ld", type: "circle", x: 0.35, y: 0.8, r: 0.015, color: "#eab308", label: "Światło Lewa Dolna" },
      { id: "os_laz", type: "circle", x: 0.75, y: 0.55, r: 0.015, color: "#eab308", label: "Światło Łazienka" }
    ],
    elektryka_trasy: [
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