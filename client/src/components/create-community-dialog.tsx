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
import { insertCommunitySchema } from "@shared/schema";
import { z } from "zod";

const mediaTypes = [
  { value: "", label: "General (All Media Types)" },
  { value: "song", label: "Music" },
  { value: "book", label: "Books" },
  { value: "movie", label: "Movies" },
  { value: "show", label: "TV Shows" },
  { value: "youtube", label: "YouTube Videos" },
  { value: "game", label: "Video Games" },
  { value: "art", label: "Art" },
];

const communityColors = [
  "#6366F1", // Purple (default)
  "#22C55E", // Green
  "#3B82F6", // Blue
  "#F59E0B", // Orange
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#10B981", // Emerald
];

const formSchema = insertCommunitySchema.extend({
  description: z.string().min(10, "Description must be at least 10 characters").max(200, "Description must be less than 200 characters"),
});

interface CreateCommunityDialogProps {
  currentUserId: number;
}

export function CreateCommunityDialog({ currentUserId }: CreateCommunityDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      mediaType: "",
      creatorId: currentUserId,
      color: communityColors[0],
    },
  });

  const createCommunityMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return apiRequest("POST", "/api/communities", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/communities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUserId, "communities"] });
      toast({
        title: "Success",
        description: "Community created successfully!",
      });
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create community",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createCommunityMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-secondary hover:bg-secondary/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Community
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Community</DialogTitle>
          <DialogDescription>
            Start a community focused on specific stories or media types. Connect with people who share your passion.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Community Name</Label>
            <Input
              {...form.register("name")}
              placeholder="Enter a catchy name for your community"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mediaType">Focus Area</Label>
              <Select onValueChange={(value) => form.setValue("mediaType", value || undefined)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select focus" />
                </SelectTrigger>
                <SelectContent>
                  {mediaTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Community Color</Label>
              <div className="flex gap-2 flex-wrap">
                {communityColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      form.watch("color") === color ? "border-gray-400" : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => form.setValue("color", color)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              {...form.register("description")}
              placeholder="Describe what your community is about and what kind of stories you want to explore..."
              className="min-h-[100px] resize-none"
              maxLength={200}
            />
            <div className="flex justify-between text-xs text-neutral-500">
              <span>Share your community's vision</span>
              <span>{form.watch("description")?.length || 0}/200</span>
            </div>
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
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
              disabled={createCommunityMutation.isPending}
              className="bg-secondary hover:bg-secondary/90"
            >
              {createCommunityMutation.isPending ? "Creating..." : "Create Community"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}