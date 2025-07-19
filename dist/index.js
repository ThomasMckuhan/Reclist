// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  mediaItems;
  comments;
  connections;
  likes;
  communities;
  communityMembers;
  timelineEntries;
  currentUserId;
  currentMediaItemId;
  currentCommentId;
  currentConnectionId;
  currentLikeId;
  currentCommunityId;
  currentCommunityMemberId;
  currentTimelineEntryId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.mediaItems = /* @__PURE__ */ new Map();
    this.comments = /* @__PURE__ */ new Map();
    this.connections = /* @__PURE__ */ new Map();
    this.likes = /* @__PURE__ */ new Map();
    this.communities = /* @__PURE__ */ new Map();
    this.communityMembers = /* @__PURE__ */ new Map();
    this.timelineEntries = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentMediaItemId = 1;
    this.currentCommentId = 1;
    this.currentConnectionId = 1;
    this.currentLikeId = 1;
    this.currentCommunityId = 1;
    this.currentCommunityMemberId = 1;
    this.currentTimelineEntryId = 1;
    this.seedData();
  }
  seedData() {
    const user1 = {
      id: this.currentUserId++,
      username: "johnsmith",
      email: "john@example.com",
      displayName: "John Smith",
      bio: "Film enthusiast and music lover seeking deep conversations about art that moves us.",
      location: "San Francisco, CA",
      avatarColor: "#6366F1"
    };
    const user2 = {
      id: this.currentUserId++,
      username: "alexmartinez",
      email: "alex@example.com",
      displayName: "Alex Martinez",
      bio: "Collector of stories and seeker of hidden gems in every medium.",
      location: "New York, NY",
      avatarColor: "#3B82F6"
    };
    const user3 = {
      id: this.currentUserId++,
      username: "sarahchen",
      email: "sarah@example.com",
      displayName: "Sarah Chen",
      bio: "Bookworm and indie film collector. Always looking for hidden gems and meaningful stories.",
      location: "Los Angeles, CA",
      avatarColor: "#EC4899"
    };
    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);
    this.users.set(user3.id, user3);
    const mediaItems2 = [
      {
        id: this.currentMediaItemId++,
        userId: user1.id,
        title: "Bohemian Rhapsody",
        creator: "Queen",
        mediaType: "song",
        story: "This song represents the perfect blend of opera and rock that changed my perspective on music boundaries. The emotional journey it takes you on is unmatched.",
        position: 1,
        likeCount: 24,
        commentCount: 12
      },
      {
        id: this.currentMediaItemId++,
        userId: user1.id,
        title: "The Midnight Library",
        creator: "Matt Haig",
        mediaType: "book",
        story: "A beautiful exploration of life's infinite possibilities. This book helped me through a difficult period by showing how every choice creates a new universe of potential.",
        position: 2,
        likeCount: 18,
        commentCount: 8
      },
      {
        id: this.currentMediaItemId++,
        userId: user1.id,
        title: "Spirited Away",
        creator: "Hayao Miyazaki",
        mediaType: "movie",
        story: "The perfect blend of imagination and emotion. Miyazaki's masterpiece taught me that growing up doesn't mean losing your sense of wonder and magic.",
        position: 3,
        likeCount: 31,
        commentCount: 15
      },
      {
        id: this.currentMediaItemId++,
        userId: user2.id,
        title: "Spirited Away",
        creator: "Hayao Miyazaki",
        mediaType: "movie",
        story: "This film represents everything I love about storytelling - the way it seamlessly blends reality with fantasy to create something truly magical.",
        position: 1,
        likeCount: 22,
        commentCount: 9
      },
      {
        id: this.currentMediaItemId++,
        userId: user2.id,
        title: "Breaking Bad",
        creator: "Vince Gilligan",
        mediaType: "show",
        story: "A masterclass in character development and moral complexity. Watching Walter's transformation was both fascinating and terrifying.",
        position: 2,
        likeCount: 28,
        commentCount: 14
      },
      {
        id: this.currentMediaItemId++,
        userId: user3.id,
        title: "The Midnight Library",
        creator: "Matt Haig",
        mediaType: "book",
        story: "This book came to me at exactly the right moment. Haig's exploration of regret and possibility felt like a personal conversation about life's what-ifs.",
        position: 1,
        likeCount: 16,
        commentCount: 7
      }
    ];
    mediaItems2.forEach((item) => {
      this.mediaItems.set(item.id, item);
    });
    const sampleCommunities = [
      {
        id: this.currentCommunityId++,
        name: "Studio Ghibli Fans",
        description: "A community for those who love the magical worlds of Studio Ghibli films",
        mediaType: "movie",
        creatorId: user1.id,
        memberCount: 3,
        color: "#22C55E"
      },
      {
        id: this.currentCommunityId++,
        name: "Indie Book Club",
        description: "Discover hidden literary gems and discuss meaningful stories that changed our perspective",
        mediaType: "book",
        creatorId: user2.id,
        memberCount: 2,
        color: "#8B5CF6"
      },
      {
        id: this.currentCommunityId++,
        name: "Music That Moves Us",
        description: "Share songs that have deep emotional impact and tell the stories behind why they matter",
        mediaType: "song",
        creatorId: user3.id,
        memberCount: 1,
        color: "#F59E0B"
      }
    ];
    sampleCommunities.forEach((community) => {
      this.communities.set(community.id, community);
    });
    const memberships = [
      // Studio Ghibli Fans
      { id: this.currentCommunityMemberId++, communityId: 1, userId: user1.id, joinedAt: /* @__PURE__ */ new Date() },
      { id: this.currentCommunityMemberId++, communityId: 1, userId: user2.id, joinedAt: /* @__PURE__ */ new Date() },
      { id: this.currentCommunityMemberId++, communityId: 1, userId: user3.id, joinedAt: /* @__PURE__ */ new Date() },
      // Indie Book Club
      { id: this.currentCommunityMemberId++, communityId: 2, userId: user2.id, joinedAt: /* @__PURE__ */ new Date() },
      { id: this.currentCommunityMemberId++, communityId: 2, userId: user3.id, joinedAt: /* @__PURE__ */ new Date() },
      // Music That Moves Us
      { id: this.currentCommunityMemberId++, communityId: 3, userId: user3.id, joinedAt: /* @__PURE__ */ new Date() }
    ];
    memberships.forEach((membership) => {
      this.communityMembers.set(membership.id, membership);
    });
    const sampleTimelineEntries = [
      {
        id: this.currentTimelineEntryId++,
        userId: user1.id,
        mediaItemId: 1,
        // Bohemian Rhapsody
        action: "added",
        details: "Added 'Bohemian Rhapsody' by Queen to position #1",
        changeReason: "This song represents everything I love about music - the way it builds from a gentle ballad to an operatic masterpiece. It reminds me of road trips with my dad when I was younger.",
        oldPosition: null,
        newPosition: 1,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3)
        // 7 days ago
      },
      {
        id: this.currentTimelineEntryId++,
        userId: user1.id,
        mediaItemId: 2,
        // The Dark Knight
        action: "added",
        details: "Added 'The Dark Knight' by Christopher Nolan to position #2",
        changeReason: "Heath Ledger's performance as the Joker completely changed how I view cinema. This movie proves that superhero films can be profound philosophical explorations.",
        oldPosition: null,
        newPosition: 2,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1e3)
        // 5 days ago
      },
      {
        id: this.currentTimelineEntryId++,
        userId: user1.id,
        mediaItemId: 1,
        // Bohemian Rhapsody
        action: "moved",
        details: "Moved 'Bohemian Rhapsody' from position #1 to position #2",
        changeReason: "After really thinking about it, I realized The Dark Knight has had a more lasting impact on me. Both are incredible, but Batman changed how I see storytelling.",
        oldPosition: 1,
        newPosition: 2,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3)
        // 3 days ago
      },
      {
        id: this.currentTimelineEntryId++,
        userId: user1.id,
        mediaItemId: 2,
        // The Dark Knight
        action: "moved",
        details: "Moved 'The Dark Knight' from position #2 to position #1",
        changeReason: "After really thinking about it, I realized The Dark Knight has had a more lasting impact on me. Both are incredible, but Batman changed how I see storytelling.",
        oldPosition: 2,
        newPosition: 1,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3)
        // 3 days ago
      }
    ];
    sampleTimelineEntries.forEach((entry) => {
      this.timelineEntries.set(entry.id, entry);
    });
  }
  // Users
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async getAllUsers() {
    return Array.from(this.users.values());
  }
  // Media Items
  async getMediaItem(id) {
    return this.mediaItems.get(id);
  }
  async getMediaItemsByUserId(userId) {
    return Array.from(this.mediaItems.values()).filter((item) => item.userId === userId).sort((a, b) => a.position - b.position);
  }
  async createMediaItem(insertMediaItem) {
    const id = this.currentMediaItemId++;
    const mediaItem = {
      ...insertMediaItem,
      id,
      likeCount: 0,
      commentCount: 0
    };
    this.mediaItems.set(id, mediaItem);
    return mediaItem;
  }
  async updateMediaItem(id, updates) {
    const existing = this.mediaItems.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...updates };
    this.mediaItems.set(id, updated);
    return updated;
  }
  async deleteMediaItem(id) {
    return this.mediaItems.delete(id);
  }
  async getAllMediaItems() {
    return Array.from(this.mediaItems.values());
  }
  // Comments
  async getComment(id) {
    return this.comments.get(id);
  }
  async getCommentsByMediaItemId(mediaItemId) {
    return Array.from(this.comments.values()).filter((comment) => comment.mediaItemId === mediaItemId);
  }
  async createComment(insertComment) {
    const id = this.currentCommentId++;
    const comment = {
      ...insertComment,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.comments.set(id, comment);
    const mediaItem = this.mediaItems.get(insertComment.mediaItemId);
    if (mediaItem) {
      mediaItem.commentCount++;
      this.mediaItems.set(mediaItem.id, mediaItem);
    }
    return comment;
  }
  async deleteComment(id) {
    const comment = this.comments.get(id);
    if (comment) {
      const mediaItem = this.mediaItems.get(comment.mediaItemId);
      if (mediaItem && mediaItem.commentCount > 0) {
        mediaItem.commentCount--;
        this.mediaItems.set(mediaItem.id, mediaItem);
      }
    }
    return this.comments.delete(id);
  }
  // Connections
  async getConnection(id) {
    return this.connections.get(id);
  }
  async getConnectionsByUserId(userId) {
    return Array.from(this.connections.values()).filter(
      (conn) => conn.userId === userId || conn.connectedUserId === userId
    );
  }
  async createConnection(insertConnection) {
    const id = this.currentConnectionId++;
    const connection = {
      ...insertConnection,
      id,
      status: "pending"
    };
    this.connections.set(id, connection);
    return connection;
  }
  async updateConnection(id, updates) {
    const existing = this.connections.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...updates };
    this.connections.set(id, updated);
    return updated;
  }
  // Likes
  async getLike(userId, mediaItemId) {
    return Array.from(this.likes.values()).find(
      (like) => like.userId === userId && like.mediaItemId === mediaItemId
    );
  }
  async getLikesByMediaItemId(mediaItemId) {
    return Array.from(this.likes.values()).filter((like) => like.mediaItemId === mediaItemId);
  }
  async createLike(insertLike) {
    const id = this.currentLikeId++;
    const like = { ...insertLike, id };
    this.likes.set(id, like);
    const mediaItem = this.mediaItems.get(insertLike.mediaItemId);
    if (mediaItem) {
      mediaItem.likeCount++;
      this.mediaItems.set(mediaItem.id, mediaItem);
    }
    return like;
  }
  async deleteLike(userId, mediaItemId) {
    const like = Array.from(this.likes.values()).find(
      (like2) => like2.userId === userId && like2.mediaItemId === mediaItemId
    );
    if (like) {
      const mediaItem = this.mediaItems.get(mediaItemId);
      if (mediaItem && mediaItem.likeCount > 0) {
        mediaItem.likeCount--;
        this.mediaItems.set(mediaItem.id, mediaItem);
      }
      this.likes.delete(like.id);
      return true;
    }
    return false;
  }
  // Discovery
  async findUsersWithSharedMedia(userId, minMatches = 3) {
    const userMediaItems = await this.getMediaItemsByUserId(userId);
    const userTitles = userMediaItems.map((item) => item.title.toLowerCase());
    const allUsers = await this.getAllUsers();
    const results = [];
    for (const user of allUsers) {
      if (user.id === userId) continue;
      const otherUserMediaItems = await this.getMediaItemsByUserId(user.id);
      const sharedItems = [];
      for (const otherItem of otherUserMediaItems) {
        if (userTitles.includes(otherItem.title.toLowerCase())) {
          sharedItems.push(otherItem);
        }
      }
      if (sharedItems.length >= minMatches) {
        results.push({
          ...user,
          matchCount: sharedItems.length,
          sharedItems
        });
      }
    }
    return results.sort((a, b) => b.matchCount - a.matchCount);
  }
  // Communities
  async getCommunity(id) {
    return this.communities.get(id);
  }
  async getAllCommunities() {
    return Array.from(this.communities.values());
  }
  async getCommunitiesByUserId(userId) {
    const userMemberships = Array.from(this.communityMembers.values()).filter((member) => member.userId === userId);
    const communities2 = [];
    for (const membership of userMemberships) {
      const community = this.communities.get(membership.communityId);
      if (community) {
        communities2.push(community);
      }
    }
    return communities2;
  }
  async createCommunity(insertCommunity) {
    const id = this.currentCommunityId++;
    const community = {
      ...insertCommunity,
      id,
      memberCount: 1
    };
    this.communities.set(id, community);
    const membership = {
      id: this.currentCommunityMemberId++,
      communityId: id,
      userId: insertCommunity.creatorId,
      joinedAt: /* @__PURE__ */ new Date()
    };
    this.communityMembers.set(membership.id, membership);
    return community;
  }
  async updateCommunity(id, updates) {
    const existing = this.communities.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...updates };
    this.communities.set(id, updated);
    return updated;
  }
  async deleteCommunity(id) {
    const memberships = Array.from(this.communityMembers.values()).filter((member) => member.communityId === id);
    memberships.forEach((membership) => {
      this.communityMembers.delete(membership.id);
    });
    return this.communities.delete(id);
  }
  // Community Members
  async getCommunityMember(communityId, userId) {
    return Array.from(this.communityMembers.values()).find(
      (member) => member.communityId === communityId && member.userId === userId
    );
  }
  async getCommunityMembers(communityId) {
    const members = Array.from(this.communityMembers.values()).filter((member) => member.communityId === communityId);
    const membersWithUsers = await Promise.all(
      members.map(async (member) => {
        const user = await this.getUser(member.userId);
        return { ...member, user };
      })
    );
    return membersWithUsers;
  }
  async joinCommunity(insertMember) {
    const id = this.currentCommunityMemberId++;
    const member = {
      ...insertMember,
      id,
      joinedAt: /* @__PURE__ */ new Date()
    };
    this.communityMembers.set(id, member);
    const community = this.communities.get(insertMember.communityId);
    if (community) {
      community.memberCount++;
      this.communities.set(community.id, community);
    }
    return member;
  }
  async leaveCommunity(communityId, userId) {
    const member = Array.from(this.communityMembers.values()).find(
      (member2) => member2.communityId === communityId && member2.userId === userId
    );
    if (member) {
      const community = this.communities.get(communityId);
      if (community && community.memberCount > 0) {
        community.memberCount--;
        this.communities.set(community.id, community);
      }
      this.communityMembers.delete(member.id);
      return true;
    }
    return false;
  }
  // Timeline methods
  async getTimelineEntry(id) {
    return this.timelineEntries.get(id);
  }
  async getTimelineEntriesByUserId(userId) {
    const entries = Array.from(this.timelineEntries.values()).filter((entry) => entry.userId === userId).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    const entriesWithMedia = await Promise.all(
      entries.map(async (entry) => {
        const mediaItem = entry.mediaItemId ? await this.getMediaItem(entry.mediaItemId) : void 0;
        return { ...entry, mediaItem };
      })
    );
    return entriesWithMedia;
  }
  async createTimelineEntry(insertEntry) {
    const id = this.currentTimelineEntryId++;
    const entry = {
      ...insertEntry,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.timelineEntries.set(id, entry);
    return entry;
  }
  async deleteTimelineEntry(id) {
    return this.timelineEntries.delete(id);
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  location: text("location"),
  avatarColor: text("avatar_color").notNull().default("#6366F1")
});
var mediaItems = pgTable("media_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  creator: text("creator"),
  // artist, author, director, etc.
  mediaType: text("media_type").notNull(),
  // song, book, movie, show, youtube, game, art
  story: text("story").notNull(),
  // user's explanation/story
  position: integer("position").notNull(),
  // 1-10 ranking
  likeCount: integer("like_count").notNull().default(0),
  commentCount: integer("comment_count").notNull().default(0)
});
var comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mediaItemId: integer("media_item_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var connections = pgTable("connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  connectedUserId: integer("connected_user_id").notNull(),
  status: text("status").notNull().default("pending")
  // pending, accepted
});
var likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mediaItemId: integer("media_item_id").notNull()
});
var communities = pgTable("communities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  mediaType: text("media_type"),
  // optional: focus on specific media type
  creatorId: integer("creator_id").notNull(),
  memberCount: integer("member_count").notNull().default(1),
  color: text("color").notNull().default("#6366F1")
});
var communityMembers = pgTable("community_members", {
  id: serial("id").primaryKey(),
  communityId: integer("community_id").notNull(),
  userId: integer("user_id").notNull(),
  joinedAt: timestamp("joined_at").defaultNow()
});
var timelineEntries = pgTable("timeline_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mediaItemId: integer("media_item_id"),
  action: text("action").notNull(),
  // "added", "removed", "moved", "updated"
  details: text("details").notNull(),
  // description of what changed
  changeReason: text("change_reason"),
  // user's comment about why they made the change
  oldPosition: integer("old_position"),
  newPosition: integer("new_position"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true
});
var insertMediaItemSchema = createInsertSchema(mediaItems).omit({
  id: true,
  likeCount: true,
  commentCount: true
});
var insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true
});
var insertConnectionSchema = createInsertSchema(connections).omit({
  id: true,
  status: true
});
var insertLikeSchema = createInsertSchema(likes).omit({
  id: true
});
var insertCommunitySchema = createInsertSchema(communities).omit({
  id: true,
  memberCount: true
});
var insertCommunityMemberSchema = createInsertSchema(communityMembers).omit({
  id: true,
  joinedAt: true
});
var insertTimelineEntrySchema = createInsertSchema(timelineEntries).omit({
  id: true,
  createdAt: true
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/users", async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      res.json(users2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
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
  app2.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
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
  app2.get("/api/users/:userId/media", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const mediaItems2 = await storage.getMediaItemsByUserId(userId);
      res.json(mediaItems2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media items" });
    }
  });
  app2.post("/api/media", async (req, res) => {
    try {
      const mediaData = insertMediaItemSchema.parse(req.body);
      const user = await storage.getUser(mediaData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const existingItems = await storage.getMediaItemsByUserId(mediaData.userId);
      if (existingItems.length >= 10) {
        return res.status(400).json({ message: "Maximum of 10 media items allowed" });
      }
      const positionTaken = existingItems.some((item) => item.position === mediaData.position);
      if (positionTaken) {
        return res.status(400).json({ message: "Position already taken" });
      }
      const mediaItem = await storage.createMediaItem(mediaData);
      res.status(201).json(mediaItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid media item data" });
    }
  });
  app2.put("/api/media/:id", async (req, res) => {
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
  app2.delete("/api/media/:id", async (req, res) => {
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
  app2.get("/api/media/:mediaItemId/comments", async (req, res) => {
    try {
      const mediaItemId = parseInt(req.params.mediaItemId);
      const comments2 = await storage.getCommentsByMediaItemId(mediaItemId);
      const commentsWithUsers = await Promise.all(
        comments2.map(async (comment) => {
          const user = await storage.getUser(comment.userId);
          return { ...comment, user };
        })
      );
      res.json(commentsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });
  app2.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
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
  app2.get("/api/users/:userId/connections", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const connections2 = await storage.getConnectionsByUserId(userId);
      res.json(connections2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch connections" });
    }
  });
  app2.post("/api/connections", async (req, res) => {
    try {
      const connectionData = insertConnectionSchema.parse(req.body);
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
  app2.post("/api/likes", async (req, res) => {
    try {
      const likeData = insertLikeSchema.parse(req.body);
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
  app2.delete("/api/likes/:userId/:mediaItemId", async (req, res) => {
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
  app2.get("/api/users/:userId/discover", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const minMatches = parseInt(req.query.minMatches) || 3;
      const matches = await storage.findUsersWithSharedMedia(userId, minMatches);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to find matches" });
    }
  });
  app2.get("/api/trending", async (req, res) => {
    try {
      const allMediaItems = await storage.getAllMediaItems();
      const trending = allMediaItems.map((item) => ({
        ...item,
        engagementScore: item.likeCount + item.commentCount * 2
      })).sort((a, b) => b.engagementScore - a.engagementScore).slice(0, 8);
      res.json(trending);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending items" });
    }
  });
  app2.get("/api/communities", async (req, res) => {
    try {
      const communities2 = await storage.getAllCommunities();
      res.json(communities2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch communities" });
    }
  });
  app2.get("/api/communities/:id", async (req, res) => {
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
  app2.get("/api/users/:userId/communities", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const communities2 = await storage.getCommunitiesByUserId(userId);
      res.json(communities2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user communities" });
    }
  });
  app2.post("/api/communities", async (req, res) => {
    try {
      const communityData = insertCommunitySchema.parse(req.body);
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
  app2.get("/api/communities/:id/members", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const members = await storage.getCommunityMembers(id);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch community members" });
    }
  });
  app2.post("/api/communities/:id/join", async (req, res) => {
    try {
      const communityId = parseInt(req.params.id);
      const { userId } = req.body;
      const user = await storage.getUser(userId);
      const community = await storage.getCommunity(communityId);
      if (!user || !community) {
        return res.status(404).json({ message: "User or community not found" });
      }
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
  app2.delete("/api/communities/:id/leave", async (req, res) => {
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
  app2.get("/api/users/:userId/timeline", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const timelineEntries2 = await storage.getTimelineEntriesByUserId(userId);
      res.json(timelineEntries2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch timeline" });
    }
  });
  app2.post("/api/timeline", async (req, res) => {
    try {
      const timelineData = insertTimelineEntrySchema.parse(req.body);
      const entry = await storage.createTimelineEntry(timelineData);
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid timeline data" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
