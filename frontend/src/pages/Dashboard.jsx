import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar';
import StatCard from '../components/Dashboard/StatCard';
import TimelineView from '../components/Dashboard/TimelineView';
import ProjectCard from '../components/Dashboard/ProjectCard';
import ResourceCard from '../components/Dashboard/ResourceCard';
import MotivationWidget from '../components/Dashboard/MotivationWidget';
import { Calendar, Clock, Award, Target, BookOpen, GraduationCap, ArrowRight, Map, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const cleanTargetRole = (role) => {
  if (!role) return '';
  let clean = role.trim();
  clean = clean.replace(/^(to secure|to obtain|to get|to work as|to become|to find|to land|secure|obtain|get|become|find|land|work as)\s+(an?|the)?\s+/i, '');
  clean = clean.charAt(0).toUpperCase() + clean.slice(1);
  const stopWords = /\s+(in|at|within|using|leveraging|to\s+build|with|for|by|from|based\s+on)\s+/i;
  const match = clean.split(stopWords);
  if (match && match[0]) {
    clean = match[0].trim();
  }
  return clean;
};

const getTruncatedRole = (role, limit = 45) => {
  const clean = cleanTargetRole(role);
  if (clean.length > limit) {
    return clean.slice(0, limit - 3) + '...';
  }
  return clean;
};

export default function Dashboard() {
  const { user, token, reloadProfile } = useAuth();
  const navigate = useNavigate();

  // Load the latest generated roadmap from user history
  const activeRoadmap = user?.roadmaps && user.roadmaps.length > 0
    ? user.roadmaps[user.roadmaps.length - 1]
    : null;

  // Calculate roadmap progress metrics
  let totalTasks = 0;
  let completedTasksCount = 0;
  let currentMilestone = 'No active milestone';
  let completedMonthsCount = 0;
  let totalMonthsCount = 0;

  if (activeRoadmap && Array.isArray(activeRoadmap.monthlyRoadmap)) {
    totalMonthsCount = activeRoadmap.monthlyRoadmap.length;

    activeRoadmap.monthlyRoadmap.forEach((monthData) => {
      let monthTotal = 0;
      let monthCompleted = 0;

      if (Array.isArray(monthData.weeklyBreakdown)) {
        monthData.weeklyBreakdown.forEach((weekData) => {
          if (Array.isArray(weekData.tasks)) {
            weekData.tasks.forEach((task) => {
              totalTasks++;
              const isCompleted = typeof task === 'object' && task !== null ? !!task.completed : false;
              if (isCompleted) {
                completedTasksCount++;
                monthCompleted++;
              }
              monthTotal++;
            });
          }
        });
      }

      if (monthTotal > 0 && monthCompleted === monthTotal) {
        completedMonthsCount++;
      }
    });

    const firstIncompleteMonth = activeRoadmap.monthlyRoadmap.find((month) => {
      let monthTotal = 0;
      let monthCompleted = 0;
      month.weeklyBreakdown?.forEach((week) => {
        week.tasks?.forEach((task) => {
          monthTotal++;
          const isDone = typeof task === 'object' && task !== null ? !!task.completed : false;
          if (isDone) monthCompleted++;
        });
      });
      return monthTotal > 0 ? monthCompleted < monthTotal : true;
    });

    if (firstIncompleteMonth) {
      currentMilestone = `Month ${firstIncompleteMonth.month}: ${firstIncompleteMonth.title}`;
    } else if (totalTasks > 0 && completedTasksCount === totalTasks) {
      currentMilestone = 'Roadmap Complete! 🎉';
    }
  }

  const overallProgress = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] flex">
      <Sidebar />

      <main className="flex-1 pl-0 md:pl-60 pt-14 md:pt-0 min-w-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 space-y-6">

          {/* ── Dashboard Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden border border-[#1C1917] bg-gradient-to-r from-[#1C1917]/60 via-[#1C1917]/40 to-transparent p-5 md:p-6"
          >
            {/* Top accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-orange-500/50 via-orange-400/30 to-transparent" />
            {/* Glow */}
            <div className="absolute top-0 left-0 w-64 h-full bg-orange-500/3 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="ai-badge">
                    <Sparkles className="h-2.5 w-2.5" />
                    Pathvexa Roadmap Engine
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 👋
                </h1>
                {activeRoadmap ? (
                  <p className="text-sm text-[#78716C] mt-1 max-w-xl md:max-w-2xl leading-relaxed">
                    Your path to{' '}
                    <span className="text-orange-400 font-semibold" title={activeRoadmap.careerGoal}>
                      {getTruncatedRole(activeRoadmap.careerGoal, 55)}
                    </span>{' '}
                    is mapped out.
                  </p>
                ) : (
                  <p className="text-sm text-[#78716C] mt-1">
                    Complete your career assessment to generate your personalized AI roadmap.
                  </p>
                )}
              </div>

              {activeRoadmap && (
                <div className="flex items-center gap-2 shrink-0 max-w-full md:max-w-xs lg:max-w-md w-full md:w-auto">
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-[#0C0A09]/60 border border-[#292524] rounded-xl backdrop-blur-sm w-full min-w-0">
                    <GraduationCap className="h-4 w-4 text-orange-400 shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <span className="block text-[9px] text-[#57534E] font-bold uppercase tracking-widest">Target Role</span>
                      <span className="font-bold text-white text-xs block truncate" title={activeRoadmap.careerGoal}>
                        {cleanTargetRole(activeRoadmap.careerGoal)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {activeRoadmap ? (
            <>
              {/* ── Completion Banner ── */}
              {overallProgress === 100 && totalTasks > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-3 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
                  <div className="mx-auto w-11 h-11 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Roadmap Completed! 🏆</h2>
                    <p className="text-xs text-[#78716C] max-w-xl mx-auto mt-1 leading-relaxed">
                      Congratulations! You have completed every learning objective. You are ready to start applying these skills and building professional projects.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ── Stats Grid ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
              >
                <StatCard
                  title="Overall Progress"
                  value={`${overallProgress}%`}
                  description={`${completedTasksCount}/${totalTasks} tasks`}
                  icon={Award}
                  trend={overallProgress > 0 ? 'up' : undefined}
                  trendValue={overallProgress > 0 ? `${overallProgress}%` : undefined}
                />
                <StatCard
                  title="Current Milestone"
                  value={totalTasks > 0 && completedTasksCount === totalTasks ? '100%' : `Month ${completedMonthsCount + 1}`}
                  description={currentMilestone}
                  icon={Calendar}
                />
                <StatCard
                  title="Study Commitment"
                  value={`${user?.learningHours || 2}h/day`}
                  description={`${completedMonthsCount}/${totalMonthsCount} months done`}
                  icon={Clock}
                />
                <StatCard
                  title="Timeline"
                  value={activeRoadmap.estimatedTimeline || '6 months'}
                  description="Expected completion"
                  icon={Target}
                />
              </motion.div>

              {/* ── Content Grid ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-7">

                {/* Timeline (left 2/3) */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="lg:col-span-2 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wide">
                      <Calendar className="h-4 w-4 text-orange-400" />
                      Learning Roadmap
                    </h2>
                    <span className="text-xs text-[#57534E]">Click a month to expand</span>
                  </div>

                  <TimelineView
                    monthlyRoadmap={activeRoadmap.monthlyRoadmap}
                    roadmapId={activeRoadmap._id}
                    token={token}
                    onProgressUpdate={reloadProfile}
                  />
                </motion.div>

                {/* Right column */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-5"
                >
                  {/* AI Motivation */}
                  <MotivationWidget careerGoal={activeRoadmap.careerGoal} streak={1} />

                  {/* Recommended Projects */}
                  {Array.isArray(activeRoadmap.recommendedProjects) && activeRoadmap.recommendedProjects.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-[#1C1917]">
                        <BookOpen className="h-3.5 w-3.5 text-orange-400" />
                        <h3 className="text-[10px] font-bold text-[#D6D3D1] uppercase tracking-widest">
                          Recommended Projects
                        </h3>
                      </div>
                      <div className="space-y-2.5">
                        {activeRoadmap.recommendedProjects.map((project, idx) => (
                          <ProjectCard key={idx} project={project} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Learning Resources */}
                  {Array.isArray(activeRoadmap.learningResources) && activeRoadmap.learningResources.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-[#1C1917]">
                        <BookOpen className="h-3.5 w-3.5 text-orange-400" />
                        <h3 className="text-[10px] font-bold text-[#D6D3D1] uppercase tracking-widest">
                          Core Resources
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {activeRoadmap.learningResources.map((resource, idx) => (
                          <ResourceCard key={idx} resource={resource} />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </>
          ) : (
            /* ── Empty State ── */
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-[60vh] py-12"
            >
              <div className="relative rounded-2xl border border-[#1C1917] bg-gradient-to-br from-[#1C1917]/40 to-transparent p-10 md:p-14 text-center max-w-lg w-full overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-orange-500/5 rounded-full blur-[50px] pointer-events-none" />

                <div className="relative">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-6">
                    <Map className="h-8 w-8" />
                  </div>

                  <h2 className="text-2xl font-black text-white tracking-tight mb-3">No roadmap yet</h2>
                  <p className="text-sm text-[#78716C] leading-relaxed max-w-sm mx-auto mb-8">
                    Complete your career onboarding assessment to generate your personalized AI learning roadmap and start tracking progress.
                  </p>

                  <button
                    id="start-assessment-btn"
                    onClick={() => navigate('/onboarding')}
                    className="btn-primary px-8 py-3.5 text-sm"
                  >
                    Start Assessment <ArrowRight className="h-4 w-4" />
                  </button>

                  {/* Decorative mini steps */}
                  <div className="mt-10 grid grid-cols-3 gap-3 text-left">
                    {[
                      { num: '01', label: 'Assessment' },
                      { num: '02', label: 'AI Roadmap' },
                      { num: '03', label: 'Track & Win' },
                    ].map((s) => (
                      <div key={s.num} className="p-3 rounded-xl bg-[#1C1917]/60 border border-[#292524]">
                        <span className="block text-[10px] font-black text-orange-400 mb-0.5">{s.num}</span>
                        <span className="text-[10px] text-[#57534E] font-medium">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
