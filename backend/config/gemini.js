const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not set. Get free key from: https://makersuite.google.com/app/apikey');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use gemini-2.5-flash (the correct model name for your API key)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

module.exports = { model, genAI };