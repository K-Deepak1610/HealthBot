'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Search, Pill, ShieldAlert, BookOpen, AlertCircle, Loader2, ChevronRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Medicine } from '@/lib/types';

const formatToMarkdown = (text: string) => {
  if (!text) return '';
  let formatted = text.replace(/[■●○•]/g, '\n- ');
  const headerRegex = /^([A-Z\s]{4,}):/gm;
  formatted = formatted.replace(headerRegex, '\n### $1\n');
  if (!formatted.includes('\n- ') && !formatted.includes('\n###')) {
    const segments = formatted.split(/[.;] /);
    if (segments.length > 1) {
      formatted = segments.map(s => `- ${s.trim()}`).join('\n');
    }
  }
  formatted = formatted.replace(/(Warning|Precaution|Caution|⚠️):?/gi, '⚠️ **$1**:');
  return formatted.replace(/\n{3,}/g, '\n\n').trim();
};

export default function MedicinesPage() {
  const [q, setQ] = useState('');
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMedicine(q.trim());
      if (data.detail) throw new Error(data.detail);
      setMedicine(data);
    } catch {
      setError('No results found. Try a different name or spelling (e.g., "Paracetamol", "Ibuprofen").');
      setMedicine(null);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-5 py-2.5 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8">
            <BookOpen size={16} /> OpenFDA Verified Database
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">Medicine <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">Knowledge</span></h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
            Access pharmaceutical-grade data on thousands of medications instantly. Review dosages, identify interactions, and read FDA warnings.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative max-w-3xl mx-auto mb-20 group"
        >
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={28} />
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search (e.g., Paracetamol, Amoxicillin)..."
              className="w-full bg-slate-900/80 backdrop-blur-md border-2 border-white/10 rounded-full pl-20 pr-48 py-8 text-2xl font-bold outline-none focus:border-emerald-500/50 text-white placeholder:text-slate-600 shadow-2xl transition-all"
            />
            <button
              onClick={handleSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-emerald-900 hover:bg-emerald-50 px-8 py-4 rounded-full font-black flex items-center gap-3 transition-all shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'Search'}
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {medicine && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              className="grid lg:grid-cols-5 gap-8"
            >
              <div className="lg:col-span-2 glass rounded-[2.5rem] p-10 border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-500/20 mb-8">
                    <Pill className="text-white" size={40} />
                  </div>
                  <h2 className="text-4xl font-black text-white mb-2 tracking-tight">{medicine.name}</h2>
                  <div className="flex items-center gap-2 mb-10">
                    <CheckCircle className="text-emerald-500" size={18} />
                    <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">FDA Verified Source</span>
                  </div>

                  <div className="space-y-8">
                    <InfoBlock label="Indications & Usage" content={medicine.purpose} />
                  </div>
                </div>

                <div className="mt-12 bg-slate-900 p-6 rounded-3xl border border-white/5">
                  <h4 className="text-white font-bold mb-2">Usage Advice</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Please consult your doctor or pharmacist for personal medical advice tailored to your clinical history.</p>
                </div>
              </div>

              <div className="lg:col-span-3 space-y-6">
                <RiskBlock icon={<Pill className="text-teal-400" size={28} />} label="Dosage & Administration" content={medicine.dosage} bg="bg-slate-900" border="border-white/10" />
                <RiskBlock icon={<ShieldAlert className="text-rose-400" size={28} />} label="Adverse Reactions" content={medicine.side_effects} bg="bg-rose-950/20" border="border-rose-500/20" />
                <RiskBlock icon={<AlertCircle className="text-orange-400" size={28} />} label="Warnings & Precautions" content={medicine.warnings} bg="bg-orange-950/20" border="border-orange-500/20" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center py-24 glass rounded-[3rem] border border-white/10"
          >
            <div className="bg-rose-500/10 p-8 rounded-full w-fit mx-auto mb-8 border border-rose-500/20">
              <AlertCircle className="text-rose-400" size={56} />
            </div>
            <p className="text-slate-300 font-medium text-xl leading-relaxed">{error}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

const InfoBlock = ({ label, content }: { label: string; content: string }) => (
  <div>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 ml-1">{label}</p>
    <div className="prose prose-medical prose-sm max-w-none bg-slate-900/50 p-6 rounded-2xl border border-white/5 shadow-inner">
       <ReactMarkdown remarkPlugins={[remarkGfm]}>
         {formatToMarkdown(content)}
       </ReactMarkdown>
    </div>
  </div>
);

const RiskBlock = ({ icon, label, content, bg, border }: { icon: React.ReactNode; label: string; content: string; bg: string; border: string }) => (
  <motion.div 
    whileHover={{ scale: 1.01 }}
    className={`${bg} border border-white/5 md:${border} rounded-[2.5rem] p-8 lg:p-12 shadow-2xl transition-all duration-500`}
  >
    <h3 className="font-black text-white text-2xl mb-8 flex items-center gap-5">
      <div className="p-3 rounded-2xl bg-white/5">
        {icon}
      </div>
      {label}
    </h3>
    <div className="prose prose-medical prose-lg max-w-none bg-black/20 p-8 rounded-[2rem] border border-white/5">
       <ReactMarkdown remarkPlugins={[remarkGfm]}>
         {formatToMarkdown(content)}
       </ReactMarkdown>
    </div>
  </motion.div>
);
