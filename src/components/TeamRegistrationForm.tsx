'use client'

import { useState, FormEvent } from 'react'
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'

export function TeamRegistrationForm({ onClose, onSuccess }: { 
  onClose: () => void
  onSuccess?: () => void 
}) {
  const [teamName, setTeamName] = useState('')
  const [teamEmails, setTeamEmails] = useState([''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const addTeamMember = () => {
    if (teamEmails.length < 4) {
      setTeamEmails([...teamEmails, ''])
    }
  }

  const removeTeamMember = (index: number) => {
    if (teamEmails.length > 1) {
      setTeamEmails(teamEmails.filter((_, i) => i !== index))
    }
  }

  const updateEmail = (index: number, email: string) => {
    const newEmails = [...teamEmails]
    newEmails[index] = email
    setTeamEmails(newEmails)
  }

  const validateForm = () => {
    if (!teamName.trim()) return 'Team name is required'
    if (teamEmails.some(email => !email.trim())) return 'All team member emails are required'
    
    const validEmails = teamEmails.every(email => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email.trim())
    })
    if (!validEmails) return 'Please enter valid email addresses'
    
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
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_name: teamName.trim(),
          team_emails: teamEmails.map(email => email.trim()),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register team')
      }

      setSubmitMessage('Team registered successfully!')
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 1500)
    } catch (error) {
      console.error('Error registering team:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error registering team. Please try again.'
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
            <h2 className="text-xl font-bold">Register Your Team</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-current hover:text-background rounded transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Team Name *
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-3 py-2 border border-current bg-transparent rounded focus:outline-none focus:ring-1 focus:ring-current"
                placeholder="Enter your team name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Team Members (1-4 emails) *
              </label>
              {teamEmails.map((email, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-current bg-transparent rounded focus:outline-none focus:ring-1 focus:ring-current"
                    placeholder={`Member ${index + 1} email`}
                    required
                  />
                  {teamEmails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="px-2 py-2 border border-current rounded hover:bg-current hover:text-background transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {teamEmails.length < 4 && (
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="flex items-center gap-1 px-3 py-1 border border-current rounded hover:bg-current hover:text-background transition-colors text-sm"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Member
                </button>
              )}
            </div>

            {submitMessage && (
              <div className={`p-3 rounded text-sm ${
                submitMessage.includes('successfully') 
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
              {isSubmitting ? 'Registering...' : 'Register Team'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}