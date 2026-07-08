import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, ArrowRight, CheckCircle2, BarChart3, FileText,
  Zap, Target, Clock, Brain, Shield, Users
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Roadmaps',
    desc: 'Our AI analyzes your skills, goals, and schedule to generate a fully personalized learning roadmap tailored to your exact career target.',
  },
  {
    icon: CheckCircle2,
    title: 'Task & Progress Tracking',
    desc: 'Break your roadmap into weekly tasks. Check them off as you go and watch your progress build milestone by milestone.',
  },
  {
    icon: FileText,
    title: 'Resume Analyzer',
    desc: 'Upload your resume and get instant AI-powered feedback on strengths, gaps, keyword scores, and improvement recommendations.',
  },
  {
    icon: Target,
    title: 'Career Goal Alignment',
    desc: 'Set your target role, timeline, and experience level. Pathvexa maps the exact skills and projects you need to get there.',
  },
  {
    icon: BarChart3,
    title: 'Visual Progress Dashboard',
    desc: "Get a bird's eye view of your journey with completion stats, active milestones, and time estimates all in one place.",
  },
  {
    icon: Zap,
    title: 'Adaptive Learning Path',
    desc: 'Tell us how many hours a day you can study and your preferred learning style. We adapt the entire roadmap around your life.',
  },
];

