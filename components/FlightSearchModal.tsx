'use client';

import React, { useState } from 'react';
import { X, Plane, Calendar, Users, ArrowRight, Search, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Flight } from '../types';
import { searchFlights } from '../services/flightService';
import { AirportInput } from './AirportInput';
import { CustomDatePicker } from './CustomDatePicker';
import { CompassLogo } from './ui/CompassLogo';

interface FlightSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlightSearchModal: React.FC<FlightSearchModalProps> = ({ isOpen, onClose }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Flight[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await searchFlights(from, to, date, passengers);
      setResults(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while searching.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-trawell-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#FBF6E9] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Plane size={20} className="-rotate-45" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-trawell-green">Find Your Wings</h2>
               <div className="flex items-center gap-1.5">
                 <ShieldCheck size={12} className="text-green-600" />
                 <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Secure Search</p>
               </div>
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
        <div className="flex-1 overflow-y-auto p-6 md:p-8 hide-scrollbar">
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* From */}
                <AirportInput 
                  label="From"
                  placeholder="City or Airport"
                  value={from}
                  onChange={(iata) => setFrom(iata)}
                  icon={<Plane className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 -rotate-90" />}
                  labelClassName="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1"
                  inputClassName="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-bold text-gray-800 placeholder:font-normal transition-all uppercase"
                />

                {/* To */}
                <AirportInput 
                  label="To"
                  placeholder="City or Airport"
                  value={to}
                  onChange={(iata) => setTo(iata)}
                  icon={<Plane className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />}
                  labelClassName="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1"
                  inputClassName="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-bold text-gray-800 placeholder:font-normal transition-all uppercase"
                />

                {/* Date */}
                <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Departure</label>
                   <CustomDatePicker 
                     selected={date ? new Date(date) : null}
                     onChange={(d) => {
                       if (d) {
                         const localDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
                         setDate(localDate.toISOString().split('T')[0]);
                       } else {
                         setDate('');
                       }
                     }}
                     minDate={new Date()}
                     placeholderText="Select date"
                     required
                     className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-semibold text-gray-800 transition-all"
                     iconClassName="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10"
                   />
                </div>

                {/* Passengers & Search */}
                <div className="flex items-end gap-3">
                   <div className="space-y-1 flex-1">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Travellers</label>
                     <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                          type="number" 
                          min={1} 
                          max={9}
                          value={passengers}
                          onChange={(e) => setPassengers(parseInt(e.target.value))}
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-semibold text-gray-800 transition-all"
                        />
                     </div>
                   </div>
                   <Button type="submit" className="h-[42px] aspect-square p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-blue-200">
                     {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search size={20} />}
                   </Button>
                </div>
             </div>
          </form>

          {/* Results Area */}
          <div className="space-y-4">
             {loading && (
               <div className="text-center py-12 flex flex-col items-center justify-center">
                 <div className="mb-4">
                   <CompassLogo size={80} animate={true} />
                 </div>
                 <p className="text-trawell-green font-bold text-xl animate-pulse">Good things take time!</p>
                 <p className="text-gray-500 font-medium mt-1">Providing you the best flights.</p>
               </div>
             )}

             {error && (
               <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600">
                 <AlertCircle size={20} />
                 <p>{error}</p>
               </div>
             )}

             {!loading && results && results.length === 0 && (
                <div className="text-center py-12 opacity-60">
                   <Plane size={48} className="text-gray-300 mx-auto mb-2" />
                   <p className="text-gray-500">No flights found for this route.</p>
                </div>
             )}

             {!loading && results && results.length > 0 && (
                <>
                  <h3 className="text-lg font-bold text-trawell-green mb-4">Available Flights</h3>
                  <div className="space-y-4">
                     {results.map((flight) => (
                       <div key={flight.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6">
                          
                          {/* Airline Info */}
                          <div className="flex items-center gap-4 w-full md:w-1/4">
                             <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-xs font-bold text-gray-400">
                               {flight.airline.slice(0, 2).toUpperCase()}
                             </div>
                             <div>
                               <p className="font-bold text-gray-900">{flight.airline}</p>
                               <p className="text-xs text-gray-500">{flight.flightNumber}</p>
                             </div>
                          </div>

                          {/* Route Info */}
                          <div className="flex-1 flex items-center justify-center gap-6 w-full">
                             <div className="text-right">
                               <p className="text-xl font-bold text-gray-900">{flight.departure.time}</p>
                               <p className="text-xs font-bold text-gray-500">{flight.departure.code}</p>
                             </div>
                             
                             <div className="flex flex-col items-center gap-1 min-w-[100px]">
                               <p className="text-[10px] text-gray-400">{flight.duration}</p>
                               <div className="w-full h-[2px] bg-gray-200 relative">
                                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300"></div>
                               </div>
                               <p className="text-[10px] text-green-600 font-medium">
                                 {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}
                               </p>
                             </div>

                             <div className="text-left">
                               <p className="text-xl font-bold text-gray-900">{flight.arrival.time}</p>
                               <p className="text-xs font-bold text-gray-500">{flight.arrival.code}</p>
                             </div>
                          </div>

                          {/* Price & Action */}
                          <div className="flex flex-row md:flex-col items-center gap-4 md:gap-2 w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 justify-between md:justify-center">
                             <div className="text-left md:text-right">
                                <p className="text-2xl font-bold text-blue-600">₹{Math.round(flight.price).toLocaleString('en-IN')}</p>
                                <p className="text-[10px] text-gray-400">per person</p>
                             </div>
                             <Button className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-sm shadow-blue-200">
                               Book
                             </Button>
                          </div>

                       </div>
                     ))}
                  </div>
                </>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};