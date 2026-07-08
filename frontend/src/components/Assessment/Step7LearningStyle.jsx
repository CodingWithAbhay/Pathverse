import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { BookOpen, Video, FileText, Users, Zap, Gauge, Library } from 'lucide-react';
import { motion } from 'framer-motion';

const LEARNING_STYLES = [
  {
    id: 'Practical',
    title: 'Practical & Project-based',
    desc: 'Learn by coding, building real apps, and writing scripts',
    icon: Zap
  },
  {
    id: 'Visual',
    title: 'Visual / Video-driven',
    desc: 'Learn through video guides, graphs, slides, and flowcharts',
    icon: Video
  },
  {
    id: 'Theoretical',
    title: 'Theoretical / Written',
    desc: 'Read documentations, blogs, research papers, and technical books',
    icon: FileText
  },
  {
    id: 'Mentorship',
    title: 'Mentorship & Interactive',
    desc: 'Guided reviews, peer coding, workshops, and cohort tasks',
    icon: Users
  }
];

const PACING_OPTIONS = [
  { id: 'Fast', label: 'Fast-paced', desc: 'Intensive bootcamps style' },
  { id: 'Moderate', label: 'Balanced / Moderate', desc: 'Standard paced study' },
  { id: 'Self-paced', label: 'Self-paced / Flexible', desc: 'Learn whenever possible' }
];

const RESOURCE_TYPES = [
  { id: 'Videos', label: 'Video Tutorials', icon: Video },
  { id: 'Documentation', label: 'Official Docs & API Ref', icon: FileText },
  { id: 'Articles', label: 'Tech Blogs & Written Guides', icon: BookOpen },
  { id: 'Books', label: 'In-depth Textbooks', icon: Library }
];

export default function Step7LearningStyle() {
  const { formData, updateFormData, errors } = useAssessment();
  const style = formData.learningStyle;

  const handleChange = (field, val) => {
    updateFormData('learningStyle', { [field]: val });
  };

  const toggleResource = (resourceId) => {
    const current = style.resources || [];
    const updated = current.includes(resourceId)
      ? current.filter(r => r !== resourceId)
      : [...current, resourceId];
    handleChange('resources', updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-white tracking-tight">Preferred Learning Style</h2>
        <p className="mt-2 text-sm text-gray-400">
          Tell us how you absorb information best so we can suggest appropriate study links and materials.
        </p>
      </div>

      <div className="space-y-5">
        {/* Primary Learning Style */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Primary Study Style
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LEARNING_STYLES.map((item) => {
              const Icon = item.icon;
              const isSelected = style.primaryStyle === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleChange('primaryStyle', item.id)}
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
                    <h3 className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-gray-200'}`}>{item.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-normal">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.primaryStyle && <p className="text-xs text-red-500">{errors.primaryStyle}</p>}
        </div>

        {/* Pacing */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Preferred Pace
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {PACING_OPTIONS.map((opt) => {
              const isSelected = style.pace === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleChange('pace', opt.id)}
                  className={`py-3 px-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/20 text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'border-gray-800 bg-gray-900/30 text-gray-400 hover:border-gray-700 hover:text-white'
                  }`}
                >
                  <Gauge className={`h-4 w-4 ${isSelected ? 'text-indigo-400' : 'text-gray-500'}`} />
                  <div className="text-center">
                    <span className="block text-xs font-bold text-gray-200">{opt.label}</span>
                    <span className="block text-[9px] text-gray-500 mt-0.5">{opt.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred resource types */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Preferred Learning Resources (Multi-select)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {RESOURCE_TYPES.map((res) => {
              const Icon = res.icon;
              const isSelected = (style.resources || []).includes(res.id);
              return (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => toggleResource(res.id)}
                  className={`py-3 px-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/20 text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'border-gray-800 bg-gray-900/30 text-gray-400 hover:border-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? 'text-indigo-400' : 'text-gray-500'}`} />
                  <span className="text-xs font-semibold text-center text-gray-200">{res.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
