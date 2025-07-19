import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  location: text("location"),
  avatarColor: text("avatar_color").notNull().default("#6366F1"),
});

export const mediaItems = pgTable("media_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  creator: text("creator"), // artist, author, director, etc.
  mediaType: text("media_type").notNull(), // song, book, movie, show, youtube, game, art
  story: text("story").notNull(), // user's explanation/story
  position: integer("position").notNull(), // 1-10 ranking
  likeCount: integer("like_count").notNull().default(0),
  commentCount: integer("comment_count").notNull().default(0),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mediaItemId: integer("media_item_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const connections = pgTable("connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  connectedUserId: integer("connected_user_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, accepted
});

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mediaItemId: integer("media_item_id").notNull(),
});

export const communities = pgTable("communities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  mediaType: text("media_type"), // optional: focus on specific media type
  creatorId: integer("creator_id").notNull(),
  memberCount: integer("member_count").notNull().default(1),
  color: text("color").notNull().default("#6366F1"),
});

export const communityMembers = pgTable("community_members", {
  id: serial("id").primaryKey(),
  communityId: integer("community_id").notNull(),
  userId: integer("user_id").notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const timelineEntries = pgTable("timeline_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mediaItemId: integer("media_item_id"),
  action: text("action").notNull(), // "added", "removed", "moved", "updated"
  details: text("details").notNull(), // description of what changed
  changeReason: text("change_reason"), // user's comment about why they made the change
  oldPosition: integer("old_position"),
  newPosition: integer("new_position"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertMediaItemSchema = createInsertSchema(mediaItems).omit({
  id: true,
  likeCount: true,
  commentCount: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertConnectionSchema = createInsertSchema(connections).omit({
  id: true,
  status: true,
});

export const insertLikeSchema = createInsertSchema(likes).omit({
  id: true,
});

export const insertCommunitySchema = createInsertSchema(communities).omit({
  id: true,
  memberCount: true,
});

export const insertCommunityMemberSchema = createInsertSchema(communityMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertTimelineEntrySchema = createInsertSchema(timelineEntries).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertMediaItem = z.infer<typeof insertMediaItemSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type InsertLike = z.infer<typeof insertLikeSchema>;
export type InsertCommunity = z.infer<typeof insertCommunitySchema>;
export type InsertCommunityMember = z.infer<typeof insertCommunityMemberSchema>;
export type InsertTimelineEntry = z.infer<typeof insertTimelineEntrySchema>;

export type User = typeof users.$inferSelect;
export type MediaItem = typeof mediaItems.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Connection = typeof connections.$inferSelect;
export type Like = typeof likes.$inferSelect;
export type Community = typeof communities.$inferSelect;
export type CommunityMember = typeof communityMembers.$inferSelect;
export type TimelineEntry = typeof timelineEntries.$inferSelect;
