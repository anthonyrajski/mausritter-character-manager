import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from '@/components/auth/LogoutButton'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-[#f5f0e8] rounded-lg shadow-2xl sketch-border border-gray-800 p-8 md:p-12 text-center">
          {/* Mouse emoji header */}
          <div className="text-8xl mb-6">🐭</div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            MausRitter
          </h1>
          <h2 className="text-2xl md:text-3xl text-gray-700 mb-8">
            Character Manager
          </h2>

          <p className="text-lg text-gray-800 mb-8 max-w-2xl mx-auto">
            Create, manage, and track your brave mouse adventurers in this
            digital character sheet manager for the MausRitter RPG.
          </p>

          {user ? (
            // Authenticated user view
            <div className="space-y-4">
              <p className="text-gray-700 mb-6">
                Welcome back, <span className="font-semibold">{user.email}</span>!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/characters"
                  className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-lg shadow-lg transition-colors"
                >
                  View My Characters
                </Link>
                <LogoutButton className="px-8 py-4 text-lg shadow-lg" />
              </div>
            </div>
          ) : (
            // Unauthenticated user view
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/auth/login"
                  className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-lg shadow-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-8 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold text-lg shadow-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
              <p className="text-sm text-gray-700 mt-6">
                Create a free account to start managing your characters
              </p>
            </div>
          )}

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-gray-100 sketch-border border-gray-700 rounded-lg p-6">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Complete Sheets
              </h3>
              <p className="text-gray-800 text-sm">
                Track all character stats, inventory, and equipment with
                easy-to-use inline editing.
              </p>
            </div>
            <div className="bg-gray-100 sketch-border border-gray-700 rounded-lg p-6">
              <div className="text-4xl mb-3">💾</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Auto-Save
              </h3>
              <p className="text-gray-800 text-sm">
                All changes are automatically saved to the cloud. Never lose
                your progress.
              </p>
            </div>
            <div className="bg-gray-100 sketch-border border-gray-700 rounded-lg p-6">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Beautiful Design
              </h3>
              <p className="text-gray-800 text-sm">
                Enjoy a parchment-style interface that captures the charm of
                the game.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
