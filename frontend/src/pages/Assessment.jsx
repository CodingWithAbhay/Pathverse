import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, Check, Sparkles, Wand2, X, ArrowLeft, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import Step1Personal    from '../components/Assessment/Step1Personal';
import Step2Education   from '../components/Assessment/Step2Education';
import Step3Skills      from '../components/Assessment/Step3Skills';
import Step4CareerGoal  from '../components/Assessment/Step4CareerGoal';
import Step5Experience  from '../components/Assessment/Step5Experience';
import Step6LearningHours from '../components/Assessment/Step6LearningHours';
import Step7LearningStyle from '../components/Assessment/Step7LearningStyle';
import Step8Summary     from '../components/Assessment/Step8Summary';

import { API_URL } from '../services/apiClient';

const STEPS_CONFIG = [
  { id: 1, label: 'Profile'     },
  { id: 2, label: 'Education'   },
  { id: 3, label: 'Skills'      },
  { id: 4, label: 'Career Goal' },
  { id: 5, label: 'Experience'  },
  { id: 6, label: 'Hours'       },
  { id: 7, label: 'Style'       },
  { id: 8, label: 'Review'      },
];

export default function Assessment() {
  const { currentStep, nextStep, prevStep, setStep, formData, submitAssessment } = useAssessment();
  const { user, token, reloadProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]               = useState('');
  const [isSuccess, setIsSuccess]       = useState(false);

  useEffect(() => {
    setError('');
  }, [currentStep]);

  const getStepComponent = () => {
    switch (currentStep) {
      case 1: return <Step1Personal />;
      case 2: return <Step2Education />;
      case 3: return <Step3Skills />;
      case 4: return <Step4CareerGoal />;
      case 5: return <Step5Experience />;
      case 6: return <Step6LearningHours />;
      case 7: return <Step7LearningStyle />;
      case 8: return <Step8Summary />;
      default: return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (currentStep === 8) {
      const ok = submitAssessment();
      if (!ok) {
        setError('Please go back and fix the validation errors on previous steps.');
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await fetch(`${API_URL}/api/roadmap/generate`, {
          method: 'POST',
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            name:      formData.name,
            education: {
              degree:       formData.education.degree,
              fieldOfStudy: formData.education.fieldOfStudy,
              institution:  formData.education.institution,
              gradYear:     formData.education.gradYear,
            },
            skills: formData.skills,
            goal: {
              targetRole: formData.careerGoal.targetRole,
              industry:   formData.careerGoal.industry,
              timeline:   formData.careerGoal.timeline,
            },
            experience: {
              level:       formData.experience.level,
              years:       formData.experience.years,
              currentRole: formData.experience.currentRole || 'N/A',
              description: formData.experience.description || 'N/A',
            },
            hoursPerDay:   Number(formData.learningHours.hoursPerDay),
            learningStyle: {
              primaryStyle: formData.learningStyle.primaryStyle,
              pace:         formData.learningStyle.pace,
              resources:    formData.learningStyle.resources,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Roadmap generation failed.');
        }

        await reloadProfile();
        setIsSuccess(true);

      } catch (err) {
        setError(err.message || 'An error occurred during roadmap generation. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      nextStep();
    }
  };

  const handleCancel = () => {
    if (user?.onboardingCompleted) {
      navigate('/dashboard');
    } else {
      logout();
      navigate('/login');
    }
  };

  const progressPercentage = (currentStep / STEPS_CONFIG.length) * 100;

  // ── Success Screen ──
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0C0A09] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/6 rounded-full blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-card rounded-2xl p-8 border border-orange-500/20 text-center relative z-10 space-y-6"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

          <div className="mx-auto w-16 h-16 bg-orange-500/10 text-orange-400 rounded-full flex items-center justify-center border border-orange-500/20 shadow-lg shadow-orange-500/10">
            <Check className="h-8 w-8 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Roadmap Generated!</h1>
            <p className="text-sm text-[#78716C] leading-relaxed">
              Your personalized AI learning path has been created and saved to your dashboard.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/15 text-orange-300/80 text-xs flex items-center gap-2 justify-center">
            <Sparkles className="h-4 w-4 text-orange-400 shrink-0" />
            <span>Dashboard synced and ready to use.</span>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary w-full py-3.5"
          >
            Go to Dashboard <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Assessment Wizard ──
  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4  w-96 h-96 bg-orange-500/5  rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10 flex flex-col gap-6">

        {/* Top header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1C1917]">
          <Link to="/" className="flex items-center gap-2">
            <img src="/icon.png" alt="Pathvexa" className="h-7 w-auto" />
          </Link>

          <div className="flex items-center gap-2">
            {user?.onboardingCompleted && (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-3 py-1.5 rounded-xl bg-[#1C1917] hover:bg-[#292524] text-[#78716C] text-xs font-semibold flex items-center gap-1.5 border border-[#292524] transition-all cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
            )}
            <span className="text-xs font-semibold text-[#57534E] tracking-widest uppercase">
              Step {currentStep}/{STEPS_CONFIG.length}
            </span>
          </div>
        </div>

        {/* Desktop step indicators */}
        <div className="hidden md:flex items-center justify-between px-1">
          {STEPS_CONFIG.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive    = currentStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setStep(step.id)}
                className="flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer group"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center border text-xs font-bold transition-all duration-200 ${
                  isCompleted
                    ? 'bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-500/20'
                    : isActive
                    ? 'border-orange-500/60 bg-[#1C1917] text-orange-400 ring-2 ring-orange-500/15'
                    : 'border-[#292524] bg-[#0C0A09] text-[#44403C] group-hover:border-[#44403C] group-hover:text-[#78716C]'
                }`}>
                  {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : step.id}
                </div>
                <span className={`text-[9px] font-bold tracking-wide uppercase transition-colors ${
                  isActive ? 'text-orange-400' : 'text-[#44403C] group-hover:text-[#78716C]'
                }`}>
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>

        {/* Error alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <X className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Wizard card */}
        <form
          onSubmit={handleSubmit}
          className="glass-card rounded-2xl border border-[#292524] p-6 md:p-8 flex flex-col min-h-[420px] justify-between"
        >
          {/* Step content */}
          <div className="flex-1 pb-8">
            <AnimatePresence mode="wait">
              {getStepComponent()}
            </AnimatePresence>
          </div>

          {/* Form navigation */}
          <div className="border-t border-[#1C1917] pt-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  currentStep === 1
                    ? 'opacity-30 cursor-not-allowed text-[#57534E] border-[#1C1917]'
                    : 'text-[#D6D3D1] bg-[#1C1917] hover:border-[#292524] hover:text-white border-[#292524]'
                }`}
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-red-900/20 bg-red-950/5 text-red-400 hover:bg-red-950/10 text-sm font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-5 py-2.5 text-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Generating...
                </>
              ) : currentStep === 8 ? (
                <>
                  <Wand2 className="h-4 w-4" /> Generate Roadmap
                </>
              ) : (
                <>
                  Next <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
