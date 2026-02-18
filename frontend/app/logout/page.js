'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, LogOut } from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      // 1. Clear Authentication
      localStorage.removeItem('token'); 
      localStorage.removeItem('user');
      
      // 2. Short delay for the animation to play
      const timeout = setTimeout(() => {
        router.push('/');
      }, 2000);

      return () => clearTimeout(timeout);
    };

    handleLogout();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center text-slate-900 font-sans overflow-hidden">
      {/* Soft Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-100/50 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative flex flex-col items-center">
        {/* Animated Icon Container */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-white border border-slate-200 rounded-[28px] flex items-center justify-center mb-8 shadow-xl shadow-slate-200"
        >
          <div className="relative">
            <LogOut className="text-slate-400" size={32} />
            <motion.div 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="text-orange-500" size={16} />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-center"
        >
          Securing your <span className="text-orange-500">Neural Profile</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-400 font-bold tracking-[0.3em] uppercase text-[10px] mb-12"
        >
          Disconnecting Session...
        </motion.p>

        {/* Minimalist Progress Loader */}
        <div className="w-48 h-[3px] bg-slate-200 rounded-full relative overflow-hidden">
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-y-0 left-0 bg-slate-900 w-full origin-left"
          />
        </div>
      </div>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-12 text-[10px] font-bold text-slate-300 uppercase tracking-widest"
      >
        CVMorph v1.2.0 — Secure Logout
      </motion.footer>
    </div>
  );
}