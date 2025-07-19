import { LearningPath } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Target,
  Calendar,
  Award,
  BookOpen
} from 'lucide-react';

interface ProgressViewProps {
  learningPath: LearningPath;
}

export default function ProgressView({ learningPath }: ProgressViewProps) {
  const completedModules = learningPath.modules.filter(m => m.isCompleted).length;
  const totalModules = learningPath.modules.length;
  const overallProgress = Math.round(
    learningPath.modules.reduce((acc, module) => acc + module.progress, 0) / learningPath.modules.length
  );

  const completedVideos = learningPath.modules.reduce((acc, module) => 
    acc + module.videos.filter(v => v.isWatched).length, 0
  );
  const totalVideos = learningPath.modules.reduce((acc, module) => acc + module.videos.length, 0);

  const completedQuizzes = learningPath.modules.reduce((acc, module) => 
    acc + module.quizzes.filter(q => q.isCompleted).length, 0
  );
  const totalQuizzes = learningPath.modules.reduce((acc, module) => acc + module.quizzes.length, 0);

  const averageQuizScore = learningPath.modules.reduce((acc, module) => {
    const moduleScores = module.quizzes.filter(q => q.score !== null).map(q => q.score!);
    return acc + (moduleScores.length > 0 ? moduleScores.reduce((a, b) => a + b, 0) / moduleScores.length : 0);
  }, 0) / learningPath.modules.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Your Learning Progress</h2>
        <p className="text-purple-100 mb-4">
          Track your journey to becoming a {learningPath.jobRole}
        </p>
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{overallProgress}%</div>
            <div className="text-purple-100 text-sm">Overall Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{completedModules}</div>
            <div className="text-purple-100 text-sm">Modules Done</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{Math.round(averageQuizScore)}%</div>
            <div className="text-purple-100 text-sm">Avg Quiz Score</div>
          </div>
        </div>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modules</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedModules}/{totalModules}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((completedModules / totalModules) * 100)}% complete
            </p>
            <Progress value={(completedModules / totalModules) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos Watched</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedVideos}/{totalVideos}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((completedVideos / totalVideos) * 100)}% complete
            </p>
            <Progress value={(completedVideos / totalVideos) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedQuizzes}/{totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((completedQuizzes / totalQuizzes) * 100)}% complete
            </p>
            <Progress value={(completedQuizzes / totalQuizzes) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(learningPath.totalHours * (overallProgress / 100))}h
            </div>
            <p className="text-xs text-muted-foreground">
              of {learningPath.totalHours}h total
            </p>
            <Progress value={overallProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Module Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Module-by-Module Breakdown
          </CardTitle>
          <CardDescription>
            Detailed progress for each module in your learning path
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {learningPath.modules.map((module, index) => (
              <div key={module.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-xs">
                      Module {index + 1}
                    </Badge>
                    <h4 className="font-medium">{module.title}</h4>
                    {module.isCompleted && (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {module.progress}% complete
                  </div>
                </div>
                
                <Progress value={module.progress} className="h-3" />
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    Videos: {module.videos.filter(v => v.isWatched).length}/{module.videos.length}
                  </span>
                  <span>
                    Quizzes: {module.quizzes.filter(q => q.isCompleted).length}/{module.quizzes.length}
                  </span>
                  <span>
                    Est. Time: {module.estimatedHours}h
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-600" />
            Learning Timeline
          </CardTitle>
          <CardDescription>
            Your projected completion dates based on current progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <div>
                <h4 className="font-medium text-green-800">Started Learning</h4>
                <p className="text-sm text-green-600">
                  {new Date(learningPath.createdAt).toLocaleDateString()}
                </p>
              </div>
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            
            {overallProgress > 0 && (
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-blue-800">Current Progress</h4>
                  <p className="text-sm text-blue-600">
                    {overallProgress}% of learning path completed
                  </p>
                </div>
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-700">Estimated Completion</h4>
                <p className="text-sm text-gray-600">
                  {new Date(Date.now() + ((100 - overallProgress) / 100) * 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
              <Target className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}