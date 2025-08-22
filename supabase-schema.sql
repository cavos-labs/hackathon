-- Teams Table
CREATE TABLE teams (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Team Information
  team_name text NOT NULL UNIQUE,
  team_emails text[] NOT NULL CHECK (array_length(team_emails, 1) >= 1 AND array_length(team_emails, 1) <= 4),
  
  -- Constraints
  CONSTRAINT valid_team_size CHECK (array_length(team_emails, 1) BETWEEN 1 AND 4)
);

-- Hackathon Submissions Table
CREATE TABLE submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Team Reference
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  
  -- Project Links
  github_link text NOT NULL,
  live_demo_link text NOT NULL,
  twitter_post_link text NOT NULL,
  
  -- Metadata
  submitted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Constraints
  CONSTRAINT valid_github_url CHECK (github_link ~* '^https?://github\.com/.+'),
  CONSTRAINT valid_twitter_url CHECK (twitter_post_link ~* '^https?://(twitter\.com|x\.com)/.+'),
  CONSTRAINT unique_team_submission UNIQUE(team_id)
);

-- Add RLS (Row Level Security)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for teams
CREATE POLICY "Anyone can register teams" ON teams
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read teams" ON teams
  FOR SELECT USING (true);

-- Create policies for submissions
CREATE POLICY "Anyone can submit" ON submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read submissions" ON submissions
  FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX idx_teams_created_at ON teams(created_at DESC);
CREATE INDEX idx_teams_name ON teams(team_name);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX idx_submissions_team_id ON submissions(team_id);