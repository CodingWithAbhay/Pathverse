import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Step1Personal() {
  const { formData, updateFormData, errors } = useAssessment();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-white tracking-tight">Let's start with your name</h2>
        <p className="mt-2 text-sm text-gray-400">
          This helps us personalize your career roadmap and mentorship dashboard.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="name" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
          Full Name
        </label>
        <div className="relative rounded-xl shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <User className="h-5 w-5 text-gray-500" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="name"
            id="name"
            className={`block w-full rounded-xl border pl-11 pr-4 py-3.5 bg-gray-900/60 text-white placeholder-gray-500 focus:outline-none transition-all duration-200 ${
              errors.name
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                : 'border-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
            }`}
            placeholder="e.g. John Smith"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            required
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
        </div>
        {errors.name && (
          <p className="mt-2 text-xs text-red-500 font-medium" id="name-error">
            {errors.name}
          </p>
        )}
      </div>
    </motion.div>
  );
}
