'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function ChatInterface() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()
      
      if (res.ok) {
        setResponse(data.response)
      } else {
        setResponse(`Error: ${data.error}`)
      }
    } catch (error) {
      setResponse('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
        AI Chat Interface
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="prompt" 
            className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
          >
            Enter your prompt:
          </label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me anything..."
            rows={4}
            disabled={loading}
            className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={loading || !prompt.trim()}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
        >
          {loading ? 'Generating...' : 'Send'}
        </Button>
      </form>

      {response && (
        <div className="mt-6">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            Response:
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg whitespace-pre-wrap text-gray-900 dark:text-gray-100 text-sm sm:text-base overflow-x-auto">
            {response}
          </div>
        </div>
      )}
    </div>
  )
}