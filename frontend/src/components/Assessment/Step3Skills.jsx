import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { Plus, X, Award, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTIONS = [
  'JavaScript', 'Python', 'React', 'Node.js', 
  'HTML & CSS', 'SQL', 'Git & GitHub', 'Figma', 
  'TypeScript', 'C++', 'Java', 'UI/UX Design', 
  'Project Management', 'Data Analysis'
];

export default function Step3Skills() {
  const { formData, updateFormData, errors } = useAssessment();
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');

  const addSkill = (name) => {
    const cleanedName = name.trim();
    if (!cleanedName) return;

    // Avoid duplicates
    if (formData.skills.some(s => s.name.toLowerCase() === cleanedName.toLowerCase())) {
      setNewSkillName('');
      return;
    }

    const updated = [...formData.skills, { name: cleanedName, level: newSkillLevel }];
    updateFormData('skills', updated);
    setNewSkillName('');
  };

  const removeSkill = (indexToRemove) => {
    const updated = formData.skills.filter((_, idx) => idx !== indexToRemove);
    updateFormData('skills', updated);
  };

  const handleLevelChange = (index, level) => {
    const updated = formData.skills.map((s, idx) => {
      if (idx === index) {
        return { ...s, level };
      }
      return s;
    });
    updateFormData('skills', updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-white tracking-tight">Add Your Current Skills</h2>
        <p className="mt-2 text-sm text-gray-400">
          Tell us what you already know. This helps us structure your learning path so you don't repeat the basics.
        </p>
      </div>

      {/* Input section */}
      <div className="space-y-3">
        <div className="flex gap-2 flex-col sm:flex-row">
          <input
            type="text"
            className="flex-1 rounded-xl border border-gray-800 bg-gray-900/60 text-white placeholder-gray-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
            placeholder="Type a skill (e.g., Python, Figma...)"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill(newSkillName);
              }
            }}
          />
          <div className="flex gap-2">
            <select
              className="rounded-xl border border-gray-800 bg-gray-900/60 text-white px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
            >
              <option value="Beginner" className="bg-gray-950">Beginner</option>
              <option value="Intermediate" className="bg-gray-950">Intermediate</option>
              <option value="Advanced" className="bg-gray-950">Advanced</option>
            </select>
            <button
              type="button"
              onClick={() => addSkill(newSkillName)}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 transition-colors flex items-center gap-1 font-medium shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </div>
        {errors.skills && <p className="text-xs text-red-500">{errors.skills}</p>}
      </div>

      {/* Suggestions */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
          <Lightbulb className="h-3.5 w-3.5 text-yellow-500" /> Popular suggestions
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((skill) => {
            const alreadyAdded = formData.skills.some(s => s.name.toLowerCase() === skill.toLowerCase());
            return (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                disabled={alreadyAdded}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer ${
                  alreadyAdded
                    ? 'border-gray-900 bg-gray-950 text-gray-600 cursor-not-allowed'
                    : 'border-gray-800 bg-gray-900/40 text-gray-300 hover:border-indigo-500 hover:text-white hover:bg-indigo-950/20'
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Skills List */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
          <Award className="h-4 w-4 text-indigo-400" /> Added Skills ({formData.skills.length})
        </span>
        
        {formData.skills.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-gray-800 rounded-xl bg-gray-900/10 text-gray-500 text-sm">
            No skills added yet. Add some to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <AnimatePresence>
              {formData.skills.map((skill, index) => (
                <motion.div
                  key={`${skill.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-900/45 border border-gray-800/80 hover:border-gray-700/80 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{skill.name}</span>
                    <div className="flex gap-1.5 mt-1">
                      {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleLevelChange(index, lvl)}
                          className={`text-[10px] px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                            skill.level === lvl
                              ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-300 font-semibold'
                              : 'bg-transparent text-gray-500 hover:text-gray-400'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={`Remove ${skill.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
