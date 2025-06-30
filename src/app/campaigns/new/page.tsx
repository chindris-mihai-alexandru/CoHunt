'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Users, 
  Mail, 
  Target,
  Plus,
  X,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EmailTemplate {
  subject: string;
  content: string;
  delay: number; // days
}

interface Campaign {
  name: string;
  type: 'outreach' | 'nurture' | 'follow-up';
  targetRole: string;
  targetCompanies: string[];
  targetSkills: string[];
  emailTemplates: EmailTemplate[];
  sendingSchedule: {
    startDate: string;
    timeZone: string;
    sendTime: string;
    daysOfWeek: string[];
  };
}

export default function NewCampaignPage() {
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign>({
    name: '',
    type: 'outreach',
    targetRole: '',
    targetCompanies: [],
    targetSkills: [],
    emailTemplates: [
      {
        subject: '',
        content: '',
        delay: 0
      }
    ],
    sendingSchedule: {
      startDate: new Date().toISOString().split('T')[0],
      timeZone: 'America/New_York',
      sendTime: '09:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    }
  });
  
  const [saving, setSaving] = useState(false);
  const [previewEmail, setPreviewEmail] = useState<number | null>(null);

  const addEmailTemplate = () => {
    setCampaign({
      ...campaign,
      emailTemplates: [
        ...campaign.emailTemplates,
        {
          subject: '',
          content: '',
          delay: campaign.emailTemplates.length * 3 // Default 3 days between emails
        }
      ]
    });
  };

  const removeEmailTemplate = (index: number) => {
    if (campaign.emailTemplates.length > 1) {
      setCampaign({
        ...campaign,
        emailTemplates: campaign.emailTemplates.filter((_, i) => i !== index)
      });
    }
  };

  const updateEmailTemplate = (index: number, field: keyof EmailTemplate, value: string | number) => {
    const newTemplates = [...campaign.emailTemplates];
    newTemplates[index] = { ...newTemplates[index], [field]: value };
    setCampaign({ ...campaign, emailTemplates: newTemplates });
  };

  const addTargetItem = (field: 'targetCompanies' | 'targetSkills', value: string) => {
    if (value.trim() && !campaign[field].includes(value.trim())) {
      setCampaign({
        ...campaign,
        [field]: [...campaign[field], value.trim()]
      });
    }
  };

  const removeTargetItem = (field: 'targetCompanies' | 'targetSkills', index: number) => {
    setCampaign({
      ...campaign,
      [field]: campaign[field].filter((_, i) => i !== index)
    });
  };

  const handleSave = async (isDraft = true) => {
    if (!campaign.name.trim()) {
      toast.error('Campaign name is required');
      return;
    }

    if (!campaign.targetRole.trim()) {
      toast.error('Target role is required');
      return;
    }

    if (campaign.emailTemplates.some(template => !template.subject.trim() || !template.content.trim())) {
      toast.error('All email templates must have subject and content');
      return;
    }

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isDraft) {
        toast.success('Campaign saved as draft');
      } else {
        toast.success('Campaign created and activated');
      }
      
      router.push('/campaigns');
    } catch (error) {
      toast.error('Failed to save campaign');
    } finally {
      setSaving(false);
    }
  };

  const getEmailPreview = (template: EmailTemplate) => {
    // Replace placeholders with sample data
    const sampleData = {
      '{{firstName}}': 'John',
      '{{lastName}}': 'Doe',
      '{{company}}': 'TechCorp',
      '{{role}}': campaign.targetRole || 'Software Engineer',
      '{{recruiterName}}': 'Alex Thompson',
      '{{recruiterCompany}}': 'TechTalent Solutions'
    };

    let preview = template.content;
    Object.entries(sampleData).forEach(([placeholder, value]) => {
      preview = preview.replace(new RegExp(placeholder, 'g'), value);
    });

    return preview;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Campaign</h1>
                <p className="text-gray-600 dark:text-gray-400">Set up automated email sequences for candidate outreach</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {saving ? 'Creating...' : 'Create & Activate'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Campaign Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={campaign.name}
                  onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Frontend Developer Outreach Q1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Campaign Type
                </label>
                <select
                  value={campaign.type}
                  onChange={(e) => setCampaign({ ...campaign, type: e.target.value as Campaign['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="outreach">Initial Outreach</option>
                  <option value="nurture">Nurture Sequence</option>
                  <option value="follow-up">Follow-up Campaign</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Role *
                </label>
                <input
                  type="text"
                  value={campaign.targetRole}
                  onChange={(e) => setCampaign({ ...campaign, targetRole: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Senior Frontend Developer"
                />
              </div>
            </div>
          </div>

          {/* Targeting */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Targeting Criteria</h2>
            <div className="space-y-6">
              {/* Target Companies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Companies
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {campaign.targetCompanies.map((company, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-1">
                      {company}
                      <button
                        onClick={() => removeTargetItem('targetCompanies', index)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add company and press Enter"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addTargetItem('targetCompanies', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>

              {/* Target Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Required Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {campaign.targetSkills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm flex items-center gap-1">
                      {skill}
                      <button
                        onClick={() => removeTargetItem('targetSkills', index)}
                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add skill and press Enter"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addTargetItem('targetSkills', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Email Templates */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Email Sequence</h2>
              <button
                onClick={addEmailTemplate}
                className="px-3 py-1 text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Email
              </button>
            </div>
            
            <div className="space-y-6">
              {campaign.emailTemplates.map((template, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Email {index + 1} {index === 0 ? '(Initial)' : `(+${template.delay} days)`}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewEmail(previewEmail === index ? null : index)}
                        className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        title="Preview email"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {campaign.emailTemplates.length > 1 && (
                        <button
                          onClick={() => removeEmailTemplate(index)}
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Remove email"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {index > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Send after (days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={template.delay}
                        onChange={(e) => updateEmailTemplate(index, 'delay', parseInt(e.target.value) || 1)}
                        className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject Line *
                      </label>
                      <input
                        type="text"
                        value={template.subject}
                        onChange={(e) => updateEmailTemplate(index, 'subject', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter email subject"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Content *
                      </label>
                      <textarea
                        value={template.content}
                        onChange={(e) => updateEmailTemplate(index, 'content', e.target.value)}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Write your email content here. Use {{firstName}}, {{lastName}}, {{company}}, {{role}} for personalization."
                      />
                    </div>

                    {previewEmail === index && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Preview</h4>
                        <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          <div className="font-medium mb-2">Subject: {template.subject}</div>
                          <div>{getEmailPreview(template)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sending Schedule */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sending Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={campaign.sendingSchedule.startDate}
                  onChange={(e) => setCampaign({
                    ...campaign,
                    sendingSchedule: { ...campaign.sendingSchedule, startDate: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Zone
                </label>
                <select
                  value={campaign.sendingSchedule.timeZone}
                  onChange={(e) => setCampaign({
                    ...campaign,
                    sendingSchedule: { ...campaign.sendingSchedule, timeZone: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Send Time
                </label>
                <input
                  type="time"
                  value={campaign.sendingSchedule.sendTime}
                  onChange={(e) => setCampaign({
                    ...campaign,
                    sendingSchedule: { ...campaign.sendingSchedule, sendTime: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Days of Week
              </label>
              <div className="flex flex-wrap gap-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={campaign.sendingSchedule.daysOfWeek.includes(day)}
                      onChange={(e) => {
                        const newDays = e.target.checked
                          ? [...campaign.sendingSchedule.daysOfWeek, day]
                          : campaign.sendingSchedule.daysOfWeek.filter(d => d !== day);
                        setCampaign({
                          ...campaign,
                          sendingSchedule: { ...campaign.sendingSchedule, daysOfWeek: newDays }
                        });
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}