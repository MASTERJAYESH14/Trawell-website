import { 
  Zap, 
  Moon, 
  Heart, 
  Users, 
  Mountain, 
  Briefcase, 
  Sparkles,
  Map 
} from 'lucide-react';
import { Category, Destination } from './types';

// Matching the vision/mission text from the prompt
export const VISION_TEXT = "To become the world’s most intuitive travel companion, building a future where every journey is seamless, every recommendation is spot-on, and exploring the unknown is as easy as tapping a screen.";

export const MISSION_TEXT = "To liberate travelers from the \"cookie-cutter\" holiday. By leveraging advanced Agentic AI, we dig deep into local data to uncover off-beat experiences that standard booking engines miss. Our goal is to give you a journey that feels exclusively yours, seamlessly planned and effortlessly flexible.";

// Categories based on Screenshot 1 & Prompt
// Note: Business Travel changed to Group Tours as requested
// Updated ID 'group' -> 'business' to match Firestore data sample provided
export const CATEGORIES: Category[] = [
  {
    id: 'personalized',
    title: 'Personalized Itinerary',
    subtitle: 'Tailored journeys just for you. Anytime, Anywhere.',
    icon: Sparkles,
    isPrimary: true, // Special gradient card
  },
  {
    id: 'impromptu',
    title: 'Impromptu Travel',
    subtitle: 'Last-minute adventures',
    icon: Zap,
  },
  {
    id: 'pilgrimage',
    title: 'Pilgrimage',
    subtitle: 'Spiritual journeys',
    icon: Moon, // Using Moon/Temple metaphor
  },
  {
    id: 'romantic',
    title: 'Romantic Getaways',
    subtitle: 'Perfect for couples',
    icon: Heart,
  },
  {
    id: 'family',
    title: 'Family Travel',
    subtitle: 'Fun for everyone',
    icon: Users,
  },
  {
    id: 'adventure',
    title: 'Adventure Tours',
    subtitle: 'Thrill seekers',
    icon: Mountain,
  },
  {
    id: 'business', 
    title: 'Group Tours',
    subtitle: 'Packages & more',
    icon: Map, 
  },
];

export const FEATURED_DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Goa Beach Paradise',
    description: 'Experience the vibrant nightlife and serene beaches of Goa.',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    price: 11000,
    originalPrice: 15000,
    rating: 4.6,
    reviewCount: 120,
    city: 'Goa',
    state: 'Goa'
  },
  {
    id: '2',
    name: 'Manali Adventure',
    description: 'Snow-capped mountains, river rafting and trekking.',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    price: 13000,
    originalPrice: 18000,
    rating: 4.7,
    reviewCount: 85,
    city: 'Manali',
    state: 'Himachal Pradesh'
  },
  {
    id: '3',
    name: 'Kerala Backwaters',
    description: 'Serene houseboats and lush green landscapes.',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    price: 15000,
    originalPrice: 20000,
    rating: 4.8,
    reviewCount: 200,
    city: 'Alleppey',
    state: 'Kerala'
  },
  {
    id: '4',
    name: 'Jaipur Royal City',
    description: 'Historic forts, palaces and pink city vibes.',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    price: 9500,
    originalPrice: 12000,
    rating: 4.5,
    reviewCount: 95,
    city: 'Jaipur',
    state: 'Rajasthan'
  }
];