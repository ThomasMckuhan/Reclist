import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Navigation } from "@/components/navigation";
import { MediaCard } from "@/components/media-card";
import { CommentModal } from "@/components/comment-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Users, UserPlus } from "lucide-react";
import { Link } from "wouter";
import type { MediaItem, User } from "@shared/schema";

export default function UserProfile() {
  const [, params] = useRoute("/user/:userId");
  const userId = parseInt(params?.userId || "0");
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaItem | null>(null);
  const currentUserId = 1; // Mock current user

  // Fetch user profile
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ["/api/users", userId],
  });

  // Fetch user's media items
  const { data: mediaItems = [], isLoading: isLoadingMedia } = useQuery<MediaItem[]>({
    queryKey: ["/api/users", userId, "media"],
  });

  // Find shared items with current user
  const { data: currentUserItems = [] } = useQuery<MediaItem[]>({
    queryKey: ["/api/users", currentUserId, "media"],
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Calculate shared items
  const sharedItems = mediaItems.filter(item => 
    currentUserItems.some(currentItem => 
      currentItem.title.toLowerCase() === item.title.toLowerCase()
    )
  );

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-gray-900">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-16 w-96" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-gray-900">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-primary mb-4">User not found</h2>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Discovery
            </Link>
          </Button>
        </div>

        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback 
                    className="text-white font-bold text-2xl"
                    style={{ backgroundColor: user.avatarColor }}
                  >
                    {getInitials(user.displayName)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-primary mb-2">
                        {user.displayName}
                      </h1>
                      <p className="text-neutral-600 mb-3">
                        @{user.username}
                      </p>
                      
                      {user.bio && (
                        <p className="text-neutral-600 mb-4 max-w-lg leading-relaxed">
                          {user.bio}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                        {user.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {user.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Connected
                        </div>
                      </div>

                      {/* Shared Items Indicator */}
                      {sharedItems.length > 0 && (
                        <Badge className="bg-green-100 text-green-800 border-0">
                          {sharedItems.length} shared items with you
                        </Badge>
                      )}
                    </div>
                    
                    <Button className="self-start bg-secondary hover:bg-secondary/90 text-white">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shared Items Section */}
        {sharedItems.length > 0 && (
          <section className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-primary mb-2">Shared Interests</h2>
              <p className="text-neutral-500">
                Media items you both have in your lists
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sharedItems.map((item) => (
                <div key={item.id} className="relative">
                  <MediaCard
                    mediaItem={item}
                    currentUserId={currentUserId}
                    onCommentClick={setSelectedMediaItem}
                  />
                  <Badge className="absolute -top-2 -right-2 bg-green-500 text-white border-0">
                    Shared
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Media Items Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                {user.displayName}'s Reclist
              </h2>
              <p className="text-neutral-500">
                {mediaItems.length} of 10 items curated
              </p>
            </div>
          </div>

          {isLoadingMedia ? (
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
                  No items yet
                </h3>
                <p className="text-neutral-500">
                  {user.displayName} hasn't added any media items to their list yet.
                </p>
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
