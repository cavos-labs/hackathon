'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center">
          <div className="flex gap-6 font-mono text-sm">
            <Link 
              href="/"
              className={`hover:opacity-70 transition-opacity ${
                pathname === '/' ? 'border-b border-current' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              href="/teams"
              className={`hover:opacity-70 transition-opacity ${
                pathname === '/teams' ? 'border-b border-current' : ''
              }`}
            >
              View Teams
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}