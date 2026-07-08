import { buildRoadmapPrompt } from '../prompts/roadmapPrompt.js';
import { generateRoadmapFromAI } from '../services/aiService.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * Controller handler for POST /api/roadmap/generate
 */
export const generateRoadmap = async (req, res) => {
  try {
    const { name, education, skills, goal, experience, hoursPerDay, learningStyle } = req.body;

    // --- 1. Input Validation ---
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Name is required and must be a string' });
    }

    if (!education || typeof education !== 'object') {
      return res.status(400).json({ error: 'Validation Error', message: 'Education details are required' });
    }
    const { degree, fieldOfStudy, institution, gradYear } = education;
    if (!degree || !fieldOfStudy || !institution || !gradYear) {
      return res.status(400).json({ error: 'Validation Error', message: 'degree, fieldOfStudy, institution, and gradYear are all required in education' });
    }

    if (!skills || (Array.isArray(skills) && skills.length === 0)) {
      return res.status(400).json({ error: 'Validation Error', message: 'Skills are required and cannot be empty' });
    }

    if (!goal || typeof goal !== 'object') {
      return res.status(400).json({ error: 'Validation Error', message: 'Career goal object is required' });
    }
    if (!goal.targetRole || !goal.industry) {
      return res.status(400).json({ error: 'Validation Error', message: 'targetRole and industry are required in career goal' });
    }

    if (!experience || typeof experience !== 'object') {
      return res.status(400).json({ error: 'Validation Error', message: 'Experience details are required' });
    }
    if (experience.years === undefined || experience.level === undefined) {
      return res.status(400).json({ error: 'Validation Error', message: 'level and years are required in experience' });
    }

    const hours = parseFloat(hoursPerDay);
    if (isNaN(hours) || hours <= 0 || hours > 24) {
      return res.status(400).json({ error: 'Validation Error', message: 'hoursPerDay must be a number between 0.5 and 24' });
    }

    if (!learningStyle || typeof learningStyle !== 'object' || !learningStyle.primaryStyle) {
      return res.status(400).json({ error: 'Validation Error', message: 'learningStyle is required and must specify primaryStyle' });
    }

    // --- 2. Build Prompt & Invoke AI Service ---
    const userData = {
      name,
      education,
      skills,
      goal,
      experience,
      hoursPerDay: hours,
      learningStyle,
    };

    const promptText = buildRoadmapPrompt(userData);
    const roadmapJSON = await generateRoadmapFromAI(promptText);

    // Format tasks to objects with unique IDs and completed boolean flags for progress tracking
    if (roadmapJSON.monthlyRoadmap && Array.isArray(roadmapJSON.monthlyRoadmap)) {
      roadmapJSON.monthlyRoadmap = roadmapJSON.monthlyRoadmap.map((monthData, mIdx) => ({
        ...monthData,
        completed: false,
        weeklyBreakdown: Array.isArray(monthData.weeklyBreakdown)
          ? monthData.weeklyBreakdown.map((weekData, wIdx) => ({
              ...weekData,
              tasks: Array.isArray(weekData.tasks)
                ? weekData.tasks.map((task, tIdx) => {
                    const taskText = typeof task === 'object' && task !== null ? task.text : task;
                    const taskCompleted = typeof task === 'object' && task !== null ? !!task.completed : false;
                    return {
                      id: `m${mIdx + 1}-w${weekData.week}-t${tIdx}`,
                      text: taskText,
                      completed: taskCompleted
                    };
                  })
                : []
            }))
          : []
      }));
    }

    // --- 3. Optional: Persist Generated Roadmap under User profile in MongoDB ---
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'fallback_jwt_secret_key_string';
        const decoded = jwt.verify(token, secret);
        userId = decoded.id;
      } catch (err) {
        console.log('[Roadmap Persistence] Optional authentication token ignored:', err.message);
      }
    }

    if (userId) {
      try {
        await User.findByIdAndUpdate(userId, {
          $push: { roadmaps: roadmapJSON },
          onboardingCompleted: true,
          careerGoal: goal.targetRole,
          learningHours: parseFloat(hoursPerDay),
          learningStyle: learningStyle.primaryStyle,
          experience: experience,
          currentSkills: skills
        });
        console.log(`[Roadmap Persistence] Saved roadmap & completed onboarding for user ID: ${userId}`);
      } catch (saveErr) {
        console.error('[Roadmap Persistence] Failed to save roadmap history:', saveErr.message);
      }
    }

    // --- 4. Return JSON Response ---
    return res.status(200).json(roadmapJSON);

  } catch (error) {
    console.error('Error generating roadmap:', error);
    const statusCode = error.message.includes('API key is missing') ? 401 : 500;
    return res.status(statusCode).json({
      error: 'Generation Failed',
      message: error.message || 'An unexpected error occurred during roadmap generation.',
    });
  }
};

/**
 * Update roadmap progress
 * PUT /api/roadmap/:roadmapId/progress
 */
export const updateRoadmapProgress = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { monthlyRoadmap } = req.body;

    if (!monthlyRoadmap || !Array.isArray(monthlyRoadmap)) {
      return res.status(400).json({ error: 'Validation Error', message: 'monthlyRoadmap array is required' });
    }

    // Find the user from the protect middleware
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'Not Found', message: 'User not found.' });
    }

    // Locate the roadmap in user's roadmaps subdocuments array
    const roadmap = user.roadmaps.id(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ error: 'Not Found', message: 'Roadmap not found or unauthorized.' });
    }

    // Update progress array
    roadmap.monthlyRoadmap = monthlyRoadmap;

    // Mark changes on parent document and save
    user.markModified('roadmaps');
    await user.save();

    // Return updated user profile metadata
    const updatedUser = await User.findById(user._id).select('-password');
    return res.status(200).json(updatedUser);

  } catch (error) {
    console.error('Error updating roadmap progress:', error);
    return res.status(500).json({
      error: 'Update Failed',
      message: error.message || 'Failed to update progress.'
    });
  }
};
