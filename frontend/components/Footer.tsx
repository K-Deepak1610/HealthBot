import Link from 'next/link';
import { Heart, Github, Twitter, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/80 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-600 p-2 rounded-xl">
                <Heart size={20} className="text-white" fill="white" />
              </div>
              <span className="text-xl font-black">Health<span className="text-indigo-400">Bot</span> <span className="text-cyan-400">AI</span></span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-sm">
              Your intelligent AI healthcare companion. Empowering smarter health decisions through technology.
            </p>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">Platform</h4>
            <nav className="space-y-3">
              {[['/', 'Home'], ['/chat', 'Symptom AI'], ['/upload', 'Prescription Scanner'], ['/medicines', 'Medicine Hub'], ['/dashboard', 'Dashboard']].map(([href, label]) => (
                <Link key={href} href={href} className="block text-slate-500 hover:text-white transition-colors font-medium">{label}</Link>
              ))}
            </nav>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">Legal</h4>
            <nav className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'HIPAA Notice'].map(label => (
                <a key={label} href="#" className="block text-slate-500 hover:text-white transition-colors font-medium">{label}</a>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">© 2026 HealthBot AI. All rights reserved.</p>
          <div className="flex items-center gap-2 text-slate-500 text-xs text-center">
            <Shield size={14} className="text-yellow-500" />
            <span>HealthBot AI is for educational purposes only. Not a substitute for professional medical advice.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
