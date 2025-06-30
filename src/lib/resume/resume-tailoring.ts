/**
 * Resume Tailoring Service
 * 
 * This module provides utilities for tailoring resumes to specific job descriptions
 * using AI-powered analysis and optimization.
 */

interface ResumeSection {
  type: 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications';
  title: string;
  content: any;
}

interface Resume {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  sections: ResumeSection[];
}

interface JobDescription {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  responsibilities?: string[];
  qualifications?: string[];
}

interface TailoringResult {
  score: number; // 0-100 match score
  tailoredResume: Resume;
  changes: {
    section: string;
    original: string;
    tailored: string;
    reason: string;
  }[];
  keywordMatches: {
    keyword: string;
    found: boolean;
    importance: 'high' | 'medium' | 'low';
  }[];
  suggestions: string[];
}

export class ResumeTailoringService {
  /**
   * Analyzes a job description to extract key requirements and skills
   */
  analyzeJobDescription(jobDescription: JobDescription): {
    keySkills: string[];
    keyPhrases: string[];
    softSkills: string[];
    technicalSkills: string[];
    importantKeywords: string[];
  } {
    // This is a placeholder implementation
    // In a real app, this would use NLP or AI to extract key information
    
    const allText = [
      jobDescription.description,
      ...(jobDescription.requirements || []),
      ...(jobDescription.responsibilities || []),
      ...(jobDescription.qualifications || [])
    ].join(' ').toLowerCase();
    
    // Extract technical skills (simplified approach)
    const technicalSkillsPatterns = [
      'javascript', 'typescript', 'react', 'node', 'python', 'java', 'c#', 'c\\+\\+',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'sql', 'nosql', 'mongodb',
      'rest', 'graphql', 'api', 'git', 'ci/cd', 'agile', 'scrum', 'devops',
      'html', 'css', 'sass', 'less', 'webpack', 'babel', 'redux', 'vue', 'angular'
    ];
    
    const technicalSkills = technicalSkillsPatterns
      .filter(skill => new RegExp(`\\b${skill}\\b`, 'i').test(allText))
      .map(skill => skill.charAt(0).toUpperCase() + skill.slice(1));
    
    // Extract soft skills (simplified approach)
    const softSkillsPatterns = [
      'communication', 'teamwork', 'leadership', 'problem.solving', 'critical.thinking',
      'time.management', 'adaptability', 'flexibility', 'creativity', 'collaboration',
      'attention.to.detail', 'organization', 'analytical', 'interpersonal', 'presentation'
    ];
    
    const softSkills = softSkillsPatterns
      .filter(skill => new RegExp(`\\b${skill.replace('.', '[ -]?')}\\b`, 'i').test(allText))
      .map(skill => skill.replace('.', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
    
    // Extract key phrases (simplified approach)
    const keyPhrasePatterns = [
      'years of experience', 'degree in', 'background in', 'proficiency in',
      'knowledge of', 'familiar with', 'expertise in', 'understanding of',
      'ability to', 'track record', 'proven', 'demonstrated', 'experience with'
    ];
    
    const keyPhrases: string[] = [];
    keyPhrasePatterns.forEach(phrase => {
      const regex = new RegExp(`${phrase}[^.!?;]*`, 'gi');
      const matches = allText.match(regex);
      if (matches) {
        keyPhrases.push(...matches);
      }
    });
    
    // Determine important keywords based on frequency and position
    const words = allText.split(/\s+/);
    const wordFrequency: Record<string, number> = {};
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
      if (cleanWord.length > 3) { // Ignore short words
        wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
      }
    });
    
    const importantKeywords = Object.entries(wordFrequency)
      .filter(([word, count]) => count > 2 && word.length > 3)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
    
    return {
      keySkills: [...new Set([...technicalSkills, ...softSkills])],
      keyPhrases: keyPhrases.slice(0, 5),
      softSkills,
      technicalSkills,
      importantKeywords
    };
  }
  
