"use client"

import LandingPage from "@/components/LandingPage"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <Image src="/logos/logo-web.png" alt="Pile Hive Logo"
              width={192} height={192}
              className="mx-auto"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Welcome!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to start organizing your documents into piles
            </p>
          </div>
          <div>
            <Button
              onClick={() => signIn("google")}
              className="w-full bg-stone-700 hover:bg-stone-600 text-white"
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
    <div className="min-h-screen">
      {/* User Menu - Fixed in top right */}
      <div className="fixed top-4 right-4 z-40 flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={session.user?.image || ""} />
            <AvatarFallback className="text-xs">
              {session.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {session.user?.name}
          </span>
        </div>
        <Button
          onClick={() => signOut()}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900"
        >
          Sign out
        </Button>
      </div>

      <LandingPage />
    </div>
  )
}
