import { CheckCircle, Music, Book, Film, Tv, Youtube, Gamepad2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";
import type { User, MediaItem } from "@shared/schema";

interface UserCardProps {
  user: User & { matchCount: number; sharedItems: MediaItem[] };
  onConnect: (userId: number) => void;
}

const mediaTypeIcons = {
  song: Music,
  book: Book,
  movie: Film,
  show: Tv,
  youtube: Youtube,
  game: Gamepad2,
};

const mediaTypeColors = {
  song: "bg-purple-100 text-purple-800",
  book: "bg-green-100 text-green-800",
  movie: "bg-red-100 text-red-800",
  show: "bg-blue-100 text-blue-800",
  youtube: "bg-orange-100 text-orange-800",
  game: "bg-yellow-100 text-yellow-800",
};

export function UserCard({ user, onConnect }: UserCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback 
                className="text-white font-semibold"
                style={{ backgroundColor: user.avatarColor }}
              >
                {getInitials(user.displayName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-primary">{user.displayName}</h4>
              {user.location && (
                <p className="text-sm text-neutral-500">{user.location}</p>
              )}
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800 border-0">
            <CheckCircle className="h-3 w-3 mr-1" />
            {user.matchCount} matches
          </Badge>
        </div>
        
        {user.bio && (
          <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
            {user.bio}
          </p>
        )}
        
        <div className="space-y-2 mb-4">
          <h5 className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
            Shared Items
          </h5>
          <div className="flex flex-wrap gap-2">
            {user.sharedItems.slice(0, 4).map((item) => {
              const IconComponent = mediaTypeIcons[item.mediaType as keyof typeof mediaTypeIcons];
              const colorClass = mediaTypeColors[item.mediaType as keyof typeof mediaTypeColors] || "bg-gray-100 text-gray-800";
              
              return (
                <Badge 
                  key={item.id} 
                  variant="secondary" 
                  className={`text-xs ${colorClass} border-0`}
                >
                  {IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
                  {item.title.length > 15 ? item.title.slice(0, 15) + "..." : item.title}
                </Badge>
              );
            })}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button asChild className="flex-1 bg-secondary hover:bg-secondary/90 text-white">
            <Link href={`/user/${user.id}`}>
              View List
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onConnect(user.id)}
          >
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
