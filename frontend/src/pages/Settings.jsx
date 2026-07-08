import React, { useState } from 'react';
import Sidebar from '../components/Dashboard/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Settings, Shield, Bell, Moon, User, LogOut, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import { API_URL } from '../services/apiClient';

export default function SettingsPage() {
  const { user, logout, token } = useAuth();
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword:  '',
    newPassword:      '',
    confirmPassword:  '',
  });

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    if (passwords.newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ password: passwords.newPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update credentials.');

      setSuccess(true);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "block w-full rounded-xl border border-[#292524] px-4 py-3 bg-[#1C1917]/60 text-white placeholder-[#57534E] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 text-sm transition-all";

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] flex">
      <Sidebar />

      <main className="flex-1 pl-0 md:pl-60 pt-14 md:pt-0 min-w-0">
        <div className="max-w-3xl mx-auto px-5 md:px-8 py-7 space-y-7 animate-fade-in">

          {/* Header */}
          <div className="border-b border-[#1C1917] pb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Settings</h1>
              <p className="text-sm text-[#78716C] mt-1">Manage account preferences and security settings.</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Settings className="h-5 w-5 text-orange-400" />
            </div>
          </div>

          <div className="space-y-4">

            {/* Visual Theme */}
            <div className="glass-card rounded-2xl border border-[#1C1917] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#1C1917] border border-[#292524] flex items-center justify-center shrink-0">
                  <Moon className="h-4.5 w-4.5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Visual Theme</h3>
                  <p className="text-xs text-[#57534E] mt-0.5">Toggle display theme styles.</p>
                </div>
              </div>
              <div className="flex items-center bg-[#1C1917] border border-[#292524] rounded-xl p-1 shrink-0">
                <button className="px-3.5 py-2 rounded-lg text-xs font-bold bg-orange-500 text-white shadow-sm">
                  Dark (Active)
                </button>
                <button className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#57534E] cursor-not-allowed">
                  Light
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="glass-card rounded-2xl border border-[#1C1917] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#1C1917] border border-[#292524] flex items-center justify-center shrink-0">
                  <Bell className="h-4.5 w-4.5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Notifications</h3>
                  <p className="text-xs text-[#57534E] mt-0.5">Roadmap alerts and status logs.</p>
                </div>
              </div>
              <span className="text-xs text-orange-400 font-bold bg-orange-500/10 border border-orange-500/15 px-3 py-1.5 rounded-lg shrink-0">
                Enabled
              </span>
            </div>

            {/* Security */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl border border-[#1C1917] p-7 space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1C1917] border border-[#292524] flex items-center justify-center">
                  <Shield className="h-4.5 w-4.5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Security Credentials</h3>
                  <p className="text-xs text-[#57534E] mt-0.5">Modify account passwords.</p>
                </div>
              </div>

              {success && (
                <div className="p-3.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>Password updated successfully!</span>
                </div>
              )}
              {error && (
                <div className="p-3.5 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-sm">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#78716C] uppercase tracking-wider">New Password</label>
                  <input type="password" className={inputClass} placeholder="••••••••"
                    value={passwords.newPassword}
                    onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#78716C] uppercase tracking-wider">Confirm Password</label>
                  <input type="password" className={inputClass} placeholder="••••••••"
                    value={passwords.confirmPassword}
                    onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })} required />
                </div>
                <button
                  type="submit"
                  id="change-password-btn"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 ${
                    loading
                      ? 'bg-[#1C1917] border border-[#292524] text-[#57534E] cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {loading ? (
                    <><div className="w-4 h-4 rounded-full border-2 border-[#57534E]/30 border-t-[#78716C] animate-spin" /> Updating...</>
                  ) : 'Change Password'}
                </button>
              </form>
            </motion.div>

            {/* Danger Zone */}
            <div className="glass-card rounded-2xl border border-red-900/15 bg-red-950/4 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-red-950/10 border border-red-900/20 flex items-center justify-center shrink-0">
                  <User className="h-4.5 w-4.5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Danger Zone</h3>
                  <p className="text-xs text-[#57534E] mt-0.5">Sign out of your active session.</p>
                </div>
              </div>
              <button
                id="sign-out-btn"
                onClick={logout}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-900/15 hover:bg-red-900/25 text-red-400 border border-red-900/25 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
