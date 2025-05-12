
import { supabase } from "@/integrations/supabase/client";

export interface ProfileData {
  id?: string;
  full_name?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  health_goal?: string;
}

export interface DietaryRestriction {
  id?: string;
  restriction: string;
  user_id?: string;
}

export interface DislikedIngredient {
  id?: string;
  ingredient: string;
  user_id?: string;
}

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, profileData: ProfileData) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: profileData.full_name,
      age: profileData.age,
      gender: profileData.gender,
      height: profileData.height,
      weight: profileData.weight,
      health_goal: profileData.health_goal,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select();

  if (error) throw error;
  return data;
};

export const getDietaryRestrictions = async (userId: string) => {
  const { data, error } = await supabase
    .from("dietary_restrictions")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
};

export const addDietaryRestriction = async (userId: string, restriction: string) => {
  const { data, error } = await supabase
    .from("dietary_restrictions")
    .insert([{ user_id: userId, restriction }])
    .select();

  if (error) throw error;
  return data;
};

export const removeDietaryRestriction = async (id: string) => {
  const { error } = await supabase
    .from("dietary_restrictions")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

export const getDislikedIngredients = async (userId: string) => {
  const { data, error } = await supabase
    .from("disliked_ingredients")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
};

export const addDislikedIngredient = async (userId: string, ingredient: string) => {
  const { data, error } = await supabase
    .from("disliked_ingredients")
    .insert([{ user_id: userId, ingredient }])
    .select();

  if (error) throw error;
  return data;
};

export const removeDislikedIngredient = async (id: string) => {
  const { error } = await supabase
    .from("disliked_ingredients")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
