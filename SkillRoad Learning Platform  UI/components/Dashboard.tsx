import { useState, useEffect } from 'react';
import { User, LearningPath } from '../types';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  Home, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Target,
  Clock,
  Trophy,
  Zap,
  CheckCircle,
  Star,
  Flame,
  BarChart3
} from 'lucide-react';
import RoadmapView from './RoadmapView';
import ProgressView from './ProgressView';
import AssessmentView from './AssessmentView';

interface DashboardProps {
  user: User;
  learningPath: LearningPath;
  onBackToLanding: () => void;
  onUpdateProgress: (moduleId: string, progress: number) => void;
}

type ViewType = 'overview' | 'roadmap' | 'progress' | 'assessments' | 'settings';

export default function Dashboard({ user, learningPath, onBackToLanding, onUpdateProgress }: DashboardProps) {
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState(3);

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home, color: 'blue' },
    { id: 'roadmap', label: 'My Roadmap', icon: BookOpen, color: 'green' },
    { id: 'progress', label: 'Progress', icon: TrendingUp, color: 'purple' },
    { id: 'assessments', label: 'Assessments', icon: Award, color: 'orange' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'gray' },
  ];

  const overallProgress = Math.round(
    learningPath.modules.reduce((acc, module) => acc + module.progress, 0) / learningPath.modules.length
  );

  const completedModules = learningPath.modules.filter(module => module.isCompleted).length;

  // Simulate learning streak
  const [streak, setStreak] = useState(7);
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        setStreak(prev => prev + 1);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 glass-card shadow-2xl transform transition-all duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0 animate-slide-in-right' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3 animate-scale-in">
              <div className="w-10 h-10 gradient-dark-blue rounded-xl flex items-center justify-center animate-glow-subtle">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-white">
                SkillRoad
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-gray-700 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="w-12 h-12 ring-2 ring-blue-600/50 animate-glow-subtle">
                <AvatarFallback className="gradient-dark-blue text-white font-bold">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-white">{user.name}</h3>
                <p className="text-sm text-blue-400">Learning {learningPath.jobRole}</p>
              </div>
            </div>
            
            {/* Streak Counter */}
            <div className="flex items-center space-x-2 mb-4 p-3 rounded-lg status-dark-warning animate-pulse-subtle">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-orange-300 font-semibold">{streak} Day Streak!</span>
              <div className="text-orange-400">🔥</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Overall Progress</span>
                <span className="font-semibold text-blue-400">{overallProgress}%</span>
              </div>
              <div className="relative">
                <Progress value={overallProgress} className="h-3 bg-gray-800" />
                <div className="absolute inset-0 gradient-dark-blue rounded-full opacity-80"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{completedModules}/{learningPath.modules.length} modules</span>
                <span>Level {Math.floor(overallProgress / 20) + 1}</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <ul className="space-y-2">
              {sidebarItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <li key={item.id} className="animate-slide-in-right" style={{ animationDelay: `${0.05 * index}s` }}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start text-left h-11 transition-all duration-300 ${
                        isActive 
                          ? "gradient-dark-blue text-white shadow-lg animate-glow-subtle" 
                          : "text-gray-400 hover:text-white hover:bg-gray-800/50 hover-glow"
                      }`}
                      onClick={() => {
                        setCurrentView(item.id as ViewType);
                        setSidebarOpen(false);
                      }}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                      {item.id === 'assessments' && (
                        <Trophy className="w-4 h-4 ml-auto text-yellow-400" />
                      )}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-300"
              onClick={onBackToLanding}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Back to Landing
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="glass-card border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mr-3 text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-semibold text-white capitalize">
              {currentView === 'overview' ? 'Dashboard Overview' : 
               currentView === 'roadmap' ? 'Learning Roadmap' :
               currentView === 'progress' ? 'Progress Tracking' :
               currentView === 'assessments' ? 'Assessments' : 'Settings'}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800 hover-glow">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800 hover-glow relative">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white animate-pulse-subtle">
                  {notifications}
                </div>
              )}
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto bg-background">
          {currentView === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="glass-card rounded-2xl p-8 gradient-dark-blue text-white animate-scale-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      Welcome back, {user.name}! 👋
                    </h2>
                    <p className="text-blue-100 mb-4">
                      You're making excellent progress on your path to becoming a {learningPath.jobRole}. Keep pushing forward!
                    </p>
                  </div>
                  <div className="animate-float-gentle">
                    <BarChart3 className="w-16 h-16 text-blue-200" />
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="text-center hover-scale animate-bounce-gentle">
                    <div className="text-3xl font-bold">{completedModules}</div>
                    <div className="text-blue-100 text-sm">Modules Completed</div>
                  </div>
                  <div className="text-center hover-scale animate-bounce-gentle" style={{ animationDelay: '0.2s' }}>
                    <div className="text-3xl font-bold">{overallProgress}%</div>
                    <div className="text-blue-100 text-sm">Overall Progress</div>
                  </div>
                  <div className="text-center hover-scale animate-bounce-gentle" style={{ animationDelay: '0.4s' }}>
                    <div className="text-3xl font-bold">{streak}</div>
                    <div className="text-blue-100 text-sm">Day Streak</div>
                  </div>
                  <div className="text-center hover-scale animate-bounce-gentle" style={{ animationDelay: '0.6s' }}>
                    <div className="text-3xl font-bold">{Math.floor(overallProgress / 20) + 1}</div>
                    <div className="text-blue-100 text-sm">Current Level</div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="dark-card p-6 hover-lift">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Time to Complete</p>
                      <p className="text-2xl font-semibold text-blue-400">{learningPath.estimatedDuration}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center animate-pulse-subtle">
                      <Clock className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </div>

                <div className="dark-card p-6 hover-lift">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Hours</p>
                      <p className="text-2xl font-semibold text-green-400">{learningPath.totalHours}h</p>
                    </div>
                    <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center animate-pulse-subtle" style={{ animationDelay: '0.2s' }}>
                      <BookOpen className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </div>

                <div className="dark-card p-6 hover-lift">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Skill Level</p>
                      <p className="text-2xl font-semibold text-purple-400">{learningPath.skillLevel}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center animate-pulse-subtle" style={{ animationDelay: '0.4s' }}>
                      <Target className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="dark-card rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-yellow-400 animate-bounce-gentle" />
                  Continue Your Journey
                </h3>
                <div className="space-y-4">
                  {learningPath.modules.slice(0, 2).map((module, index) => (
                    <div key={module.id} className={`flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover-lift transition-all duration-300 border border-gray-700/50 hover:border-blue-600/50 animate-slide-in-right`} style={{ animationDelay: `${0.1 * index}s` }}>
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-1">{module.title}</h4>
                        <p className="text-sm text-gray-400 mb-3">{module.description}</p>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 relative">
                            <Progress value={module.progress} className="h-2 bg-gray-700" />
                            <div className="absolute inset-0 gradient-dark-blue rounded-full opacity-80"></div>
                          </div>
                          <Badge className={`${
                            module.isCompleted ? 'status-dark-success' : 'bg-gray-700 text-gray-300'
                          }`}>
                            {module.isCompleted ? "✅ Completed" : `${module.progress}%`}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => setCurrentView('roadmap')}
                        className="ml-4 btn-dark-primary hover-lift"
                      >
                        Continue
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievement Showcase */}
              <div className="dark-card rounded-xl p-6 animate-scale-in" style={{ animationDelay: '0.6s' }}>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Trophy className="w-6 h-6 mr-2 text-yellow-400 animate-bounce-gentle" />
                  Recent Achievements
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 status-dark-warning rounded-lg hover-lift">
                    <div className="text-2xl mb-2">🏆</div>
                    <div className="text-xs text-orange-300">First Module</div>
                  </div>
                  <div className="text-center p-4 status-dark-info rounded-lg hover-lift">
                    <div className="text-2xl mb-2">🔥</div>
                    <div className="text-xs text-blue-300">Week Streak</div>
                  </div>
                  <div className="text-center p-4 status-dark-success rounded-lg hover-lift">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-xs text-green-300">Quick Learner</div>
                  </div>
                  <div className="text-center p-4 status-dark-purple rounded-lg hover-lift">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-xs text-purple-300">Goal Crusher</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'roadmap' && (
            <RoadmapView 
              learningPath={learningPath} 
              onUpdateProgress={onUpdateProgress}
            />
          )}

          {currentView === 'progress' && (
            <ProgressView learningPath={learningPath} />
          )}

          {currentView === 'assessments' && (
            <AssessmentView learningPath={learningPath} />
          )}

          {currentView === 'settings' && (
            <div className="dark-card rounded-xl p-6 animate-scale-in">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Settings className="w-6 h-6 mr-2 text-gray-400" />
                Settings Panel
              </h3>
              <p className="text-gray-400">Settings panel coming soon... Stay tuned for customization options!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}