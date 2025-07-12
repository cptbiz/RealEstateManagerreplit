import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Building, Calendar, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Reports() {
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

  const { data: leads } = useQuery({
    queryKey: ["/api/leads"],
    enabled: isAuthenticated,
  });

  const { data: properties } = useQuery({
    queryKey: ["/api/properties"],
    enabled: isAuthenticated,
  });

  const { data: appointments } = useQuery({
    queryKey: ["/api/appointments"],
    enabled: isAuthenticated,
  });

  const { data: tasks } = useQuery({
    queryKey: ["/api/tasks"],
    enabled: isAuthenticated,
  });

  if (isLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate additional metrics
  const leadsByStatus = leads?.reduce((acc: any, lead: any) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const propertiesByStatus = properties?.reduce((acc: any, property: any) => {
    acc[property.status] = (acc[property.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const appointmentsByStatus = appointments?.reduce((acc: any, appointment: any) => {
    acc[appointment.status] = (acc[appointment.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const tasksByStatus = tasks?.reduce((acc: any, task: any) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const conversionRate = leads?.length > 0 ? 
    ((leadsByStatus.converted || 0) / leads.length * 100).toFixed(1) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Conversion Rate: {conversionRate}%
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active: {propertiesByStatus.available || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Completed: {appointmentsByStatus.completed || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Completed: {tasksByStatus.completed || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(leadsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                    <span className="text-sm font-medium capitalize">{status}</span>
                  </div>
                  <span className="text-sm font-semibold">{count as number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Property Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Property Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(propertiesByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium capitalize">{status}</span>
                  </div>
                  <span className="text-sm font-semibold">{count as number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appointment Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(appointmentsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium capitalize">{status}</span>
                  </div>
                  <span className="text-sm font-semibold">{count as number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Task Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(tasksByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium capitalize">{status.replace('_', ' ')}</span>
                  </div>
                  <span className="text-sm font-semibold">{count as number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Performance Charts</p>
              <p className="text-sm text-gray-400">Chart visualization would be implemented here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
