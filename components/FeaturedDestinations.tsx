
import React, { useEffect, useState } from 'react';
import { FirestoreDestination } from '../types';
import { getFeaturedDestinations } from '../services/destinationService';
import { Loader2 } from 'lucide-react';
import { TripDetailModal } from './TripDetailModal';

interface FeaturedDestinationsProps {
  onRequireAuth?: () => void;
  onOpenMyTrips?: () => void;
}

export const FeaturedDestinations: React.FC<FeaturedDestinationsProps> = ({ onRequireAuth, onOpenMyTrips }) => {
  const [destinations, setDestinations] = useState<FirestoreDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<FirestoreDestination | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await getFeaturedDestinations();
        setDestinations(data);
      } catch (error) {
        console.error("Failed to load featured destinations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <section className="py-4 md:py-6 max-w-7xl mx-auto px-4 w-full flex justify-center">
         <div className="flex items-center gap-2 text-gray-400 text-sm">
           <Loader2 className="animate-spin w-4 h-4" /> Loading adventures...
         </div>
      </section>
    );
  }

  // If no destinations are active/found
  if (destinations.length === 0) return null;

  return (
    <section className="py-4 md:py-6 max-w-7xl mx-auto px-4 w-full">
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <div>
          <h2 className="text-lg md:text-2xl font-bold text-trawell-green">Featured Packages</h2>
          <p className="text-gray-500 text-[10px] md:text-sm mt-0.5">Ready-to-go destinations for immediate travel plans</p>
        </div>
        <button className="text-trawell-orange text-xs md:text-sm font-semibold hover:underline">View All</button>
      </div>

      {/* Mobile Bleed Scroll Container */}
      <div className="flex overflow-x-auto pb-4 gap-3 md:gap-4 hide-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
        {destinations.map((dest) => {
          // Determine image source: City image (base64) -> First Gallery Image -> Placeholder
          const imageUrl = dest.mainImageBase64 
            ? `data:image/jpeg;base64,${dest.mainImageBase64}` 
            : (dest.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=Explore');

          const isComingSoon = dest.isComingSoon || dest.coming_soon === 'true' || dest.coming_soon === true;

          return (
            <div 
              key={dest.id || dest.slug} 
              onClick={() => setSelectedTrip(dest)}
              className="min-w-[220px] md:min-w-[280px] snap-center bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 cursor-pointer group"
            >
              <div className="h-32 md:h-36 overflow-hidden relative">
                <img 
                  src={imageUrl} 
                  alt={dest.title} 
                  className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${isComingSoon ? 'grayscale-[50%]' : ''}`}
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                {/* Coming Soon Overlay */}
                {isComingSoon && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <span className="bg-white/20 backdrop-blur-md border border-white/40 text-white px-3 py-1 rounded-lg font-bold uppercase tracking-widest text-xs shadow-xl transform -rotate-3">
                      Coming Soon
                    </span>
                  </div>
                )}
                
                {/* Duration Badge */}
                {!isComingSoon && (
                  <div className="absolute bottom-2 left-2 text-white text-[10px] font-bold bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/20">
                     {dest.duration}
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-trawell-orange transition-colors">{dest.title}</h3>
                <p className="text-gray-500 text-[10px] mb-2 line-clamp-1">{dest.city.join(', ')}</p>
                <div className="flex justify-between items-center">
                  {isComingSoon ? (
                    <span className="text-gray-400 font-bold text-sm italic">Stay Tuned</span>
                  ) : (
                    <span className="text-trawell-orange font-bold text-sm">₹{dest.price.basePrice.toLocaleString()}</span>
                  )}
                  <button className="bg-trawell-green/10 text-trawell-green px-2.5 py-1 rounded-full text-[10px] font-semibold group-hover:bg-trawell-green group-hover:text-white transition-colors">
                    {isComingSoon ? 'Notify Me' : 'View Details'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      <TripDetailModal 
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
        destination={selectedTrip}
        onRequireAuth={onRequireAuth}
        onOpenMyTrips={onOpenMyTrips}
      />
    </section>
  );
};
