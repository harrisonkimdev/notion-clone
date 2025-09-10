"use client"

import { useState, useCallback } from "react"

interface PostFormState {
  title: string
  content: string
  isPreview: boolean
}

interface UsePostFormReturn {
  state: PostFormState
  setTitle: (title: string) => void
  setContent: (content: string) => void
  togglePreview: () => void
  resetForm: () => void
}

const initialState: PostFormState = {
  title: "",
  content: "",
  isPreview: false
}

export function usePostForm(): UsePostFormReturn {
  const [state, setState] = useState<PostFormState>(initialState)

  const setTitle = useCallback((title: string) => {
    setState(prev => ({ ...prev, title }))
  }, [])

  const setContent = useCallback((content: string) => {
    setState(prev => ({ ...prev, content }))
  }, [])

  const togglePreview = useCallback(() => {
    setState(prev => ({ ...prev, isPreview: !prev.isPreview }))
  }, [])

  const resetForm = useCallback(() => {
    setState(initialState)
  }, [])

  return {
    state,
    setTitle,
    setContent,
    togglePreview,
    resetForm
  }
}