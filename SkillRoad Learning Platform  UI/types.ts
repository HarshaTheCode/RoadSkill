export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  totalProgress: number;
  completedModules: number;
  badges: Badge[];
  currentStreak: number;
  preferences?: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  learningStyle: 'visual' | 'practical' | 'mixed';
  timeCommitment: 'casual' | 'regular' | 'intensive';
  goals: string[];
  notifications?: {
    daily: boolean;
    weekly: boolean;
    achievements: boolean;
  };
  theme?: 'dark' | 'light' | 'auto';
}

export interface UserStats {
  totalHoursLearned: number;
  averageSessionTime: number;
  completionRate: number;
  streakRecord: number;
  certificatesEarned: number;
  skillsAcquired?: string[];
  projectsCompleted?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  category?: 'achievement' | 'milestone' | 'skill' | 'special';
}

export interface LearningPath {
  id: string;
  jobRole: string;
  skillLevel: string;
  estimatedDuration: string;
  modules: Module[];
  totalHours: number;
  overallProgress: number;
  createdAt: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  prerequisites?: string[];
  outcomes?: string[];
  certification?: {
    available: boolean;
    provider: string;
    validityPeriod?: string;
  };
}

export interface Module {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  isCompleted: boolean;
  progress: number;
  videos: Video[];
  quizzes: Quiz[];
  prerequisites?: string[];
  learningObjectives?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  order?: number;
  unlocked?: boolean;
  dueDate?: string;
}

export interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  youtubeId: string;
  isWatched: boolean;
  watchedAt?: string;
  notes?: string;
  bookmarks?: VideoBookmark[];
  quality?: 'HD' | 'FHD' | '4K';
  subtitles?: boolean;
  transcript?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  topics?: string[];
}

export interface VideoBookmark {
  id: string;
  timestamp: number;
  note: string;
  createdAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: number;
  isCompleted: boolean;
  score: number | null;
  attempts?: number;
  maxAttempts?: number;
  passingScore?: number;
  timeLimit?: number;
  completedAt?: string;
  feedback?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  topics?: string[];
  type?: 'multiple_choice' | 'coding' | 'practical' | 'mixed';
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'code' | 'drag_drop';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  topics?: string[];
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
    alt?: string;
  };
}

export interface Assessment {
  id: string;
  type: 'quiz' | 'project' | 'peer_review' | 'interview_prep';
  title: string;
  description: string;
  moduleId: string;
  estimatedTime: number;
  isCompleted: boolean;
  score?: number;
  maxScore: number;
  feedback?: AssessmentFeedback;
  submittedAt?: string;
  dueDate?: string;
  retakeAllowed?: boolean;
  requirements?: string[];
}

export interface AssessmentFeedback {
  overall: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  mentorNotes?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  moduleId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  isCompleted: boolean;
  status: 'not_started' | 'in_progress' | 'submitted' | 'reviewed' | 'completed';
  requirements: string[];
  deliverables: string[];
  resources: ProjectResource[];
  submission?: ProjectSubmission;
  feedback?: AssessmentFeedback;
  skillsGained: string[];
  technologies: string[];
}

export interface ProjectResource {
  id: string;
  type: 'documentation' | 'template' | 'example' | 'tool' | 'library';
  title: string;
  url: string;
  description?: string;
  required: boolean;
}

export interface ProjectSubmission {
  id: string;
  projectId: string;
  submittedAt: string;
  files: SubmissionFile[];
  liveUrl?: string;
  githubUrl?: string;
  description: string;
  selfAssessment?: {
    challenges: string;
    learnings: string;
    improvements: string;
  };
}

export interface SubmissionFile {
  id: string;
  filename: string;
  type: string;
  size: number;
  url: string;
}

export interface StudySession {
  id: string;
  userId: string;
  moduleId?: string;
  videoId?: string;
  startTime: string;
  endTime?: string;
  duration: number;
  activity: 'video' | 'quiz' | 'project' | 'reading' | 'practice';
  progress: number;
  notes?: string;
  focus?: number; // 1-10 rating
}

export interface Notification {
  id: string;
  userId: string;
  type: 'achievement' | 'reminder' | 'deadline' | 'system' | 'social';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionText?: string;
  expiresAt?: string;
}

export interface StreakData {
  current: number;
  longest: number;
  lastActivity: string;
  isActive: boolean;
  freezesUsed: number;
  maxFreezes: number;
}

export interface LearningAnalytics {
  userId: string;
  totalTimeSpent: number;
  averageSessionTime: number;
  dailyGoalCompletion: number;
  weeklyGoalCompletion: number;
  monthlyGoalCompletion: number;
  strongestTopics: string[];
  weakestTopics: string[];
  learningPattern: 'morning' | 'afternoon' | 'evening' | 'night' | 'mixed';
  preferredContentType: 'video' | 'text' | 'interactive' | 'mixed';
  completionRate: number;
  retentionRate: number;
}

export interface Certificate {
  id: string;
  title: string;
  description: string;
  issuer: string;
  issuedAt: string;
  validUntil?: string;
  credentialId: string;
  verificationUrl: string;
  skills: string[];
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  pathId: string;
}

export interface Mentor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  expertise: string[];
  rating: number;
  totalSessions: number;
  availability: 'available' | 'busy' | 'offline';
  bio: string;
  languages: string[];
  timezone: string;
  hourlyRate?: number;
}

export interface MentorSession {
  id: string;
  mentorId: string;
  studentId: string;
  scheduledAt: string;
  duration: number;
  topic: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  feedback?: {
    rating: number;
    comment: string;
    skills: string[];
  };
  recordingUrl?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form Types
export interface OnboardingForm {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
  };
  careerGoals: {
    currentRole?: string;
    targetRole: string;
    timeline: string;
    motivation: string;
  };
  experience: {
    level: string;
    background: string[];
    previousLearning: string[];
  };
  preferences: {
    learningStyle: string;
    timeCommitment: string;
    availableHours: number;
    preferredSchedule: string[];
  };
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'support' | 'feedback' | 'partnership' | 'other';
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type ThemeMode = 'light' | 'dark' | 'system';
export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'zh' | 'ja' | 'ko';