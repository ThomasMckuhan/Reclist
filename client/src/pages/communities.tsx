import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { CommunityCard } from "@/components/community-card";
import { CreateCommunityDialog } from "@/components/create-community-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Filter } from "lucide-react";
import type { Community } from "@shared/schema";

export default function Communities() {
  const [filterType, setFilterType] = useState<string>("all");
  const currentUserId = 1; // Mock current user

  // Fetch all communities
  const { data: communities = [], isLoading } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
  });

  // Fetch user's communities
  const { data: userCommunities = [] } = useQuery<Community[]>({
    queryKey: ["/api/users", currentUserId, "communities"],
  });

  // Filter communities based on selected type
  const filteredCommunities = communities.filter(community => {
    if (filterType === "all") return true;
    if (filterType === "joined") return userCommunities.some(uc => uc.id === community.id);
    if (filterType === "available") return !userCommunities.some(uc => uc.id === community.id);
    return community.mediaType === filterType;
  });

  const mediaTypes = [
    { value: "all", label: "All Communities" },
    { value: "joined", label: "My Communities" },
    { value: "available", label: "Available" },
    { value: "song", label: "Music" },
    { value: "book", label: "Books" },
    { value: "movie", label: "Movies" },
    { value: "show", label: "TV Shows" },
    { value: "game", label: "Games" },
    { value: "art", label: "Art" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Communities</h1>
            <p className="text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
              Join communities focused on specific stories and media types. Share your passion with like-minded people.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-neutral-500" />
              {mediaTypes.map((type) => (
                <Button
                  key={type.value}
                  size="sm"
                  variant={filterType === type.value ? "default" : "outline"}
                  onClick={() => setFilterType(type.value)}
                  className={filterType === type.value ? "bg-secondary hover:bg-secondary/90 text-white" : ""}
                >
                  {type.label}
                </Button>
              ))}
            </div>
            
            <CreateCommunityDialog currentUserId={currentUserId} />
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-neutral-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-primary">{communities.length}</h3>
                <p className="text-neutral-500">Total Communities</p>
              </div>
              <Users className="h-8 w-8 text-secondary" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-neutral-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-primary">{userCommunities.length}</h3>
                <p className="text-neutral-500">Joined Communities</p>
              </div>
              <Badge className="bg-green-100 text-green-800 border-0">
                Active
              </Badge>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-neutral-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-primary">
                  {communities.reduce((sum, c) => sum + c.memberCount, 0)}
                </h3>
                <p className="text-neutral-500">Total Members</p>
              </div>
              <div className="text-accent">
                <Users className="h-8 w-8" />
              </div>
            </div>
          </div>
        </section>

        {/* Communities Grid */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                {filterType === "all" ? "All Communities" : 
                 filterType === "joined" ? "Your Communities" :
                 filterType === "available" ? "Available to Join" :
                 `${mediaTypes.find(t => t.value === filterType)?.label} Communities`}
              </h2>
              <p className="text-neutral-500">
                {filteredCommunities.length} communities found
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
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
          ) : filteredCommunities.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-medium text-primary mb-2">
                  {filterType === "joined" ? "No communities joined yet" : "No communities found"}
                </h3>
                <p className="text-neutral-500 mb-6">
                  {filterType === "joined" 
                    ? "Start by joining communities that match your interests or create your own."
                    : "Be the first to create a community for this category."
                  }
                </p>
                <CreateCommunityDialog currentUserId={currentUserId} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  currentUserId={currentUserId}
                  isJoined={userCommunities.some(uc => uc.id === community.id)}
                />
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}