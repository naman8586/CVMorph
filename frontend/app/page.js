"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Layout,
  Upload,
  Brain,
  FileText,
  ShieldCheck,
  Star,
  Layers,
  Cpu,
  ArrowUpRight,
  Trophy,
} from "lucide-react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Button } from "./components/ui/Button";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-orange-100">
      <Navbar />

      {/* ================= HERO SECTION (RE-DESIGNED) ================= */}
      <section className="relative pt-32 lg:pt-48 pb-20 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-100/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-100/20 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Content */}
            <div className="space-y-8 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  v2.0: Now powered by Gemini 1.5 Pro
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                Stop Applying With <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 italic font-serif leading-normal">
                  The Same Resume.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-500 max-w-xl leading-relaxed">
                CVMorph is the Morphing Engine for your career. We adapt your 
                master experience into surgical, role-specific versions that 
                beat the ATS without compromising the truth.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                  text="Start Morphing"
                  className="w-full sm:w-56 h-14 bg-slate-900 text-white text-lg border-none shadow-2xl hover:scale-105 transition-transform"
                />
                <button className="flex items-center gap-2 px-8 py-4 font-bold text-slate-600 hover:text-orange-600 transition-colors group">
                  View 88+ Score Templates <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Column: Visual */}
            <div className="relative group">
              {/* Decorative Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/20 to-blue-500/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              
              <div className="relative rounded-[32px] overflow-hidden bg-white shadow-2xl border border-slate-200">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
                   <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                   </div>
                   <div className="mx-auto bg-white border border-slate-200 px-3 py-0.5 rounded text-[9px] font-mono text-slate-400">
                      app.cvmorph.ai/editor/master
                   </div>
                </div>
                <Image
                  src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1200"
                  alt="Product Interface"
                  width={1200}
                  height={800}
                  className="w-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Match Rate Card */}
              <div className="absolute -right-6 -bottom-6 p-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 animate-bounce-slow hidden md:block">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                      <Trophy size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ATS Match</p>
                      <p className="text-xl font-black text-slate-900">98% Score</p>
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= BENTO FEATURES GRID ================= */}
      <section id="features" className="py-32 px-6 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
             <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Engineered for Results.</h2>
             <p className="text-slate-500 text-lg">Detailed precision in every line of your career story.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
            {/* Main Feature - Bento Large */}
            <div className="md:col-span-3 lg:col-span-7 bg-slate-50 p-10 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden relative group">
               <div className="relative z-10">
                  <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-orange-200">
                    <Cpu size={28} />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Dual AI Inference Engine</h3>
                  <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                    We use Gemini 1.5 Pro for creative logic and Groq (Llama 3) for 
                    ultra-fast structural analysis. You get the best of both worlds.
                  </p>
               </div>
               <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] group-hover:opacity-10 transition-opacity">
                  <Cpu size={300} strokeWidth={1} />
               </div>
            </div>

            {/* Feature 2 - Bento Small */}
            <div className="md:col-span-3 lg:col-span-5 bg-slate-900 p-10 rounded-[40px] text-white flex flex-col justify-between">
                <div>
                   <h3 className="text-2xl font-bold mb-4">Zero Hallucination Policy</h3>
                   <p className="text-slate-400 leading-relaxed">
                     Our AI is constrained by your source data. It will never invent 
                     a job or a skill you do not actually have.
                   </p>
                </div>
                <div className="flex gap-2 mt-8">
                   <div className="px-4 py-2 rounded-full border border-slate-700 text-[10px] font-bold uppercase tracking-widest text-slate-300">Verified Data</div>
                   <div className="px-4 py-2 rounded-full border border-slate-700 text-[10px] font-bold uppercase tracking-widest text-slate-300">Safe Output</div>
                </div>
            </div>

            {/* Feature 3 - Bento Medium */}
            <div id="templates" className="md:col-span-2 lg:col-span-4 bg-orange-50 p-8 rounded-[40px] border border-orange-100 scroll-mt-20">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 mb-6 shadow-sm">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">ATS-Perfect PDFs</h3>
                <p className="text-slate-600 text-sm">
                  Standardized LaTeX-inspired layouts that every parsing bot can read flawlessly.
                </p>
            </div>

            {/* Feature 4 - Bento Medium */}
            <div className="md:col-span-2 lg:col-span-4 bg-white p-8 rounded-[40px] border border-slate-200">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 mb-6">
                  <Layers size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Version Control</h3>
                <p className="text-slate-500 text-sm">
                  Compare versions side-by-side to see how the AI improved your impact verbs.
                </p>
            </div>

             {/* Feature 5 - Bento Medium */}
             <div className="md:col-span-2 lg:col-span-4 bg-blue-50 p-8 rounded-[40px] border border-blue-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 mb-6 shadow-sm">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Privacy Encryption</h3>
                <p className="text-slate-600 text-sm">
                  Your data is yours. We do not train our models on your personal resume info.
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DYNAMIC WORKFLOW ================= */}
      <section id="how-it-works" className="py-32 bg-slate-900 text-white overflow-hidden relative scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
            <div className="max-w-xl">
               <h2 className="text-4xl md:text-5xl font-bold mb-6">From Master to Specialized.</h2>
               <p className="text-slate-400 text-lg">No more manual editing. No more copy-pasting into ChatGPT.</p>
            </div>
            <div className="flex gap-4">
               <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center text-slate-500 font-bold">01</div>
               <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center text-slate-500 font-bold">02</div>
               <div className="w-12 h-12 rounded-full border border-orange-500 flex items-center justify-center text-orange-500 font-bold">03</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
             {[
               { title: "Upload Source", desc: "Drag and drop your messy master resume. Our parser cleans the data structure.", icon: <Upload className="text-orange-500"/> },
               { title: "Pick Your Morph", desc: "Choose the job role or paste a JD. The Dual-AI engine analyzes the gaps.", icon: <Sparkles className="text-blue-400"/> },
               { title: "Export Excellence", desc: "Download a beautiful, clean, ATS-scoring PDF tailored for that specific role.", icon: <ArrowUpRight className="text-green-400"/> }
             ].map((step, idx) => (
               <div key={idx} className="group">
                  <div className="mb-6 w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* ================= SUCCESS STORIES (Social Proof) ================= */}
      <section id="success" className="py-32 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                 <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 shadow-sm">
                    <p className="text-3xl font-bold mb-1">95%</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">More Callbacks</p>
                 </div>
                 <div className="bg-orange-50 p-8 rounded-[32px] border border-orange-100 shadow-sm">
                    <p className="text-3xl font-bold mb-1">100k+</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Users globally</p>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="bg-blue-50 p-8 rounded-[32px] border border-blue-100 text-center py-20 flex flex-col items-center shadow-sm">
                    <Star className="text-blue-500 mb-4" fill="currentColor" size={32}/>
                    <p className="font-bold text-slate-900 leading-tight">Top Rated AI Resume Tool 2024</p>
                 </div>
              </div>
           </div>
           
           <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">The difference between a rejection and an interview.</h2>
              <p className="text-slate-500 text-lg leading-relaxed italic">The ROI on this tool is incredible. I spent months manually editing resumes. With CVMorph, I applied to 10 jobs in 10 minutes, all perfectly tailored. Landed an offer at a Series B startup 2 weeks later.</p>
              <div className="flex items-center gap-4 pt-4">
                 <div className="w-14 h-14 rounded-full bg-slate-200 border-2 border-white shadow-md overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100" width={100} height={100} alt="User" />
                 </div>
                 <div>
                    <p className="font-bold text-slate-900">Alex Rivera</p>
                    <p className="text-sm text-slate-400 font-semibold tracking-wide">Full Stack Engineer</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* ================= PRICING / FINAL CTA ================= */}
      <section id="pricing" className="py-24 px-6 bg-[#FDFCFB] scroll-mt-20">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[48px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-slate-300">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.15),transparent)] pointer-events-none" />
           <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Your career, <br /> perfectly morphed.</h2>
              <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">Join thousands of professionals using AI to build their career legacy. Start for free, no credit card required.</p>
              <div className="flex justify-center pt-6">
                 <Button
                    text="Get Started for Free"
                    className="w-full sm:w-64 h-16 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-xl border-none shadow-2xl shadow-orange-900/40 hover:scale-105 transition-transform"
                 />
              </div>
           </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(0); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}