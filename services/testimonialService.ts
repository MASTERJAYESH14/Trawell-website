
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { Testimonial } from "../types";

export const getFeaturedTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const testimonialsRef = collection(db, "testimonials");
    
    // Query for isFeatured == "true" (string) as seen in screenshot
    // Also include a fallback for boolean true just in case
    // Note: Firestore doesn't support logical OR in a single 'where' clause easily for mixed types without 'in'
    // We will query for string "true" first as that matches the screenshot data.
    
    const q = query(
      testimonialsRef, 
      where("isFeatured", "==", "true"),
      limit(6) // Fetch a few more to have backup
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Testimonial[];
    
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
};
