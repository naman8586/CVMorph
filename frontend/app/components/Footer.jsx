import React from "react";
import Link from "next/link";
import {
  Github,
  Twitter,
  Linkedin,
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
          {/* Brand + Newsletter */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="#" className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-orange-600 via-orange-400 to-amber-300 rounded-xl blur-md opacity-20 group-hover:opacity-60 transition-all" />
                <div className="relative w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center">
                  <span className="text-orange-400 font-black text-xs">CV</span>
                </div>
              </div>

              <div>
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Morph
                </span>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Neural Architect
                </p>
              </div>
            </Link>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-900">
                Stay updated on the job market
              </h4>
              <p className="text-slate-500 text-sm max-w-sm">
                Get the latest AI prompts and resume tips delivered to your inbox.
              </p>

              <div className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                />
                <Link
                  href="#"
                  className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition"
                >
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {title}
              </h5>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href="#"
                      className="text-slate-600 hover:text-orange-500 text-sm font-medium transition"
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
          <div className="flex gap-6">
            <Link href="#" className="text-slate-400 hover:text-slate-900">
              <Twitter size={20} />
            </Link>
            <Link href="#" className="text-slate-400 hover:text-slate-900">
              <Linkedin size={20} />
            </Link>
            <Link href="#" className="text-slate-400 hover:text-slate-900">
              <Github size={20} />
            </Link>
          </div>

          <p className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} CVMorph AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;