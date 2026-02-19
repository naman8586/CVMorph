"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ChevronRight } from "lucide-react";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Templates", href: "#templates" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        isScrolled
          ? "bg-white/70 backdrop-blur-xl border-b border-orange-100/50 py-3 shadow-sm"
          : "bg-transparent border-b border-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-orange-600 via-orange-400 to-amber-300 rounded-xl blur-md opacity-20 group-hover:opacity-60 group-hover:blur-lg transition-all duration-500 animate-pulse" />
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
              <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-orange-500 group-hover:w-full transition-all duration-300 ease-out rounded-full" />
            </div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 group-hover:text-slate-600 transition-colors">
              Neural Architect
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center bg-slate-100/50 border border-slate-200/50 rounded-full px-8 py-2 gap-8 backdrop-blur-sm">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-bold text-slate-600 hover:text-orange-500 transition-all relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-1 bg-orange-500 rounded-full transition-all group-hover:w-1 group-hover:h-1" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-6">
          <Link
            href="/login"
            className="hidden sm:block text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors px-4"
          >
            Sign In
          </Link>

          <Link href="/register">
            <Button
              text="Get Started"
              className="w-36 h-11 bg-slate-900 text-white border-none shadow-xl shadow-slate-200"
            />
          </Link>

          <button
            className="lg:hidden p-2 bg-slate-100 rounded-xl text-slate-600 hover:text-orange-500 transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-slate-100 transition-all duration-500 lg:hidden overflow-hidden shadow-2xl",
          isMobileMenuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0"
        )}
      >
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between group py-2"
              >
                <span className="text-lg font-bold text-slate-800 group-hover:text-orange-500 transition-colors">
                  {link.name}
                </span>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-4 text-center font-bold text-slate-500 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
            >
              Log in to Account
            </Link>
            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
              <Button
                text="Claim Free Credits"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white border-none h-14 text-lg"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;