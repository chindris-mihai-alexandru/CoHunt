-- Enable Row Level Security
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Job" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Search" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Application" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SavedJob" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SearchHistory" ENABLE ROW LEVEL SECURITY;

-- User policies
CREATE POLICY "Users can view their own data" ON "User"
    FOR SELECT
    USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own data" ON "User"
    FOR UPDATE
    USING (auth.uid()::text = id);

-- Job policies
CREATE POLICY "Jobs are viewable by all authenticated users" ON "Job"
    FOR SELECT
    TO authenticated
    USING (true);

-- Search policies
CREATE POLICY "Users can view their own searches" ON "Search"
    FOR SELECT
    USING (auth.uid()::text = userId);

CREATE POLICY "Users can create their own searches" ON "Search"
    FOR INSERT
    WITH CHECK (auth.uid()::text = userId);

-- Application policies
CREATE POLICY "Users can view their own applications" ON "Application"
    FOR SELECT
    USING (auth.uid()::text = userId);

CREATE POLICY "Users can create their own applications" ON "Application"
    FOR INSERT
    WITH CHECK (auth.uid()::text = userId);

CREATE POLICY "Users can update their own applications" ON "Application"
    FOR UPDATE
    USING (auth.uid()::text = userId);

-- SavedJob policies
CREATE POLICY "Users can view their own saved jobs" ON "SavedJob"
    FOR SELECT
    USING (auth.uid()::text = userId);

CREATE POLICY "Users can create their own saved jobs" ON "SavedJob"
    FOR INSERT
    WITH CHECK (auth.uid()::text = userId);

CREATE POLICY "Users can delete their own saved jobs" ON "SavedJob"
    FOR DELETE
    USING (auth.uid()::text = userId);

-- SearchHistory policies
CREATE POLICY "Users can view their own search history" ON "SearchHistory"
    FOR SELECT
    USING (auth.uid()::text = userId);

CREATE POLICY "Users can create their own search history" ON "SearchHistory"
    FOR INSERT
    WITH CHECK (auth.uid()::text = userId);