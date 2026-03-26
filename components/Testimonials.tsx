
import React, { useEffect, useState } from 'react';
import { Star, Quote, MapPin, Loader2 } from 'lucide-react';
import { getFeaturedTestimonials } from '../services/testimonialService';
import { Testimonial } from '../types';

export const Testimonials: React.FC = () => {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getFeaturedTestimonials();
        // Limit to 3-4 as requested
        setReviews(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to load reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Format helper: "bikaner-jaipur-heritage" -> "Bikaner Jaipur Heritage"
  const formatTripId = (slug: string) => {
    if (!slug) return '';
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .trim();
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-[#FBF6E9] relative overflow-hidden flex justify-center">
        <Loader2 className="animate-spin text-trawell-orange" size={32} />
      </section>
    );
  }

  // If no reviews found, don't render the section or render a fallback?
  // User requested "we can only show 3-4 that are authentic", so if 0, maybe hide.
  if (reviews.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#FBF6E9] relative overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-trawell-orange/5 rotate-12">
           <Quote size={120} />
        </div>
        <div className="absolute bottom-10 right-10 text-trawell-green/5 -rotate-12">
           <Quote size={120} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-trawell-orange/10 text-trawell-orange font-bold text-xs md:text-sm tracking-wider uppercase mb-3">
            Wall of Love
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-trawell-green font-cursive">
            Traveler Stories
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm md:text-base">
            Real stories from real travelers who chose to explore the world the Trawell way.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 justify-center">
          {reviews.map((review) => (
            <div 
              key={review.id}
              className="bg-white p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col relative group"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 right-8 w-10 h-10 bg-trawell-orange text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Quote size={18} fill="currentColor" />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={`${i < Math.round(review.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} 
                  />
                ))}
                <span className="text-xs text-gray-400 ml-1 font-bold">({review.rating})</span>
              </div>

              {/* Content */}
              <p className="text-gray-700 leading-relaxed mb-8 italic flex-1 text-sm md:text-base">
                "{review.reviewText}"
              </p>

              {/* Highlight if available */}
              {review.highlight && (
                 <div className="mb-6 p-3 bg-trawell-bg rounded-xl border border-trawell-green/10">
                    <p className="text-xs text-trawell-green font-medium">
                       <span className="font-bold">Highlight:</span> {review.highlight}
                    </p>
                 </div>
              )}

              {/* User Info */}
              <div className="flex items-center gap-4 mt-auto border-t border-gray-100 pt-6">
                <div className="w-12 h-12 rounded-full bg-trawell-bg flex items-center justify-center text-trawell-green font-bold text-lg border border-trawell-green/20 shrink-0">
                  {review.travelerName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{review.travelerName}</h4>
                  
                  {review.location && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={10} />
                        <span>{review.location}</span>
                    </div>
                  )}

                  {review.tripId && (
                    <p className="text-[10px] text-trawell-orange font-semibold mt-0.5 uppercase tracking-wide">
                      Trip: {formatTripId(review.tripId)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
