
import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  id?: string;
  user_id?: string;
  user_message: string;
  assistant_response: string;
  created_at?: string;
}

// Gemini API key - this should ideally be stored in environment variables
// Using provided key for now
const GEMINI_API_KEY = "AIzaSyBh-s5pF-idQ8Aao0h1j9S9R399uTB-Q";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export const generateResponse = async (message: string, userData: any = {}) => {
  try {
    // Format user data for context if available
    let contextPrompt = "";
    if (userData?.profile) {
      contextPrompt = `User info: Health goal: ${userData.profile.health_goal || 'Not specified'}.`;
      
      if (userData.restrictions && userData.restrictions.length > 0) {
        contextPrompt += ` Dietary restrictions: ${userData.restrictions.join(', ')}.`;
      }
      
      if (userData.dislikedIngredients && userData.dislikedIngredients.length > 0) {
        contextPrompt += ` Dislikes: ${userData.dislikedIngredients.join(', ')}.`;
      }
    }

    // Create the request payload
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `You are a helpful nutrition assistant. Provide personalized nutrition advice and meal suggestions. 
              ${contextPrompt}
              
              User question: ${message}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    // Call the Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    // Extract the generated response from the API result
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    // If response parsing fails or API error occurs, use our fallback system
    return fallbackResponseGenerator(message);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // If API call fails, fall back to the simple response generator
    return fallbackResponseGenerator(message);
  }
};

// Fallback response generator in case the API call fails
const fallbackResponseGenerator = (message: string) => {
  const lowerMessage = message.toLowerCase();
  let response = "I'm not sure how to respond to that. Could you ask about meal suggestions or nutrition advice?";
  
  if (lowerMessage.includes("vegetarian") || lowerMessage.includes("vegan")) {
    response = "For a plant-based diet, I recommend dishes rich in plant proteins like lentil curry, chickpea stew, or tofu stir-fry with vegetables. These provide essential proteins and nutrients.";
  } else if (lowerMessage.includes("protein") || lowerMessage.includes("muscle")) {
    response = "For muscle building, focus on protein-rich foods like grilled chicken, salmon, eggs, and Greek yogurt. Combine with complex carbs like sweet potatoes and plenty of vegetables.";
  } else if (lowerMessage.includes("weight loss") || lowerMessage.includes("lose weight")) {
    response = "For weight loss, I suggest high-protein, low-calorie meals like grilled fish with steamed vegetables, chicken salad with light dressing, or vegetable soup with lean protein.";
  } else if (lowerMessage.includes("breakfast")) {
    response = "For a nutritious breakfast, try oatmeal with berries and nuts, Greek yogurt with honey and fruit, or a vegetable omelet with whole grain toast.";
  } else if (lowerMessage.includes("lunch")) {
    response = "For a balanced lunch, consider a quinoa bowl with roasted vegetables and grilled chicken, a hearty salad with lean protein, or a whole grain wrap with hummus and vegetables.";
  } else if (lowerMessage.includes("dinner")) {
    response = "For dinner, baked salmon with roasted vegetables, turkey chili with beans, or a stir-fry with lean protein and plenty of vegetables are excellent choices.";
  } else if (lowerMessage.includes("snack")) {
    response = "Healthy snack options include Greek yogurt with berries, apple slices with almond butter, hummus with vegetable sticks, or a small handful of mixed nuts.";
  }
  
  return response;
};

export const saveChatMessage = async (userId: string, userMessage: string, assistantResponse: string) => {
  const { data, error } = await supabase
    .from("chat_history")
    .insert([{
      user_id: userId,
      user_message: userMessage,
      assistant_response: assistantResponse
    }])
    .select();

  if (error) throw error;
  return data[0];
};

export const getChatHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from("chat_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
