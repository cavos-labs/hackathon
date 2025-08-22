# AEGIS-v1 Minihackathon

A hackathon submission website for the AEGIS-v1 minihackathon competition.

## Features

- Landing page with hackathon details
- Project submission form with team registration (1-4 members)
- Theme toggle (black/white)
- Supabase integration for storing submissions
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

## Database Schema

The application uses a single `submissions` table with the following structure:

- `id` (uuid, primary key)
- `created_at` (timestamp)
- `team_name` (text)
- `team_emails` (text array, 1-4 emails)
- `github_link` (text, must be GitHub URL)
- `live_demo_link` (text)
- `twitter_post_link` (text, must be Twitter/X URL)
- `submitted_at` (timestamp)

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