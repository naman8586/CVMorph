'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { resumeAPI } from '@/lib/api';
import { isAuthenticated, logout } from '@/lib/auth';

export default function PreviewResume() {
  const router = useRouter();
  const { id } = useParams();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  // -------------------------
  // Auth + Data Load
  // -------------------------
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (id) {
      fetchResume(id);
    }
  }, [id]);

  const fetchResume = async (resumeId) => {
    try {
      const response = await resumeAPI.getVersion(resumeId);
      setResume(response.data.version);
    } catch (err) {
      alert('Failed to load resume');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Loading State
  // -------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-b-2 border-black rounded-full" />
      </div>
    );
  }

  if (!resume) {
    return <div className="text-center mt-10">Resume not found</div>;
  }

  const { adapted_content: content } = resume;

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold">
            CVMorph
          </Link>

          <div className="flex gap-3">
            <button
              onClick={() => resumeAPI.downloadPDF(id)}
              className="px-4 py-2 bg-black text-white rounded"
            >
              📥 Download PDF
            </button>

            <Link href="/dashboard">
              <button className="px-4 py-2 border rounded">
                ← Dashboard
              </button>
            </Link>

            <button
              onClick={logout}
              className="px-4 py-2 border border-red-500 text-red-500 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* META */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
          <h2 className="font-bold text-lg">{resume.role}</h2>
          <p className="text-sm text-gray-600">
            Created on {new Date(resume.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* RESUME */}
        <div
          className="bg-white shadow-lg rounded p-12"
          style={{ fontFamily: 'Times New Roman, serif' }}
        >
          {/* HEADER */}
          <div className="text-center border-b border-black pb-3 mb-4">
            <h1 className="text-3xl font-bold">
              {content.personal_info.name}
            </h1>
            <p className="text-lg">{content.personal_info.title}</p>
            <p className="text-sm mt-1">
              {content.personal_info.email}
              {content.personal_info.linkedin && (
                <> | <a href={content.personal_info.linkedin} className="text-blue-600">LinkedIn</a></>
              )}
              {content.personal_info.github && (
                <> | <a href={content.personal_info.github} className="text-blue-600">GitHub</a></>
              )}
              {content.personal_info.portfolio && (
                <> | <a href={content.personal_info.portfolio} className="text-blue-600">Portfolio</a></>
              )}
            </p>
          </div>

          {/* EXPERIENCE */}
          {content.experience?.length > 0 && (
            <>
              <h2 className="text-xl font-bold border-b border-black mt-6 mb-3">
                Experience
              </h2>

              {content.experience.map((exp, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between font-bold">
                    <span>
                      {exp.title}, {exp.company} – {exp.location}
                    </span>
                    <span className="italic font-normal">
                      {exp.duration}
                    </span>
                  </div>

                  <ul className="list-disc ml-6 mt-1">
                    {exp.bullets?.map((b, j) => (
                      <li key={j} className="text-sm leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}

          {/* EDUCATION */}
          {content.education?.length > 0 && (
            <>
              <h2 className="text-xl font-bold border-b border-black mt-6 mb-3">
                Education
              </h2>

              {content.education.map((edu, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between">
                    <span className="font-bold">
                      {edu.institution} – {edu.degree}, {edu.field}
                    </span>
                    <span className="italic">{edu.duration}</span>
                  </div>
                  {edu.gpa && (
                    <p className="text-sm">CGPA: {edu.gpa}</p>
                  )}
                </div>
              ))}
            </>
          )}

          {/* PROJECTS */}
          {content.projects?.length > 0 && (
            <>
              <h2 className="text-xl font-bold border-b border-black mt-6 mb-3">
                Projects
              </h2>

              {content.projects.map((proj, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between font-bold">
                    <span>
                      {proj.name}
                      {proj.technologies && ` – ${proj.technologies}`}
                    </span>
                    {proj.link && (
                      <a href={proj.link} className="text-blue-600">
                        GitHub
                      </a>
                    )}
                  </div>

                  <ul className="list-disc ml-6 mt-1">
                    {proj.bullets?.map((b, j) => (
                      <li key={j} className="text-sm leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}

          {/* SKILLS */}
          {content.skills && (
            <>
              <h2 className="text-xl font-bold border-b border-black mt-6 mb-3">
                Skills
              </h2>

              <div className="space-y-1 text-sm">
                {content.skills.primary && (
                  <p>
                    <strong>Primary:</strong>{' '}
                    {Array.isArray(content.skills.primary)
                      ? content.skills.primary.join(', ')
                      : content.skills.primary}
                  </p>
                )}

                {content.skills.secondary && (
                  <p>
                    <strong>Secondary:</strong>{' '}
                    {Array.isArray(content.skills.secondary)
                      ? content.skills.secondary.join(', ')
                      : content.skills.secondary}
                  </p>
                )}

                {content.skills.tools && (
                  <p>
                    <strong>Tools:</strong>{' '}
                    {Array.isArray(content.skills.tools)
                      ? content.skills.tools.join(', ')
                      : content.skills.tools}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
