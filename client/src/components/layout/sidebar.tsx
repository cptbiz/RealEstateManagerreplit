import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { 
  Home, 
  Users, 
  Building, 
  Calendar, 
  CheckSquare, 
  FileText, 
  BarChart3, 
  Settings, 
  UserCircle,
  Phone
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Properties", href: "/properties", icon: Building },
  { name: "Contacts", href: "/contacts", icon: Phone },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 bg-primary">
        <div className="flex items-center">
          <Home className="h-8 w-8 text-white mr-3" />
          <span className="text-xl font-bold text-white">RealEstate CRM</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <li key={item.name}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start nav-link",
                    isActive && "active bg-blue-50 text-primary hover:bg-blue-100"
                  )}
                  asChild
                >
                  <a href={item.href}>
                    <Icon className={cn("nav-icon", isActive && "text-primary")} />
                    {item.name}
                  </a>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <UserCircle className="h-6 w-6 text-white" />
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
