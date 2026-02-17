const puppeteer = require('puppeteer');

// Generate ATS-friendly HTML matching exact LaTeX format
const generateHTML = (resumeData) => {
  const { personal_info, education, experience, projects, skills } = resumeData;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personal_info?.name || 'Resume'}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Charter', 'Georgia', 'Times New Roman', serif;
      font-size: 10pt;
      line-height: 1.15;
      color: #000000;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 1.5cm 1.5cm 1.5cm 1.5cm;
    }
    
    /* Header - Centered with Charter font */
    .header {
      text-align: center;
      margin-bottom: 5pt;
      line-height: 1.2;
    }
    
    .header h1 {
      font-size: 25pt;
      font-weight: bold;
      margin-bottom: 1pt;
      letter-spacing: 0.5pt;
    }
    
    .header .title {
      font-size: 15pt;
      margin-bottom: 5pt;
      margin-top: 1pt;
    }
    
    .header .contact {
      font-size: 10pt;
      margin-top: 5pt;
    }
    
    .header .contact a {
      color: #0066cc;
      text-decoration: none;
    }
    
    .header .contact a:hover {
      text-decoration: underline;
    }
    
    .separator {
      display: inline-block;
      margin: 0 5pt;
    }
    
    /* Section headings - Bold with bottom border */
    h2 {
      font-size: 12pt;
      font-weight: bold;
      border-bottom: 1pt solid #000000;
      margin-top: 0.2cm;
      margin-bottom: 0.15cm;
      padding-bottom: 1pt;
    }
    
    /* Entry container */
    .entry {
      margin-bottom: 0pt;
      page-break-inside: avoid;
    }
    
    /* Two column entry header */
    .entry-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0pt;
      font-size: 10pt;
      align-items: baseline;
    }
    
    .entry-header .left {
      font-weight: bold;
      flex: 1;
    }
    
    .entry-header .right {
      font-style: italic;
      text-align: right;
      white-space: nowrap;
      margin-left: 10pt;
      flex-shrink: 0;
      width: 4.5cm;
    }
    
    /* Bullet points - matching LaTeX spacing */
    ul {
      margin-left: 10pt;
      margin-top: 0.10cm;
      margin-bottom: 0.10cm;
      padding-left: 0;
      list-style-position: outside;
    }
    
    ul li {
      margin-bottom: 0.10cm;
      padding-left: 0;
      line-height: 1.15;
    }
    
    ul li::marker {
      content: '• ';
      font-size: 8pt;
    }
    
    /* Last bullet in list has no bottom margin */
    ul li:last-child {
      margin-bottom: 0pt;
    }
    
    /* Skills section - inline format matching LaTeX */
    .skills-section {
      margin-top: 0pt;
    }
    
    .skill-category {
      margin-bottom: 0pt;
      line-height: 1.3;
    }
    
    .skill-category:not(:last-child) {
      margin-bottom: 0pt;
    }
    
    .skill-category strong {
      font-weight: bold;
    }
    
    /* Links - Black for ATS-friendliness (except header) */
    a {
      color: black;
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    /* Project header with inline link */
    .project-header {
      font-weight: bold;
      margin-bottom: 0pt;
      font-size: 10pt;
    }
    
    .project-link {
      color: #0066cc;
      text-decoration: none;
      margin-left: 3pt;
    }
    
    /* Education - inline CGPA */
    .education-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0pt;
      font-size: 10pt;
    }
    
    .education-left {
      font-weight: bold;
      flex: 1;
    }
    
    .education-right {
      font-style: italic;
      text-align: right;
      white-space: nowrap;
      margin-left: 10pt;
      width: 4.5cm;
    }
    
    /* Page break handling */
    @media print {
      .entry {
        page-break-inside: avoid;
      }
      
      h2 {
        page-break-after: avoid;
      }
    }
    
    /* Spacing adjustments to match LaTeX exactly */
    .spacing-after-header {
      margin-bottom: 5pt;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <h1>${personal_info?.name || 'YOUR NAME'}</h1>
    <div class="title">${personal_info?.title || 'Full Stack Developer'}</div>
    <div class="contact spacing-after-header">
      ${personal_info?.email ? `<a href="mailto:${personal_info.email}">${personal_info.email}</a>` : 'email@example.com'}
      ${personal_info?.linkedin ? `<span class="separator">|</span><a href="${personal_info.linkedin}" target="_blank">LinkedIn</a>` : ''}
      ${personal_info?.github ? `<span class="separator">|</span><a href="${personal_info.github}" target="_blank">GitHub</a>` : ''}
      ${personal_info?.portfolio ? `<span class="separator">|</span><a href="${personal_info.portfolio}" target="_blank">Portfolio</a>` : ''}
    </div>
  </div>

  <!-- Experience Section -->
  ${experience && experience.length > 0 ? `
  <h2>Experience</h2>
  ${experience.map((exp, index) => `
    <div class="entry">
      <div class="entry-header">
        <div class="left">${exp.title || 'Job Title'}, ${exp.company || 'Company'} – ${exp.location || 'Location'}</div>
        <div class="right">${exp.duration || 'Date'}</div>
      </div>
      ${exp.bullets && exp.bullets.length > 0 ? `
        <ul>
          ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
    ${index < experience.length - 1 ? '<div style="margin-bottom: 0.10cm;"></div>' : ''}
  `).join('')}
  ` : ''}

  <!-- Education Section -->
  ${education && education.length > 0 ? `
  <h2>Education</h2>
  ${education.map(edu => `
    <div class="entry">
      <div class="education-header">
        <div class="education-left">
          ${edu.institution || 'Institution'} – ${edu.degree || 'Degree'}, ${edu.field || 'Field'}${edu.gpa ? ` | CGPA: ${edu.gpa}` : ''}
        </div>
        <div class="education-right">${edu.duration || 'Date'}</div>
      </div>
    </div>
  `).join('')}
  ` : ''}

  <!-- Projects Section -->
  ${projects && projects.length > 0 ? `
  <h2>Projects</h2>
  ${projects.map((project, index) => `
    <div class="entry">
      <div class="project-header">
        ${project.name || 'Project Name'}${project.technologies ? ` – ${project.technologies}` : ''}${project.link ? ` | <a href="${project.link}" class="project-link" target="_blank">GitHub</a>` : ''}
      </div>
      ${project.bullets && project.bullets.length > 0 ? `
        <ul>
          ${project.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
    ${index < projects.length - 1 ? '<div style="margin-bottom: 0.10cm;"></div>' : ''}
  `).join('')}
  ` : ''}

  <!-- Skills Section (Supports BOTH old and new formats) -->
  ${skills ? `
  <h2>Skills</h2>
  <div class="skills-section">
    ${skills.primary && (Array.isArray(skills.primary) ? skills.primary.length : skills.primary) ? `
      <div class="skill-category">
        <strong>Primary:</strong> ${Array.isArray(skills.primary) ? skills.primary.join(', ') : skills.primary}
      </div>
    ` : ''}
    ${skills.secondary && (Array.isArray(skills.secondary) ? skills.secondary.length : skills.secondary) ? `
      <div class="skill-category">
        <strong>Secondary:</strong> ${Array.isArray(skills.secondary) ? skills.secondary.join(', ') : skills.secondary}
      </div>
    ` : ''}
    ${skills.tools && (Array.isArray(skills.tools) ? skills.tools.length : skills.tools) ? `
      <div class="skill-category">
        <strong>Tools:</strong> ${Array.isArray(skills.tools) ? skills.tools.join(', ') : skills.tools}
      </div>
    ` : ''}
    ${skills.backend && (Array.isArray(skills.backend) ? skills.backend.length : skills.backend) ? `
      <div class="skill-category">
        <strong>Backend:</strong> ${Array.isArray(skills.backend) ? skills.backend.join(', ') : skills.backend}
      </div>
    ` : ''}
    ${skills.frontend && (Array.isArray(skills.frontend) ? skills.frontend.length : skills.frontend) ? `
      <div class="skill-category">
        <strong>Frontend:</strong> ${Array.isArray(skills.frontend) ? skills.frontend.join(', ') : skills.frontend}
      </div>
    ` : ''}
    ${skills.databases && (Array.isArray(skills.databases) ? skills.databases.length : skills.databases) ? `
      <div class="skill-category">
        <strong>Databases:</strong> ${Array.isArray(skills.databases) ? skills.databases.join(', ') : skills.databases}
      </div>
    ` : ''}
    ${skills.languages && (Array.isArray(skills.languages) ? skills.languages.length : skills.languages) ? `
      <div class="skill-category">
        <strong>Languages:</strong> ${Array.isArray(skills.languages) ? skills.languages.join(', ') : skills.languages}
      </div>
    ` : ''}
  </div>
  ` : ''}
</body>
</html>
  `;
};

// Generate PDF from resume data
exports.generatePDF = async (resumeData) => {
  let browser;
  
  try {
    const html = generateHTML(resumeData);
    
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '1.5cm',
        right: '1.5cm',
        bottom: '1.5cm',
        left: '1.5cm'
      },
      preferCSSPageSize: true
    });
    
    return pdf;
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};