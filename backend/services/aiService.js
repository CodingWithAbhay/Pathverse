import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Calls the Google Gemini API to generate a structured learning roadmap.
 *
 * @param {string} promptText - The compiled prompt payload.
 * @returns {Promise<Object>} The parsed JSON roadmap object.
 */
export const generateRoadmapFromAI = async (promptText) => {
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
        systemInstruction: 'You are an elite academic and professional career counselor that only outputs raw valid JSON.',
        responseMimeType: 'application/json',
        temperature: 0.7,
      }
    });

    let rawContent = response.text || '';
    rawContent = rawContent.trim();

    // Clean up potential markdown wrappers (if model adds them despite json config instructions)
    if (rawContent.startsWith('```json')) {
      rawContent = rawContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (rawContent.startsWith('```')) {
      rawContent = rawContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsedData = JSON.parse(rawContent);
    return parsedData;

  } catch (error) {
    console.error('Error in Google Gemini service roadmap generation:', error.message || error);
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse Gemini output as JSON: ${error.message}`);
    }
    throw error;
  }
};
