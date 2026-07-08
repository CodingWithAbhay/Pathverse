import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Dashboard/Sidebar';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Target, Award, Clock, BookOpen, Sparkles, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import { API_URL } from '../services/apiClient';

function getInitials(fullName) {
  if (!fullName) return 'U';
  return fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

export default function Profile() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', careerGoal: '', learningHours: 0, learningStyle: '', experience: '', currentSkills: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name:          user.name || '',
        email:         user.email || '',
        careerGoal:    user.careerGoal || '',
        learningHours: user.learningHours || 0,
        learningStyle: user.learningStyle || '',
        experience:    user.experience || '',
        currentSkills: Array.isArray(user.currentSkills)
          ? user.currentSkills.map(s => typeof s === 'object' && s !== null && s.name ? s.name : s).join(', ')
          : (user.currentSkills || ''),
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      const skillsArray = formData.currentSkills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => {
          const existingSkill = Array.isArray(user?.currentSkills)
            ? user.currentSkills.find(e => (typeof e === 'object' && e !== null ? e.name : e) === s)
            : null;
          return existingSkill && typeof existingSkill === 'object'
            ? existingSkill
            : { name: s, level: 'Intermediate' };
        });

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          name: formData.name, email: formData.email, careerGoal: formData.careerGoal,
          learningHours: Number(formData.learningHours), learningStyle: formData.learningStyle,
          experience: formData.experience, currentSkills: skillsArray,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile.');

      setSuccess(true);
      setTimeout(() => window.location.reload(), 1000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "block w-full rounded-xl border border-[#292524] px-4 py-3 bg-[#1C1917]/60 text-white placeholder-[#57534E] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 text-sm transition-all";
  const labelClass = "block text-xs font-semibold text-[#78716C] uppercase tracking-wider mb-1.5";
  const selectClass = `${inputClass} cursor-pointer`;

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] flex">
      <Sidebar />

      <main className="flex-1 pl-0 md:pl-60 pt-14 md:pt-0 min-w-0">
        <div className="max-w-4xl mx-auto px-5 md:px-8 py-7 space-y-7 animate-fade-in">

          {/* Header */}
          <div className="border-b border-[#1C1917] pb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Account Profile</h1>
              <p className="text-sm text-[#78716C] mt-1">Manage your career settings, skills, and workspace details.</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <User className="h-5 w-5 text-orange-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

            {/* Left: Profile card */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl border border-[#1C1917] p-6 flex flex-col items-center text-center space-y-4">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-orange-500/20">
                  {getInitials(user?.name)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">{user?.name}</h2>
                  <p className="text-xs text-[#57534E]">{user?.email}</p>
                </div>

                {/* Stats */}
                <div className="w-full border-t border-[#1C1917] pt-4 space-y-2.5 text-left">
                  <div className="flex items-center gap-2.5 text-xs text-[#78716C]">
                    <Target className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                    <span className="truncate">Goal: <strong className="text-[#D6D3D1]">{user?.careerGoal || 'Not Set'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#78716C]">
                    <Clock className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                    <span>Study: <strong className="text-[#D6D3D1]">{user?.learningHours || 0} hrs/day</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#78716C]">
                    <BookOpen className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                    <span>Method: <strong className="text-[#D6D3D1]">{user?.learningStyle || 'Not Set'}</strong></span>
                  </div>
                </div>

                {/* Roadmap count */}
                {user?.roadmaps && user.roadmaps.length > 0 && (
                  <div className="w-full p-3 rounded-xl bg-orange-500/5 border border-orange-500/15 text-center">
                    <span className="text-xs text-orange-400 font-semibold">{user.roadmaps.length} roadmap{user.roadmaps.length > 1 ? 's' : ''} generated</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Edit form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl border border-[#1C1917] p-7 space-y-5"
              >
                <h3 className="text-sm font-bold text-white">Edit Profile Settings</h3>

                {success && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>Profile saved successfully! Reloading...</span>
                  </div>
                )}
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Full Name</label>
                      <input type="text" className={inputClass} value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div>
                      <label className={labelClass}>Email Address</label>
                      <input type="email" className={inputClass} value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Target Career Goal</label>
                    <input type="text" className={inputClass} placeholder="e.g. Senior Frontend Engineer"
                      value={formData.careerGoal} onChange={e => setFormData({ ...formData, careerGoal: e.target.value })} />
                  </div>

                  <div>
                    <label className={labelClass}>Current Skills (comma-separated)</label>
                    <input type="text" className={inputClass} placeholder="React, TypeScript, Node.js, Git"
                      value={formData.currentSkills} onChange={e => setFormData({ ...formData, currentSkills: e.target.value })} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Study Hours Per Day</label>
                      <input type="number" min="0.5" max="24" step="0.5" className={inputClass}
                        value={formData.learningHours} onChange={e => setFormData({ ...formData, learningHours: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>Learning Style</label>
                      <select className={selectClass} value={formData.learningStyle}
                        onChange={e => setFormData({ ...formData, learningStyle: e.target.value })}>
                        <option value="visual">Visual (Videos & Diagrams)</option>
                        <option value="practical">Practical (Coding Projects)</option>
                        <option value="textual">Textual (Reading docs & guides)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Experience Level</label>
                    <select className={selectClass} value={formData.experience}
                      onChange={e => setFormData({ ...formData, experience: e.target.value })}>
                      <option value="beginner">Beginner (No experience)</option>
                      <option value="intermediate">Intermediate (Student / Jr dev)</option>
                      <option value="advanced">Advanced (Experienced professional)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    id="save-profile-btn"
                    disabled={loading}
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 ${
                      loading
                        ? 'bg-[#1C1917] border border-[#292524] text-[#57534E] cursor-not-allowed'
                        : 'btn-primary'
                    }`}
                  >
                    {loading ? (
                      <><div className="w-4 h-4 rounded-full border-2 border-[#57534E]/30 border-t-[#78716C] animate-spin" /> Saving...</>
                    ) : 'Save Profile'}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
