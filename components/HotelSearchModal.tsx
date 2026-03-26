'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Calendar, Users, Search, Minus, Plus, BedDouble, ChevronLeft, ChevronRight, Star, Heart, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';

// Mock list of cities for Autocomplete
const POPULAR_CITIES = [
  "Mumbai, Maharashtra",
  "Delhi, NCR",
  "Bangalore, Karnataka",
  "Udaipur, Rajasthan",
  "Jaipur, Rajasthan",
  "Goa",
  "Manali, Himachal Pradesh",
  "Kerala",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Hyderabad, Telangana",
  "Agra, Uttar Pradesh",
  "Varanasi, Uttar Pradesh",
  "Rishikesh, Uttarakhand"
];

// Mock Hotel Data
const MOCK_HOTELS = [
  {
    id: 1,
    name: "The Oberoi Udaivilas",
    location: "Udaipur, Rajasthan",
    price: 32000,
    rating: 4.9,
    reviews: 3240,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
    tags: ["Luxury", "Lake View", "Spa"]
  },
  {
    id: 2,
    name: "Taj Lake Palace",
    location: "Udaipur, Rajasthan",
    price: 45000,
    rating: 4.8,
    reviews: 2100,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000",
    tags: ["Heritage", "Romantic", "Dining"]
  },
  {
    id: 3,
    name: "The Leela Palace",
    location: "Udaipur, Rajasthan",
    price: 28000,
    rating: 4.7,
    reviews: 1850,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1000",
    tags: ["Lake Pichola", "Pool", "Luxury"]
  },
  {
    id: 4,
    name: "Trident Hotel",
    location: "Udaipur, Rajasthan",
    price: 12000,
    rating: 4.5,
    reviews: 4200,
    image: "https://images.unsplash.com/photo-1571896349842-68cfd4f9d4b6?auto=format&fit=crop&q=80&w=1000",
    tags: ["Family", "Gardens", "Value"]
  },
  {
    id: 5,
    name: "Aurika, Udaipur - Lemon Tree",
    location: "Udaipur, Rajasthan",
    price: 15000,
    rating: 4.6,
    reviews: 980,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=1000",
    tags: ["Hilltop", "Modern", "Views"]
  }
];

