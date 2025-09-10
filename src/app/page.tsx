"use client"

import ChatInterface from "@/components/ChatInterface"
import Header from "@/components/Header"
import LandingPage from "@/components/LandingPage"
import { Button } from "@/components/ui/button"
import { signIn, useSession } from "next-auth/react"
import Image from "next/image"

export default function Home() {
  const { data: session, status } = useSession()

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header session={session} />

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          <ChatInterface />
          <LandingPage />
        </div>
      </main>
    </div>
  )
}
