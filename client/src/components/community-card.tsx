import { useState } from "react";
import { Users, Crown, Music, Book, Film, Tv, Youtube, Gamepad2, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Community } from "@shared/schema";

interface CommunityCardProps {
  community: Community;
  currentUserId: number;
  isJoined: boolean;
}

const mediaTypeIcons = {
  song: Music,
  book: Book,
  movie: Film,
  show: Tv,
  youtube: Youtube,
  game: Gamepad2,
  art: Palette,
};

const mediaTypeColors = {
  song: "bg-purple-100 text-purple-800",
  book: "bg-green-100 text-green-800",
  movie: "bg-red-100 text-red-800",
  show: "bg-blue-100 text-blue-800",
  youtube: "bg-orange-100 text-orange-800",
  game: "bg-yellow-100 text-yellow-800",
  art: "bg-pink-100 text-pink-800",
};

export function CommunityCard({ community, currentUserId, isJoined }: CommunityCardProps) {
  const [joining, setJoining] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const IconComponent = community.mediaType 
    ? mediaTypeIcons[community.mediaType as keyof typeof mediaTypeIcons] 
    : Users;

  const joinMutation = useMutation({
    mutationFn: async () => {
      if (isJoined) {
        return apiRequest("DELETE", `/api/communities/${community.id}/leave`, {
          userId: currentUserId
        });
      } else {
        return apiRequest("POST", `/api/communities/${community.id}/join`, {
          userId: currentUserId
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/communities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId, "communities"] });
      toast({
        title: "Success",
        description: isJoined ? "Left community successfully!" : "Joined community successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: isJoined ? "Failed to leave community" : "Failed to join community",
        variant: "destructive",
      });
    },
  });

  const handleJoinToggle = () => {
    joinMutation.mutate();
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div 
        className="h-20 flex items-center justify-center"
        style={{ backgroundColor: community.color }}
      >
        <IconComponent className="h-8 w-8 text-white" />
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-primary mb-1 line-clamp-1">
              {community.name}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              {community.mediaType && (
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${mediaTypeColors[community.mediaType as keyof typeof mediaTypeColors] || 'bg-gray-100 text-gray-800'} border-0`}
                >
                  {community.mediaType.toUpperCase()}
                </Badge>
              )}
              <div className="flex items-center text-xs text-neutral-500">
                <Users className="h-3 w-3 mr-1" />
                {community.memberCount} members
              </div>
            </div>
          </div>
          
          {isJoined && (
            <Badge className="bg-green-100 text-green-800 border-0 text-xs">
              Joined
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-neutral-600 leading-relaxed mb-4 line-clamp-3">
          {community.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs text-neutral-500">
            <Crown className="h-3 w-3 mr-1" />
            Creator
          </div>
          
          <Button
            size="sm"
            variant={isJoined ? "outline" : "default"}
            className={isJoined ? "" : "bg-secondary hover:bg-secondary/90 text-white"}
            onClick={handleJoinToggle}
            disabled={joinMutation.isPending}
          >
            {joinMutation.isPending 
              ? (isJoined ? "Leaving..." : "Joining...") 
              : (isJoined ? "Leave" : "Join")
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}