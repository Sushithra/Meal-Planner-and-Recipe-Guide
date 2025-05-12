
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import FeatureMeal from "@/components/FeatureMeal";
import DailyTip from "@/components/DailyTip";
import { Link } from "react-router-dom";

// Sample featured meals data
const featuredMeals = [
  {
    id: "52772",
    name: "Teriyaki Chicken Casserole",
    image: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
    calories: 450,
    time: "45 min",
    tags: ["Chicken", "Japanese", "Casserole"]
  },
  {
    id: "52785",
    name: "Dal fry",
    image: "https://www.themealdb.com/images/media/meals/wuxrtu1483564410.jpg",
    calories: 320,
    time: "30 min",
    tags: ["Vegetarian", "Indian", "Curry"]
  },
  {
    id: "52895",
    name: "English Breakfast",
    image: "https://www.themealdb.com/images/media/meals/utxryw1511721587.jpg",
    calories: 720,
    time: "20 min",
    tags: ["Breakfast", "British", "HighProtein"]
  }
];

// Sample daily tip
const dailyTip = "Including protein in every meal helps stabilize blood sugar levels and keeps you feeling fuller for longer.";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-nutri-50 to-nutri-100 py-16 px-6">
          <div className="container mx-auto">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your Personal <span className="text-nutri-600">AI Nutritionist</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Get personalized meal recommendations based on your dietary preferences,
                health goals, and restrictions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button className="bg-nutri-600 hover:bg-nutri-700 text-white px-8 py-6 text-lg">
                    Get Started
                  </Button>
                </Link>
                <Link to="/chatbot">
                  <Button variant="outline" className="px-8 py-6 text-lg">
                    Try AI Assistant
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              How <span className="text-nutri-600">Nutri AI</span> Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 border border-gray-100 rounded-lg shadow-sm">
                <div className="bg-nutri-100 text-nutri-600 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
                <p className="text-gray-600">
                  Tell us about your dietary preferences, health goals, and any restrictions you may have.
                </p>
              </div>
              
              <div className="text-center p-6 border border-gray-100 rounded-lg shadow-sm">
                <div className="bg-nutri-100 text-nutri-600 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Get AI Recommendations</h3>
                <p className="text-gray-600">
                  Our AI will analyze your profile and automatically generate meal plans that match your unique needs.
                </p>
              </div>
              
              <div className="text-center p-6 border border-gray-100 rounded-lg shadow-sm">
                <div className="bg-nutri-100 text-nutri-600 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Enjoy Healthier Eating</h3>
                <p className="text-gray-600">
                  Follow your personalized meal plans and achieve your health and wellness goals.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Meals */}
        <section className="bg-gray-50 py-16 px-6">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Meals</h2>
              <Link to="/recipes">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredMeals.map((meal) => (
                <FeatureMeal key={meal.id} {...meal} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Daily Tip */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-3xl">
            <DailyTip tip={dailyTip} />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
