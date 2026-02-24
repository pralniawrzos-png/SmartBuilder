import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send } from 'lucide-react';

export default function AiAssistant({ setShowAi }) {
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

  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: `To jest przykładowa odpowiedź Asystenta AI oparta na Twojej wiadomości: "${text}". W docelowej wersji w tym miejscu pojawi się analiza rzutu, instalacji oraz konkretne rekomendacje.`,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    if (setShowAi) {
      setShowAi(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-[350px] h-[500px] z-[100] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden">
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
        <button
          type="button"
          onClick={handleClose}
          className="p-1 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

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
                  : 'bg-slate-100 text-slate-800 rounded-r-2xl rounded-tl-2xl'
              }`}
            >
              {msg.content}
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

