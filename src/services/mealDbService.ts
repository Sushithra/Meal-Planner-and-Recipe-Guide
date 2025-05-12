
export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strMealThumb?: string;
  strTags?: string;
  ingredients?: { name: string; measure: string }[];
  estimatedCalories?: number; // We'll simulate this
}

const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const getRandomMeal = async (): Promise<Meal> => {
  const response = await fetch(`${API_BASE_URL}/random.php`);
  const data = await response.json();
  return processMealData(data.meals[0]);
};

export const searchMealsByName = async (name: string): Promise<Meal[]> => {
  const response = await fetch(`${API_BASE_URL}/search.php?s=${name}`);
  const data = await response.json();
  
  if (!data.meals) return [];
  return data.meals.map(processMealData);
};

export const getMealById = async (id: string): Promise<Meal | null> => {
  try {
    // Check if the id is a valid format for the API (numeric)
    if (!id || isNaN(Number(id))) {
      console.log(`Invalid meal ID format: ${id}`);
      return null;
    }
    
    const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();
    
    if (!data.meals) {
      console.log(`No meal found with ID: ${id}`);
      return null;
    }
    
    return processMealData(data.meals[0]);
  } catch (error) {
    console.error("Error fetching meal by ID:", error);
    return null;
  }
};

export const getMealsByCategory = async (category: string): Promise<Meal[]> => {
  const response = await fetch(`${API_BASE_URL}/filter.php?c=${category}`);
  const data = await response.json();
  
  if (!data.meals) return [];
  return data.meals.map((meal: any) => ({
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
    // For meals from filter endpoint, we need to fetch details separately
    estimatedCalories: estimateCalories(meal.strMeal)
  }));
};

// Helper function to extract ingredients from meal data
const processMealData = (meal: any): Meal => {
  if (!meal) {
    console.error("Cannot process undefined meal data");
    return {
      idMeal: "unknown",
      strMeal: "Unknown Meal",
      estimatedCalories: 0
    };
  }
  
  const ingredients = [];
  
  // TheMealDB stores ingredients as strIngredient1, strIngredient2, etc.
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push({
        name: ingredient,
        measure: measure || ""
      });
    }
  }
  
  // Simulate calorie estimation
  const estimatedCalories = estimateCalories(meal.strMeal);
  
  return {
    ...meal,
    ingredients,
    estimatedCalories
  };
};

// Simple function to simulate calorie estimation
const estimateCalories = (mealName: string): number => {
  if (!mealName) return 350; // Default calories if no name
  
  // In a real application, this would use a food database API
  // This is just a simple simulation
  const baseCalories = 250 + Math.floor(Math.random() * 500);
  
  // Add some "logic" based on meal name
  const lowerName = mealName.toLowerCase();
  let modifier = 1;
  
  if (lowerName.includes("salad") || lowerName.includes("vegetable")) {
    modifier = 0.7;
  } else if (lowerName.includes("chicken") || lowerName.includes("fish")) {
    modifier = 1.0;
  } else if (lowerName.includes("beef") || lowerName.includes("pork")) {
    modifier = 1.2;
  } else if (lowerName.includes("pasta") || lowerName.includes("rice")) {
    modifier = 1.3;
  } else if (lowerName.includes("dessert") || lowerName.includes("cake") || lowerName.includes("pie")) {
    modifier = 1.5;
  }
  
  return Math.round(baseCalories * modifier);
};
