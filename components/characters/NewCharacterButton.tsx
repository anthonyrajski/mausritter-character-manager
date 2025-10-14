'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface NewCharacterButtonProps {
  userId: string
}

export function NewCharacterButton({ userId }: NewCharacterButtonProps) {
  const [creating, setCreating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleCreateCharacter = async () => {
    setCreating(true)

    try {
      // Create a new character with default values
      const { data, error } = await supabase
        .from('characters')
        .insert({
          user_id: userId,
          name: 'New Character',
          background: null,
          birthsign: null,
          coat: null,
          look: null,
          portrait_url: null,
          strength_current: 8,
          strength_max: 8,
          dexterity_current: 8,
          dexterity_max: 8,
          will_current: 8,
          will_max: 8,
          hp_current: 6,
          hp_max: 6,
          level: 1,
          pips: 0,
          grit: 0,
          inventory: [],
          banked_items: null,
          banked_pips: 0,
          ignored_conditions: [],
        })
        .select('id')
        .single()

      if (error) throw error

      // Navigate to the new character's page
      router.push(`/characters/${data.id}`)
    } catch (error) {
      console.error('Error creating character:', error)
      alert('Failed to create character. Please try again.')
      setCreating(false)
    }
  }

  return (
    <button
      onClick={handleCreateCharacter}
      disabled={creating}
      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg font-semibold shadow-lg transition-colors flex items-center gap-2"
    >
      {creating ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Creating...
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          New Character
        </>
      )}
    </button>
  )
}
