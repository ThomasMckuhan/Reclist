import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { MediaCard } from "@/components/media-card";
import { AddMediaDialog } from "@/components/add-media-dialog";
import { CommentModal } from "@/components/comment-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, MapPin, Users } from "lucide-react";
import type { MediaItem, User } from "@shared/schema";

export default function Profile() {
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaItem | null>(null);
  const currentUserId = 1; // Mock current user

  // Fetch current user
  const { data: user } = useQuery<User>({
    queryKey: ["/api/users", currentUserId],
  });

  // Fetch user's media items
  const { data: mediaItems = [], isLoading } = useQuery<MediaItem[]>({
    queryKey: ["/api/users", currentUserId, "media"],
  });

  // Fetch connections count
  const { data: connections = [] } = useQuery({
    queryKey: ["/api/users", currentUserId, "connections"],
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const existingPositions = mediaItems.map(item => item.position);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback 
                    className="text-white font-bold text-2xl"
                    style={{ backgroundColor: user?.avatarColor || "#6366F1" }}
                  >
                    {user ? getInitials(user.displayName) : "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-primary mb-2">
                        {user?.displayName || "Loading..."}
                      </h1>
                      <p className="text-neutral-600 mb-3">
                        @{user?.username || "username"}
                      </p>
                      
                      {user?.bio && (
                        <p className="text-neutral-600 mb-3 max-w-lg leading-relaxed">
                          {user.bio}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-neutral-500">
                        {user?.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {user.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {connections.length} connections
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="self-start">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-500">
                Total Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {mediaItems.length}
                <span className="text-lg text-neutral-500">/10</span>
              </div>
              <p className="text-sm text-neutral-500 mt-1">
                {10 - mediaItems.length} slots remaining
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-500">
                Total Likes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {mediaItems.reduce((sum, item) => sum + item.likeCount, 0)}
              </div>
              <p className="text-sm text-neutral-500 mt-1">
                Across all items
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-500">
                Total Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {mediaItems.reduce((sum, item) => sum + item.commentCount, 0)}
              </div>
              <p className="text-sm text-neutral-500 mt-1">
                Stories shared
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Media Items Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Your Reclist</h2>
              <p className="text-neutral-500">
                Curate your favorite media with meaningful stories
              </p>
            </div>
            <AddMediaDialog 
              userId={currentUserId} 
              existingPositions={existingPositions}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : mediaItems.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-neutral-300 dark:border-gray-700 rounded-lg">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-medium text-primary mb-2">
                  Start building your Reclist
                </h3>
                <p className="text-neutral-500 mb-6 leading-relaxed">
                  Add your favorite songs, books, movies, shows, and more. Share the stories behind each choice to connect with like-minded people.
                </p>
                <AddMediaDialog 
                  userId={currentUserId} 
                  existingPositions={existingPositions}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaItems.map((item) => (
                <MediaCard
                  key={item.id}
                  mediaItem={item}
                  currentUserId={currentUserId}
                  onCommentClick={setSelectedMediaItem}
                />
              ))}
              
              {mediaItems.length < 10 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-neutral-300 dark:border-gray-700 hover:border-neutral-400 dark:hover:border-gray-600 transition-colors">
                  <div className="aspect-square flex items-center justify-center">
                    <div className="text-center">
                      <AddMediaDialog 
                        userId={currentUserId} 
                        existingPositions={existingPositions}
                      />
                      <p className="text-xs text-neutral-400 mt-3">
                        {10 - mediaItems.length} slots remaining
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <CommentModal
        mediaItem={selectedMediaItem}
        isOpen={!!selectedMediaItem}
        onClose={() => setSelectedMediaItem(null)}
        currentUserId={currentUserId}
      />
    </div>
  );
}
