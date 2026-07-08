import React from 'react';
import { ExternalLink, BookOpen, Play, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

function getResourceIcon(resource) {
  const title = typeof resource === 'object' ? (resource.title || resource.name || '') : resource;
  const url   = typeof resource === 'object' ? (resource.url || resource.link || resource.urlDescription || '') : '';
  const lower = (title + url).toLowerCase();

  if (lower.includes('youtube') || lower.includes('video')) return Play;
  if (lower.includes('docs') || lower.includes('documentation')) return BookOpen;
  return Globe;
}

function getClickableUrl(resource, title, type, rawUrl) {
  if (!rawUrl) {
    const query = title || '';
    if (!query) return null;
    if (type?.toLowerCase() === 'video' || query.toLowerCase().includes('video') || query.toLowerCase().includes('youtube')) {
      return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    }
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }

  const trimmed = String(rawUrl).trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  const isVideo = type?.toLowerCase() === 'video' || 
                  trimmed.toLowerCase().includes('youtube') || 
                  trimmed.toLowerCase().includes('video') || 
                  title.toLowerCase().includes('video') ||
                  title.toLowerCase().includes('youtube');

  const query = `${title} ${trimmed}`.trim();
  if (isVideo) {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export default function ResourceCard({ resource }) {
  if (!resource) return null;

  const title = typeof resource === 'object' ? (resource.title || resource.name || 'Resource') : resource;
  const rawUrl = typeof resource === 'object' ? (resource.url || resource.link || resource.urlDescription || null) : resource;
  const type  = typeof resource === 'object' ? resource.type : null;

  const Icon = getResourceIcon(resource);
  const clickableUrl = getClickableUrl(resource, title, type, rawUrl);

  const cardContent = (
    <>
      {/* Icon */}
      <div className="w-7 h-7 rounded-lg bg-[#292524] border border-[#44403C] flex items-center justify-center shrink-0 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-colors">
        <Icon className="h-3.5 w-3.5 text-[#78716C] group-hover:text-orange-400 transition-colors" />
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#D6D3D1] truncate leading-snug group-hover:text-white transition-colors">{title}</p>
        {type && (
          <span className="text-[9px] text-[#57534E] uppercase tracking-wider">{type}</span>
        )}
      </div>

      {/* Link */}
      {clickableUrl && (
        <div className="text-[#44403C] group-hover:text-orange-400 transition-colors p-1 shrink-0">
          <ExternalLink className="h-3.5 w-3.5" />
        </div>
      )}
    </>
  );

  if (clickableUrl) {
    return (
      <motion.a
        href={clickableUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -1 }}
        className="flex items-center gap-3 p-3.5 rounded-xl border border-[#1C1917] bg-[#1C1917]/40 hover:border-orange-500/15 hover:bg-orange-500/3 transition-all duration-200 group cursor-pointer"
      >
        {cardContent}
      </motion.a>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className="flex items-center gap-3 p-3.5 rounded-xl border border-[#1C1917] bg-[#1C1917]/40 hover:border-orange-500/15 hover:bg-orange-500/3 transition-all duration-200 group"
    >
      {cardContent}
    </motion.div>
  );
}
