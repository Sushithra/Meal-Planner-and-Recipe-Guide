
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

const MainNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? "bg-accent text-accent-foreground" : "";
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  return (
    <nav className="bg-white border-b py-4 px-6 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="bg-nutri-600 text-white p-1.5 rounded-md">
            <Home className="h-5 w-5" />
          </span>
          <span className="font-bold text-xl">NutriAI</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${isActive("/")}`}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              {user && (
                <>
                  <NavigationMenuItem>
                    <Link to="/dashboard">
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${isActive("/dashboard")}`}>
                        Dashboard
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/meal-plans">
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${isActive("/meal-plans")}`}>
                        Meal Plans
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/recipes">
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${isActive("/recipes")}`}>
                        Recipes
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/chatbot">
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${isActive("/chatbot")}`}>
                        AI Assistant
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Link to="/profile">
                <Button variant="outline" className="gap-2">
                  <User size={16} />
                  Profile
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleSignOut}>Sign Out</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-nutri-600 hover:bg-nutri-700 gap-2">
                  Sign Up
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 bg-white shadow-lg rounded-b-lg py-2 px-6 absolute left-0 right-0 animate-fade-in">
          <div className="flex flex-col space-y-2">
            <Link to="/" className="py-2 hover:text-nutri-600 transition">Home</Link>
            
            {user && (
              <>
                <Link to="/dashboard" className="py-2 hover:text-nutri-600 transition">Dashboard</Link>
                <Link to="/meal-plans" className="py-2 hover:text-nutri-600 transition">Meal Plans</Link>
                <Link to="/recipes" className="py-2 hover:text-nutri-600 transition">Recipes</Link>
                <Link to="/chatbot" className="py-2 hover:text-nutri-600 transition">AI Assistant</Link>
                <Link to="/profile" className="py-2 hover:text-nutri-600 transition">Profile</Link>
                <button 
                  onClick={handleSignOut}
                  className="py-2 text-left hover:text-nutri-600 transition"
                >
                  Sign Out
                </button>
              </>
            )}
            
            {!user && (
              <>
                <hr className="my-2" />
                <div className="flex gap-2 py-2">
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/signup" className="flex-1">
                    <Button className="w-full bg-nutri-600 hover:bg-nutri-700">Sign Up</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavBar;
