"use client"

import Logo from "@/components/Logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/ThemeContext"
import { Menu, Moon, Sun, X } from "lucide-react"
import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import { useState } from "react"

interface HeaderProps {
  session: Session | null
}

export default function Header({ session }: HeaderProps) {
  const { theme, toggleTheme, mounted } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Logo showText={true} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="p-2"
              disabled={!mounted}
            >
              {mounted && theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* User Info */}
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {session?.user?.name}
              </span>
            </div>

            {/* Sign Out Button */}
            <Button
              onClick={() => signOut()}
              variant="outline"
              size="sm"
              className="border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Sign out
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 px-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={session?.user?.image || ""} />
                  <AvatarFallback>
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                  {session?.user?.name}
                </span>
              </div>

              {/* Mobile Actions */}
              <div className="space-y-2">
                <Button
                  onClick={toggleTheme}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-2"
                  disabled={!mounted}
                >
                  {mounted && theme === 'dark' ? (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      Dark Mode
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start px-2 border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
