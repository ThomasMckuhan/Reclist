import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMediaItemSchema } from "@shared/schema";
import { z } from "zod";

const mediaTypes = [
  { value: "song", label: "Song" },
  { value: "book", label: "Book" },
  { value: "movie", label: "Movie" },
  { value: "show", label: "TV Show" },
  { value: "youtube", label: "YouTube Video" },
  { value: "game", label: "Video Game" },
  { value: "art", label: "Art Piece" },
];

const formSchema = insertMediaItemSchema.extend({
  story: z.string().min(10, "Story must be at least 10 characters").max(200, "Story must be less than 200 characters"),
});

interface AddMediaDialogProps {
  userId: number;
  existingPositions: number[];
}

export function AddMediaDialog({ userId, existingPositions }: AddMediaDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const availablePositions = Array.from({ length: 10 }, (_, i) => i + 1)
    .filter(pos => !existingPositions.includes(pos));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId,
      title: "",
      creator: "",
      mediaType: "",
      story: "",
      position: availablePositions[0] || 1,
    },
  });

  const addMediaMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return apiRequest("POST", "/api/media", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "media"] });
      toast({
        title: "Success",
        description: "Media item added successfully!",
      });
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add media item",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    addMediaMutation.mutate(data);
  };

  if (existingPositions.length >= 10) {
    return (
      <Button disabled className="bg-accent hover:bg-accent/90 text-white">
        <Plus className="h-4 w-4 mr-2" />
        List Full (10/10)
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent hover:bg-accent/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Media Item</DialogTitle>
          <DialogDescription>
            Add a new item to your Reclist with a meaningful story behind your choice.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mediaType">Media Type</Label>
              <Select onValueChange={(value) => form.setValue("mediaType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {mediaTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.mediaType && (
                <p className="text-sm text-red-500">{form.formState.errors.mediaType.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select 
                value={form.watch("position")?.toString()} 
                onValueChange={(value) => form.setValue("position", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availablePositions.map((pos) => (
                    <SelectItem key={pos} value={pos.toString()}>
                      #{pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              {...form.register("title")}
              placeholder="Enter the title"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="creator">Creator/Artist (optional)</Label>
            <Input
              {...form.register("creator")}
              placeholder="Enter artist, author, director, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="story">Your Story</Label>
            <Textarea
              {...form.register("story")}
              placeholder="Tell us why this piece is meaningful to you..."
              className="min-h-[100px] resize-none"
              maxLength={200}
            />
            <div className="flex justify-between text-xs text-neutral-500">
              <span>Share the story behind your choice</span>
              <span>{form.watch("story")?.length || 0}/200</span>
            </div>
            {form.formState.errors.story && (
              <p className="text-sm text-red-500">{form.formState.errors.story.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={addMediaMutation.isPending}
              className="bg-secondary hover:bg-secondary/90"
            >
              {addMediaMutation.isPending ? "Adding..." : "Add to List"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
