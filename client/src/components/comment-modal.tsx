import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { MediaItem, Comment, User } from "@shared/schema";

interface CommentModalProps {
  mediaItem: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: number;
}

type CommentWithUser = Comment & { user: User };

export function CommentModal({ mediaItem, isOpen, onClose, currentUserId = 1 }: CommentModalProps) {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery<CommentWithUser[]>({
    queryKey: ["/api/media", mediaItem?.id, "comments"],
    enabled: !!mediaItem?.id,
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/comments", {
        userId: currentUserId,
        mediaItemId: mediaItem!.id,
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media", mediaItem?.id, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setNewComment("");
      toast({
        title: "Success",
        description: "Comment added successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = () => {
    if (!newComment.trim() || !mediaItem) return;
    addCommentMutation.mutate(newComment);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (!mediaItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader className="pb-4 border-b">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl">Comments & Stories</DialogTitle>
              <DialogDescription className="mt-2">
                <span className="font-medium">{mediaItem.title}</span>
                {mediaItem.creator && (
                  <span className="text-neutral-500"> by {mediaItem.creator}</span>
                )}
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 max-h-96">
          <div className="space-y-4 p-1">
            {isLoading ? (
              <div className="text-center py-8 text-neutral-500">
                Loading comments...
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                No comments yet. Be the first to share your thoughts!
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback 
                      className="text-white text-sm font-medium"
                      style={{ backgroundColor: comment.user?.avatarColor || "#6366F1" }}
                    >
                      {getInitials(comment.user?.displayName || "User")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-primary text-sm">
                        {comment.user?.displayName || "Anonymous"}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {comment.createdAt ? formatTimeAgo(new Date(comment.createdAt)) : "Now"}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 leading-relaxed break-words">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        <div className="border-t pt-4">
          <div className="flex space-x-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback 
                className="text-white text-sm font-medium"
                style={{ backgroundColor: "#6366F1" }}
              >
                JS
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share your thoughts about this choice..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="resize-none min-h-[80px]"
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-neutral-500">
                  {newComment.length}/200 characters
                </span>
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || addCommentMutation.isPending}
                  className="bg-secondary hover:bg-secondary/90"
                >
                  {addCommentMutation.isPending ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
