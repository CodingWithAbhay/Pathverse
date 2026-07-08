import React, { createContext, useContext, useState } from 'react';

const AssessmentContext = createContext(null);

const initialFormState = {
  name: '',
  education: {
    degree: '',
    fieldOfStudy: '',
    institution: '',
    gradYear: '',
  },
  skills: [], // array of skill objects, e.g. { name: '', level: 'Beginner' }
  careerGoal: {
    targetRole: '',
    industry: '',
    timeline: '6 months', // 3 months, 6 months, 1 year, 2+ years
  },
  experience: {
    level: 'Entry', // Entry, Mid, Senior, Career Changer
    years: '',
    currentRole: '',
    description: '',
  },
  learningHours: {
    hoursPerDay: '2', // hours per day
    daysPerWeek: '5',
    preferredTime: 'Evening', // Morning, Afternoon, Evening, Weekend
  },
  learningStyle: {
    primaryStyle: 'Practical', // Practical, Visual, Theoretical, Mentorship
    pace: 'Moderate', // Fast, Moderate, Self-paced
    resources: [], // video, articles, documentation, books
  },
};

export const AssessmentProvider = ({ children }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const updateFormData = (section, data) => {
    setFormData((prev) => {
      if (typeof data === 'object' && !Array.isArray(data)) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            ...data,
          },
        };
      }
      return {
        ...prev,
        [section]: data,
      };
    });

    // Clear validation error when user updates
    if (errors[section]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[section];
        return newErrors;
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          newErrors.name = 'Full name is required';
        } else if (formData.name.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        }
        break;
      case 2:
        if (!formData.education.degree.trim()) newErrors.degree = 'Degree is required';
        if (!formData.education.fieldOfStudy.trim()) newErrors.fieldOfStudy = 'Field of study is required';
        if (!formData.education.institution.trim()) newErrors.institution = 'Institution is required';
        if (!formData.education.gradYear) {
          newErrors.gradYear = 'Graduation year is required';
        } else {
          const year = parseInt(formData.education.gradYear, 10);
          const currentYear = new Date().getFullYear();
          if (isNaN(year) || year < 1950 || year > currentYear + 10) {
            newErrors.gradYear = 'Please enter a valid graduation year';
          }
        }
        break;
      case 3:
        if (formData.skills.length === 0) {
          newErrors.skills = 'Please add at least one current skill';
        }
        break;
      case 4:
        if (!formData.careerGoal.targetRole.trim()) newErrors.targetRole = 'Target career role is required';
        if (!formData.careerGoal.industry.trim()) newErrors.industry = 'Industry/Domain is required';
        break;
      case 5:
        if (formData.experience.years === '') {
          newErrors.years = 'Years of experience is required';
        } else {
          const yrs = parseFloat(formData.experience.years);
          if (isNaN(yrs) || yrs < 0 || yrs > 50) {
            newErrors.years = 'Please enter valid years of experience (0 - 50)';
          }
        }
        break;
      case 6:
        const hours = parseFloat(formData.learningHours.hoursPerDay);
        if (isNaN(hours) || hours <= 0 || hours > 24) {
          newErrors.hoursPerDay = 'Please enter learning hours between 1 and 24';
        }
        break;
      case 7:
        if (!formData.learningStyle.primaryStyle) {
          newErrors.primaryStyle = 'Please select a primary learning style';
        }
        break;
      case 8:
        // Summary step - final check before submitting
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 8) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const setStep = (step) => {
    if (step >= 1 && step <= 8) {
      // Validate all previous steps
      let isValid = true;
      for (let i = 1; i < step; i++) {
        if (!validateStep(i)) {
          setCurrentStep(i);
          isValid = false;
          break;
        }
      }
      if (isValid) {
        setCurrentStep(step);
      }
    }
  };

  const submitAssessment = () => {
    let isValid = true;
    for (let i = 1; i <= 7; i++) {
      if (!validateStep(i)) {
        setCurrentStep(i);
        isValid = false;
        break;
      }
    }
    if (isValid) {
      console.log('Final Assessment Submitted:', formData);
      return true;
    }
    return false;
  };

  return (
    <AssessmentContext.Provider
      value={{
        formData,
        updateFormData,
        currentStep,
        nextStep,
        prevStep,
        setStep,
        errors,
        submitAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};
