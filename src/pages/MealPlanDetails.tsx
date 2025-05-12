import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { getUserMealPlans, getMealPlanDetails, addMealToPlan, MealPlan, MealPlanDetail } from "@/services/mealPlanService";
import { searchMealsByName, getMealsByCategory, getMealById, Meal } from "@/services/mealDbService";
import { Loader2, Plus, Search, Utensils, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const MealPlanDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [meals, setMeals] = useState<MealPlanDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingMeal, setAddingMeal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Meal[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState("breakfast");
  const [selectedCategory, setSelectedCategory] = useState("Breakfast");
  const [browseMeals, setBrowseMeals] = useState<Meal[]>([]);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [mealDetailLoading, setMealDetailLoading] = useState(false);
  const [viewRecipeDialogOpen, setViewRecipeDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Meal | null>(null);
  const [recipeLoading, setRecipeLoading] = useState(false);

  const mealCategories = [
    "Breakfast",
    "Vegetarian",
    "Chicken",
    "Beef",
    "Seafood",
    "Pasta",
    "Dessert"
  ];

  const mealTypes = [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "snack", label: "Snack" }
  ];

  // Total calories for the day
  const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  
  // Daily target (simplified)
  const dailyTarget = 2000;
  
  // Calories by meal type
  const caloriesByMealType = {
    breakfast: meals.filter(m => m.meal_type === "breakfast").reduce((sum, meal) => sum + (meal.calories || 0), 0),
    lunch: meals.filter(m => m.meal_type === "lunch").reduce((sum, meal) => sum + (meal.calories || 0), 0),
    dinner: meals.filter(m => m.meal_type === "dinner").reduce((sum, meal) => sum + (meal.calories || 0), 0),
    snack: meals.filter(m => m.meal_type === "snack").reduce((sum, meal) => sum + (meal.calories || 0), 0),
  };

  useEffect(() => {
    const fetchPlanDetails = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        
        // Fetch plan details
        const userPlans = await getUserMealPlans(user.id);
        const currentPlan = userPlans.find(p => p.id === id);
        
        if (!currentPlan) {
          toast({
            title: "Plan not found",
            description: "The meal plan you're looking for does not exist or you don't have access to it.",
            variant: "destructive"
          });
          navigate("/meal-plans");
          return;
        }
        
        setPlan(currentPlan);
        
        // Fetch meals in this plan
        const planMeals = await getMealPlanDetails(id);
        setMeals(planMeals);
        
      } catch (error) {
        console.error("Error fetching meal plan details:", error);
        toast({
          title: "Error",
          description: "Failed to load meal plan details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlanDetails();
  }, [id, user, toast, navigate]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    try {
      setSearching(true);
      const results = await searchMealsByName(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching for meals:", error);
      toast({
        title: "Search Error",
        description: "Failed to search for meals. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSearching(false);
    }
  };

  const handleBrowseCategory = async (category: string) => {
    try {
      setSelectedCategory(category);
      setBrowseLoading(true);
      const results = await getMealsByCategory(category);
      setBrowseMeals(results);
    } catch (error) {
      console.error("Error browsing meals:", error);
      toast({
        title: "Error",
        description: "Failed to load meals in this category.",
        variant: "destructive"
      });
    } finally {
      setBrowseLoading(false);
    }
  };

  const handleViewMealDetails = async (mealId: string) => {
    try {
      setMealDetailLoading(true);
      const meal = await getMealById(mealId);
      setSelectedMeal(meal);
    } catch (error) {
      console.error("Error fetching meal details:", error);
      toast({
        title: "Error",
        description: "Failed to load meal details.",
        variant: "destructive"
      });
    } finally {
      setMealDetailLoading(false);
    }
  };

  const handleAddMealToPlan = async () => {
    if (!id || !selectedMeal) return;
    
    try {
      setAddingMeal(true);
      
      const newMeal = await addMealToPlan(
        id,
        selectedMealType,
        selectedMeal.idMeal,
        selectedMeal.strMeal,
        selectedMeal.estimatedCalories
      );
      
      setMeals([...meals, newMeal]);
      setSelectedMeal(null);
      
      toast({
        title: "Meal Added",
        description: `${selectedMeal.strMeal} has been added to your plan.`
      });
    } catch (error) {
      console.error("Error adding meal to plan:", error);
      toast({
        title: "Error",
        description: "Failed to add meal to plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAddingMeal(false);
    }
  };

  const handleViewRecipe = async (mealId: string, mealName: string) => {
    try {
      setRecipeLoading(true);
      setViewRecipeDialogOpen(true);
      
      console.log(`Fetching recipe for meal ID: ${mealId}, name: ${mealName}`);
      
      // First try to find the meal by ID
      let recipe = await getMealById(mealId);
      
      // If not found by ID (which might happen if meal ID is not a valid TheMealDB ID)
      // then search by name and take the first result
      if (!recipe) {
        console.log(`Meal not found by ID: ${mealId}, searching by name: ${mealName}`);
        const searchResults = await searchMealsByName(mealName);
        if (searchResults.length > 0) {
          recipe = searchResults[0];
        }
      }
      
      console.log("Recipe found:", recipe);
      setSelectedRecipe(recipe);
    } catch (error) {
      console.error("Error loading recipe details:", error);
      toast({
        title: "Error",
        description: "Failed to load recipe details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setRecipeLoading(false);
    }
  };

  useEffect(() => {
    // Load initial category when component mounts
    handleBrowseCategory(selectedCategory);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{plan?.plan_name}</h1>
          <p className="text-muted-foreground">
            {new Date(plan?.plan_date!).toLocaleDateString()}
          </p>
        </div>
        <Button onClick={() => navigate("/meal-plans")}>Back to Plans</Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Meals for This Plan</CardTitle>
              <CardDescription>All meals included in this plan</CardDescription>
            </CardHeader>
            <CardContent>
              {meals.length > 0 ? (
                <div className="space-y-6">
                  {mealTypes.map((type) => {
                    const mealsOfType = meals.filter(m => m.meal_type === type.value);
                    if (mealsOfType.length === 0) return null;
                    
                    return (
                      <div key={type.value}>
                        <h3 className="font-medium text-lg mb-2">{type.label}</h3>
                        <div className="space-y-3">
                          {mealsOfType.map((meal) => (
                            <div key={meal.id} className="border rounded-md p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">{meal.meal_name}</h4>
                                {meal.calories && (
                                  <span className="text-sm bg-muted px-2 py-1 rounded-md">
                                    {meal.calories} kcal
                                  </span>
                                )}
                              </div>
                              <div className="flex justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleViewRecipe(meal.meal_id, meal.meal_name)}
                                >
                                  <BookOpen className="h-4 w-4 mr-1" />
                                  View Recipe
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No meals have been added to this plan yet.</p>
                </div>
              )}
              
              <div className="mt-8">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Meal to Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add Meal to Plan</DialogTitle>
                      <DialogDescription>
                        Browse or search for meals to add to your plan
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="mealType">Meal Type</Label>
                          <Select value={selectedMealType} onValueChange={setSelectedMealType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select meal type" />
                            </SelectTrigger>
                            <SelectContent>
                              {mealTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Tabs defaultValue="browse">
                        <TabsList className="w-full">
                          <TabsTrigger value="browse" className="flex-1">Browse Meals</TabsTrigger>
                          <TabsTrigger value="search" className="flex-1">Search Meals</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="browse" className="space-y-4">
                          <div className="flex overflow-x-auto py-2 gap-2">
                            {mealCategories.map((category) => (
                              <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleBrowseCategory(category)}
                              >
                                {category}
                              </Button>
                            ))}
                          </div>
                          
                          {browseLoading ? (
                            <div className="flex justify-center py-8">
                              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                          ) : browseMeals.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {browseMeals.map((meal) => (
                                <Card key={meal.idMeal} className="overflow-hidden">
                                  <img
                                    src={meal.strMealThumb}
                                    alt={meal.strMeal}
                                    className="w-full h-32 object-cover"
                                  />
                                  <CardContent className="p-3">
                                    <h4 className="font-medium line-clamp-2">{meal.strMeal}</h4>
                                    <div className="flex justify-between items-center mt-2">
                                      <span className="text-sm text-muted-foreground">
                                        ~{meal.estimatedCalories} kcal
                                      </span>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => handleViewMealDetails(meal.idMeal)}
                                      >
                                        View
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <p>No meals found in this category.</p>
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="search">
                          <form onSubmit={handleSearch} className="flex gap-2">
                            <Input
                              placeholder="Search for meals..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="flex-1"
                            />
                            <Button type="submit" disabled={searching || !searchQuery.trim()}>
                              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            </Button>
                          </form>
                          
                          {searching ? (
                            <div className="flex justify-center py-8">
                              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                          ) : searchResults.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                              {searchResults.map((meal) => (
                                <Card key={meal.idMeal} className="overflow-hidden">
                                  <img
                                    src={meal.strMealThumb}
                                    alt={meal.strMeal}
                                    className="w-full h-32 object-cover"
                                  />
                                  <CardContent className="p-3">
                                    <h4 className="font-medium line-clamp-2">{meal.strMeal}</h4>
                                    <div className="flex justify-between items-center mt-2">
                                      <span className="text-sm text-muted-foreground">
                                        ~{meal.estimatedCalories} kcal
                                      </span>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => handleViewMealDetails(meal.idMeal)}
                                      >
                                        View
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : searchQuery !== "" && (
                            <div className="text-center py-8">
                              <p>No results found for "{searchQuery}".</p>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                    
                    {selectedMeal && (
                      <div className="mt-4 border rounded-md p-4">
                        <div className="flex gap-4">
                          <img
                            src={selectedMeal.strMealThumb}
                            alt={selectedMeal.strMeal}
                            className="w-24 h-24 object-cover rounded-md"
                          />
                          <div>
                            <h3 className="font-medium">{selectedMeal.strMeal}</h3>
                            <p className="text-sm text-muted-foreground">
                              {selectedMeal.strCategory} • Estimated {selectedMeal.estimatedCalories} kcal
                            </p>
                          </div>
                        </div>
                        
                        {mealDetailLoading ? (
                          <div className="flex justify-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        ) : (
                          <>
                            <Separator className="my-4" />
                            <h4 className="font-medium mb-2">Ingredients:</h4>
                            <ul className="list-disc pl-5 mb-4 grid grid-cols-2">
                              {selectedMeal.ingredients?.map((ingredient, index) => (
                                <li key={index}>
                                  {ingredient.name} {ingredient.measure && `(${ingredient.measure})`}
                                </li>
                              ))}
                            </ul>
                            
                            <h4 className="font-medium mb-2">Instructions:</h4>
                            <p className="text-sm">{selectedMeal.strInstructions}</p>
                          </>
                        )}
                      </div>
                    )}

                    <DialogFooter>
                      <Button 
                        onClick={handleAddMealToPlan} 
                        disabled={!selectedMeal || addingMeal}
                      >
                        {addingMeal ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Add to Plan
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Summary</CardTitle>
              <CardDescription>Calorie breakdown for this plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Total Calories</span>
                  <span className="font-medium">{totalCalories} / {dailyTarget} kcal</span>
                </div>
                <Progress value={(totalCalories / dailyTarget) * 100} />
              </div>
              
              <div className="space-y-4">
                {mealTypes.map((type) => (
                  <div key={type.value}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{type.label}</span>
                      <span>{caloriesByMealType[type.value as keyof typeof caloriesByMealType]} kcal</span>
                    </div>
                    <Progress 
                      value={(caloriesByMealType[type.value as keyof typeof caloriesByMealType] / totalCalories) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                <h3 className="font-medium mb-2">Meal Count</h3>
                <div className="grid grid-cols-2 gap-4">
                  {mealTypes.map((type) => {
                    const count = meals.filter(m => m.meal_type === type.value).length;
                    return (
                      <div key={type.value} className="flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-muted-foreground" />
                        <span>{type.label}: {count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recipe View Dialog */}
      <Dialog open={viewRecipeDialogOpen} onOpenChange={setViewRecipeDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Recipe Details</DialogTitle>
            <DialogDescription>
              Ingredients and instructions for this meal
            </DialogDescription>
          </DialogHeader>

          {recipeLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : selectedRecipe ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <img 
                  src={selectedRecipe.strMealThumb || '/placeholder.svg'} 
                  alt={selectedRecipe.strMeal} 
                  className="rounded-lg w-full max-h-72 object-cover"
                />
                <div>
                  <h3 className="font-bold text-xl mb-2">{selectedRecipe.strMeal}</h3>
                  {selectedRecipe.strCategory && (
                    <div className="mb-1">
                      <span className="font-medium">Category:</span> {selectedRecipe.strCategory}
                    </div>
                  )}
                  {selectedRecipe.strArea && (
                    <div className="mb-1">
                      <span className="font-medium">Cuisine:</span> {selectedRecipe.strArea}
                    </div>
                  )}
                  {selectedRecipe.estimatedCalories && (
                    <div className="mb-4">
                      <span className="font-medium">Estimated Calories:</span> {selectedRecipe.estimatedCalories} kcal
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-lg mb-2">Ingredients:</h3>
                {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span>• {ingredient.name}</span>
                        {ingredient.measure && (
                          <span className="text-muted-foreground">({ingredient.measure})</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No ingredients information available.</p>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-lg mb-2">Instructions:</h3>
                {selectedRecipe.strInstructions ? (
                  <div className="text-muted-foreground whitespace-pre-line">
                    {selectedRecipe.strInstructions}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No instructions available.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Recipe details not found. This could be because the meal is not available in our database.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MealPlanDetails;
