
'use client';

import React, { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { CompassLogo } from './ui/CompassLogo';

interface CustomPlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomPlanningModal: React.FC<CustomPlanningModalProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleWhatsApp = () => {
    const phoneNumber = "919056454920";
    
    // Logic: If user wrote something, send that. If not, send default.
    const text = message.trim().length > 0
      ? `Hi Trawell, I'm interested in planning a trip. Here are my preferences:\n\n${message}`
      : "Hi Trawell, I'm interested in planning a trip. Can you help me?";
    
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-trawell-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FBF6E9] rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 flex flex-col items-center">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-trawell-orange hover:bg-white/50 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <div className="mb-4">
          <CompassLogo size={56} animate={true} />
        </div>
        
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-2xl font-bold text-trawell-green font-sans">Let's Plan Your Trip</h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
             Tell us what you're looking for, and our experts will chat with you on WhatsApp to build your perfect itinerary.
          </p>
        </div>
        
        <div className="w-full space-y-4">
          <div className="relative">
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ex: I want a 5-day trip to Kerala in December with my family. Budget around 50k. We love nature and food..."
                className="w-full h-36 p-4 rounded-2xl border border-gray-200 focus:border-trawell-orange/50 focus:ring-4 focus:ring-trawell-orange/10 resize-none text-sm bg-white text-trawell-dark placeholder:text-gray-400 outline-none transition-all shadow-inner"
            />
            <div className="absolute bottom-3 right-3 text-[10px] text-gray-400 font-medium bg-white/80 px-2 py-0.5 rounded-full">
               {message.length} chars
            </div>
          </div>
          
          <Button 
            onClick={handleWhatsApp} 
            fullWidth 
            className="bg-trawell-green hover:bg-[#1a2e24] text-white shadow-lg shadow-trawell-green/20 border-none py-3.5 text-base"
          >
            <MessageCircle className="mr-2 fill-current" size={20} />
            Chat on WhatsApp
          </Button>
          
          <p className="text-center text-[10px] text-gray-400">
             You'll be redirected to WhatsApp to send this message.
          </p>
        </div>
      </div>
    </div>
  );
};
