
'use client';

import React, { useState } from 'react';
import { Building2, Plane, TrainFront, Bus, Clock, X } from 'lucide-react';
import { Button } from './ui/Button';

interface TravelServicesProps {
  onFlightsClick: () => void;
  onHotelsClick: () => void;
}

export const TravelServices: React.FC<TravelServicesProps> = ({ onFlightsClick, onHotelsClick }) => {
  const [comingSoonService, setComingSoonService] = useState<string | null>(null);

  const handleServiceClick = (id: string, label: string) => {
    if (id === 'flights') {
      onFlightsClick();
    } else if (id === 'hotels') {
      onHotelsClick();
    } else {
      setComingSoonService(label);
    }
  };

  const services = [
    { 
      id: 'hotels', 
      label: 'Hotels', 
      icon: Building2, 
    },
    { 
      id: 'flights', 
      label: 'Flights', 
      icon: Plane, 
    },
    { 
      id: 'trains', 
      label: 'Trains', 
      icon: TrainFront, 
    },
    { 
      id: 'bus', 
      label: 'Bus', 
      icon: Bus, 
    },
  ];

  return (
    <>
      <div className="w-full px-4 -mt-10 md:-mt-12 mb-6 md:mb-8 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-2 md:gap-4">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceClick(service.id, service.label)}
              className="
                flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 py-3 md:py-6 px-1 md:px-4
                bg-[#FBF6E9] rounded-xl md:rounded-3xl shadow-lg md:shadow-xl shadow-black/5 border-2 border-trawell-green
                group transition-all duration-300 outline-none
                hover:bg-trawell-green hover:-translate-y-1 hover:shadow-2xl
              "
            >
              <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white text-trawell-green group-hover:bg-white/20 group-hover:text-white transition-all duration-300 shadow-sm border border-trawell-green/10 group-hover:border-transparent shrink-0">
                <service.icon className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
              </div>
              <span className="text-[10px] md:text-sm font-bold text-trawell-green group-hover:text-white transition-colors uppercase tracking-wide truncate max-w-full">
                {service.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Coming Soon Popup */}
      {comingSoonService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-[#FBF6E9] rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl text-center border border-white/20 relative animate-in zoom-in-95 duration-200">
             <button 
                onClick={() => setComingSoonService(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-trawell-orange rounded-full hover:bg-black/5 transition-all"
             >
               <X size={20} />
             </button>

             <div className="w-20 h-20 bg-trawell-orange/10 text-trawell-orange rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={40} className="animate-pulse" />
             </div>
             
             <h3 className="text-2xl font-bold text-trawell-green mb-3">{comingSoonService}</h3>
             <p className="text-gray-600 mb-8 leading-relaxed">
               We are building the best {comingSoonService.toLowerCase()} booking experience for you. This feature will be available very soon!
             </p>
             
             <Button 
               fullWidth 
               onClick={() => setComingSoonService(null)}
               className="shadow-xl"
             >
               Notify Me When Ready
             </Button>
          </div>
        </div>
      )}
    </>
  );
};
