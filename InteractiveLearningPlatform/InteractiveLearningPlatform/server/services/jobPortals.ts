import axios from 'axios';

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior';
  datePosted: string;
  url: string;
  source: 'linkedin' | 'indeed' | 'glassdoor' | 'naukri';
}

export interface SkillDemand {
  skill: string;
  count: number;
  percentage: number;
  averageSalary?: string;
  companies: string[];
}

export interface JobMarketData {
  jobRole: string;
  totalJobs: number;
  skillDemand: SkillDemand[];
  topCompanies: string[];
  averageSalary?: string;
  locations: { location: string; count: number }[];
  lastUpdated: string;
}

// LinkedIn Jobs API integration (requires LinkedIn API access)
export class LinkedInJobsAPI {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchJobs(
    keywords: string,
    location: string = '',
    experienceLevel: string = '',
    limit: number = 25
  ): Promise<JobListing[]> {
    try {
      // LinkedIn Jobs API endpoint (requires proper authentication)
      const response = await axios.get('https://api.linkedin.com/v2/jobSearch', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        params: {
          keywords,
          location,
          experience: experienceLevel,
          count: limit,
        },
      });

      return response.data.elements?.map((job: any) => ({
        id: job.id,
        title: job.title,
        company: job.company?.name || 'Unknown Company',
        location: job.location?.displayName || location,
        description: job.description || '',
        requirements: this.extractRequirements(job.description || ''),
        salary: job.salary?.displayName,
        jobType: this.mapJobType(job.employmentType),
        experienceLevel: this.mapExperienceLevel(job.experienceLevel),
        datePosted: job.postedDate,
        url: job.jobUrl || `https://linkedin.com/jobs/view/${job.id}`,
        source: 'linkedin' as const,
      })) || [];
    } catch (error) {
      console.error('LinkedIn API Error:', error);
      return [];
    }
  }

  private extractRequirements(description: string): string[] {
    const skillPattern = /(JavaScript|TypeScript|React|Node\.js|Python|Java|SQL|AWS|Docker|Kubernetes|Git|HTML|CSS|Angular|Vue\.js|MongoDB|PostgreSQL|Redis|GraphQL|REST|API|Agile|Scrum)/gi;
    const matches = description.match(skillPattern) || [];
    return [...new Set(matches.map(skill => skill.toLowerCase()))];
  }

  private mapJobType(employmentType: string): JobListing['jobType'] {
    const typeMap: Record<string, JobListing['jobType']> = {
      'FULL_TIME': 'full-time',
      'PART_TIME': 'part-time',
      'CONTRACT': 'contract',
      'INTERNSHIP': 'internship',
    };
    return typeMap[employmentType] || 'full-time';
  }

  private mapExperienceLevel(level: string): JobListing['experienceLevel'] {
    const levelMap: Record<string, JobListing['experienceLevel']> = {
      'ENTRY_LEVEL': 'entry',
      'MID_SENIOR_LEVEL': 'mid',
      'SENIOR_LEVEL': 'senior',
      'EXECUTIVE': 'senior',
    };
    return levelMap[level] || 'mid';
  }
}

// Indeed Jobs API integration
export class IndeedJobsAPI {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchJobs(
    query: string,
    location: string = '',
    experienceLevel: string = '',
    limit: number = 25
  ): Promise<JobListing[]> {
    try {
      const response = await axios.get('https://api.indeed.com/ads/apisearch', {
        params: {
          publisher: this.apiKey,
          q: query,
          l: location,
          sort: 'date',
          radius: 25,
          st: 'jobsite',
          jt: 'fulltime',
          start: 0,
          limit,
          format: 'json',
          v: '2',
        },
      });

      return response.data.results?.map((job: any) => ({
        id: job.jobkey,
        title: job.jobtitle,
        company: job.company,
        location: job.formattedLocation,
        description: job.snippet,
        requirements: this.extractRequirements(job.snippet),
        jobType: 'full-time' as const,
        experienceLevel: this.inferExperienceLevel(job.jobtitle),
        datePosted: job.date,
        url: job.url,
        source: 'indeed' as const,
      })) || [];
    } catch (error) {
      console.error('Indeed API Error:', error);
      return [];
    }
  }

