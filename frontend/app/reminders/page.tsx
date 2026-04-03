'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Bell, Plus, Trash2, Clock, Pill, Droplets, Calendar, Activity, Loader2, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Reminder {
  id: number;
  title: string;
  description: string;
  reminder_time: string;
  category: string;
}

const CATS = [
  { id: 'medicine', icon: Pill, label: 'Medicine', color: 'bg-indigo-600', shadow: 'shadow-indigo-500/30' },
  { id: 'water', icon: Droplets, label: 'Water', color: 'bg-cyan-600', shadow: 'shadow-cyan-500/30' },
  { id: 'checkup', icon: Calendar, label: 'Checkup', color: 'bg-purple-600', shadow: 'shadow-purple-500/30' },
  { id: 'exercise', icon: Activity, label: 'Exercise', color: 'bg-emerald-600', shadow: 'shadow-emerald-500/30' },
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'medicine', reminder_time: '', description: '' });

  const refresh = async () => {
    try { setReminders(await api.getReminders()); } catch {}
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try { 
      await api.addReminder(form); 
      refresh(); 
      setShowForm(false); 
      setForm({ title: '', category: 'medicine', reminder_time: '', description: '' }); 
    } catch { 
      alert('Failed to save reminder.'); 
    }
  };

  const handleDelete = async (id: number) => {
    try { await api.deleteReminder(id); refresh(); } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-[30%] -left-[10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8"
        >
          <div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-600">Planner</span></h1>
            <p className="text-slate-400 font-medium text-lg md:text-xl">Stay on track with your medication and wellness schedule.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-slate-900 px-8 py-4 rounded-full font-black flex items-center gap-3 transition-colors shadow-xl hover:bg-slate-200 w-full md:w-auto justify-center"
          >
            {showForm ? <X size={22} /> : <Plus size={22} />}
            {showForm ? 'Cancel Form' : 'New Reminder'}
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <motion.form 
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
              onSubmit={handleAdd} 
              className="glass rounded-[2.5rem] p-10 mb-12 space-y-10 border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-4">Reminder Title</label>
                  <input required placeholder="e.g. Paracetamol 500mg" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-5 font-bold outline-none focus:border-indigo-500/50 text-white placeholder:text-slate-600 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-4">Scheduled Time</label>
                  <input required type="time" value={form.reminder_time} onChange={e => setForm({ ...form, reminder_time: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-5 font-black outline-none focus:border-indigo-500/50 text-white transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-5">Select Category</label>
                <div className="flex flex-wrap gap-4">
                  {CATS.map(cat => (
                    <button 
                      key={cat.id} 
                      type="button" 
                      onClick={() => setForm({ ...form, category: cat.id })}
                      className={`px-6 py-4 rounded-2xl font-bold text-sm transition-all flex items-center gap-3 border ${
                        form.category === cat.id 
                          ? `${cat.color} text-white shadow-xl ${cat.shadow} border-transparent scale-105` 
                          : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <cat.icon size={20} /> {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-4">Additional Notes (Optional)</label>
                <input placeholder="e.g. take after heavy food" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-5 font-medium outline-none focus:border-indigo-500/50 text-white placeholder:text-slate-600 transition-colors" />
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-colors shadow-xl shadow-indigo-500/20">
                <CheckCircle2 size={24} /> Add to Schedule
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="py-40 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" size={56} /></div>
        ) : reminders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass rounded-[3rem] py-40 text-center border border-white/10"
          >
            <Bell className="mx-auto text-slate-600 mb-8" size={72} />
            <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Schedule is Clear</h3>
            <p className="text-slate-500 font-medium text-lg">Create your first health reminder to get started.</p>
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden" animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-6"
          >
            <AnimatePresence>
              {reminders.map((rem) => {
                const cat = CATS.find(c => c.id === rem.category) || CATS[0];
                return (
                  <motion.div 
                    key={rem.id} 
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    layout
                    className="glass rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between group border border-white/10 hover:border-white/20 transition-all gap-6"
                  >
                    <div className="flex items-center gap-6 md:gap-8">
                      <div className={`w-20 h-20 rounded-[1.5rem] ${cat.color} flex items-center justify-center shadow-2xl ${cat.shadow} shrink-0`}>
                        <cat.icon size={36} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all mb-2 tracking-tight">
                          {rem.title}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                          <span className="text-slate-400 font-bold text-[15px] flex items-center gap-2">
                            <Clock size={16} className="text-indigo-400" /> {rem.reminder_time}
                          </span>
                          {rem.description && (
                            <>
                              <span className="hidden sm:block text-slate-700 font-black">•</span>
                              <span className="text-slate-500 font-medium text-[15px] leading-relaxed">{rem.description}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(rem.id)} 
                      className="p-5 bg-slate-900 border border-white/10 rounded-2xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 hover:border-rose-500/30 transition-all shadow-lg self-start md:self-auto w-full md:w-auto flex justify-center"
                    >
                      <Trash2 size={24} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