interface HotelSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const HotelSearchModal: React.FC<HotelSearchModalProps> = ({ isOpen, onClose }) => {
  // Location State
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Date State
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarView, setCalendarView] = useState<'checkin' | 'checkout'>('checkin');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Guest State
  const [showGuestMenu, setShowGuestMenu] = useState(false);
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    rooms: 1
  });

  // Search Results State
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof MOCK_HOTELS | null>(null);

  const guestMenuRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (guestMenuRef.current && !guestMenuRef.current.contains(target) && !target.closest('[data-guest-trigger]')) {
        setShowGuestMenu(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(target) && !target.closest('[data-calendar-trigger]')) {
         setShowCalendar(false);
      }
      if (locationRef.current && !locationRef.current.contains(target) && !target.closest('input')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // -- Handlers --

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocation(val);
    if (val.length > 0) {
      const filtered = POPULAR_CITIES.filter(city => 
        city.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectLocation = (city: string) => {
    setLocation(city);
    setShowSuggestions(false);
  };

  const updateGuest = (type: 'adults' | 'children' | 'rooms', operation: 'add' | 'sub') => {
    setGuests(prev => {
      const newValue = operation === 'add' ? prev[type] + 1 : prev[type] - 1;
      // Validation constraints
      if (type === 'adults' && newValue < 1) return prev;
      if (type === 'children' && newValue < 0) return prev;
      if (type === 'rooms' && newValue < 1) return prev;
      return { ...prev, [type]: newValue };
    });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchResults(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSearchResults(MOCK_HOTELS);
    setIsSearching(false);
  };

  // -- Calendar Logic --
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days: daysInMonth, firstDay: startDay } = getDaysInMonth(currentMonth);

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    clickedDate.setHours(0,0,0,0);

    if (calendarView === 'checkin') {
      setCheckInDate(clickedDate);
      if (!checkOutDate || clickedDate >= checkOutDate) {
         const nextDay = new Date(clickedDate);
         nextDay.setDate(clickedDate.getDate() + 1);
         setCheckOutDate(nextDay);
         setCalendarView('checkout');
      } else {
        setCalendarView('checkout');
      }
    } else {
      if (checkInDate && clickedDate < checkInDate) {
        setCheckInDate(clickedDate);
        setCalendarView('checkout');
      } else {
        setCheckOutDate(clickedDate);
        // Don't close immediately, let user see selection
        setTimeout(() => setShowCalendar(false), 200); 
      }
    }
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => {
    const today = new Date();
    if (currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear()) return;
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Add Date';
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const isDateSelected = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    date.setHours(0,0,0,0);
    
    if (checkInDate && date.getTime() === checkInDate.getTime()) return 'start';
    if (checkOutDate && date.getTime() === checkOutDate.getTime()) return 'end';
    if (checkInDate && checkOutDate && date > checkInDate && date < checkOutDate) return 'range';
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FBF6E9] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
       
       {/* --- TOP STICKY HEADER --- */}
       <div className="sticky top-0 z-40 bg-[#FBF6E9]/95 backdrop-blur-md border-b border-trawell-green/10 pb-4 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 pt-4 mb-4 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <div className="bg-trawell-orange/10 p-2 rounded-xl">
                   <BedDouble className="text-trawell-orange w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-trawell-green hidden md:block">Hotel Search</h2>
             </div>
             <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-gray-100 shadow-sm border border-gray-100 transition-colors">
               <X size={20} className="text-gray-500" />
             </button>
          </div>

          {/* --- SEARCH BAR CONTAINER --- */}
          <div className="max-w-6xl mx-auto px-4">
             <form onSubmit={handleSearch} className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-2 flex flex-col md:flex-row items-center gap-2 relative z-50">
                
                {/* 1. Location - WIDTH INCREASED TO 40% */}
                <div className="w-full md:w-[40%] relative" ref={locationRef}>
                   <div className="pl-6 py-3 hover:bg-gray-50 rounded-3xl transition-colors cursor-text group">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Where</label>
                      <input 
                        type="text" 
                        placeholder="Search destinations"
                        value={location}
                        onChange={handleLocationChange}
                        onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                        className="w-full bg-transparent border-none p-0 text-gray-800 font-bold placeholder:font-medium placeholder:text-gray-400 focus:ring-0 text-base md:text-lg leading-tight truncate"
                      />
                   </div>
                   {/* Suggestions Dropdown */}
                   {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 w-full md:w-[350px] mt-4 bg-white rounded-3xl shadow-2xl border border-gray-100 max-h-[300px] overflow-y-auto overflow-x-hidden p-2 z-50">
                        {suggestions.map((city, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => selectLocation(city)}
                            className="w-full text-left px-4 py-3 hover:bg-orange-50 hover:text-trawell-orange transition-colors flex items-center gap-3 rounded-xl"
                          >
                            <div className="bg-gray-100 p-2 rounded-full text-gray-400 shrink-0">
                               <MapPin size={16} />
                            </div>
                            <span className="font-semibold text-sm">{city}</span>
                          </button>
                        ))}
                      </div>
                   )}
                </div>

                {/* Divider (Desktop) */}
                <div className="hidden md:block w-[1px] h-10 bg-gray-200"></div>

                {/* 2. Check In/Out - WIDTH DECREASED TO 30% */}
                <div className="w-full md:w-[30%] relative">
                   <div 
                      data-calendar-trigger
                      onClick={() => { setShowCalendar(true); setCalendarView('checkin'); }}
                      className="flex items-center w-full hover:bg-gray-50 rounded-3xl transition-colors cursor-pointer py-3 px-2"
                   >
                      <div className="flex-1 px-4 border-r border-gray-100">
                         <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Check in</label>
                         <p className={`text-sm md:text-base font-bold truncate ${checkInDate ? 'text-gray-800' : 'text-gray-400'}`}>
                           {formatDate(checkInDate)}
                         </p>
                      </div>
                      <div className="flex-1 px-4">
                         <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Check out</label>
                         <p className={`text-sm md:text-base font-bold truncate ${checkOutDate ? 'text-gray-800' : 'text-gray-400'}`}>
                           {formatDate(checkOutDate)}
                         </p>
                      </div>
                   </div>

                   {/* Calendar Popover */}
                   {showCalendar && (
                      <div ref={calendarRef} className="absolute top-full left-1/2 -translate-x-1/2 w-[340px] mt-4 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
                         <div className="flex items-center justify-between mb-4">
                            <button type="button" onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                              <ChevronLeft size={20} />
                            </button>
                            <span className="font-bold text-gray-900">
                              {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </span>
                            <button type="button" onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                              <ChevronRight size={20} />
                            </button>
                         </div>
                         <div className="grid grid-cols-7 mb-2">
                           {DAYS.map(day => (
                             <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider py-1">{day}</div>
                           ))}
                         </div>
                         <div className="grid grid-cols-7 gap-y-1 gap-x-0">
                           {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
                           {Array.from({ length: daysInMonth }).map((_, i) => {
                             const day = i + 1;
                             const status = isDateSelected(day);
                             const isPast = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) < new Date(new Date().setHours(0,0,0,0));
                             
                             let bgClass = "hover:bg-gray-100 text-gray-700 rounded-full";
                             if (status === 'range') {
                               bgClass = "bg-orange-50 text-trawell-orange rounded-none";
                             } else if (status === 'start') {
                               if (checkOutDate && checkInDate && checkInDate.getTime() !== checkOutDate.getTime()) {
                                 bgClass = "bg-trawell-orange text-white hover:bg-trawell-orange rounded-l-full rounded-r-none";
                               } else {
                                 bgClass = "bg-trawell-orange text-white hover:bg-trawell-orange rounded-full";
                               }
                             } else if (status === 'end') {
                               bgClass = "bg-trawell-orange text-white hover:bg-trawell-orange rounded-r-full rounded-l-none";
                             }

                             return (
                               <button
                                 key={day}
                                 type="button"
                                 disabled={isPast}
                                 onClick={() => !isPast && handleDateClick(day)}
                                 className={`h-10 w-full flex items-center justify-center text-xs font-bold transition-all relative ${bgClass} ${isPast ? 'opacity-30 cursor-not-allowed' : ''}`}
                               >
                                 {day}
                               </button>
                             );
                           })}
                         </div>
                      </div>
                   )}
                </div>

                {/* Divider (Desktop) */}
                <div className="hidden md:block w-[1px] h-10 bg-gray-200"></div>

                {/* 3. Guests - WIDTH DECREASED TO 20% */}
                <div className="w-full md:w-[20%] relative">
                   <div 
                      data-guest-trigger
                      onClick={() => setShowGuestMenu(!showGuestMenu)}
                      className="pl-6 py-3 hover:bg-gray-50 rounded-3xl transition-colors cursor-pointer"
                   >
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Who</label>
                      <p className={`text-sm md:text-base font-bold truncate ${guests.adults + guests.children > 0 ? 'text-gray-800' : 'text-gray-400'}`}>
                        {guests.adults + guests.children} Guests, {guests.rooms} Room
                      </p>
                   </div>

                   {/* Guest Popover */}
                   {showGuestMenu && (
                     <div ref={guestMenuRef} className="absolute top-full right-0 w-[300px] mt-4 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
                        {['adults', 'children', 'rooms'].map((type) => (
                          <div key={type} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                            <div>
                              <p className="font-bold text-gray-800 capitalize">{type}</p>
                              <p className="text-xs text-gray-400">{type === 'adults' ? 'Ages 12+' : type === 'children' ? 'Ages 0-12' : 'Count'}</p>
                            </div>
                            <div className="flex items-center gap-3">
                               <button type="button" onClick={() => updateGuest(type as any, 'sub')} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 disabled:opacity-50" disabled={guests[type as keyof typeof guests] <= (type === 'children' ? 0 : 1)}>
                                 <Minus size={14} />
                               </button>
                               <span className="w-6 text-center font-bold text-gray-800">{guests[type as keyof typeof guests]}</span>
                               <button type="button" onClick={() => updateGuest(type as any, 'add')} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600">
                                 <Plus size={14} />
                               </button>
                            </div>
                          </div>
                        ))}
                     </div>
                   )}
                </div>

                {/* Search Button */}
                <div className="w-full md:w-auto p-1">
                   <Button 
                     type="submit" 
                     className="w-full md:w-auto aspect-square rounded-full h-12 md:h-14 bg-trawell-orange hover:bg-orange-700 text-white shadow-trawell-orange/30 flex items-center justify-center"
                   >
                     {isSearching ? <Loader2 className="animate-spin" /> : <Search size={22} />}
                   </Button>
                </div>
             </form>
          </div>
       </div>

       {/* --- RESULTS SECTION --- */}
       <div className="max-w-7xl mx-auto px-4 pb-20 pt-4">
           {isSearching && (
             <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <Loader2 size={40} className="text-trawell-orange animate-spin mb-4" />
                <p className="font-bold text-gray-500">Checking availability...</p>
             </div>
           )}

           {!isSearching && searchResults && (
              <div className="space-y-6">
                 <h3 className="text-2xl font-bold text-trawell-green">Stays in {location || 'Udaipur'}</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {searchResults.map((hotel) => (
                       <div key={hotel.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full">
                          <div className="relative h-64 overflow-hidden">
                             <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                             <button className="absolute top-3 right-3 p-2 bg-white/50 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-colors">
                               <Heart size={18} />
                             </button>
                             {hotel.tags && (
                               <div className="absolute bottom-3 left-3 flex gap-2">
                                 {hotel.tags.slice(0, 2).map((tag, i) => (
                                    <span key={i} className="bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                      {tag}
                                    </span>
                                 ))}
                               </div>
                             )}
                          </div>
                          <div className="p-5 flex-1 flex flex-col">
                             <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-trawell-orange transition-colors">{hotel.name}</h4>
                                <div className="flex items-center gap-1 text-xs font-bold">
                                   <Star size={12} className="text-amber-400 fill-amber-400" />
                                   <span>{hotel.rating}</span>
                                </div>
                             </div>
                             <p className="text-sm text-gray-500 mb-4">{hotel.location}</p>
                             
                             <div className="mt-auto flex items-end justify-between border-t border-gray-50 pt-4">
                                <div>
                                   <p className="text-xs text-gray-400 font-medium">Starting from</p>
                                   <p className="text-xl font-bold text-trawell-green">₹{hotel.price.toLocaleString()}</p>
                                </div>
                                <Button variant="ghost" className="h-8 px-0 text-trawell-orange hover:bg-transparent hover:underline">
                                   View <ArrowRight size={16} className="ml-1" />
                                </Button>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           )}

           {!isSearching && !searchResults && (
             <div className="text-center py-20">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                  <BedDouble size={40} className="text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-300">Start your search</h3>
                <p className="text-gray-400 mt-2">Enter a destination to find your perfect stay.</p>
             </div>
           )}
       </div>
    </div>
  );
};