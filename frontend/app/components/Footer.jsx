import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ArrowRight,
} from "lucide-react";

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
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-2">
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
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-900">
                Stay updated on the job market
              </h4>
              <p className="text-slate-500 text-sm max-w-sm">
                Get the latest AI prompts and resume tips delivered to your
                inbox weekly.
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

        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-slate-400 hover:text-slate-900 transition-colors"
            >
              <Twitter size={20} />
            </Link>
            <Link
              href="#"
              className="text-slate-400 hover:text-slate-900 transition-colors"
            >
              <Linkedin size={20} />
            </Link>
            <Link
              href="#"
              className="text-slate-400 hover:text-slate-900 transition-colors"
            >
              <Github size={20} />
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8">
            <p className="text-slate-400 text-sm font-medium">
              © {new Date().getFullYear()} CVMorph AI. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
