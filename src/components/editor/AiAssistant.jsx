import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Settings } from 'lucide-react';

export default function AiAssistant({ installations, setInstallations, activeFloor, currentImage }) {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      content:
        'Cześć, jestem Asystentem SmartBuilder. Opisz swój projekt lub problem, a podpowiem kolejne kroki.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('gemini_api_key') || '';
  });
  const [apiKeyInput, setApiKeyInput] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('gemini_api_key') || '';
  });
  const [showSettings, setShowSettings] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('gemini_api_key');
  });

  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSaveApiKey = () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'ai',
          type: 'error',
          content: 'Wprowadź poprawny klucz API Gemini, aby kontynuować.',
        },
      ]);
      return;
    }
    setApiKey(trimmed);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_api_key', trimmed);
    }
    setShowSettings(false);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !apiKey) return;
    
    const userText = inputValue;
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userText }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const systemInstruction = `Jesteś wybitnym inżynierem AI (MEP) w SmartBuilder. 
Aktywna kondygnacja: "${activeFloor}".
Aktualny JSON projektu: ${JSON.stringify(installations)}.

ZASADY RYSOWANIA I ANALIZY OBRAZU (BARDZO WAŻNE):
1. Jeśli dodajesz obiekty, MUSISZ spojrzeć na załączony obraz (rzut architektoniczny).
2. Znajdź odpowiednie pomieszczenie na rzucie (np. łazienka, kuchnia, kocioł).
3. Współrzędne (x, y) to wartości od 0.0 do 1.0. (0,0 to lewy górny róg, 1,1 to prawy dolny).
4. Zanim podasz współrzędne, w polu "reasoning" opisz, gdzie na obrazie widzisz to pomieszczenie.
5. Jeśli dodajesz kilka obiektów w tym samym pomieszczeniu (np. 3 punkty wody), delikatnie je rozsuń (np. dodaj +0.02 do X i Y dla kolejnych), żeby nie nałożyły się na siebie w jednym punkcie!

MUSISZ ZAWSZE odpowiadać w formacie JSON zawierającym:
{
  "reasoning": "Gdzie na rzucie znajduje się docelowe miejsce? Oszacuj jego X i Y.",
  "reply": "Krótka, profesjonalna odpowiedź tekstowa",
  "actions": [
     { 
       "type": "add", 
       "floor": "${activeFloor}", 
       "layer": "co" | "woda" | "kanalizacja" | "elektryka_punkty" | "elektryka_trasy" | "wentylacja", 
       "element": { "id": "ai_" + Math.random(), "type": "circle" | "rect", "x": WYLICZONE_X, "y": WYLICZONE_Y, "r": 0.015, "w": 0.03, "h": 0.03, "color": "#ef4444", "label": "Nazwa urządzenia" }
     }
  ]
}`;

      // Przygotowanie części wiadomości (tekst + opcjonalnie obraz)
      const userParts = [{ text: userText }];
      
      if (currentImage && currentImage.includes('base64,')) {
        const mimeType = currentImage.split(';')[0].split(':')[1];
        const base64Data = currentImage.split(',')[1];
        userParts.push({
          inlineData: { data: base64Data, mimeType: mimeType }
        });
        console.log("Wysyłam rzut architektoniczny do analizy Gemini Vision.");
      } else {
        console.warn("Brak obrazu w formacie base64. AI nie widzi rzutu!");
      }

      const payload = {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: userParts }],
        generationConfig: { responseMimeType: "application/json" }
      };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Błąd API Gemini");
      const data = await response.json();
      
      let rawText = data.candidates[0].content.parts[0].text;
      rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(rawText);

      console.log("Logika AI (Reasoning):", parsedData.reasoning);

      if (parsedData.reply) {
        setMessages(prev => [...prev, { id: Date.now(), role: 'ai', text: parsedData.reply }]);
      }

      if (parsedData.actions && parsedData.actions.length > 0) {
        setInstallations(prev => {
          const copy = JSON.parse(JSON.stringify(prev));
          parsedData.actions.forEach(action => {
            if (action.type === 'add') {
              const floor = action.floor || activeFloor;
              const layer = action.layer;
              const floorIndex = copy.floors?.findIndex(f => f.id === floor);
              if (floorIndex > -1 && copy.floors[floorIndex].data[layer]) {
                copy.floors[floorIndex].data[layer].push(action.element);
              }
            }
          });
          return copy;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now(), role: 'ai', text: 'Błąd połączenia. Upewnij się, że klucz API jest poprawny.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white cursor-pointer z-[100]"
      >
        <Bot size={28} />
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[350px] h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden z-[100]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Asystent SmartBuilder</span>
            <span className="text-[11px] text-slate-300">
              Eksperckie wsparcie przy projektowaniu instalacji
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowSettings((prev) => !prev)}
            className="p-1.5 rounded-full hover:bg-slate-800 transition-colors"
            title="Ustawienia Gemini"
          >
            <Settings size={16} />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 text-xs space-y-2">
          <p className="text-slate-600">
            Wklej klucz API Gemini (Google AI Studio). Klucz jest zapisywany lokalnie w
            przeglądarce.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="gemini_api_key..."
              className="flex-1 px-2 py-1.5 rounded-md border border-slate-300 text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleSaveApiKey}
              className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-[11px] font-semibold hover:bg-indigo-700"
            >
              Zapisz
            </button>
          </div>
        </div>
      )}

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`inline-block max-w-[80%] px-3 py-2 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-l-2xl rounded-tr-2xl'
                  : msg.type === 'error'
                  ? 'bg-red-100 text-red-800 border border-red-300 rounded-r-2xl rounded-tl-2xl'
                  : 'bg-slate-100 text-slate-800 rounded-r-2xl rounded-tl-2xl'
              }`}
            >
              {msg.content ?? msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-r-2xl rounded-tl-2xl bg-slate-100 text-[11px] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
              <span>Asystent analizuje projekt...</span>
            </div>
          </div>
        )}

        <div ref={endOfMessagesRef} />
      </div>

      {/* Footer */}
      <form
        className="border-t border-slate-200 bg-white px-3 py-2 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Opisz, nad czym pracujesz..."
          className="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="shrink-0 w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors disabled:opacity-40"
          disabled={!inputValue.trim()}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

