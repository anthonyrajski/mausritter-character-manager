'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface LogoutButtonProps {
  className?: string
}

export function LogoutButton({ className = '' }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    setLoading(true)

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Redirect to home page after logout
      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('Logout error:', err)
      alert('Failed to log out. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-semibold transition-colors ${className}`}
    >
      {loading ? 'Logging Out...' : 'Log Out'}
    </button>
  )
}
