'use client';

import React, { useState } from 'react';
import { X, Sparkles, MapPin, Calendar, Clock, Navigation } from 'lucide-react';
import { Button } from './ui/Button';
import { CompassLogo } from './ui/CompassLogo';
import { generateItinerary } from '../services/geminiService';

interface PlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DayPlan {
  day: number;
  activities: string[];
}

interface ItineraryResult {
  destination: string;
  days: DayPlan[];
}

export const PlannerModal: React.FC<PlannerModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [preferences, setPreferences] = useState('');
  const [itinerary, setItinerary] = useState<ItineraryResult | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!preferences.trim()) return;
    
    setStep('loading');
    
    // Minimum loading time to show off the cool animation
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const [resultStr] = await Promise.all([
        generateItinerary(preferences),
        minLoadTime
      ]);
      
      // Clean the response string in case it has markdown code blocks
      const cleanJson = resultStr.replace(/```json/g, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleanJson);
      
      setItinerary(result);
      setStep('result');
    } catch (e) {
      console.error("Failed to generate plan", e);
      // Go back to input on error (in a real app, show an error message)
      setStep('input');
    }
  };

  const reset = () => {
    setStep('input');
    setPreferences('');
    setItinerary(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-trawell-dark/60 backdrop-blur-sm transition-all">
      <div className={`bg-[#FBF6E9] w-full ${step === 'result' ? 'max-w-4xl' : 'max-w-xl'} rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transition-all duration-500`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-trawell-orange/10 bg-white">
          <div className="flex items-center gap-2">
            <CompassLogo size={32} />
            <span className="font-bold text-trawell-green text-lg">AI Travel Agent</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {step === 'input' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-trawell-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-trawell-orange">
                  <Sparkles size={32} />
                </div>
                <h3 className="text-2xl font-bold text-trawell-green">Plan Your Dream Trip</h3>
                <p className="text-gray-600">
                  Tell us where you want to go, who you're with, and what you love. Our AI will craft a bespoke itinerary in seconds.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 ml-1">Your Preferences</label>
                <textarea 
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="e.g., A 3-day romantic trip to Udaipur with a focus on lakes, heritage hotels, and authentic Rajasthani food..."
                  className="w-full h-40 p-4 rounded-2xl border-2 border-transparent bg-white shadow-sm focus:border-trawell-orange/50 focus:ring-0 resize-none text-gray-700 placeholder:text-gray-400 text-lg transition-all"
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={!preferences.trim()}
                fullWidth 
                className="py-4 text-lg shadow-trawell-orange/20"
              >
                Generate Itinerary
              </Button>
            </div>
          )}

          {step === 'loading' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-8 animate-in fade-in duration-500">
              <CompassLogo size={120} animate={true} />
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-trawell-green">Charting Your Course...</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  Analysing local gems, weather patterns, and your unique style.
                </p>
              </div>
            </div>
          )}

          {step === 'result' && itinerary && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-trawell-orange font-bold uppercase tracking-wider text-sm">Destination</span>
                  <h2 className="text-3xl md:text-4xl font-cursive font-bold text-trawell-green">{itinerary.destination}</h2>
                </div>
                <div className="flex gap-2">
                   <Button variant="outline" onClick={reset}>Plan Another</Button>
                   <Button>Save Trip</Button>
                </div>
              </div>

              <div className="space-y-8 relative">
                {/* Vertical Line */}
                <div className="absolute left-4 md:left-8 top-4 bottom-4 w-0.5 bg-trawell-green/20"></div>

                {itinerary.days.map((day, idx) => (
                  <div key={idx} className="relative flex gap-6 md:gap-8 group">
                    {/* Day Marker */}
                    <div className="flex-shrink-0 w-8 h-8 md:w-16 md:h-16 rounded-full bg-trawell-bg border-2 border-trawell-green flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform bg-[#FBF6E9]">
                       <span className="font-bold text-trawell-green text-xs md:text-lg">D{day.day}</span>
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                       <h4 className="text-lg font-bold text-trawell-green mb-4 flex items-center gap-2">
                         <Calendar size={18} className="text-trawell-orange" />
                         Day {day.day} Agenda
                       </h4>
                       <ul className="space-y-4">
                         {day.activities.map((activity, actIdx) => (
                           <li key={actIdx} className="flex gap-3 text-gray-600">
                             <div className="mt-1 min-w-4">
                               <div className="w-2 h-2 rounded-full bg-trawell-orange"></div>
                             </div>
                             <span className="leading-relaxed">{activity}</span>
                           </li>
                         ))}
                       </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};