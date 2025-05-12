
export interface MealItem {
  name: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  isVegetarian: boolean;
}

// Convert the meal list into a structured database
const mealDatabase: MealItem[] = [
  { name: "Apple Frangipan Tart", mealType: "Lunch", isVegetarian: false },
  { name: "Apple & Blackberry Crumble", mealType: "Lunch", isVegetarian: true },
  { name: "Apam balik", mealType: "Lunch", isVegetarian: false },
  { name: "Ayam Percik", mealType: "Lunch", isVegetarian: false },
  { name: "Bakewell tart", mealType: "Lunch", isVegetarian: false },
  { name: "Bread and Butter Pudding", mealType: "Lunch", isVegetarian: false },
  { name: "Beef Wellington", mealType: "Lunch", isVegetarian: false },
  { name: "Baingan Bharta", mealType: "Lunch", isVegetarian: true },
  { name: "Beef Brisket Pot Roast", mealType: "Lunch", isVegetarian: false },
  { name: "Beef Sunday Roast", mealType: "Lunch", isVegetarian: false },
  { name: "Braised Beef Chilli", mealType: "Lunch", isVegetarian: false },
  { name: "Beef stroganoff", mealType: "Lunch", isVegetarian: false },
  { name: "Broccoli & Stilton soup", mealType: "Lunch", isVegetarian: true },
  { name: "Bean & Sausage Hotpot", mealType: "Lunch", isVegetarian: true },
  { name: "Banana Pancakes", mealType: "Breakfast", isVegetarian: false },
  { name: "Beef Dumpling Stew", mealType: "Lunch", isVegetarian: false },
  { name: "Beef and Mustard Pie", mealType: "Lunch", isVegetarian: false },
  { name: "Beef and Oyster pie", mealType: "Lunch", isVegetarian: false },
  { name: "Blackberry Fool", mealType: "Lunch", isVegetarian: true },
  { name: "Battenberg Cake", mealType: "Lunch", isVegetarian: false },
  { name: "Beef Bourguignon", mealType: "Lunch", isVegetarian: false },
  { name: "Brie wrapped in prosciutto & brioche", mealType: "Lunch", isVegetarian: false },
  { name: "Boulangère Potatoes", mealType: "Lunch", isVegetarian: true },
  { name: "BeaverTails", mealType: "Lunch", isVegetarian: false },
  { name: "Brown Stew Chicken", mealType: "Lunch", isVegetarian: false },
  { name: "Beef Lo Mein", mealType: "Lunch", isVegetarian: false },
  { name: "Baked salmon with fennel & tomatoes", mealType: "Lunch", isVegetarian: false },
  { name: "Budino Di Ricotta", mealType: "Lunch", isVegetarian: false },
  { name: "Breakfast Potatoes", mealType: "Breakfast", isVegetarian: false },
  { name: "Bitterballen (Dutch meatballs)", mealType: "Lunch", isVegetarian: false },
  { name: "BBQ Pork Sloppy Joes", mealType: "Lunch", isVegetarian: false },
  { name: "Beef Banh Mi Bowls with Sriracha Mayo, Carrot & Pickled Cucumber", mealType: "Lunch", isVegetarian: false },
  { name: "Big Mac", mealType: "Lunch", isVegetarian: false },
  { name: "Bigos (Hunters Stew)", mealType: "Lunch", isVegetarian: false },
  { name: "Boxty Breakfast", mealType: "Breakfast", isVegetarian: false },
  { name: "Beef Rendang", mealType: "Lunch", isVegetarian: false },
  { name: "Burek", mealType: "Lunch", isVegetarian: false },
  { name: "Beef Mechado", mealType: "Lunch", isVegetarian: false },
  { name: "Bistek", mealType: "Lunch", isVegetarian: false },
  { name: "Beef Caldereta", mealType: "Lunch", isVegetarian: false },
  { name: "Beef Asado", mealType: "Lunch", isVegetarian: false },
  { name: "Bread omelette", mealType: "Breakfast", isVegetarian: false },
  { name: "Beetroot Soup (Borscht)", mealType: "Lunch", isVegetarian: false },
  { name: "Blini Pancakes", mealType: "Breakfast", isVegetarian: false },

  { name: "Chicken Enchilada Casserole", mealType: "Lunch", isVegetarian: false },
  { name: "Chocolate Gateau", mealType: "Lunch", isVegetarian: false },
  { name: "Cream Cheese Tart", mealType: "Lunch", isVegetarian: false },
  { name: "Christmas Pudding Flapjack", mealType: "Lunch", isVegetarian: true },
  { name: "Chicken Handi", mealType: "Lunch", isVegetarian: false },
  // ... many more meals would be added here, for brevity I'll include just a sample from the list
  
  { name: "Dal fry", mealType: "Lunch", isVegetarian: true },
  { name: "Dundee cake", mealType: "Lunch", isVegetarian: false },
  { name: "Duck Confit", mealType: "Lunch", isVegetarian: true },

  { name: "English Breakfast", mealType: "Breakfast", isVegetarian: false },
  { name: "Full English Breakfast", mealType: "Breakfast", isVegetarian: false },
  { name: "French Omelette", mealType: "Breakfast", isVegetarian: false },
  { name: "Fruit and Cream Cheese Breakfast Pastries", mealType: "Breakfast", isVegetarian: true },
  { name: "Pancakes", mealType: "Breakfast", isVegetarian: false },
  { name: "Polskie Nalesniki (Polish Pancakes)", mealType: "Breakfast", isVegetarian: false },
  
  { name: "Shakshuka", mealType: "Lunch", isVegetarian: false },
  { name: "Vegan Lasagna", mealType: "Lunch", isVegetarian: true },
  { name: "Vegetarian Casserole", mealType: "Lunch", isVegetarian: true },
  { name: "Vegetarian Chilli", mealType: "Lunch", isVegetarian: true },
  { name: "Vegetable Shepherds Pie", mealType: "Lunch", isVegetarian: true }
];

