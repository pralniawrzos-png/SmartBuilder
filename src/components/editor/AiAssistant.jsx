import React, { useState } from 'react';

const DEFAULT_MESSAGE = { role: 'ai', text: 'Cześć! Jestem Twoim wirtualnym inżynierem. W czym mogę pomóc?' };

export default function AiAssistant() {
  const [messages, setMessages] = useState([DEFAULT_MESSAGE]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setInputValue('');

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: 'Analizuję Twój projekt, daj mi chwilkę...' }]);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm font-medium ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-200 text-slate-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-slate-200 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Napisz wiadomość..."
          className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 outline-none text-slate-800 placeholder:text-slate-400"
        />
        <button
          onClick={handleSend}
          className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
        >
          Wyślij
        </button>
      </div>
    </div>
  );
}
