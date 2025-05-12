import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  getProfile, 
  updateProfile, 
  ProfileData, 
  getDietaryRestrictions,
  addDietaryRestriction,
  removeDietaryRestriction,
  getDislikedIngredients,
  addDislikedIngredient,
  removeDislikedIngredient,
  DietaryRestriction,
  DislikedIngredient
} from "@/services/profileService";
import { Badge } from "@/components/ui/badge";
import { X, Edit, Save } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Common dietary restrictions
const commonDietaryRestrictions = [
  { name: "Vegetarian", description: "No meat, fish, or poultry" },
  { name: "Vegan", description: "No animal products including dairy and eggs" },
  { name: "Gluten-Free", description: "No gluten-containing grains" },
  { name: "Dairy-Free", description: "No dairy products" },
  { name: "Nut-Free", description: "No nuts or nut-derived ingredients" },
  { name: "Keto", description: "Low carb, high fat diet" },
  { name: "Paleo", description: "Focus on whole foods, no processed foods" },
  { name: "Low-FODMAP", description: "Limited fermentable carbohydrates" },
  { name: "Pescatarian", description: "No meat except fish" },
  { name: "Halal", description: "Following Islamic dietary laws" },
  { name: "Kosher", description: "Following Jewish dietary laws" },
];

// Health goals mapping
const healthGoalLabels: Record<string, string> = {
  weight_loss: "Weight Loss",
  weight_gain: "Weight Gain",
  muscle_building: "Muscle Building",
  maintenance: "Maintenance",
  general_health: "General Health"
};

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({});
  const [dietaryRestrictions, setDietaryRestrictions] = useState<DietaryRestriction[]>([]);
  const [dislikedIngredients, setDislikedIngredients] = useState<DislikedIngredient[]>([]);
  const [newRestriction, setNewRestriction] = useState("");
  const [newIngredient, setNewIngredient] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch profile
        const profileData = await getProfile(user.id);
        setProfile(profileData || {});
        
        // Fetch dietary restrictions
        const restrictions = await getDietaryRestrictions(user.id);
        setDietaryRestrictions(restrictions || []);
        
        // Fetch disliked ingredients
        const ingredients = await getDislikedIngredients(user.id);
        setDislikedIngredients(ingredients || []);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, toast]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convert numerical values
    if (name === 'age' || name === 'height' || name === 'weight') {
      setProfile({ ...profile, [name]: value ? parseFloat(value) : null });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleHealthGoalChange = (value: string) => {
    setProfile({ ...profile, health_goal: value });
  };

  const handleGenderChange = (value: string) => {
    setProfile({ ...profile, gender: value });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setSaving(true);
      await updateProfile(user.id, profile);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddRestriction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newRestriction.trim()) return;
    
    try {
      const result = await addDietaryRestriction(user.id, newRestriction.trim());
      setDietaryRestrictions([...dietaryRestrictions, result[0]]);
      setNewRestriction("");
      toast({ title: "Dietary restriction added" });
    } catch (error) {
      console.error("Error adding dietary restriction:", error);
      toast({
        title: "Error",
        description: "Failed to add dietary restriction.",
        variant: "destructive"
      });
    }
  };

  const handleAddPredefinedRestriction = async (restriction: string) => {
    if (!user || !restriction) return;
    
    // Check if restriction already exists
    if (dietaryRestrictions.some(item => 
      item.restriction.toLowerCase() === restriction.toLowerCase())) {
      toast({ 
        title: "Already added", 
        description: `${restriction} is already in your list.` 
      });
      return;
    }
    
    try {
      const result = await addDietaryRestriction(user.id, restriction);
      setDietaryRestrictions([...dietaryRestrictions, result[0]]);
      toast({ title: `${restriction} added to restrictions` });
    } catch (error) {
      console.error("Error adding dietary restriction:", error);
      toast({
        title: "Error",
        description: "Failed to add dietary restriction.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveRestriction = async (id: string) => {
    if (!id) return;
    
    try {
      await removeDietaryRestriction(id);
      setDietaryRestrictions(dietaryRestrictions.filter(item => item.id !== id));
      toast({ title: "Dietary restriction removed" });
    } catch (error) {
      console.error("Error removing dietary restriction:", error);
      toast({
        title: "Error",
        description: "Failed to remove dietary restriction.",
        variant: "destructive"
      });
    }
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newIngredient.trim()) return;
    
    try {
      const result = await addDislikedIngredient(user.id, newIngredient.trim());
      setDislikedIngredients([...dislikedIngredients, result[0]]);
      setNewIngredient("");
      toast({ title: "Disliked ingredient added" });
    } catch (error) {
      console.error("Error adding disliked ingredient:", error);
      toast({
        title: "Error",
        description: "Failed to add disliked ingredient.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveIngredient = async (id: string) => {
    if (!id) return;
    
    try {
      await removeDislikedIngredient(id);
      setDislikedIngredients(dislikedIngredients.filter(item => item.id !== id));
      toast({ title: "Disliked ingredient removed" });
    } catch (error) {
      console.error("Error removing disliked ingredient:", error);
      toast({
        title: "Error",
        description: "Failed to remove disliked ingredient.",
        variant: "destructive"
      });
    }
  };

  const calculateBMI = () => {
    if (!profile.height || !profile.weight) return null;
    
    // Convert height from cm to meters
    const heightInMeters = profile.height / 100;
    // BMI formula: weight (kg) / (height (m) * height (m))
    const bmi = profile.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-500" };
    if (bmi < 25) return { category: "Normal weight", color: "text-green-500" };
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-500" };
    return { category: "Obesity", color: "text-red-500" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        {!isEditing && (
          <Button 
            onClick={() => setIsEditing(true)} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dietary">Dietary Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                {isEditing 
                  ? "Update your personal details and health information" 
                  : "Your personal details and health information"}
              </CardDescription>
            </CardHeader>
            
            {isEditing ? (
              <form onSubmit={handleSaveProfile}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={profile.full_name || ""}
                        onChange={handleProfileChange}
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={profile.age || ""}
                          onChange={handleProfileChange}
                          placeholder="Your age"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select 
                          value={profile.gender || ""} 
                          onValueChange={handleGenderChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          name="height"
                          type="number"
                          step="0.01"
                          value={profile.height || ""}
                          onChange={handleProfileChange}
                          placeholder="Your height in cm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          name="weight"
                          type="number"
                          step="0.01"
                          value={profile.weight || ""}
                          onChange={handleProfileChange}
                          placeholder="Your weight in kg"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="health_goal">Health Goal</Label>
                      <Select 
                        value={profile.health_goal || ""} 
                        onValueChange={handleHealthGoalChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your health goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weight_loss">Weight Loss</SelectItem>
                          <SelectItem value="weight_gain">Weight Gain</SelectItem>
                          <SelectItem value="muscle_building">Muscle Building</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="general_health">General Health</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button type="submit" className="flex items-center gap-2" disabled={saving}>
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </CardFooter>
              </form>
            ) : (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Personal Details</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Name:</span>
                          <span className="font-medium">{profile.full_name || "Not specified"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Age:</span>
                          <span className="font-medium">{profile.age || "Not specified"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Gender:</span>
                          <span className="font-medium">
                            {profile.gender 
                              ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) 
                              : "Not specified"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Health Goal</h3>
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-sm">
                          {profile.health_goal ? healthGoalLabels[profile.health_goal] : "Not specified"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Body Metrics</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Height:</span>
                          <span className="font-medium">
                            {profile.height ? `${profile.height} cm` : "Not specified"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Weight:</span>
                          <span className="font-medium">
                            {profile.weight ? `${profile.weight} kg` : "Not specified"}
                          </span>
                        </div>
                        
                        {bmi && (
                          <div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">BMI:</span>
                              <span className="font-medium">{bmi}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Category:</span>
                              <span className={`font-medium ${bmiInfo?.color}`}>
                                {bmiInfo?.category}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="dietary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dietary Restrictions</CardTitle>
              <CardDescription>Your dietary restrictions and allergies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {dietaryRestrictions.length > 0 ? (
                  dietaryRestrictions.map((item) => (
                    <Badge key={item.id} variant="secondary" className="flex items-center gap-1">
                      {item.restriction}
                      {isEditing && (
                        <button onClick={() => handleRemoveRestriction(item.id!)} aria-label="Remove restriction">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No dietary restrictions added yet.</p>
                )}
              </div>
              
              {isEditing && (
                <>
                  <div className="flex gap-2 mb-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Common Restrictions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="bg-white w-56 z-50">
                        {commonDietaryRestrictions.map((restriction, index) => (
                          <DropdownMenuItem 
                            key={index}
                            className="flex flex-col items-start"
                            onClick={() => handleAddPredefinedRestriction(restriction.name)}
                          >
                            <span className="font-medium">{restriction.name}</span>
                            <span className="text-xs text-gray-500">{restriction.description}</span>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-xs text-muted-foreground italic">
                          Click to add to your list
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <span className="text-sm text-muted-foreground self-center">or</span>
                  </div>
                  
                  <form onSubmit={handleAddRestriction} className="flex gap-2">
                    <Input
                      placeholder="Custom restriction..."
                      value={newRestriction}
                      onChange={(e) => setNewRestriction(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!newRestriction.trim()}>
                      Add
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Disliked Ingredients</CardTitle>
              <CardDescription>Ingredients you dislike or want to avoid</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {dislikedIngredients.length > 0 ? (
                  dislikedIngredients.map((item) => (
                    <Badge key={item.id} variant="outline" className="flex items-center gap-1">
                      {item.ingredient}
                      {isEditing && (
                        <button onClick={() => handleRemoveIngredient(item.id!)} aria-label="Remove ingredient">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No disliked ingredients added yet.</p>
                )}
              </div>
              
              {isEditing && (
                <form onSubmit={handleAddIngredient} className="flex gap-2">
                  <Input
                    placeholder="Add an ingredient..."
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newIngredient.trim()}>
                    Add
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
