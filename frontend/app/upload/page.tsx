'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { 
  Upload, 
  FileText, 
  Bot, 
  AlertCircle, 
  Sparkles, 
  ImageIcon, 
  CheckCircle,
  Stethoscope,
  Activity,
  History,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; analysis: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) handleFile(f);
  }, []);

  const handleAnalyze = async () => {
    if (!file || loading) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.uploadPrescription(file);
      setResult(data);
    } catch {
      setError('Neural processing failed. Ensure the server is active and the image is clear.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 overflow-hidden relative">
      {/* Dynamic Background Auras */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-medical-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-medical-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-medical-primary/10 border border-medical-primary/20 rounded-full px-5 py-2.5 text-medical-primary text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-2xl"
          >
            <Zap size={14} className="fill-current" />
            <span>Bio-Vision Intel v2.0</span>
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
            Prescription <br />
            <span className="medical-gradient italic">Intelligence.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
            Neural extraction for medicinal verification. Analyze your physical prescriptions with clinical-grade accuracy.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Diagnostic Input Zone */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col space-y-8"
          >
            <div
              onDrop={onDrop}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              className={`relative rounded-[3rem] border-2 border-dashed min-h-[520px] flex flex-col items-center justify-center transition-all duration-700 overflow-hidden ${
                drag ? 'border-medical-primary bg-medical-primary/5 scale-[1.02]' 
                     : preview ? 'border-medical-primary/30 bg-medical-primary/[0.02]' 
                     : 'border-white/10 hover:border-white/20 bg-slate-900/40'
              }`}
            >
              <AnimatePresence mode="wait">
                {preview ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative w-full h-full p-8 flex items-center justify-center"
                  >
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="max-h-[420px] rounded-2xl object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center p-12"
                  >
                    <div className="w-24 h-24 rounded-[2rem] medical-glass flex items-center justify-center mb-10 shadow-2xl group-hover:scale-110 transition-transform">
                      <ImageIcon className="text-medical-primary" size={48} />
                    </div>
                    <h3 className="text-white font-black text-3xl mb-4 tracking-tight">Clinical Visual Sync</h3>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-xs">Drop medical documents here to initialize neuro-scan.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <label className="absolute bottom-10 shadow-2xl cursor-pointer group">
                <div className="bg-white text-slate-950 px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all group-hover:scale-105 active:scale-95 shadow-xl">
                  {preview ? 'Swap Component' : 'Initialize Scan'}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </label>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!file || loading}
              size="xl"
              variant="medical"
              className="w-full rounded-[2.5rem] py-8 text-xl shadow-3xl group"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                    key="loading"
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                  >
                    <Activity size={28} />
                  </motion.div>
                ) : (
                  <motion.div key="ready" className="flex items-center gap-4">
                    <Stethoscope size={28} />
                    <span>Run Clinical Analysis</span>
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          {/* Clinical Insights Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="glass" className="min-h-[620px] flex flex-col p-12 border-white/10 relative overflow-hidden bg-slate-900/40">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                 <History size={120} />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <header className="mb-12">
                   <div className="flex items-center justify-between mb-2">
                      <h2 className="text-3xl font-black text-white tracking-tighter">Diagnostic Profile</h2>
                      <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${result ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}>
                         {result ? 'Analysis Complete' : 'System Ready'}
                      </div>
                   </div>
                   <p className="text-slate-500 font-medium">Real-time prescription interaction synthesis.</p>
                </header>

                <div className="flex-grow flex flex-col">
                  {!result && !loading && !error && (
                    <div className="flex-grow flex flex-col items-center justify-center text-center py-20">
                      <div className="w-32 h-32 rounded-[2.5rem] bg-slate-800/50 border border-white/5 flex items-center justify-center mb-8 opacity-40">
                         <Bot size={64} className="text-slate-400" />
                      </div>
                      <p className="font-bold text-xl text-slate-500 tracking-tight">Syncing with clinical cloud...</p>
                    </div>
                  )}

                  {loading && (
                    <div className="flex-grow flex flex-col items-center justify-center">
                      <div className="relative w-40 h-40 mb-12">
                        <motion.div 
                          animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
                          transition={{ repeat: Infinity, ease: "linear", duration: 4 }}
                          className="absolute inset-0 rounded-full border-t-2 border-r-2 border-medical-primary shadow-[0_0_80px_rgba(0,102,204,0.3)]" 
                        />
                        <Bot className="absolute inset-0 m-auto text-medical-primary animate-pulse" size={64} />
                      </div>
                      <p className="text-3xl font-black mb-4 text-white tracking-tighter">Neuro-Processing</p>
                      <p className="text-slate-500 font-medium text-lg italic px-10 text-center">Identifying molecular compounds and cross-referencing contraindications...</p>
                    </div>
                  )}

                  {error && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-rose-500/5 border border-rose-500/30 rounded-[2rem] p-10 flex flex-col items-center text-center gap-6"
                    >
                      <div className="p-6 rounded-full bg-rose-500/10 text-rose-500">
                         <AlertCircle size={48} />
                      </div>
                      <div>
                        <h4 className="text-rose-500 font-black text-xl mb-2">Protocol Interrupted</h4>
                        <p className="text-rose-400/70 font-medium leading-relaxed">{error}</p>
                      </div>
                      <Button variant="ghost" onClick={() => setError(null)} className="text-rose-500 font-black text-xs uppercase tracking-widest mt-4">Dismiss Warning</Button>
                    </motion.div>
                  )}

                  {result && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-12 pr-6 custom-scrollbar flex-grow overflow-y-auto"
                    >
                      <div className="bg-slate-950/80 border border-white/5 rounded-[2rem] p-10 shadow-inner">
                        <header className="flex items-center gap-3 mb-6">
                           <FileText size={16} className="text-slate-500" />
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Extracted Metadata</p>
                        </header>
                        <p className="text-slate-300 font-mono text-xs leading-relaxed whitespace-pre-wrap">{result.text}</p>
                      </div>

                      <div className="bg-medical-primary/[0.03] border border-medical-primary/20 rounded-[2.5rem] p-10 lg:p-12 relative">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-medical-primary/10 blur-[60px] rounded-full pointer-events-none" />
                        <header className="flex items-center gap-3 mb-10">
                           <Sparkles size={20} className="text-medical-primary drop-shadow-glow" />
                           <p className="text-[11px] font-black text-medical-primary uppercase tracking-[0.4em]">Clinical Synthesis</p>
                        </header>
                        <div className="prose prose-medical dark:prose-invert max-w-none">
                           <ReactMarkdown remarkPlugins={[remarkGfm]}>
                             {result.analysis}
                           </ReactMarkdown>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
