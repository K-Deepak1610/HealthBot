'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Brain, 
  Upload, 
  Pill, 
  Bell, 
  Shield, 
  Zap, 
  Activity,
  Heart,
  Stethoscope,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-1000 overflow-hidden">
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-56 lg:pb-40 overflow-hidden">
        {/* Dynamic Aura Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] right-[-15%] w-[800px] h-[800px] bg-medical-primary/20 dark:bg-medical-primary/30 rounded-full blur-[140px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
              x: [0, -40, 0],
              y: [0, 40, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] left-[-15%] w-[600px] h-[600px] bg-medical-secondary/15 dark:bg-medical-secondary/25 rounded-full blur-[120px]" 
          />
        </div>

        <div className="container relative z-10 px-6 mx-auto">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass bg-medical-primary/5 dark:bg-white/10 border border-medical-primary/20 dark:border-white/20 text-medical-primary text-[10px] font-black uppercase tracking-[0.25em] mb-10 shadow-2xl shadow-medical-primary/10"
            >
              <Zap size={14} className="fill-current" />
              <span>Next-Generation Bio-Intelligence</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter mb-10 leading-[0.85]"
            >
              <span className="block mb-4 text-slate-950 dark:text-white">The Clinical</span>
              <span className="medical-gradient italic drop-shadow-2xl">Future is Here.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 mb-16 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              Revolutionize your personal healthcare journey with state-of-the-art AI. Experience diagnostic precision and medicinal insights at the speed of thought.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link href="/chat">
                <Button size="xl" variant="medical" className="group rounded-[2rem] shadow-2xl">
                  Begin Consultation
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/upload">
                <Button size="xl" variant="outline" className="rounded-[2rem] backdrop-blur-xl dark:bg-white/5">
                  <Upload className="mr-2 h-5 w-5" />
                  Prescription Vision
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Futuristic Feature Grid */}
      <section className="py-32 relative bg-slate-50 dark:bg-slate-950/20 transition-colors border-y border-slate-200 dark:border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container px-6 mx-auto relative z-10">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl md:text-7xl font-black mb-6 text-slate-950 dark:text-white tracking-tighter"
            >
              Intelligent Ecosystem
            </motion.h2>
            <p className="text-slate-500 dark:text-slate-500 max-w-2xl mx-auto text-xl font-medium tracking-tight">
              Sophisticated bio-computational tools designed for high-performance wellness management.
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: Brain, title: 'Bio-Triage AI', desc: 'Predictive analysis for over 800+ symptoms with clinical accuracy.', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10', href: '/chat' },
              { icon: Activity, title: 'Health Matrix', desc: 'Real-time telemetry and data-driven visualization of your biometric trends.', color: 'text-medical-primary', bg: 'bg-blue-50 dark:bg-blue-500/10', href: '/dashboard' },
              { icon: Pill, title: 'Pharm-Vision', desc: 'FDA-validated medicinal synthesis and drug interaction surveillance.', color: 'text-medical-secondary', bg: 'bg-teal-50 dark:bg-teal-500/10', href: '/medicines' },
              { icon: ShieldCheck, title: 'Vault Enclave', desc: 'Quantum-resistant encryption for your most sensitive medical records.', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10', href: '/dashboard' },
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card variant="glass" className="h-full hover:border-medical-primary/40 group transition-all duration-700">
                  <div className={`p-5 rounded-3xl w-fit mb-8 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${feature.bg} ${feature.color}`}>
                    <feature.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-slate-900 dark:text-white tracking-tight">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base mb-8 font-medium">{feature.desc}</p>
                  <Link href={feature.href} className="text-medical-primary font-black text-xs uppercase tracking-[0.25em] flex items-center gap-2 hover:gap-4 transition-all">
                    Initialize Protocol <ArrowRight size={16} />
                  </Link>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Safety & Performance Section */}
      <section className="py-40 container px-6 mx-auto">
        <Card variant="surface" className="relative overflow-hidden p-16 lg:p-32 border-0 shadow-3xl rounded-[4rem] bg-white dark:bg-slate-950">
          {/* Internal Gradient Background */}
          <div className="absolute inset-0 bg-medical-primary/5 dark:bg-medical-primary/[0.02]" />
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-medical-primary/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-24">
            <div className="flex-1 text-center lg:text-left">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                className="inline-flex p-5 rounded-[2rem] glass text-medical-primary mb-10 shadow-2xl"
              >
                <Shield size={48} className="drop-shadow-glow" />
              </motion.div>
              <h2 className="text-5xl md:text-8xl font-black mb-10 text-slate-950 dark:text-white leading-[0.9] tracking-tighter">Clinical Grade <br /><span className="text-medical-primary">Performance</span></h2>
              <p className="text-2xl text-slate-500 dark:text-slate-400 leading-relaxed mb-14 font-medium tracking-tight">
                HealthBot AI provides educational insights grounded in established research. We prioritize your diagnostic safety with real-time triage and emergency detection algorithms.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                {['FDA-Synched', 'Quantum Crypto', '24/7 Neural Intel'].map((tag, i) => (
                  <div key={i} className="px-6 py-3 rounded-2xl glass-dark border border-white/5 text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.3em]">{tag}</div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-xl">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="medical-glass rounded-[3.5rem] p-12 lg:p-16 border shadow-3xl relative bg-white/40 dark:bg-white/[0.02]"
              >
                 <div className="space-y-12">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-[1.5rem] medical-gradient-bg flex items-center justify-center text-white shadow-xl">
                          <Stethoscope size={32} />
                       </div>
                       <div className="flex-1 h-3.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: '88%' }} transition={{ duration: 1.5, ease: "circOut" }} className="h-full bg-medical-gradient-bg shadow-glow" />
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-[1.5rem] bg-rose-500 flex items-center justify-center text-white shadow-xl shadow-rose-500/20">
                          <Heart size={32} fill="currentColor" />
                       </div>
                       <div className="flex-1 h-3.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: '96%' }} transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }} className="h-full bg-rose-500 shadow-glow" />
                       </div>
                    </div>
                    <div className="pt-12 border-t border-slate-200 dark:border-white/5 mt-6 text-center">
                       <Sparkles size={24} className="text-amber-500 mx-auto mb-6" />
                       <p className="text-lg text-slate-600 dark:text-slate-300 font-bold italic leading-relaxed tracking-tight">
                          "Identifying biometric anomalies and directing clinical protocols with unprecedented resolution."
                       </p>
                    </div>
                 </div>
              </motion.div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
