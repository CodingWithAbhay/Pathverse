import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * Generate a JWT signed token.
 *
 * @param {string} id - The MongoDB User ID.
 * @returns {string} The signed JWT token string.
 */
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'fallback_jwt_secret_key_string';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

/**
 * Register a new user profile
 * POST /api/auth/register
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Validation Error', message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Validation Error', message: 'Password must be at least 6 characters long.' });
    }

    // Check if email already registered
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ error: 'Conflict Error', message: 'A user with this email address already exists.' });
    }

    // Create user. Pre-save hook hashes the password.
    const user = await User.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({
      error: 'Registration Failed',
      message: error.message || 'An unexpected error occurred during user registration.',
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Validation Error', message: 'Email and password are required.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password.' });
    }

    // Verify password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password.' });
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      error: 'Login Failed',
      message: error.message || 'An unexpected error occurred during login.',
    });
  }
};

/**
 * Retrieve current user profile details
 * GET /api/auth/profile
 */
export const getUserProfile = async (req, res) => {
  try {
    // req.user has already been set by the protect middleware
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Not Found', message: 'User profile not found.' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return res.status(500).json({
      error: 'Query Failed',
      message: error.message || 'Failed to retrieve user profile data.',
    });
  }
};

/**
 * Update user profile details
 * PUT /api/auth/profile
 */
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'Not Found', message: 'User profile not found.' });
    }

    const { name, email, password, careerGoal, learningHours, learningStyle, experience, currentSkills } = req.body;

    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(409).json({ error: 'Conflict Error', message: 'A user with this email address already exists.' });
      }
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (password) user.password = password; // Pre-save pre-hook will automatically hash it
    if (careerGoal !== undefined) user.careerGoal = careerGoal;
    if (learningHours !== undefined) user.learningHours = Number(learningHours);
    if (learningStyle !== undefined) user.learningStyle = learningStyle;
    if (experience !== undefined) user.experience = experience;
    if (currentSkills !== undefined) user.currentSkills = currentSkills;

    const updatedUser = await user.save();
    
    // Exclude password in return
    const returnUser = await User.findById(updatedUser._id).select('-password');
    return res.status(200).json(returnUser);

  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({
      error: 'Update Failed',
      message: error.message || 'An unexpected error occurred during profile update.',
    });
  }
};
