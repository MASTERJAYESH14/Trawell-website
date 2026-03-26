
'use client';

import React, { useEffect, useState } from 'react';
import { X, Calendar, MapPin, ArrowRight, Loader2, PackageOpen, Check, Trash2, AlertCircle, Clock } from 'lucide-react';
import { FirestoreDestination } from '../types';
import { useAuth } from '../context/AuthContext';
import { getUserTrips, removeEnquiredTrip } from '../services/userService';
import { Button } from './ui/Button';
import { TripDetailModal } from './TripDetailModal';

interface MyTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyTripsModal: React.FC<MyTripsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<FirestoreDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<FirestoreDestination | null>(null);
  const [tripToDelete, setTripToDelete] = useState<FirestoreDestination | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      setLoading(true);
      getUserTrips(user.uid)
        .then(data => {
            // Sort by latest enquiry
            const sorted = data.sort((a, b) => {
                const dateA = a.enquiredAt?.toDate ? a.enquiredAt.toDate() : new Date(a.enquiredAt || 0);
                const dateB = b.enquiredAt?.toDate ? b.enquiredAt.toDate() : new Date(b.enquiredAt || 0);
                return dateB.getTime() - dateA.getTime();
            });
            setTrips(sorted);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
        setTrips([]); // Reset on close
    }
  }, [isOpen, user]);

  const initiateDelete = (e: React.MouseEvent, trip: FirestoreDestination) => {
    e.stopPropagation();
    setTripToDelete(trip);
  };

  const confirmDelete = async () => {
    if (!user || !tripToDelete) return;

    const tripId = tripToDelete.id || tripToDelete.slug;
    setDeletingId(tripId);
    setTripToDelete(null); 

    try {
        await removeEnquiredTrip(user.uid, tripId);
        // Remove from local state
        setTrips(prev => prev.filter(t => (t.id || t.slug) !== tripId));
    } catch (error) {
        console.error("Failed to delete trip", error);
        alert("Failed to remove trip.");
    } finally {
        setDeletingId(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    // Format: "Feb 24, 2024"
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-trawell-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] bg-[#FBF6E9] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/20">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-trawell-bg flex items-center justify-center text-trawell-green">
                <PackageOpen size={20} />
             </div>
             <div>
               <h2 className="text-xl font-bold text-trawell-green">My Trips</h2>
               <p className="text-xs text-gray-500">Your travel wishlist & enquiries</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-trawell-orange transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 hide-scrollbar bg-[#FBF6E9]">
          
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center">
               <Loader2 className="animate-spin w-8 h-8 text-trawell-orange mb-3" />
               <p className="text-gray-500 font-medium">Retrieving your journeys...</p>
            </div>
          ) : trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => {
                    const cardImage = trip.mainImageBase64 
                    ? `data:image/jpeg;base64,${trip.mainImageBase64}` 
                    : (trip.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=Trip');
                    
                    const tripId = trip.id || trip.slug;
                    const isDeleting = deletingId === tripId;
                    const enquiredDate = formatDate(trip.enquiredAt);

                    return (
                        <div 
                           key={tripId} 
                           onClick={() => setSelectedTrip(trip)}
                           className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group cursor-pointer flex flex-col relative ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            {/* Delete Button */}
                            <button 
                                onClick={(e) => initiateDelete(e, trip)}
                                className="absolute top-3 right-3 z-20 p-2 bg-white/90 rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                                title="Remove enquiry"
                            >
                                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            </button>

                            <div className="relative h-48 overflow-hidden">
                                <img src={cardImage} alt={trip.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 text-white">
                                    <div className="flex items-center gap-1.5 text-xs font-bold bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20">
                                       <Calendar size={12} /> {trip.duration}
                                    </div>
                                </div>
                                {/* Enquired Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className="bg-trawell-green text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                                        <Check size={12} strokeWidth={4} /> Enquired
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-trawell-orange transition-colors line-clamp-1">{trip.title}</h3>
                                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                                    <MapPin size={12} /> {trip.city?.join(', ')}
                                </div>

                                {enquiredDate && (
                                   <div className="mb-4 bg-gray-50 rounded-lg p-2 flex items-center gap-2 text-xs text-gray-500">
                                      <Clock size={12} className="text-gray-400" />
                                      <span>Requested on <span className="font-semibold text-gray-700">{enquiredDate}</span></span>
                                   </div>
                                )}

                                <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
                                    <span className="text-lg font-bold text-trawell-green">₹{trip.price.basePrice.toLocaleString()}</span>
                                    <Button variant="ghost" className="h-auto p-0 hover:bg-transparent text-xs">
                                        View <ArrowRight size={14} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <PackageOpen size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No trips saved yet</h3>
                <p className="text-gray-500 max-w-xs">Enquire about a package to see it listed here.</p>
                <Button onClick={onClose} className="mt-6">Explore Packages</Button>
            </div>
          )}

        </div>
      </div>
    </div>

    {/* Custom Delete Confirmation Modal */}
    {tripToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl text-center border border-white/20">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                 <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Remove Trip?</h3>
              <p className="text-gray-500 text-sm mb-6">
                 Are you sure you want to remove <span className="font-bold text-gray-800">"{tripToDelete.title}"</span> from your saved trips? This cannot be undone.
              </p>
              <div className="flex gap-3">
                 <Button fullWidth variant="outline" onClick={() => setTripToDelete(null)}>Cancel</Button>
                 <Button fullWidth className="bg-red-600 hover:bg-red-700 border-none shadow-none text-white" onClick={confirmDelete}>Remove</Button>
              </div>
           </div>
        </div>
    )}

    {/* Detail Modal for My Trips */}
    <TripDetailModal 
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
        destination={selectedTrip}
        onOpenMyTrips={() => {
             // We are already in My Trips, so we just close the detail modal
             setSelectedTrip(null);
        }}
    />
    </>
  );
};
