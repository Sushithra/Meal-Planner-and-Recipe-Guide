
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-nutri-600 mb-4">404</h1>
        <p className="text-2xl font-medium text-gray-800 mb-8">
          Oops! This page doesn't exist
        </p>
        <p className="text-gray-600 mb-8">
          The page you're looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button className="bg-nutri-600 hover:bg-nutri-700 px-6">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
