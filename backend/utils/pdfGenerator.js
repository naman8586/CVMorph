const puppeteer = require('puppeteer');

// Generate 90+ ATS-score HTML
const generateHTML = (resumeData) => {
  const { personal_info, education, experience, projects, skills } = resumeData;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personal_info?.name || 'Resume'} - Resume</title>
  <meta name="author" content="${personal_info?.name || 'Resume'}">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10.5pt;
      line-height: 1.3;
      color: #000000;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.75in;
      background: #ffffff;
    }
    
    /* Header - Name centered, 18pt */
    .header {
      text-align: center;
      margin-bottom: 12pt;
      border-bottom: 2pt solid #000000;
      padding-bottom: 8pt;
    }
    
    .header h1 {
      font-size: 20pt;
      font-weight: bold;
      margin-bottom: 6pt;
      text-transform: uppercase;
      letter-spacing: 1.5pt;
    }
    
    .header .title {
      font-size: 12pt;
      font-weight: 600;
      margin-bottom: 6pt;
      color: #1a1a1a;
    }
    
    .header .contact {
      font-size: 10pt;
      line-height: 1.4;
    }
    
    .header .contact a {
      color: #000000;
      text-decoration: none;
    }
    
    .separator {
      margin: 0 5pt;
      color: #333;
    }
    
    /* Section headings - UPPERCASE, bold, underlined */
    h2 {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
      border-bottom: 1.5pt solid #000000;
      margin-top: 16pt;
      margin-bottom: 8pt;
      padding-bottom: 2pt;
      letter-spacing: 1pt;
    }
    
    /* Summary section */
    .summary {
      margin-bottom: 10pt;
      line-height: 1.4;
      text-align: justify;
    }
    
    /* Skills - Clean table layout */
    .skills-table {
      width: 100%;
      margin-bottom: 10pt;
      border-collapse: collapse;
    }
    
    .skills-table tr {
      line-height: 1.5;
      vertical-align: top;
    }
    
    .skills-table td:first-child {
      font-weight: bold;
      padding-right: 8pt;
      width: 180pt;
    }
    
    .skills-table td:last-child {
      width: auto;
    }
    
    /* Experience/Project entry */
    .entry {
      margin-bottom: 12pt;
      page-break-inside: avoid;
    }
    
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2pt;
    }
    
    .entry-title {
      font-weight: bold;
      font-size: 11pt;
    }
    
    .entry-dates {
      font-weight: bold;
      font-size: 10pt;
      white-space: nowrap;
      margin-left: 12pt;
    }
    
    .entry-subtitle {
      margin-bottom: 4pt;
      font-size: 10pt;
      font-style: italic;
    }
    
    /* Bullet points - ATS-optimized */
    ul {
      margin-left: 20pt;
      margin-top: 3pt;
      margin-bottom: 0pt;
      padding-left: 0;
    }
    
    ul li {
      margin-bottom: 4pt;
      line-height: 1.4;
    }
    
    ul li:last-child {
      margin-bottom: 0pt;
    }
    
    /* Education */
    .education-entry {
      margin-bottom: 6pt;
    }
    
    .education-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2pt;
    }
    
    .education-title {
      font-weight: bold;
      font-size: 11pt;
    }
    
    .education-dates {
      font-weight: bold;
      font-size: 10pt;
    }
    
    .education-subtitle {
      font-size: 10pt;
      margin-bottom: 2pt;
    }
    
    .education-gpa {
      font-size: 10pt;
      font-style: italic;
    }
    
    /* Project header */
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2pt;
    }
    
    .project-title {
      font-weight: bold;
      font-size: 11pt;
    }
    
    .project-link {
      font-size: 9pt;
      color: #000000;
      text-decoration: none;
      margin-left: 12pt;
    }
    
    /* Links - Black, no underline */
    a {
      color: #000000;
      text-decoration: none;
    }
    
    @media print {
      body {
        padding: 0.5in;
      }
      .entry, .education-entry {
        page-break-inside: avoid;
      }
      h2 {
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body>
  <!-- Header with all contact info -->
  <div class="header">
    <h1>${personal_info?.name?.toUpperCase() || 'YOUR NAME'}</h1>
    ${personal_info?.title ? `<div class="title">${personal_info.title}</div>` : ''}
    <div class="contact">
      ${personal_info?.phone ? `${personal_info.phone}<span class="separator">|</span>` : ''}
      ${personal_info?.email ? `<a href="mailto:${personal_info.email}">${personal_info.email}</a>` : 'email@example.com'}
      ${personal_info?.linkedin ? `<span class="separator">|</span><a href="${personal_info.linkedin}">${personal_info.linkedin.replace('https://', '').replace('http://', '').replace('www.', '')}</a>` : ''}
      ${personal_info?.github ? `<span class="separator">|</span><a href="${personal_info.github}">${personal_info.github.replace('https://', '').replace('http://', '').replace('www.', '')}</a>` : ''}
      ${personal_info?.portfolio ? `<span class="separator">|</span><a href="${personal_info.portfolio}">${personal_info.portfolio.replace('https://', '').replace('http://', '').replace('www.', '')}</a>` : ''}
    </div>
  </div>

  <!-- Summary (Professional Profile) -->
  ${personal_info?.summary ? `
  <h2>Professional Summary</h2>
  <div class="summary">
    ${personal_info.summary}
  </div>
  ` : ''}

  <!-- Skills -->
  ${skills ? `
  <h2>Technical Skills</h2>
  <table class="skills-table">
    ${skills.languages && skills.languages.length > 0 ? `
      <tr>
        <td>Programming Languages:</td>
        <td>${Array.isArray(skills.languages) ? skills.languages.join(', ') : skills.languages}</td>
      </tr>
    ` : ''}
    ${skills.frontend && skills.frontend.length > 0 ? `
      <tr>
        <td>Frameworks & Libraries:</td>
        <td>${Array.isArray(skills.frontend) ? skills.frontend.join(', ') : skills.frontend}</td>
      </tr>
    ` : ''}
    ${skills.backend && skills.backend.length > 0 ? `
      <tr>
        <td>Backend & APIs:</td>
        <td>${Array.isArray(skills.backend) ? skills.backend.join(', ') : skills.backend}</td>
      </tr>
    ` : ''}
    ${skills.databases && skills.databases.length > 0 ? `
      <tr>
        <td>Databases:</td>
        <td>${Array.isArray(skills.databases) ? skills.databases.join(', ') : skills.databases}</td>
      </tr>
    ` : ''}
    ${skills.tools && skills.tools.length > 0 ? `
      <tr>
        <td>DevOps & Tools:</td>
        <td>${Array.isArray(skills.tools) ? skills.tools.join(', ') : skills.tools}</td>
      </tr>
    ` : ''}
  </table>
  ` : ''}

  <!-- Professional Experience -->
  ${experience && experience.length > 0 ? `
  <h2>Professional Experience</h2>
  ${experience.map(exp => `
    <div class="entry">
      <div class="entry-header">
        <div class="entry-title">${exp.title || 'Job Title'}</div>
        <div class="entry-dates">${exp.duration || 'Dates'}</div>
      </div>
      <div class="entry-subtitle">${exp.company || 'Company'}${exp.location ? ' | ' + exp.location : ''}</div>
      ${exp.bullets && exp.bullets.length > 0 ? `
        <ul>
          ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  `).join('')}
  ` : ''}

  <!-- Projects -->
  ${projects && projects.length > 0 ? `
  <h2>Key Projects</h2>
  ${projects.map(project => `
    <div class="entry">
      <div class="project-header">
        <div class="project-title">${project.name || 'Project Name'}${project.technologies ? ' | ' + project.technologies : ''}</div>
        ${project.link ? `<a href="${project.link}" class="project-link">${project.link.replace('https://', '').replace('http://', '').replace('www.', '')}</a>` : ''}
      </div>
      ${project.bullets && project.bullets.length > 0 ? `
        <ul>
          ${project.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  `).join('')}
  ` : ''}

  <!-- Education -->
  ${education && education.length > 0 ? `
  <h2>Education</h2>
  ${education.map(edu => `
    <div class="education-entry">
      <div class="education-header">
        <div class="education-title">${edu.degree || 'Degree'} in ${edu.field || 'Field'}</div>
        <div class="education-dates">${edu.duration || 'Dates'}</div>
      </div>
      <div class="education-subtitle">${edu.institution || 'Institution'}</div>
      ${edu.gpa ? `<div class="education-gpa">GPA: ${edu.gpa}</div>` : ''}
    </div>
  `).join('')}
  ` : ''}
</body>
</html>
  `;
};

// Generate PDF
exports.generatePDF = async (resumeData) => {
  let browser;
  
  try {
    const html = generateHTML(resumeData);
    
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set PDF metadata for better ATS parsing
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    const pdf = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '0.75in',
        right: '0.75in',
        bottom: '0.75in',
        left: '0.75in'
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      tagged: true, // PDF/UA compliance for better ATS parsing
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