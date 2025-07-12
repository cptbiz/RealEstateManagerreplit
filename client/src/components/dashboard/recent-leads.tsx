import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import type { Lead } from "@shared/schema";

interface RecentLeadsProps {
  leads: Lead[];
  isLoading: boolean;
}

const statusColors = {
  new: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  qualified: "bg-green-100 text-green-800",
  unqualified: "bg-red-100 text-red-800",
  converted: "bg-purple-100 text-purple-800",
};

export default function RecentLeads({ leads, isLoading }: RecentLeadsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-48" />
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
          <CardTitle>Recent Leads</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <a href="/leads">View All</a>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leads.length === 0 ? (
            <p className="text-sm text-gray-500">No recent leads</p>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {lead.firstName[0]}{lead.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {lead.firstName} {lead.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{lead.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={statusColors[lead.status as keyof typeof statusColors]}>
                    {lead.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(lead.createdAt!), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
