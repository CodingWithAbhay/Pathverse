import express from 'express';
import { analyzeResume, upload } from '../controllers/resumeController.js';

const router = express.Router();

// Route accepts file uploads on key "resume" and targetGoal in request body
router.post('/analyze', upload.single('resume'), analyzeResume);

export default router;
