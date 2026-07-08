import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route protection wrapper. Checks AuthContext to see if user is logged in.
 * If not logged in, redirects browser context to /login.
 * If user profile has not completed onboarding, redirects to /onboarding.
 */
export default function ProtectedRoute({ children }) {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-gray-500 space-y-4">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/10 border-t-indigo-500 animate-spin" />
        </div>
        <span className="text-xs tracking-wider animate-pulse">Initializing path pilot session...</span>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to onboarding if incomplete
  if (user && !user.onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
