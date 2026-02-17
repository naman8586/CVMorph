'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Changed from 'next/router'
import Link from 'next/link';
import { resumeAPI } from '../../../lib/api';
import { isAuthenticated, logout } from '../../../lib/auth';

export default function ResumeBuilder() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    personal_info: {
      name: '',
      title: '',
      email: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    education: [],
    experience: [],
    projects: [],
    skills: {
      primary: '',
      secondary: '',
      tools: ''
    }
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadExistingResume();
  }, [router]);

  const loadExistingResume = async () => {
    try {
      const response = await resumeAPI.getBase();
      if (response.data.resume) {
        const resume = response.data.resume;
        setFormData({
          ...resume,
          skills: {
            primary: Array.isArray(resume.skills.primary) ? resume.skills.primary.join(', ') : resume.skills.primary || '',
            secondary: Array.isArray(resume.skills.secondary) ? resume.skills.secondary.join(', ') : resume.skills.secondary || '',
            tools: Array.isArray(resume.skills.tools) ? resume.skills.tools.join(', ') : resume.skills.tools || ''
          }
        });
      }
    } catch (error) {
      console.log('No base resume yet');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalChange = (field, value) => {
    setFormData({
      ...formData,
      personal_info: {
        ...formData.personal_info,
        [field]: value
      }
    });
  };

  const handleSkillsChange = (field, value) => {
    setFormData({
      ...formData,
      skills: {
        ...formData.skills,
        [field]: value
      }
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { institution: '', degree: '', field: '', duration: '', gpa: '' }
      ]
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...formData.education];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, education: updated });
  };

  const removeEducation = (index) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index)
    });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        { title: '', company: '', location: '', duration: '', bullets: [''] }
      ]
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...formData.experience];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, experience: updated });
  };

  const updateExperienceBullet = (expIndex, bulletIndex, value) => {
    const updated = [...formData.experience];
    updated[expIndex].bullets[bulletIndex] = value;
    setFormData({ ...formData, experience: updated });
  };

  const addExperienceBullet = (expIndex) => {
    const updated = [...formData.experience];
    updated[expIndex].bullets.push('');
    setFormData({ ...formData, experience: updated });
  };

  const removeExperienceBullet = (expIndex, bulletIndex) => {
    const updated = [...formData.experience];
    updated[expIndex].bullets = updated[expIndex].bullets.filter((_, i) => i !== bulletIndex);
    setFormData({ ...formData, experience: updated });
  };

  const removeExperience = (index) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index)
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        { name: '', technologies: '', link: '', bullets: [''] }
      ]
    });
  };

  const updateProject = (index, field, value) => {
    const updated = [...formData.projects];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, projects: updated });
  };

  const updateProjectBullet = (projIndex, bulletIndex, value) => {
    const updated = [...formData.projects];
    updated[projIndex].bullets[bulletIndex] = value;
    setFormData({ ...formData, projects: updated });
  };

  const addProjectBullet = (projIndex) => {
    const updated = [...formData.projects];
    updated[projIndex].bullets.push('');
    setFormData({ ...formData, projects: updated });
  };

  const removeProjectBullet = (projIndex, bulletIndex) => {
    const updated = [...formData.projects];
    updated[projIndex].bullets = updated[projIndex].bullets.filter((_, i) => i !== bulletIndex);
    setFormData({ ...formData, projects: updated });
  };

  const removeProject = (index) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSave = {
        ...formData,
        skills: {
          primary: formData.skills.primary.split(',').map(s => s.trim()).filter(Boolean),
          secondary: formData.skills.secondary.split(',').map(s => s.trim()).filter(Boolean),
          tools: formData.skills.tools.split(',').map(s => s.trim()).filter(Boolean)
        }
      };

      await resumeAPI.createOrUpdateBase(dataToSave);
      alert('Resume saved successfully!');
      router.push('/dashboard');
    } catch (error) {
      alert('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard">
              <span className="text-2xl font-bold text-primary-600 cursor-pointer">CVMorph</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button className="btn btn-secondary">← Dashboard</button>
              </Link>
              <button onClick={logout} className="btn btn-outline">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card">
          <h1 className="text-3xl font-bold mb-2">Build Your Base Resume</h1>
          <p className="text-gray-600 mb-8">Enter once. AI adapts for each role.</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Info */}
            <section>
              <h2 className="text-2xl font-bold mb-4 pb-2 border-b">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input type="text" value={formData.personal_info.name}
                    onChange={(e) => handlePersonalChange('name', e.target.value)}
                    className="input" required />
                </div>
                <div>
                  <label className="label">Title *</label>
                  <input type="text" value={formData.personal_info.title}
                    onChange={(e) => handlePersonalChange('title', e.target.value)}
                    className="input" placeholder="Full Stack Developer" required />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input type="email" value={formData.personal_info.email}
                    onChange={(e) => handlePersonalChange('email', e.target.value)}
                    className="input" required />
                </div>
                <div>
                  <label className="label">LinkedIn</label>
                  <input type="url" value={formData.personal_info.linkedin}
                    onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                    className="input" placeholder="https://linkedin.com/in/yourprofile" />
                </div>
                <div>
                  <label className="label">GitHub</label>
                  <input type="url" value={formData.personal_info.github}
                    onChange={(e) => handlePersonalChange('github', e.target.value)}
                    className="input" placeholder="https://github.com/yourusername" />
                </div>
                <div>
                  <label className="label">Portfolio</label>
                  <input type="url" value={formData.personal_info.portfolio}
                    onChange={(e) => handlePersonalChange('portfolio', e.target.value)}
                    className="input" placeholder="https://yourportfolio.com" />
                </div>
              </div>
            </section>

            {/* Education */}
            <section>
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h2 className="text-2xl font-bold">Education</h2>
                <button type="button" onClick={addEducation} className="btn btn-primary text-sm">
                  + Add
                </button>
              </div>
              {formData.education.map((edu, i) => (
                <div key={i} className="border p-4 rounded mb-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold">#{i + 1}</h3>
                    <button type="button" onClick={() => removeEducation(i)} className="text-red-600">Remove</button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" value={edu.institution} onChange={(e) => updateEducation(i, 'institution', e.target.value)}
                      className="input" placeholder="Institution" />
                    <input type="text" value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)}
                      className="input" placeholder="Degree" />
                    <input type="text" value={edu.field} onChange={(e) => updateEducation(i, 'field', e.target.value)}
                      className="input" placeholder="Field" />
                    <input type="text" value={edu.duration} onChange={(e) => updateEducation(i, 'duration', e.target.value)}
                      className="input" placeholder="2020-2024" />
                    <input type="text" value={edu.gpa} onChange={(e) => updateEducation(i, 'gpa', e.target.value)}
                      className="input" placeholder="GPA" />
                  </div>
                </div>
              ))}
            </section>

            {/* Experience */}
            <section>
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h2 className="text-2xl font-bold">Experience</h2>
                <button type="button" onClick={addExperience} className="btn btn-primary text-sm">+ Add</button>
              </div>
              {formData.experience.map((exp, i) => (
                <div key={i} className="border p-4 rounded mb-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold">#{i + 1}</h3>
                    <button type="button" onClick={() => removeExperience(i)} className="text-red-600">Remove</button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input type="text" value={exp.title} onChange={(e) => updateExperience(i, 'title', e.target.value)} className="input" placeholder="Job Title" />
                    <input type="text" value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} className="input" placeholder="Company" />
                    <input type="text" value={exp.location} onChange={(e) => updateExperience(i, 'location', e.target.value)} className="input" placeholder="Location" />
                    <input type="text" value={exp.duration} onChange={(e) => updateExperience(i, 'duration', e.target.value)} className="input" placeholder="Jan 2023 - Present" />
                  </div>
                  <label className="label">Bullets</label>
                  {exp.bullets.map((bullet, j) => (
                    <div key={j} className="flex gap-2 mb-2">
                      <textarea value={bullet} onChange={(e) => updateExperienceBullet(i, j, e.target.value)} className="input flex-1" rows={2} />
                      <button type="button" onClick={() => removeExperienceBullet(i, j)} className="text-red-600 text-sm">X</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addExperienceBullet(i)} className="btn btn-secondary text-sm">+ Bullet</button>
                </div>
              ))}
            </section>

            {/* Projects */}
            <section>
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h2 className="text-2xl font-bold">Projects</h2>
                <button type="button" onClick={addProject} className="btn btn-primary text-sm">+ Add</button>
              </div>
              {formData.projects.map((proj, i) => (
                <div key={i} className="border p-4 rounded mb-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold">#{i + 1}</h3>
                    <button type="button" onClick={() => removeProject(i)} className="text-red-600">Remove</button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input type="text" value={proj.name} onChange={(e) => updateProject(i, 'name', e.target.value)} className="input" placeholder="Project Name" />
                    <input type="text" value={proj.technologies} onChange={(e) => updateProject(i, 'technologies', e.target.value)} className="input" placeholder="Technologies" />
                    <input type="url" value={proj.link} onChange={(e) => updateProject(i, 'link', e.target.value)} className="input md:col-span-2" placeholder="GitHub/Demo Link" />
                  </div>
                  <label className="label">Bullets</label>
                  {proj.bullets.map((bullet, j) => (
                    <div key={j} className="flex gap-2 mb-2">
                      <textarea value={bullet} onChange={(e) => updateProjectBullet(i, j, e.target.value)} className="input flex-1" rows={2} />
                      <button type="button" onClick={() => removeProjectBullet(i, j)} className="text-red-600 text-sm">X</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addProjectBullet(i)} className="btn btn-secondary text-sm">+ Bullet</button>
                </div>
              ))}
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-2xl font-bold mb-4 pb-2 border-b">Skills</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Primary Skills</label>
                  <input type="text" value={formData.skills.primary} onChange={(e) => handleSkillsChange('primary', e.target.value)}
                    className="input" placeholder="JavaScript, React, Node.js (comma-separated)" />
                </div>
                <div>
                  <label className="label">Secondary Skills</label>
                  <input type="text" value={formData.skills.secondary} onChange={(e) => handleSkillsChange('secondary', e.target.value)}
                    className="input" placeholder="TypeScript, GraphQL" />
                </div>
                <div>
                  <label className="label">Tools</label>
                  <input type="text" value={formData.skills.tools} onChange={(e) => handleSkillsChange('tools', e.target.value)}
                    className="input" placeholder="Git, Docker, AWS" />
                </div>
              </div>
            </section>

            <div className="flex gap-4">
              <button type="submit" disabled={saving} className="btn btn-primary flex-1">
                {saving ? 'Saving...' : '💾 Save Resume'}
              </button>
              <Link href="/dashboard"><button type="button" className="btn btn-secondary">Cancel</button></Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}