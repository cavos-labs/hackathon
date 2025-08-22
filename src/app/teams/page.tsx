'use client'

import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Navigation } from '@/components/Navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface Team {
  id: string
  team_name: string
  team_emails: string[]
  created_at: string
}

function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      const data = await response.json()
      
      if (response.ok) {
        setTeams(data.data || [])
      } else {
        setError(data.error || 'Failed to fetch teams')
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
      setError('Failed to load teams')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ThemeToggle />
      <Navigation />
      
      {/* Header */}
      <header className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm font-mono hover:opacity-70 transition-opacity mb-6"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight font-mono">
              Registered Teams
            </h1>
            <p className="font-mono text-sm">
              {teams.length} team{teams.length !== 1 ? 's' : ''} registered
            </p>
          </div>
        </div>
      </header>

      {/* Teams List */}
      <main className="flex-1 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="font-mono">Loading teams...</div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="font-mono text-red-500">{error}</div>
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-16">
              <div className="font-mono text-lg mb-4">No teams registered yet</div>
              <Link 
                href="/"
                className="font-mono text-sm border border-current px-4 py-2 rounded hover:bg-current hover:text-background transition-colors"
              >
                Register First Team
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {teams.map((team, index) => (
                <div 
                  key={team.id}
                  className="border border-current rounded-lg p-6 font-mono"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-lg">{team.team_name}</h2>
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-sm font-medium">
                      Members ({team.team_emails.length}):
                    </div>
                    <div className="space-y-1">
                      {team.team_emails.map((email, i) => (
                        <div key={i} className="text-xs text-gray-600 break-all">
                          {email}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 pt-2 border-t border-current">
                    Registered: {formatDate(team.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function Teams() {
  return <TeamsPage />
}