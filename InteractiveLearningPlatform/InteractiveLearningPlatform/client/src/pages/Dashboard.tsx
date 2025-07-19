import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ModuleCard from "@/components/ModuleCard";
import AssessmentModal from "@/components/AssessmentModal";
import ResourceModal from "@/components/ResourceModal";
import { 
  MapPin, 
  User, 
  ArrowLeft, 
  Download, 
  Share2, 
  Brain,
  CheckCircle,
  Star,
  TrendingUp,
  Clock,
  Target
} from "lucide-react";

interface RoadmapWithModules {
  id: number;
  title: string;
  description: string;
  jobRole: string;
  experienceLevel: string;
  estimatedHours: number;
  isCompleted: boolean;
  modules: ModuleWithResources[];
}

interface ModuleWithResources {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  estimatedHours: number;
  isCompleted: boolean;
  isLocked: boolean;
  resources: Resource[];
  assessments: Assessment[];
  progress?: UserProgress;
}

interface Resource {
  id: number;
  title: string;
  type: string;
  url: string;
  duration: string;
  provider: string;
}

interface Assessment {
  id: number;
  title: string;
  description: string;
  questions: any[];
  passingScore: number;
}

interface UserProgress {
  id: number;
  completedAt: string | null;
  timeSpent: number;
  score: number;
}

export default function Dashboard() {
  const [, params] = useRoute("/dashboard/:roadmapId?");
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [selectedModuleResources, setSelectedModuleResources] = useState<ModuleWithResources | null>(null);

  const roadmapId = params?.roadmapId ? parseInt(params.roadmapId) : null;

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

  // Redirect to home if no roadmap ID
  useEffect(() => {
    if (!roadmapId) {
      setLocation("/");
    }
  }, [roadmapId, setLocation]);

  const { data: roadmap, isLoading: roadmapLoading } = useQuery({
    queryKey: ["/api/roadmaps", roadmapId],
    enabled: isAuthenticated && !!roadmapId,
  });

  const { data: progress } = useQuery({
    queryKey: ["/api/progress", roadmapId],
    enabled: isAuthenticated && !!roadmapId,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (data: { moduleId: number; completedAt?: Date; timeSpent?: number; score?: number }) => {
      const response = await apiRequest("POST", "/api/progress", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/roadmaps", roadmapId] });
      queryClient.invalidateQueries({ queryKey: ["/api/progress", roadmapId] });
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
        description: "Failed to update progress.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleModuleComplete = (moduleId: number) => {
    updateProgressMutation.mutate({
      moduleId,
      completedAt: new Date(),
    });
  };

  const handleAssessmentComplete = (moduleId: number, score: number) => {
    updateProgressMutation.mutate({
      moduleId,
      score,
      completedAt: score >= 70 ? new Date() : undefined,
    });
  };

  const calculateProgress = (roadmap: RoadmapWithModules) => {
    if (!roadmap.modules.length) return 0;
    const completedModules = roadmap.modules.filter(m => m.isCompleted || m.progress?.completedAt).length;
    return Math.round((completedModules / roadmap.modules.length) * 100);
  };

  const calculateTotalTimeSpent = (roadmap: RoadmapWithModules) => {
    return roadmap.modules.reduce((total, module) => {
      return total + (module.progress?.timeSpent || 0);
    }, 0);
  };

  const calculateAverageScore = (roadmap: RoadmapWithModules) => {
    const scores = roadmap.modules
      .map(m => m.progress?.score)
      .filter(score => score !== undefined && score !== null);
    
    if (!scores.length) return 0;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  if (isLoading || roadmapLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Roadmap not found</h1>
            <p className="text-gray-600 mb-4">The roadmap you're looking for doesn't exist.</p>
            <Button onClick={() => setLocation("/")} variant="outline">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPercentage = calculateProgress(roadmap);
  const totalTimeSpent = calculateTotalTimeSpent(roadmap);
  const averageScore = calculateAverageScore(roadmap);
  const completedModules = roadmap.modules.filter(m => m.isCompleted || m.progress?.completedAt).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLocation("/")}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-gray-900">SkillRoad</span>
            </div>
            
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
        {/* Roadmap Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">{roadmap.title}</h1>
                <p className="text-blue-100 mb-2">{roadmap.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <Target className="w-3 h-3 mr-1" />
                    {roadmap.jobRole}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {roadmap.experienceLevel}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{progressPercentage}%</div>
                    <div className="text-sm text-blue-100">Complete</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round(totalTimeSpent / 60)}h</div>
                    <div className="text-sm text-blue-100">Time Spent</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Modules Completed</span>
                <CheckCircle className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {completedModules}/{roadmap.modules.length}
              </div>
              <Progress value={progressPercentage} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Quiz Average</span>
                <Star className="w-5 h-5 text-accent" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{averageScore}%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Estimated Time</span>
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{roadmap.estimatedHours}h</div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Modules */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Learning Modules</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {roadmap.modules
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    onComplete={() => handleModuleComplete(module.id)}
                    onTakeAssessment={(assessment) => setSelectedAssessment(assessment)}
                    onViewResources={() => setSelectedModuleResources(module)}
                  />
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="flex-1 bg-primary text-white hover:bg-primary/90">
            <Brain className="w-4 h-4 mr-2" />
            Take Overall Assessment
          </Button>
          <Button variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Export Roadmap
          </Button>
          <Button className="flex-1 bg-accent text-white hover:bg-accent/90">
            <Share2 className="w-4 h-4 mr-2" />
            Share Progress
          </Button>
        </div>
      </main>

      {/* Assessment Modal */}
      {selectedAssessment && (
        <AssessmentModal
          assessment={selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
          onSubmit={(score) => {
            // Find the module ID for this assessment
            const module = roadmap.modules.find(m => 
              m.assessments.some(a => a.id === selectedAssessment.id)
            );
            if (module) {
              handleAssessmentComplete(module.id, score);
            }
            setSelectedAssessment(null);
          }}
        />
      )}

      {/* Resource Modal */}
      {selectedModuleResources && (
        <ResourceModal
          module={selectedModuleResources}
          onClose={() => setSelectedModuleResources(null)}
        />
      )}
    </div>
  );
}
