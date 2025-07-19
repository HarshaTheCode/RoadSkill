import { useState } from 'react';
import { LearningPath } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  Trophy,
  Target,
  PlayCircle,
  Brain,
  Zap
} from 'lucide-react';

interface AssessmentViewProps {
  learningPath: LearningPath;
}

export default function AssessmentView({ learningPath }: AssessmentViewProps) {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [quizInProgress, setQuizInProgress] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Mock quiz data
  const mockQuizQuestions = [
    {
      question: "What is the primary purpose of semantic HTML?",
      options: [
        "To make websites look better",
        "To improve SEO and accessibility",
        "To reduce file size",
        "To increase loading speed"
      ],
      correct: 1
    },
    {
      question: "Which CSS property is used for responsive design?",
      options: [
        "display",
        "position",
        "media-query",
        "flex-direction"
      ],
      correct: 2
    },
    {
      question: "What does API stand for?",
      options: [
        "Application Programming Interface",
        "Advanced Programming Integration",
        "Automated Program Interaction",
        "Application Protocol Interface"
      ],
      correct: 0
    }
  ];

  const totalQuizzes = learningPath.modules.reduce((acc, module) => acc + module.quizzes.length, 0);
  const completedQuizzes = learningPath.modules.reduce((acc, module) => 
    acc + module.quizzes.filter(q => q.isCompleted).length, 0
  );
  const averageScore = learningPath.modules.reduce((acc, module) => {
    const moduleScores = module.quizzes.filter(q => q.score !== null).map(q => q.score!);
    return acc + (moduleScores.length > 0 ? moduleScores.reduce((a, b) => a + b, 0) / moduleScores.length : 0);
  }, 0) / learningPath.modules.length;

  const startQuiz = (quizId: string) => {
    setSelectedQuiz(quizId);
    setQuizInProgress(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setQuizScore(null);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const nextQuestion = () => {
    if (currentQuestion < mockQuizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Calculate score
      const score = Math.floor(Math.random() * 30) + 70; // Mock score between 70-100
      setQuizScore(score);
      setQuizInProgress(false);
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setQuizInProgress(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setQuizScore(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Assessments &amp; Practice</h2>
        <p className="text-orange-100 mb-4">
          Test your knowledge and prepare for real job interviews
        </p>
        <div className="flex items-center space-x-8">
          <div className="text-center">
            <div className="text-3xl font-bold">{completedQuizzes}</div>
            <div className="text-orange-100 text-sm">Quizzes Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{Math.round(averageScore)}%</div>
            <div className="text-orange-100 text-sm">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{totalQuizzes}</div>
            <div className="text-orange-100 text-sm">Total Available</div>
          </div>
        </div>
      </div>

      {/* Quiz Interface */}
      {quizInProgress && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Brain className="w-6 h-6 mr-2 text-blue-600" />
                Practice Quiz
              </CardTitle>
              <Badge variant="outline">
                Question {currentQuestion + 1} of {mockQuizQuestions.length}
              </Badge>
            </div>
            <Progress 
              value={(currentQuestion / mockQuizQuestions.length) * 100} 
              className="h-2" 
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">
                {mockQuizQuestions[currentQuestion].question}
              </h3>
              <div className="space-y-3">
                {mockQuizQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                        selectedAnswer === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswer === index && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      {option}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={resetQuiz}>
                  Cancel Quiz
                </Button>
                <Button 
                  onClick={nextQuestion}
                  disabled={selectedAnswer === null}
                  className="bg-gradient-to-r from-blue-600 to-green-600"
                >
                  {currentQuestion === mockQuizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Results */}
      {quizScore !== null && (
        <Card className="border-2 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold">Quiz Completed!</h3>
              <div className="text-4xl font-bold text-green-600">{quizScore}%</div>
              <p className="text-gray-600">
                {quizScore >= 80 ? "Excellent work! You've mastered this topic." :
                 quizScore >= 60 ? "Good job! Review the material and try again." :
                 "Keep studying! You'll get there with more practice."}
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={resetQuiz}>
                  Back to Assessments
                </Button>
                <Button onClick={() => startQuiz(selectedQuiz!)}>
                  Retake Quiz
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assessment Overview */}
      {!quizInProgress && quizScore === null && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quiz Progress</CardTitle>
                <Award className="h-4 w-4 text-blue-600" />
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
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Target className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(averageScore)}%</div>
                <p className="text-xs text-muted-foreground">
                  Across all completed quizzes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedQuizzes * 15}min</div>
                <p className="text-xs text-muted-foreground">
                  Total assessment time
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Available Assessments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Module Quizzes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-blue-600" />
                  Module Quizzes
                </CardTitle>
                <CardDescription>
                  Test your knowledge for each learning module
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningPath.modules.map((module, moduleIndex) => (
                    <div key={module.id}>
                      <h4 className="font-medium mb-2">{module.title}</h4>
                      <div className="space-y-2">
                        {module.quizzes.map((quiz) => (
                          <div key={quiz.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{quiz.title}</h5>
                              <p className="text-xs text-gray-600">{quiz.questions} questions</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {quiz.isCompleted && quiz.score && (
                                <Badge variant="default" className="bg-green-600">
                                  {quiz.score}%
                                </Badge>
                              )}
                              <Button
                                size="sm"
                                onClick={() => startQuiz(quiz.id)}
                                className="bg-gradient-to-r from-blue-600 to-green-600"
                              >
                                {quiz.isCompleted ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Retake
                                  </>
                                ) : (
                                  <>
                                    <PlayCircle className="w-3 h-3 mr-1" />
                                    Start
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mock Interview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-purple-600" />
                  Mock Interview
                </CardTitle>
                <CardDescription>
                  Practice with AI-powered interview questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium mb-2">{learningPath.jobRole} Interview Prep</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Practice common interview questions for {learningPath.jobRole} positions
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <Clock className="w-4 h-4 inline mr-1" />
                        30-45 minutes
                      </div>
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                        Start Interview
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium mb-2">Technical Skills Assessment</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Comprehensive technical evaluation based on your learning path
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <Clock className="w-4 h-4 inline mr-1" />
                        60 minutes
                      </div>
                      <Button className="bg-gradient-to-r from-orange-600 to-red-600">
                        Start Assessment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}