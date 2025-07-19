import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  generateRoadmap, 
  generateAssessment, 
  generateResourceRecommendations 
} from "./services/gemini";
import { jobPortalAggregator } from "./services/jobPortals";
import { 
  insertRoadmapSchema, 
  insertUserProgressSchema,
  insertUserJobSearchSchema,
  insertJobListingSchema,
  insertJobMarketDataSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Roadmap routes
  app.post('/api/roadmaps/generate', isAuthenticated, async (req: any, res) => {
    try {
      const { jobRole, experienceLevel } = req.body;
      
      if (!jobRole || !experienceLevel) {
        return res.status(400).json({ message: "Job role and experience level are required" });
      }

      const userId = req.user.claims.sub;
      
      // Generate roadmap using Gemini AI
      const generatedRoadmap = await generateRoadmap(jobRole, experienceLevel);
      
      // Save roadmap to database
      const roadmap = await storage.createRoadmap({
        userId,
        title: generatedRoadmap.title,
        description: generatedRoadmap.description,
        jobRole,
        experienceLevel,
        estimatedHours: generatedRoadmap.totalEstimatedHours,
      });

      // Create modules
      const modules = await Promise.all(
        generatedRoadmap.modules.map(async (moduleData, index) => {
          const module = await storage.createModule({
            roadmapId: roadmap.id,
            title: moduleData.title,
            description: moduleData.description,
            orderIndex: index,
            estimatedHours: moduleData.estimatedHours,
            isLocked: index > 0, // First module unlocked, rest locked
          });

          // Generate resources for this module
          try {
            const resources = await generateResourceRecommendations(
              moduleData.title,
              moduleData.skills,
              jobRole
            );

            await Promise.all(
              resources.map(resource =>
                storage.createResource({
                  moduleId: module.id,
                  title: resource.title,
                  type: resource.type,
                  url: `https://www.youtube.com/results?search_query=${encodeURIComponent(resource.searchQuery)}`,
                  provider: resource.provider,
                  duration: resource.estimatedDuration,
                })
              )
            );
          } catch (error) {
            console.error(`Error generating resources for module ${module.id}:`, error);
          }

          // Generate assessment for this module
          try {
            const assessment = await generateAssessment(
              moduleData.title,
              moduleData.skills,
              jobRole
            );

            await storage.createAssessment({
              moduleId: module.id,
              title: assessment.title,
              description: assessment.description,
              questions: assessment.questions,
            });
          } catch (error) {
            console.error(`Error generating assessment for module ${module.id}:`, error);
          }

          return module;
        })
      );

      // Return the complete roadmap with modules
      const roadmapWithModules = await storage.getRoadmapWithModules(roadmap.id, userId);
      res.json(roadmapWithModules);
    } catch (error) {
      console.error("Error generating roadmap:", error);
      res.status(500).json({ message: "Failed to generate roadmap" });
    }
  });

  app.get('/api/roadmaps', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const roadmaps = await storage.getRoadmapsByUserId(userId);
      res.json(roadmaps);
    } catch (error) {
      console.error("Error fetching roadmaps:", error);
      res.status(500).json({ message: "Failed to fetch roadmaps" });
    }
  });

  app.get('/api/roadmaps/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const roadmapId = parseInt(req.params.id);
      
      if (isNaN(roadmapId)) {
        return res.status(400).json({ message: "Invalid roadmap ID" });
      }

      const roadmap = await storage.getRoadmapWithModules(roadmapId, userId);
      
      if (!roadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }

      res.json(roadmap);
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      res.status(500).json({ message: "Failed to fetch roadmap" });
    }
  });

  // Progress routes
  app.post('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progressData = insertUserProgressSchema.parse({
        ...req.body,
        userId,
      });

      const progress = await storage.createOrUpdateProgress(progressData);

      // Check if module should be marked as completed
      if (progress.completedAt) {
        await storage.updateModule(progress.moduleId, { isCompleted: true });
        
        // Unlock next module if this one is completed
        const modules = await storage.getModulesByRoadmapId(
          // We need to get the roadmap ID from the module
          (await storage.getModulesByRoadmapId(progress.moduleId))[0]?.roadmapId || 0
        );
        
        const currentModule = modules.find(m => m.id === progress.moduleId);
        if (currentModule) {
          const nextModule = modules.find(m => m.orderIndex === currentModule.orderIndex + 1);
          if (nextModule) {
            await storage.updateModule(nextModule.id, { isLocked: false });
          }
        }
      }

      res.json(progress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  app.get('/api/progress/:roadmapId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const roadmapId = parseInt(req.params.roadmapId);
      
      if (isNaN(roadmapId)) {
        return res.status(400).json({ message: "Invalid roadmap ID" });
      }

      const progress = await storage.getUserProgress(userId, roadmapId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Assessment submission
  app.post('/api/assessments/:assessmentId/submit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const assessmentId = parseInt(req.params.assessmentId);
      const { answers } = req.body; // Array of selected option indices
      
      if (isNaN(assessmentId)) {
        return res.status(400).json({ message: "Invalid assessment ID" });
      }

      const assessments = await storage.getAssessmentsByModuleId(assessmentId);
      const assessment = assessments[0]; // Assuming one assessment per module for now
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      // Calculate score
      const questions = assessment.questions as any[];
      let correctAnswers = 0;
      
      questions.forEach((question, index) => {
        const selectedOptionIndex = answers[index];
        if (selectedOptionIndex !== undefined && selectedOptionIndex < question.options.length) {
          if (question.options[selectedOptionIndex].isCorrect) {
            correctAnswers++;
          }
        }
      });

      const score = Math.round((correctAnswers / questions.length) * 100);
      const passed = score >= (assessment.passingScore || 70);

      // Update progress
      const progress = await storage.createOrUpdateProgress({
        userId,
        moduleId: assessment.moduleId,
        score,
        completedAt: passed ? new Date() : undefined,
      });

      res.json({
        score,
        passed,
        correctAnswers,
        totalQuestions: questions.length,
        progress,
      });
    } catch (error) {
      console.error("Error submitting assessment:", error);
      res.status(500).json({ message: "Failed to submit assessment" });
    }
  });

  // Job portal routes
  app.get('/api/jobs/search', isAuthenticated, async (req: any, res) => {
    try {
      const { jobRole, location = '', experienceLevel = '', limit = 25 } = req.query;
      
      if (!jobRole) {
        return res.status(400).json({ message: "Job role is required" });
      }

      const userId = req.user.claims.sub;
      
      // Save user job search
      await storage.createUserJobSearch({
        userId,
        jobRole,
        location,
        experienceLevel,
      });

      // Search job portals
      const jobs = await jobPortalAggregator.searchAllPortals(
        jobRole,
        location,
        experienceLevel,
        parseInt(limit)
      );

      // Store job listings in database
      for (const job of jobs) {
        await storage.upsertJobListing({
          externalId: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          requirements: job.requirements,
          salary: job.salary,
          jobType: job.jobType,
          experienceLevel: job.experienceLevel,
          datePosted: new Date(job.datePosted),
          url: job.url,
          source: job.source,
        });
      }

      res.json({
        jobs,
        totalCount: jobs.length,
        searchParams: { jobRole, location, experienceLevel },
      });
    } catch (error) {
      console.error("Error searching jobs:", error);
      res.status(500).json({ message: "Failed to search jobs" });
    }
  });

  app.get('/api/jobs/market-analysis', isAuthenticated, async (req: any, res) => {
    try {
      const { jobRole, location = '' } = req.query;
      
      if (!jobRole) {
        return res.status(400).json({ message: "Job role is required" });
      }

      // Check if we have recent market data (within 24 hours)
      const existingData = await storage.getJobMarketData(jobRole, location);
      const now = new Date();
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      if (existingData && existingData.lastUpdated && existingData.lastUpdated > dayAgo) {
        return res.json(existingData);
      }

      // Generate new market analysis
      const marketData = await jobPortalAggregator.analyzeJobMarket(jobRole, location);
      
      // Store in database
      const savedData = await storage.createJobMarketData({
        jobRole,
        location,
        totalJobs: marketData.totalJobs,
        skillDemand: marketData.skillDemand,
        topCompanies: marketData.topCompanies,
        averageSalary: marketData.averageSalary,
        locations: marketData.locations,
      });

      res.json(savedData);
    } catch (error) {
      console.error("Error analyzing job market:", error);
      res.status(500).json({ message: "Failed to analyze job market" });
    }
  });

  app.get('/api/jobs/trending-skills', isAuthenticated, async (req: any, res) => {
    try {
      const { limit = 20 } = req.query;
      
      // Get trending skills from recent job listings
      const trendingSkills = await storage.getTrendingSkills(parseInt(limit));
      
      res.json({
        skills: trendingSkills,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error fetching trending skills:", error);
      res.status(500).json({ message: "Failed to fetch trending skills" });
    }
  });

  app.get('/api/jobs/user-searches', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const searches = await storage.getUserJobSearches(userId);
      res.json(searches);
    } catch (error) {
      console.error("Error fetching user job searches:", error);
      res.status(500).json({ message: "Failed to fetch job searches" });
    }
  });

  app.post('/api/jobs/save', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const jobData = req.body;
      
      const validatedData = insertJobListingSchema.parse(jobData);
      const savedJob = await storage.createJobListing(validatedData);
      
      res.json(savedJob);
    } catch (error) {
      console.error("Error saving job:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid job data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save job" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
