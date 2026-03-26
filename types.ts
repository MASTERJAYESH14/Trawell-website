
import { LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color?: string;
  isPrimary?: boolean; // For the "Personalized Itinerary" card
}

// Legacy destination type for mock data (keeping for backward compatibility with Category modal)
export interface Destination {
  id: string;
  name: string;
  category?: string;
  city?: string;
  country?: string;
  description: string;
  duration?: string;
  galleryImages?: string[];
  imageUrl: string;
  inclusions?: string[];
  isFeatured?: boolean;
  originalPrice?: number;
  price: number;
  rating: number;
  reviewCount?: number;
  state?: string;
}

// New Real Data Interface
export interface FirestoreDestination {
  id?: string; // Document ID
  slug: string;
  title: string;
  description: string;
  duration: string;
  isActive: boolean;
  category: string[]; // Matches Firestore array field
  
  // Coming Soon flags
  coming_soon?: string | boolean;
  isComingSoon?: boolean;
  
  // Search Filters
  city: string[];
  state: string;

  // Pricing Model
  price: {
    basePrice: number;
    currency: string;
    occupancyRule: string;
    originalPrice?: number;
  };

  // Media
  images: Array<{
    url: string;
    caption: string;
  }>;
  
  // UI Helper: Main image fetched from city_images
  mainImageBase64?: string;
  
  // WhatsApp & Email Integration
  whatsapp_template?: string;
  email_template?: string;

  // Accommodations
  accommodation: Array<{
    city: string;
    hotelId: string;
    nights: number;
    mealPlan: string;
  }>;

  // Timeline
  itinerary: Array<{
    day: number;
    title: string;
    activities: Array<{
      time: string;
      title: string;
      type: "visit" | "travel" | "food" | "stay"; 
    }>;
  }>;

  inclusions: string[];
  exclusions: string[];
  
  // Enquiry metadata
  enquiredAt?: any; // Firestore Timestamp or Date
  status?: string;
}

export interface User {
  email: string;
  name?: string;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    code: string;
    city: string;
    time: string;
    terminal?: string;
  };
  arrival: {
    code: string;
    city: string;
    time: string;
    terminal?: string;
  };
  duration: string;
  price: number;
  currency: string;
  stops: number;
}

export interface Testimonial {
  id: string;
  travelerName: string;
  reviewText: string;
  rating: number;
  tripId?: string;
  isFeatured: string | boolean;
  highlight?: string;
  location?: string; // Optional (not in screenshot, but good to have)
  createdAt?: any;
}

export type AuthMode = 'login' | 'signup' | null;
