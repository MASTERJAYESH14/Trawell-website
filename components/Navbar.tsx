
'use client';

import React, { useState, useEffect } from 'react';
import { CompassLogo } from './ui/CompassLogo';
import { Button } from './ui/Button';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onAuthClick: (mode: 'login' | 'signup') => void;
  onProfileClick: () => void;
  onMyTripsClick: () => void;
  onLogoClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAuthClick, onProfileClick, onMyTripsClick, onLogoClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  const handleMyTrips = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
        onMyTripsClick();
    } else {
        onAuthClick('login');
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled || isMobileMenuOpen ? 'bg-trawell-bg/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
          <CompassLogo size={40} />
          <span className="text-2xl font-bold text-trawell-green tracking-tight">Trawell</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" onClick={handleMyTrips} className="text-gray-600 hover:text-trawell-orange font-medium transition-colors">My Trips</a>
          <Link to="/aboutus" className="text-gray-600 hover:text-trawell-orange font-medium transition-colors">About Us</Link>
          
          <div className="ml-4 pl-4 border-l border-gray-300 flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={onProfileClick}
                  className="flex items-center gap-2 text-trawell-green font-bold bg-white/50 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="bg-trawell-orange/10 p-1 rounded-full group-hover:bg-trawell-orange/20 transition-colors">
                    <User size={16} className="text-trawell-orange" />
                  </div>
                  <span>Hi, {user.displayName?.split(' ')[0] || 'Traveler'}</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                 <Button variant="ghost" onClick={() => onAuthClick('login')}>Log In</Button>
                 <Button variant="primary" onClick={() => onAuthClick('signup')}>Sign Up</Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-trawell-green"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-trawell-bg border-t border-gray-100 p-4 shadow-xl absolute w-full">
           <div className="flex flex-col gap-4">
            {user && (
              <div 
                className="flex items-center gap-3 pb-4 border-b border-gray-200 cursor-pointer active:bg-gray-50 rounded-lg p-2 -mx-2"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onProfileClick();
                }}
              >
                <div className="w-10 h-10 bg-trawell-orange rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.displayName ? user.displayName[0].toUpperCase() : 'T'}
                </div>
                <div>
                  <p className="font-bold text-trawell-green">{user.displayName || 'Traveler'}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <p className="text-xs text-trawell-orange font-bold mt-1">View Profile</p>
                </div>
              </div>
            )}

            <a href="#" onClick={handleMyTrips} className="text-gray-800 font-medium py-2">My Trips</a>
            <Link to="/aboutus" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium py-2">About Us</Link>
            
            <hr className="border-gray-200" />
            
            {user ? (
              <Button fullWidth variant="outline" onClick={handleLogout}>
                <LogOut size={18} className="mr-2" />
                Sign Out
              </Button>
            ) : (
              <div className="flex flex-col gap-3">
                <Button fullWidth variant="ghost" onClick={() => { onAuthClick('login'); setIsMobileMenuOpen(false); }}>Log In</Button>
                <Button fullWidth onClick={() => { onAuthClick('signup'); setIsMobileMenuOpen(false); }}>Sign Up</Button>
              </div>
            )}
           </div>
        </div>
      )}
    </nav>
  );
};
