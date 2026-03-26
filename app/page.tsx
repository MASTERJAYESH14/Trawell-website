
'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { TravelServices } from '../components/TravelServices';
import { PersonalizedBanner } from '../components/PersonalizedBanner';
import { CategoryGrid } from '../components/CategoryGrid';
import { FeaturedDestinations } from '../components/FeaturedDestinations';
import { VisionMission } from '../components/VisionMission';
import { Testimonials } from '../components/Testimonials';
import { Footer } from '../components/Footer';
import { AuthModal } from '../components/AuthModal';
import { PlannerModal } from '../components/PlannerModal';
import { ProfileModal } from '../components/ProfileModal';
import { OnboardingModal } from '../components/OnboardingModal';
import { FlightSearchModal } from '../components/FlightSearchModal';
import { HotelSearchModal } from '../components/HotelSearchModal';
import { MyTripsModal } from '../components/MyTripsModal';
import { AuthMode } from '../types';
import { AuthProvider } from '../context/AuthContext';

export default function Home() {
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false); // Kept for future use if needed, but disconnected from banner
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isFlightSearchOpen, setIsFlightSearchOpen] = useState(false);
  const [isHotelSearchOpen, setIsHotelSearchOpen] = useState(false);
  const [isMyTripsOpen, setIsMyTripsOpen] = useState(false);

  const navigate = useNavigate();

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
  };

  const closeAuth = () => {
    setAuthMode(null);
  };

  const handleSignupSuccess = () => {
    // Open onboarding after successful signup
    setIsOnboardingOpen(true);
  };

  const handleEditPreferences = () => {
    setIsProfileOpen(false); // Close profile first
    setIsOnboardingOpen(true); // Open onboarding to edit
  };

  const handleOpenMyTrips = () => {
    setIsMyTripsOpen(true);
  };

  const handleStartPlanning = () => {
    const phoneNumber = "919056454920";
    const text = "Hi Trawell, I'm interested in planning a trip. Can you help me?";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen font-sans bg-trawell-bg text-trawell-dark selection:bg-trawell-orange selection:text-white overflow-x-hidden w-full">
      <Navbar 
          onAuthClick={handleAuthClick} 
          onProfileClick={() => setIsProfileOpen(true)}
          onMyTripsClick={() => setIsMyTripsOpen(true)}
        />
        
        <main className="flex flex-col gap-0 w-full overflow-x-hidden">
          {/* Hero Start Planning now opens WhatsApp directly */}
          <Hero onStartPlanning={handleStartPlanning} />
          
          {/* Service Buttons: Hotels, Flights, Trains, Bus */}
          <TravelServices 
            onFlightsClick={() => navigate('/flights')}
            onHotelsClick={() => setIsHotelSearchOpen(true)}
          />

          {/* Featured Destinations */}
          <div id="featured-destinations" className="w-full">
            <FeaturedDestinations 
               onRequireAuth={() => setAuthMode('login')} 
               onOpenMyTrips={handleOpenMyTrips}
            />
          </div>

          {/* Trawell Categories Section */}
          <div id="explore-categories" className="bg-white/50 pt-8 pb-12 rounded-t-[3rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] -mt-2">
             <div className="max-w-7xl mx-auto px-4 mb-4">
               <h2 className="text-xl md:text-2xl font-bold text-trawell-green mb-4 px-1">Explore by Category</h2>
             </div>
             
             {/* Updated: Personalized Banner now opens WhatsApp directly */}
             <PersonalizedBanner onOpenPlanner={handleStartPlanning} />
             
             <div className="mt-4">
                <CategoryGrid 
                   onRequireAuth={() => setAuthMode('login')} 
                   onOpenMyTrips={handleOpenMyTrips}
                />
             </div>
          </div>

          <Testimonials />
          
          <VisionMission />
        </main>

        <Footer />

        <AuthModal 
          isOpen={!!authMode} 
          initialMode={authMode === 'signup' ? 'signup' : 'login'} 
          onClose={closeAuth}
          onSignupSuccess={handleSignupSuccess}
        />

        {/* AI Planner Modal - Kept in code but not triggered by default buttons for now */}
        <PlannerModal 
          isOpen={isPlannerOpen}
          onClose={() => setIsPlannerOpen(false)}
        />

        <ProfileModal 
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onEditPreferences={handleEditPreferences}
        />

        <OnboardingModal 
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
        />

        <FlightSearchModal 
          isOpen={isFlightSearchOpen} 
          onClose={() => setIsFlightSearchOpen(false)} 
        />

        <HotelSearchModal
          isOpen={isHotelSearchOpen}
          onClose={() => setIsHotelSearchOpen(false)}
        />

        <MyTripsModal 
          isOpen={isMyTripsOpen}
          onClose={() => setIsMyTripsOpen(false)}
        />
      </div>
  );
}
