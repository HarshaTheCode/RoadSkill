import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { X, ArrowLeft, ArrowRight, Clock, CheckCircle, XCircle } from "lucide-react";

interface Question {
  question: string;
  options: { option: string; isCorrect: boolean }[];
  explanation: string;
}

interface Assessment {
  id: number;
  title: string;
  description: string;
  questions: Question[];
  passingScore: number;
}

interface AssessmentModalProps {
  assessment: Assessment;
  onClose: () => void;
  onSubmit: (score: number) => void;
}

export default function AssessmentModal({ assessment, onClose, onSubmit }: AssessmentModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Timer effect
  useEffect(() => {
    if (isSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (isSubmitted) return;

    let correctAnswers = 0;
    assessment.questions.forEach((question, index) => {
      const selectedOptionIndex = answers[index];
      if (selectedOptionIndex !== undefined && selectedOptionIndex < question.options.length) {
        if (question.options[selectedOptionIndex].isCorrect) {
          correctAnswers++;
        }
      }
    });

    const finalScore = Math.round((correctAnswers / assessment.questions.length) * 100);
    setScore(finalScore);
    setIsSubmitted(true);
    setShowResults(true);
  };

  const handleFinish = () => {
    onSubmit(score);
    onClose();
  };

  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;
  const currentQ = assessment.questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">{assessment.title}</CardTitle>
              <p className="text-gray-600 mt-1">{assessment.description}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {!showResults ? (
            <>
              {/* Quiz Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Question {currentQuestion + 1} of {assessment.questions.length}</span>
                  <div className="flex items-center text-orange-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Time remaining: {formatTime(timeRemaining)}</span>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {currentQ.question}
                </h4>

                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedAnswer === index
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        value={index}
                        checked={selectedAnswer === index}
                        onChange={() => handleAnswerSelect(index)}
                        className="mr-3 text-primary"
                      />
                      <span className="flex-1">{option.option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentQuestion === assessment.questions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    className="bg-primary text-white hover:bg-primary/90"
                    disabled={answers.length < assessment.questions.length}
                  >
                    Submit Assessment
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </>
          ) : (
            /* Results Screen */
            <div className="text-center">
              <div className="mb-6">
                {score >= assessment.passingScore ? (
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                )}

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Assessment {score >= assessment.passingScore ? 'Completed!' : 'Incomplete'}
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">{score}%</div>
                    <div className="text-sm text-gray-600">Your Score</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">{assessment.passingScore}%</div>
                    <div className="text-sm text-gray-600">Passing Score</div>
                  </div>
                </div>

                <div className="flex justify-center mb-6">
                  {score >= assessment.passingScore ? (
                    <Badge className="bg-green-100 text-green-800 px-4 py-2">
                      ✓ Passed - Module Completed!
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="px-4 py-2">
                      Not Passed - Review and Try Again
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 mb-6">
                  {score >= assessment.passingScore
                    ? "Congratulations! You've successfully completed this module."
                    : "Don't worry! Review the learning materials and take the assessment again when you're ready."
                  }
                </p>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Review Materials
                </Button>
                <Button 
                  onClick={handleFinish}
                  className="flex-1 bg-primary text-white hover:bg-primary/90"
                >
                  Continue Learning
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
