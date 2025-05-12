
import { supabase } from "@/integrations/supabase/client";

export interface MealPlan {
  id?: string;
  user_id?: string;
  plan_date: string;
  plan_name?: string;
  created_at?: string;
}

export interface MealPlanDetail {
  id?: string;
  plan_id: string;
  meal_type: string;
  meal_id: string;
  meal_name: string;
  calories?: number;
}

export const createMealPlan = async (userId: string, planDate: string, planName?: string) => {
  const { data, error } = await supabase
    .from("meal_plans")
    .insert([{
      user_id: userId,
      plan_date: planDate,
      plan_name: planName || `Plan for ${planDate}`
    }])
    .select();

  if (error) throw error;
  return data[0];
};

export const addMealToPlan = async (
  planId: string,
  mealType: string,
  mealId: string,
  mealName: string,
  calories?: number
) => {
  const { data, error } = await supabase
    .from("meal_plan_details")
    .insert([{
      plan_id: planId,
      meal_type: mealType,
      meal_id: mealId,
      meal_name: mealName,
      calories: calories
    }])
    .select();

  if (error) throw error;
  return data[0];
};

export const getUserMealPlans = async (userId: string) => {
  const { data, error } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("user_id", userId)
    .order("plan_date", { ascending: false });

  if (error) throw error;
  return data;
};

export const getMealPlanDetails = async (planId: string) => {
  const { data, error } = await supabase
    .from("meal_plan_details")
    .select("*")
    .eq("plan_id", planId);

  if (error) throw error;
  return data;
};

export const deleteMealPlan = async (planId: string) => {
  // Delete meal plan details first (due to foreign key)
  await supabase
    .from("meal_plan_details")
    .delete()
    .eq("plan_id", planId);
    
  // Then delete the meal plan
  const { error } = await supabase
    .from("meal_plans")
    .delete()
    .eq("id", planId);

  if (error) throw error;
};
