import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: "blue" | "green" | "orange" | "purple";
}

const colorClasses = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600", 
  orange: "bg-orange-100 text-orange-600",
  purple: "bg-purple-100 text-purple-600",
};

export default function StatsCard({ title, value, icon, trend, color }: StatsCardProps) {
  return (
    <Card className="stat-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", colorClasses[color])}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
            )}
            <span className={cn(
              "font-medium",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {trend.value}%
            </span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
