import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('Environment check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseServiceKey,
    urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'undefined'
  })

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables. Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function POST(request: NextRequest) {
  try {
    // Get Supabase client (this will throw if env vars are missing)
    const supabase = getSupabaseClient()
    
    const body = await request.json()
    
    const { team_name, team_emails, github_link, live_demo_link, twitter_post_link } = body

    // Validate required fields
    if (!team_name || !team_emails || !github_link || !live_demo_link || !twitter_post_link) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate team size
    if (!Array.isArray(team_emails) || team_emails.length < 1 || team_emails.length > 4) {
      return NextResponse.json(
        { error: 'Team must have 1-4 members' },
        { status: 400 }
      )
    }

    // Validate email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const invalidEmails = team_emails.filter((email: string) => !emailRegex.test(email))
    if (invalidEmails.length > 0) {
      return NextResponse.json(
        { error: 'Invalid email format(s)' },
        { status: 400 }
      )
    }

    // Validate GitHub URL
    if (!github_link.includes('github.com')) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL' },
        { status: 400 }
      )
    }

    // Validate Twitter/X URL
    if (!(twitter_post_link.includes('twitter.com') || twitter_post_link.includes('x.com'))) {
      return NextResponse.json(
        { error: 'Invalid Twitter/X URL' },
        { status: 400 }
      )
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        team_name: team_name.trim(),
        team_emails: team_emails.map((email: string) => email.trim()),
        github_link: github_link.trim(),
        live_demo_link: live_demo_link.trim(),
        twitter_post_link: twitter_post_link.trim(),
      })
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to submit. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Submission successful!', data },
      { status: 201 }
    )

  } catch (error) {
    console.error('API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Submissions API endpoint' },
    { status: 200 }
  )
}