const steps = [
  {
    num: '01',
    title: 'Complete Your Assessment',
    desc: 'Fill in your education, current skills, career goal, experience level, and how many hours a day you can commit to learning.',
  },
  {
    num: '02',
    title: 'Get Your AI Roadmap',
    desc: 'Pathvexa generates a detailed month-by-month roadmap with weekly tasks, topic breakdowns, projects, and curated resources.',
  },
  {
    num: '03',
    title: 'Track & Complete',
    desc: 'Work through your tasks, mark milestones complete, and watch your dashboard fill up as you advance toward your career goal.',
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-inter overflow-x-hidden">

      {/* ── Navbar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-[#0C0A09]/90 backdrop-blur-md border-b border-[#1C1917]/80'
            : 'bg-transparent'
          }`}
      >
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/icon.png" alt="Pathvexa" className="h-7 w-auto" />
          </Link>

          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
            <a href="#features" className="text-sm text-[#78716C] hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-[#78716C] hover:text-white transition-colors">How it works</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="text-xs sm:text-sm text-[#D6D3D1] hover:text-white transition-colors font-medium hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-primary text-xs sm:text-sm py-2 px-3 sm:py-2.5 sm:px-5"
            >
              Get Started <ArrowRight className="h-3 h-3 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 overflow-hidden grid-bg">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-orange-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-orange-600/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-orange-400/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
          {/* AI badge */}
          <motion.div {...fadeUp} className="flex items-center justify-center mb-6">
            <span className="ai-badge">
              <Sparkles className="h-3 w-3" />
              AI-Powered Career Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6"
          >
            Your Career.{' '}
            <br className="hidden sm:block" />
            Your Roadmap.{' '}
            <br />
            <span className="pathvexa-gradient-text">Your Path.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-sm sm:text-base md:text-lg text-[#78716C] max-w-xl sm:max-w-2xl mx-auto leading-relaxed mb-8 px-2 sm:px-0"
          >
            Pathvexa creates personalized AI-powered career roadmaps, helps you track learning progress,
            complete tasks, analyze your resume, and reach your career goals - all in one platform.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4 sm:px-0"
          >
            <Link
              to="/register"
              id="hero-cta-primary"
              className="btn-primary py-3 px-6 text-sm sm:py-3.5 sm:px-8 sm:text-base rounded-xl w-full sm:w-auto"
            >
              Start for Free <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <Link
              to="/login"
              id="hero-cta-secondary"
              className="btn-secondary py-3 px-6 text-sm sm:py-3.5 sm:px-8 sm:text-base rounded-xl w-full sm:w-auto"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[10px] sm:text-xs text-[#57534E]"
          >
            <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-orange-500/60" />No credit card required</span>
            <span className="w-px h-4 bg-[#292524] hidden sm:block" />
            <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-orange-500/60" />Roadmap in under 60 seconds</span>
            <span className="w-px h-4 bg-[#292524] hidden sm:block" />
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-orange-500/60" />AI-personalized for you</span>
          </motion.div>

          {/* ── Terminal ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-14 mx-auto w-full max-w-2xl rounded-2xl border border-[#292524] bg-[#1C1917]/70 backdrop-blur-md overflow-hidden text-left font-mono shadow-2xl shadow-black/50 relative group"
          >
            {/* Window bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#292524] bg-[#0C0A09]/60 shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/50 group-hover:bg-red-500/80 transition-colors" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50 group-hover:bg-yellow-500/80 transition-colors" />
                <div className="w-2 h-2 rounded-full bg-green-500/50 group-hover:bg-green-500/80 transition-colors" />
              </div>
              <span className="text-[9px] text-[#57534E] tracking-wider font-semibold uppercase truncate px-2">
                pathvexa_generation_engine.json
              </span>
              <span className="text-[8px] text-orange-500/70 font-bold shrink-0">READY</span>
            </div>

            {/* Code body — scrollable on mobile */}
            <div className="overflow-x-auto w-full">
              <pre className="p-3.5 sm:p-5 text-[10px] sm:text-xs text-[#D6D3D1] leading-relaxed select-none min-w-[285px]">
                <code>
                  <span className="text-[#57534E]">// Loading generative profile assessment pipeline...</span>{"\n"}
                  <span className="text-[#78716C] font-semibold">{`{`}</span>{"\n"}
                  <span className="text-orange-400">{"  "}&#34;target_goal&#34;</span><span className="text-white">:</span> <span className="text-emerald-400">&#34;Senior Platform &amp; AI Infrastructure Architect&#34;</span><span className="text-white">,</span>{"\n"}
                  <span className="text-orange-400">{"  "}&#34;estimated_duration&#34;</span><span className="text-white">:</span> <span className="text-emerald-400">&#34;6 Months&#34;</span><span className="text-white">,</span>{"\n"}
                  <span className="text-orange-400">{"  "}&#34;weekly_study_commitment&#34;</span><span className="text-white">:</span> <span className="text-emerald-400">&#34;2.5 hours / daily&#34;</span><span className="text-white">,</span>{"\n"}
                  <span className="text-orange-400">{"  "}&#34;adapted_roadmaps&#34;</span><span className="text-white">:</span> <span className="text-[#78716C]">{`[`}</span>{"\n"}
                  <span className="text-[#78716C]">{"    "}{`{`}</span>{"\n"}
                  <span className="text-orange-300">{"      "}&#34;month_01&#34;</span><span className="text-white">:</span> <span className="text-emerald-400">&#34;Distributed Systems, Docker Orchestration &amp; gRPC&#34;</span><span className="text-white">,</span>{"\n"}
                  <span className="text-orange-300">{"      "}&#34;milestones_checked&#34;</span><span className="text-white">:</span> <span className="text-amber-500">85</span><span className="text-white">,</span>{"\n"}
                  <span className="text-orange-300">{"      "}&#34;engine_status&#34;</span><span className="text-white">:</span> <span className="text-orange-400 font-bold">&#34;ACTIVE_PROCESS&#34;</span>{"\n"}
                  <span className="text-[#78716C]">{"    "}{`}`}</span>{"\n"}
                  <span className="text-[#78716C]">{"  "}{`]`}</span>{"\n"}
                  <span className="text-[#78716C]">{`}`}</span>
                </code>
              </pre>
            </div>

            {/* Bottom laser line */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-500/25 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="ai-badge mb-4 inline-flex">Everything you need</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4">
              Built for serious career builders
            </h2>
            <p className="text-[#78716C] max-w-xl mx-auto text-sm leading-relaxed">
              Every feature is designed to help you move faster, stay focused, and reach your career goal with clarity.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="glass-card rounded-2xl p-6 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4 group-hover:bg-orange-500/15 transition-colors">
                    <Icon className="h-5 w-5 text-orange-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-[#78716C] leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="ai-badge mb-4 inline-flex">Simple process</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4">
              How Pathvexa works
            </h2>
            <p className="text-[#78716C] max-w-lg mx-auto text-sm leading-relaxed">
              From zero to a personalized AI roadmap in minutes. No guesswork, no generic advice.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex gap-6 p-6 glass-card rounded-2xl group"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/15 transition-colors">
                  <span className="text-orange-400 font-black text-sm">{step.num}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-[#78716C] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden p-12 border border-orange-500/20 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

            <Sparkles className="h-8 w-8 text-orange-400 mx-auto mb-4" />

            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
              Start building your path today
            </h2>
            <p className="text-[#78716C] mb-8 leading-relaxed text-sm">
              Join thousands of developers and career professionals using Pathvexa to reach their goals faster with AI-powered roadmaps.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                id="footer-cta-primary"
                className="btn-primary px-8 py-4 text-base w-full sm:w-auto"
              >
                Create Free Account <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/login"
                id="footer-cta-secondary"
                className="btn-secondary px-8 py-4 text-base w-full sm:w-auto"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1C1917] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="Pathvexa" className="h-6 w-auto" />
          </div>
          <p className="text-xs text-[#57534E]">
            © {new Date().getFullYear()} Pathvexa. AI-powered career roadmaps.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/login" className="text-xs text-[#57534E] hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="text-xs text-[#57534E] hover:text-white transition-colors">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
