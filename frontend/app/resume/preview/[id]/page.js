'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, LogOut, Sparkles, Calendar, Target } from 'lucide-react';
import { resumeAPI } from '@/lib/api';
import { isAuthenticated, logout } from '@/lib/auth';

export default function PreviewResume() {
  const router = useRouter();
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    if (id) fetchResume(id);
  }, [id]);

  const fetchResume = async (resumeId) => {
    try {
      const response = await resumeAPI.getVersion(resumeId);
      setResume(response.data.version);
    } catch {
      alert('Failed to load resume');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl mb-4 animate-bounce">
        <Sparkles className="text-orange-400 w-6 h-6" />
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rendering Resume...</p>
    </div>
  );

  if (!resume) return <div className="text-center mt-10 text-slate-500">Resume not found</div>;

  const c = resume.adapted_content;
  const skills = c.skills || {};
  const displayUrl = (url = '') => url.replace(/^https?:\/\//, '');
  const toArr = (v) => Array.isArray(v) ? v : v ? [v] : [];

  return (
    <div className="min-h-screen bg-[#F0F0EE] text-slate-900 pb-20">

      {/* ── Sticky Nav ───────────────────────────────────────────────── */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors">
              <ArrowLeft size={16} />
              <span className="text-[11px] font-bold uppercase tracking-widest">Dashboard</span>
            </Link>
            <div className="h-5 w-px bg-slate-200" />
            <div>
              <p className="text-sm font-bold text-slate-900 leading-none">{resume.role}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Morphed Version</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => resumeAPI.downloadPDF(id)}
              className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md">
              <Download size={13} className="text-orange-400" /> Download PDF
            </button>
            <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-[1fr_280px] gap-8 items-start">

        {/* ── Resume Sheet — matches PDF output exactly ─────────────── */}
        <div className="bg-white shadow-xl rounded-sm ring-1 ring-slate-200/80"
          style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}>
          <div style={{ padding: '1cm 1.2cm', minHeight: '27.9cm' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '8pt' }}>
              <h1 style={{ fontSize: '24pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5pt', lineHeight: 1, marginBottom: '4pt' }}>
                {c.personal_info?.name || ''}
              </h1>
              <div style={{ fontSize: '10pt', lineHeight: 1.4 }}>
                {[
                  c.personal_info?.phone,
                  c.personal_info?.email,
                  c.personal_info?.linkedin ? displayUrl(c.personal_info.linkedin) : null,
                  c.personal_info?.github   ? displayUrl(c.personal_info.github)   : null,
                ].filter(Boolean).join(' | ')}
              </div>
            </div>

            {/* Summary */}
            {c.personal_info?.summary && (
              <>
                <SectionHeading>Summary</SectionHeading>
                <p style={{ fontSize: '10pt', lineHeight: 1.3, textAlign: 'justify', marginBottom: '4pt' }}>
                  {c.personal_info.summary}
                </p>
              </>
            )}

            {/* Skills */}
            {(skills.languages?.length || skills.frontend?.length || skills.backend?.length || skills.databases?.length || skills.tools?.length) ? (
              <>
                <SectionHeading>Skills</SectionHeading>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '4pt', fontSize: '10pt' }}>
                  <tbody>
                    {[
                      { label: 'Programming Languages:',  key: 'languages' },
                      { label: 'Frameworks & Libraries:', key: 'frontend'  },
                      { label: 'Backend & APIs:',         key: 'backend'   },
                      { label: 'Databases:',              key: 'databases' },
                      { label: 'DevOps & Tools:',         key: 'tools'     },
                    ].filter(r => skills[r.key]?.length).map(r => (
                      <tr key={r.key}>
                        <td style={{ fontWeight: 'bold', whiteSpace: 'nowrap', paddingRight: '6pt', verticalAlign: 'top', lineHeight: 1.4 }}>{r.label}</td>
                        <td style={{ lineHeight: 1.4 }}>{toArr(skills[r.key]).join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : null}

            {/* Experience */}
            {c.experience?.length ? (
              <>
                <SectionHeading>Professional Experience</SectionHeading>
                {c.experience.map((exp, i) => (
                  <div key={i} style={{ marginBottom: '6pt' }}>
                    <TitleRow left={exp.title} right={exp.duration} />
                    <div style={{ fontStyle: 'italic', fontSize: '10pt', marginBottom: '2pt' }}>
                      {exp.company}{exp.location ? `, ${exp.location}` : ''}
                    </div>
                    <BulletList items={exp.bullets} />
                  </div>
                ))}
              </>
            ) : null}

            {/* Projects */}
            {c.projects?.length ? (
              <>
                <SectionHeading>Projects</SectionHeading>
                {c.projects.map((proj, i) => (
                  <div key={i} style={{ marginBottom: '6pt' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2pt' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '10pt' }}>
                        {proj.name}{proj.technologies ? ` | ${proj.technologies}` : ''}
                      </span>
                      {proj.link && (
                        <span style={{ fontSize: '9pt', whiteSpace: 'nowrap', paddingLeft: '8pt' }}>
                          {displayUrl(proj.link)}
                        </span>
                      )}
                    </div>
                    <BulletList items={proj.bullets} />
                  </div>
                ))}
              </>
            ) : null}

            {/* Education */}
            {c.education?.length ? (
              <>
                <SectionHeading>Education</SectionHeading>
                {c.education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: '4pt' }}>
                    <TitleRow
                      left={`${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}`}
                      right={edu.duration}
                    />
                    <div style={{ fontStyle: 'italic', fontSize: '10pt' }}>
                      {edu.institution}{edu.gpa ? `, CGPA: ${edu.gpa}` : ''}
                    </div>
                  </div>
                ))}
              </>
            ) : null}

          </div>
        </div>

        {/* ── Sidebar ────────────────────────────────────────────────── */}
        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5 text-orange-500">
              <Target size={18} />
              <h3 className="font-bold tracking-tight text-slate-900">Morph Specs</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Role</p>
                <p className="text-sm font-bold text-slate-900">{resume.role}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Adaptation Date</p>
                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                  <Calendar size={13} />
                  {new Date(resume.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <div className="bg-orange-50 rounded-2xl p-4">
                  <p className="text-[11px] leading-relaxed text-orange-700 font-medium italic">
                    This version was dynamically optimized for ATS keyword density and role-specific impact.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[28px] p-7 text-white relative overflow-hidden group">
            <Sparkles className="absolute -right-4 -top-4 w-20 h-20 text-white/5 group-hover:rotate-12 transition-transform duration-500" />
            <h4 className="font-bold text-base mb-2 relative z-10">Need a change?</h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-5 relative z-10">
              Re-morph your base profile for a different role or update your core data.
            </p>
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-orange-400 hover:text-orange-300 transition-colors relative z-10">
              Back to Dashboard <ArrowLeft size={11} className="rotate-180" />
            </Link>
          </div>
        </aside>

      </main>
    </div>
  );
}

// ── Inline sub-components (inline styles to match PDF exactly) ───────────────

function SectionHeading({ children }) {
  return (
    <h2 style={{
      fontSize: '11pt',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.4pt',
      borderBottom: '0.8pt solid #000',
      marginTop: '7pt',
      marginBottom: '4pt',
      paddingBottom: '1pt',
    }}>
      {children}
    </h2>
  );
}

function TitleRow({ left, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontWeight: 'bold', fontSize: '10pt' }}>{left}</span>
      <span style={{ fontWeight: 'bold', fontSize: '10pt', whiteSpace: 'nowrap', paddingLeft: '8pt' }}>{right}</span>
    </div>
  );
}

function BulletList({ items = [] }) {
  if (!items?.length) return null;
  return (
    <ul style={{ marginLeft: '12pt', marginTop: '2pt', marginBottom: 0, paddingLeft: 0, listStyleType: 'disc' }}>
      {items.filter(Boolean).map((b, i) => (
        <li key={i} style={{ fontSize: '10pt', lineHeight: 1.3, marginBottom: '2pt' }}>{b}</li>
      ))}
    </ul>
  );
}