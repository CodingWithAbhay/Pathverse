import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { GraduationCap, School, Calendar, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Step2Education() {
  const { formData, updateFormData, errors } = useAssessment();
  const edu = formData.education;

  const handleChange = (field, val) => {
    updateFormData('education', { [field]: val });
  };

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear + 6; y >= currentYear - 30; y--) {
    years.push(y);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-white tracking-tight">Your Educational Background</h2>
        <p className="mt-2 text-sm text-gray-400">
          Provide your current or highest education level so we can pitch recommendations at the right level.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Degree */}
        <div className="space-y-2">
          <label htmlFor="degree" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Degree / Qualification
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <GraduationCap className="h-5 w-5 text-gray-500" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="degree"
              id="degree"
              className={`block w-full rounded-xl border pl-11 pr-4 py-3 bg-gray-900/60 text-white placeholder-gray-500 focus:outline-none transition-all duration-200 ${
                errors.degree
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
              placeholder="e.g., Bachelor of Technology (B.Tech)"
              value={edu.degree}
              onChange={(e) => handleChange('degree', e.target.value)}
              aria-invalid={errors.degree ? 'true' : 'false'}
            />
          </div>
          {errors.degree && <p className="text-xs text-red-500">{errors.degree}</p>}
        </div>

        {/* Field of Study */}
        <div className="space-y-2">
          <label htmlFor="fieldOfStudy" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Field of Study
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <FileSpreadsheet className="h-5 w-5 text-gray-500" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="fieldOfStudy"
              id="fieldOfStudy"
              className={`block w-full rounded-xl border pl-11 pr-4 py-3 bg-gray-900/60 text-white placeholder-gray-500 focus:outline-none transition-all duration-200 ${
                errors.fieldOfStudy
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
              placeholder="e.g., Computer Science"
              value={edu.fieldOfStudy}
              onChange={(e) => handleChange('fieldOfStudy', e.target.value)}
              aria-invalid={errors.fieldOfStudy ? 'true' : 'false'}
            />
          </div>
          {errors.fieldOfStudy && <p className="text-xs text-red-500">{errors.fieldOfStudy}</p>}
        </div>

        {/* Institution */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="institution" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Institution / University
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <School className="h-5 w-5 text-gray-500" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="institution"
              id="institution"
              className={`block w-full rounded-xl border pl-11 pr-4 py-3 bg-gray-900/60 text-white placeholder-gray-500 focus:outline-none transition-all duration-200 ${
                errors.institution
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
              placeholder="e.g., Delhi Technological University"
              value={edu.institution}
              onChange={(e) => handleChange('institution', e.target.value)}
              aria-invalid={errors.institution ? 'true' : 'false'}
            />
          </div>
          {errors.institution && <p className="text-xs text-red-500">{errors.institution}</p>}
        </div>

        {/* Graduation Year */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="gradYear" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Graduation / Expected Graduation Year
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Calendar className="h-5 w-5 text-gray-500" aria-hidden="true" />
            </div>
            <select
              name="gradYear"
              id="gradYear"
              className={`block w-full rounded-xl border pl-11 pr-4 py-3 bg-gray-900/60 text-white placeholder-gray-500 focus:outline-none transition-all duration-200 appearance-none ${
                errors.gradYear
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
              value={edu.gradYear}
              onChange={(e) => handleChange('gradYear', e.target.value)}
              aria-invalid={errors.gradYear ? 'true' : 'false'}
            >
              <option value="" disabled className="bg-gray-950 text-gray-400">Select Graduation Year</option>
              {years.map((y) => (
                <option key={y} value={y} className="bg-gray-950 text-white">
                  {y}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.gradYear && <p className="text-xs text-red-500">{errors.gradYear}</p>}
        </div>
      </div>
    </motion.div>
  );
}
