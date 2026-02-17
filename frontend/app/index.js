import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { isAuthenticated } from '../lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">CVMorph</span>
            </div>
            <div className="flex gap-4">
              <Link href="/login">
                <button className="btn btn-outline">Login</button>
              </Link>
              <Link href="/register">
                <button className="btn btn-primary">Get Started</button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            One Resume. Multiple Roles.<br />
            <span className="text-primary-600">Powered by AI.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your experience into role-specific, ATS-approved resumes automatically. 
            Stop rewriting. Start applying.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <button className="btn btn-primary text-lg px-8 py-3">
                Create Free Resume
              </button>
            </Link>
            <Link href="/login">
              <button className="btn btn-outline text-lg px-8 py-3">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="card text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">One Source of Truth</h3>
            <p className="text-gray-600">
              Enter your experience once. AI adapts it for every role automatically.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Optimization</h3>
            <p className="text-gray-600">
              Free Gemini AI rewrites bullets, emphasizes keywords, reorders sections.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2">ATS-Approved Template</h3>
            <p className="text-gray-600">
              Single-column, parser-friendly format proven to pass ATS screening.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold mb-2">Create Base Resume</h4>
              <p className="text-gray-600 text-sm">Enter your experience, education, projects once</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold mb-2">Select Role</h4>
              <p className="text-gray-600 text-sm">Choose Frontend, Backend, Python, or other roles</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold mb-2">AI Adapts</h4>
              <p className="text-gray-600 text-sm">Content optimized automatically with keywords</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                4
              </div>
              <h4 className="font-bold mb-2">Download PDF</h4>
              <p className="text-gray-600 text-sm">Get ATS-ready resume instantly</p>
            </div>
          </div>
        </div>

        {/* Supported Roles */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Supported Roles</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Frontend Dev', 'Backend Dev', 'Python Dev', 'Full Stack', 'DevOps', 'Data Analyst'].map((role) => (
              <div key={role} className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-primary-500 transition-colors">
                <p className="font-medium text-sm">{role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center card bg-gradient-to-r from-primary-600 to-purple-600 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
          <p className="text-lg mb-6 opacity-90">Join thousands adapting resumes with AI. Completely free.</p>
          <Link href="/register">
            <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Get Started Free →
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-gray-400">© 2024 CVMorph. Built to help developers land jobs.</p>
          <p className="text-gray-500 text-sm mt-2">Powered by Free Gemini AI</p>
        </div>
      </footer>
    </div>
  );
}