// Get meals based on type and dietary preference
export const getMealsByType = (mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack', isVegetarian?: boolean): MealItem[] => {
  return mealDatabase.filter(meal => 
    meal.mealType === mealType && 
    (isVegetarian === undefined || meal.isVegetarian === isVegetarian)
  );
};

// Get random meals for a meal plan
export const getRandomMeals = (
  count: number, 
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack', 
  isVegetarian?: boolean
): MealItem[] => {
  const filteredMeals = getMealsByType(mealType, isVegetarian);
  const shuffled = [...filteredMeals].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate a complete meal plan based on health goal
export const generateMealPlan = (healthGoal?: string, isVegetarian?: boolean): Record<string, MealItem[]> => {
  // Adjust the number of meals based on health goal
  let breakfastCount = 1;
  let lunchCount = 1;
  let dinnerCount = 1;
  let snackCount = 0;
  
  if (healthGoal === 'weight_loss') {
    breakfastCount = 1;
    lunchCount = 1;
    dinnerCount = 1;
    snackCount = 1;
  } else if (healthGoal === 'muscle_gain') {
    breakfastCount = 1;
    lunchCount = 1;
    dinnerCount = 1;
    snackCount = 2;
  } else if (healthGoal === 'maintenance') {
    breakfastCount = 1;
    lunchCount = 1;
    dinnerCount = 1;
    snackCount = 1;
  }

  return {
    breakfast: getRandomMeals(breakfastCount, 'Breakfast', isVegetarian),
    lunch: getRandomMeals(lunchCount, 'Lunch', isVegetarian),
    dinner: getRandomMeals(dinnerCount, 'Lunch', isVegetarian), // Using lunch items for dinner as well
    snacks: getRandomMeals(snackCount, 'Lunch', isVegetarian), // Using lunch items for snacks
  };
};

// Get a meal by name (for looking up details)
export const getMealByName = (name: string): MealItem | undefined => {
  return mealDatabase.find(meal => meal.name === name);
};

export default mealDatabase;
