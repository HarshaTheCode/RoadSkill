import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export interface RoadmapModule {
  title: string;
  description: string;
  estimatedHours: number;
  skills: string[];
}

export interface GeneratedRoadmap {
  title: string;
  description: string;
  totalEstimatedHours: number;
  modules: RoadmapModule[];
}

export interface QuestionOption {
  option: string;
  isCorrect: boolean;
}

export interface AssessmentQuestion {
  question: string;
  options: QuestionOption[];
  explanation: string;
}

export interface GeneratedAssessment {
  title: string;
  description: string;
  questions: AssessmentQuestion[];
}

export interface ResourceRecommendation {
  title: string;
  type: 'video' | 'article' | 'documentation';
  searchQuery: string;
  provider: string;
  estimatedDuration: string;
}

export async function generateRoadmap(
  jobRole: string, 
  experienceLevel: 'beginner' | 'intermediate' | 'advanced'
): Promise<GeneratedRoadmap> {
  try {
    const prompt = `Create a comprehensive learning roadmap for becoming a ${jobRole} at ${experienceLevel} level.

Requirements:
- Provide 6-12 learning modules in logical progression order
- Each module should have a clear title, description, and estimated hours
- Include key skills that will be learned in each module
- Focus on practical, job-relevant skills
- Total roadmap should be realistic (50-200 hours depending on experience level)
- Prioritize foundational skills first, then advanced topics

Experience level considerations:
- Beginner: Start with absolute basics, more foundational modules
- Intermediate: Assume some basic knowledge, focus on practical application
- Advanced: Focus on specialized skills, best practices, and advanced concepts

Respond with JSON in this exact format:
{
  "title": "Complete roadmap title",
  "description": "Brief description of what this roadmap covers",
  "totalEstimatedHours": number,
  "modules": [
    {
      "title": "Module title",
      "description": "What this module covers and why it's important",
      "estimatedHours": number,
      "skills": ["skill1", "skill2", "skill3"]
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert career advisor and curriculum designer. Create detailed, practical learning roadmaps that prepare students for real-world jobs."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as GeneratedRoadmap;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw new Error("Failed to generate roadmap. Please check your OpenAI API configuration.");
  }
}

export async function generateAssessment(
  moduleTitle: string,
  skills: string[],
  jobRole: string
): Promise<GeneratedAssessment> {
  try {
    const prompt = `Create a comprehensive assessment for the module "${moduleTitle}" in a ${jobRole} learning path.

Module skills to test: ${skills.join(', ')}

Requirements:
- Create 8-12 multiple choice questions
- Questions should test practical understanding, not just memorization
- Include 4 options per question with only one correct answer
- Provide clear explanations for correct answers
- Mix of difficulty levels (easy, medium, hard)
- Focus on real-world application and job-relevant scenarios

Respond with JSON in this exact format:
{
  "title": "Assessment title",
  "description": "Brief description of what this assessment covers",
  "questions": [
    {
      "question": "Question text",
      "options": [
        {"option": "Option A text", "isCorrect": false},
        {"option": "Option B text", "isCorrect": true},
        {"option": "Option C text", "isCorrect": false},
        {"option": "Option D text", "isCorrect": false}
      ],
      "explanation": "Explanation of why the correct answer is right"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert educator and assessment designer. Create challenging but fair assessments that test practical knowledge and job readiness."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as GeneratedAssessment;
  } catch (error) {
    console.error("Error generating assessment:", error);
    throw new Error("Failed to generate assessment. Please check your OpenAI API configuration.");
  }
}

export async function generateResourceRecommendations(
  moduleTitle: string,
  skills: string[],
  jobRole: string
): Promise<ResourceRecommendation[]> {
  try {
    const prompt = `Recommend high-quality learning resources for the module "${moduleTitle}" in a ${jobRole} learning path.

Skills to cover: ${skills.join(', ')}

Requirements:
- Suggest 3-5 diverse learning resources
- Include YouTube videos, documentation, and articles
- Provide specific search queries that would find these resources
- Focus on popular, well-regarded content creators and sources
- Include estimated duration for each resource

Respond with JSON in this exact format:
{
  "resources": [
    {
      "title": "Resource title",
      "type": "video|article|documentation",
      "searchQuery": "Specific search query to find this resource",
      "provider": "YouTube|MDN|Medium|etc",
      "estimatedDuration": "duration like '45 minutes' or '2 hours'"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert at finding high-quality educational resources. Recommend resources that are practical, up-to-date, and from reputable sources."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.resources as ResourceRecommendation[];
  } catch (error) {
    console.error("Error generating resource recommendations:", error);
    throw new Error("Failed to generate resource recommendations. Please check your OpenAI API configuration.");
  }
}
