
import { db } from "../lib/firebase";
import { doc, setDoc, deleteDoc, GeoPoint, collection, getDocs, getDoc } from "firebase/firestore";
import { FirestoreDestination } from "../types";

export interface OnboardingAnswers {
  excitement: string; // Comma-separated
  timeSpending: string; // Comma-separated
  travelStyle: string;
  travelRole: string; // Comma-separated
  newThingsAttitude: string;
}

interface UserData {
  email?: string | null;
  name?: string | null;
  location?: { lat: number, lng: number };
}

export const saveUserPreferences = async (userId: string, answers: OnboardingAnswers, userData?: UserData) => {
  try {
    const userRef = doc(db, "users", userId);
    
    // Transform to snake_case DB keys matching requirements
    const travelPreferences = {
      travel_excitement: answers.excitement,
      free_time_preference: answers.timeSpending,
      travel_planning_style: answers.travelStyle,
      travel_life_role: answers.travelRole,
      openness_to_new_experiences: answers.newThingsAttitude
    };

    // Prepare the payload
    const payload: any = {
      travelPreferences,
      onboarded: true,
      updatedAt: new Date(),
      createdAt: new Date(), // Explicitly set createdAt
      uid: userId
    };

    // Add basic user info if provided
    if (userData?.email) payload.email = userData.email;
    if (userData?.name) payload.name = userData.name;
    
    // Add GeoPoint if location is available
    if (userData?.location) {
      payload.location = new GeoPoint(userData.location.lat, userData.location.lng);
    }

    // Merge true allows us to update/create without overwriting other existing fields
    await setDoc(userRef, payload, { merge: true });
    
  } catch (error) {
    console.error("Error saving preferences:", error);
    throw error;
  }
};

export const deleteUserData = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
    // Note: This only deletes the user document. 
    // Subcollections (like trip_requests) are not automatically deleted by client SDKs.
  } catch (error) {
    console.error("Error deleting user data:", error);
    throw error;
  }
};

// --- New Functions for Enquiry Logic ---

export const saveEnquiredTrip = async (userId: string, destination: FirestoreDestination) => {
  try {
    // UPDATED: Changed 'trip_details' to 'trip_requests' to match Firestore Security Rules
    // The rules explicitly allow user access to 'trip_requests' subcollection.
    const destId = destination.id || destination.slug;
    const tripRef = doc(db, "users", userId, "trip_requests", destId);

    // Sanitize destination to remove 'undefined' fields
    // Firestore setDoc will fail if any field is undefined.
    // JSON.stringify/parse is a safe way to strip undefined values from the object.
    const cleanDestination = JSON.parse(JSON.stringify(destination));

    const payload = {
      ...cleanDestination,
      enquiredAt: new Date(),
      status: 'enquired' // Status flag
    };

    await setDoc(tripRef, payload, { merge: true });
    console.log(`Trip ${destId} saved to user ${userId} enquiries.`);
  } catch (error) {
    console.error("Error saving enquired trip:", error);
    throw error;
  }
};

export const getUserTrips = async (userId: string): Promise<FirestoreDestination[]> => {
  try {
    const tripsRef = collection(db, "users", userId, "trip_requests");
    const snapshot = await getDocs(tripsRef);
    
    // Map docs to destinations
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirestoreDestination[];
  } catch (error) {
    console.error("Error fetching user trips:", error);
    return [];
  }
};

export const checkIfTripEnquired = async (userId: string, destination: FirestoreDestination): Promise<boolean> => {
  try {
    const destId = destination.id || destination.slug;
    const tripRef = doc(db, "users", userId, "trip_requests", destId);
    const docSnap = await getDoc(tripRef);
    return docSnap.exists();
  } catch (error) {
    console.error("Error checking trip status:", error);
    return false;
  }
};

export const removeEnquiredTrip = async (userId: string, destinationId: string) => {
  try {
    const tripRef = doc(db, "users", userId, "trip_requests", destinationId);
    await deleteDoc(tripRef);
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error;
  }
};
