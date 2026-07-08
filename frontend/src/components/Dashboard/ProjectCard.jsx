import React from 'react';
import { ExternalLink, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProjectCard({ project }) {
  if (!project) return null;

  const title   = typeof project === 'object' ? (project.title || project.name || 'Untitled Project') : project;
  const desc    = typeof project === 'object' ? (project.description || project.desc || '') : '';
  const link    = typeof project === 'object' ? (project.link || project.url || null) : null;
  const difficulty = typeof project === 'object' ? project.difficulty : null;

  const difficultyColor = {
    beginner:     'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    intermediate: 'text-orange-400  bg-orange-500/10  border-orange-500/20',
    advanced:     'text-red-400     bg-red-500/10     border-red-500/20',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card rounded-xl p-4 space-y-3 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/15 flex items-center justify-center shrink-0 group-hover:bg-orange-500/15 transition-colors">
            <FolderOpen className="h-3.5 w-3.5 text-orange-400" />
          </div>
          <span className="text-xs font-bold text-white leading-snug line-clamp-2">{title}</span>
        </div>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#57534E] hover:text-orange-400 transition-colors p-1 shrink-0"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Description */}
      {desc && (
        <p className="text-xs text-[#78716C] leading-relaxed line-clamp-3">{desc}</p>
      )}

      {/* Difficulty badge */}
      {difficulty && (
        <span className={`inline-flex text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
          difficultyColor[difficulty.toLowerCase()] || 'text-[#78716C] bg-[#1C1917] border-[#292524]'
        }`}>
          {difficulty}
        </span>
      )}
    </motion.div>
  );
}
