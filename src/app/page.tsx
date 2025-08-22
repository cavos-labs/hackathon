'use client'

import { useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Navigation } from '@/components/Navigation'
import { SubmissionForm } from '@/components/SubmissionForm'
import { TeamRegistrationForm } from '@/components/TeamRegistrationForm'

function HomePage() {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [showTeamRegistration, setShowTeamRegistration] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <ThemeToggle />
      <Navigation />
      
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-30 mt-10 tracking-tight">
          AEGIS-v1
        </h1>
        <h2 className="text-6xl md:text-8xl mb-30 tracking-wide">
          &lt; MINIHACKATHON /&gt;
        </h2>
        
        <p className="text-lg md:text-xl mb-12 font-mono">
          Winner gets $1000
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowTeamRegistration(true)}
            className="font-mono px-8 py-4 border border-foreground text-foreground rounded-lg text-lg hover:bg-foreground hover:text-background transition-colors font-medium"
          >
            Register Team
          </button>
          <button
            onClick={() => setShowSubmissionForm(true)}
            className="font-mono px-8 py-4 bg-foreground text-background rounded-lg text-lg hover:opacity-80 transition-opacity font-medium"
          >
            Submit Project
          </button>
        </div>
      </section>
      
      {/* Details Section */}
      <section className="px-4 py-16 max-w-4xl mx-auto">
        <div className="space-y-8 font-mono text-sm md:text-base">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-2">Timeline:</h3>
              <p>Start: August 25, 2025</p>
              <p>End: September 1, 2025</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">Build:</h3>
              <p>Games, consumer apps, social apps</p>
              <p>Using AEGIS-v1</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">Requirements:</h3>
            <ul className="space-y-1 list-disc list-inside">
              <li>Deploy on Starknet mainnet</li>
              <li>Upload your app announcement in an X post</li>
              <li>Submit GitHub repo and live demo</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">Winning Criteria:</h3>
            <p>The app with the most users/transactions wins</p>
          </div>
        </div>
      </section>
      
      {showTeamRegistration && (
        <TeamRegistrationForm 
          onClose={() => setShowTeamRegistration(false)}
          onSuccess={() => {
            // Optionally refresh team list or show success message
          }}
        />
      )}
      
      {showSubmissionForm && (
        <SubmissionForm onClose={() => setShowSubmissionForm(false)} />
      )}
    </div>
  )
}

export default function Home() {
  return <HomePage />
}
