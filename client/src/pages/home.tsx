import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { MediaCard } from "@/components/media-card";
import { UserCard } from "@/components/user-card";
import { CommentModal } from "@/components/comment-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ArrowRight, Flame, Music, Book, Film, Tv, Youtube, Gamepad2, Palette } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { MediaItem, User } from "@shared/schema";

const mediaTypeIcons = {
  song: Music,
  book: Book,
  movie: Film,
  show: Tv,
  youtube: Youtube,
  game: Gamepad2,
  art: Palette,
};

const mediaTypeGradients = {
  song: "from-purple-400 to-purple-600",
  book: "from-green-400 to-green-600",
  movie: "from-red-400 to-red-600",
  show: "from-blue-400 to-blue-600",
  youtube: "from-orange-400 to-orange-600",
  game: "from-yellow-400 to-yellow-600",
  art: "from-pink-400 to-pink-600",
};

export default function Home() {
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaItem | null>(null);
  const [discoveryFilter, setDiscoveryFilter] = useState("matches");
  const currentUserId = 1; // Mock current user
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current user's media items
  const { data: userMediaItems = [], isLoading: isLoadingUserMedia } = useQuery<MediaItem[]>({
    queryKey: ["/api/users", currentUserId, "media"],
  });

  // Fetch discovery matches
  const { data: discoveryUsers = [], isLoading: isLoadingDiscovery } = useQuery<(User & { matchCount: number; sharedItems: MediaItem[] })[]>({
    queryKey: ["/api/users", currentUserId, "discover"],
    queryParams: { minMatches: 3 },
  });

  // Fetch trending items
  const { data: trendingItems = [], isLoading: isLoadingTrending } = useQuery<MediaItem[]>({
    queryKey: ["/api/trending"],
  });

  const connectMutation = useMutation({
    mutationFn: async (connectedUserId: number) => {
      return apiRequest("POST", "/api/connections", {
        userId: currentUserId,
        connectedUserId,
      });
    },
    onSuccess: () => {
      toast({
        title: "Connection Request Sent",
        description: "Your connection request has been sent successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send connection request",
        variant: "destructive",
      });
    },
  });

  const handleConnect = (userId: number) => {
    connectMutation.mutate(userId);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-neutral-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-primary mb-6 leading-tight">
            Share your favorite medias<br />
            <span className="text-secondary">with stories behind them</span>
          </h2>
          <p className="text-xl text-neutral-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            Curate your top 10 favorite songs, books, movies, shows, and more. Connect with people who share your taste and discover new favorites through meaningful stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 text-lg">
              <Link href="/profile">
                Start Curating Your List
              </Link>
            </Button>
            <Button asChild variant="ghost" className="text-secondary hover:text-secondary/80 px-8 py-6 text-lg">
              <Link href="/communities">
                Join Communities
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* User's Current List Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">Your Reclist</h3>
              <p className="text-neutral-500">
                {userMediaItems.length} of 10 items curated
              </p>
            </div>
            <Button asChild className="bg-accent hover:bg-accent/90 text-white">
              <Link href="/profile">
                <Plus className="h-4 w-4 mr-2" />
                Manage List
              </Link>
            </Button>
          </div>

          {isLoadingUserMedia ? (
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
          ) : userMediaItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <h4 className="text-lg font-medium text-primary mb-2">Start your first Reclist</h4>
                <p className="text-neutral-500 mb-6">
                  Add your favorite media items with meaningful stories to connect with like-minded people.
                </p>
                <Button asChild className="bg-secondary hover:bg-secondary/90 text-white">
                  <Link href="/profile">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Item
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userMediaItems.map((item) => (
                <MediaCard
                  key={item.id}
                  mediaItem={item}
                  currentUserId={currentUserId}
                  onCommentClick={setSelectedMediaItem}
                />
              ))}
              
              {userMediaItems.length < 10 && (
                <Link href="/profile">
                  <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-neutral-300 dark:border-gray-700 hover:border-neutral-400 dark:hover:border-gray-600 transition-colors cursor-pointer">
                    <div className="aspect-square flex items-center justify-center">
                      <div className="text-center">
                        <Plus className="h-8 w-8 text-neutral-400 mb-3 mx-auto" />
                        <p className="text-neutral-500 font-medium">Add another item</p>
                        <p className="text-xs text-neutral-400 mt-1">
                          {10 - userMediaItems.length} slots remaining
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          )}
        </section>

        {/* Discovery Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">Discover People</h3>
              <p className="text-neutral-500">Find users who share at least 3 items with you</p>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={discoveryFilter === "matches" ? "default" : "outline"}
                onClick={() => setDiscoveryFilter("matches")}
                className={discoveryFilter === "matches" ? "bg-secondary hover:bg-secondary/90 text-white" : ""}
              >
                3+ Matches
              </Button>
              <Button
                size="sm"
                variant={discoveryFilter === "all" ? "default" : "outline"}
                onClick={() => setDiscoveryFilter("all")}
              >
                All Users
              </Button>
            </div>
          </div>

          {isLoadingDiscovery ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : discoveryUsers.length === 0 ? (
            <div className="text-center py-16">
              <h4 className="text-lg font-medium text-primary mb-2">No matches found</h4>
              <p className="text-neutral-500">
                Add more items to your list to find people with shared interests.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {discoveryUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onConnect={handleConnect}
                />
              ))}
            </div>
          )}
        </section>

        {/* Trending Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">Weekly Gems</h3>
              <p className="text-neutral-500">Most discussed media items this week</p>
            </div>
            <Button variant="ghost" className="text-secondary hover:text-secondary/80">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {isLoadingTrending ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(() => {
                // Remove duplicates based on title and creator to ensure unique items
                const uniqueItems = trendingItems.filter((item, index, self) => 
                  index === self.findIndex(t => t.title === item.title && t.creator === item.creator)
                );
                
                return uniqueItems.slice(0, 4).map((item) => {
                  const IconComponent = mediaTypeIcons[item.mediaType as keyof typeof mediaTypeIcons] || Music;
                  const gradientClass = mediaTypeGradients[item.mediaType as keyof typeof mediaTypeGradients] || "from-indigo-400 to-indigo-600";
                  
                  return (
                    <div 
                      key={item.id} 
                      className="bg-white dark:bg-gray-800 rounded-xl border border-neutral-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedMediaItem(item)}
                    >
                      <div className={`aspect-square bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
                        <IconComponent className="h-12 w-12 text-white" />
                      </div>
                      <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.mediaType.toUpperCase()}
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 border-0">
                          <Flame className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-primary mb-1 line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-neutral-500 mb-2">
                        {item.commentCount + item.likeCount} discussions
                      </p>
                      <p className="text-xs text-neutral-600 line-clamp-2">
                        {item.story.slice(0, 60)}...
                      </p>
                    </div>
                  </div>
                  );
                });
              })()}
            </div>
          )}
        </section>

      </main>

      {/* Floating Action Button */}
      <Button 
        asChild
        className="fixed bottom-6 right-6 w-14 h-14 bg-secondary hover:bg-secondary/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        <Link href="/profile">
          <Plus className="h-6 w-6" />
        </Link>
      </Button>

      <CommentModal
        mediaItem={selectedMediaItem}
        isOpen={!!selectedMediaItem}
        onClose={() => setSelectedMediaItem(null)}
        currentUserId={currentUserId}
      />
    </div>
  );
}
