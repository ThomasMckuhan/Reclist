import { useState } from "react";
import { Heart, MessageCircle, Music, Book, Film, Tv, Youtube, Gamepad2, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { MediaItem } from "@shared/schema";

interface MediaCardProps {
  mediaItem: MediaItem;
  currentUserId?: number;
  onCommentClick: (mediaItem: MediaItem) => void;
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
  song: "text-purple-600 bg-purple-100",
  book: "text-green-600 bg-green-100",
  movie: "text-red-600 bg-red-100",
  show: "text-indigo-600 bg-indigo-100",
  youtube: "text-amber-600 bg-amber-100",
  game: "text-yellow-600 bg-yellow-100",
  art: "text-rose-600 bg-rose-100",
};

const mediaTypeGradients = {
  song: "media-card-gradient-song",
  book: "media-card-gradient-book",
  movie: "media-card-gradient-movie",
  show: "media-card-gradient-show",
  youtube: "media-card-gradient-youtube",
  game: "media-card-gradient-game",
  art: "media-card-gradient-art",
};

export function MediaCard({ mediaItem, currentUserId = 1, onCommentClick }: MediaCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(mediaItem.likeCount);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const IconComponent = mediaTypeIcons[mediaItem.mediaType as keyof typeof mediaTypeIcons] || Music;

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        return apiRequest("DELETE", `/api/likes/${currentUserId}/${mediaItem.id}`);
      } else {
        return apiRequest("POST", "/api/likes", {
          userId: currentUserId,
          mediaItemId: mediaItem.id
        });
      }
    },
    onSuccess: () => {
      if (isLiked) {
        setLikeCount(prev => prev - 1);
        setIsLiked(false);
      } else {
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
      }
      queryClient.invalidateQueries({ queryKey: ["/api/users", mediaItem.userId, "media"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className={`aspect-square flex items-center justify-center ${mediaTypeGradients[mediaItem.mediaType as keyof typeof mediaTypeGradients] || 'media-card-gradient-default'}`}>
        <IconComponent className="h-12 w-12 text-white" />
      </div>
      
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Badge 
            variant="secondary" 
            className={`text-xs font-medium ${mediaTypeColors[mediaItem.mediaType as keyof typeof mediaTypeColors] || 'text-gray-600 bg-gray-100'}`}
          >
            {mediaItem.mediaType.toUpperCase()}
          </Badge>
          <span className="text-xs text-neutral-500">#{mediaItem.position}</span>
        </div>
        
        <h4 className="font-semibold text-primary mb-1 line-clamp-1">{mediaItem.title}</h4>
        {mediaItem.creator && (
          <p className="text-sm text-neutral-500 mb-3 line-clamp-1">{mediaItem.creator}</p>
        )}
        
        <p className="text-sm text-neutral-600 leading-relaxed mb-4 line-clamp-3">
          {mediaItem.story}
        </p>
        
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-neutral-500 hover:text-secondary p-2 h-auto"
            onClick={() => onCommentClick(mediaItem)}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span>{mediaItem.commentCount}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={`p-2 h-auto transition-colors ${
              isLiked 
                ? "text-red-500 hover:text-red-600" 
                : "text-neutral-500 hover:text-red-500"
            }`}
            onClick={() => likeMutation.mutate()}
            disabled={likeMutation.isPending}
          >
            <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
            <span>{likeCount}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
