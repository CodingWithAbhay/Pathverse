import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Sends the resume prompt to the Google Gemini API and returns the parsed JSON response.
 *
 * @param {string} promptText - The prompt including the resume text.
 * @returns {Promise<Object>} The parsed JSON resume analysis details.
 */
export const getResumeAnalysisFromAI = async (promptText) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Google Gemini API key is missing. Please configure GEMINI_API_KEY in your environment.');
  }

  // Initialize official Gemini Gen AI SDK client
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
      config: {
        systemInstruction: 'You are an elite corporate recruitment expert that only outputs raw valid JSON.',
        responseMimeType: 'application/json',
        temperature: 0.5,
      }
    });

    let rawContent = response.text || '';
    rawContent = rawContent.trim();

    // Clean up potential markdown wrappers if present
    if (rawContent.startsWith('```json')) {
      rawContent = rawContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (rawContent.startsWith('```')) {
      rawContent = rawContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    return JSON.parse(rawContent);

  } catch (error) {
    console.error('Error in Gemini Resume service analysis:', error.message || error);
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse Resume Gemini output as JSON: ${error.message}`);
    }
    throw error;
  }
};
