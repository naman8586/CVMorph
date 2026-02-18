import React from 'react';
import Link from 'next/link';
import { Sparkles, Github, Twitter, Linkedin, Mail, ArrowRight } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: "AI Resume Builder", href: "#" },
      { name: "ATS Checker", href: "#" },
      { name: "Cover Letter AI", href: "#" },
      { name: "Templates", href: "#" },
    ],
    Company: [
      { name: "About Us", href: "#" },
      { name: "Success Stories", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Blog", href: "#" },
    ],
    Support: [
      { name: "Help Center", href: "#" },
      { name: "Contact Support", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  };

  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-100">
                <Sparkles size={22} />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900">
                CV<span className="text-orange-500">Morph</span>
              </span>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900">Stay updated on the job market</h4>
              <p className="text-slate-500 text-sm max-w-sm">
                Get the latest AI prompts and resume tips delivered to your inbox weekly.
              </p>
              <div className="flex gap-2 max-w-sm">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
                <button className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h5 className="font-bold text-xs uppercase tracking-[0.15em] text-slate-400">
                {title}
              </h5>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-slate-600 hover:text-orange-500 text-sm font-medium transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <Link href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
              <Twitter size={20} />
            </Link>
            <Link href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
              <Linkedin size={20} />
            </Link>
            <Link href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
              <Github size={20} />
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8">
            <p className="text-slate-400 text-sm font-medium">
              © {new Date().getFullYear()} CVMorph AI. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;