import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('Environment check (teams):', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseServiceKey,
    urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'undefined'
  })

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables. Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// POST - Register a new team
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const body = await request.json()
    
    const { team_name, team_emails } = body

    // Validate required fields
    if (!team_name || !team_emails) {
      return NextResponse.json(
        { error: 'Team name and team emails are required' },
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

    // Insert team into database
    const { data, error } = await supabase
      .from('teams')
      .insert({
        team_name: team_name.trim(),
        team_emails: team_emails.map((email: string) => email.trim()),
      })
      .select()

    if (error) {
      console.error('Supabase error (teams):', error)
      
      // Handle unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Team name already exists. Please choose a different name.' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to register team. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Team registered successfully!', data },
      { status: 201 }
    )

  } catch (error) {
    console.error('API error (teams):', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

// GET - List all registered teams
export async function GET() {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('teams')
      .select('id, team_name, team_emails, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error (teams):', error)
      return NextResponse.json(
        { error: 'Failed to fetch teams' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })

  } catch (error) {
    console.error('API error (teams):', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}