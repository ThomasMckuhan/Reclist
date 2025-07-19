import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Bell, Plus, Users, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navigation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location] = useLocation();
  
  // Mock current user - in real app this would come from auth context
  const currentUser = {
    id: 1,
    displayName: "John Smith",
    avatarColor: "#6366F1"
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-neutral-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-secondary">Reclist</h1>
              <span className="ml-3 text-sm text-neutral-500 hidden sm:block">
                Medias with a story to tell
              </span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex ml-8 space-x-6">
              <Link href="/">
                <Button 
                  variant="ghost" 
                  className={`text-neutral-600 hover:text-primary ${location === "/" ? "text-primary font-medium" : ""}`}
                >
                  Home
                </Button>
              </Link>
              <Link href="/communities">
                <Button 
                  variant="ghost" 
                  className={`text-neutral-600 hover:text-primary ${location === "/communities" ? "text-primary font-medium" : ""}`}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Communities
                </Button>
              </Link>
              <Link href="/timeline">
                <Button 
                  variant="ghost" 
                  className={`text-neutral-600 hover:text-primary ${location === "/timeline" ? "text-primary font-medium" : ""}`}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Timeline
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  variant="ghost" 
                  className={`text-neutral-600 hover:text-primary ${location === "/about" ? "text-primary font-medium" : ""}`}
                >
                  About Us
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search users or media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-neutral-200 rounded-full focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
            
            <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-primary">
              <Bell className="h-5 w-5" />
            </Button>

            <Link href="/profile">
              <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-primary">
                <Plus className="h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/profile">
              <Avatar className="h-8 w-8">
                <AvatarFallback 
                  className="text-white font-medium text-sm"
                  style={{ backgroundColor: currentUser.avatarColor }}
                >
                  {getInitials(currentUser.displayName)}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
