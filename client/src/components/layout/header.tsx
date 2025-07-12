import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onMenuClick?: () => void;
  title?: string;
}

export default function Header({ onMenuClick, title = "Dashboard" }: HeaderProps) {
  const isMobile = useIsMobile();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                className="mr-2"
                onClick={onMenuClick}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10"
              />
            </div>
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
