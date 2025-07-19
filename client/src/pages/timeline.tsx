import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Clock, 
  Plus, 
  Minus, 
  ArrowUpDown, 
  Edit, 
  Music, 
  Book, 
  Film, 
  Tv, 
  Youtube, 
  Gamepad2, 
  Palette 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";
import type { TimelineEntry, MediaItem } from "@shared/schema";

const mediaTypeIcons = {
  song: Music,
  book: Book,
  movie: Film,
  show: Tv,
  youtube: Youtube,
  game: Gamepad2,
  art: Palette,
};

const actionIcons = {
  added: Plus,
  removed: Minus,
  moved: ArrowUpDown,
  updated: Edit,
};

const actionColors = {
  added: "bg-green-100 text-green-800 border-green-200",
  removed: "bg-red-100 text-red-800 border-red-200",
  moved: "bg-blue-100 text-blue-800 border-blue-200",
  updated: "bg-purple-100 text-purple-800 border-purple-200",
};

export default function Timeline() {
  const currentUserId = 1; // Mock current user

  // Fetch user's timeline
  const { data: timelineEntries = [], isLoading } = useQuery<(TimelineEntry & { mediaItem?: MediaItem })[]>({
    queryKey: ["/api/users", currentUserId, "timeline"],
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTimelineAction = (entry: TimelineEntry) => {
    const { action, oldPosition, newPosition } = entry;
    
    switch (action) {
      case "added":
        return `Added to position #${newPosition}`;
      case "removed":
        return "Removed from list";
      case "moved":
        return `Moved from #${oldPosition} to #${newPosition}`;
      case "updated":
        return "Updated details";
      default:
        return action;
    }
  };

  const TimelineItem = ({ entry }: { entry: TimelineEntry & { mediaItem?: MediaItem } }) => {
    const ActionIcon = actionIcons[entry.action as keyof typeof actionIcons] || Edit;
    const MediaIcon = entry.mediaItem 
      ? mediaTypeIcons[entry.mediaItem.mediaType as keyof typeof mediaTypeIcons] 
      : Music;

    return (
      <Card className="mb-6 border border-neutral-200 dark:border-gray-700 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            
            {/* Timeline dot and line */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <ActionIcon className="h-5 w-5 text-white" />
              </div>
              <div className="w-0.5 h-8 bg-neutral-200 dark:bg-gray-600 mt-2"></div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline" 
                    className={`${actionColors[entry.action as keyof typeof actionColors] || 'bg-gray-100 text-gray-800'} border font-medium`}
                  >
                    {formatTimelineAction(entry)}
                  </Badge>
                  {entry.createdAt && (
                    <span className="text-sm text-neutral-500">
                      {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                    </span>
                  )}
                </div>
              </div>

              {/* Media item details */}
              {entry.mediaItem && (
                <div className="bg-neutral-50 dark:bg-gray-800 rounded-lg p-4 mb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center">
                      <MediaIcon className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary">{entry.mediaItem.title}</h4>
                      {entry.mediaItem.creator && (
                        <p className="text-sm text-neutral-500">{entry.mediaItem.creator}</p>
                      )}
                    </div>
                  </div>
                  
                  {entry.mediaItem.story && (
                    <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">
                      {entry.mediaItem.story}
                    </p>
                  )}
                </div>
              )}

              {/* Details and reason */}
              <div className="space-y-2">
                <p className="text-sm text-neutral-600">{entry.details}</p>
                
                {entry.changeReason && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Why this change was made:
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-200 italic">
                          "{entry.changeReason}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Your Timeline</h1>
            <p className="text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
              Track all the changes you've made to your top 10 list and remember why each adjustment mattered to you.
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 text-center border border-neutral-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-primary mb-2">
                {timelineEntries.length}
              </div>
              <div className="text-sm text-neutral-500">Total Changes</div>
            </Card>
            
            <Card className="p-6 text-center border border-neutral-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-primary mb-2">
                {timelineEntries.filter(e => e.action === 'added').length}
              </div>
              <div className="text-sm text-neutral-500">Items Added</div>
            </Card>
            
            <Card className="p-6 text-center border border-neutral-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-primary mb-2">
                {timelineEntries.filter(e => e.action === 'moved').length}
              </div>
              <div className="text-sm text-neutral-500">Position Changes</div>
            </Card>
          </div>
        </section>

        {/* Timeline Content */}
        <section>
          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-3">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : timelineEntries.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Clock className="h-12 w-12 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                No timeline entries yet
              </h3>
              <p className="text-neutral-500 mb-6 max-w-md mx-auto">
                Start making changes to your top 10 list to see your journey unfold here. Every addition, removal, and reordering will be tracked.
              </p>
              <Button asChild className="bg-secondary hover:bg-secondary/90 text-white">
                <Link href="/profile">
                  <Plus className="h-4 w-4 mr-2" />
                  Start Building Your List
                </Link>
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-primary">Your Journey</h2>
                <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                  {timelineEntries.length} changes made
                </Badge>
              </div>
              
              <div className="relative">
                {timelineEntries.map((entry, index) => (
                  <div key={entry.id} className="relative">
                    <TimelineItem entry={entry} />
                    {index === timelineEntries.length - 1 && (
                      <div className="flex items-center gap-4 ml-4 pb-6">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-sm text-neutral-500 italic">
                          Your Reclist journey begins here
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}