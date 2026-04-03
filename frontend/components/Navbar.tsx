'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, MessageSquare, Upload, Search, Bell, LayoutDashboard, LogIn, User, Settings, Menu, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const links = [
  { href: '/chat', label: 'Consult', icon: MessageSquare },
  { href: '/upload', label: 'Scan', icon: Upload },
  { href: '/medicines', label: 'Meds', icon: Search },
  { href: '/reminders', label: 'Alerts', icon: Bell },
  { href: '/dashboard', label: 'Intel', icon: LayoutDashboard },
];

export default function Navbar() {
  const path = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('access_token'));
    
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [path]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 ${
        scrolled ? 'pt-2' : 'pt-6'
      }`}
    >
      <nav className={`max-w-7xl mx-auto transition-all duration-500 ${
        scrolled 
          ? 'glass-dark rounded-3xl px-6 py-3 shadow-2xl scale-[0.98]' 
          : 'glass rounded-[2.5rem] px-8 py-5 shadow-xl'
      } flex items-center justify-between border border-white/10`}>
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="medical-gradient-bg p-2.5 rounded-2xl shadow-xl shadow-medical-primary/20"
          >
            <Heart size={20} className="text-white" fill="white" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tighter text-slate-900 dark:text-white leading-none">
              Health<span className="text-medical-primary">Bot</span>
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-medical-secondary leading-none mt-1">Intelligence</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-2">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = path === href || path.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  isActive 
                    ? 'text-medical-primary bg-medical-primary/5' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon size={14} className={isActive ? 'fill-current' : ''} />
                {label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-bg"
                    className="absolute inset-0 bg-medical-primary/5 border border-medical-primary/10 rounded-xl"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Action Area */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 mr-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live AI</span>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 transition-all"
              >
                <Settings size={18} />
              </Link>
              <Link
                href="/profile"
                className="hidden md:flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                <User size={14} />
                Profile
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="medical-gradient-bg text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-medical-primary/20 hover:scale-105 active:scale-95"
            >
              <LogIn size={14} />
              Sign In
            </Link>
          )}

          {/* Mobile Menu */}
          <button
            className="lg:hidden p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden mt-4 glass-dark rounded-[2.5rem] p-6 border border-white/10 shadow-3xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-medical-primary/10 blur-[80px] rounded-full -mr-32 -mt-32" />
            
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {links.map(({ href, label, icon: Icon }) => {
                const isActive = path === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex flex-col items-center justify-center p-6 rounded-3xl gap-3 border transition-all ${
                      isActive
                        ? 'bg-medical-primary/20 border-medical-primary/40 text-medical-primary'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                  </Link>
                );
              })}
            </div>
            
            {!isLoggedIn && (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-4 flex items-center justify-center gap-3 w-full py-4 medical-gradient-bg text-white rounded-3xl font-black uppercase tracking-widest text-xs"
              >
                <LogIn size={18} /> Sign In to HealthBot
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
