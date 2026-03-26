'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { AuthModal } from '../../components/AuthModal';
import { ProfileModal } from '../../components/ProfileModal';
import { MyTripsModal } from '../../components/MyTripsModal';
import { AuthMode } from '../../types';
import { CompassLogo } from '../../components/ui/CompassLogo';
import { Plane, Calendar, Users, Search, ArrowRight, Clock, Filter, X, MapPinOff, Tractor, CloudLightning, Compass } from 'lucide-react';
import { AirportInput } from '../../components/AirportInput';
import { CustomDatePicker } from '../../components/CustomDatePicker';

interface FlightSearchState {
  origin: string;
  destination: string;
  date: string;
  returnDate?: string;
  passengers: number;
  tripClass: string;
}

interface Ticket {
  id: string;
  segment?: any[];
  segments?: any[];
  proposals: {
    price?: { value: number; currency?: string };
    minimum_fare?: { price?: { value: number; currency?: string } };
    agent_id: string;
    url?: string;
    deep_link?: string;
    link?: string;
  }[];
}

interface Agent {
  name?: string;
  label?: any;
  gate_name?: string;
}

interface Airline {
  name: string | { en?: string };
}

interface FlightLeg {
  departure_time?: string;
  departure?: string;
  local_departure_date_time?: string;
  arrival_time?: string;
  arrival?: string;
  local_arrival_date_time?: string;
  duration?: number;
  operating_carrier?: string;
  carrier?: string;
  airline?: string;
  operating_carrier_designator?: { airline_id?: string; carrier?: string; number?: string };
  origin?: string;
  destination?: string;
}

interface FlightData {
  tickets: Ticket[];
  agents: Record<string, Agent>;
  airlines: Record<string, Airline>;
  flight_legs: Record<string, FlightLeg>;
}

const formatTime = (timeStr?: any) => {
  if (!timeStr) return '--:--';
  
  let str = timeStr;
  if (typeof timeStr === 'object') {
    str = timeStr.default || timeStr.time || JSON.stringify(timeStr);
  }
  
  if (typeof str !== 'string' && typeof str !== 'number') return '--:--';

  try {
    const date = new Date(str);
    if (isNaN(date.getTime())) return String(str);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return String(str);
  }
};

const formatDuration = (minutes?: any) => {
  if (!minutes) return '--h --m';
  
  let mins = minutes;
  if (typeof minutes === 'object') {
    mins = minutes.default || minutes.value || parseInt(JSON.stringify(minutes), 10);
  }
  
  const numMins = Number(mins);
  if (isNaN(numMins)) return '--h --m';
  
  const h = Math.floor(numMins / 60);
  const m = numMins % 60;
  return `${h}h ${m}m`;
};

const getAirlineName = (flightData: FlightData | null, carrier_id: string) => {
  if (!flightData || !flightData.airlines || !carrier_id) return carrier_id || 'Unknown Airline';
  const airline = flightData.airlines[carrier_id];
  if (!airline) return carrier_id;
  
  if (typeof airline.name === 'string') return airline.name;
  if (airline.name?.en) {
    if (typeof airline.name.en === 'string') return airline.name.en;
    if (airline.name.en.default) return String(airline.name.en.default);
  }
  if (airline.name?.default) return String(airline.name.default);
  
  return String(carrier_id);
};

const getAgentName = (flightData: FlightData | null, agent_id: string | number) => {
  if (!flightData || !flightData.agents || !agent_id) return 'Unknown Provider';
  const agent = flightData.agents[agent_id];
  if (!agent) return 'Unknown Provider';
  
  if (typeof agent.label === 'string') return agent.label;
  if (agent.label?.en) {
    if (typeof agent.label.en === 'string') return agent.label.en;
    if (agent.label.en.default) return String(agent.label.en.default);
  }
  if (agent.label?.default) return String(agent.label.default);
  
  if (typeof agent.name === 'string') return agent.name;
  if (agent.name?.en) {
    if (typeof agent.name.en === 'string') return agent.name.en;
    if (agent.name.en.default) return String(agent.name.en.default);
  }
  if (agent.name?.default) return String(agent.name.default);
  
  return 'Unknown Provider';
};

