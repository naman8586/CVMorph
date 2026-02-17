const { model } = require('../config/gemini');
const ResumeBase = require('../models/ResumeBase');
const ResumeVersion = require('../models/ResumeVersion');

// Role-specific optimization prompts
const ROLE_PROMPTS = {
  'Frontend Developer': {
    focus: 'UI/UX, React, JavaScript, TypeScript, responsive design, modern frontend frameworks, state management, component architecture',
    keywords: 'React, JavaScript, TypeScript, HTML, CSS, Tailwind, responsive, UI components, frontend optimization, browser compatibility'
  },
  'Backend Developer': {
    focus: 'API development, databases, server architecture, scalability, microservices, authentication, data modeling',
    keywords: 'Node.js, Express, PostgreSQL, MongoDB, REST API, microservices, authentication, backend optimization, database design'
  },
  'Python Developer': {
    focus: 'Python frameworks, data processing, scripting, automation, API development, testing',
    keywords: 'Python, Flask, Django, FastAPI, data processing, automation, testing, scripting, backend development'
  },
  'Full Stack Developer': {
    focus: 'End-to-end development, both frontend and backend, database design, deployment, full application lifecycle',
    keywords: 'Full stack, React, Node.js, databases, deployment, CI/CD, frontend, backend, end-to-end development'
  },
  'DevOps Engineer': {
    focus: 'CI/CD, deployment, infrastructure, containers, orchestration, automation, monitoring',
    keywords: 'DevOps, Docker, Kubernetes, CI/CD, deployment, automation, infrastructure, monitoring, cloud platforms'
  },
  'Data Analyst': {
    focus: 'Data analysis, SQL, visualization, reporting, statistical analysis, business intelligence',
    keywords: 'Data analysis, SQL, Python, visualization, reporting, analytics, business intelligence, data processing'
  }
};

// @desc    Adapt resume for specific role using Gemini AI
// @route   POST /api/ai/adapt
// @access  Private
exports.adaptResume = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { role, jobDescription } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role is required'
      });
    }

    // Get user's base resume
    const baseResume = await ResumeBase.findByUserId(userId);
    if (!baseResume) {
      return res.status(404).json({
        success: false,
        message: 'Please create a base resume first'
      });
    }

    const roleConfig = ROLE_PROMPTS[role];
    if (!roleConfig) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role selected'
      });
    }

    // Prepare data for AI
    const resumeContext = {
      personal_info: baseResume.personal_info,
      education: baseResume.education,
      experience: baseResume.experience,
      projects: baseResume.projects,
      skills: baseResume.skills
    };

    // Build AI prompt
    const prompt = `You are an expert resume optimizer specializing in ATS (Applicant Tracking Systems) optimization.

CRITICAL RULES:
1. NEVER invent or add skills, experiences, or qualifications that are not in the original resume
2. ONLY rewrite and re-emphasize existing content
3. Keep ALL facts 100% accurate
4. Maintain the same job titles, company names, dates, and degree information
5. Do NOT add metrics or numbers that weren't in the original
6. Focus on reordering sections and rewriting bullet points for the target role

TARGET ROLE: ${role}
ROLE FOCUS: ${roleConfig.focus}
KEY KEYWORDS: ${roleConfig.keywords}

${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}\n` : ''}

ORIGINAL RESUME DATA:
${JSON.stringify(resumeContext, null, 2)}

YOUR TASK:
1. Analyze which experiences and projects are most relevant to "${role}"
2. Rewrite experience bullet points to emphasize relevant skills (use keywords naturally)
3. Reorder projects to show most relevant ones first
4. Organize skills to highlight role-specific technologies
5. Keep education section unchanged
6. Maintain chronological order within each section

RESPOND WITH VALID JSON ONLY (no markdown, no code blocks):
{
  "personal_info": { same as input },
  "education": [ same as input ],
  "experience": [
    {
      "title": "exact same title",
      "company": "exact same company",
      "location": "exact same location", 
      "duration": "exact same duration",
      "bullets": ["rewritten bullet emphasizing ${role} skills", "..."]
    }
  ],
  "projects": [
    {
      "name": "exact same name",
      "description": "rewritten to highlight ${role} relevance",
      "technologies": "exact same technologies",
      "link": "exact same link",
      "bullets": ["rewritten bullets with role-specific emphasis"]
    }
  ],
  "skills": {
    "primary": ["most relevant skills for ${role}"],
    "secondary": ["other relevant skills"],
    "tools": ["relevant tools and technologies"]
  }
}`;

    console.log('🤖 Sending request to Gemini API...');
    
    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let adaptedText = response.text();

    // Clean up response (remove markdown code blocks if present)
    adaptedText = adaptedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let adapted_content;
    try {
      adapted_content = JSON.parse(adaptedText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', adaptedText);
      return res.status(500).json({
        success: false,
        message: 'AI generated invalid format. Please try again.'
      });
    }

    // Save as new version
    const version = await ResumeVersion.create({
      resume_base_id: baseResume.id,
      user_id: userId,
      role,
      job_description: jobDescription || null,
      adapted_content
    });

    res.json({
      success: true,
      message: `Resume adapted for ${role}`,
      version
    });

  } catch (error) {
    console.error('AI Adaptation Error:', error);
    
    if (error.message && error.message.includes('API key')) {
      return res.status(500).json({
        success: false,
        message: 'Gemini API key not configured. Please set GEMINI_API_KEY in .env'
      });
    }

    next(error);
  }
};

// @desc    Get available roles
// @route   GET /api/ai/roles
// @access  Public
exports.getRoles = async (req, res, next) => {
  try {
    const roles = Object.keys(ROLE_PROMPTS).map(role => ({
      name: role,
      description: ROLE_PROMPTS[role].focus
    }));

    res.json({
      success: true,
      roles
    });
  } catch (error) {
    next(error);
  }
};