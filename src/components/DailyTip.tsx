
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DailyTipProps {
  tip: string;
}

const DailyTip = ({ tip }: DailyTipProps) => {
  return (
    <Card className="border-l-4 border-l-nutri-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <span className="text-nutri-600">💡</span>
          <span className="ml-2">Daily Nutrition Tip</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{tip}</p>
      </CardContent>
    </Card>
  );
};

export default DailyTip;
