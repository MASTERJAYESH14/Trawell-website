
'use client';

import React, { useState, useEffect } from 'react';
import { CompassLogo } from './ui/CompassLogo';
import { X, Mail, Lock, User as UserIcon, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { auth } from '../lib/firebase';
import firebase from 'firebase/compat/app';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
  onSignupSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode, onSignupSuccess }) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setError(null);
    setEmail('');
    setPassword('');
    setName('');
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const getErrorMessage = (err: any) => {
    console.error("Auth Error:", err);
    if (err.code === 'auth/invalid-email') return 'Invalid email address.';
    if (err.code === 'auth/user-not-found') return 'No account found with this email.';
    if (err.code === 'auth/wrong-password') return 'Incorrect password.';
    if (err.code === 'auth/email-already-in-use') return 'Email is already registered.';
    if (err.code === 'auth/weak-password') return 'Password should be at least 6 characters.';
    
    if (err.code === 'auth/unauthorized-domain') {
      const currentDomain = window.location.hostname;
      const domainToAdd = currentDomain || 'localhost';
      return `Domain not authorized. Add "${domainToAdd}" to Firebase Auth settings.`;
    }
    
    if (err.code === 'auth/popup-closed-by-user') return 'Sign in was cancelled.';
    if (err.code === 'auth/operation-not-allowed') return 'This sign-in method is not enabled.';
    return 'Something went wrong. Please try again.';
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
      const additionalInfo = result.additionalUserInfo;
      
      onClose();
      
      // Check if it's a new user
      if (additionalInfo?.isNewUser && onSignupSuccess) {
        onSignupSuccess();
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        if (name && userCredential.user) {
          await userCredential.user.updateProfile({ displayName: name });
        }
        onClose();
        if (onSignupSuccess) onSignupSuccess();
      } else {
        await auth.signInWithEmailAndPassword(email, password);
        onClose();
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-trawell-dark/70 backdrop-blur-[2px] transition-all">
      
      {/* Clean Solid Card */}
      <div className="relative w-full max-w-md bg-[#FBF6E9] rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-white/50">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-trawell-orange hover:bg-white/50 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-4">
            <CompassLogo size={56} animate={isLoading} />
          </div>
          
          <h2 className="text-2xl font-bold text-trawell-green tracking-tight font-sans">
            {mode === 'login' ? 'Welcome Back' : 'Join Trawell'}
          </h2>
          <p className="text-gray-600 text-center mt-1 text-sm">
            {mode === 'login' 
              ? "Continue your journey." 
              : "Create an account to start planning."}
          </p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={isLoading}
          className="w-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-sm mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300/50"></div>
          </div>
          <div className="relative bg-[#FBF6E9] px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
            Or continue with email
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-red-600 text-sm">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span className="break-words">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Name</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-trawell-orange transition-colors" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-trawell-orange focus:border-transparent transition-all placeholder:text-gray-400 text-trawell-dark"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-trawell-orange transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-trawell-orange focus:border-transparent transition-all placeholder:text-gray-400 text-trawell-dark"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-trawell-orange transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-trawell-orange focus:border-transparent transition-all placeholder:text-gray-400 text-trawell-dark"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            fullWidth 
            disabled={isLoading}
            className="mt-6 py-3.5 text-base shadow-lg hover:shadow-trawell-orange/25"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              mode === 'login' ? 'Log In' : 'Create Account'
            )}
          </Button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={toggleMode}
              className="font-bold text-trawell-orange hover:text-orange-700 hover:underline transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
