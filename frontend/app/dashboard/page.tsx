'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Bell, 
  Activity, 
  ClipboardList, 
  Shield, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  ArrowRight,
  Zap,
  Calendar,
  AlertCircle,
  Settings,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import type { Variants } from 'framer-motion';
import type { Reminder, HistoryItem } from '@/lib/types';
import Link from 'next/link';
import { medicalApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function DashboardPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        const [remRes, histRes] = await Promise.all([
          medicalApi.getReminders(),
          medicalApi.getHistory(1, 5)
        ]);
        setReminders(remRes.data || []);
        const histData = histRes.data;
        setHistory(Array.isArray(histData) ? histData : (histData?.items || []));
      } catch {
        toast("Failed to load dashboard data. Please try logging in again.", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 relative overflow-hidden transition-colors duration-1000">
      {/* Background Ambience / Auras */}
      <motion.div 
        animate={{ 
          opacity: [0.05, 0.1, 0.05],
          scale: [1, 1.1, 1] 
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-[10%] right-[10%] w-[800px] h-[800px] bg-medical-primary/10 rounded-full blur-[150px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          opacity: [0.03, 0.08, 0.03],
          scale: [1, 1.2, 1] 
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-[20%] left-[5%] w-[600px] h-[600px] bg-medical-secondary/10 rounded-full blur-[150px] pointer-events-none" 
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-3 text-medical-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4">
              <Zap size={14} className="fill-current" />
              <span>Bio-Telemetry Active</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 dark:text-white">
              Clinical <span className="medical-gradient">Intelligence</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button variant="outline" size="lg" className="rounded-2xl group border-slate-200 dark:border-white/10 dark:bg-white/5">
                <Settings size={20} className="group-hover:rotate-90 transition-transform duration-700" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="medical" size="lg" className="rounded-2xl px-8 shadow-2xl">
                <Sparkles size={18} className="mr-2" />
                New AI Consult
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { label: 'Active Reminders', value: reminders.length, icon: Bell, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
            { label: 'Diagnostic Checks', value: history.length, icon: Activity, color: 'text-medical-primary', bg: 'bg-blue-50 dark:bg-blue-500/10' },
            { label: 'Data Integrity', value: '100%', icon: ShieldCheck, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          ].map((stat, i) => (
            <Card key={i} className="group hover:border-medical-primary/30 transition-all duration-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                  <p className="text-5xl font-black text-slate-950 dark:text-white tracking-tighter">
                    {loading ? <Skeleton className="h-12 w-16 rounded-xl" /> : stat.value}
                  </p>
                </div>
                <div className={`p-5 rounded-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${stat.bg} ${stat.color} shadow-inner`}>
                  <stat.icon size={32} />
                </div>
              </div>
            </Card>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-7 gap-10">
          {/* Main Activity Feed */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between px-2 pt-2">
                <div className="flex items-center gap-4">
                   <div className="p-3 rounded-2xl bg-medical-primary/10 text-medical-primary">
                     <TrendingUp size={24} />
                   </div>
                   <CardTitle>Care Timeline</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="text-[10px] tracking-[0.2em] font-black hover:text-medical-primary">ARCHIVE</Button>
              </CardHeader>
              <CardContent className="mt-10">
                {loading ? (
                   <div className="space-y-8">
                     {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-3xl" />)}
                   </div>
                ) : history.length === 0 ? (
                   <div className="py-20 text-center medical-glass rounded-[2.5rem] border-dashed">
                     <ClipboardList size={64} className="mx-auto text-slate-200 dark:text-slate-800 mb-6" />
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No recent health records</p>
                   </div>
                ) : (
                  <div className="space-y-10 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-white/5">
                    {history.map((item) => (
                      <div key={item.id} className="flex gap-8 group cursor-pointer relative z-10">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110 ${item.is_emergency ? 'bg-rose-500 text-white' : 'glass border-slate-200 dark:border-white/10 text-medical-primary'}`}>
                          {item.is_emergency ? <AlertCircle size={20} /> : <Activity size={20} />}
                        </div>
                        <div className="flex-1 pb-10 border-b border-slate-100 dark:border-white/5 group-last:border-0 transition-all">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}</p>
                            <ArrowUpRight size={18} className="text-slate-300 dark:text-slate-700 group-hover:text-medical-primary transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                          </div>
                          <h4 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-medical-primary transition-colors">{item.message_preview || "Symptom Analysis"}</h4>
                          <p className="text-base text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 font-medium leading-relaxed">{item.response_preview}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar Modules */}
          <motion.div variants={itemVariants} className="lg:col-span-3 space-y-8">
            {/* Schedule Module */}
            <Card variant="glass" className="overflow-hidden relative">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400">
                  <Calendar size={24} />
                </div>
                <CardTitle className="text-white">Bio-Schedule</CardTitle>
              </CardHeader>
              <CardContent className="mt-8 space-y-4">
                {loading ? (
                   <div className="space-y-4">
                     {[1,2].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl bg-white/5" />)}
                   </div>
                ) : reminders.length === 0 ? (
                  <div className="py-10 text-center text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    Optimized: No alerts
                  </div>
                ) : (
                  reminders.map((rem) => (
                    <div key={rem.id} className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                         <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                           <Clock size={16} />
                         </div>
                         <span className="text-sm font-black text-slate-200 tracking-tight">{rem.title}</span>
                      </div>
                      <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg uppercase tracking-widest">{rem.reminder_time}</span>
                    </div>
                  ))
                )}
                <Button variant="outline" className="w-full mt-4 border-dashed border-white/10 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/5 rounded-2xl font-black py-8 uppercase tracking-[0.2em] text-[10px]">
                  <Zap size={14} className="mr-2" />
                  Sync Protocols
                </Button>
              </CardContent>
            </Card>

            {/* Health Tip / Insight */}
            <Card className="bg-amber-500/5 border-amber-500/20 rounded-[3rem] p-10">
              <div className="flex gap-6">
                <div className="p-4 rounded-2xl bg-amber-500/20 text-amber-500 h-fit">
                  <Sparkles size={28} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.25em] mb-3">Weekly Bio-Insight</p>
                   <p className="text-lg font-bold text-slate-900 dark:text-slate-200 leading-relaxed tracking-tight">
                     Optimizing your REM sleep by just 15 minutes can improve AI diagnostic resolution by up to 8% in personal triage.
                   </p>
                   <Link href="#" className="inline-flex items-center gap-2 mt-6 text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:gap-4">
                     Learn More <ArrowRight size={14} />
                   </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
