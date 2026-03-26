
import React from 'react';
import { MISSION_TEXT, VISION_TEXT } from '../constants';
import { Telescope, Compass } from 'lucide-react';

export const VisionMission: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-0">
      
      {/* Vision Section */}
      <section className="py-12 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-trawell-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-20">
            {/* Icon/Visual Left */}
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="relative w-40 h-40 md:w-80 md:h-80 bg-trawell-bg rounded-full flex items-center justify-center shadow-inner">
                <div className="absolute inset-0 border-2 border-dashed border-trawell-orange/30 rounded-full animate-spin-slow"></div>
                <Telescope className="text-trawell-orange w-16 h-16 md:w-32 md:h-32" strokeWidth={1} />
              </div>
            </div>

            {/* Content Right */}
            <div className="flex-1 text-center md:text-left space-y-4 md:space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-trawell-orange/10 text-trawell-orange font-bold text-xs md:text-sm tracking-wider uppercase">
                Our Vision
              </span>
              <h2 className="text-2xl md:text-5xl font-bold text-trawell-green">
                The Future of Travel
              </h2>
              <p className="text-sm md:text-xl text-gray-600 leading-relaxed font-light">
                {VISION_TEXT}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-24 bg-trawell-green text-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12 lg:gap-20">
            
            {/* Content Left */}
            <div className="flex-1 text-center md:text-left space-y-4 md:space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-trawell-orange font-bold text-xs md:text-sm tracking-wider uppercase">
                Our Mission
              </span>
              <h2 className="text-2xl md:text-5xl font-bold text-white">
                Beyond the Ordinary
              </h2>
              <p className="text-sm md:text-xl text-white/80 leading-relaxed font-light">
                {MISSION_TEXT}
              </p>
            </div>

            {/* Icon/Visual Right */}
            <div className="flex-1 flex justify-center md:justify-start">
               <div className="relative w-40 h-40 md:w-80 md:h-80 bg-white/5 rounded-3xl rotate-3 flex items-center justify-center backdrop-blur-sm border border-white/10">
                <div className="absolute -inset-4 bg-trawell-orange/20 rounded-3xl -rotate-6 -z-10"></div>
                <Compass className="text-white w-16 h-16 md:w-32 md:h-32" strokeWidth={1} />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
