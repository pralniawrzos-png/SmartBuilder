import React from 'react';
import { Bot, X, Send } from 'lucide-react';

export default function AiAssistant({ showAi, setShowAi }) {
  if (!showAi) return null;

  return (
    <div className="absolute bottom-6 right-6 z-50 w-[350px] h-[500px] bg-white shadow-2xl rounded-3xl border border-slate-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-md">
            <Bot size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight">Asystent SmartBuilder</span>
            <span className="text-[11px] text-slate-200 leading-tight font-medium">
              Wirtualny inżynier instalacji
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowAi(false)}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto bg-slate-50">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 w-7 h-7 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow">
            <Bot size={16} />
          </div>
          <div className="max-w-[260px] rounded-2xl rounded-tl-sm bg-indigo-50 text-slate-800 px-3 py-2.5 text-sm shadow-sm border border-indigo-100">
            Cześć! Jestem Twoim wirtualnym inżynierem. W czym mogę pomóc? Przeanalizować koszty czy doradzić z trasą
            kabli?
          </div>
        </div>
      </div>

      {/* Footer input */}
      <div className="px-3 py-2.5 border-t border-slate-200 bg-white">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            type="text"
            placeholder="Napisz swoje pytanie..."
            className="flex-1 text-sm px-3 py-2 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md shadow-indigo-200"
          >
            <Send size={14} />
            Wyślij
          </button>
        </form>
      </div>
    </div>
  );
}

