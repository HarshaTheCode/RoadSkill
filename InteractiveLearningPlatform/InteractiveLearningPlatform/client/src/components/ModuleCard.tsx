import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Play, 
  Lock, 
  List, 
  Brain, 
  Clock,
  BookOpen
} from "lucide-react";

interface ModuleCardProps {
  module: {
    id: number;
    title: string;
    description: string;
    estimatedHours: number;
    isCompleted: boolean;
    isLocked: boolean;
    resources: any[];
    assessments: any[];
    progress?: {
      completedAt: string | null;
      timeSpent: number;
      score: number;
    };
  };
  onComplete: () => void;
  onTakeAssessment: (assessment: any) => void;
  onViewResources: () => void;
}

export default function ModuleCard({ 
  module, 
  onComplete, 
  onTakeAssessment, 
  onViewResources 
}: ModuleCardProps) {
  const isCompleted = module.isCompleted || module.progress?.completedAt;
  const isInProgress = !isCompleted && !module.isLocked;
  const hasAssessment = module.assessments.length > 0;
  
  // Calculate progress based on resources viewed/completed
  const progressPercentage = isCompleted ? 100 : isInProgress ? 50 : 0;

  const getStatusColor = () => {
    if (isCompleted) return "bg-secondary/5 border-secondary/20";
    if (isInProgress) return "bg-primary/5 border-primary border-2";
    return "bg-gray-50 opacity-75";
  };

  const getStatusIcon = () => {
    if (isCompleted) {
      return <CheckCircle className="w-4 h-4 text-white" />;
    }
    if (isInProgress) {
      return <Play className="w-4 h-4 text-white" />;
    }
    return <Lock className="w-4 h-4 text-white" />;
  };

  const getStatusIconBg = () => {
    if (isCompleted) return "bg-secondary";
    if (isInProgress) return "bg-primary";
    return "bg-gray-400";
  };

  const getStatusText = () => {
    if (isCompleted) return "Completed";
    if (isInProgress) return "In Progress";
    return "Locked";
  };

  const getStatusTextColor = () => {
    if (isCompleted) return "text-secondary";
    if (isInProgress) return "text-primary";
    return "text-gray-500";
  };

  return (
    <div className={`border rounded-xl p-4 transition-all ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusIconBg()}`}>
            {getStatusIcon()}
          </div>
          <div className="flex-1">
            <h5 className={`font-semibold ${module.isLocked ? 'text-gray-600' : 'text-gray-900'}`}>
              {module.title}
            </h5>
            <p className={`text-sm ${module.isLocked ? 'text-gray-500' : 'text-gray-600'}`}>
              {module.description}
            </p>
          </div>
        </div>
        <Badge variant="outline" className={`${getStatusTextColor()} border-current`}>
          {getStatusText()}
        </Badge>
      </div>

      {/* Progress bar for in-progress modules */}
      {isInProgress && (
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{module.resources.length} resources available</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      )}

      {/* Module stats */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {module.estimatedHours}h estimated
          </div>
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            {module.resources.length} resources
          </div>
        </div>
        {module.progress?.score && (
          <span className="font-medium">Score: {module.progress.score}%</span>
        )}
      </div>

      {/* Action buttons */}
      {isCompleted ? (
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={onViewResources}>
              <List className="w-3 h-3 mr-1" />
              Review Resources
            </Button>
            {hasAssessment && (
              <Button size="sm" variant="outline" onClick={() => onTakeAssessment(module.assessments[0])}>
                <Brain className="w-3 h-3 mr-1" />
                Retake Quiz
              </Button>
            )}
          </div>
          <span className="text-sm font-medium text-secondary">
            ✓ Completed
          </span>
        </div>
      ) : isInProgress ? (
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button size="sm" className="bg-primary text-white hover:bg-primary/90" onClick={onViewResources}>
              <Play className="w-3 h-3 mr-1" />
              Continue Learning
            </Button>
            <Button size="sm" variant="outline" onClick={onViewResources}>
              <List className="w-3 h-3 mr-1" />
              View Resources
            </Button>
            {hasAssessment && (
              <Button size="sm" variant="outline" onClick={() => onTakeAssessment(module.assessments[0])}>
                <Brain className="w-3 h-3 mr-1" />
                Take Quiz
              </Button>
            )}
          </div>
          <span className="text-sm text-gray-600">
            {module.estimatedHours}h remaining
          </span>
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          Complete previous modules to unlock
        </div>
      )}
    </div>
  );
}
