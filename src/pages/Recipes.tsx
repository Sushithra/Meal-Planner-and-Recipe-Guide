
import { useState, useEffect } from "react";
import { 
  searchMealsByName, 
  getMealsByCategory, 
  getMealById,
  Meal 
} from "@/services/mealDbService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { addMealToPlan, getUserMealPlans } from "@/services/mealPlanService";
import { 
  Loader2, 
  Search, 
  Clock, 
  Info, 
  Tag, 
  Filter, 
  Plus 
} from "lucide-react";

const Recipes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Breakfast");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedMealDetails, setSelectedMealDetails] = useState<Meal | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [addToMealPlanOpen, setAddToMealPlanOpen] = useState(false);
  const [userMealPlans, setUserMealPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("breakfast");
  const [addingToMealPlan, setAddingToMealPlan] = useState(false);
  const [recipeCategories, setRecipeCategories] = useState([
    "Breakfast", "Vegetarian", "Chicken", "Beef", 
    "Seafood", "Pasta", "Dessert", "Vegan"
  ]);

  useEffect(() => {
    const loadInitialMeals = async () => {
      try {
        setLoading(true);
        const initialMeals = await getMealsByCategory(selectedCategory);
        setMeals(initialMeals);
      } catch (error) {
        console.error("Error loading initial meals:", error);
        toast({
          title: "Error",
          description: "Failed to load recipes. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialMeals();
  }, [toast]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    try {
      setSearching(true);
      const results = await searchMealsByName(searchQuery);
      setMeals(results);
    } catch (error) {
      console.error("Error searching meals:", error);
      toast({
        title: "Search Error",
        description: "Failed to search recipes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSearching(false);
    }
  };

  const handleCategoryClick = async (category: string) => {
    try {
      setSelectedCategory(category);
      setLoading(true);
      const results = await getMealsByCategory(category);
      setMeals(results);
    } catch (error) {
      console.error("Error loading category:", error);
      toast({
        title: "Error",
        description: "Failed to load category recipes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecipeDetails = async (meal: Meal) => {
    setSelectedMeal(meal);
    
    try {
      setDetailsLoading(true);
      const detailedMeal = await getMealById(meal.idMeal);
      if (detailedMeal) {
        setSelectedMealDetails(detailedMeal);
      }
    } catch (error) {
      console.error("Error loading meal details:", error);
      toast({
        title: "Error",
        description: "Failed to load recipe details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleAddToMealPlan = async (meal: Meal) => {
    setSelectedMeal(meal);
    
    // Load user's meal plans
    if (user) {
      try {
        const plans = await getUserMealPlans(user.id);
        setUserMealPlans(plans);
        if (plans.length > 0) {
          setSelectedPlan(plans[0].id);
        }
      } catch (error) {
        console.error("Error loading meal plans:", error);
        toast({
          title: "Error",
          description: "Failed to load your meal plans. Please try again.",
          variant: "destructive"
        });
      }
    }
    
    setAddToMealPlanOpen(true);
  };

  const handleAddMealToPlan = async () => {
    if (!selectedMeal || !selectedPlan) return;
    
    try {
      setAddingToMealPlan(true);
      
      await addMealToPlan(
        selectedPlan,
        selectedMealType,
        selectedMeal.idMeal,
        selectedMeal.strMeal,
        selectedMeal.estimatedCalories
      );
      
      toast({
        title: "Success",
        description: `${selectedMeal.strMeal} added to your meal plan.`
      });
      
      setAddToMealPlanOpen(false);
    } catch (error) {
      console.error("Error adding meal to plan:", error);
      toast({
        title: "Error",
        description: "Failed to add meal to plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAddingToMealPlan(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Recipe Library</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar / Categories */}
        <div className="md:w-64">
          <Card>
            <CardContent className="pt-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4" /> Categories
              </h2>
              <div className="space-y-1">
                {recipeCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    className={`w-full justify-start ${selectedCategory === category ? "bg-nutri-600 hover:bg-nutri-700" : ""}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes..."
              className="flex-1"
            />
            <Button type="submit" disabled={searching || !searchQuery.trim()}>
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </form>
          
          {/* Results */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-nutri-600" />
            </div>
          ) : meals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No recipes found. Try another search term or category.</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-medium mb-4">
                {searchQuery ? `Search Results for "${searchQuery}"` : `${selectedCategory} Recipes`}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {meals.map((meal) => (
                  <Card key={meal.idMeal} className="overflow-hidden">
                    <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-48 object-cover" />
                    <CardContent className="p-4">
                      <h3 className="font-medium text-lg mb-2">{meal.strMeal}</h3>
                      <div className="flex items-center text-muted-foreground mb-3">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">~{Math.floor(Math.random() * 30) + 15} min</span>
                        <span className="mx-2">•</span>
                        <span className="text-sm">{meal.estimatedCalories} kcal</span>
                      </div>
                      
                      <div className="flex justify-between mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewRecipeDetails(meal)}
                        >
                          <Info className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-nutri-600 hover:bg-nutri-700"
                          onClick={() => handleAddToMealPlan(meal)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add to Plan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Recipe Details Dialog */}
      <Dialog open={!!selectedMeal && !addToMealPlanOpen} onOpenChange={() => setSelectedMeal(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedMeal && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedMeal.strMeal}</DialogTitle>
                <DialogDescription>
                  Recipe details and ingredients
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <img 
                  src={selectedMeal.strMealThumb} 
                  alt={selectedMeal.strMeal} 
                  className="rounded-lg w-full max-h-72 object-cover"
                />
                <div>
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      ~{Math.floor(Math.random() * 30) + 15} min
                    </span>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {selectedMeal.estimatedCalories} kcal
                    </span>
                  </div>
                  
                  {selectedMeal.strCategory && (
                    <div className="flex items-center mb-4">
                      <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{selectedMeal.strCategory}</span>
                      {selectedMeal.strArea && (
                        <>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{selectedMeal.strArea}</span>
                        </>
                      )}
                    </div>
                  )}
                  
                  {detailsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-nutri-600" />
                    </div>
                  ) : (
                    <>
                      <h3 className="font-medium mb-2">Ingredients:</h3>
                      {selectedMealDetails?.ingredients && (
                        <ul className="list-disc pl-5 mb-4 grid grid-cols-2 text-sm">
                          {selectedMealDetails.ingredients.map((ingredient, index) => (
                            <li key={index}>
                              {ingredient.name} {ingredient.measure && `(${ingredient.measure})`}
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      <Button 
                        className="w-full bg-nutri-600 hover:bg-nutri-700 mt-4"
                        onClick={() => {
                          setSelectedMeal(selectedMeal);
                          setAddToMealPlanOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Meal Plan
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {detailsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-nutri-600" />
                </div>
              ) : (
                <div>
                  <h3 className="font-medium mb-2">Instructions:</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedMealDetails?.strInstructions}
                  </p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add to Meal Plan Dialog */}
      <Dialog open={addToMealPlanOpen} onOpenChange={setAddToMealPlanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Meal Plan</DialogTitle>
            <DialogDescription>
              Select a meal plan and meal type to add '{selectedMeal?.strMeal}'.
            </DialogDescription>
          </DialogHeader>
          
          {userMealPlans.length === 0 ? (
            <div className="py-4 text-center">
              <p className="mb-4">You don't have any meal plans yet.</p>
              <Button onClick={() => navigate("/meal-plans")}>
                Create a Meal Plan
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="plan">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="plan">Select Plan</TabsTrigger>
                <TabsTrigger value="type">Meal Type</TabsTrigger>
              </TabsList>
              
              <TabsContent value="plan">
                <div className="space-y-4 py-4">
                  {userMealPlans.map(plan => (
                    <div 
                      key={plan.id}
                      className={`p-3 border rounded-md cursor-pointer ${
                        selectedPlan === plan.id ? 'border-nutri-600 bg-nutri-50' : ''
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      <h3 className="font-medium">{plan.plan_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(plan.plan_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="type">
                <div className="space-y-4 py-4">
                  {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
                    <div 
                      key={type}
                      className={`p-3 border rounded-md cursor-pointer ${
                        selectedMealType === type ? 'border-nutri-600 bg-nutri-50' : ''
                      }`}
                      onClick={() => setSelectedMealType(type)}
                    >
                      <h3 className="font-medium capitalize">{type}</h3>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button onClick={() => setAddToMealPlanOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button 
              onClick={handleAddMealToPlan}
              disabled={!selectedPlan || !selectedMealType || addingToMealPlan}
              className="bg-nutri-600 hover:bg-nutri-700"
            >
              {addingToMealPlan && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add to Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Recipes;
