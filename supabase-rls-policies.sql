-- Enable Row Level Security on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Job" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Search" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Application" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SavedJob" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SearchHistory" ENABLE ROW LEVEL SECURITY;

-- User table policies
-- Users can only read and update their own records
CREATE POLICY "Users can view own profile" ON "User"
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON "User"
  FOR UPDATE USING (auth.uid()::text = id);

-- Service role can manage all users (for admin operations)
CREATE POLICY "Service role can manage users" ON "User"
  FOR ALL USING (auth.role() = 'service_role');

-- Job table policies
-- Everyone can read jobs (public data)
CREATE POLICY "Jobs are viewable by everyone" ON "Job"
  FOR SELECT USING (true);

-- Only service role can insert/update/delete jobs (for scraping)
CREATE POLICY "Service role can manage jobs" ON "Job"
  FOR ALL USING (auth.role() = 'service_role');

-- Search table policies
-- Users can only view and create their own searches
CREATE POLICY "Users can view own searches" ON "Search"
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can create searches" ON "Search"
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- Service role full access
CREATE POLICY "Service role can manage searches" ON "Search"
  FOR ALL USING (auth.role() = 'service_role');

-- Application table policies
-- Users can only manage their own applications
CREATE POLICY "Users can view own applications" ON "Application"
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can create applications" ON "Application"
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own applications" ON "Application"
  FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own applications" ON "Application"
  FOR DELETE USING (auth.uid()::text = "userId");

-- Service role full access
CREATE POLICY "Service role can manage applications" ON "Application"
  FOR ALL USING (auth.role() = 'service_role');

-- SavedJob table policies
-- Users can only manage their own saved jobs
CREATE POLICY "Users can view own saved jobs" ON "SavedJob"
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can save jobs" ON "SavedJob"
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can delete saved jobs" ON "SavedJob"
  FOR DELETE USING (auth.uid()::text = "userId");

-- Service role full access
CREATE POLICY "Service role can manage saved jobs" ON "SavedJob"
  FOR ALL USING (auth.role() = 'service_role');

-- SearchHistory table policies
-- Users can only view their own search history
CREATE POLICY "Users can view own search history" ON "SearchHistory"
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can create search history" ON "SearchHistory"
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- Service role full access
CREATE POLICY "Service role can manage search history" ON "SearchHistory"
  FOR ALL USING (auth.role() = 'service_role'); 