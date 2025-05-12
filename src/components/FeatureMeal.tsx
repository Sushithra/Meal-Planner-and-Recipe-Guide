
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface FeatureMealProps {
  id: string;
  name: string;
  image: string;
  calories: number;
  time: string;
  tags: string[];
}

const FeatureMeal = ({ id, name, image, calories, time, tags }: FeatureMealProps) => {
  return (
    <div className="meal-card group">
      <div className="overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="meal-card-image group-hover:scale-105 transition-transform duration-300" 
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg truncate">{name}</h3>
          <Badge variant="outline" className="bg-nutri-100 text-nutri-800 border-nutri-200">
            {calories} cal
          </Badge>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span>{time}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <Link to={`/recipe/${id}`}>
          <Button className="w-full bg-nutri-600 hover:bg-nutri-700">View Recipe</Button>
        </Link>
      </div>
    </div>
  );
};

export default FeatureMeal;
