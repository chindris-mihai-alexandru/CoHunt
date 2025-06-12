-- Add missing policies for User table
CREATE POLICY "Users can create their own account" ON "User"
    FOR INSERT
    WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can delete their own account" ON "User"
    FOR DELETE
    USING (auth.uid()::text = id);

-- Add missing DELETE policies for other tables
CREATE POLICY "Users can delete their own searches" ON "Search"
    FOR DELETE
    USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete their own applications" ON "Application"
    FOR DELETE
    USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete their own search history" ON "SearchHistory"
    FOR DELETE
    USING (auth.uid()::text = "userId");

-- Add Job management policies for admin/service role
-- Note: These policies allow the service role (used by our scraper) to manage jobs
CREATE POLICY "Service role can create jobs" ON "Job"
    FOR INSERT
    TO service_role
    WITH CHECK (true);

CREATE POLICY "Service role can update jobs" ON "Job"
    FOR UPDATE
    TO service_role
    USING (true);

CREATE POLICY "Service role can delete jobs" ON "Job"
    FOR DELETE
    TO service_role
    USING (true);

-- Optional: Add a policy for authenticated users to suggest job edits (future feature)
-- This would require an additional "job_suggestions" table
-- CREATE POLICY "Users can suggest job improvements" ON "JobSuggestions"
--     FOR INSERT
--     TO authenticated
--     WITH CHECK (auth.uid()::text = "userId");