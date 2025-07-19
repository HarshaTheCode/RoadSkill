import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import RoadmapForm from "@/components/RoadmapForm";
import { 
  MapPin, 
  User, 
  Plus, 
  BookOpen, 
  Clock, 
  TrendingUp,
  Target,
  Zap,
  Briefcase,
  LogOut
} from "lucide-react";
import { useEffect } from "react";

interface Roadmap {
  id: number;
  title: string;
  description: string;
  jobRole: string;
  experienceLevel: string;
  estimatedHours: number;
  isCompleted: boolean;
  createdAt: string;
}

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: roadmaps, isLoading: roadmapsLoading, refetch } = useQuery({
    queryKey: ["/api/roadmaps"],
    enabled: isAuthenticated,
  });

  const generateRoadmapMutation = useMutation({
    mutationFn: async (data: { jobRole: string; experienceLevel: string }) => {
      const response = await apiRequest("POST", "/api/roadmaps/generate", data);
      return response.json();
    },
    onSuccess: (roadmap) => {
      toast({
        title: "Roadmap Generated!",
        description: "Your personalized learning roadmap is ready.",
      });
      setShowCreateForm(false);
      refetch();
      setLocation(`/dashboard/${roadmap.id}`);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to generate roadmap. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleRoadmapClick = (roadmapId: number) => {
    setLocation(`/dashboard/${roadmapId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
              <Button variant="outline" onClick={handleLogout} size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || 'Learner'}! 👋
          </h1>
          <p className="text-gray-600">
            Continue your learning journey or create a new roadmap to master new skills.
          </p>
        </div>

        {/* Create New Roadmap */}
        {!showCreateForm ? (
          <Card className="mb-8 border-dashed border-2 border-gray-300 hover:border-primary transition-colors cursor-pointer" 
                onClick={() => setShowCreateForm(true)}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create New Roadmap</h3>
              <p className="text-gray-600 mb-4">
                Generate a personalized learning path with AI for any job role or skill.
              </p>
              <Button className="bg-primary text-white hover:bg-primary/90">
                <Zap className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create Your Learning Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <RoadmapForm
                onSubmit={(data) => generateRoadmapMutation.mutate(data)}
                onCancel={() => setShowCreateForm(false)}
                isLoading={generateRoadmapMutation.isPending}
              />
            </CardContent>
          </Card>
        )}

        {/* Existing Roadmaps */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Roadmaps</h2>
          
          {roadmapsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="flex space-x-2">
                      <div className="h-6 w-16 bg-gray-200 rounded"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : roadmaps && roadmaps.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadmaps.map((roadmap: Roadmap) => (
                <Card 
                  key={roadmap.id} 
                  className="card-hover cursor-pointer"
                  onClick={() => handleRoadmapClick(roadmap.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {roadmap.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {roadmap.description}
                        </p>
                      </div>
                      {roadmap.isCompleted && (
                        <Badge variant="secondary" className="ml-2">
                          Completed
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="text-xs">
                        <Target className="w-3 h-3 mr-1" />
                        {roadmap.jobRole}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {roadmap.experienceLevel}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {roadmap.estimatedHours}h total
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        Continue Learning
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No roadmaps yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first learning roadmap to get started on your journey.
                </p>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Roadmap
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
