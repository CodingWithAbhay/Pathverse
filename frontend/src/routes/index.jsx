import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { AssessmentProvider } from '../context/AssessmentContext';

// Performance optimization: Lazy load components for production bundles
const Landing   = lazy(() => import('../pages/Landing'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Assessment = lazy(() => import('../pages/Assessment'));
const ResumeAnalyzer = lazy(() => import('../pages/ResumeAnalyzer'));
const Login     = lazy(() => import('../pages/Login'));
const Register  = lazy(() => import('../pages/Register'));
const Profile   = lazy(() => import('../pages/Profile'));
const Settings  = lazy(() => import('../pages/Settings'));

// Global suspense fallback loader
const PageSuspense = ({ children }) => (
  <Suspense
    fallback={
      <div className="min-h-screen bg-[#0C0A09] flex flex-col items-center justify-center space-y-4">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-orange-500/10 border-t-orange-500 animate-spin" />
          <div className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-orange-500/50" />
          </div>
        </div>
        <span className="text-xs text-[#78716C] tracking-wider animate-pulse">Loading Pathvexa...</span>
      </div>
    }
  >
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PageSuspense>
        <Landing />
      </PageSuspense>
    ),
  },
  {
    path: '/login',
    element: (
      <PageSuspense>
        <Login />
      </PageSuspense>
    ),
  },
  {
    path: '/register',
    element: (
      <PageSuspense>
        <Register />
      </PageSuspense>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <PageSuspense>
          <Dashboard />
        </PageSuspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/assessment',
    element: (
      <ProtectedRoute>
        <AssessmentProvider>
          <PageSuspense>
            <Assessment />
          </PageSuspense>
        </AssessmentProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute>
        <AssessmentProvider>
          <PageSuspense>
            <Assessment />
          </PageSuspense>
        </AssessmentProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: '/resume',
    element: (
      <ProtectedRoute>
        <PageSuspense>
          <ResumeAnalyzer />
        </PageSuspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <PageSuspense>
          <Profile />
        </PageSuspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <PageSuspense>
          <Settings />
        </PageSuspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
