
import { Link } from "react-router-dom";
import BMICalculator from "./BMICalculator";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8 px-6 relative">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">NutriAI</h3>
            <p className="text-gray-600 mb-4">
              Your personalized meal recommendation system for a healthier you.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-nutri-600 transition">Home</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-nutri-600 transition">Dashboard</Link>
              </li>
              <li>
                <Link to="/recipes" className="text-gray-600 hover:text-nutri-600 transition">Recipes</Link>
              </li>
              <li>
                <Link to="/chatbot" className="text-gray-600 hover:text-nutri-600 transition">Chatbot</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3">Contact</h3>
            <p className="text-gray-600">support@nutriai.com</p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-nutri-600 transition">
                Twitter
              </a>
              <a href="#" className="text-gray-600 hover:text-nutri-600 transition">
                Facebook
              </a>
              <a href="#" className="text-gray-600 hover:text-nutri-600 transition">
                Instagram
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} NutriAI. All rights reserved.
        </div>
      </div>
      
      {/* BMI Calculator Fixed Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <BMICalculator />
      </div>
    </footer>
  );
};

export default Footer;
