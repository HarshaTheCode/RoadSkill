import { useState } from 'react';
import { LearningPath, Module } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Video,
  ChevronRight,
  Award,
  Target,
  Zap,
  Trophy,
  Star,
  Rocket,
  PlayCircle
} from 'lucide-react';

interface RoadmapViewProps {
  learningPath: LearningPath;
  onUpdateProgress: (moduleId: string, progress: number) => void;
}

export default function RoadmapView({ learningPath, onUpdateProgress }: RoadmapViewProps) {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [watchingVideo, setWatchingVideo] = useState<string | null>(null);

  const handleWatchVideo = (videoId: string) => {
    setWatchingVideo(videoId);
    // Simulate video completion after 3 seconds for demo
    setTimeout(() => {
      setWatchingVideo(null);
    }, 3000);
  };

  const handleModuleComplete = (moduleId: string) => {
    onUpdateProgress(moduleId, 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-2xl p-8 gradient-dark-blue text-white animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-4xl font-bold mb-2">
              {learningPath.jobRole} Learning Path
            </h2>
            <p className="text-blue-100 mb-4">
              Estimated Duration: {learningPath.estimatedDuration} • {learningPath.totalHours} total hours
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center hover-scale">
                <Target className="w-5 h-5 mr-2 animate-pulse-subtle" />
                <span>Skill Level: {learningPath.skillLevel}</span>
              </div>
              <div className="flex items-center hover-scale">
                <BookOpen className="w-5 h-5 mr-2 animate-pulse-subtle" />
                <span>{learningPath.modules.length} Modules</span>
              </div>
            </div>
          </div>
          <div className="animate-float-gentle">
            <Rocket className="w-16 h-16 text-blue-200 animate-glow-subtle" />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Animated Timeline Line */}
        <div className="absolute left-8 top-6 bottom-6 w-1 rounded-full hidden md:block">
          <div className="w-full h-full gradient-dark-blue opacity-60"></div>
          <div className="absolute inset-0 gradient-dark-blue opacity-40 blur-sm"></div>
        </div>

        <div className="space-y-6">
          {learningPath.modules.map((module, index) => (
            <div key={module.id} className={`relative animate-slide-in-right`} style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Timeline Node */}
              <div className="absolute left-6 top-6 w-6 h-6 rounded-full border-4 border-background shadow-lg hidden md:flex items-center justify-center gradient-dark-blue animate-glow-subtle">
                {module.isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                )}
              </div>
              
              <Card className={`ml-0 md:ml-16 dark-card hover-lift transition-all duration-500 ${
                expandedModule === module.id ? 'ring-2 ring-blue-500/50 shadow-2xl animate-glow-subtle' : 'hover-glow'
              }`}>
                <CardHeader className="cursor-pointer group" onClick={() => 
                  setExpandedModule(expandedModule === module.id ? null : module.id)
                }>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-3 mb-3">
                        <Badge variant="outline" className="text-xs status-dark-info animate-pulse-subtle">
                          Module {index + 1}
                        </Badge>
                        {module.isCompleted && (
                          <div className="flex items-center space-x-1 animate-bounce-gentle">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span className="text-green-400 text-sm font-semibold">COMPLETED!</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 text-xs font-medium">+{(index + 1) * 100} XP</span>
                        </div>
                      </div>
                      <CardTitle className="text-2xl mb-3 text-white group-hover:text-blue-400 transition-colors duration-300">
                        {module.title}
                      </CardTitle>
                      <CardDescription className="text-base mb-4 text-gray-300">
                        {module.description}
                      </CardDescription>
                      <div className="flex items-center flex-wrap gap-4 text-sm text-gray-400">
                        <div className="flex items-center hover-scale">
                          <Clock className="w-4 h-4 mr-1 text-blue-400" />
                          <span className="text-blue-400">{module.estimatedHours}h</span>
                        </div>
                        <div className="flex items-center hover-scale">
                          <Video className="w-4 h-4 mr-1 text-green-400" />
                          <span className="text-green-400">{module.videos.length} videos</span>
                        </div>
                        <div className="flex items-center hover-scale">
                          <Award className="w-4 h-4 mr-1 text-purple-400" />
                          <span className="text-purple-400">{module.quizzes.length} quiz{module.quizzes.length !== 1 ? 'es' : ''}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-8 h-8 text-gray-400 transition-all duration-300 group-hover:text-blue-400 ${
                      expandedModule === module.id ? 'rotate-90 text-blue-400' : ''
                    }`} />
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="font-medium text-blue-400">{module.progress}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={module.progress} className="h-3 bg-gray-800" />
                      <div className="absolute inset-0 gradient-dark-blue rounded-full opacity-80 animate-gradient-flow"></div>
                    </div>
                  </div>
                </CardHeader>

                {/* Expanded Content */}
                {expandedModule === module.id && (
                  <CardContent className="pt-0 animate-slide-up">
                    <div className="space-y-6">
                      {/* Videos Section */}
                      <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <h4 className="font-semibold text-lg mb-4 flex items-center text-white">
                          <Video className="w-5 h-5 mr-2 text-green-400 animate-pulse-subtle" />
                          Video Lessons
                        </h4>
                        <div className="space-y-3">
                          {module.videos.map((video, videoIndex) => (
                            <div key={video.id} className={`flex items-center space-x-4 p-4 dark-card hover-lift animate-slide-in-right`} style={{ animationDelay: `${videoIndex * 0.1}s` }}>
                              <div className="relative flex-shrink-0 group">
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  className="w-32 h-20 object-cover rounded-lg border border-gray-600"
                                />
                                {watchingVideo === video.id ? (
                                  <div className="absolute inset-0 bg-black bg-opacity-80 rounded-lg flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    className="absolute inset-0 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-lg btn-dark-primary group-hover:animate-pulse"
                                    onClick={() => handleWatchVideo(video.id)}
                                  >
                                    <PlayCircle className="w-8 h-8 text-white" />
                                  </Button>
                                )}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-white mb-1">{video.title}</h5>
                                <p className="text-sm text-gray-400 mb-2">{video.duration}</p>
                                <div className="flex items-center space-x-2">
                                  <Badge className="text-xs status-dark-info">
                                    HD Quality
                                  </Badge>
                                  <Badge className="text-xs status-dark-success">
                                    +50 XP
                                  </Badge>
                                </div>
                              </div>
                              {video.isWatched && (
                                <div className="flex items-center space-x-2 animate-bounce-gentle">
                                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                                  <span className="text-green-400 text-sm font-semibold">Watched</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quizzes Section */}
                      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <h4 className="font-semibold text-lg mb-4 flex items-center text-white">
                          <Award className="w-5 h-5 mr-2 text-purple-400 animate-pulse-subtle" />
                          Practice Quizzes
                        </h4>
                        <div className="space-y-3">
                          {module.quizzes.map((quiz, quizIndex) => (
                            <div key={quiz.id} className={`flex items-center justify-between p-4 status-dark-purple rounded-lg hover-lift animate-slide-in-right`} style={{ animationDelay: `${quizIndex * 0.1}s` }}>
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center animate-pulse-subtle">
                                  <Zap className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                  <h5 className="font-medium text-white">{quiz.title}</h5>
                                  <p className="text-sm text-purple-300">{quiz.questions} questions</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge className="text-xs bg-purple-600/20 text-purple-300 border-purple-600/30">
                                      +{quiz.questions * 10} XP
                                    </Badge>
                                    <Badge className="text-xs bg-purple-600/20 text-purple-300 border-purple-600/30">
                                      Skill Test
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                {quiz.isCompleted && quiz.score && (
                                  <Badge className="status-dark-success animate-glow-subtle">
                                    🏆 Score: {quiz.score}%
                                  </Badge>
                                )}
                                <Button
                                  variant={quiz.isCompleted ? "outline" : "default"}
                                  size="sm"
                                  className={quiz.isCompleted ? 'border-green-500/50 text-green-400 hover:bg-green-500/10' : 'btn-dark-primary hover-lift'}
                                >
                                  {quiz.isCompleted ? (
                                    <>
                                      <Trophy className="w-4 h-4 mr-1 animate-bounce-gentle" />
                                      Retake Quiz
                                    </>
                                  ) : (
                                    <>
                                      <Zap className="w-4 h-4 mr-1 animate-pulse-subtle" />
                                      Start Quiz
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Module Actions */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-6 border-t border-gray-700 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="text-sm text-gray-400 flex items-center">
                          <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
                          Complete all videos and quizzes to unlock the next level!
                        </div>
                        <Button
                          onClick={() => handleModuleComplete(module.id)}
                          disabled={module.isCompleted}
                          className={`${module.isCompleted ? 'gradient-dark-green text-white' : 'btn-dark-primary'} hover-lift animate-glow-subtle`}
                        >
                          {module.isCompleted ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 mr-2 animate-bounce-gentle" />
                              Module Completed!
                            </>
                          ) : (
                            <>
                              <Target className="w-5 h-5 mr-2 animate-pulse-subtle" />
                              Mark as Complete
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          ))}
        </div>

        {/* Completion Celebration */}
        {learningPath.modules.every(module => module.isCompleted) && (
          <div className="glass-card rounded-2xl p-8 text-center animate-scale-in gradient-dark-green text-white">
            <div className="animate-float-gentle mb-4">
              <Trophy className="w-24 h-24 text-yellow-300 mx-auto animate-glow-subtle" />
            </div>
            <h2 className="text-4xl font-bold mb-4 animate-bounce-gentle">
              🎉 CONGRATULATIONS! 🎉
            </h2>
            <p className="text-xl mb-6 text-green-100">
              You've completed your {learningPath.jobRole} learning journey! 
              You're now ready to land that dream job! 💼✨
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="btn-dark-secondary bg-white/10 text-white hover:bg-white/20 border-white/20">
                <Trophy className="w-5 h-5 mr-2" />
                View Certificate
              </Button>
              <Button className="btn-dark-secondary bg-white/10 text-white hover:bg-white/20 border-white/20">
                <Rocket className="w-5 h-5 mr-2" />
                Start New Path
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}