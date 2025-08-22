-- Hackathon Submissions Table
CREATE TABLE submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Team Information
  team_name text NOT NULL,
  team_emails text[] NOT NULL CHECK (array_length(team_emails, 1) >= 1 AND array_length(team_emails, 1) <= 4),
  
  -- Project Links
  github_link text NOT NULL,
  live_demo_link text NOT NULL,
  twitter_post_link text NOT NULL,
  
  -- Metadata
  submitted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Constraints
  CONSTRAINT valid_team_size CHECK (array_length(team_emails, 1) BETWEEN 1 AND 4),
  CONSTRAINT valid_github_url CHECK (github_link ~* '^https?://github\.com/.+'),
  CONSTRAINT valid_twitter_url CHECK (twitter_post_link ~* '^https?://(twitter\.com|x\.com)/.+')
);

-- Add RLS (Row Level Security)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for public submission)
CREATE POLICY "Anyone can submit" ON submissions
  FOR INSERT WITH CHECK (true);

-- Create policy to allow reading all submissions (for admin purposes)
CREATE POLICY "Anyone can read submissions" ON submissions
  FOR SELECT USING (true);

-- Create index for performance
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX idx_submissions_team_name ON submissions(team_name);