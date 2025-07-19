import {
  users,
  roadmaps,
  modules,
  resources,
  assessments,
  userProgress,
  jobListings,
  jobMarketData,
  userJobSearches,
  type User,
  type UpsertUser,
  type InsertRoadmap,
  type Roadmap,
  type InsertModule,
  type Module,
  type InsertResource,
  type Resource,
  type InsertAssessment,
  type Assessment,
  type InsertUserProgress,
  type UserProgress,
  type JobListing,
  type InsertJobListing,
  type JobMarketData,
  type InsertJobMarketData,
  type UserJobSearch,
  type InsertUserJobSearch,
  type RoadmapWithModules,
  type ModuleWithResources,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Roadmap operations
  createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap>;
  getRoadmapsByUserId(userId: string): Promise<Roadmap[]>;
  getRoadmapWithModules(roadmapId: number, userId: string): Promise<RoadmapWithModules | undefined>;
  updateRoadmap(id: number, updates: Partial<Roadmap>): Promise<Roadmap | undefined>;
  
  // Module operations
  createModule(module: InsertModule): Promise<Module>;
  getModulesByRoadmapId(roadmapId: number): Promise<ModuleWithResources[]>;
  updateModule(id: number, updates: Partial<Module>): Promise<Module | undefined>;
  
  // Resource operations
  createResource(resource: InsertResource): Promise<Resource>;
  getResourcesByModuleId(moduleId: number): Promise<Resource[]>;
  
  // Assessment operations
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessmentsByModuleId(moduleId: number): Promise<Assessment[]>;
  
  // Progress operations
  createOrUpdateProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getProgressByUserAndModule(userId: string, moduleId: number): Promise<UserProgress | undefined>;
  getUserProgress(userId: string, roadmapId: number): Promise<UserProgress[]>;
  
  // Job portal operations
  createJobListing(job: InsertJobListing): Promise<JobListing>;
  upsertJobListing(job: InsertJobListing): Promise<JobListing>;
  getJobListings(filters?: { jobRole?: string; location?: string; source?: string }): Promise<JobListing[]>;
  
  // Job market data operations
  createJobMarketData(data: InsertJobMarketData): Promise<JobMarketData>;
  getJobMarketData(jobRole: string, location: string): Promise<JobMarketData | undefined>;
  
  // User job search operations
  createUserJobSearch(search: InsertUserJobSearch): Promise<UserJobSearch>;
  getUserJobSearches(userId: string): Promise<UserJobSearch[]>;
  
  // Analytics operations
  getTrendingSkills(limit: number): Promise<{ skill: string; count: number }[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Roadmap operations
  async createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap> {
    const [newRoadmap] = await db.insert(roadmaps).values(roadmap).returning();
    return newRoadmap;
  }

  async getRoadmapsByUserId(userId: string): Promise<Roadmap[]> {
    return await db
      .select()
      .from(roadmaps)
      .where(eq(roadmaps.userId, userId))
      .orderBy(desc(roadmaps.createdAt));
  }

  async getRoadmapWithModules(roadmapId: number, userId: string): Promise<RoadmapWithModules | undefined> {
    const [roadmap] = await db
      .select()
      .from(roadmaps)
      .where(and(eq(roadmaps.id, roadmapId), eq(roadmaps.userId, userId)));

    if (!roadmap) return undefined;

    const roadmapModules = await db
      .select()
      .from(modules)
      .where(eq(modules.roadmapId, roadmapId))
      .orderBy(asc(modules.orderIndex));

    const modulesWithDetails = await Promise.all(
      roadmapModules.map(async (module) => {
        const [moduleResources, moduleAssessments, progress] = await Promise.all([
          db.select().from(resources).where(eq(resources.moduleId, module.id)),
          db.select().from(assessments).where(eq(assessments.moduleId, module.id)),
          db.select().from(userProgress).where(
            and(eq(userProgress.moduleId, module.id), eq(userProgress.userId, userId))
          ).then(rows => rows[0])
        ]);

        return {
          ...module,
          resources: moduleResources,
          assessments: moduleAssessments,
          progress,
        };
      })
    );

    return {
      ...roadmap,
      modules: modulesWithDetails,
    };
  }

  async updateRoadmap(id: number, updates: Partial<Roadmap>): Promise<Roadmap | undefined> {
    const [updated] = await db
      .update(roadmaps)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(roadmaps.id, id))
      .returning();
    return updated;
  }

  // Module operations
  async createModule(module: InsertModule): Promise<Module> {
    const [newModule] = await db.insert(modules).values(module).returning();
    return newModule;
  }

  async getModulesByRoadmapId(roadmapId: number): Promise<ModuleWithResources[]> {
    const roadmapModules = await db
      .select()
      .from(modules)
      .where(eq(modules.roadmapId, roadmapId))
      .orderBy(asc(modules.orderIndex));

    return await Promise.all(
      roadmapModules.map(async (module) => {
        const [moduleResources, moduleAssessments] = await Promise.all([
          db.select().from(resources).where(eq(resources.moduleId, module.id)),
          db.select().from(assessments).where(eq(assessments.moduleId, module.id)),
        ]);

        return {
          ...module,
          resources: moduleResources,
          assessments: moduleAssessments,
        };
      })
    );
  }

  async updateModule(id: number, updates: Partial<Module>): Promise<Module | undefined> {
    const [updated] = await db
      .update(modules)
      .set(updates)
      .where(eq(modules.id, id))
      .returning();
    return updated;
  }

  // Resource operations
  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db.insert(resources).values(resource).returning();
    return newResource;
  }

  async getResourcesByModuleId(moduleId: number): Promise<Resource[]> {
    return await db.select().from(resources).where(eq(resources.moduleId, moduleId));
  }

  // Assessment operations
  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const [newAssessment] = await db.insert(assessments).values(assessment).returning();
    return newAssessment;
  }

  async getAssessmentsByModuleId(moduleId: number): Promise<Assessment[]> {
    return await db.select().from(assessments).where(eq(assessments.moduleId, moduleId));
  }

  // Progress operations
  async createOrUpdateProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [existing] = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, progress.userId),
          eq(userProgress.moduleId, progress.moduleId)
        )
      );

    if (existing) {
      const [updated] = await db
        .update(userProgress)
        .set(progress)
        .where(eq(userProgress.id, existing.id))
        .returning();
      return updated;
    } else {
      const [newProgress] = await db.insert(userProgress).values(progress).returning();
      return newProgress;
    }
  }

  async getProgressByUserAndModule(userId: string, moduleId: number): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(
        and(eq(userProgress.userId, userId), eq(userProgress.moduleId, moduleId))
      );
    return progress;
  }

  async getUserProgress(userId: string, roadmapId: number): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .innerJoin(modules, eq(userProgress.moduleId, modules.id))
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(modules.roadmapId, roadmapId)
        )
      )
      .then(rows => rows.map(row => row.user_progress));
  }

  // Job portal operations
  async createJobListing(job: InsertJobListing): Promise<JobListing> {
    const [result] = await db.insert(jobListings).values(job).returning();
    return result;
  }

  async upsertJobListing(job: InsertJobListing): Promise<JobListing> {
    const [result] = await db
      .insert(jobListings)
      .values(job)
      .onConflictDoUpdate({
        target: [jobListings.externalId, jobListings.source],
        set: {
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          requirements: job.requirements,
          salary: job.salary,
          jobType: job.jobType,
          experienceLevel: job.experienceLevel,
          datePosted: job.datePosted,
          url: job.url,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  async getJobListings(filters?: { jobRole?: string; location?: string; source?: string }): Promise<JobListing[]> {
    if (filters?.source) {
      return await db
        .select()
        .from(jobListings)
        .where(eq(jobListings.source, filters.source))
        .orderBy(desc(jobListings.datePosted))
        .limit(100);
    }
    
    return await db
      .select()
      .from(jobListings)
      .orderBy(desc(jobListings.datePosted))
      .limit(100);
  }

  // Job market data operations
  async createJobMarketData(data: InsertJobMarketData): Promise<JobMarketData> {
    const [result] = await db.insert(jobMarketData).values(data).returning();
    return result;
  }

  async getJobMarketData(jobRole: string, location: string): Promise<JobMarketData | undefined> {
    const [result] = await db
      .select()
      .from(jobMarketData)
      .where(and(
        eq(jobMarketData.jobRole, jobRole),
        eq(jobMarketData.location, location)
      ))
      .orderBy(desc(jobMarketData.lastUpdated))
      .limit(1);
    
    return result;
  }

  // User job search operations
  async createUserJobSearch(search: InsertUserJobSearch): Promise<UserJobSearch> {
    const [result] = await db.insert(userJobSearches).values(search).returning();
    return result;
  }

  async getUserJobSearches(userId: string): Promise<UserJobSearch[]> {
    return await db
      .select()
      .from(userJobSearches)
      .where(eq(userJobSearches.userId, userId))
      .orderBy(desc(userJobSearches.createdAt));
  }

  // Analytics operations
  async getTrendingSkills(limit: number): Promise<{ skill: string; count: number }[]> {
    // This is a simplified implementation
    // In a real-world scenario, you'd parse job requirements and extract skills
    const mockSkills = [
      { skill: "JavaScript", count: 1250 },
      { skill: "Python", count: 1100 },
      { skill: "React", count: 950 },
      { skill: "Node.js", count: 850 },
      { skill: "TypeScript", count: 750 },
      { skill: "AWS", count: 700 },
      { skill: "Docker", count: 650 },
      { skill: "SQL", count: 600 },
      { skill: "Git", count: 550 },
      { skill: "MongoDB", count: 500 },
    ];
    
    return mockSkills.slice(0, limit);
  }
}

export const storage = new DatabaseStorage();
