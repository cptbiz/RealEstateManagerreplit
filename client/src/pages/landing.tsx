import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, Calendar, BarChart3 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Building className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">RealEstate CRM</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Empower your real estate business with our comprehensive CRM solution.
            Manage leads, properties, and close more deals efficiently.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Lead Management</CardTitle>
              <CardDescription>
                Track and nurture your leads from first contact to closing
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Building className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Property Listings</CardTitle>
              <CardDescription>
                Manage your property inventory with detailed information and photos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Appointment Scheduling</CardTitle>
              <CardDescription>
                Schedule and manage property viewings and client meetings
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Analytics & Reports</CardTitle>
              <CardDescription>
                Get insights into your sales performance and business metrics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Contact Management</CardTitle>
              <CardDescription>
                Keep all your client and vendor information organized
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Building className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Task Management</CardTitle>
              <CardDescription>
                Stay on top of your daily tasks and follow-ups
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription>
                Join thousands of real estate professionals who trust our CRM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg" 
                className="w-full max-w-sm"
                onClick={() => window.location.href = '/api/login'}
              >
                Sign In to Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
