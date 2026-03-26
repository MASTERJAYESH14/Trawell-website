
'use client';

import React, { useEffect, useState } from 'react';
import { X, MapPin, Clock, Star, Loader2, Info } from 'lucide-react';
import { Category, FirestoreDestination } from '../types';
import { getDestinationsByCategory } from '../services/destinationService';
import { Button } from './ui/Button';
import { TripDetailModal } from './TripDetailModal';

interface CategoryDestinationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onRequireAuth?: () => void;
  onOpenMyTrips?: () => void;
}

export const CategoryDestinationsModal: React.FC<CategoryDestinationsModalProps> = ({ isOpen, onClose, category, onRequireAuth, onOpenMyTrips }) => {
  const [destinations, setDestinations] = useState<FirestoreDestination[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<FirestoreDestination | null>(null);

  useEffect(() => {
    if (isOpen && category) {
      const fetchDestinations = async () => {
        setLoading(true);
        const data = await getDestinationsByCategory(category.id);
        setDestinations(data);
        setLoading(false);
      };
      fetchDestinations();
      setSelectedDestination(null); // Reset selection on open
    } else {
      setDestinations([]);
    }
  }, [isOpen, category]);

  if (!isOpen || !category) return null;

  const Icon = category.icon;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-trawell-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-6xl h-[90vh] bg-[#FBF6E9] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/20">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  category.id === 'romantic' ? 'bg-pink-100 text-pink-500' :
                  category.id === 'adventure' ? 'bg-orange-100 text-orange-500' :
                  'bg-trawell-bg text-trawell-green'
               }`}>
                  <Icon size={20} />
               </div>
               <div>
                 <h2 className="text-xl font-bold text-trawell-green">{category.title}</h2>
                 <p className="text-xs text-gray-500">{category.subtitle}</p>
               </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-trawell-orange transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#FBF6E9] hide-scrollbar">
            
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                <Loader2 className="animate-spin w-8 h-8 text-trawell-orange" />
                <p className="font-medium text-sm">Finding the best spots...</p>
              </div>
            ) : destinations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((dest) => {
                  // Determine card image
                  const cardImage = dest.mainImageBase64 
                    ? `data:image/jpeg;base64,${dest.mainImageBase64}` 
                    : (dest.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=Explore');

                  const isComingSoon = dest.isComingSoon || dest.coming_soon === 'true' || dest.coming_soon === true;

                  return (
                    <div 
                      key={dest.id} 
                      onClick={() => setSelectedDestination(dest)}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full cursor-pointer"
                    >
                      
                      {/* Image Area */}
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={cardImage} 
                          alt={dest.title} 
                          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${isComingSoon ? 'grayscale-[50%]' : ''}`}
                        />
                        
                        {/* Coming Soon Overlay */}
                        {isComingSoon && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                            <span className="bg-white/20 backdrop-blur-md border border-white/40 text-white px-3 py-1 rounded-lg font-bold uppercase tracking-widest text-xs shadow-xl transform -rotate-3">
                              Coming Soon
                            </span>
                          </div>
                        )}

                        {/* Focus Highlight: Duration Badge */}
                        {!isComingSoon && (
                          <div className="absolute top-3 left-3 flex gap-2">
                             <div className="bg-trawell-orange/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
                                <Clock size={12} strokeWidth={3} />
                                <span className="text-xs font-bold uppercase tracking-wide">{dest.duration}</span>
                             </div>
                          </div>
                        )}
                        
                        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
                        
                        {/* Rating Placeholder if not in DB, else use data */}
                        <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span className="text-xs font-bold">4.8</span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2 group-hover:text-trawell-orange transition-colors">
                             {dest.title}
                           </h3>
                        </div>
                        
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{dest.description}</p>
                        
                        <div className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-4 mt-auto">
                            <MapPin size={14} className="text-gray-400" /> 
                            {dest.city && <span>{dest.city.join(', ')}</span>}
                        </div>

                        {/* Footer */}
                        <div className="flex items-end justify-between pt-4 border-t border-gray-50">
                           <div>
                             {dest.price?.originalPrice && !isComingSoon && (
                               <p className="text-xs text-gray-400 line-through">₹{dest.price.originalPrice.toLocaleString()}</p>
                             )}
                             {isComingSoon ? (
                               <p className="text-sm font-bold text-gray-400 italic">Announcing Soon</p>
                             ) : (
                               <p className="text-xl font-bold text-trawell-green">₹{dest.price.basePrice.toLocaleString()}</p>
                             )}
                           </div>
                           <Button 
                            variant="ghost" 
                            className="px-0 text-trawell-orange hover:bg-transparent hover:underline text-xs h-auto"
                           >
                             {isComingSoon ? 'Notify Me' : 'View Details'}
                           </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                 <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                   <Info size={32} className="text-gray-400" />
                 </div>
                 <h3 className="text-lg font-bold text-gray-700">No destinations yet</h3>
                 <p className="text-sm text-gray-500 max-w-xs">We are curating the best experiences for this category. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reusable Detail Modal */}
      <TripDetailModal 
        isOpen={!!selectedDestination}
        onClose={() => setSelectedDestination(null)}
        destination={selectedDestination}
        onRequireAuth={onRequireAuth}
        onOpenMyTrips={onOpenMyTrips}
      />
    </>
  );
};
