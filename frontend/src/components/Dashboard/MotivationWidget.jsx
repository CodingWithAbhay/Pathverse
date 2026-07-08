import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const motivationalMessages = [
  "Consistency beats intensity. Every task you complete today is compounding into your future.",
  "The best time to start was yesterday. The second best time is right now. Keep pushing.",
  "Skills are built through repetition. Each milestone you complete is a brick in your career foundation.",
  "Your roadmap is your contract with your future self. Honor it, task by task.",
  "Progress is not always visible, but it is always happening when you show up consistently.",
  "Every expert was once a beginner who refused to give up. You're on the right path.",
  "Focus on the process, not just the destination. The journey builds the skills, not just the goal.",
];

export default function MotivationWidget({ careerGoal, streak }) {
  const [message, setMessage] = useState('');
  const [rotating, setRotating] = useState(false);

  const getNextMessage = () => {
    const idx = Math.floor(Math.random() * motivationalMessages.length);
    setMessage(motivationalMessages[idx]);
  };

  useEffect(() => {
    getNextMessage();
  }, []);

  const handleRefresh = () => {
    setRotating(true);
    getNextMessage();
    setTimeout(() => setRotating(false), 500);
  };

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4 relative overflow-hidden group">
      {/* Subtle glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Brain className="h-3.5 w-3.5 text-orange-400" />
          </div>
          <span className="text-xs font-bold text-white">AI Motivation</span>
          <span className="ai-badge">
            <Sparkles className="h-2.5 w-2.5" />
            AI
          </span>
        </div>
        <button
          onClick={handleRefresh}
          className="text-[#57534E] hover:text-orange-400 transition-colors p-1.5 rounded-lg hover:bg-orange-500/5 cursor-pointer"
          title="New message"
        >
          <RefreshCw className={`h-3.5 w-3.5 transition-transform duration-500 ${rotating ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Career goal chip */}
      {careerGoal && (
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#57534E] font-medium">Targeting:</span>
          <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/15 px-2 py-0.5 rounded-full truncate max-w-[150px]">
            {careerGoal}
          </span>
        </div>
      )}

      {/* Message */}
      <motion.p
        key={message}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-xs text-[#D6D3D1] leading-relaxed italic"
      >
        "{message}"
      </motion.p>

      {/* Streak */}
      {streak > 0 && (
        <div className="flex items-center gap-2 pt-1 border-t border-[#1C1917]">
          <span className="text-sm">🔥</span>
          <span className="text-xs text-[#78716C]">
            <span className="font-bold text-orange-400">{streak}</span> day streak
          </span>
        </div>
      )}
    </div>
  );
}
