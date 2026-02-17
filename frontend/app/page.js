"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated } from '../lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CV</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">CVMorph</span>
            </div>
            <div className="flex gap-3">
              <Link href="/login">
                <button className="btn btn-outline">Login</button>
              </Link>
              <Link href="/register">
                <button className="btn btn-primary">Get Started Free</button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <div className="inline-block mb-4">
            <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
              ✨ Powered by FREE Gemini AI
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            One Resume. Multiple Roles.<br />
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Optimized by AI.
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your single source of truth into role-specific, ATS-approved resumes automatically. 
            <strong className="text-gray-900"> Stop rewriting. Start landing interviews.</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/register">
              <button className="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-shadow">
                🚀 Create Your First Resume
              </button>
            </Link>
            <Link href="/login">
              <button className="btn btn-outline text-lg px-8 py-4">
                Sign In
              </button>
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            ✓ No credit card required  ✓ Free forever  ✓ 1,500 AI requests/day
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">6</div>
            <div className="text-gray-600">Specialized Roles</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
            <div className="text-gray-600">ATS Compatible</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">FREE</div>
            <div className="text-gray-600">Forever & Always</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why CVMorph?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built by developers, for developers who are tired of resume optimization
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-3">One Source of Truth</h3>
              <p className="text-gray-600 leading-relaxed">
                Enter your experience, education, and projects once. AI adapts it for every role automatically—no copy-paste, no duplication.
              </p>
            </div>

            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Optimization</h3>
              <p className="text-gray-600 leading-relaxed">
                Free Gemini AI rewrites bullets with role-specific keywords, emphasizes relevant skills, and reorders sections for maximum impact.
              </p>
            </div>

            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✅</span>
              </div>
              <h3 className="text-xl font-bold mb-3">ATS-Approved Template</h3>
              <p className="text-gray-600 leading-relaxed">
                Single-column, parser-friendly format based on proven resume. No tables, graphics, or formatting that breaks ATS systems.
              </p>
            </div>

            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold mb-3">No Hallucination</h3>
              <p className="text-gray-600 leading-relaxed">
                AI never invents experience or skills. It only rewrites and emphasizes what you actually have—100% factually accurate.
              </p>
            </div>

            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📄</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Instant PDF Export</h3>
              <p className="text-gray-600 leading-relaxed">
                Download professional, ATS-ready PDFs instantly. Perfect formatting every time, ready to submit to any job portal.
              </p>
            </div>

            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔄</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Version Control</h3>
              <p className="text-gray-600 leading-relaxed">
                Keep track of all resume versions. Compare different role adaptations and see exactly what the AI changed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From profile to perfect resume in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-lg">
                1
              </div>
              <h4 className="font-bold text-lg mb-2">Create Base Resume</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Enter your experience, education, projects, and skills once. This is your single source of truth.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-lg">
                2
              </div>
              <h4 className="font-bold text-lg mb-2">Select Target Role</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Choose from Frontend, Backend, Python, Full Stack, DevOps, or Data Analyst roles.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-lg">
                3
              </div>
              <h4 className="font-bold text-lg mb-2">AI Optimizes</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Free Gemini AI adapts your content with role-specific keywords and emphasis in 10-30 seconds.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-lg">
                4
              </div>
              <h4 className="font-bold text-lg mb-2">Download & Apply</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get your ATS-ready PDF instantly. Submit to job portals with confidence.
              </p>
            </div>
          </div>

          {/* Example flow */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h3 className="font-bold text-xl mb-6 text-center">Example: Same Experience, Different Focus</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="text-sm font-semibold text-blue-600 mb-2">FRONTEND DEVELOPER</div>
                <p className="text-gray-700 text-sm">
                  Developed <strong>responsive UI components</strong> using <strong>React</strong> and modern <strong>JavaScript</strong> frameworks with focus on <strong>user experience</strong> and <strong>cross-browser compatibility</strong>.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <div className="text-sm font-semibold text-purple-600 mb-2">BACKEND DEVELOPER</div>
                <p className="text-gray-700 text-sm">
                  Architected <strong>scalable backend services</strong> with <strong>Node.js</strong> and <strong>Express</strong>, implementing <strong>RESTful APIs</strong> and <strong>database optimization</strong> for high-throughput applications.
                </p>
              </div>
            </div>

            <p className="text-center text-gray-500 text-sm mt-4">
              ↑ Same original bullet, adapted automatically by AI for different roles
            </p>
          </div>
        </div>
      </div>

      {/* Supported Roles */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Supported Roles
            </h2>
            <p className="text-xl text-gray-600">
              Optimize your resume for any technical role
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { role: 'Frontend Developer', icon: '🎨', desc: 'React, JavaScript, UI/UX, responsive design' },
              { role: 'Backend Developer', icon: '⚙️', desc: 'Node.js, APIs, databases, architecture' },
              { role: 'Python Developer', icon: '🐍', desc: 'Python, Flask, Django, automation' },
              { role: 'Full Stack Developer', icon: '🚀', desc: 'End-to-end development, MERN/MEAN stack' },
              { role: 'DevOps Engineer', icon: '🔧', desc: 'CI/CD, Docker, Kubernetes, cloud' },
              { role: 'Data Analyst', icon: '📊', desc: 'SQL, visualization, analytics, reporting' },
            ].map((item) => (
              <div key={item.role} className="card hover:border-primary-500 transition-all hover:shadow-md">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{item.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.role}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial / Trust Section */}
      <div className="py-20 bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
              Why Developers Trust CVMorph
            </h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-5xl mb-4">⏱️</div>
                <div className="text-2xl font-bold text-primary-600 mb-2">80% Faster</div>
                <p className="text-gray-600">Resume creation time reduced dramatically</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-5xl mb-4">✨</div>
                <div className="text-2xl font-bold text-primary-600 mb-2">100% Accurate</div>
                <p className="text-gray-600">AI never invents fake experience or skills</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-5xl mb-4">🎯</div>
                <div className="text-2xl font-bold text-primary-600 mb-2">ATS Optimized</div>
                <p className="text-gray-600">Proven template that passes screening systems</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card bg-gradient-to-r from-primary-600 to-purple-600 text-white p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join developers who are adapting their resumes with AI. Completely free, forever. No credit card required.
            </p>
            <Link href="/register">
              <button className="bg-white text-primary-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                Get Started Free →
              </button>
            </Link>
            <p className="text-sm mt-6 opacity-75">
              ✓ Takes 5 minutes  ✓ No credit card  ✓ 1,500 free AI requests daily
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-2">Is it really free?</h3>
              <p className="text-gray-600">
                Yes! CVMorph uses Google free Gemini API tier (1,500 requests/day). No hidden costs, no credit card required.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-2">Will the AI invent fake experience?</h3>
              <p className="text-gray-600">
                Never. The AI only rewrites and emphasizes your real experience. It cannot add skills, jobs, or achievements you didnt provide.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-2">How does it work with ATS systems?</h3>
              <p className="text-gray-600">
                Our template uses a proven single-column format with no tables or graphics. Its optimized for Applicant Tracking Systems to parse correctly.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-2">Can I edit the AI-generated content?</h3>
              <p className="text-gray-600">
                Yes! You always have full control. Review and edit everything before downloading your PDF.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">CV</span>
                </div>
                <span className="text-xl font-bold">CVMorph</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered resume optimization for developers. Built with ❤️ to help you land your dream job.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/register" className="hover:text-white">Get Started</Link></li>
                <li><Link href="/login" className="hover:text-white">Sign In</Link></li>
                <li><span className="cursor-not-allowed">Pricing (Free Forever)</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Technology</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Next.js 14</li>
                <li>Node.js + Express</li>
                <li>PostgreSQL</li>
                <li>Google Gemini AI (Free)</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 CVMorph. Built to help developers land jobs.</p>
            <p className="mt-2">Powered by Free Google Gemini AI • Open Source Project</p>
          </div>
        </div>
      </footer>
    </div>
  );
}