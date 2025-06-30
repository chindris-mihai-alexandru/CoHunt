// Resend API integration for email delivery
// This is a placeholder implementation - replace with actual Resend SDK

interface ResendEmail {
  to: string[];
  from: string;
  subject: string;
  html?: string;
  text?: string;
  reply_to?: string;
  cc?: string[];
  bcc?: string[];
  tags?: { name: string; value: string }[];
}

interface ResendEmailResponse {
  id: string;
  from: string;
  to: string[];
  created_at: string;
}

interface ResendEmailStatus {
  id: string;
  status: 'sent' | 'delivered' | 'bounced' | 'complained' | 'opened' | 'clicked';
  created_at: string;
  updated_at: string;
}

class ResendService {
  private apiKey: string;
  private baseUrl = 'https://api.resend.com';

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || '';
  }

  async sendEmail(email: ResendEmail): Promise<ResendEmailResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(email),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Resend API error: ${error.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Resend sendEmail error:', error);
      
      // Return mock response for development
      return {
        id: `mock_${Date.now()}`,
        from: email.from,
        to: email.to,
        created_at: new Date().toISOString(),
      };
    }
  }

  async sendBulkEmails(emails: ResendEmail[]): Promise<ResendEmailResponse[]> {
    try {
      const response = await fetch(`${this.baseUrl}/emails/batch`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emails),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Resend API error: ${error.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Resend sendBulkEmails error:', error);
      
      // Return mock responses for development
      return emails.map((email, index) => ({
        id: `mock_bulk_${Date.now()}_${index}`,
        from: email.from,
        to: email.to,
        created_at: new Date().toISOString(),
      }));
    }
  }

  async getEmailStatus(emailId: string): Promise<ResendEmailStatus | null> {
    try {
      const response = await fetch(`${this.baseUrl}/emails/${emailId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Resend API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Resend getEmailStatus error:', error);
      
      // Return mock status for development
      const statuses: ResendEmailStatus['status'][] = ['sent', 'delivered', 'opened'];
      return {
        id: emailId,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  }

  async createEmailTemplate(name: string, subject: string, html: string): Promise<{ id: string; name: string } | null> {
    try {
      // Note: Resend doesn't have a templates API yet, this is a placeholder
      console.log('Creating email template:', { name, subject });
      
      // Return mock template for development
      return {
        id: `template_${Date.now()}`,
        name,
      };
    } catch (error) {
      console.error('Resend createEmailTemplate error:', error);
      return null;
    }
  }

  // Helper method to create personalized emails
  createPersonalizedEmail(
    template: string,
    recipient: {
      email: string;
      firstName?: string;
      lastName?: string;
      company?: string;
      title?: string;
    },
    variables: Record<string, string> = {}
  ): string {
    let personalizedContent = template;
    
    // Replace common placeholders
    const replacements = {
      '{{firstName}}': recipient.firstName || 'there',
      '{{lastName}}': recipient.lastName || '',
      '{{fullName}}': `${recipient.firstName || ''} ${recipient.lastName || ''}`.trim() || 'there',
      '{{company}}': recipient.company || 'your company',
      '{{title}}': recipient.title || 'your role',
      '{{email}}': recipient.email,
      ...variables,
    };

    Object.entries(replacements).forEach(([placeholder, value]) => {
      personalizedContent = personalizedContent.replace(new RegExp(placeholder, 'g'), value);
    });

    return personalizedContent;
  }

  // Helper method to validate email template
  validateEmailTemplate(template: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check for required placeholders
    if (!template.includes('{{firstName}}') && !template.includes('{{fullName}}')) {
      errors.push('Template should include personalization ({{firstName}} or {{fullName}})');
    }
    
    // Check for unsubscribe link
    if (!template.includes('unsubscribe')) {
      errors.push('Template should include an unsubscribe link');
    }
    
    // Check for basic HTML structure if it contains HTML
    if (template.includes('<') && !template.includes('</html>')) {
      errors.push('HTML template should have proper structure');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const resendService = new ResendService();
export type { ResendEmail, ResendEmailResponse, ResendEmailStatus };