"use client"

import { Button } from "@/components/ui/button"
import { signIn, useSession } from "next-auth/react"
import Image from "next/image"
import { useState } from "react"

export default function Home() {
  const { data: session, status } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    
    // Intelligent detection: AI prompt vs file search
    const isAIPrompt = detectAIPrompt(searchQuery)
    
    if (isAIPrompt) {
      await handleAIPrompt(searchQuery)
    } else {
      await handleFileSearch(searchQuery)
    }
    
    setIsSearching(false)
  }

  const detectAIPrompt = (query: string): boolean => {
    const aiIndicators = [
      'help', 'how', 'what', 'why', 'when', 'where', 'explain', 'create', 
      'generate', 'write', 'make', 'build', 'fix', 'debug', 'refactor',
      'implement', 'add', 'remove', 'update', 'modify', 'change'
    ]
    
    const lowercaseQuery = query.toLowerCase()
    return aiIndicators.some(indicator => 
      lowercaseQuery.includes(indicator) || 
      lowercaseQuery.endsWith('?') ||
      lowercaseQuery.split(' ').length > 3
    )
  }

  const handleAIPrompt = async (prompt: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()
      
      if (response.ok) {
        // Show AI response (you can customize this UI)
        alert(`AI Response: ${data.response}`)
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('AI request failed:', error)
      alert('Failed to get AI response')
    }
  }

  const handleFileSearch = async (query: string) => {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()
      
      if (response.ok) {
        // Show search results (you can customize this UI)
        const results = data.results
        if (results.length > 0) {
          const resultList = results.map((r: any) => 
            `${r.filename} (${r.matches.length} matches)`
          ).join('\n')
          alert(`Found ${results.length} files:\n${resultList}`)
        } else {
          alert('No files found matching your search.')
        }
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Search request failed:', error)
      alert('Failed to search files')
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <div className="max-w-md w-full space-y-6 sm:space-y-8 p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="text-center">
            <Image src="/logos/logo-web.png" alt="Pile Hive Logo"
              width={192} height={192}
              className="mx-auto"
            />
            <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Welcome!
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to start organizing your documents into piles
            </p>
          </div>
          <div>
            <Button
              onClick={() => signIn("google")}
              className="w-full bg-stone-700 hover:bg-stone-600 dark:bg-stone-600 dark:hover:bg-stone-500 text-white"
              size="lg"
            >
              Sign in with Google
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo */}
        <div className="mb-8">
          <Image 
            src="/logos/logo-web.png" 
            alt="Pile Hive" 
            width={272} 
            height={92}
            className="mx-auto"
          />
        </div>

        {/* Search Box */}
        <div className="w-full max-w-2xl mb-8">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Search files or ask AI anything..."
                disabled={isSearching}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                {isSearching ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-white"></div>
                ) : (
                  <>
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Voice search"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                        <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
                        <path d="M12 18v4"/>
                        <path d="M8 22h8"/>
                      </svg>
                    </button>
                    <button
                      type="submit"
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="m19 19-3.5-3.5"/>
                        <circle cx="11" cy="11" r="8"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Search Buttons */}
        <div className="flex space-x-4 mb-8">
          <Button
            onClick={() => handleSearch({ preventDefault: () => {} } as React.FormEvent)}
            disabled={!searchQuery.trim() || isSearching}
            variant="outline"
            className="px-6 py-2 text-sm"
          >
            Search Files
          </Button>
          <Button
            onClick={() => handleAIPrompt(searchQuery)}
            disabled={!searchQuery.trim() || isSearching}
            variant="outline"
            className="px-6 py-2 text-sm"
          >
            Ask AI
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">Try searching for:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSearchQuery("Show me all documents")}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              "Show me all documents"
            </button>
            <button
              onClick={() => setSearchQuery("Create a new document")}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              "Create a new document"
            </button>
            <button
              onClick={() => setSearchQuery("README.md")}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              "README.md"
            </button>
          </div>
        </div>

        {/* User info */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {session.user?.name}
            </span>
            <Image
              src={session.user?.image || '/default-avatar.png'}
              alt="User avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
