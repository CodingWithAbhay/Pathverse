import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, ArrowRight, ArrowLeft, CheckCircle2, BarChart3, Brain, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Floating animated cards shown on the left brand panel ── */
const floatingCards = [
  {
    id: 'progress',
    top: '12%',
    left: '8%',
    delay: 0,
    content: (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
          <BarChart3 className="h-4 w-4 text-orange-400" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-white">Overall Progress</p>
          <p className="text-[10px] text-[#78716C]">72% complete</p>
          <div className="mt-1.5 h-1 w-28 bg-[#292524] rounded-full overflow-hidden">
            <div className="h-full w-[72%] bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'milestone',
    top: '38%',
    left: '-4%',
    delay: 0.6,
    content: (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-white">Milestone Reached</p>
          <p className="text-[10px] text-[#78716C]">Month 2 complete 🎉</p>
        </div>
      </div>
    ),
  },
  {
    id: 'ai',
    top: '65%',
    left: '10%',
    delay: 1.1,
    content: (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
          <Brain className="h-4 w-4 text-orange-400" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-white">AI Roadmap Ready</p>
          <p className="text-[10px] text-[#78716C]">Senior Platform Architect</p>
        </div>
      </div>
    ),
  },
  {
    id: 'speed',
    top: '84%',
    left: '-2%',
    delay: 1.6,
    content: (
      <div className="flex items-center gap-2">
        <Zap className="h-3.5 w-3.5 text-orange-400 shrink-0" />
        <p className="text-[10px] text-[#D6D3D1] font-medium">Roadmap generated in <span className="text-orange-400 font-bold">47s</span></p>
      </div>
    ),
  },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, authError, setAuthError, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthError('');
    if (token) navigate('/dashboard');
  }, [token, navigate, setAuthError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0C0A09] flex overflow-hidden">

      {/* ── LEFT: Animated Brand Panel ── */}
      <div className="hidden lg:flex lg:w-[52%] relative bg-gradient-to-br from-[#0C0A09] via-[#140E09] to-[#0C0A09] flex-col overflow-hidden border-r border-[#1C1917]">

        {/* Grid background */}
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-orange-600/6 rounded-full blur-[80px] pointer-events-none" />

        {/* Top bar */}
        <div className="relative z-10 p-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-[#57534E] hover:text-white transition-colors font-medium group">
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to home
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-12 pb-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <img src="/icon.png" alt="Pathvexa" className="h-14 w-auto drop-shadow-[0_4px_24px_rgba(249,115,22,0.25)]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight mb-3">
              Your Career.<br />
              <span className="pathvexa-gradient-text">Your Roadmap.</span>
            </h2>
            <p className="text-sm text-[#78716C] max-w-xs mx-auto leading-relaxed">
              AI-powered personalized career paths that adapt to your goals, schedule, and skill level.
            </p>
          </motion.div>

          {/* Floating cards */}
          <div className="relative w-full max-w-xs h-64">
            {floatingCards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: -30, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: card.delay + 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'absolute', top: card.top, left: card.left }}
                className="w-auto"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: card.delay,
                  }}
                  className="bg-[#1C1917]/80 backdrop-blur-md border border-[#292524] rounded-2xl px-4 py-3 shadow-xl shadow-black/40 min-w-[200px]"
                >
                  {card.content}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-orange-500/20 to-transparent" />
      </div>

      {/* ── RIGHT: Form Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C0A09] to-[#100D0B] pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-orange-500/4 rounded-full blur-[100px] pointer-events-none" />

        {/* Mobile back link */}
        <div className="lg:hidden absolute top-6 left-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-[#57534E] hover:text-white transition-colors font-medium group">
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Home
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src="/icon.png" alt="Pathvexa" className="h-10 w-auto" />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-white tracking-tight">Welcome back</h1>
            <p className="text-sm text-[#78716C] mt-1.5">Sign in to resume your AI learning path</p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="mb-5 p-3.5 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{authError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-[#78716C] uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 z-20">
                  <Mail className="h-4 w-4 text-[#57534E] group-focus-within:text-orange-400 transition-colors" />
                </div>
                <input
                  type="email"
                  id="email"
                  className="input-field"
                  style={{ paddingLeft: '2.75rem' }}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-[#78716C] uppercase tracking-wider">
                Password
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 z-20">
                  <Lock className="h-4 w-4 text-[#57534E] group-focus-within:text-orange-400 transition-colors" />
                </div>
                <input
                  type="password"
                  id="password"
                  className="input-field"
                  style={{ paddingLeft: '2.75rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 mt-2 cursor-pointer ${
                loading
                  ? 'bg-[#1C1917] border border-[#292524] text-[#57534E] cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>Sign In <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-7 pt-6 border-t border-[#1C1917] text-center text-sm">
            <span className="text-[#57534E]">Don't have an account? </span>
            <Link to="/register" className="text-orange-500 hover:text-orange-400 font-semibold transition-colors">
              Sign up for free
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
