import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Dashboard/Sidebar';
import { useAuth } from '../context/AuthContext';
import {
  Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight,
  Award, Star, ListChecks, HelpCircle, AlertCircle, RefreshCw, Brain, Zap,
  BarChart3, ShieldCheck, TrendingUp, BookOpen, XCircle, Target, Lightbulb, X,
  ChevronRight, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { API_URL } from '../services/apiClient';

// Score breakdown category config
const BREAKDOWN_CATEGORIES = [
  { key: 'structure', label: 'Structure & Completeness', maxScore: 20, icon: FileText, color: 'orange' },
  { key: 'keywords', label: 'Keyword Match', maxScore: 25, icon: Target, color: 'blue' },
  { key: 'relevance', label: 'Experience & Relevance', maxScore: 20, icon: TrendingUp, color: 'purple' },
  { key: 'formatting', label: 'ATS Formatting', maxScore: 15, icon: ShieldCheck, color: 'emerald' },
  { key: 'impact', label: 'Impact & Quality', maxScore: 10, icon: Zap, color: 'amber' },
  { key: 'readability', label: 'Grammar & Readability', maxScore: 10, icon: BookOpen, color: 'cyan' },
];

const CATEGORY_COLORS = {
  orange: { bar: 'bg-orange-500', badge: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  blue: { bar: 'bg-blue-500', badge: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  purple: { bar: 'bg-purple-500', badge: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  emerald: { bar: 'bg-emerald-500', badge: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  amber: { bar: 'bg-amber-500', badge: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  cyan: { bar: 'bg-cyan-500', badge: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
};

// Circular score ring component
function ScoreRing({ score, size = 120 }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score < 40 ? '#f43f5e' :
    score < 60 ? '#f59e0b' :
    score < 80 ? '#f97316' :
    '#10b981';
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#292524" strokeWidth="8" />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
    </svg>
  );
}

export default function ResumeAnalyzer() {
  const { token, reloadProfile } = useAuth();
  const [file, setFile]                     = useState(null);
  const [targetGoal, setTargetGoal]         = useState('Software Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [status, setStatus]                 = useState('idle');   // idle | loading | success | error
  const [errorMessage, setErrorMessage]     = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loadingLog, setLoadingLog]         = useState('');
  const [showModal, setShowModal]           = useState(false);
  const modalRef                            = useRef(null);

  // Close modal on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) setShowModal(false);
    };
    if (showModal) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showModal]);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showModal]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setErrorMessage('');
    } else {
      setFile(null);
      setErrorMessage('Please upload a valid PDF file.');
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) return;

    setStatus('loading');
    setErrorMessage('');

    const logs = [
      'Extracting resume text from PDF...',
      'Running ATS structure analysis...',
      'Matching keywords against target role...',
      'Evaluating experience & project relevance...',
      'Checking ATS formatting compatibility...',
      'Analyzing impact & content quality...',
      'Computing final ATS score...',
      'Generating AI-powered suggestions...',
      'Finalizing analysis results...'
    ];

    let logIdx = 0;
    const interval = setInterval(() => {
      if (logIdx < logs.length) {
        setLoadingLog(logs[logIdx]);
        logIdx++;
      }
    }, 900);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetGoal', targetGoal);
      if (jobDescription.trim()) {
        formData.append('jobDescription', jobDescription.trim());
      }

      const response = await fetch(`${API_URL}/api/resume/analyze`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      clearInterval(interval);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Server error occurred during analysis.');
      }

      const parsedJSON = await response.json();
      setAnalysisResult(parsedJSON);
      await reloadProfile();
      setStatus('success');
      setShowModal(true);

    } catch (err) {
      clearInterval(interval);
      console.error(err);
      setErrorMessage(err.message || 'Analysis failed. Please try again.');
      setStatus('error');
    }
  };

  const getScoreColor = (score) => {
    if (score < 40) return { badge: 'text-rose-400 border-rose-500/30 bg-rose-500/8', bar: 'bg-rose-500', label: 'Needs Improvement', ring: 'text-rose-400' };
    if (score < 60) return { badge: 'text-amber-400 border-amber-500/30 bg-amber-500/8', bar: 'bg-amber-500', label: 'Fair', ring: 'text-amber-400' };
    if (score < 80) return { badge: 'text-orange-400 border-orange-500/30 bg-orange-500/8', bar: 'bg-orange-500', label: 'Good', ring: 'text-orange-400' };
    return { badge: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/8', bar: 'bg-emerald-500', label: 'Excellent', ring: 'text-emerald-400' };
  };

  const resetForm = () => {
    setFile(null);
    setAnalysisResult(null);
    setStatus('idle');
    setErrorMessage('');
    setJobDescription('');
    setShowModal(false);
    const input = document.getElementById('resume-file');
    if (input) input.value = '';
  };

  // Get the ATS score from the result â€” use atsScore if available, fallback to score for legacy data
  const displayScore = analysisResult?.atsScore ?? analysisResult?.score ?? null;

  const inputClass = "block w-full rounded-xl border border-[#292524] px-4 py-3 bg-[#1C1917]/60 text-white placeholder-[#57534E] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 text-sm transition-all";
  const scoreColors = displayScore !== null ? getScoreColor(displayScore) : null;

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] flex">
      <Sidebar />

      <main className="flex-1 pl-0 md:pl-60 pt-14 md:pt-0 min-w-0">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-7">

          {/* Header */}
          <div className="border-b border-[#1C1917] pb-6 mb-7">
            <div className="flex items-center gap-2 mb-2">
              <span className="ai-badge">
                <Brain className="h-2.5 w-2.5" />
                AI Engine
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">AI Resume Analyzer</h1>
            <p className="text-sm text-[#78716C] mt-1">
              Upload your resume (PDF). We'll calculate a deterministic ATS score, detect skill gaps, and recommend improvements.
            </p>
          </div>

          {/* Main content â€” two column */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

            {/* LEFT: Upload form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleAnalyze} className="glass-card rounded-2xl border border-[#1C1917] p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-orange-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Resume Settings</h3>
                </div>

                {/* Target Role */}
                <div className="space-y-1.5">
                  <label htmlFor="targetGoal" className="block text-xs font-semibold text-[#78716C] uppercase tracking-wider">
                    Target Career Goal
                  </label>
                  <input
                    type="text"
                    id="targetGoal"
                    className={inputClass}
                    placeholder="e.g., Full Stack Engineer"
                    value={targetGoal}
                    onChange={(e) => setTargetGoal(e.target.value)}
                    required
                    disabled={status === 'loading'}
                  />
                </div>

                {/* Job Description (Optional) */}
                <div className="space-y-1.5">
                  <label htmlFor="jobDescription" className="block text-xs font-semibold text-[#78716C] uppercase tracking-wider">
                    Paste Job Description <span className="text-[#57534E] normal-case">(Optional)</span>
                  </label>
                  <textarea
                    id="jobDescription"
                    className={`${inputClass} resize-none`}
                    placeholder="Paste a job description for more accurate keyword matching..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    disabled={status === 'loading'}
                    rows={3}
                  />
                </div>

                {/* PDF Upload */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#78716C] uppercase tracking-wider">
                    Upload Resume (PDF only)
                  </label>
                  <div className="border border-dashed border-[#292524] hover:border-orange-500/25 rounded-2xl p-5 bg-[#1C1917]/20 hover:bg-orange-500/3 transition-all flex flex-col items-center text-center cursor-pointer relative group">
                    <input
                      type="file"
                      id="resume-file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      disabled={status === 'loading'}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-9 h-9 rounded-xl bg-[#1C1917] border border-[#292524] text-orange-400 group-hover:bg-orange-500/8 group-hover:border-orange-500/20 flex items-center justify-center mb-2.5 transition-all">
                      <Upload className="h-4 w-4" />
                    </div>
                    {file ? (
                      <div>
                        <p className="text-xs font-bold text-white truncate max-w-[180px]">{file.name}</p>
                        <p className="text-[10px] text-[#57534E]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-semibold text-[#D6D3D1]">Click or drag resume here</p>
                        <p className="text-[10px] text-[#57534E]">PDF up to 5 MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-xs flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  id="analyze-resume-btn"
                  disabled={!file || status === 'loading'}
                  className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 ${
                    !file || status === 'loading'
                      ? 'bg-[#1C1917] border border-[#292524] text-[#57534E] cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {status === 'loading' ? (
                    <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Analyzing...</>
                  ) : (
                    <><Zap className="h-4 w-4" />Analyze Resume</>
                  )}
                </button>

                {/* View last result button */}
                {status === 'success' && analysisResult && (
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="w-full py-2.5 rounded-xl border border-orange-500/20 bg-orange-500/8 hover:bg-orange-500/12 text-orange-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <BarChart3 className="h-3.5 w-3.5" /> View Last Result
                  </button>
                )}
              </form>
            </div>

            {/* RIGHT: Status / Preview panel */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">

                {/* Idle state */}
                {status === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center p-10 border border-[#1C1917] rounded-2xl text-center min-h-[340px] gap-5"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#1C1917] border border-[#292524] flex items-center justify-center text-[#44403C]">
                      <FileText className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#D6D3D1]">Ready to analyze your resume</h3>
                      <p className="text-xs text-[#57534E] mt-1.5 max-w-xs mx-auto">
                        Configure your target goal, optionally paste a job description, then upload your PDF to start.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                      {['ATS Score', 'Keyword Analysis', 'Skill Gaps', 'AI Suggestions'].map(f => (
                        <span key={f} className="text-[10px] font-semibold text-[#78716C] bg-[#1C1917] border border-[#292524] px-2.5 py-1 rounded-full flex items-center gap-1">
                          <ChevronRight className="h-2.5 w-2.5 text-orange-500" />{f}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Loading state */}
                {status === 'loading' && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center p-10 border border-orange-500/15 rounded-2xl bg-orange-500/3 text-center min-h-[340px] space-y-5"
                  >
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-orange-500/10 border-t-orange-500 animate-spin" />
                      <Brain className="h-6 w-6 text-orange-400/60" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Analyzing Resume...</h3>
                      <p className="text-xs text-orange-400 animate-pulse mt-1.5">{loadingLog || 'Initializing parsers...'}</p>
                    </div>
                    <div className="w-full max-w-xs space-y-2">
                      {['Extracting text', 'ATS analysis', 'Keyword match', 'AI scoring'].map((step, i) => (
                        <div key={step} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500/40 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                          <span className="text-[10px] text-[#57534E]">{step}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Error state */}
                {status === 'error' && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center p-10 border border-red-500/20 rounded-2xl bg-red-500/3 text-center min-h-[340px] gap-5"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                      <XCircle className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-red-400">Analysis Failed</h3>
                      <p className="text-xs text-[#78716C] mt-1.5 max-w-md">{errorMessage || 'An unexpected error occurred. Please try again.'}</p>
                    </div>
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 rounded-xl border border-red-500/20 bg-red-500/8 hover:bg-red-500/12 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Try Again
                    </button>
                  </motion.div>
                )}

                {/* Success preview â€” compact score card */}
                {status === 'success' && analysisResult && displayScore !== null && (
                  <motion.div
                    key="success-preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-5"
                  >
                    {/* Score hero card */}
                    <div className="glass-card rounded-2xl border border-[#1C1917] p-6 flex items-center gap-6">
                      <div className="relative shrink-0 flex items-center justify-center">
                        <ScoreRing score={displayScore} size={110} />
                        <div className="absolute flex flex-col items-center">
                          <span className={`text-2xl font-black leading-none ${scoreColors.ring}`}>{displayScore}</span>
                          <span className="text-[9px] uppercase tracking-wider text-[#78716C] mt-0.5">/ 100</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${scoreColors.badge}`}>
                            {scoreColors.label}
                          </span>
                          <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/15 px-2.5 py-0.5 rounded-full">
                            {analysisResult.inferredGoal || targetGoal}
                          </span>
                        </div>
                        <h2 className="text-base font-black text-white mb-1">ATS Resume Evaluation</h2>
                        <p className="text-xs text-[#78716C] leading-relaxed line-clamp-3">{analysisResult.summary}</p>
                      </div>
                    </div>

                    {/* Mini breakdown bars */}
                    {analysisResult.scoreBreakdown && (
                      <div className="glass-card rounded-2xl border border-[#1C1917] p-5 space-y-3">
                        <h4 className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider flex items-center gap-2">
                          <BarChart3 className="h-3.5 w-3.5 text-orange-400" /> Score Breakdown
                        </h4>
                        <div className="space-y-2.5">
                          {BREAKDOWN_CATEGORIES.map(({ key, label, maxScore, color }) => {
                            const catData = analysisResult.scoreBreakdown[key];
                            if (!catData) return null;
                            const catScore = catData.score ?? 0;
                            const pct = (catScore / maxScore) * 100;
                            const colors = CATEGORY_COLORS[color];
                            return (
                              <div key={key} className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-semibold text-[#78716C]">{label}</span>
                                  <span className={`text-[10px] font-black ${colors.badge}`}>{catScore}/{maxScore}</span>
                                </div>
                                <div className="h-1 rounded-full bg-[#292524] overflow-hidden">
                                  <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${pct}%`, transition: 'width 0.7s ease' }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* CTA buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowModal(true)}
                        className="flex-1 py-3 rounded-xl btn-primary text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        <Lightbulb className="h-4 w-4" /> View Full Report
                      </button>
                      <button
                        id="analyze-another-btn"
                        onClick={resetForm}
                        className="px-4 py-3 rounded-xl border border-[#292524] bg-[#1C1917] hover:bg-[#292524] text-[#D6D3D1] text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="h-4 w-4" /> Analyze Another
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* â”€â”€â”€ Full Report Modal â”€â”€â”€ */}
      <AnimatePresence>
        {showModal && analysisResult && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              ref={modalRef}
              key="modal-panel"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0F0E0D] border border-[#1C1917] rounded-2xl w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1C1917] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Full ATS Report</h2>
                    <p className="text-[10px] text-[#57534E]">
                      {analysisResult.inferredGoal || targetGoal} Â· Score: {displayScore}/100
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id="analyze-another-modal-btn"
                    onClick={resetForm}
                    className="px-3 py-1.5 rounded-lg border border-orange-500/20 bg-orange-500/8 hover:bg-orange-500/12 text-orange-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" /> Analyze Another
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 rounded-lg border border-[#292524] bg-[#1C1917] hover:bg-[#292524] flex items-center justify-center text-[#78716C] transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Modal scrollable body */}
              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

                {/* Score banner */}
                {displayScore !== null && (
                  <div className="glass-card rounded-2xl border border-[#1C1917] p-5 flex flex-col sm:flex-row items-center gap-5">
                    <div className="relative shrink-0 flex items-center justify-center">
                      <ScoreRing score={displayScore} size={100} />
                      <div className="absolute flex flex-col items-center">
                        <span className={`text-xl font-black leading-none ${scoreColors.ring}`}>{displayScore}</span>
                        <span className="text-[8px] uppercase tracking-wider text-[#78716C]">/ 100</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex flex-wrap gap-1.5">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${scoreColors.badge}`}>
                          {scoreColors.label}
                        </span>
                        <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/15 px-2.5 py-0.5 rounded-full">
                          Target: {analysisResult.inferredGoal || targetGoal}
                        </span>
                      </div>
                      <div className={`h-1.5 rounded-full bg-[#292524] overflow-hidden`}>
                        <div className={`h-full rounded-full ${scoreColors.bar}`} style={{ width: `${displayScore}%`, transition: 'width 0.7s ease' }} />
                      </div>
                      <p className="text-xs text-[#78716C] leading-relaxed">{analysisResult.summary}</p>
                    </div>
                  </div>
                )}

                {/* Score breakdown */}
                {analysisResult.scoreBreakdown && (
                  <div className="glass-card rounded-2xl border border-[#1C1917] p-5 space-y-4">
                    <h4 className="text-xs font-bold text-[#D6D3D1] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#1C1917]">
                      <BarChart3 className="h-4 w-4 text-orange-400" /> ATS Score Breakdown
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {BREAKDOWN_CATEGORIES.map(({ key, label, maxScore, icon: Icon, color }) => {
                        const catData = analysisResult.scoreBreakdown[key];
                        if (!catData) return null;
                        const catScore = catData.score ?? 0;
                        const percentage = (catScore / maxScore) * 100;
                        const colors = CATEGORY_COLORS[color];
                        return (
                          <div key={key} className="p-3.5 rounded-xl bg-[#1C1917] border border-[#292524] space-y-2.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-lg ${colors.bg} ${colors.border} border flex items-center justify-center`}>
                                  <Icon className={`h-3.5 w-3.5 ${colors.badge}`} />
                                </div>
                                <span className="text-[11px] font-bold text-[#D6D3D1]">{label}</span>
                              </div>
                              <span className={`text-xs font-black ${colors.badge}`}>{catScore}/{maxScore}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-[#292524] overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-700 ${colors.bar}`} style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Matched & Missing Keywords */}
                {(analysisResult.matchedKeywords?.length > 0 || analysisResult.missingKeywords?.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {analysisResult.matchedKeywords?.length > 0 && (
                      <div className="glass-card rounded-2xl border border-[#1C1917] p-5 space-y-3">
                        <h4 className="text-xs font-bold text-[#D6D3D1] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#1C1917]">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Matched Keywords
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full ml-auto">
                            {analysisResult.matchedKeywords.length}
                          </span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.matchedKeywords.map((kw, idx) => (
                            <span key={idx} className="text-xs bg-emerald-500/8 border border-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-xl">{kw}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {analysisResult.missingKeywords?.length > 0 && (
                      <div className="glass-card rounded-2xl border border-[#1C1917] p-5 space-y-3">
                        <h4 className="text-xs font-bold text-[#D6D3D1] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#1C1917]">
                          <AlertTriangle className="h-4 w-4 text-amber-500" /> Missing Keywords
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full ml-auto">
                            {analysisResult.missingKeywords.length}
                          </span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.missingKeywords.slice(0, 15).map((kw, idx) => (
                            <span key={idx} className="text-xs bg-amber-500/8 border border-amber-500/15 text-amber-400 px-2.5 py-1 rounded-xl">{kw}</span>
                          ))}
                          {analysisResult.missingKeywords.length > 15 && (
                            <span className="text-[10px] text-[#57534E] self-center">+{analysisResult.missingKeywords.length - 15} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Strengths + Weaknesses */}
                {(analysisResult.strengths?.length > 0 || analysisResult.weaknesses?.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {analysisResult.strengths?.length > 0 && (
                      <div className="glass-card rounded-2xl border border-[#1C1917] p-5 space-y-3">
                        <h4 className="text-xs font-bold text-[#D6D3D1] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#1C1917]">
                          <Star className="h-4 w-4 text-orange-400" /> Key Strengths
                        </h4>
                        <ul className="space-y-2">
                          {analysisResult.strengths.map((str, idx) => (
                            <li key={idx} className="text-xs text-[#78716C] flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysisResult.weaknesses?.length > 0 && (
                      <div className="glass-card rounded-2xl border border-[#1C1917] p-5 space-y-3">
                        <h4 className="text-xs font-bold text-[#D6D3D1] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#1C1917]">
                          <AlertTriangle className="h-4 w-4 text-amber-500" /> Weaknesses
                        </h4>
                        <ul className="space-y-2">
                          {analysisResult.weaknesses.map((w, idx) => (
                            <li key={idx} className="text-xs text-[#78716C] flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Suggestions */}
                {analysisResult.suggestions?.length > 0 && (
                  <div className="glass-card rounded-2xl border border-[#1C1917] p-5 space-y-4">
                    <h4 className="text-xs font-bold text-[#D6D3D1] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#1C1917]">
                      <Lightbulb className="h-4 w-4 text-orange-400" /> Actionable Suggestions
                    </h4>
                    <div className="space-y-2.5">
                      {analysisResult.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-[#1C1917] border border-[#292524] flex items-start gap-2.5">
                          <span className="text-[10px] font-black text-orange-400 bg-orange-500/10 border border-orange-500/20 w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-xs text-[#78716C] leading-relaxed">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI-Detected Skills */}
                {analysisResult.matchedSkills?.length > 0 && (
                  <div className="glass-card rounded-2xl border border-[#1C1917] p-5 space-y-3">
                    <h4 className="text-xs font-bold text-[#D6D3D1] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#1C1917]">
                      <Award className="h-4 w-4 text-orange-400" /> AI-Detected Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.matchedSkills.map((skill, idx) => (
                        <span key={idx} className="text-xs bg-[#1C1917] border border-[#292524] text-[#D6D3D1] px-2.5 py-1 rounded-xl">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skill Gaps */}
                {analysisResult.skillGaps?.length > 0 && (
                  <div className="glass-card rounded-2xl border border-[#1C1917] p-5 space-y-4">
                    <h4 className="text-xs font-bold text-[#D6D3D1] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#1C1917]">
                      <AlertTriangle className="h-4 w-4 text-amber-500" /> Detected Skill Gaps
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {analysisResult.skillGaps.map((gap, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-[#1C1917] border border-[#292524] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{gap.skill}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                              gap.importance === 'High'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                              {gap.importance}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#57534E] leading-relaxed">{gap.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects + Certifications */}
                {(analysisResult.recommendedProjects?.length > 0 || analysisResult.recommendedCertifications?.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {analysisResult.recommendedProjects?.length > 0 && (
                      <div className="glass-card rounded-2xl border border-[#1C1917] p-5 space-y-4">
                        <h4 className="text-xs font-bold text-[#D6D3D1] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#1C1917]">
                          <ListChecks className="h-4 w-4 text-orange-400" /> Recommended Projects
                        </h4>
                        <div className="space-y-4">
                          {analysisResult.recommendedProjects.map((proj, idx) => (
                            <div key={idx} className="space-y-1.5 border-l-2 border-orange-500/25 pl-3">
                              <div className="flex items-center justify-between">
                                <h5 className="text-xs font-bold text-white">{proj.title}</h5>
                                <span className="text-[9px] text-orange-400 font-bold">{proj.difficulty}</span>
                              </div>
                              <p className="text-[11px] text-[#57534E] leading-relaxed">{proj.description}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {proj.techStack?.map((t, tIdx) => (
                                  <span key={tIdx} className="text-[9px] bg-[#1C1917] px-1.5 py-0.5 rounded text-[#78716C] border border-[#292524]">{t}</span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {analysisResult.recommendedCertifications?.length > 0 && (
                      <div className="glass-card rounded-2xl border border-[#1C1917] p-5 space-y-4">
                        <h4 className="text-xs font-bold text-[#D6D3D1] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#1C1917]">
                          <HelpCircle className="h-4 w-4 text-orange-400" /> Target Certifications
                        </h4>
                        <div className="space-y-4">
                          {analysisResult.recommendedCertifications.map((cert, idx) => (
                            <div key={idx} className="space-y-1">
                              <h5 className="text-xs font-bold text-white leading-tight">{cert.name}</h5>
                              <span className="block text-[10px] text-orange-400 font-medium">{cert.issuer}</span>
                              <p className="text-[11px] text-[#57534E] leading-relaxed">{cert.benefit}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Improvement Tips */}
                {analysisResult.improvementTips?.length > 0 && (
                  <div className="glass-card rounded-2xl border border-[#1C1917] p-5 space-y-4">
                    <h4 className="text-xs font-bold text-[#D6D3D1] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#1C1917]">
                      <ArrowRight className="h-4 w-4 text-orange-400" /> Formatting & Content Improvements
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {analysisResult.improvementTips.map((tip, idx) => (
                        <div key={idx} className="space-y-1 p-3 rounded-xl bg-[#1C1917] border border-[#292524]">
                          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">{tip.section}</span>
                          <p className="text-xs text-[#78716C] leading-relaxed">{tip.advice}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