const FlightCard = ({ ticket, index, flightData, searchParams, handleBookingRedirect }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const segments = ticket.segments || ticket.segment;
  if (!segments || !Array.isArray(segments) || segments.length === 0) return null;
  
  if (!ticket.proposals || !Array.isArray(ticket.proposals) || ticket.proposals.length === 0) return null;
  
  const sortedProposals = [...ticket.proposals].sort((a, b) => {
    const priceA = a.minimum_fare?.price?.value || a.price?.value || 0;
    const priceB = b.minimum_fare?.price?.value || b.price?.value || 0;
    return priceA - priceB;
  });

  const uniqueProposals: any[] = [];
  const seenAgents = new Set();

  sortedProposals.forEach(proposal => {
    if (!seenAgents.has(proposal.agent_id)) {
      seenAgents.add(proposal.agent_id);
      uniqueProposals.push(proposal);
    }
  });

  const bestProposal = uniqueProposals[0];
  const otherProposals = uniqueProposals.slice(1);
  
  if (!bestProposal) return null;

  const agentId = bestProposal.agent_id;
  const agentName = getAgentName(flightData, agentId);

  const priceValue = Math.round(bestProposal.minimum_fare?.price?.value || bestProposal.price?.value || 0);

  const renderSegment = (segment: any, idx: number) => {
    if (!segment) return null;
    
    let flightIndexes: (string | number)[] = [];
    
    if (typeof segment === 'string' || typeof segment === 'number') {
      flightIndexes = [segment];
    } else if (segment.flights && Array.isArray(segment.flights) && segment.flights.length > 0) {
      flightIndexes = segment.flights;
    }
    
    if (flightIndexes.length === 0) return null;
    
    const firstLegIndex = flightIndexes[0];
    const lastLegIndex = flightIndexes[flightIndexes.length - 1];
    
    const firstLeg = flightData.flight_legs ? flightData.flight_legs[firstLegIndex] : null;
    const lastLeg = flightData.flight_legs ? flightData.flight_legs[lastLegIndex] : null;
    
    if (!firstLeg || !lastLeg) return null;

    let airlineId = firstLeg.operating_carrier_designator?.airline_id || firstLeg.operating_carrier || firstLeg.carrier || firstLeg.airline || '';
    if (typeof airlineId === 'object') {
      airlineId = (airlineId as any).default || (airlineId as any).id || (airlineId as any).name || JSON.stringify(airlineId);
    }
    if (typeof airlineId !== 'string') airlineId = String(airlineId);

    const airlineName = getAirlineName(flightData, airlineId as string);

    const carrierCode = firstLeg.operating_carrier_designator?.carrier || airlineId;
    const flightNumber = firstLeg.operating_carrier_designator?.number || '';
    const flightNumberDisplay = flightNumber ? `${carrierCode}-${flightNumber}` : airlineId;

    let departureTime = firstLeg.local_departure_date_time || firstLeg.departure_time || firstLeg.departure;
    if (typeof departureTime === 'object') departureTime = (departureTime as any).default || JSON.stringify(departureTime);
    
    let arrivalTime = lastLeg.local_arrival_date_time || lastLeg.arrival_time || lastLeg.arrival;
    if (typeof arrivalTime === 'object') arrivalTime = (arrivalTime as any).default || JSON.stringify(arrivalTime);
    
    let origin = firstLeg.origin || searchParams.origin;
    if (typeof origin === 'object') origin = (origin as any).default || (origin as any).code || (origin as any).name || JSON.stringify(origin);
    if (typeof origin !== 'string') origin = String(origin);
    
    let destination = lastLeg.destination || searchParams.destination;
    if (typeof destination === 'object') destination = (destination as any).default || (destination as any).code || (destination as any).name || JSON.stringify(destination);
    if (typeof destination !== 'string') destination = String(destination);
    
    let durationText = '--h --m';
    if (firstLeg.departure_unix_timestamp && lastLeg.arrival_unix_timestamp) {
      const totalSeconds = lastLeg.arrival_unix_timestamp - firstLeg.departure_unix_timestamp;
      const totalMinutes = Math.floor(totalSeconds / 60);
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      durationText = `${h}h ${m}m`;
    } else {
      const totalMinutes = flightIndexes.reduce((acc: number, idx: any) => {
        const leg = flightData.flight_legs[idx];
        return acc + (leg?.duration || 0);
      }, 0);
      durationText = formatDuration(totalMinutes);
    }
    
    const stopsCount = flightIndexes.length - 1;
    const stopsText = stopsCount === 0 ? "Direct" : `${stopsCount} Stop${stopsCount > 1 ? 's' : ''}`;
    
    let layoverText = '';
    if (stopsCount > 0 && flightData.flight_legs) {
      const layovers = flightIndexes.slice(0, -1).map((idx: any) => {
        const leg = flightData.flight_legs[idx];
        return leg?.destination;
      }).filter(Boolean);
      if (layovers.length > 0) {
        layoverText = layovers.join(', ');
      }
    }

    return (
      <div key={idx} className={`flex-1 flex flex-col md:flex-row items-center gap-4 lg:gap-6 w-full ${idx > 0 ? 'mt-6 pt-6 border-t border-gray-100' : ''}`}>
        <div className="w-full md:w-32 lg:w-48 text-center md:text-left flex items-center justify-center md:justify-start">
          <img 
            src={`https://pics.avs.io/100/100/${carrierCode}.png`} 
            alt={airlineName} 
            className="w-8 h-8 object-contain mr-3" 
            referrerPolicy="no-referrer"
          />
          <div>
            <p className="font-semibold text-trawell-dark">{airlineName}</p>
            <p className="text-xs text-gray-500">{flightNumberDisplay}</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-between md:justify-center gap-2 md:gap-4 w-full">
          <div className="text-right">
            <p className="text-xl md:text-2xl font-bold text-trawell-dark">{formatTime(departureTime)}</p>
            <p className="text-xs md:text-sm text-gray-500">{origin}</p>
          </div>
          
          <div className="flex flex-col items-center px-2 md:px-4 flex-1 max-w-[150px]">
            <p className="text-[10px] md:text-xs text-gray-400 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {durationText}
            </p>
            <div className="w-full h-[2px] bg-gray-200 relative">
              <Plane className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-trawell-green w-4 h-4 bg-white px-1 ${idx > 0 ? 'transform rotate-180' : ''}`} />
            </div>
            <p className="text-[10px] md:text-xs text-trawell-green mt-1 font-medium whitespace-nowrap">{stopsText}</p>
            {layoverText && <p className="text-[10px] text-gray-500 mt-0.5 text-center leading-tight">{layoverText}</p>}
          </div>

          <div className="text-left">
            <p className="text-xl md:text-2xl font-bold text-trawell-dark">{formatTime(arrivalTime)}</p>
            <p className="text-xs md:text-sm text-gray-500">{destination}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div key={ticket.id || index} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col overflow-hidden">
      <div className="p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Airline & Times */}
        <div className="flex-1 flex flex-col w-full">
          {segments.map((segment: any, idx: number) => renderSegment(segment, idx))}
        </div>

        {/* Price & Action */}
        <div className="w-full lg:w-auto flex flex-col border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6 mt-4 lg:mt-0">
          <div className="flex flex-row lg:flex-col items-center justify-between lg:items-end w-full">
            <div className="flex flex-col items-start lg:items-end">
              <div className="bg-green-50 text-trawell-green text-[10px] font-bold px-2 py-1 rounded-md mb-2 uppercase tracking-wide">Best Option</div>
              <p className="text-sm text-gray-600 mb-1">Book via <span className="font-semibold text-trawell-dark">{agentName}</span></p>
              <p className="text-2xl lg:text-3xl font-bold text-trawell-orange mb-0 lg:mb-3">
                ₹{new Intl.NumberFormat('en-IN').format(priceValue)}
              </p>
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                handleBookingRedirect(bestProposal);
              }}
              className="bg-trawell-green hover:bg-green-800 text-white px-6 py-2.5 lg:py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              Book Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {otherProposals.length > 0 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 md:mt-3 text-sm font-semibold text-trawell-orange hover:text-orange-700 transition-colors flex items-center justify-center md:justify-end gap-1 w-full bg-orange-50 hover:bg-orange-100 py-1.5 px-3 rounded-lg"
            >
              Compare {otherProposals.length} other provider{otherProposals.length !== 1 ? 's' : ''} 
              <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>⌄</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Dropdown */}
      {isExpanded && otherProposals.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50 p-4 flex flex-col gap-3">
          {otherProposals.map((proposal: any, idx: number) => {
            const rawLabel = flightData.agents[proposal.agent_id]?.label?.en?.default || flightData.agents[proposal.agent_id]?.label?.en || flightData.agents[proposal.agent_id]?.gate_name || 'Partner';
            const propPrice = Math.round(proposal.minimum_fare?.price?.value || proposal.price?.value || 0);
            return (
              <div key={proposal.id || idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <span className="font-medium text-gray-700">{rawLabel}</span>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-trawell-dark">₹{new Intl.NumberFormat('en-IN').format(propPrice)}</span>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleBookingRedirect(proposal);
                    }}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Book
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const StateMessage = ({ type }: { type: 'same-airport' | 'timeout' | 'no-flights' | 'loading' }) => {
  if (type === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-6">
          <CompassLogo size={120} animate={true} spinFast={true} />
        </div>
        <p className="text-2xl font-bold text-trawell-green animate-pulse">Good things take time.</p>
        <p className="text-gray-500 mt-2">We are providing the best flights for you.</p>
        
        {/* Skeleton Cards */}
        <div className="w-full mt-12 space-y-4 max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-6 animate-pulse">
              <div className="flex-1 flex gap-6 w-full">
                <div className="w-32 h-12 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 flex justify-between items-center">
                  <div className="w-20 h-10 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full"></div>
                  <div className="w-20 h-10 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
              <div className="w-full lg:w-40 h-16 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const content = {
    'same-airport': {
      icon: <MapPinOff className="w-24 h-24 text-trawell-orange mb-6" />,
      title: "Teleportation isn't quite ready yet.",
      subtitle: "You selected the same airport for your origin and destination. Please pick a different destination for your adventure."
    },
    'no-flights': {
      icon: <Compass className="w-24 h-24 text-trawell-green mb-6" />,
      title: "Now that's a true hidden gem.",
      subtitle: "We couldn't find any commercial flights for this exact route and date. Try adjusting your dates or searching for a nearby major airport."
    },
    'timeout': {
      icon: <CloudLightning className="w-24 h-24 text-trawell-orange mb-6" />,
      title: "Our radar got scrambled.",
      subtitle: "The airline networks are taking too long to respond. Take a breath and try hitting search again."
    }
  };

  const { icon, title, subtitle } = content[type as 'same-airport' | 'timeout' | 'no-flights'];

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-2xl mx-auto">
      {icon}
      <h2 className="text-3xl md:text-4xl font-bold text-trawell-dark mb-4">{title}</h2>
      <p className="text-lg text-gray-500 leading-relaxed">{subtitle}</p>
    </div>
  );
};

export default function FlightsPage() {
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMyTripsOpen, setIsMyTripsOpen] = useState(false);
  const navigate = useNavigate();

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [searchParams, setSearchParams] = useState<FlightSearchState>({
    origin: 'DEL',
    destination: 'BOM',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    passengers: 1,
    tripClass: 'Y',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorType, setErrorType] = useState<'same-airport' | 'timeout' | 'no-flights' | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [searchId, setSearchId] = useState<string | null>(null);
  const [resultsUrl, setResultsUrl] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [sortType, setSortType] = useState<'recommended' | 'cheapest' | 'fastest' | 'departure' | 'arrival' | 'layover' | 'duration'>('cheapest');
  const [stopsFilter, setStopsFilter] = useState<number[]>([]);
  const [airlineFilter, setAirlineFilter] = useState<string[]>([]);
  const [baggageIncluded, setBaggageIncluded] = useState<boolean>(false);
  const [priceFilter, setPriceFilter] = useState<number | null>(null);
  const [durationFilter, setDurationFilter] = useState<number | null>(null);
  const [departureTimeFilter, setDepartureTimeFilter] = useState<string[]>([]);

  const { minPrice, maxPriceLimit, minDuration, maxDurationLimit } = useMemo(() => {
    let minP = Infinity, maxP = 0;
    let minD = Infinity, maxD = 0;
    
    if (!flightData || !flightData.tickets) return { minPrice: 0, maxPriceLimit: 100000, minDuration: 0, maxDurationLimit: 48 * 60 };
    
    flightData.tickets.forEach((ticket: any) => {
      const price = ticket.proposals?.[0]?.minimum_fare?.price?.value || ticket.proposals?.[0]?.price?.value || 0;
      if (price > 0) {
        if (price < minP) minP = price;
        if (price > maxP) maxP = price;
      }
      
      const segments = ticket.segments || ticket.segment;
      if (segments && segments.length > 0) {
        const outboundSegment = segments[0];
        const flightIndexes = outboundSegment.flights || [outboundSegment];
        if (flightIndexes.length > 0 && flightData.flight_legs) {
          const firstLeg = flightData.flight_legs[flightIndexes[0]];
          const lastLeg = flightData.flight_legs[flightIndexes[flightIndexes.length - 1]];
          
          let duration = 0;
          if (firstLeg?.departure_unix_timestamp && lastLeg?.arrival_unix_timestamp) {
            duration = Math.floor((lastLeg.arrival_unix_timestamp - firstLeg.departure_unix_timestamp) / 60);
          } else {
            flightIndexes.forEach((idx: any) => {
               const leg = flightData.flight_legs[idx];
               if (leg?.duration) duration += leg.duration;
            });
          }
          
          if (duration > 0) {
            if (duration < minD) minD = duration;
            if (duration > maxD) maxD = duration;
          }
        }
      }
    });
    
    return { 
      minPrice: minP === Infinity ? 0 : Math.floor(minP), 
      maxPriceLimit: maxP === 0 ? 100000 : Math.ceil(maxP),
      minDuration: minD === Infinity ? 0 : minD,
      maxDurationLimit: maxD === 0 ? 48 * 60 : maxD
    };
  }, [flightData]);

  const getDuration = useCallback((ticket: any) => {
    const segments = ticket.segments || ticket.segment;
    if (!segments || segments.length === 0) return Infinity;
    const outboundSegment = segments[0];
    const flightIndexes = outboundSegment.flights || [outboundSegment];
    if (flightIndexes.length === 0 || !flightData?.flight_legs) return Infinity;
    
    const firstLeg = flightData.flight_legs[flightIndexes[0]];
    const lastLeg = flightData.flight_legs[flightIndexes[flightIndexes.length - 1]];
    
    if (firstLeg?.departure_unix_timestamp && lastLeg?.arrival_unix_timestamp) {
      return Math.floor((lastLeg.arrival_unix_timestamp - firstLeg.departure_unix_timestamp) / 60);
    }
    
    let totalMinutes = 0;
    flightIndexes.forEach((idx: any) => {
       const leg = flightData.flight_legs[idx];
       if (leg?.duration) totalMinutes += leg.duration;
    });
    return totalMinutes || Infinity;
  }, [flightData]);

  const getLayoverDuration = useCallback((ticket: any) => {
    const segments = ticket.segments || ticket.segment;
    if (!segments || segments.length === 0) return 0;
    const outboundSegment = segments[0];
    const flightIndexes = outboundSegment.flights || [outboundSegment];
    if (flightIndexes.length <= 1 || !flightData?.flight_legs) return 0;
    
    let layoverMinutes = 0;
    for (let i = 0; i < flightIndexes.length - 1; i++) {
      const currentLeg = flightData.flight_legs[flightIndexes[i]];
      const nextLeg = flightData.flight_legs[flightIndexes[i+1]];
      if (currentLeg?.arrival_unix_timestamp && nextLeg?.departure_unix_timestamp) {
        layoverMinutes += Math.floor((nextLeg.departure_unix_timestamp - currentLeg.arrival_unix_timestamp) / 60);
      }
    }
    return layoverMinutes;
  }, [flightData]);

  const getDepartureTimestamp = useCallback((ticket: any) => {
    const segments = ticket.segments || ticket.segment;
    if (!segments || segments.length === 0) return Infinity;
    const outboundSegment = segments[0];
    const flightIndexes = outboundSegment.flights || [outboundSegment];
    if (flightIndexes.length === 0 || !flightData?.flight_legs) return Infinity;
    const firstLeg = flightData.flight_legs[flightIndexes[0]];
    return firstLeg?.departure_unix_timestamp || Infinity;
  }, [flightData]);

  const getArrivalTimestamp = useCallback((ticket: any) => {
    const segments = ticket.segments || ticket.segment;
    if (!segments || segments.length === 0) return Infinity;
    const outboundSegment = segments[0];
    const flightIndexes = outboundSegment.flights || [outboundSegment];
    if (flightIndexes.length === 0 || !flightData?.flight_legs) return Infinity;
    const lastLeg = flightData.flight_legs[flightIndexes[flightIndexes.length - 1]];
    return lastLeg?.arrival_unix_timestamp || Infinity;
  }, [flightData]);

  const stopPrices = useMemo(() => {
    if (!flightData || !flightData.tickets) return { 0: null, 1: null, 2: null };
    const prices: Record<number, number | null> = { 0: null, 1: null, 2: null };
    
    flightData.tickets.forEach((ticket: any) => {
      const segments = ticket.segments || ticket.segment;
      if (!segments || segments.length === 0) return;
      const outboundSegment = segments[0];
      const flightIndexes = outboundSegment.flights || [outboundSegment];
      const stops = Math.max(0, flightIndexes.length - 1);
      const stopCategory = stops >= 2 ? 2 : stops;
      
      const price = ticket.proposals?.[0]?.minimum_fare?.price?.value || ticket.proposals?.[0]?.price?.value || 0;
      if (price > 0) {
        if (prices[stopCategory] === null || price < prices[stopCategory]!) {
          prices[stopCategory] = price;
        }
      }
    });
    return prices;
  }, [flightData]);

  const uniqueAirlines = useMemo(() => {
    if (!flightData || !flightData.tickets) return [];
    const airlines = new Set<string>();
    flightData.tickets.forEach((ticket: any) => {
      const segments = ticket.segments || ticket.segment;
      if (!segments || segments.length === 0) return;
      const firstSegment = segments[0];
      const flightIndexes = firstSegment.flights || [firstSegment];
      if (flightIndexes.length > 0 && flightData.flight_legs) {
        const firstLeg = flightData.flight_legs[flightIndexes[0]];
        if (firstLeg) {
          let airlineId = firstLeg.operating_carrier_designator?.airline_id || firstLeg.operating_carrier || firstLeg.carrier || firstLeg.airline || '';
          if (typeof airlineId === 'object') {
            airlineId = (airlineId as any).default || (airlineId as any).id || (airlineId as any).name || JSON.stringify(airlineId);
          }
          if (typeof airlineId !== 'string') airlineId = String(airlineId);
          if (airlineId) airlines.add(airlineId);
        }
      }
    });
    return Array.from(airlines).map(code => ({
      code,
      name: getAirlineName(flightData, code)
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [flightData]);

  const processedTickets = useMemo(() => {
    if (!flightData || !flightData.tickets) return [];
    let filtered = [...flightData.tickets];

    // Filter by Stops
    if (stopsFilter.length > 0) {
      filtered = filtered.filter((ticket: any) => {
        const segments = ticket.segments || ticket.segment;
        if (!segments || segments.length === 0) return false;
        const outboundSegment = segments[0];
        const flightIndexes = outboundSegment.flights || [outboundSegment];
        const stops = Math.max(0, flightIndexes.length - 1);
        // 2+ stops mapped to 2
        const stopCategory = stops >= 2 ? 2 : stops;
        return stopsFilter.includes(stopCategory);
      });
    }

    // Filter by Airline
    if (airlineFilter.length > 0) {
      filtered = filtered.filter((ticket: any) => {
        const segments = ticket.segments || ticket.segment;
        if (!segments || segments.length === 0) return false;
        const outboundSegment = segments[0];
        const flightIndexes = outboundSegment.flights || [outboundSegment];
        if (flightIndexes.length > 0 && flightData.flight_legs) {
          const firstLeg = flightData.flight_legs[flightIndexes[0]];
          if (firstLeg) {
            let airlineId = firstLeg.operating_carrier_designator?.airline_id || firstLeg.operating_carrier || firstLeg.carrier || firstLeg.airline || '';
            if (typeof airlineId === 'object') {
              airlineId = (airlineId as any).default || (airlineId as any).id || (airlineId as any).name || JSON.stringify(airlineId);
            }
            if (typeof airlineId !== 'string') airlineId = String(airlineId);
            return airlineFilter.includes(airlineId);
          }
        }
        return false;
      });
    }

    // Filter by Baggage
    if (baggageIncluded) {
      filtered = filtered.filter((ticket: any) => {
        const bestProposal = ticket.proposals?.[0];
        if (!bestProposal) return false;
        
        const terms = bestProposal.flight_terms;
        if (terms) {
          for (const key in terms) {
            const baggage = terms[key]?.baggage;
            if (baggage && (baggage.count > 0 || baggage.weight > 0)) {
              return true;
            }
          }
        }
        
        const minFareBaggage = bestProposal.minimum_fare?.baggage;
        if (minFareBaggage && (minFareBaggage.count > 0 || minFareBaggage.weight > 0)) {
          return true;
        }
        
        return false;
      });
    }

    // Filter by Price
    if (priceFilter !== null) {
      filtered = filtered.filter((ticket: any) => {
        const price = ticket.proposals?.[0]?.minimum_fare?.price?.value || ticket.proposals?.[0]?.price?.value || 0;
        return price <= priceFilter;
      });
    }

    // Filter by Duration
    if (durationFilter !== null) {
      filtered = filtered.filter((ticket: any) => {
        const duration = getDuration(ticket);
        return duration <= durationFilter;
      });
    }

    // Filter by Departure Time
    if (departureTimeFilter.length > 0) {
      filtered = filtered.filter((ticket: any) => {
        const segments = ticket.segments || ticket.segment;
        if (!segments || segments.length === 0) return false;
        const outboundSegment = segments[0];
        const flightIndexes = outboundSegment.flights || [outboundSegment];
        if (flightIndexes.length > 0 && flightData.flight_legs) {
          const firstLeg = flightData.flight_legs[flightIndexes[0]];
          if (firstLeg) {
            let depTime = firstLeg.local_departure_date_time || firstLeg.departure_time || firstLeg.departure;
            if (typeof depTime === 'object') depTime = (depTime as any).default || JSON.stringify(depTime);
            if (typeof depTime === 'string') {
              const timeMatch = depTime.match(/(\d{2}):(\d{2})/);
              if (timeMatch) {
                const hour = parseInt(timeMatch[1], 10);
                if (departureTimeFilter.includes('morning') && hour >= 6 && hour < 12) return true;
                if (departureTimeFilter.includes('afternoon') && hour >= 12 && hour < 18) return true;
                if (departureTimeFilter.includes('evening') && hour >= 18 && hour < 24) return true;
                if (departureTimeFilter.includes('night') && (hour >= 0 && hour < 6)) return true;
                return false;
              }
            }
          }
        }
        return false;
      });
    }

    // Sort
    filtered.sort((a: any, b: any) => {
      const priceA = a.proposals?.[0]?.minimum_fare?.price?.value || a.proposals?.[0]?.price?.value || 0;
      const priceB = b.proposals?.[0]?.minimum_fare?.price?.value || b.proposals?.[0]?.price?.value || 0;
      
      if (sortType === 'cheapest') {
        return priceA - priceB;
      } else if (sortType === 'duration' || sortType === 'fastest') {
        return getDuration(a) - getDuration(b);
      } else if (sortType === 'departure') {
        return getDepartureTimestamp(a) - getDepartureTimestamp(b);
      } else if (sortType === 'arrival') {
        return getArrivalTimestamp(a) - getArrivalTimestamp(b);
      } else if (sortType === 'layover') {
        return getLayoverDuration(a) - getLayoverDuration(b);
      } else if (sortType === 'recommended') {
        const scoreA = priceA * getDuration(a);
        const scoreB = priceB * getDuration(b);
        return scoreA - scoreB;
      }
      return 0;
    });

    return filtered;
  }, [flightData, stopsFilter, airlineFilter, baggageIncluded, priceFilter, durationFilter, departureTimeFilter, sortType, getDuration, getLayoverDuration, getDepartureTimestamp, getArrivalTimestamp]);

  const handleBookingRedirect = (proposal: any) => {
    if (!searchId || !resultsUrl || !flightData) return;
    
    // Grab the clean, human-readable label first, fallback to gate_name if missing
    const rawLabel = flightData.agents[proposal.agent_id]?.label?.en?.default || flightData.agents[proposal.agent_id]?.label?.en || flightData.agents[proposal.agent_id]?.gate_name || 'our partner';
    
    // URL encode it so spaces and dots (like "Trip.com" or "Air India") don't break the URL
    const cleanGateName = encodeURIComponent(rawLabel);

    const clickUrl = `https://${resultsUrl}/searches/${searchId}/clicks/${proposal.id}`;
    const encodedClickUrl = encodeURIComponent(clickUrl);
    const encodedFallback = encodeURIComponent(window.location.href);
    
    const finalUrl = `https://tpemd.com/wl/redirect?locale=en&gate_name=${cleanGateName}&redirect_url=${encodedClickUrl}&fallback_url=${encodedFallback}`;
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchParams.origin || !searchParams.destination || !searchParams.date) {
      setError("Please fill in all search fields.");
      return;
    }

    if (searchParams.origin === searchParams.destination) {
      setErrorType('same-airport');
      setError(null);
      setHasSearched(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setErrorType(null);
    setHasSearched(true);
    setFlightData(null);
    setSearchId(null);
    setResultsUrl(null);
    stopPolling();

    try {
      // Step 1: Start the Search
      const payload: any = {
        origin: searchParams.origin,
        destination: searchParams.destination,
        date: searchParams.date,
        passengers: searchParams.passengers,
        trip_class: searchParams.tripClass,
        return_date: searchParams.returnDate || '',
      };

      const startRes = await fetch('https://trawell-flights-api-675187781044.asia-south1.run.app/api/flights/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!startRes.ok) {
        const errText = await startRes.text();
        console.error('Start API Error:', errText);
        throw new Error('Failed to start flight search.');
      }

      const startData = await startRes.json();
      const { search_id, results_url } = startData;

      if (!search_id || !results_url) {
        throw new Error('Invalid response from search API.');
      }

      setSearchId(search_id);
      setResultsUrl(results_url);

      // Step 2: Poll for Results
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const pollRes = await fetch('https://trawell-flights-api-675187781044.asia-south1.run.app/api/flights/results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              search_id,
              results_url,
              last_update_timestamp: 0,
            }),
          });

          if (!pollRes.ok) {
            throw new Error('Failed to fetch flight results.');
          }

          const pollData = await pollRes.json();
          console.log("Poll Response:", pollData);

          // The API might return the data directly at the root, or nested under a 'data' property.
          let actualData = pollData.data ? pollData.data : pollData;
          
          // Sometimes the data payload is stringified JSON
          if (typeof actualData === 'string') {
            try {
              actualData = JSON.parse(actualData);
            } catch (e) {
              console.error("Failed to parse stringified data:", e);
            }
          }

          // Recursive function to find the object containing 'tickets'
          const findFlightData = (obj: any): any => {
            if (!obj || typeof obj !== 'object') return null;
            if (Array.isArray(obj.tickets) && obj.tickets.length > 0) return obj;
            
            for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                const result = findFlightData(obj[key]);
                if (result) return result;
              }
            }
            return null;
          };

          const flightDataObj = findFlightData(actualData);
          
          // If we found tickets in this poll, save them to state immediately
          if (flightDataObj) {
            setFlightData(flightDataObj);
          }

          if (pollData.is_over) {
            stopPolling();
            
            setFlightData(prevData => {
              // If we never found tickets by the time polling is over, show error
              if (!prevData && !flightDataObj) {
                console.warn("Tickets array is missing or empty in the final payload:", actualData);
                setErrorType('no-flights');
              }
              return flightDataObj || prevData;
            });
            
            setIsLoading(false);
          }
        } catch (err: any) {
          stopPolling();
          console.error("Flight polling error:", err);
          setErrorType('timeout');
          setIsLoading(false);
        }
      }, 3000);

    } catch (err: any) {
      console.error("Flight search error:", err);
      setErrorType('timeout');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-trawell-bg text-trawell-dark selection:bg-trawell-orange selection:text-white overflow-x-hidden w-full flex flex-col">
      <Navbar 
          onAuthClick={handleAuthClick} 
          onProfileClick={() => setIsProfileOpen(true)}
          onMyTripsClick={() => setIsMyTripsOpen(true)}
          onLogoClick={() => navigate('/')}
        />
        
        <main className="flex-grow w-full pt-28 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="mb-8 text-center">
             <h1 className="text-3xl md:text-5xl font-bold text-trawell-green mb-3 font-cursive">Book Your Flights</h1>
             <p className="text-gray-600 text-lg">Find the best deals for your next adventure</p>
          </div>

          {/* Custom Search Form */}
          <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-8 border border-gray-100 max-w-6xl mx-auto">
             <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
                <AirportInput 
                  label="Origin"
                  placeholder="City or Airport"
                  value={searchParams.origin}
                  onChange={(iata) => setSearchParams({...searchParams, origin: iata})}
                />
                
                <AirportInput 
                  label="Destination"
                  placeholder="City or Airport"
                  value={searchParams.destination}
                  onChange={(iata) => setSearchParams({...searchParams, destination: iata})}
                  icon={<Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transform rotate-90" />}
                />

                <div className="flex-1 min-w-[160px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                  <CustomDatePicker 
                    selected={searchParams.date ? new Date(searchParams.date) : null}
                    onChange={(date) => {
                      if (date) {
                        // Adjust for timezone offset to get the correct local date string
                        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                        setSearchParams({...searchParams, date: localDate.toISOString().split('T')[0]});
                      }
                    }}
                    minDate={new Date()}
                    placeholderText="Select date"
                    required
                  />
                </div>

                <div className="flex-1 min-w-[160px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Return Date (Optional)</label>
                  <CustomDatePicker 
                    selected={searchParams.returnDate ? new Date(searchParams.returnDate) : null}
                    onChange={(date) => {
                      if (date) {
                        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                        setSearchParams({...searchParams, returnDate: localDate.toISOString().split('T')[0]});
                      } else {
                        setSearchParams({...searchParams, returnDate: undefined});
                      }
                    }}
                    minDate={searchParams.date ? new Date(searchParams.date) : new Date()}
                    placeholderText="Select return date"
                  />
                </div>

                <div className="flex-1 min-w-[120px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      type="number" 
                      min="1"
                      max="9"
                      value={searchParams.passengers}
                      onChange={(e) => setSearchParams({...searchParams, passengers: parseInt(e.target.value) || 1})}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-trawell-orange focus:border-transparent outline-none text-gray-800 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-[120px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <div className="relative">
                    <select
                      value={searchParams.tripClass}
                      onChange={(e) => setSearchParams({...searchParams, tripClass: e.target.value})}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-trawell-orange focus:border-transparent outline-none appearance-none bg-white text-gray-800 font-medium"
                    >
                      <option value="Y">Economy</option>
                      <option value="W">Premium Economy</option>
                      <option value="C">Business</option>
                      <option value="F">First Class</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full xl:w-auto bg-[#D96C3B] hover:bg-[#c25e30] text-white px-8 py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-70 h-[52px]"
                >
                  {isLoading ? 'Searching...' : 'Search Flights'}
                  {!isLoading && <Search className="w-4 h-4" />}
                </button>
             </form>
          </div>
          
          {/* Results Area */}
          <div className="w-full min-h-[400px] max-w-7xl mx-auto">
             {isLoading && (
               <StateMessage type="loading" />
             )}

             {errorType && !isLoading && (
               <StateMessage type={errorType} />
             )}

             {error && !errorType && !isLoading && (
               <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100 max-w-5xl mx-auto">
                 <p className="text-lg font-medium">{error}</p>
               </div>
             )}

             {!isLoading && !errorType && flightData && flightData.tickets && flightData.tickets.length > 0 && (
               <div className="flex flex-col md:flex-row gap-6">
                 {/* Left Sidebar (Filters) */}
                 <div className={`
                   fixed inset-0 z-50 bg-white overflow-y-auto p-6 transition-transform duration-300
                   md:static md:z-auto md:bg-transparent md:p-0 md:block md:w-[240px] lg:w-[280px] shrink-0
                   ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                 `}>
                   <div className="flex justify-between items-center md:hidden mb-6">
                     <h3 className="text-xl font-bold text-trawell-dark">Filters & Sort</h3>
                     <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-gray-100 rounded-full">
                       <X className="w-5 h-5 text-gray-600" />
                     </button>
                   </div>
                   <div className="bg-white md:rounded-2xl md:shadow-sm md:border border-gray-100 md:p-6 md:sticky top-24">
                     <h3 className="text-lg font-bold text-trawell-dark mb-4 hidden md:block">Filters</h3>
                     
                     {/* Popular Filters */}
                     <div className="mb-6">
                       <h4 className="font-semibold text-gray-700 mb-3">Popular filters</h4>
                       <div className="flex flex-wrap gap-2">
                         <button
                           onClick={() => setBaggageIncluded(!baggageIncluded)}
                           className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border whitespace-nowrap ${baggageIncluded ? 'bg-trawell-orange text-white border-trawell-orange' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'}`}
                         >
                           Baggage included
                         </button>
                         <button
                           onClick={() => {
                             if (stopsFilter.includes(0)) {
                               setStopsFilter(stopsFilter.filter(s => s !== 0));
                             } else {
                               setStopsFilter([...stopsFilter, 0]);
                             }
                           }}
                           className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border whitespace-nowrap ${stopsFilter.includes(0) ? 'bg-trawell-orange text-white border-trawell-orange' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'}`}
                         >
                           No layovers
                         </button>
                       </div>
                     </div>

                     {/* Stops Filter */}
                     <div className="mb-6">
                       <h4 className="font-semibold text-gray-700 mb-3">Layovers</h4>
                       <div className="space-y-2">
                         {[
                           { label: 'Direct', value: 0 },
                           { label: '1 layover', value: 1 },
                           { label: '2+ layovers', value: 2 }
                         ].map((stop) => (
                           <label key={stop.value} className="flex items-center justify-between cursor-pointer group">
                             <div className="flex items-center gap-3">
                               <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${stopsFilter.includes(stop.value) ? 'bg-trawell-orange border-trawell-orange' : 'border-gray-300 group-hover:border-trawell-orange'}`}>
                                 {stopsFilter.includes(stop.value) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                               </div>
                               <input 
                                 type="checkbox" 
                                 className="hidden" 
                                 checked={stopsFilter.includes(stop.value)}
                                 onChange={(e) => {
                                   if (e.target.checked) {
                                     setStopsFilter([...stopsFilter, stop.value]);
                                   } else {
                                     setStopsFilter(stopsFilter.filter(s => s !== stop.value));
                                   }
                                 }}
                               />
                               <span className="text-gray-600 group-hover:text-trawell-dark transition-colors text-sm">{stop.label}</span>
                             </div>
                             {stopPrices[stop.value] !== null && (
                               <span className="text-xs lg:text-sm text-gray-500">₹{new Intl.NumberFormat('en-IN').format(Math.round(stopPrices[stop.value]!))}</span>
                             )}
                           </label>
                         ))}
                       </div>
                     </div>

                     {/* Departure Time */}
                     <div className="mb-6 border-t border-gray-100 pt-6">
                       <h4 className="font-semibold text-gray-700 mb-3">Departure time</h4>
                       <div className="grid grid-cols-2 gap-2">
                         {[
                           { id: 'morning', label: 'Morning', time: '06:00 - 11:59' },
                           { id: 'afternoon', label: 'Afternoon', time: '12:00 - 17:59' },
                           { id: 'evening', label: 'Evening', time: '18:00 - 23:59' },
                           { id: 'night', label: 'Night', time: '00:00 - 05:59' },
                         ].map((timeSlot) => (
                           <button
                             key={timeSlot.id}
                             onClick={() => {
                               if (departureTimeFilter.includes(timeSlot.id)) {
                                 setDepartureTimeFilter(departureTimeFilter.filter(t => t !== timeSlot.id));
                               } else {
                                 setDepartureTimeFilter([...departureTimeFilter, timeSlot.id]);
                               }
                             }}
                             className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs lg:text-sm transition-colors ${departureTimeFilter.includes(timeSlot.id) ? 'bg-trawell-orange/10 border-trawell-orange text-trawell-orange' : 'bg-white border-gray-200 text-gray-600 hover:border-trawell-orange'}`}
                           >
                             <span className="font-medium">{timeSlot.label}</span>
                             <span className="text-[9px] lg:text-[10px] opacity-70 whitespace-nowrap">{timeSlot.time}</span>
                           </button>
                         ))}
                       </div>
                     </div>

                     {/* Travel Time Filter */}
                     <div className="mb-6 border-t border-gray-100 pt-6">
                       <div className="flex justify-between items-center mb-3">
                         <h4 className="font-semibold text-gray-700">Travel time</h4>
                         <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                           Up to {Math.floor((durationFilter || maxDurationLimit) / 60)}h {(durationFilter || maxDurationLimit) % 60}m
                         </span>
                       </div>
                       <input 
                         type="range" 
                         min={minDuration} 
                         max={maxDurationLimit} 
                         value={durationFilter || maxDurationLimit} 
                         onChange={(e) => setDurationFilter(Number(e.target.value))}
                         className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-trawell-orange"
                       />
                     </div>

                     {/* Price Filter */}
                     <div className="mb-6 border-t border-gray-100 pt-6">
                       <div className="flex justify-between items-center mb-3">
                         <h4 className="font-semibold text-gray-700">Price</h4>
                         <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                           To ₹ {new Intl.NumberFormat('en-IN').format(Math.round(priceFilter || maxPriceLimit))}
                         </span>
                       </div>
                       <input 
                         type="range" 
                         min={minPrice} 
                         max={maxPriceLimit} 
                         value={priceFilter || maxPriceLimit} 
                         onChange={(e) => setPriceFilter(Number(e.target.value))}
                         className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-trawell-orange"
                       />
                     </div>

                     {/* Airlines Filter */}
                     {uniqueAirlines.length > 0 && (
                       <div className="mb-6 border-t border-gray-100 pt-6">
                         <h4 className="font-semibold text-gray-700 mb-3">Airlines</h4>
                         <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                           {uniqueAirlines.map((airline) => (
                             <label key={airline.code} className="flex items-center gap-3 cursor-pointer group">
                               <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${airlineFilter.includes(airline.code) ? 'bg-trawell-orange border-trawell-orange' : 'border-gray-300 group-hover:border-trawell-orange'}`}>
                                 {airlineFilter.includes(airline.code) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                               </div>
                               <input 
                                 type="checkbox" 
                                 className="hidden" 
                                 checked={airlineFilter.includes(airline.code)}
                                 onChange={(e) => {
                                   if (e.target.checked) {
                                     setAirlineFilter([...airlineFilter, airline.code]);
                                   } else {
                                     setAirlineFilter(airlineFilter.filter(a => a !== airline.code));
                                   }
                                 }}
                               />
                               <div className="flex items-center gap-2 overflow-hidden">
                                 <img 
                                   src={`https://pics.avs.io/100/100/${airline.code}.png`} 
                                   alt={airline.name} 
                                   className="w-5 h-5 object-contain flex-shrink-0"
                                   referrerPolicy="no-referrer"
                                 />
                                 <span className="text-gray-600 group-hover:text-trawell-dark transition-colors truncate text-sm">{airline.name}</span>
                               </div>
                             </label>
                           ))}
                         </div>
                       </div>
                     )}

                     {/* Sort by */}
                     <div className="mb-6 border-t border-gray-100 pt-6">
                       <h4 className="font-semibold text-gray-700 mb-3">Sort by</h4>
                       <div className="space-y-3">
                         {[
                           { id: 'recommended', label: 'Recommended first' },
                           { id: 'cheapest', label: 'Cheapest first' },
                           { id: 'departure', label: 'Departure time' },
                           { id: 'arrival', label: 'Arrival time' },
                           { id: 'layover', label: 'Layover duration' },
                           { id: 'duration', label: 'Trip duration' },
                         ].map((sortOption) => (
                           <label key={sortOption.id} className="flex items-center gap-3 cursor-pointer group">
                             <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${sortType === sortOption.id ? 'border-trawell-orange' : 'border-gray-300 group-hover:border-trawell-orange'}`}>
                               {sortType === sortOption.id && <div className="w-2.5 h-2.5 rounded-full bg-trawell-orange"></div>}
                             </div>
                             <input 
                               type="radio" 
                               name="sortType"
                               className="hidden" 
                               checked={sortType === sortOption.id}
                               onChange={() => setSortType(sortOption.id as any)}
                             />
                             <span className="text-gray-600 group-hover:text-trawell-dark transition-colors">{sortOption.label}</span>
                           </label>
                         ))}
                       </div>
                     </div>
                     
                     <div className="mt-8 md:hidden sticky bottom-0 bg-white pt-4 pb-6 border-t border-gray-100 z-10">
                       <button 
                         onClick={() => setIsMobileFiltersOpen(false)}
                         className="w-full bg-trawell-orange text-white py-3.5 rounded-xl font-bold text-lg shadow-lg"
                       >
                         Show {processedTickets.length} flights
                       </button>
                     </div>
                   </div>
                 </div>

                 {/* Main Feed */}
                 <div className="flex-1 w-full space-y-4">
                   <div className="flex flex-row items-center justify-between gap-4 mb-6">
                     <h2 className="text-xl md:text-2xl font-bold text-trawell-green">
                       {processedTickets.length} Flights Found
                     </h2>
                     <button 
                       onClick={() => setIsMobileFiltersOpen(true)}
                       className="md:hidden flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                     >
                       <Filter className="w-4 h-4" />
                       Filters
                     </button>
                   </div>
                   
                   {processedTickets.length === 0 ? (
                     <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
                       <p className="text-gray-500 text-lg">No flights match your selected filters.</p>
                       <button 
                         onClick={() => { 
                           setStopsFilter([]); 
                           setAirlineFilter([]); 
                           setBaggageIncluded(false);
                           setPriceFilter(null);
                           setDurationFilter(null);
                           setDepartureTimeFilter([]);
                           setSortType('recommended');
                         }}
                         className="mt-4 text-trawell-orange font-medium hover:underline"
                       >
                         Clear all filters
                       </button>
                     </div>
                   ) : (
                     processedTickets.map((ticket: any, index: number) => (
                       <FlightCard 
                         key={ticket.id || index} 
                         ticket={ticket} 
                         index={index} 
                         flightData={flightData} 
                         searchParams={searchParams} 
                         handleBookingRedirect={handleBookingRedirect} 
                       />
                     ))
                   )}
                 </div>
               </div>
             )}
           </div>
        </main>

        <Footer />

        <AuthModal 
          isOpen={!!authMode} 
          initialMode={authMode === 'signup' ? 'signup' : 'login'} 
          onClose={() => setAuthMode(null)}
          onSignupSuccess={() => {}}
        />

        <ProfileModal 
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onEditPreferences={() => {}}
        />

        <MyTripsModal 
          isOpen={isMyTripsOpen}
          onClose={() => setIsMyTripsOpen(false)}
        />
      </div>
  );
}
