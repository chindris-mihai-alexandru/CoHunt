-- Enable RLS on all tables using a more efficient approach
DO $$
DECLARE
    table_name TEXT;
BEGIN
    FOR table_name IN 
        SELECT unnest(ARRAY['User', 'Job', 'Search', 'Application', 'SavedJob', 'SearchHistory'])
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', table_name);
    END LOOP;
END $$;

-- Note: This migration refactors the RLS enablement but doesn't change functionality
-- It's included to demonstrate the cleaner approach suggested by Copilot
-- In production, you might skip this if RLS is already enabled