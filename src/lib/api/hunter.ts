// Hunter.io API integration for email verification
// This is a placeholder implementation - replace with actual Hunter.io API

interface HunterEmailVerification {
  email: string;
  result: 'deliverable' | 'undeliverable' | 'risky' | 'unknown';
  score: number;
  regexp: boolean;
  gibberish: boolean;
  disposable: boolean;
  webmail: boolean;
  mx_records: boolean;
  smtp_server: boolean;
  smtp_check: boolean;
  accept_all: boolean;
  block: boolean;
}

interface HunterDomainSearch {
  domain: string;
  emails: {
    value: string;
    type: string;
    confidence: number;
    firstName?: string;
    lastName?: string;
    position?: string;
    department?: string;
    linkedin?: string;
    twitter?: string;
  }[];
  pattern?: string;
  organization?: string;
}

class HunterService {
  private apiKey: string;
  private baseUrl = 'https://api.hunter.io/v2';

  constructor() {
    this.apiKey = process.env.HUNTER_API_KEY || '';
  }

  async verifyEmail(email: string): Promise<HunterEmailVerification | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/email-verifier?email=${encodeURIComponent(email)}&api_key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Hunter API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Hunter verifyEmail error:', error);
      
      // Return mock data for development
      return {
        email,
        result: Math.random() > 0.2 ? 'deliverable' : 'risky',
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        regexp: true,
        gibberish: false,
        disposable: false,
        webmail: email.includes('@gmail.com') || email.includes('@yahoo.com'),
        mx_records: true,
        smtp_server: true,
        smtp_check: true,
        accept_all: false,
        block: false,
      };
    }
  }

  async findEmails(domain: string, limit: number = 10): Promise<HunterDomainSearch | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/domain-search?domain=${domain}&limit=${limit}&api_key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Hunter API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Hunter findEmails error:', error);
      
      // Return mock data for development
      return {
        domain,
        emails: [
          {
            value: `contact@${domain}`,
            type: 'generic',
            confidence: 85,
          },
          {
            value: `info@${domain}`,
            type: 'generic',
            confidence: 75,
          },
          {
            value: `john.doe@${domain}`,
            type: 'personal',
            confidence: 90,
            firstName: 'John',
            lastName: 'Doe',
            position: 'Software Engineer',
            department: 'Engineering',
          },
        ],
        pattern: '{first}.{last}@{domain}',
        organization: domain.split('.')[0],
      };
    }
  }

  async bulkVerifyEmails(emails: string[]): Promise<HunterEmailVerification[]> {
    try {
      // Hunter.io doesn't have a bulk verification endpoint in their free tier
      // So we'll verify emails one by one with a delay to respect rate limits
      const results: HunterEmailVerification[] = [];
      
      for (const email of emails) {
        const result = await this.verifyEmail(email);
        if (result) {
          results.push(result);
        }
        
        // Add delay to respect rate limits (1 request per second for free tier)
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      return results;
    } catch (error) {
      console.error('Hunter bulkVerifyEmails error:', error);
      return [];
    }
  }

  getEmailScore(verification: HunterEmailVerification): number {
    let score = verification.score;
    
    // Adjust score based on various factors
    if (verification.result === 'deliverable') score += 10;
    if (verification.result === 'undeliverable') score = 0;
    if (verification.result === 'risky') score -= 20;
    
    if (verification.disposable) score -= 30;
    if (verification.gibberish) score -= 40;
    if (!verification.mx_records) score -= 50;
    if (!verification.smtp_server) score -= 30;
    
    return Math.max(0, Math.min(100, score));
  }

  isEmailRecommended(verification: HunterEmailVerification): boolean {
    const score = this.getEmailScore(verification);
    return score >= 70 && verification.result === 'deliverable';
  }
}

export const hunterService = new HunterService();
export type { HunterEmailVerification, HunterDomainSearch };