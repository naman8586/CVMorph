'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, User, Briefcase, Cpu, Plus, Trash2, 
  ArrowLeft, Save, FolderGit2, GraduationCap, Calendar
} from 'lucide-react';
import { resumeAPI } from '@/lib/api';
import { isAuthenticated, logout } from '@/lib/auth';

// ─── Constants ────────────────────────────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const YEARS  = Array.from({ length: 15 }, (_, i) => 2015 + i);
const labelCls = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1";
const inputCls  = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all placeholder:text-slate-300";

// ─── Helper ───────────────────────────────────────────────────────────────────
function buildDuration(fromMonth, fromYear, toMonth, toYear, isPresent) {
  const from = [fromMonth, fromYear].filter(Boolean).join(' ');
  const to   = isPresent ? 'Present' : [toMonth, toYear].filter(Boolean).join(' ');
  if (!from && !to) return '';
  return `${from} – ${to}`;
}

// ─── Date Range Picker ────────────────────────────────────────────────────────
function DateRangePicker({ fromMonth, fromYear, toMonth, toYear, isPresent, onChange }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {/* From */}
        <div>
          <label className={labelCls}>From</label>
          <div className="flex gap-2">
            <select value={fromMonth} onChange={e => onChange('fromMonth', e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:border-orange-500 outline-none transition-all">
              <option value="">Month</option>
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={fromYear} onChange={e => onChange('fromYear', e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:border-orange-500 outline-none transition-all">
              <option value="">Year</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        {/* To */}
        <div>
          <label className={labelCls}>To</label>
          {isPresent ? (
            <div className="flex items-center h-[38px] px-4 bg-orange-50 border border-orange-200 rounded-xl">
              <span className="text-xs font-bold text-orange-600 tracking-wide">Present</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <select value={toMonth} onChange={e => onChange('toMonth', e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:border-orange-500 outline-none transition-all">
                <option value="">Month</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={toYear} onChange={e => onChange('toYear', e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:border-orange-500 outline-none transition-all">
                <option value="">Year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>
      {/* Present toggle */}
      <button type="button" onClick={() => onChange('isPresent', !isPresent)}
        className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${isPresent ? 'text-orange-600' : 'text-slate-400 hover:text-slate-700'}`}>
        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${isPresent ? 'bg-orange-500 border-orange-500' : 'border-slate-300'}`}>
          {isPresent && <div className="w-2 h-2 bg-white rounded-sm" />}
        </div>
        I am currently here / ongoing
      </button>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────
function Section({ icon, iconBg, title, sub, action, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-8 md:p-10 shadow-sm">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${iconBg}`}>{icon}</div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{title}</h2>
            <p className="text-xs text-slate-400 font-medium">{sub}</p>
          </div>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function AddButton({ onClick, label }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-2 text-[10px] font-bold bg-slate-900 text-white px-5 py-2.5 rounded-xl uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md shadow-slate-200 whitespace-nowrap">
      <Plus size={14} /> {label}
    </button>
  );
}

function RemoveBtn({ onClick }) {
  return (
    <button type="button" onClick={onClick} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors">
      <Trash2 size={18} />
    </button>
  );
}

function LabeledInput({ label, value, onChange, placeholder, bold }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)}
        className={`${inputCls} ${bold ? 'font-semibold' : ''}`} placeholder={placeholder} />
    </div>
  );
}

function BulletList({ bullets, onUpdate, onAdd, onRemove, placeholder }) {
  return (
    <div className="space-y-3">
      <label className={labelCls}>Key Points</label>
      {bullets.map((b, j) => (
        <div key={j} className="flex gap-2">
          <input value={b} onChange={e => onUpdate(j, e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
            placeholder={placeholder} />
          <button type="button" onClick={() => onRemove(j)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button type="button" onClick={onAdd}
        className="flex items-center gap-1.5 text-[10px] font-bold text-orange-600 uppercase tracking-wider mt-1 hover:underline">
        <Plus size={12} /> Add Point
      </button>
    </div>
  );
}

function EmptyState({ show, label }) {
  if (!show) return null;
  return (
    <div className="text-center py-12 text-slate-300 text-sm font-medium border-2 border-dashed border-slate-100 rounded-[24px]">
      {label}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ResumeBuilder() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  const [formData, setFormData] = useState({
    personal_info: { name: '', title: '', email: '', phone: '', linkedin: '', github: '', portfolio: '' },
    education:  [],
    experience: [],
    projects:   [],
    skills: { languages: '', frontend: '', backend: '', databases: '', tools: '' }
  });

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    loadExistingResume();
  }, [router]);

  const loadExistingResume = async () => {
    try {
      const { data } = await resumeAPI.getBase();
      if (data.resume) {
        const r = data.resume;
        const toStr = v => Array.isArray(v) ? v.join(', ') : v || '';
        setFormData({
          ...r,
          skills: {
            languages: toStr(r.skills?.languages),
            frontend:  toStr(r.skills?.frontend),
            backend:   toStr(r.skills?.backend),
            databases: toStr(r.skills?.databases),
            tools:     toStr(r.skills?.tools),
          }
        });
      }
    } catch { /* no resume yet */ }
    finally { setLoading(false); }
  };

  // ── Field updaters ────────────────────────────────────────────────────────
  const handlePersonal = (f, v) => setFormData(p => ({ ...p, personal_info: { ...p.personal_info, [f]: v } }));
  const handleSkill    = (f, v) => setFormData(p => ({ ...p, skills: { ...p.skills, [f]: v } }));

  const updateArr = (key, i, field, value) => {
    const u = [...formData[key]]; u[i][field] = value;
    setFormData({ ...formData, [key]: u });
  };
  const updateBullet = (key, i, j, v) => {
    const u = [...formData[key]]; u[i].bullets[j] = v;
    setFormData({ ...formData, [key]: u });
  };
  const removeBullet = (key, i, j) => {
    const u = [...formData[key]]; u[i].bullets = u[i].bullets.filter((_, idx) => idx !== j);
    setFormData({ ...formData, [key]: u });
  };
  const addBullet = (key, i) => {
    const u = [...formData[key]]; u[i].bullets.push('');
    setFormData({ ...formData, [key]: u });
  };
  const removeItem = (key, i) =>
    setFormData({ ...formData, [key]: formData[key].filter((_, idx) => idx !== i) });

  // ── Add new entries ───────────────────────────────────────────────────────
  const addExperience = () => setFormData(p => ({
    ...p, experience: [...p.experience, { title:'', company:'', location:'', fromMonth:'', fromYear:'', toMonth:'', toYear:'', isPresent:false, bullets:[''] }]
  }));
  const addProject = () => setFormData(p => ({
    ...p, projects: [...p.projects, { name:'', technologies:'', link:'', fromMonth:'', fromYear:'', toMonth:'', toYear:'', isPresent:false, bullets:[''] }]
  }));
  const addEducation = () => setFormData(p => ({
    ...p, education: [...p.education, { degree:'', field:'', institution:'', gpa:'', fromMonth:'', fromYear:'', toMonth:'', toYear:'', isPresent:false }]
  }));

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const toArr      = s => s.split(',').map(x => x.trim()).filter(Boolean);
      const withDur    = arr => arr.map(item => ({
        ...item,
        duration: buildDuration(item.fromMonth, item.fromYear, item.toMonth, item.toYear, item.isPresent)
      }));
      await resumeAPI.createOrUpdateBase({
        ...formData,
        experience: withDur(formData.experience),
        projects:   withDur(formData.projects),
        education:  withDur(formData.education),
        skills: {
          languages: toArr(formData.skills.languages),
          frontend:  toArr(formData.skills.frontend),
          backend:   toArr(formData.skills.backend),
          databases: toArr(formData.skills.databases),
          tools:     toArr(formData.skills.tools),
        }
      });
      router.push('/dashboard');
    } catch { alert('Sync Failed'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Sparkles className="text-orange-500 w-8 h-8 animate-spin" />
        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Syncing Neural Data...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 pb-32">

      {/* ── Nav ───────────────────────────────────────────────────────────── */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-orange-600 via-orange-400 to-amber-300 rounded-xl blur-md opacity-20 group-hover:opacity-60 group-hover:blur-lg transition-all duration-500 animate-pulse" />
              <div className="relative w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center shadow-2xl group-hover:rotate-[-4deg] group-hover:scale-110 transition-all duration-300 border border-white/10">
                <span className="text-orange-400 font-black text-[12px] tracking-tighter">CV</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="relative">
                <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none">Morph</span>
                <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-orange-500 group-hover:w-full transition-all duration-300 ease-out rounded-full" />
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 group-hover:text-slate-600 transition-colors">Neural Architect</span>
            </div>
          </Link>
          <button onClick={logout} className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Base Profile</h1>
            <p className="text-slate-500 text-sm mt-1">Your primary source data — the AI morphs new versions from this.</p>
          </div>
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-900 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
            <ArrowLeft size={14} /> Return to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── 01: PERSONAL INFO ─────────────────────────────────────────── */}
          <Section icon={<User size={20} />} iconBg="bg-orange-50 text-orange-600" title="Identity Details" sub="How recruiters and AI will identify you">
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-6">
              {[
                { label: 'Full Name',          field: 'name',      placeholder: 'Alex Morph' },
                { label: 'Phone Number',        field: 'phone',     placeholder: '+91-9876543210' },
                { label: 'Professional Email',  field: 'email',     placeholder: 'alex@example.com' },
                { label: 'Current Title',       field: 'title',     placeholder: 'Full Stack Developer' },
                { label: 'LinkedIn URL',        field: 'linkedin',  placeholder: 'linkedin.com/in/username' },
                { label: 'GitHub URL',          field: 'github',    placeholder: 'github.com/username' },
                { label: 'Portfolio URL',       field: 'portfolio', placeholder: 'alexmorph.dev' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className={labelCls}>{label}</label>
                  <input type="text" value={formData.personal_info[field] || ''}
                    onChange={e => handlePersonal(field, e.target.value)}
                    className={inputCls} placeholder={placeholder} />
                </div>
              ))}
            </div>
          </Section>

          {/* ── 02: EXPERIENCE ────────────────────────────────────────────── */}
          <Section icon={<Briefcase size={20} />} iconBg="bg-blue-50 text-blue-600"
            title="Professional Experience" sub="Detailed work history for AI context"
            action={<AddButton onClick={addExperience} label="Add Role" />}>
            <div className="space-y-6">
              {formData.experience.map((exp, i) => (
                <div key={i} className="p-6 border border-slate-100 bg-slate-50/50 rounded-[24px] space-y-5 relative">
                  <RemoveBtn onClick={() => removeItem('experience', i)} />

                  <div className="grid md:grid-cols-2 gap-4 pr-10">
                    <LabeledInput label="Job Title"    value={exp.title}    onChange={v => updateArr('experience',i,'title',v)}    placeholder="Full Stack Developer Intern" bold />
                    <LabeledInput label="Company Name" value={exp.company}  onChange={v => updateArr('experience',i,'company',v)}  placeholder="Brancosoft" />
                  </div>

                  <LabeledInput label="Location" value={exp.location} onChange={v => updateArr('experience',i,'location',v)} placeholder="Noida, UP" />

                  <div>
                    <label className={`${labelCls} flex items-center gap-1.5`}><Calendar size={11} />Duration</label>
                    <DateRangePicker
                      fromMonth={exp.fromMonth} fromYear={exp.fromYear}
                      toMonth={exp.toMonth}     toYear={exp.toYear}
                      isPresent={exp.isPresent}
                      onChange={(f, v) => updateArr('experience', i, f, v)}
                    />
                  </div>

                  <BulletList
                    bullets={exp.bullets}
                    onUpdate={(j, v) => updateBullet('experience', i, j, v)}
                    onAdd={() => addBullet('experience', i)}
                    onRemove={j => removeBullet('experience', i, j)}
                    placeholder="Optimized 10+ RESTful APIs, reducing backend latency by 30%"
                  />
                </div>
              ))}
              <EmptyState show={formData.experience.length === 0} label='No roles added yet — click "Add Role" to get started' />
            </div>
          </Section>

          {/* ── 03: PROJECTS ──────────────────────────────────────────────── */}
          <Section icon={<FolderGit2 size={20} />} iconBg="bg-emerald-50 text-emerald-600"
            title="Projects" sub="Showcase your builds — include links and tech stack"
            action={<AddButton onClick={addProject} label="Add Project" />}>
            <div className="space-y-6">
              {formData.projects.map((proj, i) => (
                <div key={i} className="p-6 border border-slate-100 bg-slate-50/50 rounded-[24px] space-y-5 relative">
                  <RemoveBtn onClick={() => removeItem('projects', i)} />

                  <div className="grid md:grid-cols-2 gap-4 pr-10">
                    <LabeledInput label="Project Name"       value={proj.name}         onChange={v => updateArr('projects',i,'name',v)}         placeholder="GitIntel" bold />
                    <LabeledInput label="Tech Stack Used"    value={proj.technologies} onChange={v => updateArr('projects',i,'technologies',v)} placeholder="Next.js, PostgreSQL, Redis" />
                  </div>

                  <LabeledInput label="GitHub / Live Link" value={proj.link} onChange={v => updateArr('projects',i,'link',v)} placeholder="github.com/username/project-name" />

                  <div>
                    <label className={`${labelCls} flex items-center gap-1.5`}><Calendar size={11} />Duration</label>
                    <DateRangePicker
                      fromMonth={proj.fromMonth} fromYear={proj.fromYear}
                      toMonth={proj.toMonth}     toYear={proj.toYear}
                      isPresent={proj.isPresent}
                      onChange={(f, v) => updateArr('projects', i, f, v)}
                    />
                  </div>

                  <BulletList
                    bullets={proj.bullets}
                    onUpdate={(j, v) => updateBullet('projects', i, j, v)}
                    onAdd={() => addBullet('projects', i)}
                    onRemove={j => removeBullet('projects', i, j)}
                    placeholder="Built a real-time analytics system using GitHub Webhooks and BullMQ"
                  />
                </div>
              ))}
              <EmptyState show={formData.projects.length === 0} label='No projects added yet — click "Add Project" to get started' />
            </div>
          </Section>

          {/* ── 04: SKILLS ────────────────────────────────────────────────── */}
          <Section icon={<Cpu size={20} />} iconBg="bg-purple-50 text-purple-600"
            title="Skills" sub="Comma-separated — mapped directly to resume sections">
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-6">
              {[
                { label: 'Programming Languages',  field: 'languages', placeholder: 'JavaScript, TypeScript, Python, SQL, HTML5, CSS3',              span: true },
                { label: 'Frameworks & Libraries', field: 'frontend',  placeholder: 'React.js, Next.js, Node.js, Express.js, Tailwind CSS, Prisma ORM' },
                { label: 'Backend & APIs',         field: 'backend',   placeholder: 'REST API Development, JWT Authentication, Redis, BullMQ, Webhooks' },
                { label: 'Databases',              field: 'databases', placeholder: 'PostgreSQL, MongoDB, MySQL, Relational Database Design' },
                { label: 'DevOps & Tools',         field: 'tools',     placeholder: 'Git, Docker, CI/CD, GitHub Actions, Linux, Puppeteer, Selenium' },
              ].map(({ label, field, placeholder, span }) => (
                <div key={field} className={span ? 'md:col-span-2' : ''}>
                  <label className={labelCls}>{label}</label>
                  <textarea
                    value={formData.skills[field]}
                    onChange={e => handleSkill(field, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:bg-white focus:border-orange-500 outline-none transition-all placeholder:text-slate-300 min-h-[72px] resize-none"
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </Section>

          {/* ── 05: EDUCATION ─────────────────────────────────────────────── */}
          <Section icon={<GraduationCap size={20} />} iconBg="bg-sky-50 text-sky-600"
            title="Education" sub="Degrees, institutions, and graduation dates"
            action={<AddButton onClick={addEducation} label="Add Education" />}>
            <div className="space-y-6">
              {formData.education.map((edu, i) => (
                <div key={i} className="p-6 border border-slate-100 bg-slate-50/50 rounded-[24px] space-y-5 relative">
                  <RemoveBtn onClick={() => removeItem('education', i)} />

                  <div className="grid md:grid-cols-2 gap-4 pr-10">
                    <LabeledInput label="Degree"        value={edu.degree}      onChange={v => updateArr('education',i,'degree',v)}      placeholder="Bachelor of Technology" bold />
                    <LabeledInput label="Field / Major" value={edu.field}       onChange={v => updateArr('education',i,'field',v)}       placeholder="Information Technology" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <LabeledInput label="Institution"   value={edu.institution} onChange={v => updateArr('education',i,'institution',v)} placeholder="Dr. Akhilesh Das Gupta Institute..." />
                    <LabeledInput label="CGPA / Grade"  value={edu.gpa}         onChange={v => updateArr('education',i,'gpa',v)}         placeholder="8.0 / 10.0" />
                  </div>

                  <div>
                    <label className={`${labelCls} flex items-center gap-1.5`}><Calendar size={11} />Duration</label>
                    <DateRangePicker
                      fromMonth={edu.fromMonth} fromYear={edu.fromYear}
                      toMonth={edu.toMonth}     toYear={edu.toYear}
                      isPresent={edu.isPresent}
                      onChange={(f, v) => updateArr('education', i, f, v)}
                    />
                  </div>
                </div>
              ))}
              <EmptyState show={formData.education.length === 0} label='No education added yet — click "Add Education" to get started' />
            </div>
          </Section>

          {/* ── Floating Footer ────────────────────────────────────────────── */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-[100]">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-3 rounded-[28px] shadow-2xl flex items-center gap-3">
              <Link href="/dashboard"
                className="px-6 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest text-slate-400 hover:text-white transition-colors">
                Cancel
              </Link>
              <button type="submit" disabled={saving}
                className="flex-1 bg-orange-500 text-white py-4 rounded-2xl font-bold uppercase text-[11px] tracking-[0.15em] hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
                {saving
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  : <><Save size={16} /> Synchronize Profile</>
                }
              </button>
            </div>
          </div>

        </form>
      </main>
    </div>
  );
}