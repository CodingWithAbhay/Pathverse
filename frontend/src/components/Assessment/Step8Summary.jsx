import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { User, GraduationCap, Award, Target, Briefcase, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Step8Summary() {
  const { formData } = useAssessment();

  const renderSectionHeader = (Icon, title) => (
    <div className="flex items-center gap-2 border-b border-gray-800/80 pb-2 mb-3">
      <Icon className="h-4.5 w-4.5 text-indigo-400" />
      <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">{title}</h3>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-white tracking-tight">Review Your Profile Summary</h2>
        <p className="mt-2 text-sm text-gray-400">
          Make sure everything looks correct before submitting. Our AI mentor will use these inputs to design your custom roadmap.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1">
        {/* Profile Card */}
        <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800/80">
          {renderSectionHeader(User, 'Personal Profile')}
          <div className="space-y-1 text-sm">
            <p className="text-gray-400">Full Name:</p>
            <p className="font-semibold text-white">{formData.name || 'Not provided'}</p>
          </div>
        </div>

        {/* Education Card */}
        <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800/80">
          {renderSectionHeader(GraduationCap, 'Education')}
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-white">{formData.education.degree || 'Not provided'}</p>
            <p className="text-gray-400 text-xs">
              {formData.education.fieldOfStudy} at {formData.education.institution}
            </p>
            <p className="text-gray-400 text-[11px]">Class of {formData.education.gradYear}</p>
          </div>
        </div>

        {/* Skills Card */}
        <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800/80 md:col-span-2">
          {renderSectionHeader(Award, 'Current Skills')}
          {formData.skills.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No skills listed</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {formData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-gray-950/80 border border-gray-800/80 text-gray-300 flex items-center gap-1.5"
                >
                  <span className="font-medium text-white">{skill.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span className="text-[10px] text-indigo-300 font-semibold">{skill.level}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Career Goal Card */}
        <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800/80">
          {renderSectionHeader(Target, 'Career Goal')}
          <div className="space-y-1 text-sm">
            <p className="text-gray-400">Target Role:</p>
            <p className="font-semibold text-indigo-300">{formData.careerGoal.targetRole || 'Not provided'}</p>
            <p className="text-gray-400 text-xs mt-1">Domain: {formData.careerGoal.industry}</p>
            <p className="text-gray-400 text-xs">Timeline: {formData.careerGoal.timeline}</p>
          </div>
        </div>

        {/* Experience Card */}
        <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800/80">
          {renderSectionHeader(Briefcase, 'Experience')}
          <div className="space-y-1 text-sm">
            <p className="text-gray-400">Level: <span className="font-semibold text-white">{formData.experience.level}</span></p>
            <p className="text-gray-400 text-xs">Years of Exp: {formData.experience.years || '0'}</p>
            {formData.experience.currentRole && (
              <p className="text-gray-400 text-xs">Current/Previous Role: {formData.experience.currentRole}</p>
            )}
            {formData.experience.description && (
              <p className="text-gray-400 text-xs italic mt-1.5 line-clamp-2">"{formData.experience.description}"</p>
            )}
          </div>
        </div>

        {/* Learning Availability Card */}
        <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800/80">
          {renderSectionHeader(Clock, 'Availability')}
          <div className="space-y-1 text-sm">
            <p className="text-gray-400">Commitment:</p>
            <p className="font-semibold text-white">
              {formData.learningHours.hoursPerDay} hrs/day, {formData.learningHours.daysPerWeek} days/wk
            </p>
            <p className="text-gray-400 text-xs mt-1">Preferred Time: {formData.learningHours.preferredTime}</p>
          </div>
        </div>

        {/* Learning Style Card */}
        <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800/80">
          {renderSectionHeader(Zap, 'Learning Preference')}
          <div className="space-y-1 text-sm">
            <p className="text-gray-400">Primary Style: <span className="font-semibold text-white">{formData.learningStyle.primaryStyle}</span></p>
            <p className="text-gray-400 text-xs">Pace: {formData.learningStyle.pace}</p>
            <p className="text-gray-400 text-xs">
              Formats: {formData.learningStyle.resources?.join(', ') || 'Any'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
