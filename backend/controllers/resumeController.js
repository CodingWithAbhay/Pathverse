import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import { buildResumePrompt } from '../prompts/resumePrompt.js';
import { getResumeAnalysisFromAI } from '../services/resumeService.js';
import { calculateATSScore } from '../services/atsScoringService.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Configure Multer to read uploaded files into memory buffers
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are supported for resume upload.'));
    }
  },
});

/**
 * Controller handler for POST /api/resume/analyze
 */
export const analyzeResume = async (req, res) => {
  try {
    const { targetGoal, jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({
        error: 'Upload Error',
        message: 'No resume file uploaded. Please upload a PDF file under the key "resume".',
      });
    }

        // --- 1. Extract text from PDF buffer using pdf-parse ---
    let pdfText = '';
    try {
      const parser = new PDFParse({ data: req.file.buffer });
      const textResult = await parser.getText();
      pdfText = textResult.text;
      await parser.destroy();
    } catch (parseErr) {
      console.error('PDF text extraction failed:', parseErr);
      return res.status(422).json({
        error: 'Extraction Failed',
        message: 'Could not extract text content from the uploaded PDF. Ensure the file is not corrupted or password-protected.',
      });
    }

    if (!pdfText || !pdfText.trim()) {
      return res.status(400).json({
        error: 'Extraction Failed',
        message: 'The uploaded PDF appears to be empty. Please upload a text-based PDF.',
      });
    }

    // Check for minimum text content
    if (pdfText.trim().length < 30) {
      return res.status(400).json({
        error: 'Insufficient Content',
        message: 'The resume contains too little text for a reliable analysis. Please upload a complete resume.',
      });
    }

    const resolvedGoal = targetGoal || 'Software Engineer';

    // --- 2. Calculate deterministic ATS Score ---
    let atsResult;
    try {
      atsResult = calculateATSScore(pdfText, resolvedGoal, jobDescription || null);
    } catch (atsErr) {
      console.error('ATS scoring calculation failed:', atsErr);
      return res.status(500).json({
        error: 'Scoring Failed',
        message: 'The ATS scoring engine encountered an error. Please try again.',
      });
    }

    // --- 3. Call AI Service for qualitative analysis ---
    let aiResult = {};
    try {
      const promptText = buildResumePrompt(pdfText, resolvedGoal);
      aiResult = await getResumeAnalysisFromAI(promptText);
    } catch (aiErr) {
      console.error('AI qualitative analysis failed (non-critical):', aiErr.message);
      // AI analysis is supplementary — we can still return the deterministic ATS score
      aiResult = {
        inferredGoal: resolvedGoal,
        summary: 'AI qualitative analysis is temporarily unavailable. Your ATS score has been calculated successfully.',
        strengths: [],
        matchedSkills: [],
        skillGaps: [],
        recommendedProjects: [],
        recommendedCertifications: [],
        improvementTips: [],
      };
    }

    // --- 4. Merge ATS scoring with AI analysis ---
    const analysisResult = {
      // Deterministic ATS score (from scoring engine)
      atsScore: atsResult.atsScore,
      scoreBreakdown: atsResult.scoreBreakdown,
      matchedKeywords: atsResult.matchedKeywords,
      missingKeywords: atsResult.missingKeywords,
      strengths: atsResult.strengths,
      weaknesses: atsResult.weaknesses,
      suggestions: atsResult.suggestions,

      // AI qualitative analysis
      inferredGoal: aiResult.inferredGoal || resolvedGoal,
      summary: aiResult.summary || '',
      matchedSkills: aiResult.matchedSkills || [],
      skillGaps: aiResult.skillGaps || [],
      recommendedProjects: aiResult.recommendedProjects || [],
      recommendedCertifications: aiResult.recommendedCertifications || [],
      improvementTips: aiResult.improvementTips || [],

      // Legacy compatibility — frontend may still reference `score`
      score: atsResult.atsScore,
    };

    // Add metadata for history storage
    const resumeAnalysisRecord = {
      ...analysisResult,
      fileName: req.file.originalname,
    };

    // --- 5. Optional: Persist Resume Analysis under User profile in MongoDB ---
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'fallback_jwt_secret_key_string';
        const decoded = jwt.verify(token, secret);
        userId = decoded.id;
      } catch (err) {
        console.log('[Resume Persistence] Optional authentication token ignored:', err.message);
      }
    }

    if (userId) {
      try {
        await User.findByIdAndUpdate(userId, {
          $push: { resumes: resumeAnalysisRecord }
        });
        console.log(`[Resume Persistence] Saved resume analysis history for user ID: ${userId}`);
      } catch (saveErr) {
        console.error('[Resume Persistence] Failed to save resume analysis history:', saveErr.message);
      }
    }

    // --- 6. Return JSON response ---
    return res.status(200).json(analysisResult);

  } catch (error) {
    console.error('Error analyzing resume:', error);
    const statusCode = error.message.includes('API key is missing') ? 401 : 500;
    return res.status(statusCode).json({
      error: 'Analysis Failed',
      message: error.message || 'An unexpected error occurred during resume analysis.',
    });
  }
};
