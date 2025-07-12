import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Property } from "@shared/schema";

interface FeaturedPropertiesProps {
  properties: Property[];
  isLoading: boolean;
}

const statusColors = {
  available: "bg-green-100 text-green-800",
  sold: "bg-red-100 text-red-800",
  rented: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
};

export default function FeaturedProperties({ properties, isLoading }: FeaturedPropertiesProps) {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Featured Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="w-16 h-16 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-48 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="w-16 h-6 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Featured Properties</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <a href="/properties">View All</a>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {properties.length === 0 ? (
            <p className="text-sm text-gray-500">No featured properties</p>
          ) : (
            properties.map((property) => (
              <div key={property.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-600 font-medium">
                    {property.propertyType === 'apartment' ? 'APT' : 
                     property.propertyType === 'house' ? 'HSE' : 
                     property.propertyType === 'condo' ? 'CDO' : 'COM'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{property.title}</p>
                  <p className="text-xs text-gray-500">{property.address}, {property.city}</p>
                  <p className="text-sm font-semibold text-primary">{formatPrice(property.price)}</p>
                </div>
                <div className="text-right">
                  <Badge className={statusColors[property.status as keyof typeof statusColors]}>
                    {property.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
