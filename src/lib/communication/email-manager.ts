/**
 * Email Manager
 * 
 * This module provides utilities for managing job application communications,
 * including drafting emails, follow-ups, and tracking correspondence.
 */

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'application' | 'follow-up' | 'thank-you' | 'networking';
  variables: string[]; // Placeholder variables like {{name}}, {{company}}, etc.
}

interface EmailDraft {
  to: string;
  subject: string;
  content: string;
  attachments?: File[];
}

export class EmailManager {
  private templates: EmailTemplate[] = [
    {
      id: '1',
      name: 'Application Follow-up',
      subject: 'Following up on my application for {{position}} at {{company}}',
      content: `Dear {{recipientName}},

I hope this email finds you well. I recently applied for the {{position}} position at {{company}} on {{applicationDate}} and wanted to follow up to express my continued interest in the role.

I'm particularly excited about {{companyDetail}} and believe my experience with {{relevantSkill}} would make me a great fit for your team.

I've attached my resume again for your convenience. Please let me know if you need any additional information from me.

Thank you for your time and consideration.

Best regards,
{{senderName}}`,
      type: 'follow-up',
      variables: ['recipientName', 'position', 'company', 'applicationDate', 'companyDetail', 'relevantSkill', 'senderName']
    },
    {
      id: '2',
      name: 'Interview Thank You',
      subject: 'Thank you for the interview - {{position}} position',
      content: `Dear {{recipientName}},

Thank you for taking the time to speak with me yesterday about the {{position}} position at {{company}}. I enjoyed our conversation and learning more about the team and the role.

After our discussion, I'm even more enthusiastic about the opportunity to join {{company}} and contribute to {{projectDiscussed}}.

The position seems like an excellent match for my skills and experience, particularly my background in {{relevantSkill}}. I was also excited to hear about your approach to {{interestingTopic}}.

Please don't hesitate to contact me if you need any additional information. I look forward to hearing from you about the next steps in the process.

Best regards,
{{senderName}}`,
      type: 'thank-you',
      variables: ['recipientName', 'position', 'company', 'projectDiscussed', 'relevantSkill', 'interestingTopic', 'senderName']
    }
  ];
  
  /**
   * Creates a draft email based on a template and provided variables
   */
  createEmailDraft(
    templateId: string,
    variables: Record<string, string>,
    recipientEmail: string
  ): EmailDraft | null {
    const template = this.templates.find(t => t.id === templateId);
    
    if (!template) {
      return null;
    }
    
    let subject = template.subject;
    let content = template.content;
    
    // Replace variables in subject and content
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(placeholder, value);
      content = content.replace(placeholder, value);
    });
    
    return {
      to: recipientEmail,
      subject,
      content
    };
  }
  
  /**
   * Suggests follow-up timing based on application status and previous communications
   */
  suggestFollowUpTiming(
    applicationDate: Date,
    lastCommunication: Date | null,
    status: 'applied' | 'interview' | 'offer' | 'rejected'
  ): { suggestedDate: Date; reason: string } {
    const today = new Date();
    let suggestedDate = new Date();
    let reason = '';
    
    switch (status) {
      case 'applied':
        // If no response after 1-2 weeks, follow up
        const daysSinceApplication = Math.floor((today.getTime() - applicationDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceApplication < 7) {
          // Too soon to follow up
          suggestedDate.setDate(applicationDate.getDate() + 7);
          reason = 'Wait at least 1 week after applying before following up';
        } else if (daysSinceApplication > 14) {
          // Follow up now
          reason = 'It\'s been over 2 weeks since your application with no response';
        } else {
          // Follow up soon
          suggestedDate.setDate(applicationDate.getDate() + 14);
          reason = 'Follow up 2 weeks after applying if no response';
        }
        break;
        
      case 'interview':
        // Send thank you within 24 hours after interview
        if (!lastCommunication) {
          reason = 'Send a thank you email within 24 hours after your interview';
          suggestedDate = today;
        } else {
          // If it's been a week since interview with no update
          const daysSinceLastComm = Math.floor((today.getTime() - lastCommunication.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysSinceLastComm >= 7) {
            reason = 'It\'s been a week since your last communication after the interview';
            suggestedDate = today;
          } else {
            suggestedDate.setDate(lastCommunication.getDate() + 7);
            reason = 'Follow up one week after your last communication if no response';
          }
        }
        break;
        
      case 'offer':
        // Respond to offer within 2-3 days
        reason = 'Respond to the offer within 2-3 business days';
        suggestedDate = today;
        break;
        
      case 'rejected':
        // Send a thank you note within a week
        suggestedDate.setDate(today.getDate() + 3);
        reason = 'Send a thank you note and keep the door open for future opportunities';
        break;
    }
    
    return { suggestedDate, reason };
  }
  
  /**
   * Generates a personalized email draft based on application context
   */
  generateContextualEmail(
    applicationType: 'follow-up' | 'thank-you' | 'application' | 'networking',
    context: {
      recipientName: string;
      recipientEmail: string;
      company: string;
      position: string;
      applicationDate?: string;
      interviewDate?: string;
      senderName: string;
      relevantSkills: string[];
      companyDetails?: string;
    }
  ): EmailDraft {
    // Find appropriate template
    const template = this.templates.find(t => t.type === applicationType);
    
    if (!template) {
      // Create a basic template if none exists
      let subject = '';
      let content = '';
      
      switch (applicationType) {
        case 'application':
          subject = `Application for ${context.position} position at ${context.company}`;
          content = `Dear ${context.recipientName},\n\nI am writing to apply for the ${context.position} position at ${context.company}...\n\nSincerely,\n${context.senderName}`;
          break;
        case 'follow-up':
          subject = `Following up on my application for ${context.position} at ${context.company}`;
          content = `Dear ${context.recipientName},\n\nI recently applied for the ${context.position} position at ${context.company} and wanted to follow up...\n\nBest regards,\n${context.senderName}`;
          break;
        case 'thank-you':
          subject = `Thank you for the interview - ${context.position} position`;
          content = `Dear ${context.recipientName},\n\nThank you for taking the time to speak with me about the ${context.position} position at ${context.company}...\n\nBest regards,\n${context.senderName}`;
          break;
        case 'networking':
          subject = `Connecting regarding opportunities at ${context.company}`;
          content = `Dear ${context.recipientName},\n\nI hope this email finds you well. I'm reaching out because I'm interested in opportunities at ${context.company}...\n\nBest regards,\n${context.senderName}`;
          break;
      }
      
      return {
        to: context.recipientEmail,
        subject,
        content
      };
    }
    
    // Use template and fill in variables
    const variables: Record<string, string> = {
      recipientName: context.recipientName,
      position: context.position,
      company: context.company,
      senderName: context.senderName,
      relevantSkill: context.relevantSkills[0] || 'relevant skills',
      applicationDate: context.applicationDate || new Date().toLocaleDateString(),
      companyDetail: context.companyDetails || `the innovative work at ${context.company}`
    };
    
    if (context.interviewDate) {
      variables.interviewDate = context.interviewDate;
    }
    
    // Add any missing variables with placeholders
    template.variables.forEach(variable => {
      if (!variables[variable]) {
        variables[variable] = `[Your ${variable}]`;
      }
    });
    
    return this.createEmailDraft(template.id, variables, context.recipientEmail) || {
      to: context.recipientEmail,
      subject: 'Regarding my application',
      content: 'Draft email content'
    };
  }
}

export default new EmailManager();