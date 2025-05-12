
import { generateMealPlan } from "@/services/mealDatabase";
import { createMealPlan, addMealToPlan } from "@/services/mealPlanService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { MealItem } from "@/services/mealDatabase";

// Get user dietary preference from their profile
export const getUserDietaryPreference = async (userId: string): Promise<boolean | undefined> => {
  try {
    const { data: restrictions } = await supabase
      .from("dietary_restrictions")
      .select()
      .eq("user_id", userId);
    
    return restrictions?.some(r => 
      r.restriction.toLowerCase().includes("vegetarian") || 
      r.restriction.toLowerCase().includes("vegan")
    );
  } catch (error) {
    console.error("Error fetching user dietary preferences:", error);
    return undefined;
  }
};

// Get user health goal from their profile
export const getUserHealthGoal = async (userId: string): Promise<string | undefined> => {
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("health_goal")
      .eq("id", userId)
      .single();
    
    return profile?.health_goal;
  } catch (error) {
    console.error("Error fetching user health goal:", error);
    return undefined;
  }
};

// Generate meal plan based on user preferences
export const generateUserMealPlan = async (userId: string, date: Date, planName?: string): Promise<string | undefined> => {
  try {
    // Get user preferences
    const isVegetarian = await getUserDietaryPreference(userId);
    const healthGoal = await getUserHealthGoal(userId);
    
    // Generate meal plan
    const mealPlan = generateMealPlan(healthGoal, isVegetarian);
    
    // Save meal plan to database
    const formattedDate = format(date, "yyyy-MM-dd");
    const actualPlanName = planName || `Meal Plan for ${format(date, "MMM d, yyyy")}`;
    
    // Create meal plan
    const newPlan = await createMealPlan(userId, formattedDate, actualPlanName);
    
    if (!newPlan || !newPlan.id) {
      throw new Error("Failed to create meal plan");
    }
    
    // Add meals to plan
    const planId = newPlan.id;
    
    // Add breakfast meals
    for (const meal of mealPlan.breakfast) {
      await addMealToPlan(
        planId,
        "breakfast",
        meal.name,  // Using name as ID since we don't have actual IDs from TheMealDB
        meal.name,
        Math.floor(Math.random() * 300) + 200 // Random calories between 200-500
      );
    }
    
    // Add lunch meals
    for (const meal of mealPlan.lunch) {
      await addMealToPlan(
        planId,
        "lunch",
        meal.name,
        meal.name,
        Math.floor(Math.random() * 400) + 400 // Random calories between 400-800
      );
    }
    
    // Add dinner meals
    for (const meal of mealPlan.dinner) {
      await addMealToPlan(
        planId,
        "dinner",
        meal.name,
        meal.name,
        Math.floor(Math.random() * 400) + 400 // Random calories between 400-800
      );
    }
    
    // Add snack meals
    for (const meal of mealPlan.snacks) {
      await addMealToPlan(
        planId,
        "snack",
        meal.name,
        meal.name,
        Math.floor(Math.random() * 200) + 100 // Random calories between 100-300
      );
    }
    
    return planId;
  } catch (error) {
    console.error("Error generating meal plan:", error);
    toast({
      title: "Error",
      description: "Failed to generate meal plan. Please try again.",
      variant: "destructive"
    });
    return undefined;
  }
};

export type { MealItem };
