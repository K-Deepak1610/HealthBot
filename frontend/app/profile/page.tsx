'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Bell, 
  LogOut, 
  Trash2, 
  ChevronRight, 
  Camera, 
  Activity,
  Zap,
  Lock,
  Heart,
  AlertTriangle,
  History
} from 'lucide-react';
import { authApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Variants } from 'framer-motion';
import type { User } from '@/lib/types';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await authApi.getCurrentUser();
        setUser(response.data);
      } catch {
        toast("Failed to load clinical identity.", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [toast]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 relative overflow-hidden transition-colors duration-1000">
      {/* Background Ambience */}
      <motion.div 
        animate={{ opacity: [0.05, 0.1, 0.05], scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-medical-primary/10 rounded-full blur-[160px] pointer-events-none" 
      />

      <motion.div 
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="max-w-4xl mx-auto relative z-10"
      >
        {/* Profile Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center gap-10 mb-16">
          <div className="relative group">
            <div className="w-40 h-40 rounded-[3rem] medical-gradient-bg p-1.5 shadow-2xl transition-transform duration-700 group-hover:scale-105">
              <div className="w-full h-full rounded-[2.8rem] bg-background flex items-center justify-center overflow-hidden border-4 border-background">
                 <UserIcon size={64} className="text-medical-primary" />
              </div>
            </div>
            <button 
              className="absolute bottom-0 right-0 p-4 rounded-2xl medical-glass border border-white/10 text-white shadow-xl hover:scale-110 transition-all"
              aria-label="Update avatar"
              title="Update avatar"
            >
              <Camera size={20} />
            </button>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-3 text-medical-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4">
              <Zap size={14} className="fill-current" />
              <span>Bio-Identity Verified</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 dark:text-white mb-4">
              {loading ? <Skeleton className="h-16 w-64 bg-slate-200 dark:bg-white/5" /> : (user?.username || 'Researcher')}
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium tracking-tight">Active clinical session since Oct 2023</p>
          </div>
        </motion.div>

        <div className="grid gap-8">
          {/* Account Details Card */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                 <div className="p-3 rounded-2xl bg-medical-primary/10 text-medical-primary">
                    <Shield size={24} />
                 </div>
                 <CardTitle>Clinical Enclave</CardTitle>
              </CardHeader>
              <CardContent className="mt-8 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Universal ID</label>
                    <div className="p-5 rounded-2xl medical-glass border border-white/5 flex items-center gap-4 text-slate-700 dark:text-slate-300 font-bold">
                       <UserIcon size={18} className="text-medical-primary" />
                       {loading ? <Skeleton className="h-6 w-32 rounded-lg" /> : user?.username}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Secure Vector</label>
                    <div className="p-5 rounded-2xl medical-glass border border-white/5 flex items-center gap-4 text-slate-700 dark:text-slate-300 font-bold">
                       <Mail size={18} className="text-medical-primary" />
                       {loading ? <Skeleton className="h-6 w-48 rounded-lg" /> : user?.email}
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                   <div className="flex items-center gap-4 text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em]">
                      <Lock size={14} />
                      Quantum Encryption: Active
                   </div>
                   <Button variant="ghost" size="sm" className="font-black text-[10px] tracking-widest hover:text-medical-primary">REFRESH SECRETS</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preferences & Intel Card */}
          <motion.div variants={itemVariants}>
            <div className="grid md:grid-cols-2 gap-8">
              <Card variant="glass" className="hover:border-indigo-500/30 transition-all duration-700 group cursor-pointer">
                <div className="flex items-center justify-between mb-8">
                   <div className="p-4 rounded-2xl bg-indigo-500/20 text-indigo-400">
                      <Bell size={24} />
                   </div>
                   <ChevronRight className="text-white/20 group-hover:text-indigo-400 group-hover:translate-x-2 transition-all" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Protocol Alerts</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">Configure neuro-telemetry and drug interaction surveillance notifications.</p>
              </Card>

              <Card variant="glass" className="hover:border-teal-500/30 transition-all duration-700 group cursor-pointer">
                <div className="flex items-center justify-between mb-8">
                   <div className="p-4 rounded-2xl bg-teal-500/20 text-teal-400">
                      <History size={24} />
                   </div>
                   <ChevronRight className="text-white/20 group-hover:text-teal-400 group-hover:translate-x-2 transition-all" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Data Archival</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">Synchronize your historical clinical telemetry with external health vaults.</p>
              </Card>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div variants={itemVariants} className="mt-12">
            <div className="relative p-1 rounded-[3.5rem] bg-rose-500/10 border border-rose-500/20">
               <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-rose-500/5 to-transparent rounded-b-[3.5rem] pointer-events-none" />
               <Card variant="surface" className="border-0 bg-white/40 dark:bg-slate-950/40 backdrop-blur-3xl p-12">
                  <div className="flex flex-col md:flex-row items-center gap-10">
                     <div className="p-6 rounded-[2rem] bg-rose-500/20 text-rose-500 shadow-2xl shadow-rose-500/20">
                        <AlertTriangle size={48} />
                     </div>
                     <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-black text-slate-950 dark:text-white mb-3">Terminate Clinical Persona</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
                           Permanently wipe all biometric telemetry, historical analysis, and account data from our secure enclaves. This protocol is irreversible.
                        </p>
                     </div>
                     <div className="flex flex-col gap-4 w-full md:w-auto">
                        <Button 
                          variant="ghost" 
                          onClick={handleLogout}
                          className="rounded-2xl h-14 px-8 font-black text-xs uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                        >
                          <LogOut size={18} className="mr-3" />
                          Sign Out
                        </Button>
                        <Button 
                          variant="outline" 
                          className="rounded-2xl h-14 px-8 border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white font-black text-xs uppercase tracking-[0.2em] transition-all"
                        >
                          <Trash2 size={18} className="mr-3" />
                          Purge Session
                        </Button>
                     </div>
                  </div>
               </Card>
            </div>
          </motion.div>
        </div>

        {/* Global Branding Token */}
        <motion.div variants={itemVariants} className="mt-32 text-center pt-24 border-t border-slate-100 dark:border-white/5 opacity-40">
           <Heart size={24} className="mx-auto text-medical-primary mb-6 fill-medical-primary/20" />
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Premium Bio-Intelligence System &copy; 2026</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
