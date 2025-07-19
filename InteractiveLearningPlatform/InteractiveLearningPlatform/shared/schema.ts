import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  serial
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const roadmaps = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  jobRole: varchar("job_role").notNull(),
  experienceLevel: varchar("experience_level").notNull(),
  estimatedHours: integer("estimated_hours"),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  roadmapId: integer("roadmap_id").notNull().references(() => roadmaps.id),
  title: varchar("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull(),
  estimatedHours: integer("estimated_hours"),
  isCompleted: boolean("is_completed").default(false),
  isLocked: boolean("is_locked").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull().references(() => modules.id),
  title: varchar("title").notNull(),
  type: varchar("type").notNull(), // 'video', 'article', 'documentation'
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  duration: varchar("duration"),
  provider: varchar("provider"), // 'youtube', 'medium', 'mdn', etc.
  views: varchar("views"),
  rating: integer("rating"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull().references(() => modules.id),
  title: varchar("title").notNull(),
  description: text("description"),
  questions: jsonb("questions").notNull(), // Array of question objects
  passingScore: integer("passing_score").default(70),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  moduleId: integer("module_id").notNull().references(() => modules.id),
  completedAt: timestamp("completed_at"),
  timeSpent: integer("time_spent"), // in minutes
  score: integer("score"), // assessment score
  createdAt: timestamp("created_at").defaultNow(),
});

// Job listings table for storing live job data
export const jobListings = pgTable("job_listings", {
  id: serial("id").primaryKey(),
  externalId: varchar("external_id").notNull(), // ID from the job portal
  title: varchar("title").notNull(),
  company: varchar("company").notNull(),
  location: varchar("location").notNull(),
  description: text("description"),
  requirements: text("requirements").array(), // Array of required skills
  salary: varchar("salary"),
  jobType: varchar("job_type").notNull(), // full-time, part-time, contract, internship
  experienceLevel: varchar("experience_level").notNull(), // entry, mid, senior
  datePosted: timestamp("date_posted").notNull(),
  url: varchar("url").notNull(),
  source: varchar("source").notNull(), // linkedin, indeed, naukri, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job market analysis table for caching market data
export const jobMarketData = pgTable("job_market_data", {
  id: serial("id").primaryKey(),
  jobRole: varchar("job_role").notNull(),
  location: varchar("location").default(""),
  totalJobs: integer("total_jobs").notNull(),
  skillDemand: jsonb("skill_demand").notNull(), // Array of skill demand objects
  topCompanies: text("top_companies").array(),
  averageSalary: varchar("average_salary"),
  locations: jsonb("locations").notNull(), // Array of location data
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User job searches and preferences
export const userJobSearches = pgTable("user_job_searches", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  jobRole: varchar("job_role").notNull(),
  location: varchar("location").default(""),
  experienceLevel: varchar("experience_level"),
  lastSearched: timestamp("last_searched").defaultNow(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  roadmaps: many(roadmaps),
  progress: many(userProgress),
  jobSearches: many(userJobSearches),
}));

export const roadmapsRelations = relations(roadmaps, ({ one, many }) => ({
  user: one(users, {
    fields: [roadmaps.userId],
    references: [users.id],
  }),
  modules: many(modules),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  roadmap: one(roadmaps, {
    fields: [modules.roadmapId],
    references: [roadmaps.id],
  }),
  resources: many(resources),
  assessments: many(assessments),
  progress: many(userProgress),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  module: one(modules, {
    fields: [resources.moduleId],
    references: [modules.id],
  }),
}));

export const assessmentsRelations = relations(assessments, ({ one }) => ({
  module: one(modules, {
    fields: [assessments.moduleId],
    references: [modules.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  module: one(modules, {
    fields: [userProgress.moduleId],
    references: [modules.id],
  }),
}));

// Insert schemas
export const insertRoadmapSchema = createInsertSchema(roadmaps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
  createdAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
});

export const insertJobListingSchema = createInsertSchema(jobListings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobMarketDataSchema = createInsertSchema(jobMarketData).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertUserJobSearchSchema = createInsertSchema(userJobSearches).omit({
  id: true,
  createdAt: true,
  lastSearched: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertRoadmap = z.infer<typeof insertRoadmapSchema>;
export type Roadmap = typeof roadmaps.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

// Complex types for API responses
export type RoadmapWithModules = Roadmap & {
  modules: (Module & {
    resources: Resource[];
    assessments: Assessment[];
    progress?: UserProgress;
  })[];
};

export type ModuleWithResources = Module & {
  resources: Resource[];
  assessments: Assessment[];
};

// Job-related types
export type InsertJobListing = z.infer<typeof insertJobListingSchema>;
export type JobListing = typeof jobListings.$inferSelect;
export type InsertJobMarketData = z.infer<typeof insertJobMarketDataSchema>;
export type JobMarketData = typeof jobMarketData.$inferSelect;
export type InsertUserJobSearch = z.infer<typeof insertUserJobSearchSchema>;
export type UserJobSearch = typeof userJobSearches.$inferSelect;
