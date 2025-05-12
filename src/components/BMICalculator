
import { useState } from "react";
import { Calculator } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BMICalculator = () => {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");

  const calculateBMI = () => {
    if (!height || !weight) return;
    
    const heightInM = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    
    if (isNaN(heightInM) || isNaN(weightInKg) || heightInM <= 0 || weightInKg <= 0) {
      return;
    }
    
    const calculatedBMI = weightInKg / (heightInM * heightInM);
    setBmi(parseFloat(calculatedBMI.toFixed(1)));
    
    // Determine BMI category
    if (calculatedBMI < 18.5) {
      setCategory("Underweight");
    } else if (calculatedBMI >= 18.5 && calculatedBMI < 25) {
      setCategory("Normal weight");
    } else if (calculatedBMI >= 25 && calculatedBMI < 30) {
      setCategory("Overweight");
    } else {
      setCategory("Obesity");
    }
  };

  const resetCalculator = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
    setCategory("");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full bg-white border-gray-200 shadow-md hover:bg-gray-100"
        >
          <Calculator className="h-5 w-5 text-gray-700" />
          <span className="sr-only">BMI Calculator</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-medium text-lg">BMI Calculator</h3>
            <p className="text-sm text-muted-foreground">Calculate your Body Mass Index</p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              placeholder="Enter your height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              placeholder="Enter your weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={calculateBMI} className="flex-1">Calculate</Button>
            <Button variant="outline" onClick={resetCalculator}>Reset</Button>
          </div>
          
          {bmi !== null && (
            <div className="rounded-lg bg-gray-50 p-3 text-center">
              <div className="text-2xl font-bold">{bmi}</div>
              <div className={`text-sm font-medium ${
                category === "Normal weight" 
                  ? "text-green-600" 
                  : category === "Underweight" 
                  ? "text-amber-600"
                  : "text-red-600"
              }`}>
                {category}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                BMI Categories: Underweight &lt; 18.5 | Normal weight 18.5–24.9 | Overweight 25–29.9 | Obesity ≥ 30
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BMICalculator;
