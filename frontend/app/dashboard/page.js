"use client"

// app/dashboard/page.js - Dashboard for App Router
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // App Router import
import Link from 'next/link';
import { resumeAPI, aiAPI } from '../../lib/api';
import { getUser, logout, isAuthenticated } from '../../lib/auth';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ hasBaseResume: false, totalVersions: 0 });
  const [versions, setVersions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdaptModal, setShowAdaptModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [adapting, setAdapting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userData = getUser();
    setUser(userData);
    loadDashboard();
  }, [router]);

  const loadDashboard = async () => {
    try {
      const [statsRes, versionsRes, rolesRes] = await Promise.all([
        resumeAPI.getStats(),
        resumeAPI.getVersions(),
        aiAPI.getRoles(),
      ]);

      setStats(statsRes.data.stats);
      setVersions(versionsRes.data.versions);
      setRoles(rolesRes.data.roles);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdaptResume = async () => {
    if (!selectedRole) {
      alert('Please select a role');
      return;
    }

    setAdapting(true);
    try {
      await aiAPI.adaptResume({
        role: selectedRole,
        jobDescription: jobDescription || null,
      });

      alert('Resume adapted successfully!');
      setShowAdaptModal(false);
      setSelectedRole('');
      setJobDescription('');
      loadDashboard();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to adapt resume');
    } finally {
      setAdapting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this resume version?')) {
      return;
    }

    try {
      await resumeAPI.deleteVersion(id);
      loadDashboard();
    } catch (error) {
      alert('Failed to delete resume');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard">
                <span className="text-2xl font-bold text-primary-600 cursor-pointer">CVMorph</span>
              </Link>
              <div className="hidden md:flex gap-4">
                <Link href="/dashboard" className="text-gray-700 hover:text-primary-600">
                  Dashboard
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">👋 {user?.name}</span>
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="text-3xl font-bold text-primary-600">{stats.hasBaseResume ? '1' : '0'}</div>
            <div className="text-gray-600">Base Resume</div>
          </div>
          <div className="card">
            <div className="text-3xl font-bold text-primary-600">{stats.totalVersions}</div>
            <div className="text-gray-600">Resume Versions</div>
          </div>
          <div className="card">
            <div className="text-3xl font-bold text-primary-600">{roles.length}</div>
            <div className="text-gray-600">Available Roles</div>
          </div>
        </div>

        {/* Actions */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            {!stats.hasBaseResume ? (
              <Link href="/resume/new">
                <button className="btn btn-primary">
                  📝 Create Base Resume
                </button>
              </Link>
            ) : (
              <>
                <Link href="/resume/new">
                  <button className="btn btn-outline">
                    ✏️ Edit Base Resume
                  </button>
                </Link>
                <button
                  onClick={() => setShowAdaptModal(true)}
                  className="btn btn-primary"
                >
                  🤖 Generate Role-Specific Resume
                </button>
              </>
            )}
          </div>
        </div>

        {/* Resume Versions */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Your Resume Versions</h2>
          
          {versions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📄</div>
              <p>No resume versions yet</p>
              <p className="text-sm mt-2">
                {!stats.hasBaseResume 
                  ? 'Create your base resume first' 
                  : 'Generate a role-specific resume to get started'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {versions.map((version) => (
                <div key={version.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{version.role}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(version.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-2xl">
                      {version.role.includes('Frontend') ? '🎨' : 
                       version.role.includes('Backend') ? '⚙️' :
                       version.role.includes('Python') ? '🐍' :
                       version.role.includes('Full Stack') ? '🚀' :
                       version.role.includes('DevOps') ? '🔧' : '📊'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Link href={`/resume/preview/${version.id}`} className="flex-1">
                      <button className="btn btn-outline w-full text-sm">
                        View
                      </button>
                    </Link>
                    <button
                      onClick={() => resumeAPI.downloadPDF(version.id)}
                      className="btn btn-primary text-sm"
                    >
                      📥 PDF
                    </button>
                    <button
                      onClick={() => handleDelete(version.id)}
                      className="btn btn-secondary text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Adapt Resume Modal */}
      {showAdaptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Generate Role-Specific Resume</h2>
            
            <div className="space-y-4">
              <div>
                <label className="label">Select Target Role *</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">-- Choose a role --</option>
                  {roles.map((role) => (
                    <option key={role.name} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
                {selectedRole && (
                  <p className="text-sm text-gray-600 mt-1">
                    {roles.find(r => r.name === selectedRole)?.description}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Job Description (Optional)</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="input"
                  rows={6}
                  placeholder="Paste the job description here for better optimization..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  AI will use this to better match your resume to the job
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAdaptResume}
                  disabled={adapting || !selectedRole}
                  className="btn btn-primary flex-1"
                >
                  {adapting ? '🤖 Adapting...' : '✨ Generate Resume'}
                </button>
                <button
                  onClick={() => {
                    setShowAdaptModal(false);
                    setSelectedRole('');
                    setJobDescription('');
                  }}
                  disabled={adapting}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>

              {adapting && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                  <p className="font-medium">AI is analyzing your resume...</p>
                  <p className="text-sm mt-1">This may take 10-30 seconds</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}