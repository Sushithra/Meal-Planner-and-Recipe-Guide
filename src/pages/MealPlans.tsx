
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  createMealPlan, 
  getUserMealPlans,
  deleteMealPlan, 
  MealPlan 
} from "@/services/mealPlanService";
import { generateUserMealPlan } from "@/services/mealPlanGenerator";
import { Link } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronRight, Loader2, Trash2, Sparkles } from "lucide-react";

const MealPlans = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [planName, setPlanName] = useState("");

  useEffect(() => {
    const fetchMealPlans = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userPlans = await getUserMealPlans(user.id);
        setPlans(userPlans);
      } catch (error) {
        console.error("Error fetching meal plans:", error);
        toast({
          title: "Error",
          description: "Failed to load your meal plans.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMealPlans();
  }, [user, toast]);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setCreating(true);
      const formattedDate = format(date, "yyyy-MM-dd");
      const newPlan = await createMealPlan(user.id, formattedDate, planName || `Meal Plan for ${format(date, "MMMM d, yyyy")}`);
      
      setPlans([newPlan, ...plans]);
      setPlanName("");
      setDate(new Date());
      
      toast({
        title: "Plan Created",
        description: "Your new meal plan has been created successfully."
      });
    } catch (error) {
      console.error("Error creating meal plan:", error);
      toast({
        title: "Error",
        description: "Failed to create new meal plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (!user) return;
    
    try {
      setGenerating(true);
      const planId = await generateUserMealPlan(
        user.id, 
        date, 
        planName || `AI Generated Plan for ${format(date, "MMMM d, yyyy")}`
      );
      
      if (planId) {
        toast({
          title: "Plan Generated",
          description: "Your AI-generated meal plan is ready!",
        });
        
        // Refresh the plans list
        const userPlans = await getUserMealPlans(user.id);
        setPlans(userPlans);
        
        // Reset form
        setPlanName("");
        setDate(new Date());
      }
    } catch (error) {
      console.error("Error generating meal plan:", error);
      toast({
        title: "Error",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      setDeleting(planId);
      await deleteMealPlan(planId);
      setPlans(plans.filter(plan => plan.id !== planId));
      
      toast({
        title: "Plan Deleted",
        description: "Your meal plan has been deleted."
      });
    } catch (error) {
      console.error("Error deleting meal plan:", error);
      toast({
        title: "Error",
        description: "Failed to delete meal plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Meal Plans</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Create New Plan</CardTitle>
              <CardDescription>Set up a new meal plan for a specific date</CardDescription>
            </CardHeader>
            <form onSubmit={handleCreatePlan}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="planName">Plan Name (Optional)</Label>
                  <Input
                    id="planName"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    placeholder="E.g., Weekly Plan, High Protein Plan"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(date, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" disabled={creating} className="w-full sm:w-auto">
                  {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Create Empty Plan
                </Button>
                <Button 
                  type="button" 
                  variant="default" 
                  className="w-full sm:w-auto bg-nutri-600 hover:bg-nutri-700"
                  onClick={handleGeneratePlan}
                  disabled={generating}
                >
                  {generating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Auto-Generate Plan
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Meal Plans</CardTitle>
              <CardDescription>Browse and manage your existing meal plans</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : plans.length > 0 ? (
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div key={plan.id} className="flex justify-between items-center border rounded-md p-4">
                      <div>
                        <h3 className="font-medium">{plan.plan_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(plan.plan_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => handleDeletePlan(plan.id!)}
                          disabled={deleting === plan.id}
                        >
                          {deleting === plan.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                        <Button asChild variant="outline">
                          <Link to={`/meal-plans/${plan.id}`}>
                            View <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't created any meal plans yet.</p>
                  <p className="text-sm">Create your first meal plan to get personalized meal suggestions.</p>
                  <Button 
                    onClick={handleGeneratePlan} 
                    className="mt-4 bg-nutri-600 hover:bg-nutri-700"
                    disabled={generating}
                  >
                    {generating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate Your First Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MealPlans;
