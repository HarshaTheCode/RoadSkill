import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Brain, 
  Route, 
  Youtube, 
  ClipboardCheck, 
  TrendingUp, 
  Briefcase, 
  Download,
  Star,
  CheckCircle,
  Play,
  List,
  Lock,
  User,
  MapPin,
  Target,
  Zap
} from "lucide-react";

export default function Landing() {
  const [jobRole, setJobRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");

  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  const features = [
    {
      icon: Route,
      title: "Smart Roadmaps",
      description: "AI analyzes real job requirements and creates step-by-step learning paths tailored to your experience level.",
      color: "primary"
    },
    {
      icon: Youtube,
      title: "Curated Resources",
      description: "High-quality YouTube videos and tutorials selected by AI based on views, ratings, and content quality.",
      color: "secondary"
    },
    {
      icon: ClipboardCheck,
      title: "Mock Assessments",
      description: "Practice with AI-generated quizzes and interview questions to validate your knowledge and build confidence.",
      color: "accent"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Visual dashboard to monitor your learning progress, completed modules, and time invested.",
      color: "yellow"
    },
    {
      icon: Briefcase,
      title: "Job-Ready Skills",
      description: "Skills mapped to real job requirements from top companies and hiring platforms.",
      color: "emerald"
    },
    {
      icon: Download,
      title: "Export & Share",
      description: "Download your roadmap as PDF or share your learning progress with potential employers.",
      color: "pink"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-gray-900">SkillRoad</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#home" className="text-gray-600 hover:text-primary transition-colors">Home</a>
              <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a>
              <a href="#dashboard" className="text-gray-600 hover:text-primary transition-colors">Dashboard</a>
            </div>

            <div className="flex items-center space-x-3">
              <Button onClick={handleSignIn} className="bg-primary text-white hover:bg-primary/90">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="gradient-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your AI-Powered
                <span className="gradient-text block">Learning Journey</span>
                Starts Here
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Get personalized learning roadmaps powered by AI. From beginner to job-ready in any tech skill with curated YouTube resources and mock assessments.
              </p>
              
              {/* Job Input Form */}
              <Card className="shadow-lg border border-gray-100">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">What do you want to learn?</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="jobRole" className="text-sm font-medium text-gray-700 mb-2">
                        Job Role or Skill
                      </Label>
                      <div className="relative">
                        <Input
                          id="jobRole"
                          type="text"
                          placeholder="e.g., Web Developer, Data Scientist, Python"
                          value={jobRole}
                          onChange={(e) => setJobRole(e.target.value)}
                          className="pr-10"
                        />
                        <Target className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="experienceLevel" className="text-sm font-medium text-gray-700 mb-2">
                        Experience Level
                      </Label>
                      <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={handleSignIn}
                      className="w-full bg-primary text-white py-3 px-6 hover:bg-primary/90 font-medium text-lg"
                      size="lg"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Generate My Roadmap
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="hidden lg:block">
              {/* Modern learning illustration */}
              <div className="relative">
                <div className="w-96 h-96 mx-auto relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl transform rotate-6"></div>
                  <div className="absolute inset-4 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Brain className="text-white w-12 h-12" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered</h3>
                      <p className="text-gray-600">Personalized roadmaps tailored to your goals</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From skill identification to job readiness, our AI-powered platform guides you every step of the way.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-slate-50 card-hover">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      feature.color === 'primary' ? 'bg-primary/10' :
                      feature.color === 'secondary' ? 'bg-secondary/10' :
                      feature.color === 'accent' ? 'bg-accent/10' :
                      feature.color === 'yellow' ? 'bg-yellow-500/10' :
                      feature.color === 'emerald' ? 'bg-emerald-500/10' :
                      'bg-pink-500/10'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        feature.color === 'primary' ? 'text-primary' :
                        feature.color === 'secondary' ? 'text-secondary' :
                        feature.color === 'accent' ? 'text-accent' :
                        feature.color === 'yellow' ? 'text-yellow-500' :
                        feature.color === 'emerald' ? 'text-emerald-500' :
                        'text-pink-500'
                      }`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="dashboard" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Your Learning Dashboard</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Track your progress, access resources, and take assessments all in one place.
            </p>
          </div>
          
          {/* Dashboard Mock */}
          <Card className="shadow-xl overflow-hidden">
            {/* Dashboard Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Web Developer Roadmap</h3>
                  <p className="text-blue-100">Beginner Level</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">65%</div>
                      <div className="text-sm text-blue-100">Complete</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">47h</div>
                      <div className="text-sm text-blue-100">Time Spent</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Dashboard Content */}
            <CardContent className="p-6">
              {/* Progress Overview */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-secondary/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Modules Completed</span>
                    <CheckCircle className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">8/12</div>
                </div>
                
                <div className="bg-accent/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Quiz Average</span>
                    <Star className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">87%</div>
                </div>
                
                <div className="bg-yellow-500/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Streak</span>
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">12 days</div>
                </div>
              </div>
              
              {/* Roadmap Modules */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Learning Modules</h4>
                
                {/* Module 1 - Completed */}
                <div className="border border-gray-200 rounded-xl p-4 bg-secondary/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">HTML & CSS Fundamentals</h5>
                        <p className="text-sm text-gray-600">Master the building blocks of web development</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-secondary">Completed</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Estimated time: 12 hours</span>
                    <span>Score: 92%</span>
                  </div>
                </div>
                
                {/* Module 2 - In Progress */}
                <div className="border-2 border-primary rounded-xl p-4 bg-primary/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">JavaScript Essentials</h5>
                        <p className="text-sm text-gray-600">Learn programming logic and DOM manipulation</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-primary">In Progress</span>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>7/10 videos watched</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                        <Play className="w-3 h-3 mr-1" />
                        Continue
                      </Button>
                      <Button size="sm" variant="outline">
                        <List className="w-3 h-3 mr-1" />
                        Resources
                      </Button>
                    </div>
                    <span className="text-sm text-gray-600">8h remaining</span>
                  </div>
                </div>
                
                {/* Module 3 - Locked */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 opacity-75">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-600">React Framework</h5>
                        <p className="text-sm text-gray-500">Build dynamic user interfaces</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-500">Locked</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Complete JavaScript Essentials to unlock
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                <Button className="flex-1 bg-primary text-white hover:bg-primary/90">
                  <Brain className="w-4 h-4 mr-2" />
                  Take Assessment
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export Roadmap
                </Button>
                <Button className="flex-1 bg-accent text-white hover:bg-accent/90">
                  <User className="w-4 h-4 mr-2" />
                  Share Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <MapPin className="text-white w-4 h-4" />
                </div>
                <span className="text-xl font-bold">SkillRoad</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering learners with AI-powered roadmaps for career success.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmaps</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Assessments</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-sm">𝕏</span>
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-sm">in</span>
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-sm">gh</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 SkillRoad. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
