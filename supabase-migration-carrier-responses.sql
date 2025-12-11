-- =====================================================
-- 808 FREIGHT - CARRIER RESPONSE TRACKING MIGRATION
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 1. Add quote_id column to quote_requests table
ALTER TABLE quote_requests 
ADD COLUMN IF NOT EXISTS quote_id VARCHAR(20) UNIQUE;

-- 2. Create index on quote_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_quote_requests_quote_id 
ON quote_requests(quote_id);

-- 3. Create carrier_responses table to track all carrier replies
CREATE TABLE IF NOT EXISTS carrier_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id VARCHAR(20) REFERENCES quote_requests(quote_id),
  carrier_name VARCHAR(100),
  carrier_email VARCHAR(255),
  subject TEXT,
  body TEXT,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  forwarded_to_customer BOOLEAN DEFAULT FALSE,
  forwarded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create index on quote_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_carrier_responses_quote_id 
ON carrier_responses(quote_id);

-- 5. Create index on received_at for sorting
CREATE INDEX IF NOT EXISTS idx_carrier_responses_received_at 
ON carrier_responses(received_at DESC);

-- 6. Enable Row Level Security on carrier_responses
ALTER TABLE carrier_responses ENABLE ROW LEVEL SECURITY;

-- 7. Allow service role to insert carrier responses (for webhook)
CREATE POLICY "Allow service role inserts" ON carrier_responses
  FOR INSERT TO service_role
  WITH CHECK (true);

-- 8. Allow service role to update carrier responses
CREATE POLICY "Allow service role updates" ON carrier_responses
  FOR UPDATE TO service_role
  USING (true);

-- 9. Allow authenticated users to view carrier responses
CREATE POLICY "Allow authenticated reads" ON carrier_responses
  FOR SELECT TO authenticated
  USING (true);

-- 10. Update RLS policy on quote_requests to allow service role inserts
-- (This ensures the send-email API can save quotes)
DROP POLICY IF EXISTS "Allow public inserts" ON quote_requests;

CREATE POLICY "Allow public and service inserts" ON quote_requests
  FOR INSERT TO anon, service_role
  WITH CHECK (true);

-- 11. Allow service role to update quote_requests (for status changes)
CREATE POLICY "Allow service role updates" ON quote_requests
  FOR UPDATE TO service_role
  USING (true);

-- =====================================================
-- VERIFICATION QUERIES (run these to confirm success)
-- =====================================================

-- Check quote_requests has quote_id column:
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'quote_requests' AND column_name = 'quote_id';

-- Check carrier_responses table exists:
-- SELECT * FROM information_schema.tables WHERE table_name = 'carrier_responses';

-- =====================================================
-- DONE! Your database is now ready for carrier tracking.
-- =====================================================


