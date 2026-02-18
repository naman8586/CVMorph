"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck, Lock } from "lucide-react";
import { authAPI } from "@/lib/api";
import { setToken, setUser, isAuthenticated } from "@/lib/auth";
import { Button } from "../components/ui/Button"; // Using your custom Button
import { cn } from "@/lib/utils";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 relative overflow-hidden text-slate-900">
      {/* Background Ambience - Matching Home Page */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-100/30 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Brand Identity */}
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center gap-4 group">
          <div className="relative">
            {/* Animated Background Glow - Now with a "Pulse" effect on hover */}
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-orange-600 via-orange-400 to-amber-300 rounded-xl blur-md opacity-20 group-hover:opacity-60 group-hover:blur-lg transition-all duration-500 animate-pulse" />

            {/* Logo Icon Box */}
            <div className="relative w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center shadow-2xl group-hover:rotate-[-4deg] group-hover:scale-110 transition-all duration-300 border border-white/10">
              <div className="flex flex-col items-center leading-none">
                <span className="text-orange-400 font-black text-[12px] tracking-tighter">
                  CV
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="relative">
              <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none">
                Morph
              </span>
              {/* Animated underline that expands on hover */}
              <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-orange-500 group-hover:w-full transition-all duration-300 ease-out rounded-full" />
            </div>

            {/* Brand Tagline: Adds professional "SaaS" polish */}
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 group-hover:text-slate-600 transition-colors">
              Neural Architect
            </span>
          </div>
        </Link>
        </div>

        {/* Login Container */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-8 md:p-10 rounded-[40px] shadow-2xl shadow-slate-200/50">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 text-sm mt-1">Sign in to continue morphing your career.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-semibold px-4 py-3 rounded-2xl mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all placeholder:text-slate-300"
                placeholder="name@company.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                <Link href="/forgot" className="text-[10px] font-bold text-orange-600 hover:text-orange-700 uppercase tracking-tighter">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all placeholder:text-slate-300"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              text={loading ? "Verifying..." : "Sign In to Dashboard"}
              disabled={loading}
              className="w-full h-14 bg-slate-900 text-white font-bold text-base border-none shadow-xl shadow-slate-200 mt-2"
            />
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-8">
            <p className="text-slate-500 text-sm font-medium">
              Dont have an account?{" "}
              <Link href="/register" className="text-orange-600 font-bold hover:underline transition-colors">
                Create one for free
              </Link>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-8 flex items-center justify-center gap-6 text-slate-400">
            <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">AES-256 Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Lock size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Secure Session</span>
            </div>
        </div>

        {/* Return link */}
        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 text-[11px] font-bold uppercase tracking-widest transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}