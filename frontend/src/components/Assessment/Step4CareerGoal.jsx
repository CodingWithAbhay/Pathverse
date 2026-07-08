import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { Target, Landmark, Hourglass, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const SUGGESTED_ROLES = [
  'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
  'Data Scientist', 'Product Designer (UI/UX)', 'DevOps Engineer',
  'Mobile App Developer', 'AI/ML Engineer', 'Product Manager'
];

export default function Step4CareerGoal() {
  const { formData, updateFormData, errors } = useAssessment();
  const goal = formData.careerGoal;

  const handleChange = (field, val) => {
    updateFormData('careerGoal', { [field]: val });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-white tracking-tight">What is your career goal?</h2>
        <p className="mt-2 text-sm text-gray-400">
          This is the destination of your learning path. We will reverse-engineer a roadmap from this goal.
        </p>
      </div>

      <div className="space-y-4">
        {/* Target Career Role */}
        <div className="space-y-2">
          <label htmlFor="targetRole" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Target Career Role
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Target className="h-5 w-5 text-gray-500" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="targetRole"
              id="targetRole"
              className={`block w-full rounded-xl border pl-11 pr-4 py-3 bg-gray-900/60 text-white placeholder-gray-500 focus:outline-none transition-all duration-200 ${
                errors.targetRole
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
              placeholder="e.g., Senior Full Stack Developer"
              value={goal.targetRole}
              onChange={(e) => handleChange('targetRole', e.target.value)}
              aria-invalid={errors.targetRole ? 'true' : 'false'}
            />
          </div>
          {errors.targetRole && <p className="text-xs text-red-500">{errors.targetRole}</p>}
          
          {/* Quick recommendations */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {SUGGESTED_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleChange('targetRole', role)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all duration-150 cursor-pointer ${
                  goal.targetRole.toLowerCase() === role.toLowerCase()
                    ? 'border-indigo-500 bg-indigo-950/20 text-indigo-300'
                    : 'border-gray-800 bg-gray-900/40 text-gray-400 hover:border-gray-700 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Industry / Domain */}
        <div className="space-y-2">
          <label htmlFor="industry" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Industry / Domain
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Landmark className="h-5 w-5 text-gray-500" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="industry"
              id="industry"
              className={`block w-full rounded-xl border pl-11 pr-4 py-3 bg-gray-900/60 text-white placeholder-gray-500 focus:outline-none transition-all duration-200 ${
                errors.industry
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
              placeholder="e.g., FinTech, Web3, SaaS, Healthcare, E-Commerce"
              value={goal.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              aria-invalid={errors.industry ? 'true' : 'false'}
            />
          </div>
          {errors.industry && <p className="text-xs text-red-500">{errors.industry}</p>}
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Target Completion Timeline
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {['3 months', '6 months', '1 year', '2+ years'].map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => handleChange('timeline', time)}
                className={`py-3 px-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  goal.timeline === time
                    ? 'border-indigo-500 bg-indigo-950/20 text-indigo-300 ring-2 ring-indigo-500/20'
                    : 'border-gray-800 bg-gray-900/30 text-gray-400 hover:border-gray-700 hover:text-white'
                }`}
              >
                <Hourglass className={`h-4 w-4 ${goal.timeline === time ? 'text-indigo-400' : 'text-gray-500'}`} />
                <span className="text-sm font-medium">{time}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
