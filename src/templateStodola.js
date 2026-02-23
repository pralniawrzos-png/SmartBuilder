// Ten plik zawiera wyłącznie początkowe dane.
// Wkleiłem tu Twoje dokładne koordynaty z pliku projekt_stodola_2026-02-22.json,
// dokonując podziału elektryki na punkty i trasy kablowe.

export const DEFAULT_DATA = {
  parter: {
    co: [
      { id: "kociol", type: "rect", x: 0.33979354979975906, y: 0.09286576516670725, w: 0.04, h: 0.05, color: "#f97316", label: "Kocioł Zgazowujący" },
      { id: "bufor", type: "circle", x: 0.44993560769233315, y: 0.11532689009693943, r: 0.025, color: "#f97316", label: "Bufor Ciepła 1200L" },
      { id: "zas_bufora", type: "line", points: [[0.35902470276512916, 0.1211863139917826], [0.45168389432554856, 0.11728003139522049]], thickness: 4, color: "#f97316", label: "Zasilanie Bufora" },
      { id: "rozdzielacz_p", type: "rect", x: 0.44, y: 0.45, w: 0.04, h: 0.015, color: "#dc2626", label: "Rozdzielacz CO (Parter)" },
      { id: "plyta", type: "polygon", points: [[0.29433809733615707, 0.06259207504335082], [0.9691767377573252, 0.0616155043942103], [0.95, 0.88], [0.27, 0.88]], color: "#f87171", label: "Płyta Akumulacyjna" }
    ],
    wodkan: [
      { id: "hydrofor", type: "rect", x: 0.35377984286548275, y: 0.16903827579966857, w: 0.018, h: 0.12, color: "#0ea5e9", label: "Hydrofor i Uzdatnianie" },
      { id: "kratka", type: "circle", x: 0.43594931462660946, y: 0.2784141885034079, r: 0.01, color: "#57534e", label: "Kratka Ściekowa (Syfon Suchy)" },
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
    woda: [
      { id: "zas_woda_zimna", type: "line", points: [[0.35, 0.23], [0.35, 0.32], [0.31, 0.32]], thickness: 2, color: "#0ea5e9", label: "Zimna Woda (WC)" },
      { id: "zas_woda_ciepla", type: "line", points: [[0.34, 0.15], [0.34, 0.33], [0.31, 0.33]], thickness: 2, color: "#ef4444", label: "Ciepła Woda (WC)" },
      { id: "zas_kuchnia_z", type: "line", points: [[0.35, 0.23], [0.85, 0.23], [0.85, 0.8]], thickness: 2, color: "#0ea5e9", label: "Zimna Woda (Kuchnia)" },
      { id: "zas_kuchnia_c", type: "line", points: [[0.34, 0.15], [0.84, 0.15], [0.84, 0.8]], thickness: 2, color: "#ef4444", label: "Ciepła Woda (Kuchnia)" }
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
      { id: "os_biurop", type: "circle", x: 0.55, y: 0.15, r: 0.015, color: "#eab308", label: "Oświetlenie Biuro P" }
    ],
    elektryka_trasy: [
      { id: "trasa_kuchnia", type: "line", points: [[0.76, 0.36], [0.85, 0.36], [0.85, 0.85]], thickness: 2, color: "#10b981", label: "Obwód Gniazd Kuchnia" },
      { id: "trasa_sila", type: "line", points: [[0.76, 0.36], [0.92, 0.36], [0.92, 0.85]], thickness: 3, color: "#ef4444", dashed: true, label: "Siła 400V" },
      { id: "trasa_salon", type: "line", points: [[0.76, 0.36], [0.32, 0.36], [0.32, 0.8]], thickness: 2, color: "#10b981", label: "Obwód Gniazd Salon" },
      { id: "trasa_biura", type: "line", points: [[0.76, 0.35], [0.76, 0.05], [0.6, 0.05]], thickness: 2, color: "#10b981", label: "Obwód Gniazd Biura" },
      { id: "trasa_osw_salon", type: "line", points: [[0.76, 0.38], [0.5, 0.38], [0.5, 0.65]], thickness: 2, color: "#eab308", label: "Obwód Oświetlenia" },
      { id: "trasa_osw_kuchnia", type: "line", points: [[0.76, 0.38], [0.8, 0.38], [0.8, 0.75]], thickness: 2, color: "#eab308", label: "Obwód Oświetlenia" },
      { id: "trasa_osw_biura", type: "line", points: [[0.76, 0.34], [0.55, 0.34], [0.55, 0.15]], thickness: 2, color: "#eab308", label: "Obwód Oświetlenia" }
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
      { id: "strefa_rodzice", type: "polygon", points: [[0.06706083501814712, 0.05380293920108606], [0.5, 0.05], [0.49888763342236603, 0.32333643836387227], [0.05657111521885434, 0.3282192916095749]], color: "#f87171", label: "Sypialnia Rodziców" },
      { id: "strefa_pg", type: "polygon", points: [[0.52, 0.05], [0.9342110050930159, 0.04989665660452394], [0.9359592917262314, 0.3252895796621533], [0.5111256398548742, 0.31943015576731015]], color: "#f87171", label: "Sypialnia Prawa Górna" },
      { id: "strefa_ld", type: "polygon", points: [[0.06181597511850074, 0.6670893068613387], [0.4953910601559351, 0.6631830242647766], [0.48664962698985786, 0.9600605016034977], [0.06706083501814712, 0.9600605016034977]], color: "#f87171", label: "Sypialnia Lewa Dolna" },
      { id: "strefa_pd", type: "polygon", points: [[0.52, 0.7], [0.9324627184598004, 0.7002927089321167], [0.9394558649926623, 0.9610370722526381], [0.52, 0.95]], color: "#f87171", label: "Sypialnia Prawa Dolna" },
      { id: "strefa_laz_pral", type: "polygon", points: [[0.6422471373460339, 0.3311490035569965], [0.9307144318265849, 0.33603185680269915], [0.9359592917262314, 0.6895504317915709], [0.65, 0.68]], color: "#f87171", label: "Łazienka + Pralnia" }
    ],
    wodkan: [
      { id: "pi_szary", type: "circle", x: 0.72, y: 0.48, r: 0.02, color: "#8b5cf6", label: "Pion Szary" },
      { id: "pi_czarny", type: "circle", x: 0.85, y: 0.65, r: 0.02, color: "#57534e", label: "Pion Czarny" },
      { id: "pralka", type: "rect", x: 0.8, y: 0.4, w: 0.05, h: 0.05, color: "#8b5cf6", label: "Pralka" },
      { id: "linia_pralka", type: "line", points: [[0.8, 0.42], [0.72, 0.42], [0.72, 0.48]], thickness: 3, color: "#8b5cf6" },
      { id: "wanna", type: "rect", x: 0.82, y: 0.48, w: 0.08, h: 0.04, color: "#8b5cf6", label: "Wanna" },
      { id: "linia_wanna", type: "line", points: [[0.82, 0.5], [0.72, 0.5], [0.72, 0.48]], thickness: 3, color: "#8b5cf6" },
      { id: "wc_pietro", type: "rect", x: 0.7174234625742987, y: 0.6065419266146259, w: 0.04, h: 0.06, color: "#57534e", label: "Miska WC" }
    ],
    woda: [
      { id: "pi_woda_z", type: "circle", x: 0.74, y: 0.48, r: 0.015, color: "#0ea5e9", label: "Pion Wody Zimnej" },
      { id: "pi_woda_c", type: "circle", x: 0.76, y: 0.48, r: 0.015, color: "#ef4444", label: "Pion Wody Ciepłej" },
      { id: "wanna_z", type: "line", points: [[0.74, 0.48], [0.74, 0.52], [0.82, 0.52]], thickness: 2, color: "#0ea5e9", label: "Zimna (Wanna)" },
      { id: "wanna_c", type: "line", points: [[0.76, 0.48], [0.76, 0.50], [0.82, 0.50]], thickness: 2, color: "#ef4444", label: "Ciepła (Wanna)" }
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
      { id: "tr_gn_ld", type: "line", points: [[0.48, 0.42], [0.22, 0.42], [0.22, 0.9]], thickness: 2, color: "#10b981", label: "Obwód Gniazd" }
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