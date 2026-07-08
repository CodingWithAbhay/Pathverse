import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Schema for storing history of generated roadmaps
const roadmapSchema = new mongoose.Schema({
  careerGoal: String,
  estimatedTimeline: String,
  weeklyCommitment: String,
  monthlyRoadmap: mongoose.Schema.Types.Mixed, // Storing monthlyRoadmap array structures
  recommendedProjects: mongoose.Schema.Types.Mixed,
  learningResources: mongoose.Schema.Types.Mixed,
  recommendedCertifications: mongoose.Schema.Types.Mixed,
  tips: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Schema for storing history of resume analyses
const resumeSchema = new mongoose.Schema({
  score: Number, // Legacy field — kept for backward compatibility
  atsScore: Number,
  scoreBreakdown: mongoose.Schema.Types.Mixed,
  inferredGoal: String,
  summary: String,
  strengths: [String],
  weaknesses: [String],
  matchedSkills: [String],
  matchedKeywords: [String],
  missingKeywords: [String],
  suggestions: [String],
  skillGaps: mongoose.Schema.Types.Mixed,
  recommendedProjects: mongoose.Schema.Types.Mixed,
  recommendedCertifications: mongoose.Schema.Types.Mixed,
  improvementTips: mongoose.Schema.Types.Mixed,
  fileName: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  onboardingCompleted: {
    type: Boolean,
    default: false,
  },
  careerGoal: {
    type: String,
    default: '',
  },
  learningHours: {
    type: Number,
    default: 0,
  },
  learningStyle: {
    type: String,
    default: '',
  },
  experience: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  currentSkills: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  roadmaps: [roadmapSchema],
  resumes: [resumeSchema],
}, {
  timestamps: true,
});

// Hash password before saving user
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
