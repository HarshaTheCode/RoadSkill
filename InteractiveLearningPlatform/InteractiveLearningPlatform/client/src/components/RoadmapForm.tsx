import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Target, TrendingUp } from "lucide-react";

interface RoadmapFormProps {
  onSubmit: (data: { jobRole: string; experienceLevel: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function RoadmapForm({ onSubmit, onCancel, isLoading }: RoadmapFormProps) {
  const [jobRole, setJobRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobRole.trim() && experienceLevel) {
      onSubmit({ jobRole: jobRole.trim(), experienceLevel });
    }
  };

  const popularRoles = [
    "Web Developer",
    "Data Scientist",
    "Mobile App Developer",
    "DevOps Engineer",
    "UI/UX Designer",
    "Machine Learning Engineer",
    "Cybersecurity Analyst",
    "Cloud Engineer",
    "Full Stack Developer",
    "Python Developer"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="jobRole" className="text-sm font-medium text-gray-700 mb-2">
            Job Role or Skill *
          </Label>
          <div className="relative">
            <Input
              id="jobRole"
              type="text"
              placeholder="e.g., Web Developer, Data Scientist, Python"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="pr-10"
              required
            />
            <Target className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          
          {/* Popular suggestions */}
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Popular roles:</p>
            <div className="flex flex-wrap gap-2">
              {popularRoles.slice(0, 6).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setJobRole(role)}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="experienceLevel" className="text-sm font-medium text-gray-700 mb-2">
            Experience Level *
          </Label>
          <Select value={experienceLevel} onValueChange={setExperienceLevel} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your current level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                  <div>
                    <div className="font-medium">Beginner</div>
                    <div className="text-xs text-gray-500">New to this field</div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="intermediate">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-yellow-500" />
                  <div>
                    <div className="font-medium">Intermediate</div>
                    <div className="text-xs text-gray-500">Some experience or knowledge</div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="advanced">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-red-500" />
                  <div>
                    <div className="font-medium">Advanced</div>
                    <div className="text-xs text-gray-500">Experienced, looking to specialize</div>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* AI Generation Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">AI-Powered Personalization</h4>
              <p className="text-sm text-blue-700">
                Our AI will analyze real job requirements and create a structured learning path tailored to your experience level, 
                complete with curated resources and assessments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1 bg-primary text-white hover:bg-primary/90"
          disabled={!jobRole.trim() || !experienceLevel || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Target className="w-4 h-4 mr-2" />
              Generate Roadmap
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
