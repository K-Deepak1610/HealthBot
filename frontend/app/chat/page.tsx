'use client';
import { useState, useRef, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Bot, User, Send, AlertTriangle, Sparkles, ShieldCheck,
  Mic, Paperclip, Trash2, Copy, Download, Image as ImageIcon, CheckCircle2,
  ChevronRight, Activity, Zap, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';

interface Message {
  role: 'user' | 'bot';
  content: string;
  isEmergency?: boolean;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages([
      {
        role: 'bot',
        content: 'How can I assist with your clinical inquiry today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({ top: scrollHeight - clientHeight, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const query = input.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { role: 'user', content: query, timestamp }]);
    setInput('');
    setLoading(true);

    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          message: query,
          chat_history: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      if (!response.ok) throw new Error('Clinical service link failed.');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      setLoading(false);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  setMessages(prev => {
                    const newMsgs = [...prev];
                    const lastIdx = newMsgs.length - 1;
                    if (newMsgs[lastIdx].role === 'bot') {
                      newMsgs[lastIdx] = {
                        ...newMsgs[lastIdx],
                        content: newMsgs[lastIdx].content + data.content
                      };
                    }
                    return newMsgs;
                  });
                } else if (data.error) {
                  toast(data.error, 'error');
                }
              } catch {
                // Ignore malformed JSON chunks during streaming
              }
            }
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signal lost.';
      toast(errorMessage, 'error');
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      setMessages(p => [...p, { role: 'user', content: `[Prescription Scan: ${file.name}]`, timestamp: 'Analyzing...' }]);
      const data = await api.uploadPrescription(file);
      setMessages(p => [...p, {
        role: 'bot',
        content: `**Clinical Synthesis Complete:**\n\n${data.analysis}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch {
      toast('OCR Analysis Failure', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-slate-950 pt-28 pb-8 px-6 relative overflow-hidden flex flex-col transition-colors duration-1000">
      {/* Background Auras */}
      <motion.div
        animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-full h-full bg-medical-primary/10 blur-[180px] rounded-full pointer-events-none"
      />

      <div className="max-w-6xl mx-auto w-full flex flex-col h-full relative z-10">
        {/* Futuristic Chat Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="medical-glass rounded-[2rem] p-6 mb-8 flex items-center justify-between border border-white/5 shadow-3xl"
        >
          <div className="flex items-center gap-6">
            <div className="medical-gradient-bg p-4 rounded-2xl shadow-xl shadow-medical-primary/20">
              <Bot size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white">Clinical AI Engine</h1>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Protocols
                </span>
                <span className="w-px h-3 bg-white/10" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Secure Session V.2</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-3 glass-dark border border-white/5 rounded-2xl px-5 py-3 shadow-xl">
              <ShieldCheck size={18} className="text-medical-primary shadow-glow" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">HIPAA Protected</span>
            </div>
            <button
              onClick={() => setMessages([])}
              className="p-3.5 rounded-2xl glass hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all border border-white/5"
              aria-label="Clear chat history"
              title="Clear chat history"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </motion.div>

        {/* Conversation Area */}
        <div ref={chatContainerRef} className="flex-1 min-h-0 bg-slate-900/20 border border-white/5 rounded-[2.5rem] p-8 overflow-y-auto mb-8 custom-scrollbar space-y-10">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl transition-transform hover:scale-110 ${msg.role === 'user' ? 'bg-indigo-600' : 'medical-glass border border-white/10'
                  }`}>
                  {msg.role === 'user' ? <User size={28} className="text-white" /> : <Bot size={28} className="text-white" />}
                </div>

                <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-8 relative group transition-all ${msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-[2rem] rounded-tr-md shadow-2xl shadow-indigo-600/10'
                      : 'medical-glass text-slate-200 rounded-[2rem] rounded-tl-md border border-white/5 shadow-3xl'
                    }`}>
                    {msg.isEmergency && (
                      <div className="flex items-center gap-3 mb-6 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-rose-400 text-xs font-black uppercase tracking-widest">
                        <AlertTriangle size={18} /> Emergency Protocol Suggested
                      </div>
                    )}

                    <div className="prose prose-medical prose-invert prose-p:leading-relaxed prose-p:text-lg prose-a:text-medical-primary prose-headings:font-black max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>

                    {msg.role === 'bot' && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(msg.content);
                          setCopiedIndex(i);
                          setTimeout(() => setCopiedIndex(null), 2000);
                        }}
                        className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 text-slate-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 hover:text-white"
                        aria-label="Copy message"
                        title="Copy message"
                      >
                        {copiedIndex === i ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Copy size={18} />}
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-4 px-2">
                    {msg.timestamp}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-6"
            >
              <div className="w-14 h-14 rounded-2xl medical-glass border border-white/10 flex items-center justify-center">
                <Bot size={28} className="text-white/40" />
              </div>
              <div className="medical-glass rounded-[2rem] rounded-tl-md p-8 flex items-center gap-4">
                <div className="flex gap-2.5">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      className="w-3 h-3 bg-medical-primary rounded-full shadow-glow"
                    />
                  ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-medical-primary/60">Bio-Syncing...</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sophisticated Input HUD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="shrink-0 medical-glass rounded-[2.5rem] p-4 border border-white/5 shadow-3xl focus-within:border-medical-primary/30 transition-all duration-500"
        >
          <form onSubmit={handleSend} className="flex gap-4 items-center">
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
              aria-label="Upload file"
              title="Upload file"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-4 rounded-2xl glass hover:bg-medical-primary/10 text-slate-400 hover:text-medical-primary transition-all group"
              aria-label="Attach prescription"
              title="Attach prescription"
            >
              <Paperclip size={24} className="group-hover:scale-110 transition-transform" />
            </button>

            <button
              type="button"
              className={`p-4 rounded-2xl transition-all group ${isListening ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'glass text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-400'}`}
              aria-label="Voice input"
              title="Voice input"
            >
              <Mic size={24} />
            </button>

            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Describe symptoms or query pharmaceutical data..."
              className="flex-grow bg-transparent px-6 py-4 outline-none text-white font-bold placeholder:text-white/20 text-lg tracking-tight"
              aria-label="Message input"
            />

            <Button
              type="submit"
              disabled={loading || !input.trim()}
              variant="medical"
              className="rounded-[1.5rem] p-5 h-auto aspect-square overflow-hidden"
              aria-label="Send message"
              title="Send message"
            >
              <Send size={24} />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
