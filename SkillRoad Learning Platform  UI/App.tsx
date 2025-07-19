import { useState, useEffect, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import { User, LearningPath, Module, Video, Quiz } from './types';

type AppState = 'loading' | 'landing' | 'onboarding' | 'dashboard' | 'error';

interface OnboardingData {
  jobRole: string;
  skillLevel: string;
  name?: string;
  preferences?: {
    learningStyle: 'visual' | 'practical' | 'mixed';
    timeCommitment: 'casual' | 'regular' | 'intensive';
    goals: string[];
  };
}

// Professional course data templates
const COURSE_TEMPLATES = {
  'Web Developer': {
    totalHours: 220,
    estimatedDuration: '4-5 months',
    modules: [
      {
        title: 'Web Development Fundamentals',
        description: 'HTML5, CSS3, and modern web standards. Build your first responsive websites.',
        hours: 45,
        videos: [
          { title: 'Modern HTML5 Structure & Semantics', duration: '18:30' },
          { title: 'CSS Grid & Flexbox Mastery', duration: '24:15' },
          { title: 'Responsive Design Principles', duration: '19:45' },
          { title: 'Web Accessibility Best Practices', duration: '16:20' }
        ],
        quizzes: [
          { title: 'HTML & CSS Fundamentals', questions: 15 },
          { title: 'Responsive Design Challenge', questions: 12 }
        ]
      },
      {
        title: 'JavaScript & Modern ES6+',
        description: 'Master JavaScript fundamentals, ES6+ features, DOM manipulation, and async programming.',
        hours: 60,
        videos: [
          { title: 'JavaScript Fundamentals Deep Dive', duration: '32:45' },
          { title: 'ES6+ Features: Let, Const, Arrow Functions', duration: '28:20' },
          { title: 'Async/Await and Promises Mastery', duration: '35:15' },
          { title: 'DOM Manipulation & Event Handling', duration: '26:30' }
        ],
        quizzes: [
          { title: 'JavaScript Core Concepts', questions: 20 },
          { title: 'Async Programming Assessment', questions: 15 },
          { title: 'DOM Manipulation Challenge', questions: 18 }
        ]
      },
      {
        title: 'React.js Development',
        description: 'Build dynamic user interfaces with React, hooks, context, and modern development patterns.',
        hours: 75,
        videos: [
          { title: 'React Components & JSX', duration: '29:15' },
          { title: 'React Hooks Deep Dive', duration: '41:30' },
          { title: 'State Management with Context', duration: '33:45' },
          { title: 'React Router & Navigation', duration: '27:20' }
        ],
        quizzes: [
          { title: 'React Fundamentals', questions: 18 },
          { title: 'Hooks & State Management', questions: 22 },
          { title: 'Component Architecture', questions: 16 }
        ]
      },
      {
        title: 'Portfolio & Deployment',
        description: 'Build impressive projects, learn Git, deploy applications, and prepare for interviews.',
        hours: 40,
        videos: [
          { title: 'Git Version Control Mastery', duration: '25:45' },
          { title: 'Deployment with Vercel & Netlify', duration: '22:30' },
          { title: 'Portfolio Website Creation', duration: '38:15' },
          { title: 'Technical Interview Preparation', duration: '31:20' }
        ],
        quizzes: [
          { title: 'Git & Version Control', questions: 14 },
          { title: 'Deployment Best Practices', questions: 12 },
          { title: 'Portfolio Review Assessment', questions: 10 }
        ]
      }
    ]
  },
  'Data Scientist': {
    totalHours: 280,
    estimatedDuration: '5-6 months',
    modules: [
      {
        title: 'Python Programming for Data Science',
        description: 'Master Python, NumPy, Pandas, and essential libraries for data manipulation.',
        hours: 70,
        videos: [
          { title: 'Python Fundamentals for Data Science', duration: '35:20' },
          { title: 'NumPy Arrays & Mathematical Operations', duration: '28:45' },
          { title: 'Pandas Data Manipulation Mastery', duration: '42:15' },
          { title: 'Data Cleaning & Preprocessing', duration: '31:30' }
        ],
        quizzes: [
          { title: 'Python Basics Assessment', questions: 20 },
          { title: 'NumPy & Pandas Challenge', questions: 25 },
          { title: 'Data Preprocessing Quiz', questions: 18 }
        ]
      },
      {
        title: 'Statistical Analysis & Visualization',
        description: 'Learn statistical concepts, data visualization with Matplotlib, Seaborn, and Plotly.',
        hours: 65,
        videos: [
          { title: 'Descriptive Statistics Deep Dive', duration: '33:15' },
          { title: 'Data Visualization with Matplotlib', duration: '29:45' },
          { title: 'Advanced Plots with Seaborn', duration: '25:30' },
          { title: 'Interactive Visualizations with Plotly', duration: '27:20' }
        ],
        quizzes: [
          { title: 'Statistical Concepts', questions: 22 },
          { title: 'Visualization Techniques', questions: 18 },
          { title: 'Data Interpretation Quiz', questions: 16 }
        ]
      },
      {
        title: 'Machine Learning Fundamentals',
        description: 'Supervised and unsupervised learning, model evaluation, and scikit-learn implementation.',
        hours: 90,
        videos: [
          { title: 'Machine Learning Introduction', duration: '24:45' },
          { title: 'Supervised Learning Algorithms', duration: '38:30' },
          { title: 'Unsupervised Learning Techniques', duration: '32:15' },
          { title: 'Model Evaluation & Selection', duration: '29:45' }
        ],
        quizzes: [
          { title: 'ML Fundamentals', questions: 25 },
          { title: 'Algorithm Selection Quiz', questions: 20 },
          { title: 'Model Evaluation Assessment', questions: 22 }
        ]
      },
      {
        title: 'Real-World Projects & Deployment',
        description: 'End-to-end projects, model deployment, and building a professional portfolio.',
        hours: 55,
        videos: [
          { title: 'End-to-End ML Project Walkthrough', duration: '45:20' },
          { title: 'Model Deployment with Flask', duration: '33:15' },
          { title: 'Data Science Portfolio Creation', duration: '28:45' },
          { title: 'Industry Best Practices', duration: '26:30' }
        ],
        quizzes: [
          { title: 'Project Planning Quiz', questions: 15 },
          { title: 'Deployment Assessment', questions: 18 },
          { title: 'Portfolio Review', questions: 12 }
        ]
      }
    ]
  },
  'UI/UX Designer': {
    totalHours: 180,
    estimatedDuration: '3-4 months',
    modules: [
      {
        title: 'Design Fundamentals & Theory',
        description: 'Color theory, typography, layout principles, and visual hierarchy.',
        hours: 40,
        videos: [
          { title: 'Design Principles & Visual Hierarchy', duration: '22:15' },
          { title: 'Color Theory for Digital Design', duration: '26:30' },
          { title: 'Typography in User Interfaces', duration: '24:45' },
          { title: 'Layout & Grid Systems', duration: '19:20' }
        ],
        quizzes: [
          { title: 'Design Principles Quiz', questions: 18 },
          { title: 'Color & Typography Assessment', questions: 15 },
          { title: 'Layout Challenge', questions: 12 }
        ]
      },
      {
        title: 'User Experience Design',
        description: 'User research, personas, user journeys, wireframing, and prototyping.',
        hours: 55,
        videos: [
          { title: 'User Research Methods', duration: '31:45' },
          { title: 'Creating User Personas', duration: '23:30' },
          { title: 'User Journey Mapping', duration: '28:15' },
          { title: 'Wireframing & Prototyping', duration: '35:20' }
        ],
        quizzes: [
          { title: 'User Research Quiz', questions: 20 },
          { title: 'UX Process Assessment', questions: 18 },
          { title: 'Prototyping Challenge', questions: 16 }
        ]
      },
      {
        title: 'Design Tools Mastery',
        description: 'Figma, Adobe Creative Suite, prototyping tools, and design systems.',
        hours: 50,
        videos: [
          { title: 'Figma Fundamentals', duration: '29:15' },
          { title: 'Advanced Figma Techniques', duration: '33:45' },
          { title: 'Design Systems Creation', duration: '27:30' },
          { title: 'Collaboration & Handoff', duration: '24:20' }
        ],
        quizzes: [
          { title: 'Figma Skills Test', questions: 16 },
          { title: 'Design Systems Quiz', questions: 14 },
          { title: 'Tool Proficiency Assessment', questions: 12 }
        ]
      },
      {
        title: 'Portfolio & Career Preparation',
        description: 'Build a professional portfolio, case studies, and interview preparation.',
        hours: 35,
        videos: [
          { title: 'Portfolio Creation Strategy', duration: '26:45' },
          { title: 'Writing Compelling Case Studies', duration: '22:30' },
          { title: 'Design Interview Preparation', duration: '28:15' },
          { title: 'Freelancing & Career Growth', duration: '21:20' }
        ],
        quizzes: [
          { title: 'Portfolio Review Checklist', questions: 10 },
          { title: 'Case Study Assessment', questions: 12 },
          { title: 'Career Readiness Quiz', questions: 8 }
        ]
      }
    ]
  }
};

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate app initialization
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Check for existing user session (in real app, this would check localStorage/cookies)
        const existingUser = localStorage.getItem('skillroad_user');
        if (existingUser) {
          const userData = JSON.parse(existingUser);
          setUser(userData.user);
          setLearningPath(userData.learningPath);
          setAppState('dashboard');
        } else {
          setAppState('landing');
        }
      } catch (err) {
        setError('Failed to initialize application');
        setAppState('error');
      }
    };

    initializeApp();
  }, []);

  // Generate professional learning path
  const generateLearningPath = useCallback((data: OnboardingData): LearningPath => {
    const template = COURSE_TEMPLATES[data.jobRole as keyof typeof COURSE_TEMPLATES];
    
    if (!template) {
      throw new Error(`Course template not found for ${data.jobRole}`);
    }

    const modules: Module[] = template.modules.map((moduleTemplate, index) => ({
      id: `module_${index + 1}`,
      title: moduleTemplate.title,
      description: moduleTemplate.description,
      estimatedHours: moduleTemplate.hours,
      isCompleted: false,
      progress: 0,
      videos: moduleTemplate.videos.map((videoTemplate, videoIndex) => ({
        id: `video_${index + 1}_${videoIndex + 1}`,
        title: videoTemplate.title,
        duration: videoTemplate.duration,
        thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
        youtubeId: 'dQw4w9WgXcQ',
        isWatched: false
      })),
      quizzes: moduleTemplate.quizzes.map((quizTemplate, quizIndex) => ({
        id: `quiz_${index + 1}_${quizIndex + 1}`,
        title: quizTemplate.title,
        questions: quizTemplate.questions,
        isCompleted: false,
        score: null
      }))
    }));

    return {
      id: `path_${Date.now()}`,
      jobRole: data.jobRole,
      skillLevel: data.skillLevel,
      estimatedDuration: template.estimatedDuration,
      modules,
      totalHours: template.totalHours,
      overallProgress: 0,
      createdAt: new Date().toISOString()
    };
  }, []);

  // Generate professional user profile
  const generateUserProfile = useCallback((data: OnboardingData): User => {
    const firstName = data.name?.split(' ')[0] || 'Student';
    const fullName = data.name || 'Professional Student';
    
    return {
      id: `user_${Date.now()}`,
      name: fullName,
      email: `${firstName.toLowerCase()}@skillroad.com`,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=3b82f6&color=fff&size=128`,
      joinedDate: new Date().toISOString(),
      totalProgress: 0,
      completedModules: 0,
      badges: [
        {
          id: 'newcomer',
          name: 'Welcome Aboard',
          description: 'Started your learning journey',
          icon: '🚀',
          earnedAt: new Date().toISOString()
        }
      ],
      currentStreak: 1,
      preferences: data.preferences || {
        learningStyle: 'mixed',
        timeCommitment: 'regular',
        goals: ['skill_development', 'career_change']
      },
      stats: {
        totalHoursLearned: 0,
        averageSessionTime: 0,
        completionRate: 0,
        streakRecord: 1,
        certificatesEarned: 0
      }
    };
  }, []);

  // Handle journey start from landing page
  const handleStartJourney = useCallback(async (jobRole: string, skillLevel: string) => {
    try {
      setIsTransitioning(true);
      setOnboardingData({ jobRole, skillLevel });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setAppState('onboarding');
    } catch (err) {
      setError('Failed to start learning journey');
      setAppState('error');
    } finally {
      setIsTransitioning(false);
    }
  }, []);

  // Complete onboarding process
  const handleCompleteOnboarding = useCallback(async (additionalData: Partial<OnboardingData>) => {
    if (!onboardingData) return;
    
    try {
      setIsTransitioning(true);
      
      const completeData = { ...onboardingData, ...additionalData };
      
      // Generate professional user and learning path
      const newUser = generateUserProfile(completeData);
      const newLearningPath = generateLearningPath(completeData);
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage (in real app, this would be API calls)
      localStorage.setItem('skillroad_user', JSON.stringify({
        user: newUser,
        learningPath: newLearningPath
      }));
      
      setUser(newUser);
      setLearningPath(newLearningPath);
      setAppState('dashboard');
    } catch (err) {
      setError('Failed to complete onboarding');
      setAppState('error');
    } finally {
      setIsTransitioning(false);
    }
  }, [onboardingData, generateUserProfile, generateLearningPath]);

  // Handle progress updates
  const handleUpdateProgress = useCallback((moduleId: string, progress: number) => {
    if (!learningPath || !user) return;

    const updatedPath = {
      ...learningPath,
      modules: learningPath.modules.map(module => {
        if (module.id === moduleId) {
          const updatedModule = { ...module, progress };
          if (progress === 100 && !module.isCompleted) {
            updatedModule.isCompleted = true;
            // Award XP and update user stats
            setUser(prevUser => prevUser ? {
              ...prevUser,
              totalProgress: prevUser.totalProgress + 10,
              completedModules: prevUser.completedModules + 1,
              stats: {
                ...prevUser.stats,
                totalHoursLearned: prevUser.stats.totalHoursLearned + module.estimatedHours,
                completionRate: ((prevUser.completedModules + 1) / learningPath.modules.length) * 100
              }
            } : null);
          }
          return updatedModule;
        }
        return module;
      })
    };

    // Calculate overall progress
    const totalProgress = Math.round(
      updatedPath.modules.reduce((acc, module) => acc + module.progress, 0) / updatedPath.modules.length
    );
    updatedPath.overallProgress = totalProgress;

    setLearningPath(updatedPath);

    // Save to localStorage
    if (user) {
      localStorage.setItem('skillroad_user', JSON.stringify({
        user,
        learningPath: updatedPath
      }));
    }
  }, [learningPath, user]);

  // Handle logout/back to landing
  const handleBackToLanding = useCallback(() => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      localStorage.removeItem('skillroad_user');
      setUser(null);
      setLearningPath(null);
      setOnboardingData(null);
      setAppState('landing');
      setIsTransitioning(false);
    }, 500);
  }, []);

  // Error retry handler
  const handleRetry = useCallback(() => {
    setError(null);
    setAppState('loading');
    window.location.reload();
  }, []);

  // Loading screen
  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 gradient-dark-blue rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-subtle">
            <div className="text-2xl">🚀</div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">SkillRoad</h1>
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            <span>Loading your learning platform...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error screen
  if (appState === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <div className="text-2xl">⚠️</div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
          <p className="text-gray-400 mb-6">{error || 'An unexpected error occurred'}</p>
          <button
            onClick={handleRetry}
            className="btn-dark-primary hover-lift"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Onboarding screen (placeholder - would be a separate component)
  if (appState === 'onboarding') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="w-16 h-16 gradient-dark-blue rounded-2xl flex items-center justify-center mx-auto mb-6 animate-glow-subtle">
            <div className="text-2xl">👋</div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Let's personalize your experience</h1>
          <p className="text-gray-400 mb-8">We're creating your personalized {onboardingData?.jobRole} learning path...</p>
          
          {/* Quick onboarding form */}
          <div className="glass-card p-6 max-w-md mx-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-400 mb-2">What's your name?</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const name = (e.target as HTMLInputElement).value;
                      if (name.trim()) {
                        handleCompleteOnboarding({ name: name.trim() });
                      }
                    }
                  }}
                />
              </div>
              <button
                onClick={() => handleCompleteOnboarding({ name: 'Professional Student' })}
                className="w-full btn-dark-primary hover-lift"
                disabled={isTransitioning}
              >
                {isTransitioning ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Setting up your dashboard...
                  </div>
                ) : (
                  'Create My Learning Path'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main app content
  return (
    <div className="min-h-screen bg-background">
      {isTransitioning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      )}
      
      {appState === 'landing' ? (
        <div className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
          <LandingPage onStartJourney={handleStartJourney} />
        </div>
      ) : (
        <div className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
          <Dashboard 
            user={user!} 
            learningPath={learningPath!} 
            onBackToLanding={handleBackToLanding}
            onUpdateProgress={handleUpdateProgress}
          />
        </div>
      )}
    </div>
  );
}