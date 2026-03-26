
'use client';

import React, { useState, useEffect } from 'react';
import { FirestoreDestination } from '../types';
import { X, Clock, MapPin, Check, XCircle, Share2, Camera, ArrowRight, Loader2, BookmarkCheck, ExternalLink, Calendar, Utensils, Hotel, Car } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { saveEnquiredTrip, checkIfTripEnquired } from '../services/userService';

interface TripDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: FirestoreDestination | null;
  onRequireAuth?: () => void;
  onOpenMyTrips?: () => void;
}

export const TripDetailModal: React.FC<TripDetailModalProps> = ({ isOpen, onClose, destination, onRequireAuth, onOpenMyTrips }) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasEnquired, setHasEnquired] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Check if already enquired when modal opens
  useEffect(() => {
    if (isOpen && destination && user) {
      checkIfTripEnquired(user.uid, destination)
        .then(exists => setHasEnquired(exists));
    } else {
      setHasEnquired(false);
    }
  }, [isOpen, destination, user]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (!isOpen || !destination) return null;

  // Use base64 city image or fallback to first gallery image
  const displayImage = destination.mainImageBase64 
    ? `data:image/jpeg;base64,${destination.mainImageBase64}` 
    : (destination.images?.[0]?.url || 'https://via.placeholder.com/800x600?text=No+Image');

  const isComingSoon = destination.isComingSoon || destination.coming_soon === 'true' || destination.coming_soon === true;

  const handleEnquiry = async () => {
    // 1. Visual Update Immediately
    setHasEnquired(true);

    // 2. Trigger External Action (WhatsApp/Email)
    let url = '';
    const isWhatsApp = !!destination.whatsapp_template;
    
    if (isWhatsApp && destination.whatsapp_template) {
        let message = destination.whatsapp_template
          .replace('{title}', destination.title)
          .replace('{price}', destination.price?.basePrice?.toLocaleString() || 'TBA');
        
        const phoneNumber = "919056454920"; 
        url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    } else {
        const email = "trawell.work@gmail.com";
        const subject = `Enquiry for ${destination.title}`;
        let body = `Hi Team,I am interested in the ${destination.title} package.Please provide more details.`;

        if (destination.email_template) {
           body = destination.email_template
              .replace('{title}', destination.title)
              .replace('{price}', destination.price?.basePrice?.toLocaleString() || 'TBA');
        }
        url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    // Open link
    if (isWhatsApp) {
        window.open(url, '_blank');
    } else {
        window.location.href = url;
    }

    // 3. Save to Firebase (My Trips) if logged in
    if (user) {
      // Show Success Toast
      setShowToast(true);
      
      setIsProcessing(true);
      try {
        await saveEnquiredTrip(user.uid, destination);
      } catch (error) {
        console.error("Error saving enquiry:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleViewMyTrips = () => {
    onClose();
    if (onOpenMyTrips) onOpenMyTrips();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4 bg-trawell-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full h-full md:max-w-5xl md:h-[90vh] bg-[#FBF6E9] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/20">
        
        {/* Toast Notification */}
        {showToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 border border-white/10">
             <div className="bg-green-500 rounded-full p-1">
               <Check size={12} className="text-white" strokeWidth={3} />
             </div>
             <span className="font-medium text-sm">Saved to My Trips</span>
          </div>
        )}

        {/* Floating Header Actions */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20 pointer-events-none">
           <button onClick={onClose} className="pointer-events-auto p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors">
             <X size={24} />
           </button>
           <div className="flex gap-2 pointer-events-auto">
             <button className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors">
                <Share2 size={20} />
             </button>
           </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar bg-white">
          
          {/* Hero Image */}
          <div className="relative h-[40vh] md:h-[50vh] w-full group">
            <img 
              src={displayImage} 
              alt={destination.title} 
              className={`w-full h-full object-cover transition-transform duration-1000 ${isComingSoon ? 'grayscale-[30%]' : ''}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            {/* Coming Soon Badge Overlay */}
            {isComingSoon && (
               <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="bg-black/40 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-2xl font-bold uppercase tracking-[0.2em] text-xl shadow-2xl transform -rotate-3">
                    Coming Soon
                  </span>
               </div>
            )}

            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                 {!isComingSoon && (
                   <span className="bg-trawell-orange px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Clock size={12} /> {destination.duration}
                   </span>
                 )}
                 {destination.state && (
                   <span className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                      {destination.state}
                   </span>
                 )}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-cursive leading-tight mb-2 drop-shadow-md">
                {destination.title}
              </h2>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <MapPin size={16} />
                <span>{destination.city?.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-10">
            
            {/* About */}
            <section>
              <h3 className="text-xl font-bold text-trawell-green mb-3">About this trip</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {destination.description}
              </p>
            </section>

            {/* Itinerary */}
            {destination.itinerary && destination.itinerary.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-trawell-green mb-6">Itinerary</h3>
                <div className="space-y-8 relative">
                   <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-200"></div>
                   
                   {destination.itinerary.map((day, idx) => (
                     <div key={idx} className="relative pl-12">
                        <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-trawell-orange text-white flex items-center justify-center text-sm font-bold shadow-md z-10">
                          {day.day}
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                           <h4 className="font-bold text-gray-900 mb-3 text-lg">{day.title}</h4>
                           <div className="space-y-3">
                              {day.activities.map((act, i) => (
                                <div key={i} className="flex gap-3 text-sm text-gray-600">
                                   <div className="mt-0.5 min-w-[20px] text-gray-400">
                                      {act.type === 'visit' && <Camera size={16} />}
                                      {act.type === 'food' && <Utensils size={16} />}
                                      {act.type === 'travel' && <Car size={16} />}
                                      {act.type === 'stay' && <Hotel size={16} />}
                                   </div>
                                   <div>
                                      <span className="font-bold text-gray-500 text-xs uppercase mr-2">{act.time}</span>
                                      {act.title}
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              </section>
            )}

            {/* Inclusions / Exclusions */}
            <div className="grid md:grid-cols-2 gap-8">
               {destination.inclusions && destination.inclusions.length > 0 && (
                 <section>
                   <h3 className="text-lg font-bold text-trawell-green mb-4 flex items-center gap-2">
                     <Check size={20} className="text-green-600" /> What's Included
                   </h3>
                   <ul className="space-y-2">
                     {destination.inclusions.map((item, i) => (
                       <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                         <Check size={16} className="text-green-600 mt-0.5 shrink-0" />
                         <span>{item}</span>
                       </li>
                     ))}
                   </ul>
                 </section>
               )}
               
               {destination.exclusions && destination.exclusions.length > 0 && (
                 <section>
                   <h3 className="text-lg font-bold text-trawell-green mb-4 flex items-center gap-2">
                     <XCircle size={20} className="text-red-500" /> What's Excluded
                   </h3>
                   <ul className="space-y-2">
                     {destination.exclusions.map((item, i) => (
                       <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                         <XCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                         <span>{item}</span>
                       </li>
                     ))}
                   </ul>
                 </section>
               )}
            </div>
            
            {/* Gallery (Simple Grid) */}
            {destination.images && destination.images.length > 1 && (
              <section>
                 <h3 className="text-xl font-bold text-trawell-green mb-4">Gallery</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                   {destination.images.slice(1, 5).map((img, i) => (
                     <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                        <img src={img.url} alt={img.caption || `Gallery ${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                     </div>
                   ))}
                 </div>
              </section>
            )}
            
            {/* Bottom Padding for Sticky Footer */}
            <div className="h-24"></div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="bg-white border-t border-gray-100 p-4 md:p-6 flex items-center justify-between shrink-0 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] relative z-30">
           <div>
             {isComingSoon ? (
               <p className="text-xl font-bold text-gray-400 italic">Coming Soon</p>
             ) : (
               <>
                 <p className="text-xs text-gray-500 font-medium">Starting from</p>
                 <div className="flex items-baseline gap-2">
                    <p className="text-2xl md:text-3xl font-bold text-trawell-green">
                      ₹{destination.price.basePrice.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">/{destination.price.occupancyRule || 'person'}</p>
                 </div>
               </>
             )}
           </div>

           <div className="flex items-center gap-4">
              {hasEnquired && (
                <div className="hidden md:flex flex-col items-end mr-2 animate-in fade-in slide-in-from-right-4">
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <BookmarkCheck size={12} className="text-green-600" /> Saved to
                   </span>
                   <button onClick={handleViewMyTrips} className="text-sm font-bold text-trawell-green hover:underline flex items-center gap-1">
                       My Trips <ArrowRight size={12} />
                   </button>
                </div>
              )}
              
              <Button 
                onClick={handleEnquiry} 
                disabled={isProcessing}
                className={`px-6 md:px-8 py-4 text-base shadow-xl ${hasEnquired ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : hasEnquired ? (
                  <>
                    <Check className="mr-2" size={20} />
                    Enquired
                  </>
                ) : isComingSoon ? (
                  'Notify Me' 
                ) : (
                  <>
                    Enquire Now <ArrowRight className="ml-2" size={20} />
                  </>
                )}
              </Button>
           </div>
        </div>

      </div>
    </div>
  );
};
