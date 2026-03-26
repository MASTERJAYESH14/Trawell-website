'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Calendar, MapPin, LogOut, Shield, Trash2, AlertTriangle, Loader2, Lock, HeartCrack, Edit2, Compass, Tag } from 'lucide-react';
import { Button } from './ui/Button';
import { auth, db } from '../lib/firebase';
import { deleteUserData } from '../services/userService';
import { doc, getDoc } from 'firebase/firestore';
import firebase from 'firebase/compat/app';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditPreferences: () => void;
}

// Format helper: "food_culture" -> "Food Culture"
const formatTag = (tag: string) => {
  if (!tag) return '';
  return tag.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onEditPreferences }) => {
  const { user, logout } = useAuth();
  
  // Data State
  const [userData, setUserData] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>('Loading...');
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Deletion State
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false); 
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  
  // Re-auth State
  const [needsReauth, setNeedsReauth] = useState(false);
  const [password, setPassword] = useState('');

  // Fetch Firestore Data & Location
  useEffect(() => {
    if (!isOpen || !user) return;

    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);

          // Reverse Geocode if location exists
          if (data.location) {
            const { latitude, longitude } = data.location;
            try {
              // Using OpenStreetMap Nominatim API (Free, requires User-Agent in headers usually handled by browser)
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const locData = await res.json();
              
              const city = locData.address.city || locData.address.town || locData.address.village;
              const country = locData.address.country;
              
              if (city && country) setLocationName(`${city}, ${country}`);
              else if (country) setLocationName(country);
              else setLocationName(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
              
            } catch (err) {
              console.error("Geocoding error:", err);
              setLocationName('Unknown Location');
            }
          } else {
            setLocationName('Not Set');
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [isOpen, user]);

  if (!isOpen) return null;

  if (isDeleted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-trawell-dark/70 backdrop-blur-sm transition-all animate-in fade-in duration-500">
        <div className="relative w-full max-w-md bg-[#FBF6E9] rounded-3xl p-8 shadow-2xl text-center border border-white/50">
           <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
             <HeartCrack size={40} />
           </div>
           
           <h2 className="text-3xl font-bold text-trawell-green mb-3 font-cursive">It's hard to say goodbye...</h2>
           
           <p className="text-gray-600 mb-8 leading-relaxed">
             We hate seeing you go. Trawell was built for explorers like you, and the world feels a little smaller without you in our community.
             <br/><br/>
             <span className="text-sm italic text-gray-500">Hope to see you back on the road soon.</span>
           </p>
           
           <Button 
             fullWidth 
             onClick={() => window.location.reload()} 
             className="shadow-xl"
           >
             Goodbye for now
           </Button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const performDelete = async () => {
    if (auth.currentUser) {
      await deleteUserData(auth.currentUser.uid);
      await auth.currentUser.delete();
      setIsDeleted(true);
    }
  };

  const handleDeleteAccount = async () => {
    if (!needsReauth && deleteConfirmationText.toLowerCase() !== 'delete') {
      setDeleteError("Please type 'delete' to confirm.");
      return;
    }
    
    if (needsReauth && !password) {
        setDeleteError("Please enter your password.");
        return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      if (needsReauth) {
         const credential = firebase.auth.EmailAuthProvider.credential(user.email!, password);
         await user.reauthenticateWithCredential(credential);
         await performDelete();
      } else {
         await performDelete();
      }
    } catch (error: any) {
      console.error("Delete account error:", error);
      if (error.code === 'auth/requires-recent-login') {
        const providerId = user.providerData[0]?.providerId;
        if (providerId === 'google.com') {
          try {
             const provider = new firebase.auth.GoogleAuthProvider();
             await user.reauthenticateWithPopup(provider);
             await performDelete();
          } catch (reauthErr: any) {
             setDeleteError("Authentication failed. " + reauthErr.message);
          }
        } else if (providerId === 'password') {
          setNeedsReauth(true);
          setDeleteError("Security verification required. Please enter your password.");
          setIsDeleting(false);
          return;
        } else {
           setDeleteError("Please sign out and sign in again to verify ownership.");
        }
      } else if (error.code === 'auth/wrong-password') {
         setDeleteError("Incorrect password.");
      } else {
        setDeleteError(error.message || "Could not delete account. Please try again.");
      }
    } finally {
      if (!needsReauth && !isDeleted) {
          setIsDeleting(false);
      }
    }
  };

  const joinDate = user.metadata.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  const lastSignIn = user.metadata.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : 'Just now';

  // Extract preferences safely
  const prefs = userData?.travelPreferences || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-trawell-dark/70 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FBF6E9] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/50">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-trawell-orange hover:bg-trawell-orange/10 rounded-full transition-all z-20"
        >
          <X size={24} />
        </button>

        {/* Profile Content */}
        <div className="p-8 flex-1 overflow-y-auto relative hide-scrollbar">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 mt-2">
             <div className="flex-shrink-0">
                <div className="w-28 h-28 rounded-full bg-white p-1.5 shadow-lg border border-gray-100">
                  <div className="w-full h-full bg-trawell-orange rounded-full flex items-center justify-center text-white text-4xl font-bold font-cursive">
                    {user.displayName ? user.displayName[0].toUpperCase() : 'T'}
                  </div>
                </div>
             </div>

             <div className="flex-1 text-center sm:text-left space-y-1">
                <h2 className="text-3xl font-bold text-trawell-green font-sans tracking-tight">{user.displayName || 'Traveler'}</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm font-medium text-gray-500">
                  <span className="bg-trawell-green/10 text-trawell-green px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Explorer</span>
                  <span>•</span>
                  <span>Member since {joinDate}</span>
                </div>
                <div className="pt-3 flex justify-center sm:justify-start gap-3">
                   <Button 
                      variant="outline" 
                      onClick={handleLogout} 
                      className="py-2 px-4 h-9 text-xs rounded-lg"
                   >
                     <LogOut size={14} />
                     Sign Out
                   </Button>
                </div>
             </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Mail size={18} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email</p>
                <p className="text-gray-800 font-medium truncate text-sm" title={user.email || ''}>{user.email}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Shield size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Account ID</p>
                <p className="text-gray-800 font-medium truncate font-mono text-xs text-gray-500">#{user.uid.slice(0, 12)}...</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Home Base</p>
                <p className="text-gray-800 font-medium text-sm">{locationName}</p>
              </div>
            </div>

             <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Last Seen</p>
                <p className="text-gray-800 font-medium text-sm">{lastSignIn}</p>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-trawell-green flex items-center gap-2">
                <Compass size={20} />
                Travel DNA
              </h3>
              <button 
                onClick={onEditPreferences}
                className="text-trawell-orange text-xs font-bold hover:underline uppercase tracking-wide flex items-center gap-1"
              >
                <Edit2 size={12} />
                Edit
              </button>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
              {isLoadingData ? (
                 <div className="flex justify-center py-4">
                   <Loader2 className="animate-spin text-gray-300" />
                 </div>
              ) : Object.keys(prefs).length > 0 ? (
                <>
                  {/* Row 1: Excitement */}
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Excited About</p>
                    <div className="flex flex-wrap gap-2">
                      {prefs.travel_excitement?.split(',').map((tag: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-semibold border border-orange-100">
                          {formatTag(tag)}
                        </span>
                      ))}
                    </div>
                  </div>

                   {/* Row 2: Free Time */}
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Free Time Activities</p>
                    <div className="flex flex-wrap gap-2">
                      {prefs.free_time_preference?.split(',').map((tag: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-100">
                          {formatTag(tag)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     {/* Role */}
                     <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Travel Role</p>
                        <p className="text-sm font-medium text-gray-700">{formatTag(prefs.travel_life_role?.split(',')[0])}</p>
                     </div>
                     {/* Style */}
                     <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Planning Style</p>
                        <p className="text-sm font-medium text-gray-700">{formatTag(prefs.travel_planning_style)}</p>
                     </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-gray-400 text-sm">
                  No preferences set yet.
                  <br/>
                  <button onClick={onEditPreferences} className="text-trawell-orange font-bold hover:underline mt-1">Take the quiz</button>
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-6 border-t border-gray-200">
             <button 
                onClick={() => {
                  setIsDeleteConfirmOpen(true);
                  setDeleteConfirmationText('');
                  setDeleteError(null);
                  setNeedsReauth(false);
                  setPassword('');
                }}
                className="flex items-center gap-2 text-red-500 text-sm font-semibold hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
             >
               <Trash2 size={16} />
               Delete Account
             </button>
          </div>

        </div>

        {/* Delete Confirmation Overlay (Same as before) */}
        {isDeleteConfirmOpen && (
          <div className="absolute inset-0 z-30 bg-[#FBF6E9]/95 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
             <div className="w-full max-w-sm text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                   {needsReauth ? <Lock size={32} /> : <AlertTriangle size={32} />}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900">
                  {needsReauth ? 'Verify Identity' : 'Delete Account?'}
                </h3>
                
                <p className="text-gray-600 text-sm">
                  {needsReauth 
                    ? 'For your security, please confirm your password to proceed with deletion.'
                    : 'This action is permanent. All your saved data will be wiped immediately.'
                  }
                </p>
                
                <div className="text-left bg-white p-3 rounded-xl border border-gray-200 shadow-inner">
                  {needsReauth ? (
                    <>
                      <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-1 outline-none text-gray-900 font-semibold"
                        placeholder="••••••••"
                        autoFocus
                      />
                    </>
                  ) : (
                    <>
                      <label className="text-xs font-bold text-gray-500 uppercase">Type "delete" to confirm</label>
                      <input 
                        type="text" 
                        value={deleteConfirmationText}
                        onChange={(e) => setDeleteConfirmationText(e.target.value)}
                        className="w-full mt-1 outline-none text-gray-900 font-semibold"
                        placeholder="delete"
                        autoFocus
                      />
                    </>
                  )}
                </div>

                {deleteError && (
                  <p className="text-red-600 text-xs bg-red-50 p-2 rounded border border-red-200">
                    {deleteError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button 
                    fullWidth 
                    variant="outline" 
                    onClick={() => {
                      setIsDeleteConfirmOpen(false);
                      setDeleteError(null);
                      setNeedsReauth(false);
                      setPassword('');
                    }}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Cancel
                  </Button>
                  <Button 
                    fullWidth 
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || (!needsReauth && deleteConfirmationText.toLowerCase() !== 'delete') || (needsReauth && !password)}
                    className={`border-none shadow-none text-white ${
                      (needsReauth && password) || (!needsReauth && deleteConfirmationText.toLowerCase() === 'delete')
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {isDeleting ? <Loader2 className="animate-spin w-4 h-4" /> : (needsReauth ? 'Verify & Delete' : 'Confirm')}
                  </Button>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};