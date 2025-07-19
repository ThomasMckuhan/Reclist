import { 
  users, 
  mediaItems, 
  comments, 
  connections, 
  likes,
  communities,
  communityMembers,
  timelineEntries,
  type User, 
  type MediaItem,
  type Comment,
  type Connection,
  type Like,
  type Community,
  type CommunityMember,
  type TimelineEntry,
  type InsertUser, 
  type InsertMediaItem,
  type InsertComment,
  type InsertConnection,
  type InsertLike,
  type InsertCommunity,
  type InsertCommunityMember,
  type InsertTimelineEntry
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Media Items
  getMediaItem(id: number): Promise<MediaItem | undefined>;
  getMediaItemsByUserId(userId: number): Promise<MediaItem[]>;
  createMediaItem(mediaItem: InsertMediaItem): Promise<MediaItem>;
  updateMediaItem(id: number, updates: Partial<MediaItem>): Promise<MediaItem | undefined>;
  deleteMediaItem(id: number): Promise<boolean>;
  getAllMediaItems(): Promise<MediaItem[]>;

  // Comments
  getComment(id: number): Promise<Comment | undefined>;
  getCommentsByMediaItemId(mediaItemId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<boolean>;

  // Connections
  getConnection(id: number): Promise<Connection | undefined>;
  getConnectionsByUserId(userId: number): Promise<Connection[]>;
  createConnection(connection: InsertConnection): Promise<Connection>;
  updateConnection(id: number, updates: Partial<Connection>): Promise<Connection | undefined>;
  
  // Likes
  getLike(userId: number, mediaItemId: number): Promise<Like | undefined>;
  getLikesByMediaItemId(mediaItemId: number): Promise<Like[]>;
  createLike(like: InsertLike): Promise<Like>;
  deleteLike(userId: number, mediaItemId: number): Promise<boolean>;

  // Discovery
  findUsersWithSharedMedia(userId: number, minMatches: number): Promise<(User & { matchCount: number; sharedItems: MediaItem[] })[]>;

  // Communities
  getCommunity(id: number): Promise<Community | undefined>;
  getAllCommunities(): Promise<Community[]>;
  getCommunitiesByUserId(userId: number): Promise<Community[]>;
  createCommunity(community: InsertCommunity): Promise<Community>;
  updateCommunity(id: number, updates: Partial<Community>): Promise<Community | undefined>;
  deleteCommunity(id: number): Promise<boolean>;

  // Community Members
  getCommunityMember(communityId: number, userId: number): Promise<CommunityMember | undefined>;
  getCommunityMembers(communityId: number): Promise<(CommunityMember & { user: User })[]>;
  joinCommunity(member: InsertCommunityMember): Promise<CommunityMember>;
  leaveCommunity(communityId: number, userId: number): Promise<boolean>;

  // Timeline
  getTimelineEntry(id: number): Promise<TimelineEntry | undefined>;
  getTimelineEntriesByUserId(userId: number): Promise<(TimelineEntry & { mediaItem?: MediaItem })[]>;
  createTimelineEntry(entry: InsertTimelineEntry): Promise<TimelineEntry>;
  deleteTimelineEntry(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private mediaItems: Map<number, MediaItem>;
  private comments: Map<number, Comment>;
  private connections: Map<number, Connection>;
  private likes: Map<number, Like>;
  private communities: Map<number, Community>;
  private communityMembers: Map<number, CommunityMember>;
  private timelineEntries: Map<number, TimelineEntry>;
  private currentUserId: number;
  private currentMediaItemId: number;
  private currentCommentId: number;
  private currentConnectionId: number;
  private currentLikeId: number;
  private currentCommunityId: number;
  private currentCommunityMemberId: number;
  private currentTimelineEntryId: number;

  constructor() {
    this.users = new Map();
    this.mediaItems = new Map();
    this.comments = new Map();
    this.connections = new Map();
    this.likes = new Map();
    this.communities = new Map();
    this.communityMembers = new Map();
    this.timelineEntries = new Map();
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

  private seedData() {
    // Create sample users
    const user1: User = {
      id: this.currentUserId++,
      username: "johnsmith",
      email: "john@example.com",
      displayName: "John Smith",
      bio: "Film enthusiast and music lover seeking deep conversations about art that moves us.",
      location: "San Francisco, CA",
      avatarColor: "#6366F1"
    };
    
    const user2: User = {
      id: this.currentUserId++,
      username: "alexmartinez",
      email: "alex@example.com",
      displayName: "Alex Martinez",
      bio: "Collector of stories and seeker of hidden gems in every medium.",
      location: "New York, NY",
      avatarColor: "#3B82F6"
    };

    const user3: User = {
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

    // Create sample media items
    const mediaItems = [
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

    mediaItems.forEach(item => {
      this.mediaItems.set(item.id, item);
    });

    // Create sample communities
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

    sampleCommunities.forEach(community => {
      this.communities.set(community.id, community);
    });

    // Create community memberships
    const memberships = [
      // Studio Ghibli Fans
      { id: this.currentCommunityMemberId++, communityId: 1, userId: user1.id, joinedAt: new Date() },
      { id: this.currentCommunityMemberId++, communityId: 1, userId: user2.id, joinedAt: new Date() },
      { id: this.currentCommunityMemberId++, communityId: 1, userId: user3.id, joinedAt: new Date() },
      // Indie Book Club
      { id: this.currentCommunityMemberId++, communityId: 2, userId: user2.id, joinedAt: new Date() },
      { id: this.currentCommunityMemberId++, communityId: 2, userId: user3.id, joinedAt: new Date() },
      // Music That Moves Us
      { id: this.currentCommunityMemberId++, communityId: 3, userId: user3.id, joinedAt: new Date() },
    ];

    memberships.forEach(membership => {
      this.communityMembers.set(membership.id, membership);
    });

    // Create sample timeline entries
    const sampleTimelineEntries = [
      {
        id: this.currentTimelineEntryId++,
        userId: user1.id,
        mediaItemId: 1, // Bohemian Rhapsody
        action: "added",
        details: "Added 'Bohemian Rhapsody' by Queen to position #1",
        changeReason: "This song represents everything I love about music - the way it builds from a gentle ballad to an operatic masterpiece. It reminds me of road trips with my dad when I was younger.",
        oldPosition: null,
        newPosition: 1,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        id: this.currentTimelineEntryId++,
        userId: user1.id,
        mediaItemId: 2, // The Dark Knight
        action: "added",
        details: "Added 'The Dark Knight' by Christopher Nolan to position #2",
        changeReason: "Heath Ledger's performance as the Joker completely changed how I view cinema. This movie proves that superhero films can be profound philosophical explorations.",
        oldPosition: null,
        newPosition: 2,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        id: this.currentTimelineEntryId++,
        userId: user1.id,
        mediaItemId: 1, // Bohemian Rhapsody
        action: "moved",
        details: "Moved 'Bohemian Rhapsody' from position #1 to position #2",
        changeReason: "After really thinking about it, I realized The Dark Knight has had a more lasting impact on me. Both are incredible, but Batman changed how I see storytelling.",
        oldPosition: 1,
        newPosition: 2,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        id: this.currentTimelineEntryId++,
        userId: user1.id,
        mediaItemId: 2, // The Dark Knight
        action: "moved",
        details: "Moved 'The Dark Knight' from position #2 to position #1",
        changeReason: "After really thinking about it, I realized The Dark Knight has had a more lasting impact on me. Both are incredible, but Batman changed how I see storytelling.",
        oldPosition: 2,
        newPosition: 1,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ];

    sampleTimelineEntries.forEach(entry => {
      this.timelineEntries.set(entry.id, entry);
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Media Items
  async getMediaItem(id: number): Promise<MediaItem | undefined> {
    return this.mediaItems.get(id);
  }

  async getMediaItemsByUserId(userId: number): Promise<MediaItem[]> {
    return Array.from(this.mediaItems.values())
      .filter(item => item.userId === userId)
      .sort((a, b) => a.position - b.position);
  }

  async createMediaItem(insertMediaItem: InsertMediaItem): Promise<MediaItem> {
    const id = this.currentMediaItemId++;
    const mediaItem: MediaItem = { 
      ...insertMediaItem, 
      id,
      likeCount: 0,
      commentCount: 0
    };
    this.mediaItems.set(id, mediaItem);
    return mediaItem;
  }

  async updateMediaItem(id: number, updates: Partial<MediaItem>): Promise<MediaItem | undefined> {
    const existing = this.mediaItems.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.mediaItems.set(id, updated);
    return updated;
  }

  async deleteMediaItem(id: number): Promise<boolean> {
    return this.mediaItems.delete(id);
  }

  async getAllMediaItems(): Promise<MediaItem[]> {
    return Array.from(this.mediaItems.values());
  }

  // Comments
  async getComment(id: number): Promise<Comment | undefined> {
    return this.comments.get(id);
  }

  async getCommentsByMediaItemId(mediaItemId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(comment => comment.mediaItemId === mediaItemId);
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const comment: Comment = { 
      ...insertComment, 
      id,
      createdAt: new Date()
    };
    this.comments.set(id, comment);
    
    // Update comment count
    const mediaItem = this.mediaItems.get(insertComment.mediaItemId);
    if (mediaItem) {
      mediaItem.commentCount++;
      this.mediaItems.set(mediaItem.id, mediaItem);
    }
    
    return comment;
  }

  async deleteComment(id: number): Promise<boolean> {
    const comment = this.comments.get(id);
    if (comment) {
      // Update comment count
      const mediaItem = this.mediaItems.get(comment.mediaItemId);
      if (mediaItem && mediaItem.commentCount > 0) {
        mediaItem.commentCount--;
        this.mediaItems.set(mediaItem.id, mediaItem);
      }
    }
    return this.comments.delete(id);
  }

  // Connections
  async getConnection(id: number): Promise<Connection | undefined> {
    return this.connections.get(id);
  }

  async getConnectionsByUserId(userId: number): Promise<Connection[]> {
    return Array.from(this.connections.values()).filter(
      conn => conn.userId === userId || conn.connectedUserId === userId
    );
  }

  async createConnection(insertConnection: InsertConnection): Promise<Connection> {
    const id = this.currentConnectionId++;
    const connection: Connection = { 
      ...insertConnection, 
      id,
      status: "pending"
    };
    this.connections.set(id, connection);
    return connection;
  }

  async updateConnection(id: number, updates: Partial<Connection>): Promise<Connection | undefined> {
    const existing = this.connections.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.connections.set(id, updated);
    return updated;
  }

  // Likes
  async getLike(userId: number, mediaItemId: number): Promise<Like | undefined> {
    return Array.from(this.likes.values()).find(
      like => like.userId === userId && like.mediaItemId === mediaItemId
    );
  }

  async getLikesByMediaItemId(mediaItemId: number): Promise<Like[]> {
    return Array.from(this.likes.values()).filter(like => like.mediaItemId === mediaItemId);
  }

  async createLike(insertLike: InsertLike): Promise<Like> {
    const id = this.currentLikeId++;
    const like: Like = { ...insertLike, id };
    this.likes.set(id, like);
    
    // Update like count
    const mediaItem = this.mediaItems.get(insertLike.mediaItemId);
    if (mediaItem) {
      mediaItem.likeCount++;
      this.mediaItems.set(mediaItem.id, mediaItem);
    }
    
    return like;
  }

  async deleteLike(userId: number, mediaItemId: number): Promise<boolean> {
    const like = Array.from(this.likes.values()).find(
      like => like.userId === userId && like.mediaItemId === mediaItemId
    );
    
    if (like) {
      // Update like count
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
  async findUsersWithSharedMedia(userId: number, minMatches: number = 3): Promise<(User & { matchCount: number; sharedItems: MediaItem[] })[]> {
    const userMediaItems = await this.getMediaItemsByUserId(userId);
    const userTitles = userMediaItems.map(item => item.title.toLowerCase());
    const allUsers = await this.getAllUsers();
    const results: (User & { matchCount: number; sharedItems: MediaItem[] })[] = [];

    for (const user of allUsers) {
      if (user.id === userId) continue;

      const otherUserMediaItems = await this.getMediaItemsByUserId(user.id);
      const sharedItems: MediaItem[] = [];
      
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
  async getCommunity(id: number): Promise<Community | undefined> {
    return this.communities.get(id);
  }

  async getAllCommunities(): Promise<Community[]> {
    return Array.from(this.communities.values());
  }

  async getCommunitiesByUserId(userId: number): Promise<Community[]> {
    const userMemberships = Array.from(this.communityMembers.values())
      .filter(member => member.userId === userId);
    
    const communities: Community[] = [];
    for (const membership of userMemberships) {
      const community = this.communities.get(membership.communityId);
      if (community) {
        communities.push(community);
      }
    }
    
    return communities;
  }

  async createCommunity(insertCommunity: InsertCommunity): Promise<Community> {
    const id = this.currentCommunityId++;
    const community: Community = { 
      ...insertCommunity, 
      id,
      memberCount: 1
    };
    this.communities.set(id, community);

    // Auto-join creator
    const membership: CommunityMember = {
      id: this.currentCommunityMemberId++,
      communityId: id,
      userId: insertCommunity.creatorId,
      joinedAt: new Date()
    };
    this.communityMembers.set(membership.id, membership);

    return community;
  }

  async updateCommunity(id: number, updates: Partial<Community>): Promise<Community | undefined> {
    const existing = this.communities.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.communities.set(id, updated);
    return updated;
  }

  async deleteCommunity(id: number): Promise<boolean> {
    // Remove all memberships first
    const memberships = Array.from(this.communityMembers.values())
      .filter(member => member.communityId === id);
    
    memberships.forEach(membership => {
      this.communityMembers.delete(membership.id);
    });

    return this.communities.delete(id);
  }

  // Community Members
  async getCommunityMember(communityId: number, userId: number): Promise<CommunityMember | undefined> {
    return Array.from(this.communityMembers.values()).find(
      member => member.communityId === communityId && member.userId === userId
    );
  }

  async getCommunityMembers(communityId: number): Promise<(CommunityMember & { user: User })[]> {
    const members = Array.from(this.communityMembers.values())
      .filter(member => member.communityId === communityId);
    
    const membersWithUsers = await Promise.all(
      members.map(async (member) => {
        const user = await this.getUser(member.userId);
        return { ...member, user: user! };
      })
    );
    
    return membersWithUsers;
  }

  async joinCommunity(insertMember: InsertCommunityMember): Promise<CommunityMember> {
    const id = this.currentCommunityMemberId++;
    const member: CommunityMember = { 
      ...insertMember, 
      id,
      joinedAt: new Date()
    };
    this.communityMembers.set(id, member);

    // Update member count
    const community = this.communities.get(insertMember.communityId);
    if (community) {
      community.memberCount++;
      this.communities.set(community.id, community);
    }

    return member;
  }

  async leaveCommunity(communityId: number, userId: number): Promise<boolean> {
    const member = Array.from(this.communityMembers.values()).find(
      member => member.communityId === communityId && member.userId === userId
    );
    
    if (member) {
      // Update member count
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
  async getTimelineEntry(id: number): Promise<TimelineEntry | undefined> {
    return this.timelineEntries.get(id);
  }

  async getTimelineEntriesByUserId(userId: number): Promise<(TimelineEntry & { mediaItem?: MediaItem })[]> {
    const entries = Array.from(this.timelineEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    
    // Join with media items if available
    const entriesWithMedia = await Promise.all(
      entries.map(async (entry) => {
        const mediaItem = entry.mediaItemId ? await this.getMediaItem(entry.mediaItemId) : undefined;
        return { ...entry, mediaItem };
      })
    );
    
    return entriesWithMedia;
  }

  async createTimelineEntry(insertEntry: InsertTimelineEntry): Promise<TimelineEntry> {
    const id = this.currentTimelineEntryId++;
    const entry: TimelineEntry = { 
      ...insertEntry, 
      id,
      createdAt: new Date()
    };
    this.timelineEntries.set(id, entry);
    return entry;
  }

  async deleteTimelineEntry(id: number): Promise<boolean> {
    return this.timelineEntries.delete(id);
  }
}

export const storage = new MemStorage();
