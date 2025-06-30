// Apollo.io API integration for email finding and company data
// This is a placeholder implementation - replace with actual Apollo.io SDK

interface ApolloContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  company: string;
  linkedinUrl?: string;
  verified: boolean;
}

interface ApolloCompany {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
  location: string;
  description: string;
}

class ApolloService {
  private apiKey: string;
  private baseUrl = 'https://api.apollo.io/v1';

  constructor() {
    this.apiKey = process.env.APOLLO_API_KEY || '';
  }

  async findContactByEmail(email: string): Promise<ApolloContact | null> {
    try {
      // Placeholder implementation
      // In production, use actual Apollo.io API
      const response = await fetch(`${this.baseUrl}/people/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': this.apiKey,
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error(`Apollo API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.person) {
        return {
          id: data.person.id,
          firstName: data.person.first_name,
          lastName: data.person.last_name,
          email: data.person.email,
          title: data.person.title,
          company: data.person.organization?.name || '',
          linkedinUrl: data.person.linkedin_url,
          verified: data.person.email_status === 'verified',
        };
      }

      return null;
    } catch (error) {
      console.error('Apollo findContactByEmail error:', error);
      return null;
    }
  }

  async searchContacts(params: {
    title?: string;
    company?: string;
    location?: string;
    skills?: string[];
    limit?: number;
  }): Promise<ApolloContact[]> {
    try {
      // Placeholder implementation
      const response = await fetch(`${this.baseUrl}/mixed_people/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': this.apiKey,
        },
        body: JSON.stringify({
          q_person_title: params.title,
          q_organization_name: params.company,
          person_locations: params.location ? [params.location] : undefined,
          page: 1,
          per_page: params.limit || 25,
        }),
      });

      if (!response.ok) {
        throw new Error(`Apollo API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.people?.map((person: any) => ({
        id: person.id,
        firstName: person.first_name,
        lastName: person.last_name,
        email: person.email,
        title: person.title,
        company: person.organization?.name || '',
        linkedinUrl: person.linkedin_url,
        verified: person.email_status === 'verified',
      })) || [];
    } catch (error) {
      console.error('Apollo searchContacts error:', error);
      return [];
    }
  }

  async getCompanyInfo(domain: string): Promise<ApolloCompany | null> {
    try {
      const response = await fetch(`${this.baseUrl}/organizations/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': this.apiKey,
        },
        body: JSON.stringify({
          domain: domain,
        }),
      });

      if (!response.ok) {
        throw new Error(`Apollo API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.organization) {
        return {
          id: data.organization.id,
          name: data.organization.name,
          domain: data.organization.primary_domain,
          industry: data.organization.industry,
          size: data.organization.estimated_num_employees_range,
          location: data.organization.primary_location?.city || '',
          description: data.organization.short_description || '',
        };
      }

      return null;
    } catch (error) {
      console.error('Apollo getCompanyInfo error:', error);
      return null;
    }
  }

  // Mock data for development
  getMockContacts(): ApolloContact[] {
    return [
      {
        id: '1',
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'sarah.chen@techcorp.com',
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        linkedinUrl: 'https://linkedin.com/in/sarahchen',
        verified: true,
      },
      {
        id: '2',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@startupxyz.com',
        title: 'DevOps Engineer',
        company: 'StartupXYZ',
        linkedinUrl: 'https://linkedin.com/in/mikejohnson',
        verified: true,
      },
      {
        id: '3',
        firstName: 'Lisa',
        lastName: 'Wang',
        email: 'lisa.wang@innovateco.com',
        title: 'Product Manager',
        company: 'InnovateCo',
        linkedinUrl: 'https://linkedin.com/in/lisawang',
        verified: false,
      },
    ];
  }
}

export const apolloService = new ApolloService();
export type { ApolloContact, ApolloCompany };