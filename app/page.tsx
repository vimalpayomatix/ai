'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};

async function sendPrompt(prompt: string): Promise<string> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ promt: prompt })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }

  const data = await res.json();
  // The backend returns arbitrary JSON. Try common fields else stringify.
  const candidate = data?.message ?? data?.response ?? data?.text ?? data?.answer;
  return typeof candidate === 'string' ? candidate : JSON.stringify(data);
}

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = useCallback(async () => {
    const prompt = input.trim();
    if (!prompt || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt
    };
    setMessages((prev: ChatMessage[]) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const reply = await sendPrompt(prompt);
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: reply
      };
      setMessages((prev: ChatMessage[]) => [...prev, aiMsg]);
    } catch (err: any) {
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'system',
        content: `Error: ${err?.message || 'Unknown error'}`
      };
      setMessages((prev: ChatMessage[]) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">AI Chat</h1>
        <a className="text-xs text-white/60 underline" href="https://backed-ai.vercel.app/api/ai" target="_blank" rel="noreferrer">API</a>
      </div>

      <div className="card p-4">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {messages.length === 0 && (
            <div className="text-sm text-white/60">
              Ask anything to get started.
            </div>
          )}
          {messages.map((m: ChatMessage) => (
            <div key={m.id} className="flex gap-3">
              <div className={`h-7 w-7 shrink-0 rounded-lg flex items-center justify-center text-[10px] uppercase tracking-wider ${
                m.role === 'user' ? 'bg-primary/30 text-primary' : m.role === 'assistant' ? 'bg-white/10 text-white/80' : 'bg-red-500/20 text-red-300'
              }`}>
                {m.role === 'user' ? 'You' : m.role === 'assistant' ? 'AI' : 'Sys'}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed text-sm">{m.content}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="mt-4 flex gap-2">
          <input
            className="input"
            placeholder="Type your prompt and press Enter..."
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button className="btn" onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </main>
  );
}


