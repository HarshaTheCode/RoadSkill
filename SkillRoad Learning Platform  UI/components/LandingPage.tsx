import { useState } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  BookOpen, 
  Target, 
  Award, 
  TrendingUp, 
  Users, 
  Clock,
  Star,
  ChevronRight,
  Sparkles,
  Zap,
  Trophy,
  Rocket,
  Brain,
  CheckCircle,
  PlayCircle,
  Code,
  Gamepad2
} from 'lucide-react';

interface LandingPageProps {
  onStartJourney: (jobRole: string, skillLevel: string) => void;
}

export default function LandingPage({ onStartJourney }: LandingPageProps) {
  const [jobRole, setJobRole] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const jobRoles = [
    'Web Developer',
    'Data Scientist',
    'Mobile App Developer',
    'UI/UX Designer',
    'Digital Marketer',
    'DevOps Engineer',
    'AI/ML Engineer',
    'Cybersecurity Analyst',
    'Game Developer',
    'Blockchain Developer',
    'Product Manager',
    'Cloud Architect'
  ];

  const skillLevels = [
    'Complete Beginner',
    'Some Experience',
    'Intermediate',
    'Advanced'
  ];

  const handleSubmit = () => {
    if (jobRole && skillLevel) {
      setIsAnimating(true);
      setTimeout(() => {
        onStartJourney(jobRole, skillLevel);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-purple-900/5 pointer-events-none"></div>
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl animate-float-gentle"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-purple-600/5 rounded-full blur-2xl animate-float-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-green-600/5 rounded-full blur-3xl animate-float-gentle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-orange-600/5 rounded-full blur-2xl animate-float-gentle" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 animate-slide-up">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-dark-blue rounded-xl flex items-center justify-center shadow-lg animate-glow-subtle">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              SkillRoad
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="px-3 py-1 hover-glow bg-gray-800 border-gray-700 text-blue-400">
              <Users className="w-4 h-4 mr-1" />
              <span>50,000+ Students</span>
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 hover-glow bg-gray-800 border-gray-700 text-yellow-400">
              <Star className="w-4 h-4 mr-1" />
              <span>4.9 Rating</span>
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
            Master Job-Ready Skills with
            <span className="block mt-2 gradient-text-multi animate-gradient-flow">
              AI-Powered Roadmaps
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get personalized learning paths curated from the best free YouTube content. 
            Track your progress, take assessments, and land your dream job faster than ever.
          </p>

          {/* Interactive Stats */}
          <div className="flex justify-center space-x-8 mb-12 animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center hover-lift">
              <div className="text-3xl font-bold text-blue-400 animate-pulse-subtle">500+</div>
              <div className="text-gray-400 text-sm">Career Paths</div>
            </div>
            <div className="text-center hover-lift">
              <div className="text-3xl font-bold text-green-400 animate-pulse-subtle" style={{ animationDelay: '0.3s' }}>98%</div>
              <div className="text-gray-400 text-sm">Success Rate</div>
            </div>
            <div className="text-center hover-lift">
              <div className="text-3xl font-bold text-purple-400 animate-pulse-subtle" style={{ animationDelay: '0.6s' }}>24/7</div>
              <div className="text-gray-400 text-sm">AI Support</div>
            </div>
          </div>

          {/* Job Input Form */}
          <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 gradient-dark-blue rounded-full flex items-center justify-center mr-3 animate-glow-subtle">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Start Your Learning Journey</h2>
            </div>
            <div className="space-y-6">
              <div className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
                <label className="block text-sm font-medium text-blue-400 mb-3">
                  What job role are you targeting?
                </label>
                <Select value={jobRole} onValueChange={setJobRole}>
                  <SelectTrigger className="w-full h-12 text-left hover-border bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Select your dream job..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {jobRoles.map((role) => (
                      <SelectItem 
                        key={role} 
                        value={role} 
                        className="text-white hover:bg-gray-800 focus:bg-gray-800"
                      >
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="animate-slide-up" style={{ animationDelay: '1s' }}>
                <label className="block text-sm font-medium text-green-400 mb-3">
                  What's your current skill level?
                </label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger className="w-full h-12 text-left hover-border bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Select your level..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {skillLevels.map((level) => (
                      <SelectItem 
                        key={level} 
                        value={level} 
                        className="text-white hover:bg-gray-800 focus:bg-gray-800"
                      >
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={!jobRole || !skillLevel || isAnimating}
                className={`w-full h-14 text-lg font-semibold btn-dark-primary animate-slide-up ${
                  isAnimating ? 'opacity-75' : 'hover-lift'
                }`}
                style={{ animationDelay: '1.2s' }}
              >
                {isAnimating ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Creating Your Roadmap...
                  </div>
                ) : (
                  <>
                    <PlayCircle className="w-6 h-6 mr-3" />
                    Launch My Career Journey
                    <ChevronRight className="w-6 h-6 ml-3" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Value Propositions */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 animate-slide-up" style={{ animationDelay: '1.4s' }}>
          <Card className="dark-card hover-lift group">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-800/50 transition-colors duration-300">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-white">Personalized Roadmaps</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-300">
                AI analyzes job requirements and creates custom learning paths tailored to your goals and current skill level.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="dark-card hover-lift group" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <div className="w-16 h-16 bg-green-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-800/50 transition-colors duration-300">
                <BookOpen className="w-8 h-8 text-green-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-white">Free YouTube Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-300">
                Access the best free educational content from YouTube, carefully curated and organized for optimal learning.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="dark-card hover-lift group" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <div className="w-16 h-16 bg-purple-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-800/50 transition-colors duration-300">
                <Award className="w-8 h-8 text-purple-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-white">Job-Ready Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-300">
                Take quizzes and mock interviews to test your knowledge and build confidence for real job applications.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 animate-slide-up" style={{ animationDelay: '1.6s' }}>
          <Card className="glass-card hover-lift">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-white">Gamified Learning</CardTitle>
                  <CardDescription className="text-gray-400">Level up your skills with achievements!</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Badges & Achievements</span>
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Learning Streaks</span>
                  <div className="text-orange-400 font-semibold">7 days!</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Real-time Progress</span>
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full gradient-dark-blue rounded-full animate-gradient-flow"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-white">AI-Powered Learning</CardTitle>
                  <CardDescription className="text-gray-400">Smart technology for smarter learning!</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Adaptive Difficulty</span>
                  <Code className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Smart Recommendations</span>
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Instant Feedback</span>
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="glass-card rounded-2xl p-8 animate-scale-in" style={{ animationDelay: '1.8s' }}>
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            Join the Future of Learning
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="hover-lift animate-slide-up" style={{ animationDelay: '2s' }}>
              <div className="text-4xl font-bold text-blue-400 mb-2 animate-pulse-subtle">50K+</div>
              <div className="text-gray-400">Students Enrolled</div>
            </div>
            <div className="hover-lift animate-slide-up" style={{ animationDelay: '2.2s' }}>
              <div className="text-4xl font-bold text-green-400 mb-2 animate-pulse-subtle">500+</div>
              <div className="text-gray-400">Career Paths</div>
            </div>
            <div className="hover-lift animate-slide-up" style={{ animationDelay: '2.4s' }}>
              <div className="text-4xl font-bold text-purple-400 mb-2 animate-pulse-subtle">98%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
            <div className="hover-lift animate-slide-up" style={{ animationDelay: '2.6s' }}>
              <div className="text-4xl font-bold text-orange-400 mb-2 animate-pulse-subtle">4.9/5</div>
              <div className="text-gray-400">Student Rating</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '2.8s' }}>
          <p className="text-gray-400 mb-6">
            Ready to transform your career? Join thousands of successful learners today.
          </p>
          <div className="flex justify-center space-x-4">
            <Button className="btn-dark-secondary hover-glow">
              <Clock className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}