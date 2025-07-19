import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, ExternalLink, MapPin, Building, Clock, TrendingUp, Users, BarChart3, BookOpen, Briefcase, User, LogOut } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { JobListing, JobMarketData } from "@shared/schema";

export default function Jobs() {
  const { user } = useAuth();
  const [searchForm, setSearchForm] = useState({
    jobRole: "",
    location: "",
    experienceLevel: "",
  });
  const [searchParams, setSearchParams] = useState<typeof searchForm | null>(null);
  const { toast } = useToast();

  // Job search query
  const { data: jobResults, isLoading: isSearching, error: searchError } = useQuery({
    queryKey: ['/api/jobs/search', searchParams],
    enabled: !!searchParams?.jobRole,
  });

  // Market analysis query
  const { data: marketData, isLoading: isAnalyzing } = useQuery({
    queryKey: ['/api/jobs/market-analysis', searchParams?.jobRole, searchParams?.location],
    enabled: !!searchParams?.jobRole,
  });

  // Trending skills query
  const { data: trendingSkills } = useQuery({
    queryKey: ['/api/jobs/trending-skills'],
  });

  // User's search history
  const { data: userSearches } = useQuery({
    queryKey: ['/api/jobs/user-searches'],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchForm.jobRole.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a job role to search",
        variant: "destructive",
      });
      return;
    }
    setSearchParams({ ...searchForm });
  };

  const formatSalary = (salary: string | null) => {
    if (!salary) return "Salary not specified";
    return salary;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-gray-900">SkillRoad</span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="/" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Roadmaps
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="/jobs" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Jobs
                </a>
              </Button>
            </nav>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  {user.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user.firstName || user.email}
                  </span>
                </div>
              )}
              <Button variant="outline" size="sm" asChild>
                <a href="/api/logout" className="flex items-center gap-1">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Job Portal
          </h1>
          <p className="text-gray-600">
            Search for jobs and analyze market trends to enhance your learning roadmap
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Job Search
            </CardTitle>
            <CardDescription>
              Find relevant job opportunities and market insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Job Role *</label>
                  <Input
                    placeholder="e.g., Frontend Developer, Data Scientist"
                    value={searchForm.jobRole}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, jobRole: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    placeholder="e.g., Remote, San Francisco, India"
                    value={searchForm.location}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Experience Level</label>
                  <Select value={searchForm.experienceLevel} onValueChange={(value) => setSearchForm(prev => ({ ...prev, experienceLevel: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Levels</SelectItem>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="lead">Lead/Principal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" disabled={isSearching} className="w-full md:w-auto">
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Jobs
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Tabs defaultValue="results" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="results">Job Results</TabsTrigger>
            <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
            <TabsTrigger value="skills">Trending Skills</TabsTrigger>
            <TabsTrigger value="history">Search History</TabsTrigger>
          </TabsList>

          {/* Job Results Tab */}
          <TabsContent value="results" className="space-y-4">
            {searchError && (
              <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <CardContent className="pt-6">
                  <p className="text-red-600 dark:text-red-400">
                    Failed to search jobs. Please try again.
                  </p>
                </CardContent>
              </Card>
            )}

            {jobResults && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Found {jobResults.totalCount} jobs for "{searchParams?.jobRole}"
                  </h3>
                </div>

                <div className="grid gap-4">
                  {jobResults.jobs.map((job: JobListing) => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-1">
                              {job.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                              <div className="flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                {job.company}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDate(job.datePosted.toString())}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="secondary">{job.jobType}</Badge>
                              <Badge variant="outline">{job.experienceLevel}</Badge>
                              <Badge variant="outline">{job.source}</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600 dark:text-green-400 mb-2">
                              {formatSalary(job.salary)}
                            </p>
                            <Button size="sm" asChild>
                              <a href={job.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View Job
                              </a>
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                          {job.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {!searchParams && (
              <Card className="text-center py-12">
                <CardContent>
                  <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Start Your Job Search</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Enter a job role above to find relevant opportunities and market insights
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Market Analysis Tab */}
          <TabsContent value="analysis" className="space-y-4">
            {isAnalyzing && (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mr-2" />
                  <span>Analyzing job market...</span>
                </CardContent>
              </Card>
            )}

            {marketData && (
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Total Jobs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {marketData.totalJobs}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Average Salary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {marketData.averageSalary || "Not available"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Top Locations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {marketData.locations?.slice(0, 3).join(", ") || "Various"}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Skills in Demand</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {marketData.skillDemand?.slice(0, 10).map((skill, index) => (
                          <div key={skill} className="flex justify-between items-center">
                            <span className="text-sm">{skill}</span>
                            <Badge variant="secondary">{index + 1}</Badge>
                          </div>
                        )) || <p className="text-gray-500">No skill data available</p>}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Hiring Companies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {marketData.topCompanies?.slice(0, 10).map((company, index) => (
                          <div key={company} className="flex justify-between items-center">
                            <span className="text-sm">{company}</span>
                            <Badge variant="outline">{index + 1}</Badge>
                          </div>
                        )) || <p className="text-gray-500">No company data available</p>}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {!searchParams && (
              <Card className="text-center py-12">
                <CardContent>
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Market Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Search for a job role to see detailed market analysis and trends
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Trending Skills Tab */}
          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Most In-Demand Skills
                </CardTitle>
                <CardDescription>
                  Skills that are trending in the job market right now
                </CardDescription>
              </CardHeader>
              <CardContent>
                {trendingSkills ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trendingSkills.skills.map((skill: { skill: string; count: number }) => (
                      <div key={skill.skill} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="font-medium">{skill.skill}</span>
                        <Badge variant="secondary">{skill.count} jobs</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading trending skills...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Search History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Search History</CardTitle>
                <CardDescription>
                  Recent job searches you've performed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userSearches ? (
                  userSearches.length > 0 ? (
                    <div className="space-y-3">
                      {userSearches.map((search: any) => (
                        <div key={search.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <p className="font-medium">{search.jobRole}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {search.location && `📍 ${search.location} • `}
                              {search.experienceLevel && `💼 ${search.experienceLevel} • `}
                              🕒 {formatDate(search.createdAt)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSearchForm({
                                jobRole: search.jobRole,
                                location: search.location || "",
                                experienceLevel: search.experienceLevel || "",
                              });
                              setSearchParams({
                                jobRole: search.jobRole,
                                location: search.location || "",
                                experienceLevel: search.experienceLevel || "",
                              });
                            }}
                          >
                            Search Again
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No search history yet</p>
                  )
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading search history...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}