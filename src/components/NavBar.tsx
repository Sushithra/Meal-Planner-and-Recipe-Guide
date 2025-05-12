
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, Menu } from "lucide-react";
import { useState } from "react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="font-medium hover:text-nutri-600 transition">Home</Link>
          <Link to="/dashboard" className="font-medium hover:text-nutri-600 transition">Dashboard</Link>
          <Link to="/recipes" className="font-medium hover:text-nutri-600 transition">Recipes</Link>
          <Link to="/chatbot" className="font-medium hover:text-nutri-600 transition">Chatbot</Link>
          <Link to="/login">
            <Button variant="outline" className="ml-2">Login</Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-nutri-600 hover:bg-nutri-700">Sign Up</Button>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 bg-white shadow-lg rounded-b-lg py-2 px-6 absolute left-0 right-0 animate-fade-in">
          <div className="flex flex-col space-y-2">
            <Link to="/" className="py-2 hover:text-nutri-600 transition">Home</Link>
            <Link to="/dashboard" className="py-2 hover:text-nutri-600 transition">Dashboard</Link>
            <Link to="/recipes" className="py-2 hover:text-nutri-600 transition">Recipes</Link>
            <Link to="/chatbot" className="py-2 hover:text-nutri-600 transition">Chatbot</Link>
            <hr className="my-2" />
            <div className="flex gap-2 py-2">
              <Link to="/login" className="flex-1">
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link to="/signup" className="flex-1">
                <Button className="w-full bg-nutri-600 hover:bg-nutri-700">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
