import React, { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Star, Check, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { API_URL } from '../../services/apiClient';

export default function TimelineView({ monthlyRoadmap, roadmapId, token, onProgressUpdate }) {
  const [expandedMonth, setExpandedMonth] = useState(1);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const toggleMonth = (monthNum) => {
    setExpandedMonth(expandedMonth === monthNum ? null : monthNum);
  };

  const handleToggleTask = async (mIdx, wIdx, tIdx) => {
    if (!monthlyRoadmap || !roadmapId || !token) return;

    const loadingKey = `${mIdx}-${wIdx}-${tIdx}`;
    setUpdatingTaskId(loadingKey);

    try {
      const updatedRoadmap = JSON.parse(JSON.stringify(monthlyRoadmap));

      const monthData = updatedRoadmap[mIdx];
      if (!monthData) return;

      const weekData = monthData.weeklyBreakdown?.[wIdx];
      if (!weekData) return;

      const task = weekData.tasks?.[tIdx];
      if (!task) return;

      if (typeof task === 'object' && task !== null) {
        task.completed = !task.completed;
      } else {
        weekData.tasks[tIdx] = {
          id: `m${monthData.month}-w${weekData.week}-t${tIdx}`,
          text: task,
          completed: true,
        };
      }

      // Update month completion
      let allMonthTasksCompleted = true;
      monthData.weeklyBreakdown?.forEach((week) => {
        week.tasks?.forEach((t) => {
          const isDone = typeof t === 'object' && t !== null ? !!t.completed : false;
          if (!isDone) allMonthTasksCompleted = false;
        });
      });
      monthData.completed = allMonthTasksCompleted;

      const response = await fetch(`${API_URL}/api/roadmap/${roadmapId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ monthlyRoadmap: updatedRoadmap }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to sync task progress.');
      }

      if (onProgressUpdate) {
        await onProgressUpdate();
      }

    } catch (err) {
      console.error('[Progress Update Error]', err);
      alert(`Could not sync task progress: ${err.message}`);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (!monthlyRoadmap || monthlyRoadmap.length === 0) return null;

  return (
    <div className="space-y-3">
      {monthlyRoadmap.map((monthData, mIdx) => {
        const isExpanded = expandedMonth === monthData.month;

        // Compute completion metrics
        let totalTasks = 0;
        let doneTasks = 0;
        monthData.weeklyBreakdown?.forEach((week) => {
          week.tasks?.forEach((task) => {
            totalTasks++;
            const isCompleted = typeof task === 'object' && task !== null ? !!task.completed : false;
            if (isCompleted) doneTasks++;
          });
        });
        const completionRate  = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
        const isMonthComplete = totalTasks > 0 && doneTasks === totalTasks;

        // Determine milestone status
        const prevComplete = mIdx === 0 || (() => {
          let prev = monthlyRoadmap[mIdx - 1];
          let pt = 0; let pd = 0;
          prev.weeklyBreakdown?.forEach(w => w.tasks?.forEach(t => {
            pt++;
            if (typeof t === 'object' && t !== null ? !!t.completed : false) pd++;
          }));
          return pt > 0 && pd === pt;
        })();

        const isLocked = mIdx > 0 && !prevComplete && !isMonthComplete;

        return (
          <div
            key={monthData.month}
            className={`rounded-2xl border transition-all duration-250 ${
              isMonthComplete
                ? 'border-emerald-500/20 bg-emerald-500/3'
                : isExpanded
                ? 'border-orange-500/25 bg-orange-500/3'
                : isLocked
                ? 'border-[#1C1917] bg-[#0C0A09]/40 opacity-60'
                : 'border-[#1C1917] bg-[#1C1917]/20 hover:border-[#292524]'
            }`}
          >
            {/* Month Header */}
            <button
              onClick={() => !isLocked && toggleMonth(monthData.month)}
              disabled={isLocked}
              className={`w-full flex items-center justify-between p-4 text-left ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3.5">
                {/* Status node */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${
                  isMonthComplete
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                    : isExpanded
                    ? 'bg-orange-500/10 border-orange-500/25 text-orange-400'
                    : isLocked
                    ? 'bg-[#1C1917] border-[#292524] text-[#44403C]'
                    : 'bg-[#1C1917] border-[#292524] text-[#57534E]'
                }`}>
                  {isMonthComplete ? (
                    <Check className="h-4 w-4 stroke-[2.5]" />
                  ) : isLocked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-black">{String(monthData.month).padStart(2, '0')}</span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${
                      isMonthComplete ? 'text-emerald-500' : isExpanded ? 'text-orange-400' : 'text-[#57534E]'
                    }`}>
                      Month {monthData.month}
                    </span>
                    {isMonthComplete && (
                      <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                        ✓ Complete
                      </span>
                    )}
                    {isLocked && (
                      <span className="text-[8px] font-bold text-[#57534E] bg-[#1C1917] border border-[#292524] px-1.5 py-0.5 rounded-full">
                        Locked
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight truncate max-w-[200px] sm:max-w-xs">
                    {monthData.title}
                  </h3>
                </div>
              </div>

              {/* Right: progress + chevron */}
              <div className="flex items-center gap-3 shrink-0">
                {totalTasks > 0 && (
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-[#292524] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isMonthComplete ? 'bg-emerald-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-bold min-w-[28px] ${
                      isMonthComplete ? 'text-emerald-400' : 'text-[#78716C]'
                    }`}>
                      {completionRate}%
                    </span>
                  </div>
                )}
                {!isLocked && (
                  isExpanded
                    ? <ChevronUp className="h-4 w-4 text-[#57534E]" />
                    : <ChevronDown className="h-4 w-4 text-[#57534E]" />
                )}
              </div>
            </button>

            {/* Expandable Content */}
            <AnimatePresence initial={false}>
              {isExpanded && !isLocked && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[#1C1917]/60 px-5 py-5 space-y-6">

                    {/* Objectives */}
                    {monthData.objectives && monthData.objectives.length > 0 && (
                      <div className="p-4 rounded-xl bg-[#0C0A09]/50 border border-[#1C1917] space-y-2.5">
                        <span className="text-[9px] font-bold text-[#57534E] uppercase tracking-widest block">
                          Key Objectives
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {monthData.objectives.map((obj, oIdx) => (
                            <div key={oIdx} className="flex items-start gap-2 text-xs text-[#D6D3D1]">
                              <Star className="h-3.5 w-3.5 text-orange-400 shrink-0 mt-0.5 fill-orange-400/20" />
                              <span className="leading-snug">{obj}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Weekly breakdown — timeline tree */}
                    <div className="relative border-l-2 border-[#1C1917] pl-6 ml-3 space-y-7">
                      {monthData.weeklyBreakdown?.map((week, wIdx) => (
                        <div key={wIdx} className="relative">
                          {/* Timeline dot */}
                          <div className={`absolute -left-[27px] top-0.5 w-3 h-3 rounded-full border-2 border-[#0C0A09] ${
                            isMonthComplete ? 'bg-emerald-500' : 'bg-orange-500'
                          }`} />

                          <div className="space-y-3">
                            <span className="text-[10px] font-bold text-[#57534E] uppercase tracking-widest block">
                              Week {week.week}
                            </span>

                            {/* Topics */}
                            {week.topics && week.topics.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {week.topics.map((topic, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#1C1917] text-[#D6D3D1] border border-[#292524] font-medium"
                                  >
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Tasks */}
                            <div className="space-y-1.5">
                              {week.tasks?.map((task, tIdx) => {
                                const taskKey  = `${mIdx}-${wIdx}-${tIdx}`;
                                const isUpdating = updatingTaskId === taskKey;
                                const isChecked  = typeof task === 'object' && task !== null ? !!task.completed : false;
                                const taskText   = typeof task === 'object' && task !== null ? task.text : task;

                                return (
                                  <button
                                    key={tIdx}
                                    type="button"
                                    onClick={() => handleToggleTask(mIdx, wIdx, tIdx)}
                                    disabled={isUpdating}
                                    className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                                      isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                                    } ${
                                      isChecked
                                        ? 'bg-emerald-500/3 hover:bg-emerald-500/5'
                                        : 'hover:bg-[#1C1917]'
                                    }`}
                                  >
                                    {/* Checkbox icon */}
                                    <div className="shrink-0 mt-0.5">
                                      {isUpdating ? (
                                        <div className="h-4 w-4 rounded-full border border-[#292524] border-t-orange-500 animate-spin" />
                                      ) : isChecked ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                      ) : (
                                        <Circle className="h-4 w-4 text-[#44403C] group-hover:text-orange-400/60 transition-colors" />
                                      )}
                                    </div>
                                    <span className={`text-xs leading-relaxed ${
                                      isChecked
                                        ? 'text-[#44403C] line-through'
                                        : 'text-[#D6D3D1] group-hover:text-white'
                                    }`}>
                                      {taskText}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