  /**
   * Tailors a resume to match a specific job description
   */
  tailorResume(resume: Resume, jobDescription: JobDescription): TailoringResult {
    // This is a placeholder implementation
    // In a real app, this would use AI to intelligently tailor the resume
    
    const jobAnalysis = this.analyzeJobDescription(jobDescription);
    const tailoredResume = JSON.parse(JSON.stringify(resume)) as Resume; // Deep clone
    const changes: TailoringResult['changes'] = [];
    
    // Tailor the summary
    const originalSummary = resume.summary;
    let tailoredSummary = originalSummary;
    
    // Add job-specific keywords to summary if they're not already there
    jobAnalysis.keySkills.slice(0, 3).forEach(skill => {
      if (!tailoredSummary.toLowerCase().includes(skill.toLowerCase())) {
        tailoredSummary = tailoredSummary.replace(
          /\.\s*$/, 
          `, with expertise in ${skill}. `
        );
      }
    });
    
    // Add company name if not present
    if (!tailoredSummary.toLowerCase().includes(jobDescription.company.toLowerCase())) {
      tailoredSummary = tailoredSummary.replace(
        /\.\s*$/, 
        `. Looking to leverage these skills as a ${jobDescription.title} at ${jobDescription.company}.`
      );
    }
    
    if (tailoredSummary !== originalSummary) {
      tailoredResume.summary = tailoredSummary;
      changes.push({
        section: 'Summary',
        original: originalSummary,
        tailored: tailoredSummary,
        reason: 'Added job-specific keywords and mentioned the company'
      });
    }
    
    // Tailor skills section
    const skillsSection = tailoredResume.sections.find(s => s.type === 'skills');
    if (skillsSection) {
      // Assuming skills section has categories
      const originalSkills = JSON.stringify(skillsSection.content);
      
      // Prioritize skills that match job requirements
      if (skillsSection.content.categories) {
        skillsSection.content.categories.forEach((category: any) => {
          // Move matching skills to the front of each category
          const skills = [...category.skills];
          const matchingSkills = skills.filter(skill => 
            jobAnalysis.keySkills.some(jobSkill => 
              jobSkill.toLowerCase() === skill.toLowerCase()
            )
          );
          
          const nonMatchingSkills = skills.filter(skill => 
            !jobAnalysis.keySkills.some(jobSkill => 
              jobSkill.toLowerCase() === skill.toLowerCase()
            )
          );
          
          category.skills = [...matchingSkills, ...nonMatchingSkills];
        });
      }
      
      const tailoredSkills = JSON.stringify(skillsSection.content);
      if (tailoredSkills !== originalSkills) {
        changes.push({
          section: 'Skills',
          original: originalSkills,
          tailored: tailoredSkills,
          reason: 'Prioritized skills that match job requirements'
        });
      }
    }
    
    // Check keyword matches
    const keywordMatches = jobAnalysis.importantKeywords.map(keyword => {
      const resumeText = JSON.stringify(resume).toLowerCase();
      const found = resumeText.includes(keyword.toLowerCase());
      
      return {
        keyword,
        found,
        importance: found ? 'high' as const : 'medium' as const
      };
    });
    
    // Generate suggestions
    const suggestions: string[] = [];
    
    const missingKeywords = keywordMatches
      .filter(k => !k.found)
      .map(k => k.keyword);
    
    if (missingKeywords.length > 0) {
      suggestions.push(`Consider adding these keywords: ${missingKeywords.join(', ')}`);
    }
    
    // Calculate match score (simplified)
    const foundKeywords = keywordMatches.filter(k => k.found).length;
    const keywordScore = Math.round((foundKeywords / keywordMatches.length) * 100);
    
    // Adjust score based on experience and skills match
    let experienceScore = 70; // Default
    const experienceSection = resume.sections.find(s => s.type === 'experience');
    if (experienceSection && experienceSection.content.length > 0) {
      experienceScore = Math.min(100, 60 + experienceSection.content.length * 10);
    }
    
    const finalScore = Math.round((keywordScore + experienceScore) / 2);
    
    return {
      score: finalScore,
      tailoredResume,
      changes,
      keywordMatches,
      suggestions
    };
  }
  
  /**
   * Generates ATS-friendly formatting suggestions
   */
  generateATSSuggestions(resume: Resume): string[] {
    // This is a placeholder implementation
    const suggestions: string[] = [];
    
    // Check for common ATS issues
    if (!resume.summary || resume.summary.length < 50) {
      suggestions.push('Add a more detailed professional summary (100-200 words)');
    }
    
    const experienceSection = resume.sections.find(s => s.type === 'experience');
    if (experienceSection) {
      const experiences = experienceSection.content;
      
      if (Array.isArray(experiences)) {
        experiences.forEach((exp: any, index: number) => {
          if (!exp.description || (Array.isArray(exp.description) && exp.description.length < 3)) {
            suggestions.push(`Add more bullet points to your ${exp.title} role (aim for 3-5 per position)`);
          }
          
          if (exp.description && Array.isArray(exp.description)) {
            const actionVerbs = ['led', 'managed', 'developed', 'created', 'implemented', 'designed', 'built'];
            const hasActionVerbs = exp.description.some((bullet: string) => 
              actionVerbs.some(verb => bullet.toLowerCase().startsWith(verb))
            );
            
            if (!hasActionVerbs) {
              suggestions.push(`Start bullet points with action verbs in your ${exp.title} role`);
            }
          }
        });
      }
    }
    
    // Check for skills section
    const skillsSection = resume.sections.find(s => s.type === 'skills');
    if (!skillsSection) {
      suggestions.push('Add a dedicated skills section to improve ATS matching');
    }
    
    // Check personal info
    if (!resume.personalInfo.phone || !resume.personalInfo.email) {
      suggestions.push('Ensure contact information is complete (phone and email)');
    }
    
    return suggestions;
  }
}

export default new ResumeTailoringService();