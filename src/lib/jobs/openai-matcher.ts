import { Job } from './firecrawl-service';

interface MatchResult {
  matchScore: number;
  matchReason: string;
  keySkillMatches: string[];
  missingSkills: string[];
  improvementSuggestions: string[];
}

class OpenAIMatcherService {
  private apiKey: string;
  
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  /**
   * Calculate match score between a resume and job
   */
  async calculateJobMatch(
    resume: {
      summary?: string;
      skills?: string[];
      experience?: Array<{
        position: string;
        company: string;
        duration: string;
        description?: string;
      }>;
      education?: Array<{
        institution: string;
        degree: string;
        date: string;
      }>;
    },
    job: Job
  ): Promise<MatchResult> {
    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      // Format resume data for the API
      const resumeText = `
        ${resume.summary || ''}
        
        Skills:
        ${resume.skills?.join(', ') || ''}
        
        Experience:
        ${resume.experience?.map(exp => 
          `${exp.position} at ${exp.company} (${exp.duration})
           ${exp.description || ''}`
        ).join('\n\n') || ''}
        
        Education:
        ${resume.education?.map(edu => 
          `${edu.degree} from ${edu.institution} (${edu.date})`
        ).join('\n') || ''}
      `;

      // Format job data for the API
      const jobText = `
        Job Title: ${job.title}
        Company: ${job.company}
        Location: ${job.location}
        Type: ${job.type || 'Not specified'}
        Experience Level: ${job.experienceLevel || 'Not specified'}
        
        Description:
        ${job.description}
        
        Requirements:
        ${job.requirements?.join('\n') || 'Not specified'}
      `;

      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are an expert job matching assistant. Your task is to evaluate how well a candidate's resume matches a job description. 
              Provide a match score from 0-100, a brief explanation of the match, key skill matches, missing skills, and improvement suggestions.`
            },
            {
              role: 'user',
              content: `Please analyze the following resume and job description to determine how well they match:
              
              RESUME:
              ${resumeText}
              
              JOB DESCRIPTION:
              ${jobText}
              
              Provide your analysis in the following JSON format:
              {
                "matchScore": number between 0-100,
                "matchReason": "brief explanation of the match score",
                "keySkillMatches": ["skill1", "skill2", "skill3"],
                "missingSkills": ["missing1", "missing2"],
                "improvementSuggestions": ["suggestion1", "suggestion2"]
              }`
            }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      
      return {
        matchScore: result.matchScore,
        matchReason: result.matchReason,
        keySkillMatches: result.keySkillMatches,
        missingSkills: result.missingSkills,
        improvementSuggestions: result.improvementSuggestions
      };
    } catch (error) {
      console.error('OpenAI calculateJobMatch error:', error);
      
      // Return a fallback result if API call fails
      return this.calculateFallbackMatch(resume, job);
    }
  }

  /**
   * Calculate a fallback match score without using the API
   * This is used when the API call fails or for development
   */
  private calculateFallbackMatch(
    resume: {
      summary?: string;
      skills?: string[];
      experience?: Array<{
        position: string;
        company: string;
        duration: string;
        description?: string;
      }>;
      education?: Array<{
        institution: string;
        degree: string;
        date: string;
      }>;
    },
    job: Job
  ): MatchResult {
    // Extract skills from job description and requirements
    const jobSkills = new Set<string>();
    
    // Add skills from requirements
    job.requirements?.forEach(req => {
      // Simple extraction of potential skills (words with capital letters or technical terms)
      const skillMatches = req.match(/\b([A-Z][a-z]+|React|Node\.js|JavaScript|TypeScript|Python|AWS|Docker|Kubernetes|SQL|NoSQL|API|REST|GraphQL)\b/g);
      if (skillMatches) {
        skillMatches.forEach(skill => jobSkills.add(skill));
      }
    });
    
    // Add skills from job title
    const titleSkills = job.title.match(/\b([A-Z][a-z]+|React|Node\.js|JavaScript|TypeScript|Python|AWS|Docker|Kubernetes|SQL|NoSQL|API|REST|GraphQL)\b/g);
    if (titleSkills) {
      titleSkills.forEach(skill => jobSkills.add(skill));
    }
    
    // Calculate skill matches
    const userSkills = new Set(resume.skills || []);
    const matchingSkills: string[] = [];
    const missingSkills: string[] = [];
    
    jobSkills.forEach(skill => {
      // Check if user has this skill (case insensitive)
      const hasSkill = Array.from(userSkills).some(
        userSkill => userSkill.toLowerCase() === skill.toLowerCase()
      );
      
      if (hasSkill) {
        matchingSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });
    
    // Calculate match score
    const skillMatchPercentage = jobSkills.size > 0 
      ? (matchingSkills.length / jobSkills.size) * 100
      : 50; // Default to 50% if no skills found
    
    // Adjust score based on experience
    let experienceScore = 50; // Default
    
    if (resume.experience && resume.experience.length > 0) {
      // More experience entries generally means more experience
      experienceScore = Math.min(80, 50 + resume.experience.length * 10);
      
      // Check if any experience titles match the job title
      const titleMatch = resume.experience.some(exp => 
        job.title.toLowerCase().includes(exp.position.toLowerCase()) ||
        exp.position.toLowerCase().includes(job.title.toLowerCase())
      );
      
      if (titleMatch) {
        experienceScore += 10;
      }
    }
    
    // Final score is weighted average
    const matchScore = Math.round((skillMatchPercentage * 0.7) + (experienceScore * 0.3));
    
    // Generate improvement suggestions
    const improvementSuggestions: string[] = [];
    
    if (missingSkills.length > 0) {
      improvementSuggestions.push(`Add these skills to your resume: ${missingSkills.slice(0, 3).join(', ')}`);
    }
    
    if (!resume.summary) {
      improvementSuggestions.push('Add a professional summary that highlights your relevant experience');
    }
    
    if (resume.experience && resume.experience.length > 0) {
      improvementSuggestions.push('Quantify your achievements with metrics and results');
    }
    
    return {
      matchScore,
      matchReason: `You match ${matchingSkills.length} out of ${jobSkills.size} key skills for this position.`,
      keySkillMatches: matchingSkills,
      missingSkills: missingSkills.slice(0, 5), // Limit to top 5 missing skills
      improvementSuggestions
    };
  }
}

export const openaiMatcherService = new OpenAIMatcherService();