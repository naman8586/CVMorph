const mammoth = require('mammoth');

/**
 * Extract text from PDF buffer using pdfjs-dist (Node 22 compatible)
 */
async function extractPDFText(buffer) {
  // pdfjs-dist works on Node 22 without any subpath hacks
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    // suppress worker warning in Node environment
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const textParts = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map(item => ('str' in item ? item.str : ''))
      .join(' ');
    textParts.push(pageText);
  }

  return textParts.join('\n').trim();
}

/**
 * Extract text from uploaded file buffer
 */
exports.extractText = async (file) => {
  const { mimetype, buffer } = file;

  try {
    if (!buffer) {
      throw new Error('File buffer missing');
    }

    // ---------- PDF ----------
    if (mimetype === 'application/pdf') {
      console.log('📄 Extracting text from PDF...');
      const text = await extractPDFText(buffer);

      if (!text || text.trim().length === 0) {
        throw new Error('PDF contains no extractable text. It may be image-based — try a DOCX instead.');
      }

      return text;
    }

    // ---------- DOCX ----------
    if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      console.log('📝 Extracting text from DOCX...');
      const result = await mammoth.extractRawText({ buffer });

      if (!result?.value || result.value.trim().length === 0) {
        throw new Error('DOCX contains no extractable text');
      }

      return result.value;
    }

    // ---------- TXT ----------
    if (mimetype === 'text/plain') {
      console.log('📃 Extracting text from TXT...');
      const text = buffer.toString('utf-8');

      if (!text.trim()) {
        throw new Error('TXT file is empty');
      }

      return text;
    }

    throw new Error('Unsupported file type. Upload PDF, DOCX, or TXT.');

  } catch (error) {
    console.error('Text Extraction Error:', error);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
};

/**
 * Validate extracted resume text
 */
exports.validateResumeText = (text) => {
  if (!text || text.trim().length < 100) {
    throw new Error('Resume content too short. Please upload a complete resume.');
  }

  const hasName  = /[A-Z][a-z]+ [A-Z][a-z]+/.test(text);
  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text);

  if (!hasName && !hasEmail) {
    throw new Error('Resume does not appear to contain valid information.');
  }

  return true;
};