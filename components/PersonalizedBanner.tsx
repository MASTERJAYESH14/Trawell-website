
import React from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';

interface PersonalizedBannerProps {
  onOpenPlanner: () => void;
}

export const PersonalizedBanner: React.FC<PersonalizedBannerProps> = ({ onOpenPlanner }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 mb-6 md:mb-8">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-trawell-orange to-trawell-green shadow-xl p-4 md:p-8 text-white">
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Sparkles className="text-white w-3 h-3 md:w-4 md:h-4" />
              </div>
              <h2 className="text-lg md:text-2xl font-bold">Personalized Itinerary</h2>
            </div>
            <p className="text-white/90 text-xs md:text-base max-w-xl">
              Tailored journeys just for you. Chat with us to build your perfect trip instantly.
            </p>
          </div>
          
          <button 
            onClick={onOpenPlanner}
            className="w-full md:w-auto bg-white text-trawell-green font-bold py-2 md:py-2.5 px-4 md:px-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-xs md:text-sm whitespace-nowrap flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} className="fill-current" />
            Chat Now
          </button>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};
