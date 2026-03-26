import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
// Note: In a real app, API_KEY should be in process.env.
// This is a production-ready structure.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'DEMO_KEY' });

export const generateItinerary = async (preferences: string) => {
  try {
    const model = 'gemini-3-flash-preview';
    const systemInstruction = `You are an expert travel agent for Trawell. 
    Your goal is to create personalized, off-beat travel itineraries.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: `Create a 3-day itinerary for: ${preferences}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: { type: Type.STRING },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  activities: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    // Return mock data if API fails or key is missing (fallback for demo)
    return JSON.stringify({
      destination: "Mock Destination",
      days: []
    });
  }
};