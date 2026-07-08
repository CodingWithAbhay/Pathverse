import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { Briefcase, UserCheck, RefreshCw, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const EXPERIENCE_LEVELS = [
  {
    id: 'Entry',
    title: 'Beginner / Entry-level',
    desc: 'Student, fresher, or less than 1 year of industry experience',
    icon: UserCheck
  },
  {
    id: 'Mid',
    title: 'Mid-level Professional',
    desc: '1 to 4 years of active industry experience looking to level up',
    icon: Briefcase
  },
  {
    id: 'Senior',
    title: 'Senior Professional',
    desc: '5+ years of experience targeting advanced management or technical roles',
    icon: Briefcase
  },
  {
    id: 'Career Changer',
    title: 'Career Changer',
    desc: 'Transitioning from a completely different domain or industry',
    icon: RefreshCw
  }
];

export default function Step5Experience() {
  const { formData, updateFormData, errors } = useAssessment();
  const exp = formData.experience;

  const handleChange = (field, val) => {
    updateFormData('experience', { [field]: val });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-white tracking-tight">Tell us about your experience</h2>
        <p className="mt-2 text-sm text-gray-400">
          We tailor roadmaps differently for freshers vs. senior professionals or career switchers.
        </p>
      </div>

      <div className="space-y-4">
        {/* Experience level card selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Current Experience Level
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EXPERIENCE_LEVELS.map((lvl) => {
              const Icon = lvl.icon;
              const isSelected = exp.level === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => handleChange('level', lvl.id)}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/20 text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'border-gray-800 bg-gray-900/30 text-gray-400 hover:border-gray-700 hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg mt-0.5 ${isSelected ? 'bg-indigo-600/20 text-indigo-400' : 'bg-gray-800 text-gray-400'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-gray-200'}`}>{lvl.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-normal">{lvl.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Years of experience */}
          <div className="space-y-2">
            <label htmlFor="years" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Years of Experience (Numeric)
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Briefcase className="h-5 w-5 text-gray-500" aria-hidden="true" />
              </div>
              <input
                type="number"
                step="0.5"
                name="years"
                id="years"
                min="0"
                max="50"
                className={`block w-full rounded-xl border pl-11 pr-4 py-3 bg-gray-900/60 text-white placeholder-gray-500 focus:outline-none transition-all duration-200 ${
                  errors.years
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
                placeholder="e.g., 2.5 (Use 0 for freshers)"
                value={exp.years}
                onChange={(e) => handleChange('years', e.target.value)}
                aria-invalid={errors.years ? 'true' : 'false'}
              />
            </div>
            {errors.years && <p className="text-xs text-red-500">{errors.years}</p>}
          </div>

          {/* Current Role */}
          <div className="space-y-2">
            <label htmlFor="currentRole" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              {exp.level === 'Career Changer' ? 'Current/Previous Role' : 'Current Job Title'}
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <UserCheck className="h-5 w-5 text-gray-500" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="currentRole"
                id="currentRole"
                className="block w-full rounded-xl border border-gray-800 pl-11 pr-4 py-3 bg-gray-900/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                placeholder="e.g., Student, Marketing Executive, QA Specialist"
                value={exp.currentRole}
                onChange={(e) => handleChange('currentRole', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Short description */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Tell us about your background & key projects (Optional)
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute top-3 left-4 pointer-events-none">
              <FileText className="h-5 w-5 text-gray-500" aria-hidden="true" />
            </div>
            <textarea
              name="description"
              id="description"
              rows={2}
              className="block w-full rounded-xl border border-gray-800 pl-11 pr-4 py-3 bg-gray-900/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-none"
              placeholder="e.g., I built a personal portfolio and a weather app using basic JavaScript. I want to transition to professional SaaS work."
              value={exp.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
