
import React from 'react';
import { CompassLogo } from './ui/CompassLogo';
import { Button } from './ui/Button';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onStartPlanning: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartPlanning }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky header (approx 80px)
      const yOffset = -80; 
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center text-center px-4 pt-28 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        {/* Large static watermark logo */}
        <CompassLogo size={250} animate={false} className="md:w-[350px] md:h-[350px]" />
      </div>

      <div className="z-10 max-w-4xl space-y-3 md:space-y-2 flex flex-col items-center">
        {/* Main Logo - Animated */}
        <div className="mb-0">
          <CompassLogo size={48} animate={true} className="md:w-[60px] md:h-[60px]" />
        </div>
        
        {/* Main Headline - Cursive Hindi Slogan */}
        <h1 className="text-3xl md:text-5xl font-bold font-cursive text-trawell-green tracking-wide leading-tight drop-shadow-sm">
          Apka Safar, <span className="text-trawell-orange">Apka Andaz</span>
        </h1>
        
        {/* Subtext */}
        <p className="text-xs md:text-sm text-gray-600 max-w-xs md:max-w-lg mx-auto font-medium leading-relaxed">
          Personalized journeys powered by AI. Discover off-beat experiences designed exclusively for you.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-3 w-full sm:w-auto px-4 sm:px-0">
          <Button 
            className="px-5 py-2 text-sm w-full sm:w-auto"
            onClick={onStartPlanning}
          >
            Start Planning
            <ArrowRight size={14} />
          </Button>
          <Button 
            variant="outline" 
            className="px-5 py-2 text-sm w-full sm:w-auto"
            onClick={() => scrollToSection('featured-destinations')}
          >
            Explore Destinations
          </Button>
        </div>
      </div>
    </div>
  );
};
