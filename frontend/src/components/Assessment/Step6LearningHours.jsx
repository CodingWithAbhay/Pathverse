import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { Clock, Calendar, Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { motion } from 'framer-motion';

const TIMES_OF_DAY = [
  { id: 'Morning', label: 'Morning', icon: Sunrise, desc: '6 AM - 12 PM' },
  { id: 'Afternoon', label: 'Afternoon', icon: Sun, desc: '12 PM - 5 PM' },
  { id: 'Evening', label: 'Evening', icon: Sunset, desc: '5 PM - 10 PM' },
  { id: 'Weekend', label: 'Weekend Only', icon: Moon, desc: 'Saturdays & Sundays' }
];

export default function Step6LearningHours() {
  const { formData, updateFormData, errors } = useAssessment();
  const lh = formData.learningHours;

  const handleChange = (field, val) => {
    updateFormData('learningHours', { [field]: val });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-white tracking-tight">Your Learning Availability</h2>
        <p className="mt-2 text-sm text-gray-400">
          How much time can you realistically dedicate to studying? We will structure your weekly tasks based on this.
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hours per day */}
          <div className="space-y-2">
            <label htmlFor="hoursPerDay" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Study Hours Per Day
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Clock className="h-5 w-5 text-gray-500" aria-hidden="true" />
              </div>
              <input
                type="number"
                step="0.5"
                name="hoursPerDay"
                id="hoursPerDay"
                min="0.5"
                max="24"
                className={`block w-full rounded-xl border pl-11 pr-4 py-3 bg-gray-900/60 text-white placeholder-gray-500 focus:outline-none transition-all duration-200 ${
                  errors.hoursPerDay
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
                placeholder="e.g., 2 or 3.5"
                value={lh.hoursPerDay}
                onChange={(e) => handleChange('hoursPerDay', e.target.value)}
                aria-invalid={errors.hoursPerDay ? 'true' : 'false'}
              />
            </div>
            {errors.hoursPerDay && <p className="text-xs text-red-500">{errors.hoursPerDay}</p>}
          </div>

          {/* Days per week */}
          <div className="space-y-2">
            <label htmlFor="daysPerWeek" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Study Days Per Week
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Calendar className="h-5 w-5 text-gray-500" aria-hidden="true" />
              </div>
              <select
                name="daysPerWeek"
                id="daysPerWeek"
                className="block w-full rounded-xl border border-gray-800 pl-11 pr-4 py-3 bg-gray-900/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 appearance-none"
                value={lh.daysPerWeek}
                onChange={(e) => handleChange('daysPerWeek', e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <option key={day} value={day} className="bg-gray-950">
                    {day} {day === 1 ? 'day' : 'days'} per week
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Preferred time of day */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Preferred Time to Learn
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {TIMES_OF_DAY.map((time) => {
              const Icon = time.icon;
              const isSelected = lh.preferredTime === time.id;
              return (
                <button
                  key={time.id}
                  type="button"
                  onClick={() => handleChange('preferredTime', time.id)}
                  className={`py-3.5 px-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/20 text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'border-gray-800 bg-gray-900/30 text-gray-400 hover:border-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isSelected ? 'text-indigo-400' : 'text-gray-500'}`} />
                  <div className="text-center">
                    <span className="block text-xs font-bold text-gray-200">{time.label}</span>
                    <span className="block text-[9px] text-gray-500 mt-0.5">{time.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
