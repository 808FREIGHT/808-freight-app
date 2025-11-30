-- Create quote_requests table
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT,
  user_phone TEXT NOT NULL,
  company_name TEXT,
  pickup_island TEXT NOT NULL,
  delivery_island TEXT NOT NULL,
  cargo_type TEXT NOT NULL,
  length_inches NUMERIC,
  width_inches NUMERIC,
  height_inches NUMERIC,
  weight_lbs NUMERIC NOT NULL,
  selected_carriers TEXT[] NOT NULL,
  status TEXT DEFAULT 'pending',
  special_instructions TEXT,
  metadata JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS quote_requests_created_at_idx ON public.quote_requests(created_at DESC);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS quote_requests_status_idx ON public.quote_requests(status);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow inserts from anyone (since it's a public form)
CREATE POLICY "Allow public inserts" ON public.quote_requests
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create a policy to allow authenticated users to view all records
CREATE POLICY "Allow authenticated reads" ON public.quote_requests
  FOR SELECT TO authenticated
  USING (true);