  private extractRequirements(snippet: string): string[] {
    const skillPattern = /(JavaScript|TypeScript|React|Node\.js|Python|Java|SQL|AWS|Docker|Kubernetes|Git|HTML|CSS|Angular|Vue\.js|MongoDB|PostgreSQL|Redis|GraphQL|REST|API|Agile|Scrum)/gi;
    const matches = snippet.match(skillPattern) || [];
    return [...new Set(matches.map(skill => skill.toLowerCase()))];
  }

  private inferExperienceLevel(title: string): JobListing['experienceLevel'] {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('senior') || lowerTitle.includes('lead') || lowerTitle.includes('principal')) {
      return 'senior';
    }
    if (lowerTitle.includes('junior') || lowerTitle.includes('entry') || lowerTitle.includes('intern')) {
      return 'entry';
    }
    return 'mid';
  }
}

// Naukri.com API integration (unofficial scraping approach)
export class NaukriJobsAPI {
  async searchJobs(
    query: string,
    location: string = '',
    experienceLevel: string = '',
    limit: number = 25
  ): Promise<JobListing[]> {
    try {
      // Note: Naukri doesn't have a public API, so this would require web scraping
      // For demo purposes, we'll return empty array and log the intent
      console.log(`Naukri search requested for: ${query} in ${location}`);
      return [];
    } catch (error) {
      console.error('Naukri API Error:', error);
      return [];
    }
  }
}

// Main job aggregator service
export class JobPortalAggregator {
  private linkedIn?: LinkedInJobsAPI;
  private indeed?: IndeedJobsAPI;
  private naukri: NaukriJobsAPI;

  constructor(apiKeys: {
    linkedIn?: string;
    indeed?: string;
  }) {
    if (apiKeys.linkedIn) {
      this.linkedIn = new LinkedInJobsAPI(apiKeys.linkedIn);
    }
    if (apiKeys.indeed) {
      this.indeed = new IndeedJobsAPI(apiKeys.indeed);
    }
    this.naukri = new NaukriJobsAPI();
  }

  async searchAllPortals(
    jobRole: string,
    location: string = '',
    experienceLevel: string = '',
    limit: number = 25
  ): Promise<JobListing[]> {
    const promises: Promise<JobListing[]>[] = [];

    if (this.linkedIn) {
      promises.push(this.linkedIn.searchJobs(jobRole, location, experienceLevel, Math.ceil(limit / 3)));
    }
    if (this.indeed) {
      promises.push(this.indeed.searchJobs(jobRole, location, experienceLevel, Math.ceil(limit / 3)));
    }
    promises.push(this.naukri.searchJobs(jobRole, location, experienceLevel, Math.ceil(limit / 3)));

    try {
      const results = await Promise.allSettled(promises);
      const allJobs = results
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => (result as PromiseFulfilledResult<JobListing[]>).value);

      // Sort by date posted (newest first) and limit results
      return allJobs
        .sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error aggregating job portal results:', error);
      return [];
    }
  }

  async analyzeJobMarket(jobRole: string, location: string = ''): Promise<JobMarketData> {
    const jobs = await this.searchAllPortals(jobRole, location, '', 100);
    
    // Analyze skill demand
    const skillCounts: Record<string, { count: number; companies: Set<string> }> = {};
    const companyCounts: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};

    jobs.forEach(job => {
      // Count skills
      job.requirements.forEach(skill => {
        if (!skillCounts[skill]) {
          skillCounts[skill] = { count: 0, companies: new Set() };
        }
        skillCounts[skill].count++;
        skillCounts[skill].companies.add(job.company);
      });

      // Count companies
      companyCounts[job.company] = (companyCounts[job.company] || 0) + 1;

      // Count locations
      locationCounts[job.location] = (locationCounts[job.location] || 0) + 1;
    });

    // Convert to sorted arrays
    const skillDemand: SkillDemand[] = Object.entries(skillCounts)
      .map(([skill, data]) => ({
        skill,
        count: data.count,
        percentage: Math.round((data.count / jobs.length) * 100),
        companies: Array.from(data.companies),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    const topCompanies = Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([company]) => company);

    const locations = Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      jobRole,
      totalJobs: jobs.length,
      skillDemand,
      topCompanies,
      locations,
      lastUpdated: new Date().toISOString(),
    };
  }
}

// Initialize the job portal aggregator with available API keys
export const jobPortalAggregator = new JobPortalAggregator({
  linkedIn: process.env.LINKEDIN_API_KEY,
  indeed: process.env.INDEED_API_KEY,
});