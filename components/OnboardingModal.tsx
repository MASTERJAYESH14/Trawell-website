'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { 
  Compass, Users, Coffee, Mountain, Sparkles, Utensils, MoreHorizontal,
  Tent, Landmark, Flower, ShoppingBag, BookOpen,
  Shuffle, CalendarClock, Scale, UserCog, Search,
  PauseCircle, BatteryCharging, Trophy, GraduationCap, Smile,
  Zap, MessageSquare, CheckCircle, Home, Check
} from 'lucide-react';
import { saveUserPreferences, OnboardingAnswers } from '../services/userService';
import { useAuth } from '../context/AuthContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUESTIONS = [
  {
    id: 'excitement',
    title: "What excites you most about traveling?",
    multi: true,
    options: [
      { id: 'exploring', label: "Exploring New Places", desc: "Discovering hidden gems and landscapes", icon: Compass },
      { id: 'people', label: "Meeting New People", desc: "Connecting with locals and travelers", icon: Users },
      { id: 'relaxing', label: "Relaxing", desc: "Peace, tranquility and rest", icon: Coffee },
      { id: 'adventure', label: "Adventure Activities", desc: "Thrills and adrenaline", icon: Mountain },
      { id: 'spiritual', label: "Spiritual Experiences", desc: "Inner peace and mindfulness", icon: Sparkles },
      { id: 'food_culture', label: "Food & Culture", desc: "Local cuisine and traditions", icon: Utensils },
      { id: 'other', label: "Other", desc: "Something else entirely", icon: MoreHorizontal },
    ]
  },
  {
    id: 'timeSpending',
    title: "How do you prefer to spend your time during a trip?",
    multi: true,
    options: [
      { id: 'outdoor', label: "Outdoor Adventures", desc: "Hiking, nature activities", icon: Tent },
      { id: 'historical', label: "Visiting Historical Sites", desc: "Museums, monuments, heritage", icon: Landmark },
      { id: 'yoga', label: "Meditation/Yoga", desc: "Mindfulness and wellness", icon: Flower },
      { id: 'shopping', label: "Shopping", desc: "Markets, malls, local crafts", icon: ShoppingBag },
      { id: 'socializing', label: "Socializing", desc: "Meeting people, nightlife", icon: Users },
      { id: 'reading', label: "Reading/Quiet Time", desc: "Peaceful, solo activities", icon: BookOpen },
      { id: 'other', label: "Other", desc: "Something else entirely", icon: MoreHorizontal },
    ]
  },
  {
    id: 'travelStyle',
    title: "Which statement best describes your travel style?",
    multi: false,
    options: [
      { id: 'spontaneous', label: "I love spontaneous plans", desc: "Go with the flow, no rigid schedules", icon: Shuffle },
      { id: 'planned', label: "I prefer a well-planned itinerary", desc: "Detailed schedules and bookings", icon: CalendarClock },
      { id: 'mix', label: "I like a mix of both", desc: "Some planning, some flexibility", icon: Scale },
      { id: 'others_plan', label: "I prefer someone else to plan", desc: "I'm happy to go with a plan someone else makes", icon: UserCog },
      { id: 'research', label: "I research deeply before traveling", desc: "I enjoy exploring every detail beforehand", icon: Search },
    ]
  },
  {
    id: 'travelRole',
    title: "What role does travel play in your life right now?",
    multi: true,
    options: [
      { id: 'break_from_grind', label: "A break from the grind", desc: "I just need to escape the routine", icon: PauseCircle },
      { id: 'reconnect_with_myself', label: "A way to reconnect with myself", desc: "I use travel to reflect and reset", icon: BatteryCharging },
      { id: 'reward_for_work', label: "My reward after working hard", desc: "Travel as a well-earned treat", icon: Trophy },
      { id: 'learn_and_grow', label: "A path to learn and grow", desc: "New skills, cultures, perspectives", icon: GraduationCap },
      { id: 'just_fun', label: "Just pure joy and fun", desc: "No agenda—just enjoyment!", icon: Smile },
    ]
  },
  {
    id: 'newThingsAttitude',
    title: "How do you feel about trying new things (food, activities, experiences)?",
    multi: false,
    options: [
      { id: 'always_excited', label: "Always Excited", desc: "Bring on the new experiences!", icon: Zap },
      { id: 'sometimes', label: "Sometimes", desc: "Depends on my mood and situation", icon: MessageSquare },
      { id: 'comfortable', label: "Only if Comfortable", desc: "When I feel safe and ready", icon: CheckCircle },
      { id: 'familiar', label: "Prefer Familiar Things", desc: "I like what I know and trust", icon: Home },
    ]
  }
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  // Selections are now stored as arrays of strings for all questions to handle multi-select easily
  // For single select, it will be an array of length 1
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  if (!isOpen) return null;

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;
  const currentSelection = selections[currentQuestion.id] || [];

  const handleSelect = (optionId: string) => {
    setSelections(prev => {
      const current = prev[currentQuestion.id] || [];
      
      if (currentQuestion.multi) {
        // Toggle behavior for multi-select
        if (current.includes(optionId)) {
          return { ...prev, [currentQuestion.id]: current.filter(id => id !== optionId) };
        } else {
          return { ...prev, [currentQuestion.id]: [...current, optionId] };
        }
      } else {
        // Replace behavior for single-select
        return { ...prev, [currentQuestion.id]: [optionId] };
      }
    });
  };

  const getUserLocation = (): Promise<GeolocationPosition | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        () => resolve(null), // Fail silently if denied
        { timeout: 5000 }
      );
    });
  };

  const handleNext = async () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finish
      setIsSaving(true);
      try {
        if (user) {
          // 1. Get Location
          const location = await getUserLocation();

          // 2. Format Data: Convert arrays to comma-separated strings
          const formattedAnswers: OnboardingAnswers = {
            excitement: (selections['excitement'] || []).join(','),
            timeSpending: (selections['timeSpending'] || []).join(','),
            travelStyle: (selections['travelStyle'] || [])[0] || '',
            travelRole: (selections['travelRole'] || []).join(','),
            newThingsAttitude: (selections['newThingsAttitude'] || [])[0] || '',
          };

          const userData = { 
            email: user.email, 
            name: user.displayName,
            location: location ? { 
              lat: location.coords.latitude, 
              lng: location.coords.longitude 
            } : undefined
          };
          
          await saveUserPreferences(user.uid, formattedAnswers, userData);
        }
      } catch (e) {
        console.error("Failed to save preferences", e);
      } finally {
        setIsSaving(false);
        onClose();
      }
    }
  };

  const handleSkip = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4 bg-trawell-bg/95 backdrop-blur-sm transition-all animate-in fade-in duration-300">
      <div className="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-md bg-[#FBF6E9] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex items-center justify-between">
          {currentStep > 0 ? (
            <button onClick={handleBack} className="text-gray-500 hover:text-gray-800 font-medium">← Back</button>
          ) : (
            <div className="w-8" />
          )}
          <button onClick={handleSkip} className="text-gray-400 hover:text-trawell-orange font-medium">Skip</button>
        </div>

        {/* Title Section */}
        <div className="px-6 pb-2">
           <div className="flex justify-between items-end mb-2">
             <h2 className="text-xl font-bold text-trawell-green">Your Travel Preferences</h2>
             <span className="text-gray-400 font-medium text-sm">{currentStep + 1}/{QUESTIONS.length}</span>
           </div>
           {/* Progress Bar */}
           <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
             <div 
                className="h-full bg-trawell-green transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
             ></div>
           </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <h3 className="text-2xl font-bold text-trawell-green mb-2 leading-tight">
            {currentQuestion.title}
          </h3>
          {currentQuestion.multi && (
            <p className="text-sm text-gray-500 mb-6 font-medium">Select all that apply</p>
          )}

          <div className="space-y-3 pb-8">
            {currentQuestion.options.map((option) => {
              const Icon = option.icon;
              const isSelected = currentSelection.includes(option.id);

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center gap-4 group relative ${
                    isSelected 
                      ? 'bg-trawell-green/5 border-trawell-green shadow-sm' 
                      : 'bg-white border-transparent hover:border-gray-200 shadow-sm'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                    isSelected ? 'bg-trawell-green text-white' : 'bg-gray-100 text-trawell-green group-hover:bg-gray-200'
                  }`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm md:text-base ${isSelected ? 'text-trawell-green' : 'text-gray-800'}`}>
                      {option.label}
                    </p>
                    {option.desc && (
                      <p className="text-xs text-gray-500 mt-0.5">{option.desc}</p>
                    )}
                  </div>
                  {/* Checkmark for multi-select */}
                  {isSelected && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-trawell-green">
                      <Check size={20} className="stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-2 bg-[#FBF6E9] md:rounded-b-3xl">
          <Button 
            fullWidth 
            onClick={handleNext}
            disabled={currentSelection.length === 0}
            className="shadow-xl"
          >
            {currentStep === QUESTIONS.length - 1 ? (isSaving ? 'Saving...' : 'Finish') : 'Next'}
          </Button>
        </div>

      </div>
    </div>
  );
};