'use client'

import { useState, FormEvent, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface Team {
  id: string
  team_name: string
  team_emails: string[]
  created_at: string
}

export function SubmissionForm({ onClose }: { onClose: () => void }) {
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [teams, setTeams] = useState<Team[]>([])
  const [githubLink, setGithubLink] = useState('')
  const [liveDemoLink, setLiveDemoLink] = useState('')
  const [twitterPostLink, setTwitterPostLink] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingTeams, setIsLoadingTeams] = useState(true)
  const [submitMessage, setSubmitMessage] = useState('')

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
        console.error('Failed to fetch teams:', data.error)
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setIsLoadingTeams(false)
    }
  }

  const validateForm = () => {
    if (!selectedTeamId) return 'Please select a team'
    if (!githubLink.trim()) return 'GitHub link is required'
    if (!liveDemoLink.trim()) return 'Live demo link is required'
    if (!twitterPostLink.trim()) return 'Twitter/X post link is required'
    
    if (!githubLink.includes('github.com')) return 'Please enter a valid GitHub URL'
    if (!(twitterPostLink.includes('twitter.com') || twitterPostLink.includes('x.com'))) {
      return 'Please enter a valid Twitter/X URL'
    }
    
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setSubmitMessage(validationError)
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_id: selectedTeamId,
          github_link: githubLink.trim(),
          live_demo_link: liveDemoLink.trim(),
          twitter_post_link: twitterPostLink.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit')
      }

      setSubmitMessage('Submission successful! Good luck in the hackathon!')
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error submitting:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error submitting. Please try again.'
      setSubmitMessage(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background border border-current rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto font-mono">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Submit Your Project</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-current hover:text-background rounded transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {isLoadingTeams ? (
            <div className="flex justify-center py-8">
              <div className="text-sm">Loading teams...</div>
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm mb-4">No teams registered yet.</p>
              <p className="text-sm text-gray-500">Register a team first before submitting a project.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Your Team *
                </label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full px-3 py-2 border border-current bg-background rounded focus:outline-none focus:ring-1 focus:ring-current"
                  required
                >
                  <option value="">Choose a team...</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.team_name} ({team.team_emails.length} member{team.team_emails.length !== 1 ? 's' : ''})
                    </option>
                  ))}
                </select>
                {selectedTeamId && (
                  <div className="mt-2 text-xs text-gray-500">
                    Members: {teams.find(t => t.id === selectedTeamId)?.team_emails.join(', ')}
                  </div>
                )}
              </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                GitHub Repository Link *
              </label>
              <input
                type="url"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                className="w-full px-3 py-2 border border-current bg-transparent rounded focus:outline-none focus:ring-1 focus:ring-current"
                placeholder="https://github.com/..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Live Demo Link *
              </label>
              <input
                type="url"
                value={liveDemoLink}
                onChange={(e) => setLiveDemoLink(e.target.value)}
                className="w-full px-3 py-2 border border-current bg-transparent rounded focus:outline-none focus:ring-1 focus:ring-current"
                placeholder="https://..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Twitter/X Post Link *
              </label>
              <input
                type="url"
                value={twitterPostLink}
                onChange={(e) => setTwitterPostLink(e.target.value)}
                className="w-full px-3 py-2 border border-current bg-transparent rounded focus:outline-none focus:ring-1 focus:ring-current"
                placeholder="https://twitter.com/... or https://x.com/..."
                required
              />
            </div>

            {submitMessage && (
              <div className={`p-3 rounded text-sm ${
                submitMessage.includes('successful') 
                  ? 'border border-green-500 text-green-500' 
                  : 'border border-red-500 text-red-500'
              }`}>
                {submitMessage}
              </div>
            )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-foreground text-background rounded hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Project'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}