import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, Settings, User, LogOut, FileText, Menu, X, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { name: 'Dashboard',       path: '/dashboard',  icon: LayoutDashboard },
  { name: 'Assessment',      path: '/onboarding', icon: ClipboardList   },
  { name: 'Resume Analyzer', path: '/resume',     icon: FileText        },
  { name: 'Profile',         path: '/profile',    icon: User            },
  { name: 'Settings',        path: '/settings',   icon: Settings        },
];

function getInitials(fullName) {
  if (!fullName) return 'G';
  return fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

function NavLinks({ onItemClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="space-y-0.5">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <button
            key={item.name}
            id={`nav-${item.name.toLowerCase().replace(/\s/g, '-')}`}
            onClick={() => {
              navigate(item.path);
              if (onItemClick) onItemClick();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer relative group ${
              isActive
                ? 'text-white bg-gradient-to-r from-orange-500/15 to-orange-500/5 border border-orange-500/20'
                : 'text-[#78716C] hover:text-[#D6D3D1] hover:bg-[#1C1917]/80 border border-transparent'
            }`}
          >
            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute left-0 w-0.5 h-5 bg-orange-500 rounded-r-full"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <Icon
              className={`h-4 w-4 shrink-0 transition-colors ${
                isActive ? 'text-orange-400' : 'text-[#57534E] group-hover:text-[#78716C]'
              }`}
            />
            <span className="flex-1 text-left">{item.name}</span>
            {isActive && <ChevronRight className="h-3 w-3 text-orange-500/50 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

function UserFooter({ user, logout, onLogout }) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#1C1917] transition-colors group">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-md shadow-orange-500/20">
        {getInitials(user?.name)}
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white truncate leading-tight">{user?.name || 'Guest User'}</p>
        <p className="text-[10px] text-[#57534E] truncate">{user?.email || 'Offline'}</p>
      </div>
      {/* Logout */}
      <button
        onClick={onLogout || logout}
        title="Sign Out"
        className="text-[#57534E] hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/5 cursor-pointer shrink-0"
      >
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function Sidebar() {
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Mobile Top Bar ── */}
      <div className="md:hidden w-full bg-[#0C0A09]/95 backdrop-blur-md border-b border-[#1C1917] h-14 fixed top-0 left-0 z-30 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="Pathvexa" className="h-7 w-auto" />
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-[#1C1917] text-[#78716C] hover:text-white border border-[#292524] transition-colors"
        >
          {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
        </button>
      </div>

      {/* ── Desktop Fixed Sidebar ── */}
      <aside className="hidden md:flex w-60 bg-[#0C0A09] border-r border-[#1C1917] flex-col h-screen fixed left-0 top-0 z-20 shrink-0">
        {/* Brand */}
        <div className="h-14 px-4 border-b border-[#1C1917] flex items-center gap-3 relative">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent" />
          <img src="/icon.png" alt="Pathvexa" className="h-7 w-auto shrink-0" />
          
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="mb-3 px-1">
            <span className="text-[9px] font-bold text-[#44403C] uppercase tracking-widest">Navigation</span>
          </div>
          <NavLinks />
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-[#1C1917]">
          <UserFooter user={user} logout={logout} />
        </div>
      </aside>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.28 }}
              className="md:hidden fixed inset-y-0 left-0 w-72 bg-[#0C0A09] border-r border-[#1C1917] z-50 flex flex-col"
            >
              {/* Drawer header */}
              <div className="h-14 px-4 border-b border-[#1C1917] flex items-center justify-between relative">
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent" />
                <div className="flex items-center gap-3">
                  <img src="/icon.png" alt="Pathvexa" className="h-7 w-auto" />
                  <div className="flex flex-col leading-none">
                    <span className="text-[11px] font-black text-white tracking-tight">Pathvexa</span>
                    <span className="text-[9px] font-semibold text-[#57534E] uppercase tracking-widest">beta</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-[#78716C] hover:text-white hover:bg-[#1C1917] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Nav */}
              <nav className="flex-1 px-3 py-4 overflow-y-auto">
                <div className="mb-3 px-1">
                  <span className="text-[9px] font-bold text-[#44403C] uppercase tracking-widest">Navigation</span>
                </div>
                <NavLinks onItemClick={() => setMobileOpen(false)} />
              </nav>

              {/* User */}
              <div className="p-3 border-t border-[#1C1917]">
                <UserFooter
                  user={user}
                  logout={logout}
                  onLogout={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
