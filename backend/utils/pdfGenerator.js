const puppeteer = require('puppeteer');

/**
 * Generate HTML that exactly mirrors the LaTeX resume layout:
 * - Margins: 1cm top/bottom, 1.2cm left/right
 * - Font: Latin Modern Roman / Times New Roman serif, 10pt
 * - Name: 24pt bold uppercase centered
 * - Sections: bold uppercase with full-width bottom rule
 * - Skills: two-column table, bold labels
 * - Experience: bold title + right-aligned date, italic company + location below
 * - Projects: bold name | tech + right-aligned link
 * - Education: bold degree + right-aligned date, italic institution + GPA
 * - Bullets: 12pt left indent, 2pt item spacing
 */
const generateHTML = (resumeData) => {
  const { personal_info, education, experience, projects, skills } = resumeData;

  // Clean a URL for display (strip https?://)
  const displayUrl = (url = '') => url.replace(/^https?:\/\//, '');

  // Render a bullet list
  const bulletList = (bullets = []) => {
    if (!bullets || bullets.length === 0) return '';
    return `<ul>${bullets.filter(Boolean).map(b => `<li>${b}</li>`).join('')}</ul>`;
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${personal_info?.name || 'Resume'}</title>
<style>
  /* ── Reset ───────────────────────────────────────────────────────────── */
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  /* ── Page ────────────────────────────────────────────────────────────── */
  /* Puppeteer handles the actual page margins via pdf() options.
     body width is forced to the printable area width. */
  body {
    font-family: 'Latin Modern Roman', 'Computer Modern', Georgia, 'Times New Roman', serif;
    font-size: 10pt;
    line-height: 1.25;
    color: #000;
    width: 100%;
    /* DO NOT add padding here — puppeteer margins are set in pdf() call */
  }

  /* ── Header ──────────────────────────────────────────────────────────── */
  .header {
    text-align: center;
    margin-bottom: 6pt;
  }
  .header h1 {
    font-size: 24pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5pt;
    line-height: 1;
    margin-bottom: 4pt;
  }
  .header .contact {
    font-size: 10pt;
    line-height: 1.4;
  }
  .header .contact a { color: #000; text-decoration: none; }
  .sep { margin: 0 4pt; }

  /* ── Section heading — bold uppercase + full rule below ──────────────── */
  h2 {
    font-size: 11pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.4pt;
    border-bottom: 0.8pt solid #000;
    margin-top: 7pt;
    margin-bottom: 4pt;
    padding-bottom: 1pt;
  }

  /* ── Summary ─────────────────────────────────────────────────────────── */
  .summary {
    font-size: 10pt;
    line-height: 1.3;
    text-align: justify;
    margin-bottom: 2pt;
  }

  /* ── Skills table: bold label col + value col ────────────────────────── */
  .skills-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 2pt;
  }
  .skills-table td {
    font-size: 10pt;
    line-height: 1.4;
    vertical-align: top;
    padding: 0;
  }
  .skills-table td.lbl {
    font-weight: bold;
    white-space: nowrap;
    padding-right: 6pt;
  }

  /* ── Experience / Project entry ──────────────────────────────────────── */
  .entry { margin-bottom: 6pt; page-break-inside: avoid; }

  /* Title row: bold left, bold right */
  .row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .row-left  { font-weight: bold; font-size: 10pt; }
  .row-right { font-weight: bold; font-size: 10pt; white-space: nowrap; padding-left: 8pt; }

  /* Subtitle row: italic */
  .row-sub { font-style: italic; font-size: 10pt; margin-bottom: 2pt; }

  /* Project title line: bold name + right-aligned link */
  .proj-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2pt; }
  .proj-name { font-weight: bold; font-size: 10pt; }
  .proj-link { font-size: 9pt; color: #000; text-decoration: none; white-space: nowrap; padding-left: 8pt; }

  /* ── Bullet list — matches LaTeX highlights env ──────────────────────── */
  ul {
    margin-left: 12pt;
    margin-top: 2pt;
    margin-bottom: 0;
    padding-left: 0;
    list-style-type: disc;
  }
  ul li {
    font-size: 10pt;
    line-height: 1.3;
    margin-bottom: 2pt;
  }
  ul li:last-child { margin-bottom: 0; }

  /* ── Education ───────────────────────────────────────────────────────── */
  .edu-sub { font-style: italic; font-size: 10pt; }

  /* ── Print safety ────────────────────────────────────────────────────── */
  @page { margin: 1cm 1.2cm; }
  @media print {
    h2 { page-break-after: avoid; }
    .entry { page-break-inside: avoid; }
  }
</style>
</head>
<body>

<!-- ══ HEADER ══════════════════════════════════════════════════════════════ -->
<div class="header">
  <h1>${personal_info?.name || 'YOUR NAME'}</h1>
  <div class="contact">
    ${[
      personal_info?.phone || '',
      personal_info?.email  ? `<a href="mailto:${personal_info.email}">${personal_info.email}</a>` : '',
      personal_info?.linkedin ? `<a href="${personal_info.linkedin}">${displayUrl(personal_info.linkedin)}</a>` : '',
      personal_info?.github   ? `<a href="${personal_info.github}">${displayUrl(personal_info.github)}</a>` : '',
    ].filter(Boolean).join('<span class="sep">|</span>')}
  </div>
</div>

<!-- ══ SUMMARY ══════════════════════════════════════════════════════════════ -->
${personal_info?.summary ? `
<h2>Summary</h2>
<div class="summary">${personal_info.summary}</div>
` : ''}

<!-- ══ SKILLS ══════════════════════════════════════════════════════════════ -->
${skills ? `
<h2>Skills</h2>
<table class="skills-table">
  ${skills.languages?.length ? `
  <tr>
    <td class="lbl">Programming Languages:</td>
    <td>${Array.isArray(skills.languages) ? skills.languages.join(', ') : skills.languages}</td>
  </tr>` : ''}
  ${skills.frontend?.length ? `
  <tr>
    <td class="lbl">Frameworks &amp; Libraries:</td>
    <td>${Array.isArray(skills.frontend) ? skills.frontend.join(', ') : skills.frontend}</td>
  </tr>` : ''}
  ${skills.backend?.length ? `
  <tr>
    <td class="lbl">Backend &amp; APIs:</td>
    <td>${Array.isArray(skills.backend) ? skills.backend.join(', ') : skills.backend}</td>
  </tr>` : ''}
  ${skills.databases?.length ? `
  <tr>
    <td class="lbl">Databases:</td>
    <td>${Array.isArray(skills.databases) ? skills.databases.join(', ') : skills.databases}</td>
  </tr>` : ''}
  ${skills.tools?.length ? `
  <tr>
    <td class="lbl">DevOps &amp; Tools:</td>
    <td>${Array.isArray(skills.tools) ? skills.tools.join(', ') : skills.tools}</td>
  </tr>` : ''}
</table>
` : ''}

<!-- ══ EXPERIENCE ══════════════════════════════════════════════════════════ -->
${experience?.length ? `
<h2>Professional Experience</h2>
${experience.map(exp => `
<div class="entry">
  <div class="row">
    <span class="row-left">${exp.title || ''}</span>
    <span class="row-right">${exp.duration || ''}</span>
  </div>
  <div class="row-sub">${exp.company || ''}${exp.location ? `, ${exp.location}` : ''}</div>
  ${bulletList(exp.bullets)}
</div>`).join('')}
` : ''}

<!-- ══ PROJECTS ══════════════════════════════════════════════════════════════ -->
${projects?.length ? `
<h2>Projects</h2>
${projects.map(proj => `
<div class="entry">
  <div class="proj-row">
    <span class="proj-name">${proj.name || ''}${proj.technologies ? ` | ${proj.technologies}` : ''}</span>
    ${proj.link ? `<a href="${proj.link}" class="proj-link">${displayUrl(proj.link)}</a>` : ''}
  </div>
  ${bulletList(proj.bullets)}
</div>`).join('')}
` : ''}

<!-- ══ EDUCATION ══════════════════════════════════════════════════════════════ -->
${education?.length ? `
<h2>Education</h2>
${education.map(edu => `
<div class="entry">
  <div class="row">
    <span class="row-left">${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}</span>
    <span class="row-right">${edu.duration || ''}</span>
  </div>
  <div class="edu-sub">${edu.institution || ''}${edu.gpa ? `, CGPA: ${edu.gpa}` : ''}</div>
</div>`).join('')}
` : ''}

</body>
</html>`;
};

// ── Generate PDF ─────────────────────────────────────────────────────────────
exports.generatePDF = async (resumeData) => {
  let browser;
  try {
    const html = generateHTML(resumeData);

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();

    // Set viewport to US Letter width at 96dpi
    await page.setViewport({ width: 816, height: 1056 });
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'Letter',
      printBackground: true,
      // These match the LaTeX geometry exactly
      margin: {
        top:    '1cm',
        bottom: '1cm',
        left:   '1.2cm',
        right:  '1.2cm',
      },
      preferCSSPageSize: false, // let Puppeteer control page size
    });

    return pdf;

  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
};