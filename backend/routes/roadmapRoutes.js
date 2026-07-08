import express from 'express';
import { generateRoadmap, updateRoadmapProgress } from '../controllers/roadmapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Define POST route to trigger the AI roadmap engine
router.post('/generate', generateRoadmap);

// Define PUT route to update roadmap progress indicators
router.put('/:roadmapId/progress', protect, updateRoadmapProgress);

export default router;
