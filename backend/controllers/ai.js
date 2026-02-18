const aiClient = require('../config/aiClient');
const ResumeBase = require('../models/ResumeBase');
const ResumeVersion = require('../models/ResumeVersion');
const { extractText, validateResumeText } = require('../utils/resumeParser');

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

// @desc    Get AI provider status
// @route   GET /api/ai/status
// @access  Public
exports.getAIStatus = (req, res) => {
  try {
    const status = aiClient.status();
    res.json({ 
      success: true, 
      providers: status,
      primary: aiClient.getPrimaryProvider(),
      fallback: aiClient.getFallbackProvider()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get AI status'
    });
  }
};

// @desc    Parse uploaded resume file
// @route   POST /api/ai/parse-resume
// @access  Private
exports.parseUploadedResume = async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded. Please upload a PDF, DOCX, or TXT file.' 
      });
    }

    console.log(`📤 File uploaded: ${req.file.originalname} (${req.file.size} bytes)`);

    // Extract text from file
    const rawText = await extractText(req.file);
    
    // Validate extracted text
    validateResumeText(rawText);

    console.log(`✅ Text extracted successfully (${rawText.length} characters)`);

    // Create AI prompt for parsing - SIMPLIFIED for better JSON generation
    const prompt = `Extract resume data from this text and return ONLY valid JSON. No markdown, no explanations, ONLY the JSON object.

Resume Text:
${rawText}

Return EXACTLY this structure:
{
  "personal_info": {
    "name": "Full Name",
    "phone": "+91-1234567890",
    "email": "email@example.com",
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "portfolio": "https://website.com",
    "title": "Job Title",
    "summary": "Professional summary if available"
  },
  "skills": {
    "languages": ["JavaScript", "Python"],
    "frontend": ["React", "Next.js"],
    "backend": ["Node.js", "Express"],
    "databases": ["PostgreSQL", "MongoDB"],
    "tools": ["Git", "Docker"]
  },
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, State",
      "duration": "Start Date - End Date",
      "bullets": ["Achievement 1", "Achievement 2"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "technologies": "Tech Stack",
      "link": "https://github.com/user/project",
      "bullets": ["Feature 1", "Feature 2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "duration": "Year Range",
      "gpa": "GPA if available"
    }
  ]
}

IMPORTANT: Return ONLY the JSON. No text before or after.`;

    console.log('🤖 Sending resume to AI for parsing...');

    // Send to AI with increased token limit
    const aiResponse = await aiClient.generate(prompt);

    // More aggressive cleaning
    let cleanedResponse = aiResponse
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .replace(/^[^{]*/, '') // Remove everything before first {
      .replace(/[^}]*$/, '') // Remove everything after last }
      .trim();

    // Try to fix common JSON issues
    try {
      const parsedResume = JSON.parse(cleanedResponse);
      
      console.log('✅ Resume parsed successfully');

      res.json({
        success: true,
        message: 'Resume parsed successfully. Review and save to continue.',
        resume: parsedResume,
        metadata: {
          originalFilename: req.file.originalname,
          fileSize: req.file.size,
          extractedLength: rawText.length,
          provider: aiClient.getPrimaryProvider()
        }
      });
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError.message);
      console.error('Cleaned response:', cleanedResponse.substring(0, 500));
      
      return res.status(500).json({ 
        success: false, 
        message: 'AI returned incomplete data. Try uploading a simpler resume or use the manual form.',
        debug: cleanedResponse.substring(0, 200)
      });
    }

  } catch (error) {
    console.error('Resume Parse Error:', error);
    
    if (error.message.includes('too short') || error.message.includes('does not appear')) {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }

    next(error);
  }
};

// @desc    Adapt resume for specific role using AI
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

    console.log(`🎯 Adapting resume for role: ${role}`);

    // Prepare data for AI - Simplified version
    const resumeContext = {
      personal_info: baseResume.personal_info,
      education: baseResume.education,
      experience: baseResume.experience,
      projects: baseResume.projects,
      skills: baseResume.skills
    };

    // Shorter, more focused prompt
    const prompt = `Rewrite this resume for ${role} role. Keep all facts accurate. Return ONLY valid JSON.

TARGET: ${role}
FOCUS: ${roleConfig.keywords}

ORIGINAL:
${JSON.stringify(resumeContext, null, 2)}

RULES:
1. NEVER invent experience
2. Only rewrite bullet points
3. Keep job titles, companies, dates exact
4. Reorder skills by relevance

Return this JSON (no markdown):
{
  "personal_info": {...same...},
  "education": [...same...],
  "experience": [...rewritten bullets...],
  "projects": [...reordered...],
  "skills": {...reordered...}
}`;

    console.log('🤖 Sending request to AI...');
    
    // Call AI
    const aiResponse = await aiClient.generate(prompt);

    // Clean response
    let cleanedResponse = aiResponse
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .replace(/^[^{]*/, '')
      .replace(/[^}]*$/, '')
      .trim();

    let adapted_content;
    try {
      adapted_content = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response');
      console.error('Response preview:', cleanedResponse.substring(0, 500));
      
      return res.status(500).json({
        success: false,
        message: 'AI response was incomplete. Please try again or use a shorter resume.'
      });
    }

    // Save version
    const version = await ResumeVersion.create({
      resume_base_id: baseResume.id,
      user_id: userId,
      role,
      job_description: jobDescription || null,
      adapted_content
    });

    console.log(`✅ Resume adapted successfully (Version ID: ${version.id})`);

    res.json({
      success: true,
      message: `Resume adapted for ${role}`,
      version,
      provider: aiClient.getPrimaryProvider()
    });

  } catch (error) {
    console.error('AI Adaptation Error:', error);
    
    if (error.message && error.message.includes('API key')) {
      return res.status(500).json({
        success: false,
        message: 'AI API keys not configured. Please set GEMINI_API_KEY or GROQ_API_KEY in .env'
      });
    }

    next(error);
  }
};