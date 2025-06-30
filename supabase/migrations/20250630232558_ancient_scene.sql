/*
  # Candidate-Centric Platform Schema Migration

  1. New Tables
    - `Application` - Track job applications with status and communications
    - `Communication` - Store all email/phone/interview communications
    - `ResumeVersion` - Multiple resume versions optimized for different jobs
    - `Recruiter` - Recruiter profiles that candidates can discover
    - `Placement` - Track recruiter placement history
    - `EmailTemplate` - Pre-built email templates for communications

  2. Enhanced Tables
    - `User` - Added job seeker specific fields (location, skills, salary preferences)
    - `Job` - Enhanced with more detailed job information and filtering options
    - `SavedJob` - Added notes field for candidate job tracking

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for candidate data access
    - Ensure recruiters can only see public candidate data

  4. Indexes
    - Added performance indexes for common query patterns
    - Optimized for job search, application tracking, and recruiter discovery
*/

-- Create Application table
CREATE TABLE IF NOT EXISTS "Application" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  status TEXT DEFAULT 'applied' NOT NULL,
  "appliedAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "lastUpdated" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "nextAction" TEXT,
  "nextActionDate" TIMESTAMPTZ,
  notes TEXT,
  "resumeVersionId" TEXT,
  CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
  CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"(id) ON DELETE CASCADE,
  CONSTRAINT "Application_userId_jobId_key" UNIQUE ("userId", "jobId")
);

-- Create Communication table
CREATE TABLE IF NOT EXISTS "Communication" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "applicationId" TEXT,
  type TEXT NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  "sentAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "isInbound" BOOLEAN DEFAULT false NOT NULL,
  CONSTRAINT "Communication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
  CONSTRAINT "Communication_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"(id) ON DELETE CASCADE
);

-- Create ResumeVersion table
CREATE TABLE IF NOT EXISTS "ResumeVersion" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  name TEXT NOT NULL,
  content JSONB NOT NULL,
  "isDefault" BOOLEAN DEFAULT false NOT NULL,
  "optimizedFor" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT "ResumeVersion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Create Recruiter table
CREATE TABLE IF NOT EXISTS "Recruiter" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  bio TEXT,
  specializations TEXT[] DEFAULT ARRAY[]::TEXT[],
  industries TEXT[] DEFAULT ARRAY[]::TEXT[],
  experience INTEGER,
  "placementsMade" INTEGER DEFAULT 0 NOT NULL,
  "successRate" DOUBLE PRECISION DEFAULT 0 NOT NULL,
  "averageSalary" INTEGER,
  rating DOUBLE PRECISION DEFAULT 0 NOT NULL,
  "linkedinUrl" TEXT,
  "websiteUrl" TEXT,
  "isVerified" BOOLEAN DEFAULT false NOT NULL,
  "isActive" BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create Placement table
CREATE TABLE IF NOT EXISTS "Placement" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "recruiterId" TEXT NOT NULL,
  "jobTitle" TEXT NOT NULL,
  company TEXT NOT NULL,
  salary TEXT,
  "salaryAmount" INTEGER,
  "timeToFill" INTEGER,
  "placedAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT "Placement_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter"(id) ON DELETE CASCADE
);

-- Create EmailTemplate table
CREATE TABLE IF NOT EXISTS "EmailTemplate" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  "isDefault" BOOLEAN DEFAULT false NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add new columns to User table for job seekers
DO $$
BEGIN
  -- Add job seeker specific fields to User table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'location') THEN
    ALTER TABLE "User" ADD COLUMN location TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'phoneNumber') THEN
    ALTER TABLE "User" ADD COLUMN "phoneNumber" TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'linkedinUrl') THEN
    ALTER TABLE "User" ADD COLUMN "linkedinUrl" TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'websiteUrl') THEN
    ALTER TABLE "User" ADD COLUMN "websiteUrl" TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'skills') THEN
    ALTER TABLE "User" ADD COLUMN skills TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'experienceLevel') THEN
    ALTER TABLE "User" ADD COLUMN "experienceLevel" TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'desiredSalaryMin') THEN
    ALTER TABLE "User" ADD COLUMN "desiredSalaryMin" INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'desiredSalaryMax') THEN
    ALTER TABLE "User" ADD COLUMN "desiredSalaryMax" INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'isOpenToWork') THEN
    ALTER TABLE "User" ADD COLUMN "isOpenToWork" BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'preferredWorkType') THEN
    ALTER TABLE "User" ADD COLUMN "preferredWorkType" TEXT;
  END IF;
END $$;

