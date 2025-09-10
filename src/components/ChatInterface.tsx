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
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">AI Chat Interface</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            Enter your prompt:
          </label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me anything..."
            rows={4}
            disabled={loading}
          />
        </div>
        
        <Button type="submit" disabled={loading || !prompt.trim()}>
          {loading ? 'Generating...' : 'Send'}
        </Button>
      </form>

      {response && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Response:</h3>
          <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}
    </div>
  )
}