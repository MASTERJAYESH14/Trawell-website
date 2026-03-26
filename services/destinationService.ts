import { db } from "../lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, DocumentData } from "firebase/firestore";
import { FirestoreDestination } from "../types";

// Helper to fetch city image
const getCityImage = async (cityIdOrName: string): Promise<string | null> => {
  if (!cityIdOrName) return null;
  try {
    // First try as direct ID (case-sensitive)
    let docRef = doc(db, "city_images", cityIdOrName);
    let docSnap = await getDoc(docRef);

    // If not found, try lowercase (common for city names/ids)
    if (!docSnap.exists()) {
      docRef = doc(db, "city_images", cityIdOrName.toLowerCase());
      docSnap = await getDoc(docRef);
    }
    
    if (docSnap.exists()) {
      return docSnap.data().image_base64 || null;
    }
    return null;
  } catch (err) {
    console.error(`Error fetching image for ${cityIdOrName}:`, err);
    return null;
  }
};

// Helper to clean messy URLs (like Google Image Search results copied directly)
const cleanImageUrl = (url: string): string => {
  if (!url) return '';
  
  // Handle Google Image Search Results (extract actual image)
  // Example: https://www.google.com/imgres?q=...&imgurl=ACTUAL_IMAGE_URL&...
  if (url.includes('google.com/imgres') || url.includes('google.co.in/imgres')) {
    try {
      // Create a dummy base if the URL is relative (though usually it's absolute here)
      const urlObj = new URL(url);
      const imgUrl = urlObj.searchParams.get('imgurl');
      if (imgUrl) return decodeURIComponent(imgUrl);
    } catch (e) {
      console.warn("Failed to parse Google Image URL", e);
    }
  }
  
  return url;
};

// Shared Logic to process a destination document
const processDestinationData = async (docId: string, data: DocumentData): Promise<FirestoreDestination> => {
  // Normalize data to handle inconsistent field names (category vs categories)
  const normalizedData = { ...data };
  
  // Handle category/categories mismatch
  if (normalizedData.categories && !normalizedData.category) {
      normalizedData.category = normalizedData.categories;
  }
  
  const destination = { ...normalizedData, id: docId } as FirestoreDestination;
  let prioritizedCoverImage: string | null = null;

  // Resolve Images from References in 'images' array
  if (destination.images && Array.isArray(destination.images)) {
     const resolvedImages = await Promise.all(destination.images.map(async (img) => {
       if (img && typeof img === 'object' && typeof img.url === 'string') {
           // Case 1: Internal City Image Reference
           if (img.url.includes('city_images/')) {
              const parts = img.url.split('city_images/');
              const cityId = parts[parts.length - 1]; 
              
              if (cityId) {
                 const base64 = await getCityImage(cityId);
                 if (base64) {
                    if (cityId.toLowerCase().includes('jaipur')) {
                       prioritizedCoverImage = base64;
                    }
                    return { ...img, url: `data:image/jpeg;base64,${base64}` };
                 }
              }
           } 
           // Case 2: External URL (potentially messy Google Link)
           else {
             img.url = cleanImageUrl(img.url);
           }
       }
       return img;
     }));
     destination.images = resolvedImages;
  }

  // Set mainImageBase64
  // Logic: 
  // 1. If we found a priority cover image (from city_images), use that base64.
  // 2. Else, if we have images, use the first one.
  if (prioritizedCoverImage) {
      destination.mainImageBase64 = prioritizedCoverImage;
  } else if (destination.images && destination.images.length > 0) {
     const firstImg = destination.images[0];
     // If the first image is a data URI, extract base64 for mainImageBase64
     if (firstImg && typeof firstImg.url === 'string' && firstImg.url.startsWith('data:')) {
        const dataUrl = firstImg.url;
        const base64Part = dataUrl.split(',')[1];
        destination.mainImageBase64 = base64Part;
     }
     // Note: If it's a standard URL, we don't set mainImageBase64. 
     // The UI components fallback to destination.images[0].url correctly.
  } 
  
  // Fallback: If no images at all, try to fetch generic city image
  if ((!destination.images || destination.images.length === 0) && destination.city && destination.city.length > 0) {
     const cityImg = await getCityImage(destination.city[0]);
     if (cityImg) {
       destination.mainImageBase64 = cityImg;
     }
  }

  return destination;
};

// Fetcher for Categories
export const getDestinationsByCategory = async (categoryId: string): Promise<FirestoreDestination[]> => {
  try {
    let searchTerm = categoryId;
    const map: Record<string, string> = {
        'romantic': 'romantic-getaway',
        'family': 'family-travel',
        'adventure': 'adventure-tours',
        'business': 'group-tours',
        'impromptu': 'impromptu',
        'pilgrimage': 'pilgrimage'
    };

    if (map[categoryId]) {
        searchTerm = map[categoryId];
    }
    
    // Handle inconsistent schema: Query both 'category' and 'categories' fields
    const q1 = query(collection(db, "destinations"), where("category", "array-contains", searchTerm));
    const q2 = query(collection(db, "destinations"), where("categories", "array-contains", searchTerm));
    
    // Execute both queries in parallel
    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    
    // Deduplicate documents using a Map
    const docsMap = new Map();
    snap1.forEach(doc => docsMap.set(doc.id, doc));
    snap2.forEach(doc => docsMap.set(doc.id, doc));
    
    const promises = Array.from(docsMap.values()).map(doc => processDestinationData(doc.id, doc.data()));
    return await Promise.all(promises);
  } catch (error) {
    console.error(`Error fetching destinations for category ${categoryId}:`, error);
    return [];
  }
};

export const getFeaturedDestinations = async (): Promise<FirestoreDestination[]> => {
  try {
    const q = query(collection(db, "destinations"), where("isActive", "==", true));
    const querySnapshot = await getDocs(q);
    
    const promises = querySnapshot.docs.map(doc => processDestinationData(doc.id, doc.data()));
    return await Promise.all(promises);
  } catch (error) {
    console.error("Error fetching featured destinations:", error);
    return [];
  }
};