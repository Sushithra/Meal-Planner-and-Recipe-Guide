
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import DailyTip from "@/components/DailyTip";
import { getProfile, ProfileData } from "@/services/profileService";
import { getUserMealPlans, MealPlan } from "@/services/mealPlanService";
import { getChatHistory, ChatMessage } from "@/services/chatService";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Daily tips for nutrition
  const tips = [
    "Stay hydrated by drinking at least 8 glasses of water daily.",
    "Include a variety of colorful fruits and vegetables in your diet for essential vitamins and minerals.",
    "Choose whole grains over refined grains for more fiber and nutrients.",
    "Incorporate lean proteins like chicken, fish, beans, and tofu into your meals.",
    "Limit processed foods and foods high in added sugars and sodium.",
    "Healthy fats from avocados, nuts, and olive oil are essential for your diet.",
    "Practice portion control to maintain a healthy weight.",
    "Meal prep can help you make healthier food choices throughout the week.",
    "Read food labels to understand what you're consuming.",
    "Eating slowly helps with digestion and can prevent overeating."
  ];
  
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch user profile
        const profileData = await getProfile(user.id);
        setProfile(profileData);
        
        // Fetch user meal plans
        const plans = await getUserMealPlans(user.id);
        setMealPlans(plans);
        
        // Fetch chat history
        const history = await getChatHistory(user.id);
        setChatHistory(history);
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {profile?.full_name || user?.email}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DailyTip tip={randomTip} />
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with these common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button asChild><Link to="/profile">Update Profile</Link></Button>
              <Button asChild><Link to="/meal-plans">Create Meal Plan</Link></Button>
              <Button asChild><Link to="/chatbot">Ask Nutrition Bot</Link></Button>
              <Button asChild variant="outline"><Link to="/recipes">Browse Recipes</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile Summary</CardTitle>
            <CardDescription>Your health information and goals</CardDescription>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="space-y-4">
                {profile.health_goal && (
                  <div>
                    <h3 className="font-medium">Health Goal</h3>
                    <p>{profile.health_goal}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {profile.age && (
                    <div>
                      <h3 className="font-medium">Age</h3>
                      <p>{profile.age} years</p>
                    </div>
                  )}
                  {profile.gender && (
                    <div>
                      <h3 className="font-medium">Gender</h3>
                      <p>{profile.gender}</p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {profile.height && (
                    <div>
                      <h3 className="font-medium">Height</h3>
                      <p>{profile.height} cm</p>
                    </div>
                  )}
                  {profile.weight && (
                    <div>
                      <h3 className="font-medium">Weight</h3>
                      <p>{profile.weight} kg</p>
                    </div>
                  )}
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/profile">Update Profile</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="mb-4">Your profile is not complete yet.</p>
                <Button asChild>
                  <Link to="/profile">Complete Profile</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Meal Plans</CardTitle>
            <CardDescription>Your recent and upcoming meal plans</CardDescription>
          </CardHeader>
          <CardContent>
            {mealPlans.length > 0 ? (
              <div className="space-y-4">
                {mealPlans.slice(0, 3).map((plan) => (
                  <div key={plan.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{plan.plan_name}</h3>
                        <p className="text-sm text-gray-500">{new Date(plan.plan_date).toLocaleDateString()}</p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/meal-plans/${plan.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full">
                  <Link to="/meal-plans">View All Plans</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="mb-4">You haven't created any meal plans yet.</p>
                <Button asChild>
                  <Link to="/meal-plans">Create Meal Plan</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Recent Chat History</h2>
        {chatHistory.length > 0 ? (
          <div className="space-y-4">
            {chatHistory.slice(0, 3).map((message) => (
              <Card key={message.id}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="bg-muted p-3 rounded-md">
                      <p className="font-medium text-sm">You asked:</p>
                      <p>{message.user_message}</p>
                    </div>
                    <div className="p-3 border rounded-md">
                      <p className="font-medium text-sm">Nutrition AI replied:</p>
                      <p>{message.assistant_response}</p>
                    </div>
                    <p className="text-xs text-right text-gray-500">
                      {new Date(message.created_at!).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="flex justify-center mt-4">
              <Button asChild variant="outline">
                <Link to="/chatbot">Continue Chatting</Link>
              </Button>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="mb-4">You haven't chatted with the nutrition assistant yet.</p>
              <Button asChild>
                <Link to="/chatbot">Start a Conversation</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
