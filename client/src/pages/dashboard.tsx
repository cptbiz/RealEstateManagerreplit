import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, Calendar, CheckCircle, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import StatsCard from "@/components/dashboard/stats-card";
import RecentActivity from "@/components/dashboard/recent-activity";
import RecentLeads from "@/components/dashboard/recent-leads";
import FeaturedProperties from "@/components/dashboard/featured-properties";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: isAuthenticated,
  });

  const { data: leads, isLoading: leadsLoading } = useQuery({
    queryKey: ["/api/leads"],
    enabled: isAuthenticated,
  });

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ["/api/properties"],
    enabled: isAuthenticated,
  });

  if (isLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const recentLeads = leads?.slice(0, 5) || [];
  const featuredProperties = properties?.slice(0, 3) || [];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Leads"
          value={stats?.totalLeads || 0}
          icon={<Users className="h-6 w-6" />}
          trend={{ value: 12, isPositive: true }}
          color="blue"
        />
        <StatsCard
          title="Active Properties"
          value={stats?.activeProperties || 0}
          icon={<Building className="h-6 w-6" />}
          trend={{ value: 8, isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Appointments"
          value={stats?.upcomingAppointments || 0}
          icon={<Calendar className="h-6 w-6" />}
          trend={{ value: 3, isPositive: false }}
          color="orange"
        />
        <StatsCard
          title="Completed Tasks"
          value={stats?.completedTasks || 0}
          icon={<CheckCircle className="h-6 w-6" />}
          trend={{ value: 25, isPositive: true }}
          color="purple"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart Placeholder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sales Performance</CardTitle>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last year</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Sales Performance Chart</p>
                <p className="text-sm text-gray-400">Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <RecentActivity activities={stats?.recentActivities || []} />
      </div>

      {/* Recent Leads and Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentLeads leads={recentLeads} isLoading={leadsLoading} />
        <FeaturedProperties properties={featuredProperties} isLoading={propertiesLoading} />
      </div>
    </div>
  );
}