-- Add new columns to Job table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'requirements') THEN
    ALTER TABLE "Job" ADD COLUMN requirements TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'salaryMin') THEN
    ALTER TABLE "Job" ADD COLUMN "salaryMin" INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'salaryMax') THEN
    ALTER TABLE "Job" ADD COLUMN "salaryMax" INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'experienceLevel') THEN
    ALTER TABLE "Job" ADD COLUMN "experienceLevel" TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Job' AND column_name = 'isRemote') THEN
    ALTER TABLE "Job" ADD COLUMN "isRemote" BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add notes column to SavedJob table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SavedJob' AND column_name = 'notes') THEN
    ALTER TABLE "SavedJob" ADD COLUMN notes TEXT;
  END IF;
END $$;

-- Add foreign key constraint for ResumeVersion in Application
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'Application_resumeVersionId_fkey'
  ) THEN
    ALTER TABLE "Application" ADD CONSTRAINT "Application_resumeVersionId_fkey" 
    FOREIGN KEY ("resumeVersionId") REFERENCES "ResumeVersion"(id);
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "Application_userId_status_idx" ON "Application"("userId", status);
CREATE INDEX IF NOT EXISTS "Application_appliedAt_idx" ON "Application"("appliedAt");
CREATE INDEX IF NOT EXISTS "Communication_userId_sentAt_idx" ON "Communication"("userId", "sentAt");
CREATE INDEX IF NOT EXISTS "Communication_applicationId_idx" ON "Communication"("applicationId");
CREATE INDEX IF NOT EXISTS "ResumeVersion_userId_isDefault_idx" ON "ResumeVersion"("userId", "isDefault");
CREATE INDEX IF NOT EXISTS "ResumeVersion_userId_createdAt_idx" ON "ResumeVersion"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "Recruiter_specializations_idx" ON "Recruiter" USING GIN(specializations);
CREATE INDEX IF NOT EXISTS "Recruiter_location_idx" ON "Recruiter"(location);
CREATE INDEX IF NOT EXISTS "Recruiter_isActive_isVerified_idx" ON "Recruiter"("isActive", "isVerified");
CREATE INDEX IF NOT EXISTS "Placement_recruiterId_placedAt_idx" ON "Placement"("recruiterId", "placedAt");
CREATE INDEX IF NOT EXISTS "EmailTemplate_type_isDefault_idx" ON "EmailTemplate"(type, "isDefault");
CREATE INDEX IF NOT EXISTS "Job_isActive_idx" ON "Job"("isActive");
CREATE INDEX IF NOT EXISTS "SavedJob_userId_savedAt_idx" ON "SavedJob"("userId", "savedAt");

-- Enable RLS on all new tables
ALTER TABLE "Application" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Communication" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ResumeVersion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Recruiter" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Placement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmailTemplate" ENABLE ROW LEVEL SECURITY;

-- Application policies
CREATE POLICY "Users can view their own applications" ON "Application"
    FOR SELECT
    USING (auth.uid()::text = "userId");

CREATE POLICY "Users can create their own applications" ON "Application"
    FOR INSERT
    WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update their own applications" ON "Application"
    FOR UPDATE
    USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete their own applications" ON "Application"
    FOR DELETE
    USING (auth.uid()::text = "userId");

-- Communication policies
CREATE POLICY "Users can view their own communications" ON "Communication"
    FOR SELECT
    USING (auth.uid()::text = "userId");

CREATE POLICY "Users can create their own communications" ON "Communication"
    FOR INSERT
    WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update their own communications" ON "Communication"
    FOR UPDATE
    USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete their own communications" ON "Communication"
    FOR DELETE
    USING (auth.uid()::text = "userId");

-- ResumeVersion policies
CREATE POLICY "Users can view their own resume versions" ON "ResumeVersion"
    FOR SELECT
    USING (auth.uid()::text = "userId");

CREATE POLICY "Users can create their own resume versions" ON "ResumeVersion"
    FOR INSERT
    WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update their own resume versions" ON "ResumeVersion"
    FOR UPDATE
    USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete their own resume versions" ON "ResumeVersion"
    FOR DELETE
    USING (auth.uid()::text = "userId");

-- Recruiter policies (public read access for discovery)
CREATE POLICY "Recruiters are viewable by all authenticated users" ON "Recruiter"
    FOR SELECT
    TO authenticated
    USING ("isActive" = true);

-- Service role can manage recruiters
CREATE POLICY "Service role can manage recruiters" ON "Recruiter"
    FOR ALL
    TO service_role
    USING (true);

-- Placement policies (public read access for recruiter profiles)
CREATE POLICY "Placements are viewable by all authenticated users" ON "Placement"
    FOR SELECT
    TO authenticated
    USING (true);

-- Service role can manage placements
CREATE POLICY "Service role can manage placements" ON "Placement"
    FOR ALL
    TO service_role
    USING (true);

-- EmailTemplate policies (public read access)
CREATE POLICY "Email templates are viewable by all authenticated users" ON "EmailTemplate"
    FOR SELECT
    TO authenticated
    USING (true);

-- Service role can manage email templates
CREATE POLICY "Service role can manage email templates" ON "EmailTemplate"
    FOR ALL
    TO service_role
    USING (true);