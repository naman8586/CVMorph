const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');
require('dotenv').config();

// Initialize AI clients
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) 
  : null;

const groq = process.env.GROQ_API_KEY 
  ? new Groq({ apiKey: process.env.GROQ_API_KEY }) 
  : null;

/**
 * Unified AI client with automatic fallback
 * Priority: Gemini (primary) → Groq (fallback)
 */
const aiClient = {

  /**
   * Generate AI response with automatic fallback
   * @param {string} prompt - The prompt to send to AI
   * @returns {Promise<string>} - AI response text
   */
  generate: async (prompt) => {
    
    // Strategy 1: Try Gemini first
    if (genAI && process.env.GEMINI_API_KEY) {
      try {
        console.log('🤖 Attempting Gemini AI...');
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-2.5-flash',
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192, // Increased from 2048
            topP: 0.95,
            topK: 40,
          }
        });
        
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        
        // Validate response is not empty
        if (!text || text.trim().length === 0) {
          console.warn('⚠️  Gemini returned empty response');
          throw new Error('Empty response from Gemini');
        }
        
        console.log('✅ Gemini AI succeeded');
        console.log('📊 Response length:', text.length, 'characters');
        return text;
        
      } catch (geminiError) {
        console.warn('⚠️  Gemini AI failed:', geminiError.message);
        
        // Check if it's a rate limit or quota error
        if (geminiError.message.includes('quota') || 
            geminiError.message.includes('rate limit') ||
            geminiError.message.includes('429')) {
          console.log('📊 Gemini quota exceeded, falling back to Groq...');
        } else if (geminiError.message.includes('Empty response')) {
          console.log('🔄 Gemini returned empty, trying Groq...');
        } else {
          console.log('🔄 Gemini error, trying Groq fallback...');
        }
      }
    } else {
      console.log('⚠️  Gemini API key not configured');
    }

    // Strategy 2: Fallback to Groq
    if (groq && process.env.GROQ_API_KEY) {
      try {
        console.log('🤖 Attempting Groq AI (fallback)...');
        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { 
              role: 'system',
              content: 'You are a helpful assistant that returns ONLY valid JSON responses with no additional text.'
            },
            { 
              role: 'user', 
              content: prompt 
            }
          ],
          temperature: 0.7,
          max_tokens: 8192, // Increased
          top_p: 0.95,
        });
        
        const text = completion.choices[0].message.content;
        
        // Validate response
        if (!text || text.trim().length === 0) {
          throw new Error('Empty response from Groq');
        }
        
        console.log('✅ Groq AI succeeded (fallback)');
        console.log('📊 Response length:', text.length, 'characters');
        return text;
        
      } catch (groqError) {
        console.error('❌ Groq AI also failed:', groqError.message);
        throw new Error('All AI providers failed. Please try with a shorter resume or try again later.');
      }
    } else {
      console.log('⚠️  Groq API key not configured');
    }

    // Both failed or not configured
    throw new Error('No AI providers available. Please configure GEMINI_API_KEY or GROQ_API_KEY in .env file.');
  },

  /**
   * Check status of AI providers
   * @returns {Object} - Status of each provider
   */
  status: () => {
    return {
      gemini: {
        configured: !!process.env.GEMINI_API_KEY,
        available: !!genAI
      },
      groq: {
        configured: !!process.env.GROQ_API_KEY,
        available: !!groq
      }
    };
  },

  /**
   * Get current primary provider
   * @returns {string} - Name of primary provider
   */
  getPrimaryProvider: () => {
    if (genAI && process.env.GEMINI_API_KEY) return 'Gemini';
    if (groq && process.env.GROQ_API_KEY) return 'Groq';
    return 'None';
  },

  /**
   * Get fallback provider
   * @returns {string} - Name of fallback provider
   */
  getFallbackProvider: () => {
    if (groq && process.env.GROQ_API_KEY) return 'Groq';
    return 'None';
  }
};

// Log AI configuration on startup
console.log('\n🤖 AI Configuration:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Primary:  ${aiClient.getPrimaryProvider()}`);
console.log(`Fallback: ${aiClient.getFallbackProvider()}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

module.exports = aiClient;