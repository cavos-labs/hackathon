# AEGIS-v1 Minihackathon

A hackathon submission website for the AEGIS-v1 minihackathon competition.

## Features

- Landing page with hackathon details
- **Two-step process**: Team registration → Project submission
- Team management system with 1-4 members per team
- Project submission form with team dropdown selection
- Theme toggle (black/white)
- Secure server-side API with Supabase integration
- Responsive design with custom fonts

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment file and configure Supabase:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase URL and service role key:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

3. Set up Supabase database:
   - Create a new Supabase project
   - Run the SQL from `supabase-schema.sql` in the Supabase SQL editor
   - The service role key can be found in your Supabase project settings under API

4. Start the development server:
   ```bash
   npm run dev
   ```

## Security

This application uses server-side API routes to securely handle Supabase operations. Sensitive credentials are never exposed to the client-side code.

## How It Works

1. **Team Registration**: Teams register first with their name and member emails (1-4 members)
2. **Project Submission**: Teams select their registered team from a dropdown and submit their project links
3. **One Submission Per Team**: Each team can only submit one project (enforced by database constraint)

## Database Schema

The application uses two main tables:

### Teams Table
- `id` (uuid, primary key)
- `team_name` (text, unique)
- `team_emails` (text array, 1-4 emails)
- `created_at` (timestamp)

### Submissions Table
- `id` (uuid, primary key)
- `team_id` (uuid, foreign key to teams)
- `github_link` (text, must be GitHub URL)
- `live_demo_link` (text)
- `twitter_post_link` (text, must be Twitter/X URL)
- `created_at` (timestamp)
- `submitted_at` (timestamp)

**Note**: Each team can only submit one project (unique constraint on team_id).

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS v4
- Supabase
- Custom fonts: RomaGothic and JetBrains Mono

## Hackathon Details

- **Timeline**: August 25 - September 1, 2025
- **Prize**: $1000 for the winner
- **Requirements**: Build games, consumer apps, or social apps using AEGIS-v1
- **Deployment**: Must deploy on Starknet mainnet
- **Winning Criteria**: App with the most users/transactions wins