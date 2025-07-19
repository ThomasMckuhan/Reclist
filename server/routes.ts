import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertMediaItemSchema, 
  insertCommentSchema, 
  insertConnectionSchema,
  insertLikeSchema,
  insertCommunitySchema,
  insertCommunityMemberSchema,
  insertTimelineEntrySchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Media Items
  app.get("/api/users/:userId/media", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const mediaItems = await storage.getMediaItemsByUserId(userId);
      res.json(mediaItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media items" });
    }
  });

  app.post("/api/media", async (req, res) => {
    try {
      const mediaData = insertMediaItemSchema.parse(req.body);
      
      // Check if user exists
      const user = await storage.getUser(mediaData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user already has 10 items
      const existingItems = await storage.getMediaItemsByUserId(mediaData.userId);
      if (existingItems.length >= 10) {
        return res.status(400).json({ message: "Maximum of 10 media items allowed" });
      }
      
      // Check if position is already taken
      const positionTaken = existingItems.some(item => item.position === mediaData.position);
      if (positionTaken) {
        return res.status(400).json({ message: "Position already taken" });
      }
      
      const mediaItem = await storage.createMediaItem(mediaData);
      res.status(201).json(mediaItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid media item data" });
    }
  });

  app.put("/api/media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const mediaItem = await storage.updateMediaItem(id, updates);
      if (!mediaItem) {
        return res.status(404).json({ message: "Media item not found" });
      }
      
      res.json(mediaItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update media item" });
    }
  });

  app.delete("/api/media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMediaItem(id);
      if (!success) {
        return res.status(404).json({ message: "Media item not found" });
      }
      res.json({ message: "Media item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete media item" });
    }
  });

  // Comments
  app.get("/api/media/:mediaItemId/comments", async (req, res) => {
    try {
      const mediaItemId = parseInt(req.params.mediaItemId);
      const comments = await storage.getCommentsByMediaItemId(mediaItemId);
      
      // Get user info for each comment
      const commentsWithUsers = await Promise.all(
        comments.map(async (comment) => {
          const user = await storage.getUser(comment.userId);
          return { ...comment, user };
        })
      );
      
      res.json(commentsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      
      // Check if user and media item exist
      const user = await storage.getUser(commentData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const mediaItem = await storage.getMediaItem(commentData.mediaItemId);
      if (!mediaItem) {
        return res.status(404).json({ message: "Media item not found" });
      }
      
      const comment = await storage.createComment(commentData);
      res.status(201).json({ ...comment, user });
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data" });
    }
  });

  // Connections
  app.get("/api/users/:userId/connections", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const connections = await storage.getConnectionsByUserId(userId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch connections" });
    }
  });

  app.post("/api/connections", async (req, res) => {
    try {
      const connectionData = insertConnectionSchema.parse(req.body);
      
      // Check if users exist
      const user = await storage.getUser(connectionData.userId);
      const connectedUser = await storage.getUser(connectionData.connectedUserId);
      if (!user || !connectedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const connection = await storage.createConnection(connectionData);
      res.status(201).json(connection);
    } catch (error) {
      res.status(400).json({ message: "Invalid connection data" });
    }
  });

  // Likes
  app.post("/api/likes", async (req, res) => {
    try {
      const likeData = insertLikeSchema.parse(req.body);
      
      // Check if already liked
      const existingLike = await storage.getLike(likeData.userId, likeData.mediaItemId);
      if (existingLike) {
        return res.status(400).json({ message: "Already liked" });
      }
      
      const like = await storage.createLike(likeData);
      res.status(201).json(like);
    } catch (error) {
      res.status(400).json({ message: "Invalid like data" });
    }
  });

  app.delete("/api/likes/:userId/:mediaItemId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const mediaItemId = parseInt(req.params.mediaItemId);
      
      const success = await storage.deleteLike(userId, mediaItemId);
      if (!success) {
        return res.status(404).json({ message: "Like not found" });
      }
      
      res.json({ message: "Like removed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove like" });
    }
  });

  // Discovery
  app.get("/api/users/:userId/discover", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const minMatches = parseInt(req.query.minMatches as string) || 3;
      
      const matches = await storage.findUsersWithSharedMedia(userId, minMatches);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to find matches" });
    }
  });

  // Trending (mock implementation)
  app.get("/api/trending", async (req, res) => {
    try {
      const allMediaItems = await storage.getAllMediaItems();
      // Sort by engagement (likes + comments) for trending
      const trending = allMediaItems
        .map(item => ({
          ...item,
          engagementScore: item.likeCount + item.commentCount * 2
        }))
        .sort((a, b) => b.engagementScore - a.engagementScore)
        .slice(0, 8);
      
      res.json(trending);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending items" });
    }
  });

  // Communities
  app.get("/api/communities", async (req, res) => {
    try {
      const communities = await storage.getAllCommunities();
      res.json(communities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch communities" });
    }
  });

  app.get("/api/communities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const community = await storage.getCommunity(id);
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }
      res.json(community);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch community" });
    }
  });

  app.get("/api/users/:userId/communities", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const communities = await storage.getCommunitiesByUserId(userId);
      res.json(communities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user communities" });
    }
  });

  app.post("/api/communities", async (req, res) => {
    try {
      const communityData = insertCommunitySchema.parse(req.body);
      
      // Check if user exists
      const user = await storage.getUser(communityData.creatorId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const community = await storage.createCommunity(communityData);
      res.status(201).json(community);
    } catch (error) {
      res.status(400).json({ message: "Invalid community data" });
    }
  });

  app.get("/api/communities/:id/members", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const members = await storage.getCommunityMembers(id);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch community members" });
    }
  });

  app.post("/api/communities/:id/join", async (req, res) => {
    try {
      const communityId = parseInt(req.params.id);
      const { userId } = req.body;
      
      // Check if user and community exist
      const user = await storage.getUser(userId);
      const community = await storage.getCommunity(communityId);
      if (!user || !community) {
        return res.status(404).json({ message: "User or community not found" });
      }
      
      // Check if already a member
      const existingMember = await storage.getCommunityMember(communityId, userId);
      if (existingMember) {
        return res.status(400).json({ message: "Already a member" });
      }
      
      const member = await storage.joinCommunity({ communityId, userId });
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ message: "Failed to join community" });
    }
  });

  app.delete("/api/communities/:id/leave", async (req, res) => {
    try {
      const communityId = parseInt(req.params.id);
      const { userId } = req.body;
      
      const success = await storage.leaveCommunity(communityId, userId);
      if (!success) {
        return res.status(404).json({ message: "Membership not found" });
      }
      
      res.json({ message: "Left community successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to leave community" });
    }
  });

  // Timeline routes
  app.get("/api/users/:userId/timeline", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const timelineEntries = await storage.getTimelineEntriesByUserId(userId);
      res.json(timelineEntries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch timeline" });
    }
  });

  app.post("/api/timeline", async (req, res) => {
    try {
      const timelineData = insertTimelineEntrySchema.parse(req.body);
      const entry = await storage.createTimelineEntry(timelineData);
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid timeline data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
